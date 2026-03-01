# Hemp Farm Game - Interaction Patterns Specification

## Input Methods and Controls

### Primary Interactions

#### Tile Interactions
1. **Empty Tile Click**
   - **Trigger**: Single tap/click on empty tile
   - **Response**: Opens plant options popup
   - **Visual Feedback**: Tile highlight on hover
   - **Options Presented**: Plant crop, build storage, build bank

2. **Crop Tile Click**
   - **Trigger**: Single tap/click on crop tile
   - **Response**: Opens crop management popup
   - **Context Dependent**: Actions vary based on crop state
   - **States**: Growing, ready to harvest, automated

3. **Building Tile Click**
   - **Trigger**: Single tap/click on storage/bank
   - **Response**: Opens building management popup
   - **Information**: Level, capacity, upgrade options
   - **Actions**: Upgrade, move (when not building)

#### Status Bar Interactions
1. **Hemp Display Click**
   - **Trigger**: Click hemp resource bar
   - **Condition**: Only when hemp ≥ 100
   - **Response**: Opens sell hemp popup
   - **Visual Cue**: Cursor changes to pointer when clickable

2. **Warehouse Icon Click**
   - **Trigger**: Click warehouse icon
   - **Response**: Opens farm management popup
   - **Content**: Farm level info, pet management, level up options

### Secondary Interactions

#### Harvest Actions
1. **Individual Harvest**
   - **Trigger**: Click "Ready" button on harvestable crop
   - **Immediate**: Instant hemp gain and cycle restart
   - **Limitation**: Only for non-automated crops
   - **Feedback**: Visual progress bar reset

2. **Harvest All Button**
   - **Trigger**: Click floating harvest all button
   - **Condition**: Appears when ≥1 manually harvestable crops exist
   - **Action**: Harvests all ready non-automated crops
   - **Position**: Fixed bottom center of screen

#### Move System
1. **Initiate Move**
   - **Trigger**: Click "Move" button in tile popup
   - **State Change**: Enters move mode
   - **Visual**: Highlights valid destination tiles
   - **Cancel**: Click "Cancel Move" or select invalid tile

2. **Complete Move**
   - **Trigger**: Click empty tile while in move mode
   - **Action**: Transfers tile contents to new location
   - **Cleanup**: Original tile becomes empty
   - **Exit**: Automatically exits move mode

### Popup Interaction Patterns

#### Modal Behavior
1. **Opening**
   - **Animation**: Fade in backdrop, scale in modal
   - **Focus**: Traps keyboard focus within modal
   - **Backdrop**: Click outside to close
   - **Escape Key**: Closes modal

2. **Closing**
   - **Methods**: X button, backdrop click, ESC key, action completion
   - **Animation**: Fade out backdrop, scale out modal
   - **State Reset**: Clears any temporary interaction states

#### Button Interactions
1. **Primary Actions**
   - **Style**: Custom background images with hover effects
   - **Feedback**: Opacity reduction on hover (90%)
   - **Disabled State**: 50% opacity, cursor-not-allowed
   - **Loading**: Progress indicators during async operations

2. **Secondary Actions**
   - **Style**: Solid color backgrounds
   - **Feedback**: Color shifts on hover
   - **Confirmation**: Some actions require confirmation

### Touch and Mobile Interactions

#### Touch Optimizations
1. **Touch Targets**
   - **Minimum Size**: 44px for all interactive elements
   - **Spacing**: Adequate gaps between touch targets
   - **Feedback**: Visual feedback on touch start

2. **Gesture Support**
   - **Tap**: Primary interaction method
   - **Long Press**: Not implemented (avoided for simplicity)
   - **Swipe**: Scroll only for game board area

#### Mobile-Specific Behaviors
1. **Responsive Text**
   - **Small Screens**: Reduced font sizes (`text-[10px]`)
   - **Large Screens**: Standard sizes (`text-xs`, `text-sm`)
   - **Readability**: Maintained across all screen sizes

2. **Layout Adaptations**
   - **Popup Sizing**: Full-width with margins on mobile
   - **Grid Scaling**: Maintains aspect ratios
   - **Button Sizing**: Larger touch targets on mobile

### Feedback Systems

#### Visual Feedback
1. **Hover States**
   - **Tiles**: Subtle border highlight
   - **Buttons**: Opacity or color changes
   - **Icons**: Color shifts (often to yellow)

2. **Progress Indicators**
   - **Progress Bars**: Smooth animations over 1 second
   - **Timers**: Real-time countdown displays
   - **Construction**: Pulsing effects during builds

3. **State Changes**
   - **Harvest Ready**: Yellow glow overlay
   - **Building Complete**: Visual state transition
   - **Resource Full**: Visual capacity indicators

#### Audio Feedback (Ready for Implementation)
1. **Action Sounds**
   - **Plant**: Soil digging sound
   - **Harvest**: Rustling/collection sound
   - **Build**: Construction sounds
   - **Level Up**: Success chime

2. **Ambient Audio**
   - **Background**: Peaceful farm ambiance
   - **Seasonal**: Weather-appropriate sounds
   - **Pet Sounds**: Occasional pet noises

### Error Handling and Edge Cases

#### Insufficient Resources
1. **Visual Indicators**
   - **Disabled Buttons**: Grayed out with explanatory text
   - **Cost Display**: Red text when unaffordable
   - **Requirement Messages**: Clear explanation of what's needed

2. **Graceful Degradation**
   - **Partial Actions**: No partial purchases or builds
   - **State Consistency**: All operations are atomic
   - **Recovery Guidance**: UI suggests next possible actions

#### Capacity Limits
1. **Storage Full**
   - **Harvest Prevention**: Crops won't harvest when storage full
   - **Visual Warning**: Progress bars show full state
   - **Action Prompt**: Suggests selling hemp

2. **Money Limit**
   - **Earning Cap**: Money gains stop at capacity
   - **Upgrade Prompt**: Suggests building banks
   - **Visual Indicator**: Progress bar shows limit

### Accessibility Considerations

#### Keyboard Navigation
1. **Tab Order**: Logical progression through interactive elements
2. **Enter/Space**: Activates focused buttons
3. **Escape**: Closes modals and cancels operations
4. **Arrow Keys**: Could navigate grid (not currently implemented)

#### Screen Reader Support
1. **Alt Text**: Descriptive text for all images
2. **ARIA Labels**: Proper labeling for complex interactions
3. **State Announcements**: Changes announced to screen readers
4. **Focus Management**: Proper focus handling in modals

#### Visual Accessibility
1. **Color Contrast**: High contrast text on all backgrounds
2. **Text Sizing**: Scalable fonts that respect user preferences
3. **Motion Reduction**: Respects prefers-reduced-motion
4. **Clear Indicators**: Non-color-dependent state indicators

### Performance Considerations

#### Interaction Responsiveness
1. **Immediate Feedback**: Visual response within 16ms
2. **Debounced Actions**: Prevent rapid-fire interactions
3. **Optimistic Updates**: UI updates before backend confirmation
4. **Loading States**: Progress indicators for longer operations

#### State Management
1. **Efficient Updates**: Minimal re-renders on state changes
2. **Batched Operations**: Group related state updates
3. **Memory Management**: Cleanup of event listeners and timers
4. **Persistence**: Automatic save on every significant state change