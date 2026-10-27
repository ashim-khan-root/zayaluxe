This is a design system extracted from a webpage https://www.macys.com

I find inspiring. I want to build my own site/app UI inspired by this design pattern. Do not copy or replicate brand assets, logos, or identity — use these tokens as a foundation to create something original for me. Match the design language, not the brand:

Vibe: vibrant · modern
Rhythm: 4px grid · very rounded · soft elevation

Key colors: Accent: #E01A2B · Background: #000000 · Text: #ECEFF1

Full palette: #E01A2B primary, #E64855 accent, #000000 surface, #ECEFF1 elevated, #ECEFF1 text, #6E6E6E muted

Typography:
• H2 — Macys Sans 25px 700, 1.4 line-height, -0.25px tracking
• H3 — Macys Sans 25px 700, 1.24 line-height, -0.25px tracking
• Body — Macys Sans 14px 500, 1.17 line-height
• Type scale — 45px / 25px / 14px

Tokens:
• Radius — 5px buttons, 8px cards, 63px inputs
• Radius vocabulary — button:5px, card:5px, input:63px, chip:50px
• Radius tokens — chat-messenger-shape--corner-value-small: 8px, chat-messenger-shape--corner-value-medium: 16px, chat-messenger-shape--corner-value-large: 20px, chat-messenger-shape--corner-value-extra-large: 28px, chat-messenger-shape--corner-fully-rounded: 100px
• Spacing scale — 8,12,16,20,32,48,64
• Spacing tokens — chat-messenger-internal-default-font-size: 14px, chat-messenger-internal-input-box-padding: 16px 16px 32px 16px, chat-messenger-typescale--title-large-font-size: 18px, chat-messenger-typescale--title-large-letter-spacing: 0, chat-messenger-typescale--title-medium-font-size: 16px, chat-messenger-typescale--title-medium-letter-spacing: 0, chat-messenger-typescale--title-small-font-size: 14px, chat-messenger-typescale--title-small-letter-spacing: 0, chat-messenger-typescale--body-large-font-size: 16px, chat-messenger-typescale--body-large-letter-spacing: 0
• Border color — #959499

Named color tokens (from CSS custom properties):
• --chat-messenger-internal-default-font-color: #1f1f1f
• --chat-messenger-internal-default-secondary-font-color: #757575
• --chat-messenger-internal-default-icon-font-color: #444746
• --chat-messenger-internal-default-primary-color: #0b57d0
• --chat-messenger-internal-default-link-font-color: #0b57d0
• --chat-messenger-internal-default-focus-color: #1e88e5
• --chat-messenger-internal-default-focus-color-contrast: #fff
• --chat-messenger-internal-default-border-color: #e0e0e0
• --chat-messenger-internal-default-border: 1px solid
      #e0e0e0
• --chat-messenger-internal-default-border-radius: 8px
• --chat-messenger-internal-default-chat-border-radius: 0
• --chat-messenger-color--surface: #f8fafd
• --chat-messenger-color--surface-container: #ffffff
• --chat-messenger-color--surface-container-high: #f0f4f9
• --chat-messenger-color--primary: #303030
• --chat-messenger-color--primary-container: #e9eef6
• --chat-messenger-color--secondary: #dde3ea
• --chat-messenger-color--on-surface: #1f1f1f
• --chat-messenger-color--on-surface-variant: #444746
• --chat-messenger-color--on-primary: #f2f2f2
• --chat-messenger-color--on-primary-container: #1f1f1f
• --chat-messenger-color--on-secondary: #444746
• --chat-messenger-color--state-layer-on-surface: rgba(31, 31, 31, 0.08)
• --chat-messenger-color--state-layer-on-primary: rgba(
      255,
      255,
      255,
      0.08
    )

Elevation (shadow scale, low → high):
• subtle — rgba(0, 0, 0, 0.1) 0px 4px 8px 0px
• chat-messenger-internal-default-box-shadow: 0 2px 2px 0
      rgba(0, 0, 0, 0.24)
• chat-messenger-elevation: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)

Motion:
• Durations — 0.2s, 0.25s, 0.5s, 0.1s
• Easing — ease-in-out, ease-out

Components:
• Button — #000000 bg, #000000 text, 5px radius, 12px 0px padding, 700 weight
• Card — #ECEFF1 bg, 8px radius
• Input — #FFFFFF bg, 1px solid #959499, 63px radius, 10px 12px 10px 40px padding
• Link — #FFFFFF

Gradients (use as brand moments — hero text, CTAs, accents):
• #1C1C1C → #E01A2B

Responsive breakpoints: 340px, 599px, 600px, 601px, 640px, 719px, 720px, 768px

Layout grid: max-width 1480px, 16px gutter
Spacing scale: 8px / 12px / 16px / 20px / 32px / 48px / 64px
Focus ring: -6px offset

Interaction states:
• hover — scale(1.1), shadow rgba(255, 255, 255, 0.25) 0px 0px 0px 30px inset, opacity 0.65
• active — opacity 0.65
• focus — -6px offset

Z-index layers: tooltip: 2 → modal: 30 → element: 1002

Responsive component changes:
• at 1480px — #skinny_dropdown .dropdown-button → font-size: calc(0.945946vw)
• at 1480px — #slideshow_base_template_v2 .dropdown-button → font-size: calc(0.945946vw)
• at 1480px — #subvideo_holidaywardrobe .dropdown-button → font-size: calc(0.945946vw)
• at 1023px — header.desktop::after → display: block
• at 719px — #skinny_dropdown .dropdown-button → font-size: 3.2vw
• at 719px — #slideshow_base_template_v2 .dropdown-button → font-size: 3.2vw
• at 719px — #subvideo_holidaywardrobe .dropdown-button → font-size: 3.2vw

Page structure: hero → testimonials
(Reproduce this section order when building a full-page layout.)

Attach the screenshot from this page as a visual reference — match its hierarchy, density, and overall feel, not just the raw values. Where this brief leaves something underspecified (hover states, focus rings, dark-mode variants), infer sensible defaults consistent with the vibe and palette above.

This is for my personal project — I'm drawing inspiration from this design pattern to build my own UI. Create something original that follows these design principles without copying the source brand.