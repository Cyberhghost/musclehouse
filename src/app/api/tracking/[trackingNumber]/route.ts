import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ trackingNumber: string }> }) {
  const { trackingNumber } = await params;
  const order = await prisma.order.findFirst({
    where: { trackingNumber },
    select: {
      id: true,
      status: true,
      trackingNumber: true,
      customerName: true,
      wilaya: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}
