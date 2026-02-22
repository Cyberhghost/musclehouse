import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  // Verify webhook secret if configured
  const webhookSecret = process.env.DELIVERY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const authHeader = req.headers.get('authorization');
    const providedSecret = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (providedSecret !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const body = await req.json();
  const { reference, tracking_number, status } = body as {
    reference?: string;
    tracking_number?: string;
    status?: string;
  };

  if (!reference) return NextResponse.json({ error: 'Missing reference' }, { status: 400 });

  const statusMap: Record<string, string> = {
    shipped: 'shipped',
    out_for_delivery: 'out_for_delivery',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };

  const updateData: Record<string, unknown> = {};
  if (tracking_number) updateData.trackingNumber = tracking_number;
  if (status && statusMap[status]) updateData.status = statusMap[status];

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ message: 'No updates' });
  }

  await prisma.order.update({ where: { id: reference }, data: updateData });
  return NextResponse.json({ success: true });
}
