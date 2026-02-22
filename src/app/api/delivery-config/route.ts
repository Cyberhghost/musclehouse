import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const apiUrl = await prisma.settings.findUnique({ where: { key: 'deliveryApiUrl' } });
  const apiKey = await prisma.settings.findUnique({ where: { key: 'deliveryApiKey' } });
  return NextResponse.json({
    apiUrl: apiUrl?.value || '',
    apiKey: apiKey?.value ? '***' : '',
  });
}

export async function PUT(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { apiUrl, apiKey } = await req.json();

  if (apiUrl !== undefined) {
    await prisma.settings.upsert({
      where: { key: 'deliveryApiUrl' },
      update: { value: apiUrl },
      create: { key: 'deliveryApiUrl', value: apiUrl },
    });
  }
  if (apiKey !== undefined && apiKey !== '***') {
    await prisma.settings.upsert({
      where: { key: 'deliveryApiKey' },
      update: { value: apiKey },
      create: { key: 'deliveryApiKey', value: apiKey },
    });
  }
  return NextResponse.json({ success: true });
}
