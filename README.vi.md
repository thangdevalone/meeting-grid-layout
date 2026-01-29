<p align="center">
  <img src="https://img.shields.io/npm/v/@thangdevalone/meet-layout-grid-core?color=blue&label=core" alt="npm core" />
  <img src="https://img.shields.io/npm/v/@thangdevalone/meet-layout-grid-react?color=blue&label=react" alt="npm react" />
  <img src="https://img.shields.io/npm/v/@thangdevalone/meet-layout-grid-vue?color=blue&label=vue" alt="npm vue" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
</p>

<h1 align="center">Meet Layout Grid</h1>

<p align="center">
  <strong>Thư viện grid responsive hiệu năng cao, độc lập framework, được thiết kế chuyên biệt cho các bố cục cuộc họp video thời gian thực với các hiệu ứng Motion mượt mà.</strong>
</p>

<p align="center">
  <a href="#-tính-năng">Tính năng</a> •
  <a href="#-cài-đặt">Cài đặt</a> •
  <a href="#-bắt-đầu-nhanh">Bắt đầu nhanh</a> •
  <a href="#-thuật-toán">Thuật toán</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-giấy-phép">Giấy phép</a>
</p>

<p align="center">
  <a href="./README.md">🇬🇧 English</a>
</p>

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🎯 **4 Chế độ bố cục** | Gallery, Speaker, Spotlight và Sidebar để đáp ứng mọi kịch bản cuộc họp |
| 🎬 **Hoạt ảnh Spring** | Chuyển đổi mượt mà dựa trên vật lý bằng Motion (Framer Motion / Motion One) |
| 📱 **Đáp ứng hoàn toàn** | Tự động thích ứng thông minh với mọi kích thước container với mật độ tile tối ưu |
| 📄 **Phân trang tích hợp** | Hỗ trợ native cho các view phân trang, lý tưởng cho di động và số lượng người tham gia lớn |
| 🔧 **Đa Framework** | Hỗ trợ first-class cho Vanilla JS, React 18+ và Vue 3 |
| 🌳 **Tree-Shakeable** | Kiến trúc module — chỉ import những gì bạn cần |
| 💪 **TypeScript** | Định nghĩa type đầy đủ sẵn sàng sử dụng |

---

## 📦 Các gói

Dự án này được tổ chức dưới dạng monorepo với ba gói có thể publish:

| Gói | Mô tả | Kích thước Bundle |
|-----|-------|-------------------|
| [`@thangdevalone/meet-layout-grid-core`](https://www.npmjs.com/package/@thangdevalone/meet-layout-grid-core) | Engine tính toán grid core (Vanilla JS/TS) | ~3KB |
| [`@thangdevalone/meet-layout-grid-react`](https://www.npmjs.com/package/@thangdevalone/meet-layout-grid-react) | Components React 18+ với hoạt ảnh Motion | ~8KB |
| [`@thangdevalone/meet-layout-grid-vue`](https://www.npmjs.com/package/@thangdevalone/meet-layout-grid-vue) | Components Vue 3 với hoạt ảnh Motion | ~8KB |

---

## 🚀 Cài đặt

```bash
# Chỉ Core (Vanilla JavaScript/TypeScript)
npm install @thangdevalone/meet-layout-grid-core

# React 18+
npm install @thangdevalone/meet-layout-grid-react

# Vue 3
npm install @thangdevalone/meet-layout-grid-vue
```

**Với pnpm:**
```bash
pnpm add @thangdevalone/meet-layout-grid-react
```

**Với yarn:**
```bash
yarn add @thangdevalone/meet-layout-grid-react
```

---

## 🎮 Bắt đầu nhanh

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

// Định vị từng item
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

## 🧠 Thuật toán

Thư viện sử dụng các thuật toán tinh vi để mang lại kích thước và định vị tile tối ưu trên tất cả các chế độ bố cục.

### Thuật toán Tối ưu Kích thước Tile

Đối với các bố cục mà người tham gia phụ chiếm một khu vực được chỉ định (như chế độ **Speaker** hoặc **Sidebar**), thư viện sử dụng **thuật toán tối đa hóa diện tích tile** để xác định cấu hình grid tối ưu:

```
Cho: N items, vùng mục tiêu W × H, tỷ lệ khung hình R, khoảng cách G

Với mỗi số cột có thể C từ 1 đến N:
  1. Tính số hàng: R = ⌈N / C⌉
  2. Tính chiều rộng tile ban đầu: tileW = (W - (C - 1) × G) / C
  3. Tính chiều cao tile: tileH = tileW × R
  4. Nếu tổng chiều cao vượt quá H, scale giảm:
     - scale = H / (R × tileH + (R - 1) × G)
     - tileH = tileH × scale
     - tileW = tileH / R
  5. Tính diện tích tile: area = tileW × tileH

Chọn cấu hình (C, R) có diện tích tile lớn nhất
```

### Tính toán Vị trí Stateless

Để ngăn chặn các artifact rendering và đảm bảo định vị nhất quán trong quá trình re-render React/Vue, thư viện sử dụng **phương pháp pure function** cho việc tính toán tọa độ:

```typescript
function getPosition(index: number): Position {
  const row = Math.floor(index / cols)
  const col = index % cols
  
  // Xử lý căn giữa cho hàng cuối không đầy đủ
  const incompleteRowCols = totalCount % cols
  const isInLastRow = incompleteRowCols > 0 && 
    index >= totalCount - incompleteRowCols
  
  if (isInLastRow) {
    // Căn giữa các items trong hàng cuối
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

Phương pháp này đảm bảo rằng mỗi index luôn luôn ánh xạ đến một tọa độ grid duy nhất, loại bỏ các vấn đề chồng lấn.

---

## 📐 Các chế độ Bố cục

| Chế độ | Mô tả | Trường hợp sử dụng |
|--------|-------|-------------------|
| `gallery` | Các tile kích thước bằng nhau trong grid responsive với tự động căn giữa hàng cuối | View cuộc họp mặc định |
| `speaker` | Người nói chính chiếm ~65% không gian; những người khác trong grid multi-row tối ưu bên dưới | Kịch bản người nói chính |
| `spotlight` | Một người tham gia chiếm toàn bộ container | Chế độ thuyết trình |
| `sidebar` | View chính với dải thumbnail (vị trí trái/phải/dưới) | Chia sẻ màn hình |

---

## 🎨 Các Preset Hoạt ảnh

Thư viện bao gồm các preset hoạt ảnh vật lý spring cho các chuyển đổi mượt mà:

| Preset | Mô tả | Trường hợp sử dụng |
|--------|-------|-------------------|
| `snappy` | Tần số cao, độ giảm chấn thấp | Tương tác UI nhanh |
| `smooth` | Cài đặt spring cân bằng | Thay đổi bố cục (mặc định) |
| `gentle` | Vận tốc thấp hơn, chuyển động tinh tế | Chuyển đổi không gây phân tâm |
| `bouncy` | Hiệu ứng overshoot nhẹ | UI vui tươi, hấp dẫn |

---

## 📄 Phân trang

Đối với thiết bị di động hoặc các cuộc họp có số lượng người tham gia lớn, phân trang tích hợp ngăn chặn việc thu nhỏ tile quá mức:

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

Hệ thống phân trang cung cấp:
- **Tính toán trang tự động** dựa trên `maxItemsPerPage`
- **Các helper kiểm tra visibility** để xác định items nào nên render
- **Kích thước tối ưu** — tiles được định kích thước dựa trên items mỗi trang, không phải tổng số

---

## 🛠️ Phát triển

### Yêu cầu
- Node.js 18+
- pnpm 8+

### Cài đặt

```bash
# Clone repository
git clone https://github.com/thangdevalone/meet-layout-grid.git
cd meet-layout-grid

# Cài đặt dependencies
pnpm install

# Build tất cả các gói
pnpm build

# Chạy React demo
cd examples/react-demo && pnpm dev   # http://localhost:5173

# Chạy Vue demo
cd examples/vue-demo && pnpm dev     # http://localhost:5174
```

### Cấu trúc Dự án

```
meet-layout-grid/
├── packages/
│   ├── core/          # Engine tính toán grid core
│   ├── react/         # Tích hợp React 18+
│   └── vue/           # Tích hợp Vue 3
├── examples/
│   ├── react-demo/    # Ứng dụng demo React
│   └── vue-demo/      # Ứng dụng demo Vue
└── package.json
```

---

## 📖 API Reference

### Gói Core

#### `createMeetGrid(options: MeetGridOptions): MeetGrid`

Tạo một instance grid để tính toán vị trí và kích thước.

**Options:**
| Thuộc tính | Kiểu | Mặc định | Mô tả |
|------------|------|----------|-------|
| `dimensions` | `{ width: number, height: number }` | Bắt buộc | Kích thước container |
| `count` | `number` | Bắt buộc | Tổng số items |
| `aspectRatio` | `string` | `'16:9'` | Tỷ lệ khung hình tile (ví dụ: `'16:9'`, `'4:3'`) |
| `gap` | `number` | `8` | Khoảng cách giữa các tile tính bằng pixel |
| `layoutMode` | `LayoutMode` | `'gallery'` | Chế độ bố cục |
| `focusIndex` | `number` | `0` | Index của item được focus (cho speaker/spotlight) |
| `maxItemsPerPage` | `number` | - | Số items tối đa mỗi trang (bật phân trang) |
| `currentPage` | `number` | `0` | Index trang hiện tại (bắt đầu từ 0) |
| `sidebarPosition` | `'left' \| 'right' \| 'bottom'` | `'right'` | Vị trí sidebar (cho chế độ sidebar) |

---

## 📄 Giấy phép

**Giấy phép MIT với Yêu cầu Ghi nguồn**

Thư viện này **miễn phí sử dụng** cho các dự án cá nhân và thương mại. Tuy nhiên, bạn phải bao gồm ghi nguồn phù hợp trong tài liệu dự án hoặc phần giới thiệu của bạn.

Xem file [LICENSE](./LICENSE) để biết chi tiết đầy đủ.

---

## 🙏 Ghi công

Được phát triển và duy trì bởi **[@thangdevalone](https://github.com/thangdevalone)**.

Nếu bạn thấy thư viện này hữu ích, hãy cân nhắc cho nó một ⭐ trên GitHub!

---

<p align="center">
  Được tạo với ❤️ cho cộng đồng mã nguồn mở
</p>
