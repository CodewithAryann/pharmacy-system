import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

interface ProductUpdateBody {
  productName: string;
  ndc: string;
  supplierName: string;
  quantity: number;
  store: string;
  total: number;
  productGroup: string;
  dispensed: number;
  storage: number;
  overage: number;
  return: number;
}

interface Params {
  id: string;
}

// GET /api/products/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const token = getTokenFromRequest(req);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (err: unknown) {
    console.error('Fetch product error:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = token ? verifyToken(token) : null;
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    const body: ProductUpdateBody = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: { ...body },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (err: unknown) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = token ? verifyToken(token) : null;
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err: unknown) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
