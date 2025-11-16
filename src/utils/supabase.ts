import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SBClient {
  private supabase: SupabaseClient

  constructor( url: string, anon_key: string) {
    this.supabase = createClient(url, anon_key)
  }

  public getInstance(): SupabaseClient {
    return this.supabase
  }
}

// Global Supabase client instance
let globalSupabaseClient: SupabaseClient | null = null

/**
 * Initialize the global Supabase client
 * @param url - Supabase URL
 * @param anonKey - Supabase anonymous key
 */
export function initialize(url: string, anonKey: string): SupabaseClient {
  if (!globalSupabaseClient) {
    globalSupabaseClient = createClient(url, anonKey)
  }
  return globalSupabaseClient
}

/**
 * Get the global Supabase client instance
 * @throws Error if client hasn't been initialized
 */
export function getInstance(): SupabaseClient {
  if (!globalSupabaseClient) {
    throw new Error('Supabase client not initialized. Call initializeSupabase() first.')
  }
  return globalSupabaseClient
}

/**
 * Check if the Supabase client has been initialized
 */
  export function isInitialized(): boolean {
  return globalSupabaseClient !== null
}
