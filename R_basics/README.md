# React Native & NativeWind Basics - Expo SDK 54

This guide covers the installation and setup of Expo SDK 54 with NativeWind, along with the basics of React Native and NativeWind.

## 📋 Table of Contents

- [Installation](#installation)
- [NativeWind Setup](#nativewind-setup)
- [React Native Basics](#react-native-basics)
- [NativeWind Basics](#nativewind-basics)
- [Project Structure](#project-structure)

---

## 🔧 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Step 1: Create a New Expo Project

```bash
# Using npm
npx create-expo-app@latest R_basics

# Using yarn
yarn create expo-app R_basics

# Using pnpm
pnpm create expo-app R_basics
```

### Step 2: Select Expo SDK 54

When prompted, select the latest stable version (Expo SDK 54).

### Step 3: Navigate to Project Directory

```bash
cd R_basics
```

### Step 4: Install Dependencies

```bash
# Install core dependencies (if not already installed)
npm install

# Start the development server
npx expo start
```

---

## 🎨 NativeWind Setup

NativeWind is a utility-first CSS framework that lets you build beautiful user interfaces quickly.

### Step 1: Install NativeWind and Dependencies

```bash
# Install NativeWind v4 (works with Expo SDK 54)
npm install nativewind

# Install Tailwind CSS
npm install -D tailwindcss
npx tailwindcss init

# Install PostCSS for Tailwind CSS processing
npm install -D postcss postcss autoprefixer
```

### Step 2: Initialize Tailwind CSS

```bash
npx tailwindcss init
```

### Step 3: Configure `tailwind.config.js`

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 4: Update `babel.config.js`

NativeWind v4 requires Babel configuration. Update `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      // Required for NativeWind v4
      "nativewind/babel",
    ],
  };
};
```

### Step 5: Create `postcss.config.mjs`

The `postcss.config.mjs` file should already be created:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 6: Add Global CSS

Copy this content to `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 7: Import Global CSS

Import the global CSS in your entry file (`app/_layout.tsx` or `App.tsx`):

```tsx
import "../global.css";

export default function RootLayout() {
  return (
    // ... your layout
  );
}
```

### Step 8: Create NativeWind Type Definitions

Create `nativewind-env.d.ts`:

```ts
/// <reference types="nativewind/types" />
```

---

## 📱 React Native Basics

### Core Components

React Native provides the following core components out of the box:

#### 1. View

The most fundamental component for building a UI.

```tsx
import { View } from "react-native";

<View>
  <Text>Hello, World!</Text>
</View>
```

#### 2. Text

A component for displaying text.

```tsx
import { Text } from "react-native";

<Text style={{ fontSize: 16, fontWeight: "bold" }}>
  Hello, World!
</Text>
```

#### 3. Image

A component for displaying images.

```tsx
import { Image } from "react-native";

<Image
  source={{ uri: "https://example.com/image.png" }}
  style={{ width: 200, height: 200 }}
/>
```

#### 4. ScrollView

A generic scrollable container.

```tsx
import { ScrollView, Text, View } from "react-native";

<ScrollView>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</ScrollView>
```

#### 5. TouchableOpacity

A button-like component.

```tsx
import { TouchableOpacity, Text } from "react-native";

<TouchableOpacity onPress={() => console.log("Pressed!")}>
  <Text>Press Me</Text>
</TouchableOpacity>
```

#### 6. TextInput

A component for text input.

```tsx
import { TextInput } from "react-native";

<TextInput
  placeholder="Enter your name"
  value={text}
  onChangeText={setText}
/>
```

#### 7. FlatList

A performant interface for rendering simple, flat lists.

```tsx
import { FlatList, Text, View } from "react-native";

<FlatList
  data={[{id: '1', title: 'Item 1'}, {id: '2', title: 'Item 2'}]}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  keyExtractor={item => item.id}
/>
```

### Example: Simple Component

```tsx
import { View, Text, StyleSheet } from "react-native";

function Greeting({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
```

---

## 🎯 NativeWind Basics

### Utility Classes

NativeWind uses Tailwind CSS utility classes. Here are some commonly used ones:

### 1. Flexbox & Layout

```tsx
// Flex container
<View className="flex-row">      // flex-direction: row
<View className="flex-col">      // flex-direction: column
<View className="flex-1">        // flex: 1 (takes available space)

// Justify & Align
<View className="justify-center">     // justify-content: center
<View className="justify-between">    // justify-content: space-between
<View className="items-center">       // align-items: center

// Position
<View className="absolute">           // position: absolute
<View className="relative">           // position: relative
<View className="top-0">              // top: 0
```

### 2. Spacing (Padding & Margin)

```tsx
// Padding
<View className="p-4">        // padding: 16px
<View className="px-4">       // padding-left: 16px; padding-right: 16px
<View className="py-2">       // padding-top: 8px; padding-bottom: 8px
<View className="pt-2">       // padding-top: 8px

// Margin
<View className="m-4">        // margin: 16px
<View className="mx-auto">    // margin-left: auto; margin-right: auto (center)
<View className="my-2">       // margin-top: 8px; margin-bottom: 8px
```

### 3. Colors

```tsx
// Background & Text
<View className="bg-white">      // background-color: white
<View className="bg-gray-100">   // background-color: #f3f4f6
<Text className="text-black">    // color: black
<Text className="text-blue-500"> // color: #3b82f6

// Hex colors
<View className="bg-[#FF5733]">  // custom hex color
```

### 4. Typography

```tsx
// Font Size
<Text className="text-xs">    // 12px
<Text className="text-sm">    // 14px
<Text className="text-base">  // 16px
<Text className="text-lg">    // 18px
<Text className="text-xl">    // 20px
<Text className="text-2xl">   // 24px

// Font Weight
<Text className="font-normal">   // 400
<Text className="font-medium">   // 500
<Text className="font-semibold"> // 600
<Text className="font-bold">     // 700

// Text Alignment
<Text className="text-left">   // text-align: left
<Text className="text-center"> // text-align: center
<Text className="text-right">  // text-align: right
```

### 5. Borders

```tsx
// Border Width
<View className="border">       // border-width: 1px
<View className="border-2">     // border-width: 2px
<View className="border-t">     // border-top-width: 1px

// Border Color
<View className="border-gray-300">
<View className="border-blue-500">

// Border Radius
<View className="rounded">       // border-radius: 4px
<View className="rounded-lg">    // border-radius: 8px
<View className="rounded-full">  // border-radius: 9999px (circular)
```

### 6. Dimensions & Size

```tsx
// Width & Height
<View className="w-full">       // width: 100%
<View className="h-screen">     // height: 100vh (use with flex: 1 in RN)
<View className="w-10">         // width: 40px
<View className="h-10">         // height: 40px

// Max/Min Width & Height
<View className="max-w-md">     // max-width: 448px
<View className="min-h-[50px]"> // min-height: 50px (arbitrary value)
```

### 7. Display & Visibility

```tsx
<View className="flex">        // display: flex
<View className="hidden">      // display: none
<Text className="opacity-50"> // opacity: 0.5
```

### Complete Example Card Component

```tsx
import { View, Text, Image } from "react-native";

function Card({ title, description, image }: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <View className="bg-white rounded-xl shadow-lg overflow-hidden mx-4 my-2">
      <Image
        source={{ uri: image }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </Text>
        <Text className="text-gray-600 text-base leading-relaxed">
          {description}
        </Text>
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-sm text-gray-500">Available</Text>
          </View>
          <View className="bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-semibold">View More</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
```

---

## 📁 Project Structure

```
R_basics/
├── app/                    # Expo Router pages (if using router)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── assets/                # Static assets (images, fonts)
├── src/                   # Source code
│   ├── components/        # Reusable components
│   └── ...
├── .gitignore
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── global.css            # Global styles with Tailwind
├── metro.config.js       # Metro bundler config
├── nativewind-env.d.ts   # NativeWind TypeScript definitions
├── package.json          # Dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

---

## 🚀 Running Your App

### Start Development Server

```bash
npx expo start
```

### Run on Different Platforms

- **iOS**: Press `i` (requires macOS)
- **Android**: Press `a` (requires Android Studio)
- **Web**: Press `w`
- **Scan QR**: Scan the QR code with Expo Go app on your phone

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)

---

## 🤝 Contributing

Feel free to contribute by adding more examples or improving the documentation!

---

**Happy Coding! 🎉**

