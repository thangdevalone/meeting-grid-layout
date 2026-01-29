<p align="center">
  <img src="https://img.shields.io/npm/v/@thangdevalone/meet-layout-grid-core?color=blue&label=core" alt="npm core" />
  <img src="https://img.shields.io/npm/v/@thangdevalone/meet-layout-grid-react?color=blue&label=react" alt="npm react" />
  <img src="https://img.shields.io/npm/v/@thangdevalone/meet-layout-grid-vue?color=blue&label=vue" alt="npm vue" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
</p>

<h1 align="center">Meet Layout Grid</h1>

<p align="center">
  <strong>A high-performance, framework-agnostic responsive grid library engineered specifically for real-time video meeting layouts with seamless Motion animations.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-algorithm">Algorithm</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  <a href="./README.vi.md">🇻🇳 Tiếng Việt</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **4 Layout Modes** | Gallery, Speaker, Spotlight, and Sidebar layouts to cover all meeting scenarios |
| 🎬 **Spring Animations** | Fluid physics-based transitions powered by Motion (Framer Motion / Motion One) |
| 📱 **Fully Responsive** | Smart auto-adaptation to any container dimension with optimal tile density |
| 📄 **Built-in Pagination** | Native support for paginated views, ideal for mobile and high participant counts |
| 🔧 **Multi-Framework** | First-class support for Vanilla JS, React 18+, and Vue 3 |
| 🌳 **Tree-Shakeable** | Modular architecture — import only what you need |
| 💪 **TypeScript** | Complete type definitions out of the box |

---

## 📦 Packages

This project is organized as a monorepo with three publishable packages:

| Package | Description | Bundle Size |
|---------|-------------|-------------|
| [`@thangdevalone/meet-layout-grid-core`](https://www.npmjs.com/package/@thangdevalone/meet-layout-grid-core) | Core grid calculation engine (Vanilla JS/TS) | ~3KB |
| [`@thangdevalone/meet-layout-grid-react`](https://www.npmjs.com/package/@thangdevalone/meet-layout-grid-react) | React 18+ components with Motion animations | ~8KB |
| [`@thangdevalone/meet-layout-grid-vue`](https://www.npmjs.com/package/@thangdevalone/meet-layout-grid-vue) | Vue 3 components with Motion animations | ~8KB |

---

## 🚀 Installation

```bash
# Core only (Vanilla JavaScript/TypeScript)
npm install @thangdevalone/meet-layout-grid-core

# React 18+
npm install @thangdevalone/meet-layout-grid-react

# Vue 3
npm install @thangdevalone/meet-layout-grid-vue
```

**With pnpm:**
```bash
pnpm add @thangdevalone/meet-layout-grid-react
```

**With yarn:**
```bash
yarn add @thangdevalone/meet-layout-grid-react
```

---

## 🎮 Quick Start

### Vanilla JavaScript

```javascript
import { createMeetGrid } from '@thangdevalone/meet-layout-grid-core'

const grid = createMeetGrid({
  dimensions: { width: 800, height: 600 },
  count: 6,
  aspectRatio: '16:9',
  gap: 8,
  layoutMode: 'gallery',
})

// Position each item
for (let i = 0; i < 6; i++) {
  const { top, left } = grid.getPosition(i)
  const { width, height } = grid.getItemDimensions(i)
  
  element.style.cssText = `
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    width: ${width}px;
    height: ${height}px;
  `
}
```

### React

```tsx
import { GridContainer, GridItem } from '@thangdevalone/meet-layout-grid-react'

function MeetingGrid({ participants }) {
  return (
    <GridContainer
      aspectRatio="16:9"
      gap={8}
      layoutMode="gallery"
      count={participants.length}
    >
      {participants.map((p, index) => (
        <GridItem key={p.id} index={index}>
          <VideoTile participant={p} />
        </GridItem>
      ))}
    </GridContainer>
  )
}
```

### Vue 3

```vue
<script setup>
import { GridContainer, GridItem } from '@thangdevalone/meet-layout-grid-vue'

const participants = ref([...])
</script>

<template>
  <GridContainer
    aspect-ratio="16:9"
    :gap="8"
    :count="participants.length"
    layout-mode="gallery"
  >
    <GridItem
      v-for="(p, index) in participants"
      :key="p.id"
      :index="index"
    >
      <VideoTile :participant="p" />
    </GridItem>
  </GridContainer>
</template>
```

---

## 🧠 Algorithm

The library utilizes sophisticated algorithms to deliver optimal tile sizing and positioning across all layout modes.

### Optimal Tile Fitting Algorithm

For layouts where secondary participants occupy a designated area (such as **Speaker** or **Sidebar** modes), the library employs a **tile area maximization algorithm** to determine the optimal grid configuration:

```
Given: N items, target area W × H, aspect ratio R, gap G

For each possible column count C from 1 to N:
  1. Calculate rows: R = ⌈N / C⌉
  2. Calculate initial tile width: tileW = (W - (C - 1) × G) / C
  3. Calculate tile height: tileH = tileW × R
  4. If total height exceeds H, scale down:
     - scale = H / (R × tileH + (R - 1) × G)
     - tileH = tileH × scale
     - tileW = tileH / R
  5. Calculate tile area: area = tileW × tileH

Select the configuration (C, R) that maximizes tile area
```

### Stateless Position Calculation

To prevent rendering artifacts and ensure consistent positioning during React/Vue re-renders, the library uses a **pure function approach** for coordinate calculation:

```typescript
function getPosition(index: number): Position {
  const row = Math.floor(index / cols)
  const col = index % cols
  
  // Handle centering for incomplete last row
  const incompleteRowCols = totalCount % cols
  const isInLastRow = incompleteRowCols > 0 && 
    index >= totalCount - incompleteRowCols
  
  if (isInLastRow) {
    // Center items in the last row
    const lastRowItemCount = incompleteRowCols
    const colInLastRow = index - (totalCount - incompleteRowCols)
    const leftOffset = (containerWidth - 
      (itemWidth * lastRowItemCount + (lastRowItemCount - 1) * gap)) / 2
    
    return { 
      top: initialTop + row * (itemHeight + gap), 
      left: leftOffset + colInLastRow * (itemWidth + gap) 
    }
  }
  
  return { 
    top: initialTop + row * (itemHeight + gap), 
    left: initialLeft + col * (itemWidth + gap) 
  }
}
```

This approach guarantees that each index always maps to a unique grid coordinate, eliminating overlap issues.

---

## 📐 Layout Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `gallery` | Equal-sized tiles in a responsive grid with automatic last-row centering | Default meeting view |
| `speaker` | Active speaker occupies ~65% of space; others in optimized multi-row grid below | Active speaker scenarios |
| `spotlight` | Single participant takes up the entire container | Presentation mode |
| `sidebar` | Main view with thumbnail strip (left/right/bottom positioning) | Screen sharing |

---

## 🎨 Animation Presets

The library includes spring-physics animation presets for smooth transitions:

| Preset | Description | Use Case |
|--------|-------------|----------|
| `snappy` | High frequency, low damping | Quick UI interactions |
| `smooth` | Balanced spring settings | Layout changes (default) |
| `gentle` | Lower velocity, subtle movement | Non-distracting transitions |
| `bouncy` | Slight overshoot effect | Playful, engaging UIs |

---

## 📄 Pagination

For mobile devices or meetings with high participant counts, built-in pagination prevents extreme tile shrinking:

```tsx
<GridContainer
  count={participants.length}
  maxItemsPerPage={9}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
>
  {/* ... */}
</GridContainer>
```

The pagination system provides:
- **Automatic page calculations** based on `maxItemsPerPage`
- **Visibility helpers** to determine which items should render
- **Optimized sizing** — tiles are sized based on items per page, not total count

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/thangdevalone/meet-layout-grid.git
cd meet-layout-grid

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run React demo
cd examples/react-demo && pnpm dev   # http://localhost:5173

# Run Vue demo
cd examples/vue-demo && pnpm dev     # http://localhost:5174
```

### Project Structure

```
meet-layout-grid/
├── packages/
│   ├── core/          # Core grid calculation engine
│   ├── react/         # React 18+ integration
│   └── vue/           # Vue 3 integration
├── examples/
│   ├── react-demo/    # React demo application
│   └── vue-demo/      # Vue demo application
└── package.json
```

---

## 📖 API Reference

### Core Package

#### `createMeetGrid(options: MeetGridOptions): MeetGrid`

Creates a grid instance for calculating positions and dimensions.

**Options:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dimensions` | `{ width: number, height: number }` | Required | Container dimensions |
| `count` | `number` | Required | Total number of items |
| `aspectRatio` | `string` | `'16:9'` | Tile aspect ratio (e.g., `'16:9'`, `'4:3'`) |
| `gap` | `number` | `8` | Gap between tiles in pixels |
| `layoutMode` | `LayoutMode` | `'gallery'` | Layout mode |
| `focusIndex` | `number` | `0` | Index of focused item (for speaker/spotlight) |
| `maxItemsPerPage` | `number` | - | Maximum items per page (enables pagination) |
| `currentPage` | `number` | `0` | Current page index (0-based) |
| `sidebarPosition` | `'left' \| 'right' \| 'bottom'` | `'right'` | Sidebar position (for sidebar mode) |

---

## 📄 License

**MIT License with Attribution Requirement**

This library is **free to use** for personal and commercial projects. However, you must include proper attribution in your project documentation or about section.

See the [LICENSE](./LICENSE) file for full details.

---

## 🙏 Credits

Developed and maintained by **[@thangdevalone](https://github.com/thangdevalone)**.

If you find this library helpful, please consider giving it a ⭐ on GitHub!

---

<p align="center">
  Made with ❤️ for the open-source community
</p>
