// lib/content.server.ts
'use server'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function getPost(locale: string, slug: string) {
  const filePath = path.join(process.cwd(), 'content', 'blog', locale, `${slug}.mdx`)
  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    return matter(fileContent)
  } catch {
    return null
  }
}

export async function getAllPostSlugs(locale: string) {
  const postsDir = path.join(process.cwd(), 'content', 'blog', locale)
  try {
    const postFiles = await fs.readdir(postsDir)
    return postFiles
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}