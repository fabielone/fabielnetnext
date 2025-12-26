// src/app/api/check-business-name/route.js

import { NextResponse } from 'next/server';

// State abbreviation to full name mapping
const STATE_NAMES = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming'
};

// Reserved words that cannot be used in LLC names (varies by state, this is a general list)
const RESERVED_WORDS = [
  'bank', 'banking', 'trust', 'trustee', 'insurance', 'assurance',
  'federal', 'national', 'united states', 'olympic', 'postal'
];

// Mock existing business names database (in production, this would query state databases)
const MOCK_EXISTING_NAMES = {
  // General names that might conflict across states
  'general': [
    'tech solutions',
    'global consulting',
    'innovative designs',
    'advanced systems',
    'professional services',
    'creative agency',
    'digital marketing',
    'premier construction',
    'elite services',
    'american enterprises'
  ]
};

export async function POST(request) {
  console.log('=== Business Name Check API Called ===');
  
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

    if (!state) {
      return NextResponse.json(
        { error: 'State is required' },
        { status: 400 }
      );
    }

    const stateCode = state.toUpperCase();
    const stateName = STATE_NAMES[stateCode];

    if (!stateName) {
      return NextResponse.json(
        { error: 'Invalid state code' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Normalize the business name
    const normalizedName = name.toLowerCase()
      .replace(/llc|l\.l\.c\.|limited liability company/gi, '')
      .replace(/inc|incorporated|corp|corporation/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    console.log('Normalized name:', normalizedName);

    // Check for reserved words
    const foundReservedWord = RESERVED_WORDS.find(word => 
      normalizedName.includes(word.toLowerCase())
    );

    if (foundReservedWord) {
      return NextResponse.json({
        available: false,
        restricted: true,
        message: `The word "${foundReservedWord}" is restricted and typically requires special approval in ${stateName}.`,
        suggestions: [
          name.replace(new RegExp(foundReservedWord, 'gi'), 'Solutions'),
          name.replace(new RegExp(foundReservedWord, 'gi'), 'Services'),
          name.replace(new RegExp(foundReservedWord, 'gi'), 'Group')
        ].filter(s => s !== name)
      });
    }

    // Get existing names to check against
    const existingNames = MOCK_EXISTING_NAMES['general'] || [];

    // Check for exact match
    const isExactMatch = existingNames.includes(normalizedName);
    
    if (isExactMatch) {
      return NextResponse.json({
        available: false,
        exact: true,
        message: `This name is already registered in ${stateName}.`,
        suggestions: [
          `${name} Group`,
          `${name} Partners`,
          `${name} ${stateName}`,
          `New ${name}`,
          `${name} Holdings`
        ]
      });
    }

    // Check for similar names (partial word match)
    const similarNames = existingNames.filter(existing => {
      const words = normalizedName.split(' ');
      return words.some(word => word.length > 3 && existing.includes(word));
    });

    if (similarNames.length > 0) {
      return NextResponse.json({
        available: true, // Available but with caution
        similar: similarNames,
        caution: true,
        message: `This name is likely available in ${stateName}, but similar names exist. Final availability will be confirmed during filing.`,
        suggestions: [
          `${name} Co`,
          `${name} Ventures`,
          `Elite ${name}`,
          `Premier ${name}`,
          `${name} Solutions`
        ]
      });
    }

    // Name appears to be available
    return NextResponse.json({
      available: true,
      message: `This name appears to be available in ${stateName}! Final availability will be confirmed during the filing process.`,
      state: stateCode,
      stateName: stateName
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
    supportedStates: Object.keys(STATE_NAMES),
    timestamp: new Date().toISOString()
  });
}