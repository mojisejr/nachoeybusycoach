import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // Use current date in YYYY-MM-DD format
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
  token: process.env.SANITY_API_TOKEN, // Optional: for authenticated requests
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Type definitions for Sanity documents
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Helper function to fetch documents
export async function fetchDocuments<T extends SanityDocument>(
  query: string,
  params?: Record<string, any>
): Promise<T[]> {
  try {
    return await client.fetch(query, params)
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

// Helper function to create documents
export async function createDocument(
  document: { _type: string; [key: string]: any }
): Promise<SanityDocument> {
  try {
    return await client.create(document)
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

// Helper function to update documents
export async function updateDocument(
  id: string,
  updates: Record<string, any>
): Promise<SanityDocument> {
  try {
    return await client.patch(id).set(updates).commit()
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// Helper function to delete documents
export async function deleteDocument(id: string): Promise<void> {
  try {
    await client.delete(id)
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

export default client