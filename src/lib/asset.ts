// src/lib/asset.ts
export const assetUrl = (path: string) =>
  new URL(path, import.meta.env.BASE_URL).toString();
