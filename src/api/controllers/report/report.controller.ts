import { type Request, type Response } from "express";
import { Report } from "../../../models";
import { resHandler } from "../../../utils";

async function createReport(req: Request, res: Response) {
  try {
    const newreport = await Report.create({
      reportType: req.params.type,
      user: req.user._id,
      ...req.body,
    });
    res.status(200).json(newreport);
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function viewReportedPosts(req: Request, res: Response) {
  try {
    const reports = await Report.find({ reportType: req.params.type });
    return res.status(200).json({ reports });
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

export { createReport, viewReportedPosts };
