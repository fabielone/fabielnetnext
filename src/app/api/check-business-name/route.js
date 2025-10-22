// src/app/api/check-business-name/route.js

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  console.log('=== API CALLED ===');
  
  try {
    const body = await request.json();
    const { name, state, entityType } = body;
    
    console.log('Received data:', { name, state, entityType });

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock existing names database
    const existingNames = [
      'tech solutions',
      'global consulting',
      'innovative designs',
      'advanced systems',
      'professional services',
      'creative agency'
    ];

    const normalizedName = name.toLowerCase()
      .replace(/llc|limited liability company/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    console.log('Normalized name:', normalizedName);

    // Check for exact match
    const isExactMatch = existingNames.includes(normalizedName);
    
    if (isExactMatch) {
      return NextResponse.json({
        available: false,
        exact: true,
        message: 'This name is already taken',
        suggestions: [
          `${name} Group`,
          `${name} Partners`,
          `${name} Enterprises`,
          `New ${name}`,
          `${name} Holdings`
        ]
      });
    }

    // Check for similar names
    const similarNames = existingNames.filter(existing => {
      const words = normalizedName.split(' ');
      return words.some(word => word.length > 2 && existing.includes(word));
    });

    if (similarNames.length > 0) {
      return NextResponse.json({
        available: false,
        similar: true,
        similarNames,
        message: 'Similar names found',
        suggestions: [
          `${name} Co`,
          `${name} Ventures`,
          `Elite ${name}`,
          `Premier ${name}`,
          `${name} Solutions`
        ]
      });
    }

    return NextResponse.json({
      available: true,
      message: 'Name appears to be available!'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Business name API is working!',
    method: 'GET',
    timestamp: new Date().toISOString()
  });
}