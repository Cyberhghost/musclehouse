import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { calculateShipping } from '@/lib/shipping';
import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  freeShipping: z.boolean().optional(),
});

const orderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(9),
  address: z.string().min(1),
  wilaya: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const where = status ? { status: status as 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' } : {};

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { items, ...orderData } = parsed.data;

  const shippingFee = await calculateShipping(
    orderData.wilaya,
    items.map(i => ({ price: i.price, quantity: i.quantity, freeShipping: i.freeShipping ?? false }))
  );

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + shippingFee;

  const order = await prisma.order.create({
    data: {
      ...orderData,
      totalAmount,
      items: {
        create: items.map(({ freeShipping: _, ...item }) => item),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
