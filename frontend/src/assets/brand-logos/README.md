# Brand Logos SVG Folder

This folder is for SVG logo files for the moving brand banner on the homepage.

## How to Use:

1. **Upload your SVG files here** - Place your brand logo SVG files in this directory
   - Example: `ulta-beauty.svg`, `sephora.svg`, `cult-beauty.svg`, etc.

2. **Update BrandBanner.tsx** - After uploading SVGs, update the component to use them:
   ```tsx
   import ultaLogo from '../assets/brand-logos/ulta-beauty.svg';
   import sephoraLogo from '../assets/brand-logos/sephora.svg';
   // ... etc
   ```

3. **File Naming Convention:**
   - Use lowercase with hyphens: `brand-name.svg`
   - Examples: `ulta-beauty.svg`, `sephora.svg`, `cult-beauty.svg`

## Supported Brands:
- Ulta Beauty
- Sephora
- Cult Beauty
- Glossier
- Fenty Beauty
- Rare Beauty
- Drunk Elephant
- The Ordinary
- Kiehl's
- MAC Cosmetics
- NARS
- Urban Decay
- Too Faced
- Tarte
- Anastasia Beverly Hills

## Notes:
- SVG files should be optimized for web use
- Recommended size: 200-300px width
- Keep file sizes small for fast loading
- Use black/white or brand colors that work on light backgrounds
