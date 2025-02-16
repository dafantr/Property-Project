import { createClient } from "@supabase/supabase-js";

const bucket = "Property-Project";

// ✅ Ensure environment variables are correctly loaded
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

// ✅ Throw error if variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// ✅ Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (image: File) => {
  try {
    const timestamp = Date.now();
    const newName = `${timestamp}-${image.name}`;

    // ✅ Upload the image
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(newName, image, {
        cacheControl: "3600",
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw new Error("Image upload failed");
    }

    // ✅ Get the public URL
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(newName);

    if (!publicData) {
      throw new Error("Failed to retrieve public URL");
    }

    return publicData.publicUrl;
  } catch (err) {
    console.error("Upload Image Error:", err);
    throw err;
  }
};