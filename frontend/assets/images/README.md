# Image Structure and AI Generation Workflow

This directory contains the image structure for the Cloud Luxury Beauty e-commerce site. All images should be generated using AI image tools and placed in the exact folder structure defined below.

## Directory Structure

```
assets/images/
├── products/
│   ├── skincare/
│   │   ├── cleansers/
│   │   │   ├── product-slug-1.jpg
│   │   │   ├── product-slug-2.jpg
│   │   │   └── ...
│   │   ├── serums-treatments/
│   │   ├── moisturizers/
│   │   └── ...
│   ├── makeup/
│   │   ├── complexion-face/
│   │   ├── lips/
│   │   ├── eyes/
│   │   └── ...
│   ├── hair/
│   ├── fragrance/
│   ├── body/
│   └── ...
├── ads/
│   ├── skincare/
│   │   ├── serums-treatments/
│   │   │   ├── ad-1.jpg
│   │   │   ├── ad-2.jpg
│   │   │   └── ...
│   │   └── ad-1.jpg (category-level ads)
│   ├── makeup/
│   └── ...
└── menu/
    ├── skincare/
    │   ├── tile.jpg (200x200px, square)
    │   └── banner.jpg (610x660px, vertical)
    ├── makeup/
    ├── hair/
    └── ...
```

## Image Specifications

### Product Images
- **Format**: JPG
- **Aspect Ratio**: 1:1 (square)
- **Recommended Size**: 800x800px minimum, 1200x1200px optimal
- **Style**: Clean, editorial product photography on white or soft gradient background
- **Naming**: Use product slug (e.g., `water-bank-aqua-facial-serum.jpg`)

### Menu Tile Images
- **Format**: JPG
- **Aspect Ratio**: 1:1 (square)
- **Size**: 200x200px (display size)
- **Style**: Category showcase, multiple products arranged elegantly
- **Naming**: Always `tile.jpg` in each category folder

### Menu Banner Images
- **Format**: JPG
- **Aspect Ratio**: ~1.08:1 (610x660px)
- **Size**: 610x660px (display size)
- **Style**: Featured category products, promotional style
- **Naming**: Always `banner.jpg` in each category folder

### Ad Banner Images
- **Format**: JPG
- **Aspect Ratio**: 16:9 (horizontal)
- **Recommended Size**: 1920x1080px
- **Style**: Promotional collage, vibrant, eye-catching
- **Naming**: `ad-1.jpg`, `ad-2.jpg`, etc.

## AI Prompt Guidelines

### Product Images
Use the `getProductImagePrompt()` function in `frontend/src/utils/imagePaths.ts` to generate prompts. Example:

**Prompt Template:**
```
Luxury [product type] in [container type], [brand] brand aesthetic, clean editorial product photography, soft gradient background in neutral beige and cream tones, professional studio lighting, minimalist composition, high-end beauty product shot, white background option, product centered, premium quality
```

### Menu Tiles
**Prompt Template:**
```
[Category theme] products arranged elegantly, [subcategory] category, clean editorial style, soft pastel background, luxury beauty aesthetic, minimalist composition, square format, professional product photography
```

### Ad Banners
**Prompt Template:**
```
[Category theme], [headline], promotional banner style, vibrant colors, collage of products, luxury beauty aesthetic, horizontal format, eye-catching composition, professional beauty photography
```

## Image Generation Workflow

1. **Parse Product Data**: Use the CSV parser to extract all products
2. **Generate Prompts**: Use utility functions in `imagePaths.ts` to generate AI prompts
3. **Batch Generate**: Use your AI image tool to generate all images
4. **Organize**: Place images in the exact folder structure above
5. **Verify**: Ensure all paths match the structure defined in the code

## Notes

- All image paths are defined in `frontend/src/utils/imagePaths.ts`
- Product images fall back to Sephora URLs if local images don't exist
- Menu and ad images use placeholder paths that must be populated
- Image generation can be done incrementally - start with high-traffic categories
