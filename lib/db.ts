import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  vendorName?: string;
}

// 1. Fetch products directly from Supabase
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }
  return data
}

// 2. Insert new product directly into Supabase
export async function addProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image: product.image
      }
    ])
    .select()

  if (error) {
    console.error('Error adding product:', error.message)
    throw error
  }

  return data ? data[0] : null
}
