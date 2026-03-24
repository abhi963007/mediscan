# MediScan HMS — Design System Specification

## 1. Core Visual Identity: "Clinical Clarity"
The design follows a **Clinical Clarity** philosophy, moving away from cluttered, high-density dashboard layouts. Instead, it treats complex medical data with the elegance of a high-end professional journal.

- **Primary Mission**: Reduce clinician cognitive load through whitespace and tonal hierarchy.
- **Tone**: Professional, authoritative, yet approachable and calm.
- **Theme**: Light Mode exclusively (for medical environments).

## 2. Color Palette & Tokens
We prioritize a restricted, high-contrast palette to ensure accessibility and professional aesthetics.

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#0F6E56` | Main brand color, primary actions, and "Clinical Truth" markers. |
| **Secondary** | `#4A635D` | Secondary buttons and non-critical navigation. |
| **Success** | `#00513e` | Positive status updates and completions. |
| **Warning** | `#BA7517` | Patient alerts, pending lab reports, and required attention. |
| **Critical/Alert** | `#B71C1C` | Critical vitals, medical emergencies, and irreversible actions. |
| **Background** | `#F4F6F8` | Main application background (soft gray). |
| **Surface** | `#FFFFFF` | Primary content cards, inputs, and modals. |

## 3. Typography
A dual-pairing system is used to distinguish between **Editorial Headlines** and **Clinical Data**.

- **Display & Headlines (Manrope)**:
  - Used for patient names, department titles, and screen headers.
  - Tracking: `-0.02em` for an authoritative, "bespoke" feel.
- **Body & Clinical Records (Inter)**:
  - Used for all medical records, prescription data, and EMR entries.
  - High x-height for maximum legibility under stress.
- **Data Labels (Inter)**:
  - Font size: `12px` (label-sm).
  - Color: `on-surface-variant` (`#3f4944`) to remain "quiet" until needed.

## 4. Spacing & Grid System
The layout is built on an **8px grid system**.

- **Gutter Policy**: Minimum outer margin of `32px` (Spacing 8) to maintain openness.
- **Whitespace**: "Generous" is the rule. Never fill empty space with placeholders; let the background breathe.
- **The "No-Line" Rule**: Avoid 1px solid borders for sectioning. Use background shifts (`#F4F6F8` vs `#FFFFFF`) or subtle tonal shifts to define boundaries.

## 5. UI Component Specifications

### 5.1 Buttons & Inputs
- **Primary Buttons**: HSL(164, 76%, 24%) background, white text. Rounded corners (8–12px).
- **Secondary Buttons**: `surface-container-highest` background. No border.
- **Input Fields**: `surface` background with a subtle "ghost border" (15% opacity). Focus state increases border opacity to 100% of the Primary color (no glow).

### 5.2 Cards & Depth
- **Surface Hierarchy**: Always place a white card (`#FFFFFF`) on a soft gray background (`#F4F6F8`) to create a "soft lift".
- **Shadows**: Use highly diffused ambient shadows: `0px 12px 32px rgba(0, 84, 64, 0.05)`.
- **Roundedness**: `ROUND_EIGHT` (8px) for data tables; `ROUND_TWELVE` (12px) for CTA cards and headers.

### 5.3 Chips & Badges
- **Status Chips**: Low-saturation backgrounds with high-contrast text.
  - *Active*: Teal-tinted background.
  - *Pending*: Amber-tinted background.
  - *Critical*: Red-tinted background.

## 6. Layout Composition
- **Sidebar**: Permanent left navigation (280px) with icons and single-word labels.
- **Top Bar**: Fixed height (64px) with Logo, Time/Date, and User Status.
- **Main Area**: Responsive flex/grid container with conditional sidebars for EMR sections.

---
*Developed for MediScan HMS — React + Tailwind CSS Core.*
