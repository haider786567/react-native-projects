import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Link, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '../constants/theme';
import { Haptics } from '../utils/haptics';

import geotagImg from "../../assets/images/geotag_illustration.png";
import scannerImg from "../../assets/images/scanner_illustration.png";
import syncImg from "../../assets/images/sync_illustration.png";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'GeoTag Camera',
    subtitle: 'Capture geographic records instantly. Stamp precise location, latitude, longitude, and custom overlays directly on your field photos.',
    image: geotagImg,
    icon: 'camera-outline' as const,
  },
  {
    id: 2,
    title: 'Document Scanner',
    subtitle: 'Scan physical papers to high-fidelity files. Crop dynamically with smart edge detection and apply clean location watermarks.',
    image: scannerImg,
    icon: 'document-text-outline' as const,
  },
  {
    id: 3,
    title: 'Secure Cloud Sync',
    subtitle: 'Keep your scans and location logs backed up automatically. Access and share your documents securely anytime, anywhere.',
    image: syncImg,
    icon: 'cloud-done-outline' as const,
  },
];

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  activeSlide: number;
  paginationBg: string;
};

// standalone component to respect Hook rules (no hooks in loops)
function OnboardingDot({ index, scrollX, activeSlide, paginationBg }: DotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const width = interpolate(scrollX.value, inputRange, [8, 20, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    const backgroundColor = index === activeSlide ? '#006767' : paginationBg;
    return {
      width,
      opacity,
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={dotStyle}
      className="h-2 rounded-full z-10"
    />
  );
}

export default function OnboardingScreen() {
  const isAuthenticated = useAppSelector((state) => state?.auth?.isAuthenticated ?? false);
  const { theme } = useTheme();

  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    scrollX.value = contentOffset;
    const page = Math.round(contentOffset / SCREEN_WIDTH);
    if (page !== activeSlide && page >= 0 && page < SLIDES.length) {
      setActiveSlide(page);
      Haptics.selectionAsync();
    }
  };

  // Theme adaptations
  const isDark = theme === 'dark';
  const c = {
    bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    btnSec: isDark ? 'bg-slate-900 border border-white/5 active:bg-slate-800' : 'bg-white border border-slate-200 active:bg-slate-50',
    btnSecText: isDark ? 'text-teal-400' : 'text-[#006767]',
    paginationBg: isDark ? '#334155' : '#e2e8f0',
    headerTeal: isDark ? 'text-teal-400' : 'text-[#006767]',
    brandBg: isDark ? 'bg-slate-900/90' : 'bg-white/90',
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className={c.bg}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* ── Top Illustrative Photo Carousel ── */}
      <View className="flex-[2.5] bg-slate-900 rounded-b-[36px] overflow-hidden relative justify-center">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          className="w-full h-full"
        >
          {SLIDES.map((slide) => (
            <View key={slide.id} style={{ width: SCREEN_WIDTH }} className="h-full relative">
              <Image
                source={slide.image}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                transition={400}
              />
              {/* Overlay shadow for text contrast & visual depth */}
              <View className="absolute inset-0 bg-black/35" />
            </View>
          ))}
        </ScrollView>

        {/* Brand floating logo */}
        <View className={`absolute left-6 top-6 flex-row items-center gap-1.5 rounded-full px-3.5 py-1.5 shadow z-10 ${c.brandBg}`}>
          <View className="h-4.5 w-4.5 items-center justify-center rounded bg-[#006767]">
            <Ionicons color="white" name="locate" size={10} />
          </View>
          <Text className={`text-[10px] font-black uppercase tracking-[2px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Buildrigs
          </Text>
        </View>

        {/* Carousel Pagination dots absolute overlay */}
        <View className="absolute bottom-5 left-0 right-0 flex-row justify-center items-center gap-2">
          {SLIDES.map((_, index) => (
            <OnboardingDot
              key={index}
              index={index}
              scrollX={scrollX}
              activeSlide={activeSlide}
              paginationBg={c.paginationBg}
            />
          ))}
        </View>
      </View>

      {/* ── Middle Slide Text Block ── */}
      <View className="flex-[1.5] justify-center px-6 pt-6">
        <View className="flex-row items-center gap-2">
          <Ionicons color={isDark ? '#2dd4bf' : '#006767'} name={SLIDES[activeSlide].icon} size={22} />
          <Text className={`text-[28px] font-black tracking-tight ${c.text}`}>
            {SLIDES[activeSlide].title}
          </Text>
        </View>
        <Text className={`mt-3 text-sm leading-6 font-medium ${c.textMuted}`}>
          {SLIDES[activeSlide].subtitle}
        </Text>
      </View>

      {/* ── Bottom Normal Buttons ── */}
      <View className="gap-3 px-6 pb-6 pt-2">
        <Link href="/register" asChild>
          <TouchableOpacity 
            className="items-center rounded-xl bg-[#006767] py-4 shadow-sm shadow-[#006767]/20 active:opacity-90"
            onPress={() => Haptics.impactAsync()}
          >
            <Text className="text-base font-bold text-white uppercase tracking-wider">Get started</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/login" asChild>
          <TouchableOpacity 
            className={`items-center rounded-xl py-4 shadow-sm ${c.btnSec}`}
            onPress={() => Haptics.impactAsync()}
          >
            <Text className={`text-base font-bold uppercase tracking-wider ${c.btnSecText}`}>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
    </SafeAreaView>
  );
}
