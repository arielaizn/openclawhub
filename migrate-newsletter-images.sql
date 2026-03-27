-- Create newsletter-images storage bucket (public read for email clients)
INSERT INTO storage.buckets (id, name, public)
VALUES ('newsletter-images', 'newsletter-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload newsletter images
CREATE POLICY "Auth users can upload newsletter images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'newsletter-images'
);

-- Allow public to read newsletter images (so email clients can load them)
CREATE POLICY "Public can read newsletter images"
ON storage.objects FOR SELECT
USING (bucket_id = 'newsletter-images');

-- Allow authenticated users to delete newsletter images
CREATE POLICY "Auth users can delete newsletter images"
ON storage.objects FOR DELETE
USING (bucket_id = 'newsletter-images');
