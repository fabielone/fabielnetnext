import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch categories and tags used by public businesses
export async function GET() {
  try {
    // Get all businesses with public listing data
    const businesses = await prisma.business.findMany({
      where: {
        OR: [
          { isPublicListed: true },
          { publicCategory: { not: null } },
          { publicTags: { isEmpty: false } },
        ]
      },
      select: {
        publicCategory: true,
        publicTags: true,
      },
    })

    // Extract unique categories
    const categories = Array.from(
      new Set(
        businesses
          .map(b => b.publicCategory)
          .filter((c): c is string => c !== null && c.trim() !== '')
      )
    ).sort()

    // Extract unique tags
    const tags = Array.from(
      new Set(
        businesses
          .flatMap(b => b.publicTags)
          .filter((t): t is string => t !== null && t.trim() !== '')
      )
    ).sort()

    // Default categories to suggest if none exist
    const defaultCategories = [
      'Tecnología',
      'Alimentación',
      'Retail',
      'Servicios',
      'Salud',
      'Educación',
      'Finanzas',
      'Construcción',
      'Transporte',
      'Entretenimiento',
      'Consultoría',
      'Marketing',
      'Legal',
      'Inmobiliaria',
      'Manufactura',
      'Otro'
    ]

    // Merge default categories with existing ones
    const allCategories = Array.from(
      new Set([...defaultCategories, ...categories])
    ).sort()

    return NextResponse.json({
      categories: allCategories,
      tags,
    })
  } catch (error) {
    console.error('Error fetching listing options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    )
  }
}
