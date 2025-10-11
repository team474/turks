// app/api/header/route.ts
import { NextResponse } from 'next/server';
import { getMetaObject } from '@/lib/shopify';

export async function GET() {
  try {
    const header = await getMetaObject("strains-list", "landing_page_section_headers");
    return NextResponse.json({ header });
  } catch (error) {
    console.error('Error fetching header:', error);
    return NextResponse.json(
      { error: 'Failed to fetch header' },
      { status: 500 }
    );
  }
}