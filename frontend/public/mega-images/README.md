# Mega Menu Images (NEW UPLOAD PATH)

This is the **new** upload folder you requested for **mega menu / dropdown images**.

## Folder location

`frontend/public/mega-images/`

## Folder structure + filenames

Create one folder per category slug:

- `skincare`
- `makeup`
- `hair`
- `fragrance`
- `body`

Inside each category folder you can upload:

### 1) Dropdown header image (wide image at top of dropdown)

- `header.jpg` (or `header.png` / `header.jpeg`)

### 2) Dropdown right-side banner (tall image on the right)

- `banner.jpg` (or `banner.png` / `banner.jpeg`)

### 3) Optional category tile (used by some dropdown layouts)

- `tile.jpg` (or `tile.png` / `tile.jpeg`)

### 4) Optional subcategory tile images (square tiles inside dropdown)

- `{sub-slug}.jpg` (or `.png` / `.jpeg`)

Example:

```
frontend/public/mega-images/makeup/
├── header.png
├── banner.png
├── tile.png
├── lips.png
└── eyes-brows.jpg
```

## Important

- The site will now **prefer** `/mega-images/...` first.
- If a file isn’t there yet, it will automatically fall back to:
  - `/images/menu/...` (previous path)
  - `/assets/images/menu/...` (older path)

