# 🖼️ Hero Image Generation (GPT)

Use this guide to generate a polished hero image with GPT image models and replace the current banner.

## Goal

Create a wide repository hero image for `README.md` that visually communicates:

- fast HTTP shortcut execution
- browser extension context
- reliable/debuggable workflow

## Recommended Prompt

```text
Create a clean, modern open-source project hero banner for a Chrome extension called "My HTTP Shortcuts".

Style:
- professional but friendly
- high contrast, readable on GitHub light and dark themes
- color palette: deep navy, teal, cyan, subtle amber accents
- no clutter, no tiny unreadable text

Composition:
- 1600x420 wide header
- left side: title "My HTTP Shortcuts" and subtitle "Fast browser HTTP actions with safe hooks and debug-ready history"
- right side: abstract browser + network/request motifs (cards, arrows, endpoint nodes, status chips)
- include subtle icons/symbols for API requests, clipboard copy, and history

Constraints:
- avoid brand/logo infringement
- avoid photorealistic people
- avoid dense paragraphs
- keep visual hierarchy clear

Output:
- one high-quality PNG asset sized 1600x420
```

## Replacement Steps

1. Generate the image and export as `hero-banner.png`.
2. Save it in `docs/assets/hero-banner.png`.
3. Update README hero line to:

```md
![My HTTP Shortcuts Hero](docs/assets/hero-banner.png)
```

4. Keep `docs/assets/hero-banner.svg` as fallback if desired.

## Quick Validation

- Open README on GitHub and confirm image renders correctly.
- Verify text remains legible on light and dark backgrounds.
- Ensure file size is reasonable for fast repository load.
