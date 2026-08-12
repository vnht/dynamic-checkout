# Hello Clever brand reference

Source: [helloclever.co](https://helloclever.co/) (scraped Aug 2026)

## Logos (`public/brand/`)

| File | Use |
|------|-----|
| `hello-clever-logo.svg` | Wordmark + mark; wordmark uses `currentColor` |
| `hello-clever-logo-white.svg` | Dark / navy backgrounds |
| `hello-clever-logo-dark.svg` | Light backgrounds |
| `clever-icon-standard.svg` | Circular mark only (48×48, blue `#0063E2`) |
| `clever-icon.png` | App / favicon-style mark (500×500) |
| `favicon.ico` | Site favicon |
| `seo-thumbnail.webp` | Social / OG preview |

Mark: blue disc with cyan + white geometric “C” chevrons. Wordmark: lowercase **helloclever**, geometric sans.

## Typography

- **Primary UI / marketing font:** [Sora](https://fonts.google.com/specimen/Sora) (`Sora, sans-serif`)
- Headings ~ medium weight (500), body 400
- Line height often ~140%
- CTAs: `normal-case` (not all-caps), medium/semibold

## Color tokens (from site CSS)

### Pixel / product tokens
| Token | Hex | Role |
|-------|-----|------|
| `--pixel-primary` | `#004CC9` | Primary blue |
| `--pixel-secondary` | `#00CCFF` (`#0CF`) | Cyan accent / hover |
| `--pixel-ink-900` | `#1C1C1E` | Near-black text / dark CTA |
| `--pixel-ink-800` | `#353537` | Secondary text |
| `--pixel-ink-700` | `#4E4E50` | Muted text |
| `--pixel-ink-50` | `#F1F1F2` | Light gray surface |
| `--pixel-ink-25` | `#F8F8F8` | Near-white surface |
| `--pixel-border` | `#E8E8E9` | Borders |
| `--pixel-white` | `#FFFFFF` | White |

### Marketing / Horizon accents
| Color | Hex | Role |
|-------|-----|------|
| Horizon cyan CTA | `#00BFFF` | Primary pill buttons (“Talk to Sales”, “Try demo”) |
| Logo disc | `#3974F6` | Wordmark icon circle |
| Icon disc (standard SVG) | `#0063E2` | Standalone mark |
| Cyan chevron | `#00F9FF` | Logo accent |
| Soft white chevron | `#F9FAFF` | Logo accent |
| Hero navy | `#05124F` → `#021BA4` | Hero gradient |

## UI patterns

- **Buttons:** fully rounded pills (`border-radius: 9999px`), height ~40–44px
- **Primary CTA (hero):** cyan `#00BFFF` fill, white text, arrow affordance
- **Secondary CTA (nav):** dark ink `#1C1C1E` fill, white text
- **Surfaces:** white content areas; deep navy hero with 3D globe / globe UI
- **Motion:** subtle transitions; interactive product demos (payment rails, Clever AI chat)
- **Shadow:** soft layered elevation (`--pixel-shadow`)
- **Tone:** clean fintech — high contrast, generous space, global payment imagery

## Suggested CSS starter

```css
:root {
  --hc-primary: #004cc9;
  --hc-cyan: #00bfff;
  --hc-cyan-bright: #00ccff;
  --hc-logo-blue: #3974f6;
  --hc-logo-cyan: #00f9ff;
  --hc-ink-900: #1c1c1e;
  --hc-ink-800: #353537;
  --hc-ink-700: #4e4e50;
  --hc-ink-50: #f1f1f2;
  --hc-ink-25: #f8f8f8;
  --hc-border: #e8e8e9;
  --hc-white: #ffffff;
  --hc-hero-from: #05124f;
  --hc-hero-to: #021ba4;
  --hc-font: "Sora", sans-serif;
  --hc-radius-pill: 9999px;
  --hc-shadow: 0px 2px 2px -1px rgba(10, 13, 18, 0.04),
    0px 4px 6px -2px rgba(10, 13, 18, 0.03),
    0px 12px 16px -4px rgba(10, 13, 18, 0.08);
}
```
