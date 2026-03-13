<p align="center">
  <img src="https://img.shields.io/npm/v/@thangdevalone/meeting-grid-layout-core?color=blue&label=core" alt="npm core" />
  <img src="https://img.shields.io/npm/v/@thangdevalone/meeting-grid-layout-react?color=blue&label=react" alt="npm react" />
  <img src="https://img.shields.io/npm/v/@thangdevalone/meeting-grid-layout-vue?color=blue&label=vue" alt="npm vue" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
</p>

<h1 align="center">Meeting Grid Layout</h1>

<p align="center">
  Thư viện grid responsive cho bố cục video meeting với animation mượt mà.
  <br />
  Hỗ trợ Vanilla JS, React và Vue.
</p>

<p align="center">
  <a href="#demos">Demos</a> ·
  <a href="#tính-năng">Tính năng</a> ·
  <a href="#các-gói">Các gói</a> ·
  <a href="#cài-đặt">Cài đặt</a> ·
  <a href="#bắt-đầu-nhanh">Bắt đầu nhanh</a> ·
  <a href="#chế-độ-layout">Chế độ layout</a> ·
  <a href="#api-reference">API Reference</a> ·
  <a href="#giấy-phép">Giấy phép</a>
</p>

<p align="center">
  <a href="./README.md">English</a>
</p>

---

## Demos

- [React Demo](https://meeting-react-grid.modern-ui.org/)
- [Vue Demo](https://meeting-vue-grid.modern-ui.org/)

---

## Tính năng

| Tính năng                  | Mô tả                                                  |
| -------------------------- | ------------------------------------------------------ |
| **2 chế độ layout**        | Gallery (có hỗ trợ ghim), Spotlight                    |
| **Ghim participant**       | Ghim bất kỳ participant nào làm view chính             |
| **Animation spring**       | Motion (Framer Motion / Motion One) khi chuyển layout  |
| **Phân trang**             | Chia participant qua nhiều trang                       |
| **Giới hạn hiển thị "+N"** | Giới hạn số item và hiển thị chỉ báo overflow          |
| **Tỉ lệ linh hoạt**        | Tỉ lệ riêng cho từng item (phone 9:16, desktop 16:9)   |
| **Floating PiP**           | Picture-in-Picture kéo thả, snap vào góc               |
| **Chế độ Pin Only**        | View pin mobile/tablet với phân trang riêng biệt      |
| **Grid Overlay**           | Overlay toàn grid cho screen sharing, whiteboard, v.v. |
| **Responsive**             | Tự động co giãn theo container với justified packing   |
| **Đa framework**           | Vanilla JS, React 18+, Vue 3                           |
| **TypeScript**             | Type đầy đủ                                            |
| **Tree-shakeable**         | Chỉ import phần cần dùng                               |

---

## Các gói

| Gói                                                                                                            | Mô tả                              | Dung lượng |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------- |
| [`@thangdevalone/meeting-grid-layout-core`](https://www.npmjs.com/package/@thangdevalone/meeting-grid-layout-core)   | Chỉ tính toán grid (Vanilla JS/TS) | ~3KB       |
| [`@thangdevalone/meeting-grid-layout-react`](https://www.npmjs.com/package/@thangdevalone/meeting-grid-layout-react) | Component React + Motion           | ~8KB       |
| [`@thangdevalone/meeting-grid-layout-vue`](https://www.npmjs.com/package/@thangdevalone/meeting-grid-layout-vue)     | Component Vue 3 + Motion           | ~8KB       |

> Gói React và Vue đã re-export mọi thứ từ core — không cần cài core riêng.

---

## Cài đặt

```bash
# Chỉ core (Vanilla JavaScript/TypeScript)
npm install @thangdevalone/meeting-grid-layout-core

# React 18+
npm install @thangdevalone/meeting-grid-layout-react

# Vue 3
npm install @thangdevalone/meeting-grid-layout-vue
```

---

## Bắt đầu nhanh

### React

```tsx
import { GridContainer, GridItem } from '@thangdevalone/meeting-grid-layout-react'

function MeetingGrid({ participants }) {
  return (
    <GridContainer aspectRatio="16:9" gap={8} layoutMode="gallery" count={participants.length}>
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
import { GridContainer, GridItem } from '@thangdevalone/meeting-grid-layout-vue'

const participants = ref([...])
</script>

<template>
  <GridContainer aspect-ratio="16:9" :gap="8" :count="participants.length" layout-mode="gallery">
    <GridItem v-for="(p, index) in participants" :key="p.id" :index="index">
      <VideoTile :participant="p" />
    </GridItem>
  </GridContainer>
</template>
```

### Vanilla JavaScript

```javascript
import { createMeetGrid } from '@thangdevalone/meeting-grid-layout-core'

const grid = createMeetGrid({
  dimensions: { width: 800, height: 600 },
  count: 6,
  aspectRatio: '16:9',
  gap: 8,
  layoutMode: 'gallery',
})

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

---

## Chế độ layout

| Chế độ      | Mô tả                                                         |
| ----------- | ------------------------------------------------------------- |
| `gallery`   | Grid linh hoạt lấp đầy không gian. Dùng `pinnedIndex` để ghim |
| `spotlight` | Một participant chiếm toàn bộ container                       |

### Gallery với ghim

Khi đặt `pinnedIndex`, layout chia thành **Vùng chính** (item được ghim) và **Vùng phụ** (thumbnail):

```tsx
<GridContainer
  layoutMode="gallery"
  pinnedIndex={0}              // Participant được ghim
  othersPosition="right"       // Thumbnail bên phải
  count={participants.length}
>
```

| `othersPosition` | Mô tả                              |
| ---------------- | ---------------------------------- |
| `right`          | Thumbnail bên phải (mặc định)      |
| `left`           | Thumbnail bên trái                 |
| `top`            | Thumbnail phía trên (dải ngang)    |
| `bottom`         | Thumbnail phía dưới (kiểu speaker) |

### Chế độ Pin Only

Trên thiết bị di động/tablet (chiều rộng container ≤ 1024px), `pinOnly` mang đến trải nghiệm tập trung:

- **Trang 0:** Chỉ hiển thị participant được ghim toàn màn hình
- **Trang 1+:** Các participant khác hiển thị dạng gallery grid (không có pin)

Trên desktop (chiều rộng > 1024px), layout hoạt động như sidebar bình thường.

```tsx
// React
<GridContainer
  layoutMode="gallery"
  pinnedIndex={0}
  maxVisible={4}
  currentVisiblePage={currentPage}
  pinOnly={true}
>
```

```vue
<!-- Vue -->
<GridContainer
  layout-mode="gallery"
  :pinned-index="0"
  :max-visible="4"
  :current-visible-page="currentPage"
  :pin-only="true"
>
```

> **Lưu ý:** `pinOnly` yêu cầu phân trang (`maxVisible > 0`) để hoạt động. Tổng số trang = 1 (trang pin) + ceil(others / maxVisible).

---

## Phân trang

Chia participant qua nhiều trang:

```tsx
<GridContainer
  count={participants.length}
  maxItemsPerPage={9}
  currentPage={currentPage}
>
```

Với chế độ ghim, dùng `maxVisible` và `currentVisiblePage` để phân trang vùng "others":

```tsx
<GridContainer
  layoutMode="gallery"
  pinnedIndex={0}
  maxVisible={4}
  currentVisiblePage={othersPage}
>
```

---

## Giới hạn hiển thị "+N thêm"

Giới hạn số item hiển thị và hiện chỉ báo overflow:

```tsx
<GridContainer maxVisible={4} count={12}>
  {participants.map((p, index) => (
    <GridItem key={p.id} index={index}>
      {({ isLastVisibleOther, hiddenCount }) => (
        <>
          {isLastVisibleOther && hiddenCount > 0 ? (
            <div className="more-indicator">+{hiddenCount} thêm</div>
          ) : (
            <VideoTile participant={p} />
          )}
        </>
      )}
    </GridItem>
  ))}
</GridContainer>
```

---

## Tỉ lệ linh hoạt

Hỗ trợ tỉ lệ khác nhau cho từng participant (ví dụ: mobile dọc vs desktop ngang):

```tsx
const itemAspectRatios = [
  "16:9",    // Desktop ngang
  "9:16",    // Mobile dọc
  undefined, // Dùng aspectRatio chung
]

<GridContainer
  aspectRatio="16:9"
  itemAspectRatios={itemAspectRatios}
>
```

| Giá trị     | Mô tả                                              |
| ----------- | -------------------------------------------------- |
| `"16:9"`    | Tỉ lệ ngang cố định                                |
| `"9:16"`    | Video dọc (điện thoại)                             |
| `"4:3"`     | Tỉ lệ tablet cổ điển                               |
| `"auto"`    | Co giãn lấp đầy cell (mặc định khi không chỉ định) |
| `undefined` | Sử dụng global `aspectRatio`                       |

### Thuật toán Gallery linh hoạt

Khi các participant có **tỉ lệ khác nhau** (ví dụ: điện thoại 9:16, máy tính 16:9), grid sử dụng thuật toán **Tìm kiếm số hàng tối ưu** để tìm bố cục ít lãng phí không gian nhất mà vẫn giữ đúng tỉ lệ.

#### Vấn đề của Greedy Packing

Cách tiếp cận đơn giản là xếp item vào hàng cho đến khi hàng "đầy" rồi xuống hàng mới. Cách này thường tạo ra **layout lệch** — ví dụ 10 item có thể thành `[4, 5, 1]`, hàng cuối chỉ có 1 item lẻ loi và lãng phí rất nhiều không gian.

Thuật toán của chúng tôi tránh điều này bằng cách **thử nhiều số hàng khác nhau** và chọn cái lấp đầy container tốt nhất.

#### Sơ đồ thuật toán

```mermaid
flowchart TD
    A["Bắt đầu: N item với tỉ lệ khác nhau"] --> B["Với mỗi item, tính tỉ lệ w/h\nVD: 16:9 → 1.778, 9:16 → 0.5625"]
    B --> C["Đặt phạm vi tìm kiếm:\nnumRows = 1, 2, 3, ...\nđến min(N, ⌈√N × 2.5⌉)"]
    C --> D["Với mỗi numRows"]
    D --> E["Phân bổ đều N item vào numRows hàng\n(mỗi hàng ⌊N/R⌋ hoặc ⌈N/R⌉ item)"]
    E --> F["Với mỗi hàng, tính chiều cao tự nhiên:\nrowH = (chiềuRộng − khoảng cách) / Σ(tỉ lệ w/h trong hàng)"]
    F --> G["totalH = Σ(tất cả rowH) + khoảng cách giữa các hàng"]
    G --> H{"Liệu |totalH − chiềuCao|\n< kết quả tốt nhất hiện tại?"}
    H -- Có --> I["Lưu lại: bestRowCount = numRows"]
    H -- Không --> J{"totalH vừa vượt qua\nchiềuCao container?"}
    I --> J
    J -- "Có → thoát sớm" --> K["Xây dựng layout với bestRowCount"]
    J -- "Không → thử tiếp" --> D
    K --> L["globalScale = min(1.0, chiềuCao / totalH)\nÁp dụng cùng scale cho TẤT CẢ item"]
    L --> M["Căn giữa ngang & dọc\nTỉ lệ được bảo toàn hoàn hảo ✓"]

    style A fill:#6366f1,color:#fff
    style I fill:#22c55e,color:#fff
    style M fill:#6366f1,color:#fff
```

#### Các bước chi tiết

1. **Tính tỉ lệ w/h** — Với mỗi item, chuyển aspect ratio thành số:
   - `16:9` → `1.778` (ngang rộng)
   - `9:16` → `0.5625` (dọc cao)
   - `4:3` → `1.333`, `1:1` → `1.0`

2. **Đặt phạm vi tìm kiếm** — Thử mọi số hàng từ `1` đến `min(N, ⌈√N × 2.5⌉)`. Bỏ qua số hàng mà `⌊N/numRows⌋ = 0` (sẽ tạo hàng rỗng).

3. **Phân bổ đều** — Với mỗi `numRows`, item được chia đều:
   - `base = ⌊N / numRows⌋`, `extra = N % numRows`
   - `extra` hàng đầu nhận `base + 1` item, các hàng còn lại nhận `base` item
   - Ví dụ: 9 item chia 2 hàng → `[5, 4]`; chia 4 hàng → `[3, 2, 2, 2]`

4. **Tính chiều cao tự nhiên mỗi hàng** — Nếu một hàng item lấp đầy chiều rộng container, nó cao bao nhiêu?
   ```
   rowHeight = (chiềuRộng − (sốItem − 1) × gap) / Σ(tỉ lệ w/h của item trong hàng)
   ```
   Hàng có item dọc/cao sẽ cho chiều cao lớn; hàng có item ngang/rộng cho chiều cao nhỏ.

5. **Tổng chiều cao & chọn tốt nhất** — Cộng tất cả chiều cao hàng + khoảng cách. Số hàng mà `|totalH − chiềuCao|` **nhỏ nhất** thắng — nghĩa là hệ số scale cuối sẽ gần `1.0` nhất (ít lãng phí nhất).

6. **Thoát sớm** — Khi `numRows` tăng, `totalH` cũng tăng theo. Ngay khi `totalH` vượt từ dưới lên trên `chiềuCao container`, phương án tối ưu đã được ghi nhận — dừng tìm kiếm.

7. **Scale đều** — Áp dụng một hệ số `globalScale = min(1.0, chiềuCao / totalH)` cho **tất cả** item. Vì chiều rộng và chiều cao scale cùng hệ số, tỉ lệ của mỗi item được **bảo toàn hoàn hảo**.

8. **Căn giữa & đặt vị trí** — Mỗi hàng được căn giữa theo chiều ngang, toàn bộ grid được căn giữa theo chiều dọc trong không gian còn lại.

#### Tại sao chọn `√N × 2.5` làm giới hạn trên?

Phạm vi tìm kiếm `⌈√N × 2.5⌉` được chọn cẩn thận:

- **`√N` là baseline "lưới vuông".** Với N item trong grid đều, `√N` hàng × `√N` cột là cách sắp xếp tự nhiên. Ví dụ: 9 item → 3×3, 16 item → 4×4.

- **Tỉ lệ hỗn hợp có thể cần nhiều hàng hơn.** Khi tất cả item là dọc/cao (VD: 9:16), xếp cạnh nhau chiếm rất nhiều chiều rộng — có thể cần nhiều hàng hơn `√N` để tận dụng chiều cao container.

- **Hệ số `2.5×` cung cấp đủ dư địa.** Cho phép tìm kiếm vượt xa baseline căn bậc hai để xử lý trường hợp nhiều item dọc, mà không lãng phí:

  | N (item) | √N   | ⌈√N × 2.5⌉ | Số hàng thử tối đa |
  | -------- | ---- | ----------- | ------------------- |
  | 4        | 2.0  | 5           | 4 (giới hạn tại N)  |
  | 9        | 3.0  | 8           | 8                   |
  | 16       | 4.0  | 10          | 10                  |
  | 25       | 5.0  | 13          | 13                  |
  | 50       | 7.07 | 18          | 18                  |

- **`min(N, ...)` giới hạn tối đa.** Không bao giờ cần nhiều hàng hơn số item. Với N nhỏ (VD: 4 item), `⌈√4 × 2.5⌉ = 5` bị giới hạn còn `4`.

- **Kết hợp với thoát sớm**, số lần lặp thực tế thường ít hơn nhiều — tìm kiếm dừng ngay khi `totalH` vượt qua `chiềuCao container`, thường chỉ sau vài ứng viên đầu tiên.

#### So sánh trước và sau

<p align="center">
  <img src=".github/algorithm_comparison.png" alt="So sánh thuật toán: Greedy Packing vs Tìm kiếm hàng tối ưu" width="600" />
</p>

#### Ví dụ trực quan: 9 item với tỉ lệ hỗn hợp

```
Container: 1200 × 700px
Tỉ lệ: 16:9, 9:16, 4:3, 1:1, 16:9, 9:16, 4:3, 1:1, 16:9
Phạm vi tìm: 1 đến min(9, ⌈√9 × 2.5⌉) = min(9, 8) = 8

Tìm kiếm số hàng:
┌──────────────────────────────────────────────────────────────────────────┐
│ Rows=1: [9]           totalH =  152px  │ |152−700| = 548  ❌           │
│ Rows=2: [5, 4]        totalH =  680px  │ |680−700| =  20  ✅ Tốt nhất │
│ Rows=3: [3, 3, 3]     totalH = 1050px  │ |1050−700| = 350 ❌           │
│ → totalH vượt 700 (680→1050) → THOÁT SỚM                              │
└──────────────────────────────────────────────────────────────────────────┘

Thắng: 2 hàng [5, 4]
  globalScale = min(1.0, 700 / 680) = 1.0
  → Item lấp 97% container, tỉ lệ bảo toàn hoàn hảo
```

#### Hiệu năng

| Chỉ số                | Giá trị                                                            |
| --------------------- | ------------------------------------------------------------------ |
| Độ phức tạp thời gian | `O(N × √N)` — N item × tối đa √N×2.5 ứng viên (có thoát sớm)     |
| Bộ nhớ                | `O(N)` — chỉ cấp phát mảng cho phương án thắng                    |
| Pha tìm kiếm          | Không cấp phát bộ nhớ — chỉ tính arithmetic trên mảng tỉ lệ       |
| Tốc độ thực tế        | < 0.1ms cho 50 participant                                        |
| Thoát sớm             | Dừng ngay khi `totalH` vượt qua `chiềuCao container`              |

---

## Floating PiP (Picture-in-Picture)

Item nổi kéo thả, snap vào góc. Hỗ trợ kích thước cố định hoặc responsive.

```tsx
import { FloatingGridItem, DEFAULT_FLOAT_BREAKPOINTS } from '@thangdevalone/meeting-grid-layout-react'

<GridContainer>
  {/* Các grid item chính */}

  {/* Kích thước cố định */}
  <FloatingGridItem width={130} height={175} anchor="bottom-right">
    <VideoTile participant={floatingParticipant} />
  </FloatingGridItem>

  {/* Responsive — tự điều chỉnh theo chiều rộng container */}
  <FloatingGridItem breakpoints={DEFAULT_FLOAT_BREAKPOINTS}>
    <VideoTile />
  </FloatingGridItem>
</GridContainer>

{/* Auto-float chế độ 2 người */}
<GridContainer count={2} floatBreakpoints={DEFAULT_FLOAT_BREAKPOINTS}>
  {participants.map((p, i) => (
    <GridItem key={p.id} index={i}><VideoTile participant={p} /></GridItem>
  ))}
</GridContainer>

{/* Chọn participant nào làm floating PiP */}
<GridContainer count={2} floatBreakpoints={DEFAULT_FLOAT_BREAKPOINTS} pipIndex={0}>
  {participants.map((p, i) => (
    <GridItem key={p.id} index={i}><VideoTile participant={p} /></GridItem>
  ))}
</GridContainer>
```

### Breakpoints mặc định

| Chiều rộng container | Kích thước PiP |
| -------------------- | -------------- |
| 0 – 479px            | 100 × 135      |
| 480 – 767px          | 130 × 175      |
| 768 – 1023px         | 160 × 215      |
| 1024 – 1439px        | 180 × 240      |
| 1440px+              | 220 × 295      |

Tự định nghĩa breakpoints với `PipBreakpoint[]`:

```tsx
const myBreakpoints: PipBreakpoint[] = [
  { minWidth: 0, width: 80, height: 110 },
  { minWidth: 600, width: 150, height: 200 },
  { minWidth: 1200, width: 250, height: 330 },
]

<FloatingGridItem breakpoints={myBreakpoints}>...</FloatingGridItem>
// hoặc
<GridContainer count={2} floatBreakpoints={myBreakpoints}>...</GridContainer>
```

> **Lưu ý:** Props `width`/`height` cố định ghi đè breakpoints. Hệ thống chọn breakpoint có `minWidth` lớn nhất mà ≤ chiều rộng container.

### `pipIndex` — Chọn participant làm PiP

Trong chế độ 2 người, `pipIndex` chọn participant nào sẽ hiển thị dạng floating PiP (người còn lại chiếm toàn bộ màn hình). Mặc định là `1` (participant thứ 2).

| `pipIndex`     | Chính (toàn màn hình) | Floating PiP    |
| -------------- | --------------------- | --------------- |
| `0`            | Participant 1         | Participant 0   |
| `1` (mặc định) | Participant 0         | Participant 1   |

### `disableFloat` — Tắt PiP tự động

Đặt `disableFloat={true}` để tắt Floating PiP tự động trong chế độ 2 người. Khi tắt, cả hai participant sẽ hiển thị dạng gallery grid chuẩn thay vì một toàn màn hình + một PiP kéo thả.

```tsx
// Chế độ 2 người bình thường (PiP bật mặc định)
<GridContainer count={2}>...</GridContainer>

// Tắt PiP — hiển thị gallery grid chuẩn với 2 ô
<GridContainer count={2} disableFloat={true}>...</GridContainer>
```

### Props của `GridOverlay`

| Prop              | Kiểu                 | Mặc định            | Mô tả                      |
| ----------------- | -------------------- | ------------------- | -------------------------- |
| `visible`         | `boolean`            | `true`              | Hiển thị overlay hay không |
| `backgroundColor` | `string`             | `'rgba(0,0,0,0.5)'` | Màu nền overlay            |
| `children`        | `ReactNode` / `slot` | -                   | Nội dung bên trong overlay |

---

## Phát triển

```bash
git clone https://github.com/thangdevalone/meeting-grid-layout.git
cd meeting-grid-layout

pnpm install
pnpm build

# Chạy demo
pnpm dev
# React: http://localhost:5173
# Vue: http://localhost:5174
```

Cấu trúc dự án:

```
meeting-grid-layout/
├── packages/
│   ├── core/       # Logic grid (không phụ thuộc framework)
│   ├── react/      # React component + hooks
│   └── vue/        # Vue 3 component + composables
├── examples/
│   ├── react-demo/
│   └── vue-demo/
└── package.json
```

---

## Giấy phép

MIT © [@thangdevalone](https://github.com/thangdevalone)

Xem [LICENSE](./LICENSE) để biết chi tiết.
