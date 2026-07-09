import type { Request, Response } from "express";
import { ScanModel } from "../../models/scan.model.js";

/**
 * Get all scans for the authenticated user.
 */
export const getScans = async (req: Request, res: Response) => {
  try {
    const scans = await ScanModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(scans);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch scans";
    return res.status(500).json({ message });
  }
};

/**
 * Create a new scan.
 */
export const createScan = async (req: Request, res: Response) => {
  try {
    const { type, title, filePath, coords, placeName, capturedAt } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: "Type and Title are required" });
    }

    const scan = await ScanModel.create({
      userId: req.user.id,
      type,
      title,
      filePath,
      coords,
      placeName,
      capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
    });

    return res.status(201).json(scan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create scan";
    return res.status(500).json({ message });
  }
};

/**
 * Get aggregated statistics for the dashboard.
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Total documents (PDF scans)
    const pdfCount = await ScanModel.countDocuments({ userId, type: "pdf" });

    // Total locations (Geo scans)
    const geoCount = await ScanModel.countDocuments({ userId, type: "geo" });

    // Scans this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCount = await ScanModel.countDocuments({
      userId,
      createdAt: { $gte: oneWeekAgo },
    });

    // Dummy value for storage size simulation
    const totalScans = pdfCount + geoCount;
    const simulatedStorage = `${(totalScans * 0.12).toFixed(1)} MB`;

    return res.status(200).json({
      totalScans,
      pdfCount,
      geoCount,
      thisWeekCount,
      storageSize: simulatedStorage,
      syncedCount: totalScans, // Backend scans are always synced
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return res.status(500).json({ message });
  }
};
