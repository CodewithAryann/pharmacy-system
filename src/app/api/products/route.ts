import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        productName: body.productName,
        ndc: body.ndc,
        supplierName: body.supplierName,
        quantity: Number(body.quantity),
        store: body.store,
        total: Number(body.total),
        productGroup: body.productGroup,
        startingInvDate: body.startingInvDate ? new Date(body.startingInvDate) : null,
        endingInvDate: body.endingInvDate ? new Date(body.endingInvDate) : null,
        dispensed: Number(body.dispensed) || 0,
        storage: Number(body.storage) || 0,
        overage: Number(body.overage) || 0,
        return: Number(body.return) || 0,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
