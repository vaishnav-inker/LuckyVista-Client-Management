# Implementation Plan: Responsive UI

## Overview

This implementation plan breaks down the responsive UI feature into discrete coding tasks that build incrementally. The approach follows a mobile-first strategy, starting with core responsive utilities and hooks, then progressively updating each component to support mobile, tablet, and desktop viewports.

Each task builds on previous work, ensuring no orphaned code. The implementation is organized into four phases: utilities and hooks, layout components, client list components, and forms/filters.

## Tasks

- [x] 1. Set up responsive utilities and hooks
  - [x] 1.1 Create viewport detection hook
    - Create `src/hooks/useViewport.ts` with viewport size detection
    - Export `ViewportState` type and `useViewport()` hook
    - Implement debounced resize listener (150ms debounce)
    - Return viewport dimensions, size category (mobile/tablet/desktop), and boolean flags
    - Handle SSR case by defaulting to desktop viewport
    - _Requirements: 1.1, 1.7, 2.1, 2.4, 2.5, 3.1, 3.3, 3.4, 4.1, 4.4, 4.5, 5.1, 5.5, 6.1, 6.3, 7.1, 7.3_
  
  - [x] 1.2 Create media query hook
    - Create `src/hooks/useMediaQuery.ts` for custom media query matching
    - Accept media query string parameter
    - Return boolean indicating if query matches
    - Use `window.matchMedia()` with change listener
    - _Requirements: 1.7, 2.4, 2.5_
  
  - [x] 1.3 Create responsive utility functions
    - Create `src/utils/responsive.ts` with helper functions
    - Add `getViewportSize(width: number): ViewportSize` function
    - Add `isTouchDevice(): boolean` function
    - Add `debounce<T>(fn: T, delay: number): T` function
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 1.4 Write property test for viewport detection
    - **Property 3: State preservation across viewport changes**
    - Test that viewport changes don't cause state loss
    - Generate random viewport widths and verify hook returns correct size category
    - _Requirements: 2.6_

- [x] 2. Implement responsive layout components
  - [x] 2.1 Create Header component
    - Extract header from `DashboardLayout.tsx` into new `src/components/layout/Header.tsx`
    - Add props: `title`, `onMobileMenuToggle`, `showMobileMenu`
    - Implement mobile layout: hamburger (left), title (center, truncated), avatar (right)
    - Implement desktop layout: title (left), notification bell, avatar (right)
    - Use `useViewport()` to conditionally render hamburger menu
    - Ensure all interactive elements are 44x44px on mobile
    - Add text truncation with ellipsis for long titles on mobile
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 2.2 Write property tests for Header component
    - **Property 1: Touch target minimum size compliance** (header elements)
    - **Property 5: Page title truncation on overflow**
    - Test that all header interactive elements meet 44x44px minimum on mobile
    - Test that long titles truncate with ellipsis on mobile
    - _Requirements: 5.3, 5.4_
  
  - [x] 2.3 Create MobileMenu component
    - Create `src/components/layout/MobileMenu.tsx`
    - Add props: `isOpen`, `onClose`
    - Implement overlay backdrop (fixed, full screen, semi-transparent black)
    - Implement sidebar panel (fixed, slides from left, max-w-xs, 80% width)
    - Add close button (X icon, absolute top-right, 44x44px touch target)
    - Add click-outside-to-close functionality
    - Use CSS transitions for slide animation
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [ ]* 2.4 Write unit tests for MobileMenu interactions
    - Test menu opens when isOpen is true
    - Test menu closes when clicking outside
    - Test menu closes when clicking close button
    - Test menu has proper z-index and overlay
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [x] 2.5 Update Sidebar component for responsive behavior
    - Update `src/components/layout/Sidebar.tsx` to support mobile overlay mode
    - Add props: `isMobileMenuOpen`, `onMobileMenuClose`
    - On mobile: render inside MobileMenu overlay
    - On desktop: render as fixed sidebar (current behavior)
    - Ensure all navigation items have 44x44px touch targets on mobile
    - Maintain logo, navigation items, and user profile in same order
    - _Requirements: 1.1, 1.5, 1.6, 1.7_
  
  - [ ]* 2.5 Write property test for Sidebar touch targets
    - **Property 1: Touch target minimum size compliance** (sidebar navigation)
    - Test that all navigation items meet 44x44px minimum on mobile
    - _Requirements: 1.5_
  
  - [x] 2.6 Update DashboardLayout to wire responsive components
    - Update `src/components/layout/DashboardLayout.tsx`
    - Add state for mobile menu open/close
    - Render new Header component with mobile menu toggle handler
    - Conditionally render Sidebar based on viewport
    - Pass mobile menu state to Sidebar and MobileMenu
    - Ensure main content area adjusts for responsive layout
    - _Requirements: 1.1, 1.2, 1.7, 5.1, 5.5_

- [ ] 3. Checkpoint - Ensure layout components work correctly
  - Test mobile menu opens and closes correctly
  - Test sidebar displays correctly on mobile and desktop
  - Test header adapts to viewport changes
  - Ensure all tests pass, ask the user if questions arise

- [x] 4. Implement responsive client list components
  - [x] 4.1 Create ClientCard component for mobile view
    - Create `src/components/clients/ClientCard.tsx`
    - Add props: `client: Client`, `onEdit: (clientId: string) => void`
    - Implement card layout: logo/initial (48x48px), org name, category, admin info, status badge
    - Make entire card or Edit button 44x44px touch target
    - Use full width with padding, rounded corners, shadow
    - Display all required information: logo, name, category, admin name, status, edit button
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ]* 4.2 Write property test for ClientCard information completeness
    - **Property 2: Client card information completeness**
    - Generate random client records and verify all required fields are rendered
    - _Requirements: 2.2_
  
  - [ ]* 4.3 Write property test for ClientCard touch targets
    - **Property 1: Touch target minimum size compliance** (card interactive elements)
    - Test that card interactive elements meet 44x44px minimum
    - _Requirements: 2.3_
  
  - [x] 4.4 Extract and create responsive Pagination component
    - Create `src/components/clients/Pagination.tsx`
    - Add props: `currentPage`, `totalPages`, `totalCount`, `pageSize`, `onPageChange`
    - Mobile layout: Previous/Next buttons (44x44px) with page indicator between
    - Desktop layout: Full pagination with page numbers
    - Hide or reposition results count text on mobile
    - Ensure disabled buttons have reduced opacity and don't respond to clicks
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 4.5 Write property test for disabled pagination buttons
    - **Property 6: Disabled pagination button behavior**
    - Test that disabled buttons have reduced opacity and don't respond to events
    - _Requirements: 6.4_
  
  - [x] 4.6 Update ClientListView for responsive table/card toggle
    - Update `src/components/clients/ClientListView.tsx`
    - Use `useViewport()` to detect mobile vs desktop
    - On mobile: render ClientCard components in vertical stack
    - On tablet: render table with horizontal scroll or simplified columns
    - On desktop: render full table (current behavior)
    - Replace inline pagination with new Pagination component
    - Ensure state (page, search, filters) is preserved across viewport changes
    - _Requirements: 2.1, 2.4, 2.5, 2.6_
  
  - [ ]* 4.7 Write property test for state preservation
    - **Property 3: State preservation across viewport changes**
    - Generate random page/search/filter combinations
    - Test that resizing viewport preserves all state values
    - _Requirements: 2.6_
  
  - [x] 4.8 Make "Add Client" button responsive
    - Update button in ClientListView
    - Mobile: full-width or prominent positioning with 44x44px height
    - Consider sticky positioning for mobile scroll visibility
    - Desktop: maintain current styling
    - Optionally shorten text to "Add" on very small screens
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 5. Checkpoint - Ensure client list components work correctly
  - Test card view displays correctly on mobile
  - Test table view displays correctly on desktop
  - Test pagination works on all viewport sizes
  - Test state preservation across viewport changes
  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Implement responsive forms and filters
  - [x] 6.1 Update SearchAndFilter component for responsive layout
    - Update `src/components/clients/SearchAndFilter.tsx`
    - Change grid to: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
    - Search input spans 2 columns on tablet: `sm:col-span-2`
    - Ensure all inputs have 44px minimum height
    - Ensure "Clear all filters" button is visible on all viewports
    - Stack all inputs vertically on mobile with full width
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 6.2 Write property tests for SearchAndFilter
    - **Property 1: Touch target minimum size compliance** (filter inputs)
    - **Property 4: Clear filters button visibility**
    - Test that all filter inputs meet 44px minimum height
    - Test that clear button is visible at all viewport sizes
    - _Requirements: 3.2, 3.5_
  
  - [x] 6.3 Update ClientForm for responsive grid layout
    - Update `src/components/clients/ClientForm.tsx`
    - Update all grid sections to: `grid-cols-1 md:grid-cols-2`
    - Ensure all form inputs have 44px minimum height (h-11 class)
    - Make form action buttons full-width on mobile
    - Ensure logo upload component has large tap area on mobile
    - Stack email/mobile fields vertically on mobile
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 6.4 Write property tests for ClientForm
    - **Property 1: Touch target minimum size compliance** (form inputs)
    - **Property 15: Form input width constraint**
    - Test that all form inputs meet 44px minimum height
    - Test that form inputs don't exceed viewport width at any size
    - _Requirements: 4.2, 11.4_

- [ ] 7. Implement responsive images and typography
  - [ ] 7.1 Create ResponsiveImage component
    - Create `src/components/common/ResponsiveImage.tsx`
    - Add props: `src`, `alt`, `className`, `fallbackInitial`
    - Apply responsive CSS: `max-w-full h-auto`
    - Handle image load errors with fallback initial circle
    - Ensure images don't exceed container dimensions
    - Maintain aspect ratio
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ]* 7.2 Write property tests for ResponsiveImage
    - **Property 9: Image container constraint**
    - **Property 10: Responsive image CSS properties**
    - Test that images don't exceed container dimensions
    - Test that images have correct responsive CSS properties
    - _Requirements: 10.1, 10.3_
  
  - [ ] 7.3 Update avatar images for consistent sizing
    - Update avatar images in Header and Sidebar components
    - Ensure avatars maintain same size (40x40px) across all viewports
    - Use fixed width/height classes: `w-10 h-10`
    - _Requirements: 10.4_
  
  - [ ]* 7.4 Write property test for avatar consistency
    - **Property 11: Avatar size consistency**
    - Test that avatars have same dimensions across all viewport sizes
    - _Requirements: 10.4_
  
  - [ ] 7.5 Update typography for responsive sizing
    - Update body text to minimum 16px on mobile (text-base class)
    - Ensure headings scale appropriately with Tailwind responsive classes
    - Update index.css with mobile-first typography if needed
    - _Requirements: 9.1, 9.5_
  
  - [ ]* 7.6 Write property test for body text font size
    - **Property 8: Body text minimum font size**
    - Test that all body text elements have minimum 16px font size on mobile
    - _Requirements: 9.1_

- [x] 8. Implement overflow prevention and spacing
  - [x] 8.1 Add text truncation and wrapping utilities
    - Update long text elements (emails, names) with truncate or wrap classes
    - Use `truncate` class for single-line truncation with ellipsis
    - Use `break-words` class for multi-line wrapping
    - Apply to client table cells, card content, form labels
    - _Requirements: 11.2_
  
  - [ ]* 8.2 Write property tests for text overflow prevention
    - **Property 13: Text overflow prevention**
    - Generate long text strings and verify they don't cause overflow
    - _Requirements: 11.2_
  
  - [x] 8.3 Add horizontal scroll prevention
    - Wrap client table in container with `overflow-x-auto` on tablet
    - Ensure no component causes body horizontal scroll on mobile
    - Add `overflow-x-hidden` to body or main container if needed
    - Test with very long content to ensure no overflow
    - _Requirements: 11.1, 11.3_
  
  - [ ]* 8.4 Write property tests for scroll prevention
    - **Property 12: No horizontal scroll on mobile**
    - **Property 14: Table scroll containment**
    - Test that components don't cause document width to exceed viewport
    - Test that table scroll is contained within wrapper
    - _Requirements: 11.1, 11.3_
  
  - [x] 8.5 Add spacing between interactive elements
    - Review all interactive elements and ensure minimum 8px spacing
    - Use Tailwind gap utilities: `gap-2` (8px) or `space-y-2`
    - Apply to button groups, form fields, navigation items
    - _Requirements: 8.2_
  
  - [ ]* 8.6 Write property test for interactive element spacing
    - **Property 7: Interactive element spacing**
    - Test that adjacent interactive elements have minimum 8px spacing on mobile
    - _Requirements: 8.2_

- [ ] 9. Implement loading states and empty states
  - [ ] 9.1 Update loading spinners for responsive centering
    - Ensure loading spinners use flexbox centering: `flex items-center justify-center`
    - Verify spinner size is appropriate for all viewports
    - Add skeleton loaders with fixed dimensions to prevent layout shift
    - _Requirements: 12.1_
  
  - [ ]* 9.2 Write property test for loading spinner centering
    - **Property 16: Loading spinner centering**
    - Test that spinners are centered in their containers at all viewport sizes
    - _Requirements: 12.1_
  
  - [ ] 9.3 Update empty state components for responsive layout
    - Update empty state in ClientListView
    - Ensure illustrations scale appropriately on mobile
    - Make empty state action buttons follow responsive button rules (full-width on mobile)
    - _Requirements: 12.2, 12.3_
  
  - [ ]* 9.4 Write property test for empty state buttons
    - **Property 17: Empty state button consistency**
    - Test that empty state buttons follow same responsive rules as other buttons
    - _Requirements: 12.3_
  
  - [ ] 9.5 Update error messages for responsive display
    - Ensure error messages are fully visible at all viewport sizes
    - Use `break-words` to prevent long error text from overflowing
    - Test with long error messages
    - _Requirements: 12.4_
  
  - [ ]* 9.6 Write property test for error message visibility
    - **Property 18: Error message visibility**
    - Generate random error messages and verify they're fully visible without overflow
    - _Requirements: 12.4_

- [x] 10. Final integration and polish
  - [x] 10.1 Add CSS for hover state handling on touch devices
    - Add `@media (hover: hover)` queries to index.css
    - Ensure hover states only apply on devices with hover capability
    - Test on actual touch devices to verify no hover interference
    - _Requirements: 8.3_
  
  - [x] 10.2 Update Tailwind configuration for touch utilities
    - Add custom utilities to tailwind.config.js: `minHeight.touch: '44px'`, `minWidth.touch: '44px'`
    - Add any custom breakpoints if needed
    - Ensure autoprefixer is configured for browser compatibility
    - _Requirements: 8.1, 8.4_
  
  - [x] 10.3 Add focus management for mobile menu
    - When mobile menu opens, move focus to first navigation item
    - When mobile menu closes, return focus to hamburger button
    - Trap focus within mobile menu when open
    - _Requirements: 1.2, 1.4_
  
  - [x] 10.4 Verify all responsive breakpoints work correctly
    - Test all components at 320px, 375px, 640px, 768px, 1024px, 1920px widths
    - Verify smooth transitions between breakpoints
    - Check for any layout shifts or glitches
    - Test both portrait and landscape orientations
    - _Requirements: All requirements_

- [ ] 11. Final checkpoint - Complete testing and verification
  - Run all unit tests and property tests
  - Verify all 18 correctness properties pass
  - Test on actual mobile devices (iOS and Android)
  - Test on actual tablet devices
  - Verify accessibility with screen reader
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical break points
- Property tests validate universal correctness properties with minimum 100 iterations each
- Unit tests validate specific examples, edge cases, and user interactions
- Manual device testing is required after implementation to verify touch interactions
- Use `@fast-check/jest` for property-based testing in TypeScript/React
- All interactive elements must meet 44x44px minimum touch target size on mobile
- All viewport changes must preserve application state (page, search, filters)
