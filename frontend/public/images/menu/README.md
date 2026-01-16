# Menu Dropdown Images (NEW UPLOAD PATH)

This folder is the **new** upload path for your **navbar dropdown / mega menu images**.

## Folder location

`frontend/public/images/menu/`

## What you can upload here

### 1) Dropdown header image (big image at top of dropdown)

Put this file inside each category folder:

- `header.jpg` (or `header.png` / `header.jpeg`)

Example:

```
frontend/public/images/menu/
├── skincare/
│   └── header.png
├── makeup/
│   └── header.jpg
├── hair/
│   └── header.jpg
├── fragrance/
│   └── header.jpg
└── body/
    └── header.jpg
```

### 2) Dropdown right-side banner image (tall image on the right)

Put this file inside each category folder:

- `banner.jpg` (or `banner.png` / `banner.jpeg`)

Example:

```
frontend/public/images/menu/makeup/
├── header.jpg
└── banner.png
```

### 3) Optional: Category tile image (used in some dropdown layouts)

Put this file inside each category folder:

- `tile.jpg` (or `tile.png` / `tile.jpeg`)

### 2) Optional: Subcategory tile images inside the dropdown (square tiles)

If you want custom images per subcategory tile inside the dropdown, upload:

- `{sub-slug}.jpg` (or `.png` / `.jpeg`)

Example:

```
frontend/public/images/menu/makeup/
├── header.jpg
├── lips.jpg
├── face.jpg
└── eyes-brows.png
```

## Notes

- The site is configured to **prefer this new path first**.
- If an image isn’t found here yet, it will automatically fall back to the older path:
  `frontend/public/assets/images/menu/`

