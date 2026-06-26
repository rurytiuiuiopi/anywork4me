// Compress an uploaded image entirely in the browser and return a small JPEG
// data URL. This lets providers add a flyer with no image-storage backend —
// the result is stored inline with their listing. Keep the output modest so
// rows/responses stay light (migrate to object storage when scaling).

const MAX_DIM = 1400; // px, longest edge
const QUALITY = 0.72;

export async function fileToBannerDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("Couldn’t read that image.");
  });

  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing isn’t supported on this device.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
  // Second pass for very detailed images, so we stay well under request limits.
  if (dataUrl.length > 3_500_000) {
    dataUrl = canvas.toDataURL("image/jpeg", 0.55);
  }
  if (dataUrl.length > 3_500_000) {
    throw new Error("That image is too large — please try a smaller one.");
  }
  return dataUrl;
}
