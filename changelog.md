## 3.2.1

## New Features

- Reimplemented Shades filter

### Changes & Improvements

- Fixed the `browse.js` loader and search state issues that could break browsing.
- Removed redundant browse helper files after consolidating the logic.
- Fixed alignment issues on home screen

## 3.2.0

### Changes & Improvements

- Updated `LiOS-Open` to latest version.
- Updated `metadata` to follow the latest metadata schema.
- Simplified rendering
- Temprorily disbaled `about` window

## 3.1.0

- Removed duplicate color.
- Added support for 3 new color spaces (Using ColorJS);
  - sRGB
  - HSL
  - OKLCH
- Now `LiOS-Colors` fetches data directly from `LiOS-Colors-Data` to make sure color data is always up-to-date.

## 3.0.0 (Eastern Desert)


> Design update inspired by warm, mineral desert tones.

### New Features

- UI Overhaul
- landing page

### Changes & Improvements

- Full rewrite
- Removed all types of filter(cause they were inaccurate and will be added later)
- New and more advanced search mechanism
- Copy paste functionality for `hex` and `translucent colors` (sRGBA will be added later)
- More optimized than ever
