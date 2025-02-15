import { NextResponse } from 'next/server';
import affinitiesData from '@/data/Affinities.json';

export async function GET() {
  return NextResponse.json(affinitiesData);
}