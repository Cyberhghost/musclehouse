import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
  customerName: z.string().min(1).optional(),
  phone: z.string().min(9).optional(),
  address: z.string().min(1).optional(),
  wilaya: z.string().min(1).optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']).optional(),
  trackingNumber: z.string().optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: parsed.data,
    include: { items: true },
  });
  return NextResponse.json(order);
}
