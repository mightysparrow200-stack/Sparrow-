'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client' // Adjust path to your Supabase client

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const filePath = `uploads/${Date.now()}_${file.name}`

    // Upload directly to your Supabase Storage bucket (e.g., 'images')
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    setUploading(false)

    if (error) {
      alert('Upload failed: ' + error.message)
    } else {
      alert('Upload successful!')
    }
  }

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleUpload} 
      disabled={uploading} 
    />
  )
}
