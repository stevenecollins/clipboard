# UX Flow Diagrams

## Core User Flows

### 1. User Onboarding Flow

```mermaid
graph TD
    A[App Launch] --> B{First Time User?}
    B -->|Yes| C[Welcome Screen]
    B -->|No| D[Login Screen]
    C --> E[Sign Up Options]
    E --> F[Email/Password]
    E --> G[Google Sign-in]
    E --> H[Apple Sign-in]
    F --> I[Email Verification]
    G --> J[OAuth Flow]
    H --> J
    I --> K[Profile Setup]
    J --> K
    K --> L[Create First Board]
    L --> M[Onboarding Tutorial]
    M --> N[Main Dashboard]
    D --> O[Enter Credentials]
    O --> P{Valid?}
    P -->|Yes| N
    P -->|No| Q[Error Message]
    Q --> D
```

#### Key UX Principles
- **Quick Start**: Users can sign up and create their first board in under 2 minutes
- **Social Login Priority**: Google/Apple login prominently displayed
- **Progressive Disclosure**: Tutorial shows key features without overwhelming
- **Skip Options**: Users can skip non-essential steps and return later

### 2. Mobile Content Capture Flow

```mermaid
graph TD
    A[User finds content to save] --> B[Tap Share button]
    B --> C[Select Clipboards from share menu]
    C --> D[Clipboards share extension opens]
    D --> E{Image detected?}
    E -->|Yes| F[Preview image + URL]
    E -->|No| G[URL only preview]
    F --> H[Select destination board]
    G --> H
    H --> I[Add title/notes (optional)]
    I --> J[Tap Save]
    J --> K[Processing indicator]
    K --> L{Success?}
    L -->|Yes| M[Success feedback + View option]
    L -->|No| N[Error message + Retry]
    M --> O[Return to source app]
    N --> P[Retry or Cancel]
    P --> K
```

#### Mobile-Specific Considerations
- **Native Share Integration**: Appears in iOS share sheet and Android share menu
- **Quick Save**: Default board selection for one-tap saving
- **Offline Support**: Content queued for sync when online
- **Visual Feedback**: Clear progress indicators and success states

### 3. Browser Extension Capture Flow

```mermaid
graph TD
    A[User right-clicks on image/page] --> B[Context menu appears]
    B --> C[Click 'Save to Clipboards']
    C --> D[Extension popup opens]
    D --> E[Image + URL preview loaded]
    E --> F[Board selection dropdown]
    F --> G{Quick save mode?}
    G -->|Yes| H[Save to default board]
    G -->|No| I[Choose specific board]
    H --> J[Processing animation]
    I --> J
    J --> K{Success?}
    K -->|Yes| L[Success notification]
    K -->|No| M[Error message]
    L --> N[Optional: View in dashboard]
    M --> O[Retry or Report issue]
```

#### Browser Extension UX
- **Context Awareness**: Automatically detects images and relevant content
- **Minimal Interruption**: Small popup that doesn't obstruct browsing
- **Keyboard Shortcuts**: Power users can save with Cmd/Ctrl+Shift+S
- **Bulk Save**: Option to save multiple images from a page

### 4. Board Management Flow

```mermaid
graph TD
    A[Main Dashboard] --> B[View Boards Grid]
    B --> C{User Action}
    C -->|Create New| D[Tap + Button]
    C -->|Edit Existing| E[Long press/Right-click board]
    C -->|View Board| F[Tap board]
    D --> G[Board Creation Form]
    G --> H[Enter name, description, color]
    H --> I[Create Board]
    I --> J[Board appears in grid]
    E --> K[Context Menu]
    K --> L[Edit/Delete/Share options]
    L --> M[Edit Board Form]
    L --> N[Delete Confirmation]
    F --> O[Board Detail View]
    O --> P[Grid/List toggle]
    P --> Q[Item management options]
```

#### Board Management UX
- **Visual Organization**: Color-coded boards with preview thumbnails
- **Drag & Drop**: Reorder boards and move items between boards
- **Bulk Operations**: Select multiple items for batch actions
- **Smart Defaults**: Auto-suggest board names based on content

### 5. Cross-Platform Sync Flow

```mermaid
graph TD
    A[Content saved on Device A] --> B[Upload to cloud]
    B --> C[Sync notification to other devices]
    C --> D[Device B receives sync]
    D --> E{App active?}
    E -->|Yes| F[Background sync]
    E -->|No| G[Silent background update]
    F --> H[Update UI with new content]
    G --> I[Update local storage]
    H --> J[Sync indicator shows complete]
    I --> K[Next app open shows new content]
    
    L[Offline content created] --> M[Queue for sync]
    M --> N{Internet available?}
    N -->|Yes| O[Sync queued items]
    N -->|No| P[Wait for connection]
    O --> B
    P --> Q[Show offline indicator]
    Q --> R[Retry when online]
    R --> O
```

#### Sync UX Principles
- **Invisible When Working**: Users shouldn't notice sync when it's working
- **Clear When Failing**: Obvious indicators when sync is blocked
- **Offline Graceful**: Full functionality when offline with clear status
- **Conflict Resolution**: Automatic resolution with user notification if needed

### 6. Search and Discovery Flow

```mermaid
graph TD
    A[User wants to find content] --> B[Tap search icon]
    B --> C[Search interface opens]
    C --> D[Enter search query]
    D --> E[Real-time search results]
    E --> F{Results found?}
    F -->|Yes| G[Display filtered results]
    F -->|No| H[No results message]
    G --> I[Apply additional filters]
    I --> J[Date/Board/Type filters]
    J --> K[Refined results]
    K --> L[Tap item to view]
    H --> M[Search suggestions]
    M --> N[Try different terms]
    L --> O[Item detail view]
    O --> P[Edit/Delete/Share options]
```

#### Search UX Features
- **Instant Search**: Results appear as user types
- **Search Scope**: Search within specific boards or across all content
- **Recent Searches**: Quick access to previous search terms
- **Smart Suggestions**: Auto-complete based on content and history

## Platform-Specific Flows

### iOS Share Extension Flow
```
Safari/Instagram/etc → Share Button → iOS Share Sheet → Clipboards Icon → 
Extension Opens → Board Selection → Save → Success Animation → Return to Source App
```

### Android Share Target Flow  
```
Chrome/Facebook/etc → Share Button → Android Share Menu → Clipboards Option →
Intent Received → Board Selection → Save → Toast Notification → Return to Source App
```

### Desktop Browser Flow
```
Right-click Image → Context Menu → "Save to Clipboards" → Extension Popup →
Board Selection → Save → Badge Notification → Continue Browsing
```

## Error Handling Flows

### Network Error Flow
```mermaid
graph TD
    A[User attempts save] --> B[Network request fails]
    B --> C[Show error message]
    C --> D[Offer retry options]
    D --> E[Automatic retry]
    D --> F[Manual retry]
    D --> G[Save offline]
    E --> H{Success?}
    H -->|Yes| I[Continue normal flow]
    H -->|No| J[Show persistent error]
    F --> A
    G --> K[Queue for later sync]
```

### Authentication Error Flow
```mermaid
graph TD
    A[API call with expired token] --> B[401 Unauthorized response]
    B --> C[Attempt token refresh]
    C --> D{Refresh successful?}
    D -->|Yes| E[Retry original request]
    D -->|No| F[Force logout]
    E --> G[Continue normal flow]
    F --> H[Redirect to login]
    H --> I[Show session expired message]
```

## Accessibility Considerations

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Image Alt Text**: Meaningful descriptions for saved images
- **Focus Management**: Logical tab order and focus indicators
- **Announcements**: Screen reader announcements for state changes

### Motor Accessibility
- **Touch Targets**: Minimum 44px touch targets on mobile
- **Keyboard Navigation**: Full functionality without mouse
- **Voice Control**: Compatible with voice navigation systems
- **Gesture Alternatives**: Alternative methods for swipe/pinch actions

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance for all text
- **Font Sizes**: Scalable text that respects system settings
- **Color Independence**: Information not conveyed by color alone
- **High Contrast Mode**: Support for system high contrast settings

## Performance Considerations

### Loading States
- **Skeleton Screens**: Show content structure while loading
- **Progressive Loading**: Load critical content first
- **Image Lazy Loading**: Load images as they enter viewport
- **Infinite Scroll**: Pagination for large collections

### Offline Experience
- **Cached Content**: Previously viewed content available offline
- **Offline Actions**: Queue actions for when online
- **Network Status**: Clear indicators of online/offline state
- **Sync Status**: Visual feedback for sync progress

## User Testing Scenarios

### Scenario 1: New User Onboarding
**Goal**: Complete signup and save first item
**Success Criteria**: Under 3 minutes, no confusion points
**Key Metrics**: Time to completion, drop-off points

### Scenario 2: Cross-Platform Sync
**Goal**: Save on mobile, view on desktop
**Success Criteria**: Content appears on desktop within 5 seconds
**Key Metrics**: Sync time, user awareness of sync status

### Scenario 3: Bulk Organization
**Goal**: Organize 20+ saved items into relevant boards
**Success Criteria**: Complete task without frustration
**Key Metrics**: Task completion rate, time efficiency

### Scenario 4: Recovery from Error
**Goal**: Successfully save content after network error
**Success Criteria**: User understands error and completes action
**Key Metrics**: Error recovery rate, user satisfaction