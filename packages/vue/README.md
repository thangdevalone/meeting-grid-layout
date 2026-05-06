# @thangdevalone/meeting-grid-layout-vue

Vue 3 bindings for meeting-grid-layout with motion-v animations.

> For full documentation, layout modes, and API reference, see the [main README](https://github.com/thangdevalone/meeting-grid-layout#readme).

## Installation

```bash
npm install @thangdevalone/meeting-grid-layout-vue
```

## Quick Start

```vue
<script setup>
import { GridContainer, GridItem } from '@thangdevalone/meeting-grid-layout-vue'
import { ref } from 'vue'

const participants = ref([
  { id: 1, name: 'You' },
  { id: 2, name: 'User 1' },
])
</script>

<template>
  <GridContainer aspect-ratio="16:9" :gap="8" :count="participants.length" layout-mode="gallery">
    <GridItem v-for="(participant, index) in participants" :key="participant.id" :index="index">
      <VideoTile :participant="participant" />
    </GridItem>
  </GridContainer>
</template>
```

## Components

### `<GridContainer>`

Wraps the grid and provides layout via `provide`/`inject`.

| Prop                   | Type                                      | Default     | Description                                                          |
| ---------------------- | ----------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `aspect-ratio`         | `string`                                  | `'16:9'`    | Default tile aspect ratio                                            |
| `gap`                  | `number`                                  | `8`         | Gap between tiles (px)                                               |
| `count`                | `number`                                  | required    | Number of items                                                      |
| `layout-mode`          | `LayoutMode`                              | `'gallery'` | `gallery` \| `spotlight`                                             |
| `pinned-index`         | `number`                                  | -           | Pinned participant index                                             |
| `others-position`      | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'`   | Thumbnail position in pin mode                                       |
| `spring-preset`        | `SpringPreset`                            | `'smooth'`  | Animation preset                                                     |
| `max-items-per-page`   | `number`                                  | `0`         | Max items per page (0 = no pagination)                               |
| `current-page`         | `number`                                  | `0`         | Current page                                                         |
| `max-visible`          | `number`                                  | `0`         | Max visible in others area (0 = show all)                            |
| `current-visible-page` | `number`                                  | `0`         | Current page for visible items (when max-visible > 0)                |
| `item-aspect-ratios`   | `(ItemAspectRatio \| undefined)[]`        | -           | Per-item aspect ratios                                               |
| `float-size`           | `FloatSize`                               | `'medium'`  | Responsive size for auto-float PiP: `'small' \| 'medium' \| 'large'` |
| `pip-index`            | `number`                                  | `1`         | Which participant (0 or 1) is the floating PiP in 2-person mode      |
| `pin-only`             | `boolean`                                 | `false`     | Mobile/tablet pin-only mode: page 0 = pinned full-screen, page 1+ = others gallery (≤1024px) |
| `disable-float`        | `boolean`                                 | `false`     | Disable Floating PiP in 2-person mode; shows standard gallery grid instead |
| `disable-animation`    | `boolean`                                 | `false`     | Disable all spring/transition animations globally; items snap instantly    |
| `tag`                  | `string`                                  | `'div'`     | Root HTML element tag                                                |

### `<GridItem>`

Single grid cell with motion-v animation.

| Prop                | Type              | Default  | Description                                |
| ------------------- | ----------------- | -------- | ------------------------------------------ |
| `index`             | `number`          | required | Item index                                 |
| `disable-animation` | `boolean`         | `false`  | Disable layout animation                   |
| `item-aspect-ratio` | `ItemAspectRatio` | -        | Per-item aspect ratio (overrides container) |
| `tag`               | `string`          | `'div'`  | Root HTML element tag                      |

Scoped slot props: `{ contentDimensions, isLastVisibleOther, hiddenCount, isFloat }`

```vue
<GridItem v-for="(p, index) in participants" :key="p.id" :index="index">
  <template #default="{ isLastVisibleOther, hiddenCount }">
    <div v-if="isLastVisibleOther && hiddenCount > 0" class="more-indicator">
      +{{ hiddenCount }} more
    </div>
    <VideoTile v-else :participant="p" />
  </template>
</GridItem>
```

### `<FloatingGridItem>`

Draggable Picture-in-Picture overlay with corner snapping.

| Prop               | Type                                                          | Default                          | Description                                      |
| ------------------ | ------------------------------------------------------------- | -------------------------------- | ------------------------------------------------ |
| `size`             | `'small' \| 'medium' \| 'large'`                              | -                                | Responsive pre-defined sizes (see [Responsive PiP](#responsive-pip)) |
| `aspect-ratio`     | `string`                                                      | `'16:9'`                         | Aspect ratio of the floating PiP item            |
| `initial-position` | `{ x: number; y: number }`                                    | `{ x: 16, y: 16 }`              | Extra offset from anchor corner                  |
| `anchor`           | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'`               | Which corner to snap/anchor the item             |
| `visible`          | `boolean`                                                     | `true`                           | Whether the floating item is visible             |
| `edge-padding`     | `number`                                                      | `12`                             | Minimum padding from container edges (px)        |
| `border-radius`    | `number`                                                      | `12`                             | Border radius of the floating item (px)          |
| `box-shadow`       | `string`                                                      | `'0 4px 20px rgba(0,0,0,0.3)'`  | CSS box-shadow of the floating item              |

**Events:**

| Event            | Payload    | Description                                |
| ---------------- | ---------- | ------------------------------------------ |
| `@anchor-change` | `string`   | Emitted when anchor corner changes on drag |

### `<GridOverlay>`

Full-grid overlay for screen sharing, whiteboard, etc.

| Prop               | Type      | Default              | Description              |
| ------------------ | --------- | -------------------- | ------------------------ |
| `visible`          | `boolean` | `true`               | Show/hide the overlay    |
| `background-color` | `string`  | `'rgba(0,0,0,0.5)'` | Overlay background color |

## Responsive PiP

PiP auto-adjusts size based on container width via pre-defined sizes:

```vue
<script setup>
import { FloatingGridItem, GridContainer, GridItem } from '@thangdevalone/meeting-grid-layout-vue'
</script>

<template>
  <!-- Standalone — auto-responsive -->
  <FloatingGridItem size="large">
    <VideoTile />
  </FloatingGridItem>

  <!-- Auto-float in 2-person mode -->
  <GridContainer :count="2" float-size="large">
    <GridItem v-for="(p, i) in participants" :key="p.id" :index="i">
      <VideoTile :participant="p" />
    </GridItem>
  </GridContainer>
</template>
```

> See the [main README](https://github.com/thangdevalone/meeting-grid-layout#floating-pip-picture-in-picture) for full documentation on `floatSize`.

## Composables

| Composable                         | Description                           |
| ---------------------------------- | ------------------------------------- |
| `useGridDimensions(ref)`           | Track element size via ResizeObserver |
| `useMeetGrid(options)`             | Compute grid layout programmatically  |
| `useGridAnimation()`               | Access animation config from context  |
| `useGridItemPosition(grid, index)` | Get position and size for one item    |

## Re-exported from Core

| Export                      | Type       | Description                                      |
| --------------------------- | ---------- | ------------------------------------------------ |
| `createMeetGrid`            | function   | Create grid layout (Vanilla JS)                  |
| `createGrid`                | function   | Low-level grid computation                       |
| `resolveFloatWidth`         | function   | Resolve PiP width for a given container width     |
| `getSpringConfig`           | function   | Get spring config from preset name               |
| `springPresets`             | object     | All spring presets                                |
| `getAspectRatio`            | function   | Parse aspect ratio string                        |
| `FloatSize`                 | type       | Float size enum (`'small'`, `'medium'`, `'large'`) |
| `ContentDimensions`         | type       | Content dimensions with offset                   |

## License

MIT
