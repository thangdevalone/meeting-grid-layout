// ============================================
// Types
// ============================================

/**
 * Dimensions of an element (width and height in pixels)
 */
export interface GridDimensions {
  width: number
  height: number
}

/**
 * Position of a grid item
 */
export interface Position {
  top: number
  left: number
}

/**
 * Layout modes for the grid
 * - gallery: Flexible grid that fills all available space. Supports pin mode with pinnedIndex.
 * - spotlight: Single participant in focus, others hidden
 */
export type LayoutMode = 'gallery' | 'spotlight'

/**
 * Options for creating a basic grid
 */
export interface GridOptions {
  /** Aspect ratio in format "width:height" (e.g., "16:9", "4:3") */
  aspectRatio: string
  /** Number of items in the grid */
  count: number
  /** Container dimensions */
  dimensions: GridDimensions
  /** Gap between items in pixels */
  gap: number
}

/**
 * Aspect ratio configuration for individual items
 * - string: Custom ratio like "16:9", "9:16", "4:3", "1:1"
 * - 'auto': Use actual content dimensions (requires callback)
 */
export type ItemAspectRatio = string | 'auto'

/**
 * Extended options for meet-style grid with layout modes
 */
export interface MeetGridOptions extends GridOptions {
  /** Layout mode for the grid */
  layoutMode?: LayoutMode
  /** Index of pinned/focused item (main participant for spotlight/pin modes) */
  pinnedIndex?: number
  /**
   * Position of "others" thumbnails when a participant is pinned.
   * In portrait containers, this is forced to 'bottom'.
   * @default 'right'
   */
  othersPosition?: 'left' | 'right' | 'top' | 'bottom'
  /** Maximum items per page for pagination (0 = no pagination) */
  maxItemsPerPage?: number
  /** Current page index (0-based) for pagination */
  currentPage?: number
  /**
   * Maximum visible items (0 = show all).
   * - In gallery mode without pin: limits total items displayed
   * - In gallery mode with pin: limits "others" thumbnails (pinned item always visible)
   * When set, shows a '+X' indicator on the last visible item.
   * @default 0
   */
  maxVisible?: number
  /** Current page for items (0-based), used when maxVisible > 0 for pagination */
  currentVisiblePage?: number
  /**
   * Per-item aspect ratio configurations (index-based)
   * Allows different aspect ratios per participant:
   * - Use "9:16" for mobile/portrait participants
   * - Use "16:9" for desktop/landscape participants
   * - Use undefined to inherit from global aspectRatio
   * @example
   * itemAspectRatios: ["16:9", "9:16", undefined]
   */
  itemAspectRatios?: (ItemAspectRatio | undefined)[]
  /**
   * Pre-defined responsive size for the floating PiP window.
   * 'small', 'medium', or 'large'. The actual size automatically scales based on the container size.
   * @default 'medium'
   */
  floatSize?: FloatSize
  /**
   * Index of the participant to show as the floating PiP in 2-person mode.
   * The other participant will fill the main area.
   * @default 1 (second participant)
   */
  pipIndex?: number
  /**
   * Pin-only mode. When enabled with pagination on mobile/tablet (container width <= 1024px):
   * - Page 0: Only the pinned participant is shown (full screen)
   * - Page 1+: Other participants are shown in gallery grid (without pin)
   * On desktop (width > 1024px), the layout behaves as normal sidebar.
   * @default false
   */
  pinOnly?: boolean
  /**
   * Disable the floating PiP in 2-person mode.
   * When true, 2 participants are laid out in a standard gallery grid
   * instead of one full-screen + one draggable floating PiP.
   * @default false
   */
  disableFloat?: boolean
  /**
   * If true, forces the GridItem wrappers to maintain their aspect ratio exactly.
   * On mobile screens, this prevents the grid from stretching items to fill the screen,
   * allowing them to pack efficiently according to their true aspect ratio (e.g. 4 items in 1 column instead of 2x2).
   * @default false
   */
  forceAspectRatio?: boolean
}

/**
 * Pagination info returned with grid result
 */
export interface PaginationInfo {
  /** Whether pagination is enabled */
  enabled: boolean
  /** Current page (0-based) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Items shown on current page */
  itemsOnPage: number
  /** Start index of items on current page */
  startIndex: number
  /** End index of items on current page (exclusive) */
  endIndex: number
}

/**
 * Result from grid calculations
 */
export interface GridResult {
  /** Width of each grid item */
  width: number
  /** Height of each grid item */
  height: number
  /** Number of rows */
  rows: number
  /** Number of columns */
  cols: number
  /** Function to get position of item at index */
  getPosition: (index: number) => Position
}

/**
 * Content dimensions result with positioning info
 */
export interface ContentDimensions extends GridDimensions {
  /** Offset from cell top to center the content */
  offsetTop: number
  /** Offset from cell left to center the content */
  offsetLeft: number
}

/**
 * Pre-defined responsive sizes for floating PiP.
 */
export type FloatSize = 'small' | 'medium' | 'large'

/**
 * Resolves the responsive width of a PiP window based on the container width and selected size.
 * @param containerWidth - Current container width in pixels
 * @param size - 'small' | 'medium' | 'large'
 * @returns Resolved width for the PiP
 */
export function resolveFloatWidth(containerWidth: number, size: FloatSize = 'medium'): number {
  const isMobile = containerWidth < 480
  const isTablet = containerWidth < 1024

  if (size === 'small') {
    return isMobile ? 100 : isTablet ? 140 : 180
  }
  if (size === 'large') {
    return isMobile ? 160 : isTablet ? 220 : 300
  }
  // medium (default)
  return isMobile ? 130 : isTablet ? 180 : 240
}

/**
 * Extended result for meet-style grid
 */
export interface MeetGridResult extends GridResult {
  /** Layout mode used */
  layoutMode: LayoutMode
  /** Get item cell dimensions (the grid cell size, may vary by index in some modes) */
  getItemDimensions: (index: number) => GridDimensions
  /** Check if item is the main/featured item */
  isMainItem: (index: number) => boolean
  /** Pagination info (if pagination is enabled) */
  pagination: PaginationInfo
  /** Check if item should be visible on current page */
  isItemVisible: (index: number) => boolean
  /**
   * Number of hidden items (for '+X more' indicator).
   * When maxVisible is set and there are more participants than allowed,
   * this indicates how many are hidden.
   */
  hiddenCount: number
  /**
   * Get the last visible item index in the "others" section.
   * Returns -1 if no items are visible or if there's no "others" section.
   * Useful for showing '+X more' indicator on the last visible item.
   */
  getLastVisibleOthersIndex: () => number
  /**
   * Get the actual content dimensions within a cell.
   * Use this when items have different aspect ratios (e.g., phone vs desktop).
   * Returns dimensions fitted within the cell while maintaining the item's aspect ratio.
   *
   * @param index - The item index
   * @param itemRatio - The item's aspect ratio ("16:9", "9:16", or undefined for cell dimensions)
   * @returns Content dimensions with offset for centering within the cell
   *
   * @example
   * // For a mobile participant (9:16)
   * const content = grid.getItemContentDimensions(0, "9:16")
   *
   * // Apply in React:
   * <div style={{
   *   width: content.width,
   *   height: content.height,
   *   marginTop: content.offsetTop,
   *   marginLeft: content.offsetLeft
   * }}>
   */
  getItemContentDimensions: (index: number, itemRatio?: ItemAspectRatio) => ContentDimensions
  /**
   * Index of the item that should be rendered as a floating PiP overlay.
   * When set, the component layer (GridItem) should render this item as a
   * draggable FloatingGridItem instead of a regular positioned item.
   * Used automatically in 2-person mode (Zoom-style layout).
   */
  floatIndex?: number
  /**
   * Dimensions for the floating PiP item.
   * Only set when floatIndex is defined.
   */
  floatDimensions?: GridDimensions
}

// ============================================
// Utility Functions
// ============================================

/**
 * Parses the Aspect Ratio string to actual ratio (height/width)
 * @param ratio The aspect ratio in the format of "width:height" (e.g., "16:9")
 * @returns The parsed value of aspect ratio (height/width)
 */
export function getAspectRatio(ratio: string): number {
  const [width, height] = ratio.split(':')
  if (!width || !height) {
    throw new Error(
      'meet-layout-grid: Invalid aspect ratio provided, expected format is "width:height".'
    )
  }
  return Number.parseInt(height) / Number.parseInt(width)
}

/**
 * Parse aspect ratio to get width/height multiplier
 */
export function parseAspectRatio(ratio: string): { widthRatio: number; heightRatio: number } {
  const [width, height] = ratio.split(':').map(Number)
  if (!width || !height || isNaN(width) || isNaN(height)) {
    throw new Error(
      'meet-layout-grid: Invalid aspect ratio provided, expected format is "width:height".'
    )
  }
  return { widthRatio: width, heightRatio: height }
}

/**
 * Calculate content dimensions that fit within a cell while maintaining aspect ratio
 * @param cellDimensions - The cell dimensions to fit content into
 * @param itemRatio - The content's aspect ratio ("16:9", "9:16", etc.)
 * @param defaultRatio - The default aspect ratio to use if itemRatio is undefined
 * @returns Content dimensions with offset for centering
 */
export function calculateContentDimensions(
  cellDimensions: GridDimensions,
  itemRatio?: ItemAspectRatio,
  defaultRatio?: string
): ContentDimensions {
  const { width: cellW, height: cellH } = cellDimensions

  // Determine effective ratio: use itemRatio, then defaultRatio, or fall back to full cell
  const effectiveRatio = itemRatio ?? (defaultRatio ? defaultRatio : undefined)

  // If no ratio or 'auto', return full cell dimensions
  if (!effectiveRatio || effectiveRatio === 'auto') {
    return {
      width: cellW,
      height: cellH,
      offsetTop: 0,
      offsetLeft: 0,
    }
  }

  // Parse the aspect ratio (effectiveRatio is guaranteed to be a string here)
  const ratio = getAspectRatio(effectiveRatio)

  // Calculate content dimensions that fit within cell maintaining aspect ratio
  let contentW = cellW
  let contentH = contentW * ratio

  if (contentH > cellH) {
    contentH = cellH
    contentW = contentH / ratio
  }

  // Center content within cell
  const offsetTop = (cellH - contentH) / 2
  const offsetLeft = (cellW - contentW) / 2

  return {
    width: contentW,
    height: contentH,
    offsetTop,
    offsetLeft,
  }
}

/**
 * Create a getItemContentDimensions function for a grid result
 */
function createGetItemContentDimensions(
  getItemDimensions: (index: number) => GridDimensions,
  itemAspectRatios?: (ItemAspectRatio | undefined)[],
  defaultRatio?: string
): (index: number, itemRatio?: ItemAspectRatio) => ContentDimensions {
  return (index: number, itemRatio?: ItemAspectRatio): ContentDimensions => {
    const cellDimensions = getItemDimensions(index)
    // Priority: 1. explicit itemRatio param, 2. itemAspectRatios[index], 3. defaultRatio
    const effectiveRatio = itemRatio ?? itemAspectRatios?.[index] ?? defaultRatio
    return calculateContentDimensions(cellDimensions, effectiveRatio, defaultRatio)
  }
}

// ============================================
// Core Grid Calculation
// ============================================

/**
 * Calculates grid item dimensions for items that can fit in a container.
 * Adapted from: https://stackoverflow.com/a/28268965
 */
export function getGridItemDimensions({ count, dimensions, aspectRatio, gap }: GridOptions): {
  width: number
  height: number
  rows: number
  cols: number
} {
  let { width: W, height: H } = dimensions

  if (W === 0 || H === 0 || count === 0) {
    return { width: 0, height: 0, rows: 1, cols: 1 }
  }

  // Account for outer gap
  W -= gap * 2
  H -= gap * 2

  const s = gap
  const N = count
  const r = getAspectRatio(aspectRatio)

  let w = 0
  let h = 0
  let a = 1 // cols
  let b = 1 // rows

  const minCols = 1

  const widths: number[] = []

  for (let n = 1; n <= N; n++) {
    widths.push((W - s * (n - 1)) / n, (H - s * (n - 1)) / (n * r))
  }

  // Sort in descending order, largest first
  widths.sort((a, b) => b - a)

  for (const width of widths) {
    w = width
    h = w * r

    a = Math.floor((W + s) / (w + s))
    b = Math.floor((H + s) / (h + s))

    // Ensure minimum columns constraint
    if (a < minCols && N >= minCols) {
      continue
    }

    if (a * b >= N) {
      // Recalculate rows and cols for accuracy
      a = Math.max(minCols, Math.ceil(N / b))
      b = Math.ceil(N / a)
      break
    }
  }

  // Final check: ensure minimum columns
  if (a < minCols && N >= minCols) {
    a = minCols
    b = Math.ceil(N / a)
    // Recalculate dimensions for new grid
    w = (W - s * (a - 1)) / a
    h = w * r
    // Check if height fits
    const requiredHeight = b * h + (b - 1) * s
    if (requiredHeight > H) {
      const scale = H / requiredHeight
      h = h * scale
      w = h / r
    }
  }

  return { width: w, height: h, rows: b, cols: a }
}

/**
 * Creates a utility function which helps you position grid items in a container.
 */
export function createGridItemPositioner({
  parentDimensions,
  dimensions,
  rows,
  cols,
  count,
  gap,
}: {
  parentDimensions: GridDimensions
  dimensions: GridDimensions
  rows: number
  cols: number
  count: number
  gap: number
}): (index: number) => Position {
  const { width: W, height: H } = parentDimensions
  const { width: w, height: h } = dimensions

  const firstTop = (H - (h * rows + (rows - 1) * gap)) / 2
  let firstLeft = (W - (w * cols + (cols - 1) * gap)) / 2

  const topAdd = h + gap
  const leftAdd = w + gap

  const incompleteRowCols = count % cols
  const lastRowStartIndex = incompleteRowCols > 0 ? count - incompleteRowCols : count - cols

  function getPosition(index: number): Position {
    // Calculate row and col directly from index (pure function)
    const row = Math.floor(index / cols)
    const col = index % cols

    // Check if this item is in the last incomplete row
    const isInLastRow = incompleteRowCols > 0 && index >= lastRowStartIndex

    let leftOffset = firstLeft
    if (isInLastRow) {
      // Center the incomplete last row
      const lastRowItemCount = incompleteRowCols
      const colInLastRow = index - lastRowStartIndex
      leftOffset = (W - (w * lastRowItemCount + (lastRowItemCount - 1) * gap)) / 2

      const top = firstTop + row * topAdd
      const left = leftOffset + colInLastRow * leftAdd
      return { top, left }
    }

    const top = firstTop + row * topAdd
    const left = leftOffset + col * leftAdd

    return { top, left }
  }

  return getPosition
}

/**
 * Calculates data required for making a responsive grid.
 */
export function createGrid({ aspectRatio, count, dimensions, gap }: GridOptions): GridResult {
  const { width, height, rows, cols } = getGridItemDimensions({
    aspectRatio,
    count,
    dimensions,
    gap,
  })

  const getPosition = createGridItemPositioner({
    parentDimensions: dimensions,
    dimensions: { width, height },
    rows,
    cols,
    count,
    gap,
  })

  return {
    width,
    height,
    rows,
    cols,
    getPosition,
  }
}

// ============================================
// Meet Grid (with Layout Modes)
// ============================================

/**
 * Create a flexible pin layout grid.
 * Pinned item fills the main area, others are arranged in a compact grid.
 * On portrait containers, others go bottom. On landscape, others go to the specified position.
 */
function createFlexiblePinGrid(options: MeetGridOptions): MeetGridResult {
  const {
    dimensions,
    gap,
    aspectRatio,
    count,
    othersPosition = 'right',
    pinnedIndex = 0,
    maxVisible = 0,
    currentVisiblePage = 0,
    pinOnly = false,
  } = options

  if (count === 0) {
    return createEmptyMeetGridResult('gallery')
  }

  if (count === 1) {
    // Single item fills entire container
    const { width: W, height: H } = dimensions
    const mainWidth = W - gap * 2
    const mainHeight = H - gap * 2
    const getItemDimensions = () => ({ width: mainWidth, height: mainHeight })
    const pagination = createDefaultPagination(1)
    return {
      width: mainWidth,
      height: mainHeight,
      rows: 1,
      cols: 1,
      layoutMode: 'gallery',
      getPosition: () => ({ top: gap, left: gap }),
      getItemDimensions,
      isMainItem: () => true,
      pagination,
      isItemVisible: () => true,
      hiddenCount: 0,
      getLastVisibleOthersIndex: () => -1,
      getItemContentDimensions: createGetItemContentDimensions(
        getItemDimensions,
        options.itemAspectRatios,
        aspectRatio
      ),
    }
  }

  // pinOnly mode on mobile/tablet (width <= 1024px)
  const { width: W, height: H } = dimensions
  const isMobileTablet = W <= 1024

  if (pinOnly && isMobileTablet && count > 1) {
    const totalOthers = count - 1
    const othersPerPage = maxVisible > 0 ? maxVisible : totalOthers
    const othersTotalPages = Math.ceil(totalOthers / othersPerPage)
    // Total pages: page 0 = pin only, page 1+ = others gallery
    const totalPinOnlyPages = 1 + othersTotalPages
    const safeCurrentPage = Math.min(currentVisiblePage, Math.max(0, totalPinOnlyPages - 1))

    if (safeCurrentPage === 0) {
      // Page 0: pinned participant fills entire container
      const mainW = W - gap * 2
      const mainH = H - gap * 2
      const getItemDimensions = (index: number) =>
        index === pinnedIndex ? { width: mainW, height: mainH } : { width: 0, height: 0 }
      return {
        width: mainW,
        height: mainH,
        rows: 1,
        cols: 1,
        layoutMode: 'gallery' as LayoutMode,
        getPosition: (index: number) =>
          index === pinnedIndex ? { top: gap, left: gap } : { top: -9999, left: -9999 },
        getItemDimensions,
        isMainItem: (index: number) => index === pinnedIndex,
        pagination: {
          enabled: true,
          currentPage: safeCurrentPage,
          totalPages: totalPinOnlyPages,
          itemsOnPage: 1,
          startIndex: 0,
          endIndex: 1,
        },
        isItemVisible: (index: number) => index === pinnedIndex,
        hiddenCount: 0,
        getLastVisibleOthersIndex: () => -1,
        getItemContentDimensions: createGetItemContentDimensions(
          getItemDimensions,
          options.itemAspectRatios,
          aspectRatio
        ),
      }
    } else {
      // Page 1+: others in gallery grid (pin is hidden)
      const othersPageIndex = safeCurrentPage - 1
      const startIdx = othersPageIndex * othersPerPage
      const endIdx = Math.min(startIdx + othersPerPage, totalOthers)
      const itemsOnPage = endIdx - startIdx

      // Build ordered list of others indices (excluding pinned)
      const othersIndices: number[] = []
      for (let i = 0; i < count; i++) {
        if (i !== pinnedIndex) othersIndices.push(i)
      }

      // Get the visible subset
      const visibleIndices = othersIndices.slice(startIdx, endIdx)
      const visibleSet = new Set(visibleIndices)

      // Create uniform-fill layout: items stretch to fill entire container
      // Like a CSS grid with equal rows/columns, no aspect ratio constraint
      const availW = W - gap * 2
      const availH = H - gap * 2

      // Layout: 1 col for <=2 items, 2 cols for 3+
      const gridCols = itemsOnPage <= 2 ? 1 : 2
      const gridRows = Math.ceil(itemsOnPage / gridCols)
      const cellW = (availW - (gridCols - 1) * gap) / gridCols
      const cellH = (availH - (gridRows - 1) * gap) / gridRows

      // Items in the last row stretch to fill the full width
      const itemsInLastRow = itemsOnPage % gridCols || gridCols
      const lastRowCellW = itemsInLastRow < gridCols
        ? (availW - (itemsInLastRow - 1) * gap) / itemsInLastRow
        : cellW

      // Map original index to gallery position
      const indexToGalleryPos = new Map<number, number>()
      visibleIndices.forEach((origIdx, galIdx) => {
        indexToGalleryPos.set(origIdx, galIdx)
      })

      const lastRowStartIdx = (gridRows - 1) * gridCols
      const isInLastRow = (galIdx: number) => galIdx >= lastRowStartIdx

      const getItemDimensions = (index: number) => {
        const galPos = indexToGalleryPos.get(index)
        if (galPos === undefined) return { width: 0, height: 0 }
        const w = isInLastRow(galPos) ? lastRowCellW : cellW
        return { width: w, height: cellH }
      }

      const getPosition = (index: number): Position => {
        const galPos = indexToGalleryPos.get(index)
        if (galPos === undefined) return { top: -9999, left: -9999 }
        const row = Math.floor(galPos / gridCols)
        const col = galPos % gridCols
        const isLast = isInLastRow(galPos)
        const w = isLast ? lastRowCellW : cellW
        const left = gap + col * (w + gap)
        const top = gap + row * (cellH + gap)
        return { top, left }
      }

      return {
        width: cellW,
        height: cellH,
        rows: gridRows,
        cols: gridCols,
        layoutMode: 'gallery' as LayoutMode,
        getPosition,
        getItemDimensions,
        isMainItem: () => false,
        pagination: {
          enabled: true,
          currentPage: safeCurrentPage,
          totalPages: totalPinOnlyPages,
          itemsOnPage,
          startIndex: startIdx,
          endIndex: endIdx,
        },
        isItemVisible: (index: number) => visibleSet.has(index),
        hiddenCount: 0,
        getLastVisibleOthersIndex: () => -1,
        getItemContentDimensions: createGetItemContentDimensions(
          getItemDimensions,
          options.itemAspectRatios,
          aspectRatio
        ),
      }
    }
  }

  const isPortrait = H > W
  const effectivePosition = isPortrait ? 'bottom' : othersPosition
  const isVertical = effectivePosition === 'bottom' || effectivePosition === 'top'
  const ratio = getAspectRatio(aspectRatio)

  // Calculate others pagination
  const totalOthers = count - 1
  const visibleOthers = maxVisible > 0 ? Math.min(maxVisible, totalOthers) : totalOthers

  const othersTotalPages = maxVisible > 0 ? Math.ceil(totalOthers / maxVisible) : 1
  const safeCurrentVisiblePage = Math.min(currentVisiblePage, Math.max(0, othersTotalPages - 1))
  const startOthersIndex = safeCurrentVisiblePage * (maxVisible > 0 ? maxVisible : totalOthers)
  const endOthersIndex = Math.min(startOthersIndex + visibleOthers, totalOthers)
  const itemsOnPage = endOthersIndex - startOthersIndex
  const isPaginationMode = othersTotalPages > 1
  const isActivelyPaginating = isPaginationMode && currentVisiblePage > 0
  const hiddenCount = isActivelyPaginating
    ? 0
    : totalOthers > itemsOnPage
      ? totalOthers - itemsOnPage + 1
      : 0

  // Determine optimal others area size
  let mainWidth: number
  let mainHeight: number
  let othersAreaWidth: number
  let othersAreaHeight: number

  if (isVertical) {
    // Others on top/bottom — find best row configuration
    const areaW = W - gap * 2
    const isMobilePin = W < 500

    if (isMobilePin && isPortrait && visibleOthers > 0) {
      // Mobile portrait pin: fixed 60/40 split — pin gets ~60%, others get ~40%
      othersAreaHeight = H * 0.4 - gap
      othersAreaWidth = areaW
    } else {
      // Non-mobile or landscape: search for best layout
      const othersRatio = isPortrait ? 1 : ratio

      let bestOthersH = 0
      let bestThumbArea = 0
      const maxRows = Math.min(3, visibleOthers || 1)
      const maxOthersRatio = 0.5

      for (let rows = 1; rows <= maxRows; rows++) {
        const cols = Math.ceil((visibleOthers || 1) / rows)
        const thumbW = (areaW - (cols - 1) * gap) / cols
        const thumbH = thumbW * othersRatio
        const requiredH = rows * thumbH + (rows - 1) * gap

        const areaRatio = requiredH / H
        if (areaRatio > maxOthersRatio) continue
        if (thumbH < 40) continue

        const thumbArea = thumbW * thumbH
        if (thumbArea > bestThumbArea) {
          bestThumbArea = thumbArea
          bestOthersH = requiredH
        }
      }

      if (bestOthersH === 0) {
        bestOthersH = H * (isPortrait ? 0.25 : 0.2)
      }

      const minRatio = 0.12
      const maxRatio = 0.45
      if (bestOthersH / H < minRatio) bestOthersH = H * minRatio
      else if (bestOthersH / H > maxRatio) bestOthersH = H * maxRatio

      othersAreaHeight = bestOthersH
      othersAreaWidth = areaW
    }

    mainHeight = H - othersAreaHeight - gap * 3
    mainWidth = areaW
  } else {
    // Others on left/right — find best column configuration
    const areaH = H - gap * 2

    let bestOthersW = W * 0.2
    let bestScore = 0
    const maxCols = Math.min(3, visibleOthers || 1)

    for (let cols = 1; cols <= maxCols; cols++) {
      const rows = Math.ceil((visibleOthers || 1) / cols)
      const thumbH = (areaH - (rows - 1) * gap) / rows
      const thumbW = thumbH / ratio
      const requiredW = cols * thumbW + (cols - 1) * gap

      const areaRatio = requiredW / W
      const thumbArea = thumbW * thumbH
      const mainAreaBonus = (1 - areaRatio) * 0.5
      const score = thumbArea * (1 + mainAreaBonus)

      if (areaRatio >= 0.1 && areaRatio <= 0.4 && score > bestScore) {
        bestOthersW = requiredW
        bestScore = score
      }
    }

    if (bestOthersW / W < 0.1) bestOthersW = W * 0.12
    else if (bestOthersW / W > 0.4) bestOthersW = W * 0.35

    othersAreaWidth = bestOthersW
    othersAreaHeight = areaH
    mainWidth = W - othersAreaWidth - gap * 3
    mainHeight = areaH
  }

  // Main item fills entire main area
  const mainItemWidth = mainWidth
  const mainItemHeight = mainHeight

  const positions: { position: Position; dimensions: GridDimensions }[] = []

  // Position main item
  let mainLeft: number
  let mainTop: number

  if (isVertical) {
    mainLeft = gap + (mainWidth - mainItemWidth) / 2
    mainTop =
      effectivePosition === 'top'
        ? othersAreaHeight + gap * 2 + (mainHeight - mainItemHeight) / 2
        : gap + (mainHeight - mainItemHeight) / 2
  } else {
    mainLeft =
      effectivePosition === 'left'
        ? othersAreaWidth + gap * 2 + (mainWidth - mainItemWidth) / 2
        : gap + (mainWidth - mainItemWidth) / 2
    mainTop = gap + (mainHeight - mainItemHeight) / 2
  }

  positions[pinnedIndex] = {
    position: { top: mainTop, left: mainLeft },
    dimensions: { width: mainItemWidth, height: mainItemHeight },
  }

  // Layout others with uniform grid inside their area
  {
    const isMobileOthers = W < 500
    const othersRatio = isPortrait ? 1 : ratio

    let thumbCols = 1
    let thumbRows = 1
    let thumbWidth = 0
    let thumbHeight = 0

    if (visibleOthers > 0) {
      if (isVertical) {
        if (isMobileOthers && isPortrait) {
          // Mobile portrait: uniform-fill — items stretch to fill entire others area
          thumbCols = visibleOthers <= 2 ? 1 : Math.min(visibleOthers, 2)
          thumbRows = Math.ceil(visibleOthers / thumbCols)
          thumbWidth = (othersAreaWidth - (thumbCols - 1) * gap) / thumbCols
          thumbHeight = (othersAreaHeight - (thumbRows - 1) * gap) / thumbRows
        } else {
          // Normal: search for best layout maintaining ratio
          let bestScore = -1
          for (let cols = 1; cols <= visibleOthers; cols++) {
            const rows = Math.ceil(visibleOthers / cols)
            const maxTileW = (othersAreaWidth - (cols - 1) * gap) / cols
            const maxTileH = (othersAreaHeight - (rows - 1) * gap) / rows

            let tileW = maxTileW
            let tileH = tileW * othersRatio
            if (tileH > maxTileH) {
              tileH = maxTileH
              tileW = tileH / othersRatio
            }

            const area = tileW * tileH
            const colsMultiplier = cols >= rows ? 1.5 : 0.5
            const score = area * colsMultiplier

            if (score > bestScore) {
              bestScore = score
              thumbCols = cols
              thumbRows = rows
              thumbWidth = tileW
              thumbHeight = tileH
            }
          }
        }
      } else {
        let bestScore = -1
        const targetRatio = 1 / ratio

        for (let rows = 1; rows <= visibleOthers; rows++) {
          const cols = Math.ceil(visibleOthers / rows)

          const maxTileH = (othersAreaHeight - (rows - 1) * gap) / rows
          const idealTileW = maxTileH * targetRatio
          const maxTileW = (othersAreaWidth - (cols - 1) * gap) / cols

          let tileW: number, tileH: number

          if (idealTileW <= maxTileW) {
            tileW = idealTileW
            tileH = maxTileH
          } else {
            tileW = maxTileW
            tileH = tileW / targetRatio
          }

          const area = tileW * tileH * visibleOthers
          if (area > bestScore) {
            bestScore = area
            thumbCols = cols
            thumbRows = rows
            thumbWidth = tileW
            thumbHeight = tileH
          }
        }
      }
    }

    // Last row stretching for mobile portrait uniform-fill
    const itemsInLastRow = itemsOnPage % thumbCols || thumbCols
    const useUniformFill = isMobileOthers && isPortrait && isVertical
    const lastRowThumbW = useUniformFill && itemsInLastRow < thumbCols
      ? (othersAreaWidth - (itemsInLastRow - 1) * gap) / itemsInLastRow
      : thumbWidth

    // Calculate grid start position
    const totalGridWidth = thumbCols * thumbWidth + (thumbCols - 1) * gap
    const totalGridHeight = thumbRows * thumbHeight + (thumbRows - 1) * gap

    let gridStartLeft: number
    let gridStartTop: number

    if (isVertical) {
      gridStartLeft = useUniformFill ? gap : gap + (othersAreaWidth - totalGridWidth) / 2
      gridStartTop =
        effectivePosition === 'top'
          ? useUniformFill ? gap : gap + (othersAreaHeight - totalGridHeight) / 2
          : useUniformFill ? mainHeight + gap * 2 : mainHeight + gap * 2 + (othersAreaHeight - totalGridHeight) / 2
    } else {
      gridStartLeft =
        effectivePosition === 'left'
          ? gap + (othersAreaWidth - totalGridWidth) / 2
          : mainWidth + gap * 2 + (othersAreaWidth - totalGridWidth) / 2
      gridStartTop = gap + (othersAreaHeight - totalGridHeight) / 2
    }

    let othersIndex = 0
    for (let i = 0; i < count; i++) {
      if (i === pinnedIndex) continue

      const isInVisibleRange = othersIndex >= startOthersIndex && othersIndex < endOthersIndex

      if (isInVisibleRange) {
        const pageRelativeIndex = othersIndex - startOthersIndex
        const row = Math.floor(pageRelativeIndex / thumbCols)
        const col = pageRelativeIndex % thumbCols

        const lastRowIndex = Math.ceil(itemsOnPage / thumbCols) - 1
        const isLastRow = row === lastRowIndex && itemsInLastRow < thumbCols

        let itemW: number
        let rowLeft: number

        if (useUniformFill && isLastRow) {
          // Uniform-fill: last row items stretch to full width
          itemW = lastRowThumbW
          rowLeft = gridStartLeft
        } else if (!useUniformFill && isLastRow) {
          // Standard: center last incomplete row
          itemW = thumbWidth
          const rowWidth = itemsInLastRow * thumbWidth + (itemsInLastRow - 1) * gap
          if (isVertical) {
            rowLeft = gap + (othersAreaWidth - rowWidth) / 2
          } else {
            rowLeft =
              (effectivePosition === 'left' ? gap : mainWidth + gap * 2) +
              (othersAreaWidth - rowWidth) / 2
          }
        } else {
          itemW = thumbWidth
          rowLeft = gridStartLeft
        }

        positions[i] = {
          position: {
            top: gridStartTop + row * (thumbHeight + gap),
            left: rowLeft + col * (itemW + gap),
          },
          dimensions: { width: itemW, height: thumbHeight },
        }
      } else {
        positions[i] = {
          position: { top: -9999, left: -9999 },
          dimensions: { width: 0, height: 0 },
        }
      }
      othersIndex++
    }
  }

  // Create pagination info for others
  const pagination: PaginationInfo = {
    enabled: maxVisible > 0 && totalOthers > maxVisible,
    currentPage: safeCurrentVisiblePage,
    totalPages: othersTotalPages,
    itemsOnPage: itemsOnPage,
    startIndex: startOthersIndex,
    endIndex: endOthersIndex,
  }

  const getItemDimensions = (index: number) =>
    positions[index]?.dimensions ?? { width: 0, height: 0 }

  // Calculate last visible others index
  const getLastVisibleOthersIndex = (): number => {
    if (itemsOnPage === 0) return -1
    let othersIdx = 0
    let lastVisibleOriginalIdx = -1
    for (let i = 0; i < count; i++) {
      if (i === pinnedIndex) continue
      if (othersIdx >= startOthersIndex && othersIdx < endOthersIndex) {
        lastVisibleOriginalIdx = i
      }
      othersIdx++
    }
    return lastVisibleOriginalIdx
  }

  return {
    width: mainItemWidth,
    height: mainItemHeight,
    rows: isVertical ? 2 : 1,
    cols: isVertical ? 1 : 2,
    layoutMode: 'gallery',
    getPosition: (index: number) => positions[index]?.position ?? { top: 0, left: 0 },
    getItemDimensions,
    isMainItem: (index: number) => index === pinnedIndex,
    pagination,
    isItemVisible: (index: number) => {
      if (index === pinnedIndex) return true
      let sIdx = 0
      for (let i = 0; i < index; i++) {
        if (i !== pinnedIndex) sIdx++
      }
      return sIdx >= startOthersIndex && sIdx < endOthersIndex
    },
    hiddenCount,
    getLastVisibleOthersIndex,
    getItemContentDimensions: createGetItemContentDimensions(
      getItemDimensions,
      options.itemAspectRatios,
      aspectRatio
    ),
  }
}

/**
 * Create a spotlight layout (single item in focus)
 */
function createSpotlightGrid(options: MeetGridOptions): MeetGridResult {
  const { dimensions, gap, aspectRatio, pinnedIndex = 0, itemAspectRatios } = options
  const { width: W, height: H } = dimensions

  // Get the item's aspect ratio
  const itemRatio = itemAspectRatios?.[pinnedIndex]
  const shouldFill = itemRatio === 'auto'

  let spotWidth: number
  let spotHeight: number

  if (shouldFill) {
    // Fill mode: spotlight fills entire container
    spotWidth = W - gap * 2
    spotHeight = H - gap * 2
  } else {
    // Standard mode: maintain aspect ratio
    const ratio = itemRatio ? getAspectRatio(itemRatio) : getAspectRatio(aspectRatio)
    spotWidth = W - gap * 2
    spotHeight = spotWidth * ratio
    if (spotHeight > H - gap * 2) {
      spotHeight = H - gap * 2
      spotWidth = spotHeight / ratio
    }
  }

  const position: Position = {
    top: gap + (H - gap * 2 - spotHeight) / 2,
    left: gap + (W - gap * 2 - spotWidth) / 2,
  }

  const pagination = createDefaultPagination(1) // Spotlight shows only 1 item
  const getItemDimensions = (index: number) =>
    index === pinnedIndex ? { width: spotWidth, height: spotHeight } : { width: 0, height: 0 }

  return {
    width: spotWidth,
    height: spotHeight,
    rows: 1,
    cols: 1,
    layoutMode: 'spotlight',
    getPosition: (index: number) =>
      index === pinnedIndex ? position : { top: -9999, left: -9999 },
    getItemDimensions,
    isMainItem: (index: number) => index === pinnedIndex,
    pagination,
    isItemVisible: (index: number) => index === pinnedIndex,
    hiddenCount: 0,
    getLastVisibleOthersIndex: () => -1,
    getItemContentDimensions: createGetItemContentDimensions(
      getItemDimensions,
      options.itemAspectRatios,
      aspectRatio
    ),
  }
}

/**
 * Create default pagination info (no pagination)
 */
function createDefaultPagination(count: number): PaginationInfo {
  return {
    enabled: false,
    currentPage: 0,
    totalPages: 1,
    itemsOnPage: count,
    startIndex: 0,
    endIndex: count,
  }
}

/**
 * Create pagination info based on options
 */
function createPaginationInfo(
  count: number,
  maxItemsPerPage?: number,
  currentPage?: number
): PaginationInfo {
  if (!maxItemsPerPage || maxItemsPerPage <= 0 || maxItemsPerPage >= count) {
    return createDefaultPagination(count)
  }

  const totalPages = Math.ceil(count / maxItemsPerPage)
  const page = Math.min(Math.max(0, currentPage ?? 0), totalPages - 1)
  const startIndex = page * maxItemsPerPage
  const endIndex = Math.min(startIndex + maxItemsPerPage, count)

  return {
    enabled: true,
    currentPage: page,
    totalPages,
    itemsOnPage: endIndex - startIndex,
    startIndex,
    endIndex,
  }
}

/**
 * Create an empty meet grid result
 */
function createEmptyMeetGridResult(layoutMode: LayoutMode): MeetGridResult {
  const getItemDimensions = () => ({ width: 0, height: 0 })
  return {
    width: 0,
    height: 0,
    rows: 0,
    cols: 0,
    layoutMode,
    getPosition: () => ({ top: 0, left: 0 }),
    getItemDimensions,
    isMainItem: () => false,
    pagination: createDefaultPagination(0),
    isItemVisible: () => false,
    hiddenCount: 0,
    getLastVisibleOthersIndex: () => -1,
    getItemContentDimensions: () => ({ width: 0, height: 0, offsetTop: 0, offsetLeft: 0 }),
  }
}

/**
 * Create a flexible gallery grid using a justified layout algorithm.
 * Uses binary search to find the optimal row height that fills the container.
 * Items are packed greedily into rows, then each row is scaled to fill width.
 */
function createFlexibleGalleryGrid(options: MeetGridOptions): MeetGridResult {
  const {
    dimensions,
    gap,
    aspectRatio,
    count,
    itemAspectRatios = [],
    maxItemsPerPage,
    currentPage,
    maxVisible = 0,
  } = options

  if (count === 0) {
    return createEmptyMeetGridResult('gallery')
  }

  const { width: W, height: H } = dimensions
  const availW = W - gap * 2
  const availH = H - gap * 2

  // --- Pagination / Visual capping ---
  let hiddenCount = 0
  let startIndex = 0
  let endIndex = count

  const pagination: PaginationInfo =
    maxItemsPerPage && maxItemsPerPage > 0
      ? createPaginationInfo(count, maxItemsPerPage, currentPage)
      : {
        enabled: false,
        currentPage: 0,
        totalPages: 1,
        itemsOnPage: count,
        startIndex: 0,
        endIndex: count,
      }

  if (pagination.enabled) {
    startIndex = pagination.startIndex
    endIndex = pagination.endIndex
  } else if (maxVisible > 0 && count > maxVisible) {
    hiddenCount = count - maxVisible + 1
    startIndex = 0
    endIndex = maxVisible
  }

  // Slice to only visible items for layout
  const visibleIndices: number[] = []
  for (let i = startIndex; i < endIndex; i++) {
    visibleIndices.push(i)
  }

  // For each visible item, compute width/height ratio
  const itemWHRatios: number[] = []
  for (const idx of visibleIndices) {
    const ratioStr = itemAspectRatios[idx] ?? aspectRatio
    const hw = getAspectRatio(ratioStr)
    itemWHRatios.push(1 / hw) // width / height
  }

  const effectiveCount = visibleIndices.length

  // --- Find optimal row distribution that maximizes space utilization ---
  // Uses area-based scoring: for each candidate row count, compute the total
  // item area after uniform scaling and weight it by vertical fill ratio.
  // This prevents single-row layouts from winning when they waste lots of
  // vertical space (common with mixed aspect ratios like 4:3 + 9:16).

  // Compute total height for a given row count without allocating arrays
  // Just walks itemWHRatios directly using row sizes
  function computeTotalHeightForRows(numRows: number): number {
    const base = Math.floor(effectiveCount / numRows)
    const extra = effectiveCount % numRows
    let totalH = 0
    let itemIdx = 0

    for (let r = 0; r < numRows; r++) {
      const rowSize = base + (r < extra ? 1 : 0)
      let totalUnitW = 0
      for (let i = 0; i < rowSize; i++) {
        totalUnitW += itemWHRatios[itemIdx + i]
      }
      const netW = availW - (rowSize - 1) * gap
      totalH += netW / totalUnitW
      itemIdx += rowSize
    }

    return totalH + (numRows - 1) * gap
  }

  // Compute total item area (sum of width*height for all items) at natural scale
  function computeTotalAreaForRows(numRows: number): number {
    const base = Math.floor(effectiveCount / numRows)
    const extra = effectiveCount % numRows
    let totalArea = 0
    let itemIdx = 0

    for (let r = 0; r < numRows; r++) {
      const rowSize = base + (r < extra ? 1 : 0)
      let totalUnitW = 0
      for (let i = 0; i < rowSize; i++) {
        totalUnitW += itemWHRatios[itemIdx + i]
      }
      const netW = availW - (rowSize - 1) * gap
      const rowH = netW / totalUnitW
      for (let i = 0; i < rowSize; i++) {
        const itemW = (itemWHRatios[itemIdx + i] / totalUnitW) * netW
        totalArea += itemW * rowH
      }
      itemIdx += rowSize
    }

    return totalArea
  }

  // Build distribution array for the chosen row count
  function distributeEvenly(numRows: number): number[][] {
    const result: number[][] = []
    const base = Math.floor(effectiveCount / numRows)
    const extra = effectiveCount % numRows
    let idx = 0
    for (let r = 0; r < numRows; r++) {
      const size = base + (r < extra ? 1 : 0)
      result.push(Array.from({ length: size }, (_, i) => idx + i))
      idx += size
    }
    return result
  }

  let bestRowCount = 1
  let bestScore = -1
  const maxTryRows = Math.min(effectiveCount, Math.ceil(Math.sqrt(effectiveCount) * 2.5))

  for (let numRows = 1; numRows <= maxTryRows; numRows++) {
    if (Math.floor(effectiveCount / numRows) === 0) break

    const totalH = computeTotalHeightForRows(numRows)
    const scale = Math.min(1.0, availH / totalH)
    const scaledTotalH = totalH * scale + (scale < 1.0 ? 0 : 0)

    // Average item area after scaling (scale affects both dimensions)
    const naturalArea = computeTotalAreaForRows(numRows)
    const scaledArea = naturalArea * scale * scale
    const avgItemArea = scaledArea / effectiveCount

    // How much of the vertical space is actually filled by items
    const fillRatio = Math.min(1.0, scaledTotalH / availH)

    // Score: maximize item area, weighted by fill ratio.
    // fillRatio^1.5 strongly penalizes layouts with large empty gaps
    // (e.g., 1 row using only 60% of height gets fillRatio=0.6, penalty=0.46)
    const score = avgItemArea * Math.pow(fillRatio, 1.5)

    if (score > bestScore) {
      bestScore = score
      bestRowCount = numRows
    }
  }

  const bestRows = distributeEvenly(bestRowCount)

  // posArr maps relative index (0..effectiveCount-1) -> layout info
  const posArr: { position: Position; dimensions: GridDimensions }[] = new Array(effectiveCount)
  const rowCount = bestRows.length

  // Calculate natural row heights (each row fills width, maintaining aspect ratio)
  const rowHeights: number[] = []
  for (const row of bestRows) {
    const totalUnitW = row.reduce((s, relIdx) => s + itemWHRatios[relIdx], 0)
    const netW = availW - (row.length - 1) * gap
    rowHeights.push(netW / totalUnitW)
  }

  const totalRowH = rowHeights.reduce((s, h) => s + h, 0) + (rowCount - 1) * gap
  // Uniform scaling preserves aspect ratios. Cap at 1.0 so rows don't overflow width.
  const globalScale = Math.min(1.0, availH / totalRowH)

  // Center vertically when there's remaining space
  const scaledTotalH = rowHeights.reduce((s, h) => s + h * globalScale, 0) + (rowCount - 1) * gap
  const verticalOffset = (availH - scaledTotalH) / 2

  let currentTop = gap + verticalOffset
  for (let ri = 0; ri < rowCount; ri++) {
    const row = bestRows[ri]
    const finalRowH = rowHeights[ri] * globalScale

    const totalUnitW = row.reduce((s, relIdx) => s + itemWHRatios[relIdx], 0)
    const netW = availW - (row.length - 1) * gap
    // Scale widths uniformly with heights to maintain correct aspect ratios
    const itemWidths = row.map((relIdx) => (itemWHRatios[relIdx] / totalUnitW) * netW * globalScale)

    // Center row horizontally
    const scaledRowW = itemWidths.reduce((s, w) => s + w, 0) + (row.length - 1) * gap
    const horizontalOffset = (availW - scaledRowW) / 2

    let currentLeft = gap + horizontalOffset
    for (let ci = 0; ci < row.length; ci++) {
      posArr[row[ci]] = {
        position: { top: currentTop, left: currentLeft },
        dimensions: { width: itemWidths[ci], height: finalRowH },
      }
      currentLeft += itemWidths[ci] + gap
    }
    currentTop += finalRowH + gap
  }

  // Map original (absolute) index -> position via relative index
  const getPosition = (index: number): Position => {
    const relativeIndex = index - startIndex
    if (relativeIndex < 0 || relativeIndex >= effectiveCount) {
      return { top: -9999, left: -9999 }
    }
    return posArr[relativeIndex]?.position ?? { top: -9999, left: -9999 }
  }

  const getItemDimensions = (index: number): GridDimensions => {
    const relativeIndex = index - startIndex
    if (relativeIndex < 0 || relativeIndex >= effectiveCount) {
      return { width: 0, height: 0 }
    }
    return posArr[relativeIndex]?.dimensions ?? { width: 0, height: 0 }
  }

  const lastVisibleIndex = endIndex - 1

  return {
    width: availW,
    height: availH,
    rows: rowCount,
    cols: rowCount > 0 ? Math.max(...bestRows.map((r) => r.length)) : 0,
    layoutMode: 'gallery',
    getPosition,
    getItemDimensions,
    isMainItem: () => false,
    pagination,
    isItemVisible: (index: number) => index >= startIndex && index < endIndex,
    hiddenCount,
    getLastVisibleOthersIndex: () => (hiddenCount > 0 ? lastVisibleIndex : -1),
    getItemContentDimensions: createGetItemContentDimensions(
      getItemDimensions,
      itemAspectRatios,
      aspectRatio
    ),
  }
}

/**
 * Create a meet-style grid with support for different layout modes.
 * This is the main function for creating video conferencing-style layouts.
 */
export function createMeetGrid(options: MeetGridOptions): MeetGridResult {
  const { layoutMode = 'gallery', count } = options

  if (count === 0) {
    return createEmptyMeetGridResult(layoutMode)
  }

  switch (layoutMode) {
    case 'spotlight':
      return createSpotlightGrid(options)

    case 'gallery':
    default: {
      const { maxItemsPerPage, currentPage, pinnedIndex, maxVisible = 0 } = options

      // Gallery with pin uses flexible pin layout
      if (pinnedIndex !== undefined && pinnedIndex >= 0 && pinnedIndex < count) {
        return createFlexiblePinGrid(options)
      }

      // 2-person mode: Zoom-style float layout
      // One person fills entire container edge-to-edge (like zoom mode with gap=0)
      // The other becomes draggable floating PiP (controlled by pipIndex)
      // Skip when disableFloat is true — fall through to standard gallery grid
      if (count === 2 && !options.disableFloat) {
        const { width: W, height: H } = options.dimensions

        // Determine which index is float and which is main
        const floatIdx = options.pipIndex !== undefined && options.pipIndex >= 0 && options.pipIndex < 2
          ? options.pipIndex
          : 1
        const mainIdx = floatIdx === 0 ? 1 : 0

        // Main person fills ENTIRE container — no gap, edge-to-edge (matches zoom mode)
        const mainWidth = W
        const mainHeight = H

        // Float PiP dimensions — use constant area to ensure visual consistency
        // This ensures 16:9, 9:16, 4:3, and 1:1 all look equally sized
        const ratioStr = options.itemAspectRatios?.[floatIdx] ?? options.aspectRatio
        const hwRatio = getAspectRatio(ratioStr)
        const baseSize = resolveFloatWidth(W, options.floatSize ?? 'medium')
        const baseArea = baseSize * baseSize
        
        const floatW = Math.sqrt(baseArea / hwRatio)
        const floatH = Math.sqrt(baseArea * hwRatio)

        const pagination = createDefaultPagination(2)
        const getItemDimensions = (index: number) =>
          index === mainIdx ? { width: mainWidth, height: mainHeight } : { width: floatW, height: floatH }

        return {
          width: mainWidth,
          height: mainHeight,
          rows: 1,
          cols: 1,
          layoutMode: 'gallery' as LayoutMode,
          getPosition: (index: number) =>
            index === mainIdx ? { top: 0, left: 0 } : { top: -9999, left: -9999 },
          getItemDimensions,
          isMainItem: (index: number) => index === mainIdx,
          pagination,
          isItemVisible: () => true,
          hiddenCount: 0,
          getLastVisibleOthersIndex: () => -1,
          getItemContentDimensions: createGetItemContentDimensions(
            getItemDimensions,
            options.itemAspectRatios,
            options.aspectRatio
          ),
          floatIndex: floatIdx,
          floatDimensions: { width: floatW, height: floatH },
        }
      }

      // Small mobile screens (width < 500px): override aspectRatio to container ratio
      // This ensures items stretch to fill the screen in a proper grid (2x2, 2x3, etc.)
      // instead of single-column layouts that waste space on small screens
      // On tablets and larger screens, keep original ratio for proper aspect ratio rendering
      // Skip this if forceAspectRatio is true, so items can stack naturally according to their true ratios
      const isMobile = options.dimensions.width < 500
      if (isMobile && count > 1 && !options.forceAspectRatio) {
        const { width: cw, height: ch } = options.dimensions
        options = { ...options, aspectRatio: `${Math.round(cw)}:${Math.round(ch)}` }
      }

      // Handle custom aspect ratios from itemAspectRatios
      if (options.itemAspectRatios && options.itemAspectRatios.length > 0) {
        const ratios = new Set<string>()
        for (const r of options.itemAspectRatios) {
          ratios.add(r ?? options.aspectRatio)
        }

        if (ratios.size === 1) {
          // All items share the same ratio — use standard uniform grid with that ratio
          // This gives optimal row/column distribution (e.g., all 9:16 items pack nicely)
          const sharedRatio = [...ratios][0]
          if (sharedRatio !== options.aspectRatio) {
            options = { ...options, aspectRatio: sharedRatio }
          }
          // Fall through to standard uniform grid below
        } else {
          // Truly mixed ratios — use flexible justified gallery layout
          // Only skip on small mobile screens where we force fill/stretch
          if (!isMobile) {
            return createFlexibleGalleryGrid(options)
          }
          // Mobile: fall through to standard uniform grid (ratio already overridden above)
        }
      }

      // Priority: pagination > maxVisible
      let hiddenCount = 0
      let startIndex = 0
      let endIndex = count

      const pagination: PaginationInfo =
        maxItemsPerPage && maxItemsPerPage > 0
          ? createPaginationInfo(count, maxItemsPerPage, currentPage)
          : {
            enabled: false,
            currentPage: 0,
            totalPages: 1,
            itemsOnPage: count,
            startIndex: 0,
            endIndex: count,
          }

      if (pagination.enabled) {
        startIndex = pagination.startIndex
        endIndex = pagination.endIndex
      } else if (maxVisible > 0 && count > maxVisible) {
        // +1 because the last slot shows the indicator instead of a participant
        hiddenCount = count - maxVisible + 1
        startIndex = 0
        endIndex = maxVisible
      }

      const effectiveCount = endIndex - startIndex

      // Mobile + pagination: use uniform-fill layout (items stretch to fill entire container)
      // Same behavior as pinOnly pages — items fill width, last row stretches
      if (isMobile && pagination.enabled && effectiveCount > 0) {
        const { width: cW, height: cH } = options.dimensions
        const gap = options.gap
        const availW = cW - gap * 2
        const availH = cH - gap * 2

        // Layout: 1 col for <=2 items, 2 cols for 3+
        const gridCols = effectiveCount <= 2 ? 1 : 2
        const gridRows = Math.ceil(effectiveCount / gridCols)
        const cellW = (availW - (gridCols - 1) * gap) / gridCols
        const cellH = (availH - (gridRows - 1) * gap) / gridRows

        // Items in the last row stretch to fill the full width
        const itemsInLastRow = effectiveCount % gridCols || gridCols
        const lastRowCellW = itemsInLastRow < gridCols
          ? (availW - (itemsInLastRow - 1) * gap) / itemsInLastRow
          : cellW

        const lastRowStartIdx = (gridRows - 1) * gridCols
        const isInLastRow = (relIdx: number) => relIdx >= lastRowStartIdx

        const getPosition = (index: number): Position => {
          const relativeIndex = index - startIndex
          if (relativeIndex < 0 || relativeIndex >= effectiveCount) {
            return { top: -9999, left: -9999 }
          }
          const row = Math.floor(relativeIndex / gridCols)
          const col = relativeIndex % gridCols
          const isLast = isInLastRow(relativeIndex)
          const w = isLast ? lastRowCellW : cellW
          const left = gap + col * (w + gap)
          const top = gap + row * (cellH + gap)
          return { top, left }
        }

        const getItemDimensions = (index: number) => {
          const relativeIndex = index - startIndex
          if (relativeIndex < 0 || relativeIndex >= effectiveCount) {
            return { width: 0, height: 0 }
          }
          const w = isInLastRow(relativeIndex) ? lastRowCellW : cellW
          return { width: w, height: cellH }
        }

        const lastVisibleIndex = endIndex - 1

        return {
          width: cellW,
          height: cellH,
          rows: gridRows,
          cols: gridCols,
          layoutMode: 'gallery' as LayoutMode,
          getPosition,
          getItemDimensions,
          isMainItem: () => false,
          pagination,
          isItemVisible: (index: number) => index >= startIndex && index < endIndex,
          hiddenCount,
          getLastVisibleOthersIndex: () => (hiddenCount > 0 ? lastVisibleIndex : -1),
          getItemContentDimensions: createGetItemContentDimensions(
            getItemDimensions,
            options.itemAspectRatios,
            options.aspectRatio
          ),
        }
      }

      // Standard uniform grid (desktop or non-paginated)
      const grid = createGrid({ ...options, count: effectiveCount })

      // Create position getter that maps original index to relative index
      const getPosition = (index: number): Position => {
        const relativeIndex = index - startIndex
        if (relativeIndex < 0 || relativeIndex >= effectiveCount) {
          return { top: -9999, left: -9999 }
        }
        return grid.getPosition(relativeIndex)
      }

      const getItemDimensions = () => ({ width: grid.width, height: grid.height })

      // Get last visible index (for +X indicator)
      const lastVisibleIndex = endIndex - 1

      return {
        ...grid,
        layoutMode: 'gallery',
        getPosition,
        getItemDimensions,
        isMainItem: () => false,
        pagination,
        isItemVisible: (index: number) => index >= startIndex && index < endIndex,
        hiddenCount,
        getLastVisibleOthersIndex: () => (hiddenCount > 0 ? lastVisibleIndex : -1),
        getItemContentDimensions: createGetItemContentDimensions(
          getItemDimensions,
          options.itemAspectRatios,
          options.aspectRatio
        ),
      }
    }
  }
}

// ============================================
// Animation Helpers
// ============================================

/**
 * Spring animation configuration presets
 *
 * Each preset uses stiffness + damping + mass for fundamentally different motion:
 *
 * | Preset  | Stiffness | Damping | Mass | ζ (damping ratio) | Character                          |
 * | ------- | --------- | ------- | ---- | ----------------- | ---------------------------------- |
 * | snappy  | 800       | 35      | 0.5  | ≈ 0.88            | Instant snap, nearly zero overshoot|
 * | smooth  | 200       | 26      | 1.0  | ≈ 0.92            | Smooth glide, professional feel    |
 * | gentle  | 60        | 14      | 1.8  | ≈ 0.67            | Slow drift, heavy/weighted feel    |
 * | bouncy  | 500       | 8       | 0.6  | ≈ 0.23            | Energetic spring, 3-4 oscillations |
 */
export const springPresets = {
  /** Instant snap — nearly zero overshoot, feels like 'click into place' */
  snappy: { stiffness: 800, damping: 35, mass: 0.5 },
  /** Smooth glide — professional default, subtle cushion at end */
  smooth: { stiffness: 200, damping: 26, mass: 1 },
  /** Slow drift — heavy/weighted feel, takes its time to settle */
  gentle: { stiffness: 60, damping: 14, mass: 1.8 },
  /** Energetic spring — playful bounce with 3-4 visible oscillations */
  bouncy: { stiffness: 500, damping: 8, mass: 0.6 },
} as const

export type SpringPreset = keyof typeof springPresets

/**
 * Get spring configuration for Motion animations
 */
export function getSpringConfig(preset: SpringPreset = 'smooth') {
  return {
    type: 'spring' as const,
    ...springPresets[preset],
  }
}
