export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          business_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          email: string | null
          stripe_customer_id: string | null
          subscription_status: 'trial' | 'active' | 'past_due' | 'canceled'
          trial_ends_at: string | null
          created_at: string
        }
        Insert: { id: string } & Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>>
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>>
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          notes: string | null
          created_at: string
        }
        Insert: { user_id: string; name: string } & Partial<Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'user_id' | 'name'>>
        Update: Partial<Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>>
        Relationships: []
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          number: string
          status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
          line_items: LineItem[]
          notes: string | null
          valid_until: string | null
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          created_at: string
          updated_at: string
        }
        Insert: { user_id: string; number: string } & Partial<Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at' | 'updated_at' | 'user_id' | 'number'>>
        Update: Partial<Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at'>>
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          quote_id: string | null
          number: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          line_items: LineItem[]
          notes: string | null
          due_date: string | null
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: { user_id: string; number: string } & Partial<Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at' | 'user_id' | 'number'>>
        Update: Partial<Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type LineItem = {
  id: string
  description: string
  quantity: number
  rate: number
  total: number
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Quote = Database['public']['Tables']['quotes']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']

export type QuoteStatus = Quote['status']
export type InvoiceStatus = Invoice['status']
