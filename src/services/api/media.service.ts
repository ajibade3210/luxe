const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export async function uploadBusinessLogo(
  _file?: File | Blob | string
): Promise<{ url: string; success: boolean }> {
  await delay(400);
  const cdnUrl =
    "https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png";
  return {
    url: cdnUrl,
    success: true,
  };
}

export async function uploadPortfolioImage(
  file?: File | Blob | string
): Promise<{ url: string; success: boolean }> {
  await delay(350);
  if (file && typeof window !== "undefined" && file instanceof File) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        resolve({ url: dataUrl, success: true });
      };
      reader.onerror = () => {
        resolve({
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
          success: true,
        });
      };
      reader.readAsDataURL(file);
    });
  }
  return {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    success: true,
  };
}
