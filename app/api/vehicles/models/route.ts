import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const makeId = req.nextUrl.searchParams.get("makeId");
  if (!makeId) return NextResponse.json([]);

  const models = await prisma.vehicleModel.findMany({
    where: { makeId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, yearStart: true, yearEnd: true },
  });
  return NextResponse.json(models);
}
