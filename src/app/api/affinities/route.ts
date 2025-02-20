// src/app/api/affinities/route.ts
import { NextResponse } from 'next/server';
import affinitiesData from '@/data';

export async function GET() {
  return NextResponse.json(affinitiesData);
}
