import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const STATUS_FLOW = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'] as const;

async function sendToDeliveryAPI(order: {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  wilaya: string;
  totalAmount: unknown;
}) {
  const apiUrl = process.env.DELIVERY_API_URL;
  const apiKey = process.env.DELIVERY_API_KEY;
  if (!apiUrl || !apiKey) return null;

  try {
    const res = await fetch(apiUrl + '/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: order.id,
        customer_name: order.customerName,
        phone: order.phone,
        address: order.address,
        wilaya: order.wilaya,
        amount: Number(order.totalAmount),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return (data.tracking_number as string | undefined) || (data.trackingNumber as string | undefined) || null;
    }
  } catch (err) {
    console.error('Delivery API error:', err);
  }
  return null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!(STATUS_FLOW as readonly string[]).includes(status) && status !== 'cancelled') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  let updateData: Record<string, unknown> = { status };

  if (status === 'confirmed') {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const trackingNumber = await sendToDeliveryAPI(order);
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
      updateData.status = 'shipped';
    }
  }

  const order = await prisma.order.update({ where: { id }, data: updateData, include: { items: true } });
  return NextResponse.json(order);
}
