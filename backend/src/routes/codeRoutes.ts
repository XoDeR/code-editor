import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../services/db";

const router = Router();

router.get("/shared/:sharedId", async (req: Request, res: Response) => {
  const { sharedId } = req.params;

  try {
    const where: any = { sharedId };

    if (sharedId !== undefined) where.sharedId = sharedId

    const code = await prisma.code.findUnique({
      where,
    });

    if (!code || !code.isPublic) {
      return res.status(404).json({ message: "Code not found or not shared" });
    }
    res.json(code);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch shared code", detail: error.message });
  }
});

export default router;