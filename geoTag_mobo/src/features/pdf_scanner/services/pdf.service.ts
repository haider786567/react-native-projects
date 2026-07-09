import { File, Directory, Paths } from 'expo-file-system';
import * as Print from 'expo-print';

import type { ScannedPage } from '../types/pdf.type';

/**
 * Read an image file as base64 data URI for embedding in HTML.
 */
async function imageToBase64DataUri(uri: string): Promise<string> {
	const file = new File(uri);
	const base64 = await file.base64();
	return `data:image/jpeg;base64,${base64}`;
}

/**
 * Format coordinates for watermark display.
 */
function formatCoord(value: number): string {
	return value.toFixed(4);
}

/**
 * Build watermark HTML for a single page.
 */
function buildWatermarkHtml(page: ScannedPage): string {
	const location = page.coords
		? `Lat ${formatCoord(page.coords.latitude)}  Lon ${formatCoord(page.coords.longitude)}`
		: 'Location unavailable';
	const place = page.placeName ?? (page.coords
		? `${formatCoord(page.coords.latitude)}, ${formatCoord(page.coords.longitude)}`
		: 'Unknown location');
	const accuracy = page.accuracy != null ? `±${page.accuracy.toFixed(0)} m` : '— m';

	return `
		<div style="
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(15, 23, 42, 0.88);
			padding: 14px 18px;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		">
			<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
				<div>
					<div style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: #a7f3d0; letter-spacing: 1px;">
						Captured by Buildrigs
					</div>
					<div style="font-size: 13px; font-weight: 800; color: white; margin-top: 3px;">
						${place}
					</div>
				</div>
				<div style="background: rgba(255,255,255,0.12); border-radius: 20px; padding: 4px 10px;">
					<span style="font-size: 10px; font-weight: 700; color: white;">${accuracy}</span>
				</div>
			</div>
			<div style="font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.85); margin-top: 4px;">
				📍 ${location}
			</div>
			<div style="font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.75); margin-top: 3px;">
				🕐 ${page.capturedAt}
			</div>
		</div>
	`;
}

/**
 * Generate a real PDF from scanned pages with watermarks.
 * Uses expo-print to convert HTML (with embedded base64 images) to PDF.
 * Returns the URI of the generated PDF file.
 */
export async function generatePdfFromPages(pages: ScannedPage[]): Promise<string> {
	if (pages.length === 0) {
		throw new Error('No pages to generate PDF from');
	}

	// Build HTML for all pages with embedded images + watermarks
	const pageHtmlParts: string[] = [];

	for (let i = 0; i < pages.length; i++) {
		const page = pages[i];
		const base64Image = await imageToBase64DataUri(page.uri);
		const watermarkHtml = buildWatermarkHtml(page);
		const pageBreak = i < pages.length - 1 ? 'page-break-after: always;' : '';

		pageHtmlParts.push(`
			<div style="
				position: relative;
				width: 100%;
				height: 100vh;
				overflow: hidden;
				${pageBreak}
			">
				<img src="${base64Image}" style="
					width: 100%;
					height: 100%;
					object-fit: cover;
				" />
				${watermarkHtml}
			</div>
		`);
	}

	const fullHtml = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				html, body { width: 100%; height: 100%; }
				@page { margin: 0; }
			</style>
		</head>
		<body>
			${pageHtmlParts.join('\n')}
		</body>
		</html>
	`;

	// Generate PDF file
	const result = await Print.printToFileAsync({
		html: fullHtml,
		width: 612,  // US Letter width in points
		height: 792, // US Letter height in points
		margins: { top: 0, right: 0, bottom: 0, left: 0 },
	});

	// Move generated PDF from cache to documents directory
	const scansDir = new Directory(Paths.document, 'scans');
	if (!scansDir.exists) {
		scansDir.create();
	}

	const timestamp = Date.now();
	const pdfFileName = `scan_${timestamp}.pdf`;
	const sourceFile = new File(result.uri);
	const destFile = new File(scansDir, pdfFileName);

	sourceFile.move(destFile);

	return destFile.uri;
}

/**
 * Generate a real PDF from already-captured watermarked image URIs.
 * Embeds each image as a full page in the PDF.
 */
export async function generatePdfFromImages(imageUris: string[]): Promise<string> {
	const pageHtmlParts: string[] = [];

	for (let i = 0; i < imageUris.length; i++) {
		const base64Image = await imageToBase64DataUri(imageUris[i]);
		const pageBreak = i < imageUris.length - 1 ? 'page-break-after: always;' : '';

		pageHtmlParts.push(`
			<div style="
				position: relative;
				width: 100%;
				height: 100vh;
				overflow: hidden;
				${pageBreak}
			">
				<img src="${base64Image}" style="
					width: 100%;
					height: 100%;
					object-fit: cover;
				" />
			</div>
		`);
	}

	const fullHtml = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8" />
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				html, body { width: 100%; height: 100%; }
				@page { margin: 0; }
			</style>
		</head>
		<body>
			${pageHtmlParts.join('\n')}
		</body>
		</html>
	`;

	const result = await Print.printToFileAsync({
		html: fullHtml,
		width: 612,
		height: 792,
		margins: { top: 0, right: 0, bottom: 0, left: 0 },
	});

	const scansDir = new Directory(Paths.document, 'scans');
	if (!scansDir.exists) {
		scansDir.create();
	}

	const timestamp = Date.now();
	const pdfFileName = `scan_${timestamp}.pdf`;
	const sourceFile = new File(result.uri);
	const destFile = new File(scansDir, pdfFileName);

	sourceFile.move(destFile);

	return destFile.uri;
}

/**
 * Get the list of all previously saved scan PDF files.
 */
export function getSavedScans(): string[] {
	const scansDir = new Directory(Paths.document, 'scans');
	if (!scansDir.exists) {
		return [];
	}

	return scansDir
		.list()
		.filter((item): item is File => item instanceof File && item.name.endsWith('.pdf'))
		.map((file) => file.uri);
}
