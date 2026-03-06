import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials missing. Image uploads will fail.");
}

export const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function uploadProductImage(fileBuffer: Buffer, fileName: string, contentType: string) {
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
