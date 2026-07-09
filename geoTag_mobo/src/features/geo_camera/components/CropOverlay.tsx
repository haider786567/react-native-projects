import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	Image,
	PanResponder,
	Pressable,
	Text,
	View,
} from 'react-native';

import type { CropRegion } from '../types/geoCamers.type';

type CropOverlayProps = {
	uri: string;
	isCropping: boolean;
	onApply: (region: CropRegion) => void;
	onCancel: () => void;
};

const HANDLE_HIT = 44;
const MIN_SIZE = 60;

const ASPECT_PRESETS = [
	{ label: 'Free', ratio: 0 },
	{ label: '1:1', ratio: 1 },
	{ label: '4:3', ratio: 4 / 3 },
	{ label: '16:9', ratio: 16 / 9 },
];

export function CropOverlay({ uri, isCropping, onApply, onCancel }: CropOverlayProps) {
	const screen = Dimensions.get('window');

	// Real image dimensions
	const [imgNatural, setImgNatural] = useState({ w: 1, h: 1 });
	// Container layout (the flex-1 area)
	const [container, setContainer] = useState({ x: 0, y: 0, w: screen.width, h: screen.height * 0.65 });
	// Computed image rect within container (after contain fitting)
	const [imgRect, setImgRect] = useState({ x: 0, y: 0, w: screen.width, h: screen.height * 0.65 });

	const [aspect, setAspect] = useState(ASPECT_PRESETS[0]);

	// Crop rect relative to imgRect origin
	const cropRef = useRef({ x: 20, y: 20, w: screen.width - 40, h: screen.height * 0.5 });
	const [crop, _setCrop] = useState(cropRef.current);
	const setCrop = useCallback((r: typeof cropRef.current) => {
		cropRef.current = r;
		_setCrop(r);
	}, []);

	// Container pageY offset for converting touch coords
	const containerPageY = useRef(0);

	// Compute image display rect when container or natural image size changes
	useEffect(() => {
		const { w: cw, h: ch } = container;
		const { w: nw, h: nh } = imgNatural;
		if (nw <= 0 || nh <= 0) return;

		const imgAspect = nw / nh;
		const containerAspect = cw / ch;

		let displayW: number;
		let displayH: number;
		if (imgAspect > containerAspect) {
			displayW = cw;
			displayH = cw / imgAspect;
		} else {
			displayH = ch;
			displayW = ch * imgAspect;
		}

		const offsetX = (cw - displayW) / 2;
		const offsetY = (ch - displayH) / 2;

		const newImgRect = { x: offsetX, y: offsetY, w: displayW, h: displayH };
		setImgRect(newImgRect);

		// Init crop to 80% centered within the image area
		const margin = 0.1;
		setCrop({
			x: displayW * margin,
			y: displayH * margin,
			w: displayW * (1 - 2 * margin),
			h: displayH * (1 - 2 * margin),
		});
	}, [container, imgNatural, setCrop]);

	// Clamp crop within image bounds
	const clamp = useCallback(
		(r: typeof cropRef.current): typeof cropRef.current => {
			let { x, y, w, h } = r;
			w = Math.max(MIN_SIZE, Math.min(w, imgRect.w));
			h = Math.max(MIN_SIZE, Math.min(h, imgRect.h));
			x = Math.max(0, Math.min(x, imgRect.w - w));
			y = Math.max(0, Math.min(y, imgRect.h - h));
			return { x, y, w, h };
		},
		[imgRect],
	);

	// Drag state stored in a ref so PanResponder always has fresh values
	const dragState = useRef<{
		kind: 'move' | 'tl' | 'tr' | 'bl' | 'br';
		startCrop: typeof cropRef.current;
	} | null>(null);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2,
			onPanResponderGrant: (evt) => {
				const px = evt.nativeEvent.pageX;
				const py = evt.nativeEvent.pageY;

				// Convert page coords to coords relative to image display rect
				const ix = px - imgRect.x;
				const iy = py - containerPageY.current - imgRect.y;

				const c = cropRef.current;
				const nearTL = Math.abs(ix - c.x) < HANDLE_HIT && Math.abs(iy - c.y) < HANDLE_HIT;
				const nearTR = Math.abs(ix - (c.x + c.w)) < HANDLE_HIT && Math.abs(iy - c.y) < HANDLE_HIT;
				const nearBL = Math.abs(ix - c.x) < HANDLE_HIT && Math.abs(iy - (c.y + c.h)) < HANDLE_HIT;
				const nearBR = Math.abs(ix - (c.x + c.w)) < HANDLE_HIT && Math.abs(iy - (c.y + c.h)) < HANDLE_HIT;

				let kind: 'move' | 'tl' | 'tr' | 'bl' | 'br' = 'move';
				if (nearTL) kind = 'tl';
				else if (nearTR) kind = 'tr';
				else if (nearBL) kind = 'bl';
				else if (nearBR) kind = 'br';

				dragState.current = { kind, startCrop: { ...c } };
			},
			onPanResponderMove: (_, g) => {
				const d = dragState.current;
				if (!d) return;
				const { kind, startCrop: s } = d;
				const dx = g.dx;
				const dy = g.dy;

				let next: typeof cropRef.current;
				switch (kind) {
					case 'move':
						next = { ...s, x: s.x + dx, y: s.y + dy };
						break;
					case 'tl':
						next = { x: s.x + dx, y: s.y + dy, w: s.w - dx, h: s.h - dy };
						break;
					case 'tr':
						next = { x: s.x, y: s.y + dy, w: s.w + dx, h: s.h - dy };
						break;
					case 'bl':
						next = { x: s.x + dx, y: s.y, w: s.w - dx, h: s.h + dy };
						break;
					case 'br':
						next = { x: s.x, y: s.y, w: s.w + dx, h: s.h + dy };
						break;
					default:
						return;
				}

				// Enforce aspect if locked
				if (aspect.ratio > 0 && kind !== 'move') {
					next.h = next.w / aspect.ratio;
				}

				setCrop(clamp(next));
			},
			onPanResponderRelease: () => {
				dragState.current = null;
			},
		}),
	).current;

	const handleApply = useCallback(() => {
		const c = cropRef.current;
		const scaleX = imgNatural.w / imgRect.w;
		const scaleY = imgNatural.h / imgRect.h;

		const region: CropRegion = {
			originX: Math.round(c.x * scaleX),
			originY: Math.round(c.y * scaleY),
			width: Math.round(c.w * scaleX),
			height: Math.round(c.h * scaleY),
		};
		onApply(region);
	}, [imgNatural, imgRect, onApply]);

	// Absolute position of the crop rect on screen (for rendering)
	const absLeft = imgRect.x + crop.x;
	const absTop = imgRect.y + crop.y;

	return (
		<View className="absolute inset-0 bg-black">
			{/* Image container */}
			<View
				className="flex-1"
				onLayout={(e) => {
					const { x, y, width, height } = e.nativeEvent.layout;
					setContainer({ x, y, w: width, h: height });
					// Measure page offset
					e.target?.measure?.((_x, _y, _w, _h, _px, pageY) => {
						containerPageY.current = pageY ?? y;
					});
				}}
			>
				<Image
					className="h-full w-full"
					resizeMode="contain"
					source={{ uri }}
					onLoad={() => {
						Image.getSize(uri, (w, h) => setImgNatural({ w, h }));
					}}
				/>

				{/* Touch layer */}
				<View className="absolute inset-0" {...panResponder.panHandlers}>
					{/* Top dim */}
					<View
						className="absolute left-0 right-0 top-0 bg-black/55"
						style={{ height: absTop }}
					/>
					{/* Bottom dim */}
					<View
						className="absolute bottom-0 left-0 right-0 bg-black/55"
						style={{ top: absTop + crop.h }}
					/>
					{/* Left dim */}
					<View
						className="absolute bg-black/55"
						style={{ top: absTop, left: 0, width: absLeft, height: crop.h }}
					/>
					{/* Right dim */}
					<View
						className="absolute bg-black/55"
						style={{ top: absTop, left: absLeft + crop.w, right: 0, height: crop.h }}
					/>

					{/* Crop border + grid */}
					<View
						className="absolute border-2 border-white"
						style={{ left: absLeft, top: absTop, width: crop.w, height: crop.h }}
					>
						{/* Rule of thirds */}
						<View className="absolute top-0 h-full w-px bg-white/25" style={{ left: '33%' }} />
						<View className="absolute top-0 h-full w-px bg-white/25" style={{ left: '66%' }} />
						<View className="absolute left-0 h-px w-full bg-white/25" style={{ top: '33%' }} />
						<View className="absolute left-0 h-px w-full bg-white/25" style={{ top: '66%' }} />
					</View>

					{/* ── Corner handles ── */}
					{/* TL */}
					<View
						className="absolute h-8 w-8 rounded-tl-lg border-l-[3px] border-t-[3px] border-emerald-400"
						style={{ left: absLeft - 3, top: absTop - 3 }}
					/>
					{/* TR */}
					<View
						className="absolute h-8 w-8 rounded-tr-lg border-r-[3px] border-t-[3px] border-emerald-400"
						style={{ left: absLeft + crop.w - 29, top: absTop - 3 }}
					/>
					{/* BL */}
					<View
						className="absolute h-8 w-8 rounded-bl-lg border-b-[3px] border-l-[3px] border-emerald-400"
						style={{ left: absLeft - 3, top: absTop + crop.h - 29 }}
					/>
					{/* BR */}
					<View
						className="absolute h-8 w-8 rounded-br-lg border-b-[3px] border-r-[3px] border-emerald-400"
						style={{ left: absLeft + crop.w - 29, top: absTop + crop.h - 29 }}
					/>

					{/* ── Edge mid-handles (thin bars for easier grabbing) ── */}
					{/* Top mid */}
					<View
						className="absolute h-1 w-10 rounded-full bg-white"
						style={{ left: absLeft + crop.w / 2 - 20, top: absTop - 1 }}
					/>
					{/* Bottom mid */}
					<View
						className="absolute h-1 w-10 rounded-full bg-white"
						style={{ left: absLeft + crop.w / 2 - 20, top: absTop + crop.h - 1 }}
					/>
					{/* Left mid */}
					<View
						className="absolute h-10 w-1 rounded-full bg-white"
						style={{ left: absLeft - 1, top: absTop + crop.h / 2 - 20 }}
					/>
					{/* Right mid */}
					<View
						className="absolute h-10 w-1 rounded-full bg-white"
						style={{ left: absLeft + crop.w - 1, top: absTop + crop.h / 2 - 20 }}
					/>

					{/* Size indicator */}
					<View
						className="absolute items-center justify-center rounded-full bg-slate-900/70 px-3 py-1"
						style={{ left: absLeft + crop.w / 2 - 36, top: absTop + crop.h / 2 - 12 }}
					>
						<Text className="text-[10px] font-bold text-white">
							{Math.round(crop.w)} × {Math.round(crop.h)}
						</Text>
					</View>
				</View>
			</View>

			{/* Aspect ratio bar */}
			<View className="flex-row items-center justify-center gap-2 bg-slate-950 px-4 py-3">
				{ASPECT_PRESETS.map((p) => {
					const active = aspect.label === p.label;
					return (
						<Pressable
							key={p.label}
							className={`rounded-full px-5 py-2.5 ${active ? 'bg-emerald-500' : 'bg-white/10'}`}
							onPress={() => setAspect(p)}
						>
							<Text className={`text-xs font-bold ${active ? 'text-white' : 'text-white/60'}`}>
								{p.label}
							</Text>
						</Pressable>
					);
				})}
			</View>

			{/* Action buttons */}
			<View className="flex-row items-center gap-3 bg-slate-950 px-4 pb-10 pt-2">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Cancel crop"
					className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 active:opacity-80"
					disabled={isCropping}
					onPress={onCancel}
				>
					<Ionicons color="white" name="close" size={18} />
					<Text className="text-base font-bold text-white">Cancel</Text>
				</Pressable>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Apply crop"
					className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-500 active:opacity-90"
					disabled={isCropping}
					onPress={handleApply}
				>
					{isCropping ? (
						<ActivityIndicator color="white" />
					) : (
						<>
							<Ionicons color="white" name="crop" size={18} />
							<Text className="text-base font-bold text-white">Apply Crop</Text>
						</>
					)}
				</Pressable>
			</View>
		</View>
	);
}
