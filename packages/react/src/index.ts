// Hooks
export {
    useGridDimensions,
    useMeetGrid,
    useGridContext,
    useGridAnimation,
    GridContext,
} from './hooks'

// Components
export {
    GridContainer,
    GridItem,
    GridOverlay,
    FloatingGridItem,
} from './components'

// Types
export type {
    GridContainerProps,
    GridItemProps,
    GridOverlayProps,
    FloatingGridItemProps,
} from './components'

// Re-export from core
export type {
    GridDimensions,
    Position,
    GridOptions,
    MeetGridOptions,
    MeetGridResult,
    LayoutMode,
    SpringPreset,
    PaginationInfo,
    ItemAspectRatio,
    ContentDimensions,
    FloatSize,
} from '@thangdevalone/meeting-grid-layout-core'

export {
    createGrid,
    createMeetGrid,
    getGridItemDimensions,
    createGridItemPositioner,
    getSpringConfig,
    springPresets,
    getAspectRatio,
    resolveFloatWidth,
} from '@thangdevalone/meeting-grid-layout-core'
