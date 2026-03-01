# Hemp Farm Game - Game Mechanics Specification

## Core Gameplay Loop

### 1. Resource Management
**Primary Resources:**
- **Money ($)**: Used for purchasing crops, buildings, and upgrades
- **Hemp**: Harvested from crops, sold for money
- **Time**: Real-time progression system

**Resource Flow:**
```
Money → Plant Crops → Wait/Automate → Harvest Hemp → Sell Hemp → Money
```

### 2. Crop Lifecycle

#### Planting Phase
- **Cost**: Dynamic pricing starting at $100, increases by 50% per crop planted
- **Placement**: Any empty tile on the grid
- **Instant**: Crop appears immediately upon purchase

#### Growth Phase
- **Duration**: Base 60 seconds, reduced by crop level and pet bonuses
- **Formula**: `BASE_TIME * (1 - (level-1) * 0.1 - petBonus)`
- **Minimum**: 10 seconds regardless of bonuses
- **Visual**: Progress bar shows growth completion

#### Harvest Phase
- **Manual**: Click "Ready" button when growth completes
- **Automated**: Pet automatically harvests when ready
- **Yield**: 10 hemp per harvest * crop level
- **Cooldown**: Immediately starts next growth cycle

### 3. Leveling Systems

#### Crop Levels (1-10)
- **Benefits**: 
  - Faster harvest time (10% reduction per level)
  - Higher hemp yield (10 hemp × level)
- **Cost Formula**: `100 * (1.5 ^ (level-1))`
- **Requirements**: Must have sufficient money

#### Storage Levels (1-5)
- **Benefits**: Increases hemp storage capacity
- **Capacity Formula**: `1000 * (2 ^ (level-1))`
- **Cost Formula**: `2000 * (2 ^ (level-1))`
- **Build Time**: 3 minutes base, +50% per upgrade level

#### Bank Levels (1-5)
- **Benefits**: Increases money storage capacity
- **Capacity Formula**: `500 * (1.2 ^ (level-1))` added to base
- **Cost Formula**: Similar to storage facilities
- **Limitation**: Maximum banks = current farm level

#### Farm Levels (1+)
- **Benefits**:
  - Unlocks additional grid tiles (15 per level)
  - Allows more bank construction
  - Increases maximum building levels
- **Cost**: Exponential in both money and hemp
- **Grid Expansion**: Adds new rows to maintain 5-column layout

### 4. Pet Automation System

#### Pet Mechanics
- **Starting Pets**: 1 pet named "High Pet"
- **Employment**: Assign to individual crop tiles
- **Bonus**: 10% faster harvest time
- **Automation**: Automatically harvests when crops are ready
- **Limitation**: One pet per tile, finite pet supply

#### Pet Assignment Process
1. Select crop tile with no assigned pet
2. Click "Employ Pet" (requires available pet)
3. Pet becomes unavailable for other tiles
4. Crop gains speed bonus and auto-harvest
5. Can remove pet to reassign elsewhere

### 5. Building Construction

#### Storage Facilities
- **Purpose**: Increase hemp storage capacity beyond base 1000
- **Cost**: $1000 initial, exponential scaling for upgrades
- **Build Time**: 3 minutes, increases with upgrade level
- **Capacity Bonus**: Doubles per level (1000 → 2000 → 4000...)

#### Bank Facilities
- **Purpose**: Increase money storage capacity beyond base $1000
- **Cost**: $1000 initial, similar scaling to storage
- **Build Time**: 3 minutes base
- **Capacity Bonus**: 20% compound increase per level
- **Restriction**: Limited by farm level

### 6. Economic Balance

#### Pricing Dynamics
- **Crop Cost Inflation**: Each planted crop increases next crop cost by 50%
- **Level Up Costs**: Exponential scaling (1.5x multiplier)
- **Building Costs**: Exponential scaling (2x multiplier)
- **Hemp Exchange Rate**: 100 hemp = $10 (fixed rate)

#### Capacity Management
- **Storage Limits**: Hemp production stops when storage full
- **Money Limits**: Earnings capped by bank capacity
- **Strategic Decisions**: Players must balance expansion vs. immediate gains

### 7. Progression Gates

#### Early Game (Farm Level 1)
- **Focus**: Learn basic crop planting and harvesting
- **Limitations**: 15 tiles, basic storage, 1 bank maximum
- **Goals**: Accumulate resources for first expansion

#### Mid Game (Farm Levels 2-5)
- **Focus**: Automation through pet employment
- **Expansion**: More tiles and building capacity
- **Optimization**: Efficient resource allocation

#### Late Game (Farm Level 6+)
- **Focus**: Maximum efficiency optimization
- **Challenges**: Exponential cost scaling
- **Mastery**: Complex resource management

### 8. Time Management

#### Real-Time Progression
- **Continuous**: Game progresses even when not actively playing
- **Persistence**: State saved automatically to localStorage
- **Offline Progress**: Limited by storage capacity when away

#### Timing Calculations
- **Harvest Duration**: Dynamic based on level and bonuses
- **Build Times**: Fixed durations with progress tracking
- **Cooldowns**: Immediate restart after harvest

### 9. Strategic Depth

#### Resource Allocation Decisions
- **Immediate vs. Long-term**: Harvest now vs. upgrade for efficiency
- **Breadth vs. Depth**: Many low-level crops vs. few high-level crops
- **Infrastructure**: Storage/banks vs. production capacity

#### Optimization Opportunities
- **Pet Assignment**: Which crops benefit most from automation
- **Upgrade Priority**: Crops vs. buildings vs. farm level
- **Timing**: When to sell hemp vs. when to hold for capacity upgrades

### 10. Failure States and Recovery

#### Soft Locks
- **Prevention**: Game designed to avoid unwinnable states
- **Recovery**: Always possible to generate income through existing crops
- **Guidance**: UI feedback shows next affordable actions

#### Resource Constraints
- **Storage Full**: Harvest stops, forcing hemp sales
- **Money Shortage**: Must wait for harvests or sell hemp
- **No Available Pets**: Must remove pets from less efficient crops