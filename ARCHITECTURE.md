# Architecture Documentation

## Overview

The Todo List application is built using a modern, component-based architecture leveraging the Lynx React framework. The application follows a single-component pattern with comprehensive state management and a focus on performance and maintainability.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│                  React Component Layer                      │
├─────────────────────────────────────────────────────────────┤
│                   State Management Layer                    │
├─────────────────────────────────────────────────────────────┤
│                   Business Logic Layer                      │
├─────────────────────────────────────────────────────────────┤
│                   Data Persistence Layer                    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Layers

#### Presentation Layer
- **Lynx React Framework**: Mobile-first React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Custom Components**: Reusable UI elements

#### Application Layer
- **React Hooks**: State management and side effects
- **TypeScript**: Type safety and development experience
- **Event Handling**: User interaction management
- **Data Validation**: Input validation and sanitization

#### Build Layer
- **Rspeedy**: Build orchestration
- **Rsbuild**: Fast bundling
- **Rspack**: High-performance bundler
- **PostCSS**: CSS processing

#### Testing Layer
- **Vitest**: Unit testing framework
- **Testing Library**: Component testing utilities
- **Biome**: Code quality and formatting

## Component Architecture

### Main Application Component

The application uses a single-component architecture centered around the `App` component:

```typescript
App Component
├── Header Section
│   ├── Title and Statistics
│   └── Data Management Controls
├── Filter and Search Section
│   ├── Search Bar
│   ├── Category Filters
│   ├── Priority Filters
│   ├── Tag Filters
│   └── Sort Controls
├── Task Creation Section
│   ├── Quick Templates
│   ├── Priority Selection
│   ├── Category Selection
│   ├── Tag Selection
│   └── Recurring Options
└── Task List Section
    ├── Pending Tasks
    ├── Completed Tasks
    └── Empty State
```

### Component Responsibilities

#### App Component
- **State Management**: Centralized state for all application data
- **Event Handling**: User interactions and data operations
- **Data Persistence**: localStorage integration
- **Business Logic**: Task operations and filtering
- **UI Orchestration**: Layout and component composition

#### Sub-Components (Logical Sections)
- **Header**: Statistics display and data management
- **Filters**: Search and filtering controls
- **Task Form**: Task creation and configuration
- **Task List**: Task display and interaction
- **Task Item**: Individual task rendering and controls

## State Management

### State Structure

```typescript
// Primary State
const [tasks, setTasks] = useState<Task[]>([]);

// Form State
const [newTaskTitle, setNewTaskTitle] = useState('');
const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
const [selectedCategory, setSelectedCategory] = useState<string>('');
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [isRecurring, setIsRecurring] = useState<boolean>(false);
const [recurringType, setRecurringType] = useState<RecurringType>('daily');

// Filter State
const [filterCategory, setFilterCategory] = useState<string>('');
const [filterPriority, setFilterPriority] = useState<string>('');
const [filterTag, setFilterTag] = useState<string>('');
const [searchQuery, setSearchQuery] = useState<string>('');
const [sortBy, setSortBy] = useState<SortOption>('created');
```

### State Flow

1. **User Input** → State Update → UI Re-render
2. **State Change** → Side Effect (localStorage) → Persistence
3. **Filter Change** → Computed State → Filtered Display
4. **Task Operation** → State Mutation → UI Update

### Performance Optimizations

#### Memoization Strategy
```typescript
// Expensive computations
const filteredTasks = useMemo(() => {
  // Complex filtering and sorting logic
}, [tasks, filters, searchQuery, sortBy]);

// Event handlers
const addTask = useCallback(() => {
  // Task creation logic
}, [dependencies]);

// Statistics
const categoryStats = useMemo(() => {
  // Category statistics computation
}, [tasks, categories]);
```

## Data Architecture

### Data Models

#### Task Entity
```typescript
interface Task {
  id: string;                    // Unique identifier
  title: string;                 // Required title
  description?: string;          // Optional description
  completed: boolean;            // Completion status
  dueDate?: Date;               // Optional due date
  priority: Priority;           // Required priority
  category?: string;            // Optional category ID
  tags: string[];               // Tag IDs array
  subtasks: Subtask[];          // Nested subtasks
  isRecurring?: boolean;        // Recurring flag
  recurringType?: RecurringType; // Recurrence pattern
  createdAt: Date;              // Creation timestamp
}
```

#### Subtask Entity
```typescript
interface Subtask {
  id: string;                   // Unique identifier
  title: string;                // Required title
  completed: boolean;           // Completion status
  createdAt: Date;             // Creation timestamp
}
```

### Data Flow

#### Create Operation
```
User Input → Validation → State Update → localStorage → UI Update
```

#### Read Operation
```
localStorage → State Initialization → Computed Values → UI Render
```

#### Update Operation
```
User Action → State Mutation → localStorage Sync → UI Re-render
```

#### Delete Operation
```
User Confirmation → State Filter → localStorage Update → UI Update
```

### Data Persistence

#### localStorage Schema
- **Key**: `todoTasks`
- **Format**: JSON string
- **Structure**: Array of Task objects
- **Error Handling**: Try-catch with fallback to empty array

#### Data Validation
- **Type Checking**: Runtime validation for imported data
- **Date Conversion**: String to Date object conversion
- **Schema Migration**: Version-aware data handling

## Business Logic

### Core Operations

#### Task Management
```typescript
// Task creation with validation
const createTask = (taskData: TaskInput): Task => {
  return {
    id: generateId(),
    ...taskData,
    completed: false,
    createdAt: new Date(),
    subtasks: []
  };
};

// Task completion with recurring logic
const completeTask = (task: Task): Task[] => {
  const updatedTask = { ...task, completed: true };
  const newTasks = [updatedTask];
  
  if (task.isRecurring) {
    newTasks.push(createRecurringInstance(task));
  }
  
  return newTasks;
};
```

#### Filtering Logic
```typescript
const applyFilters = (tasks: Task[], filters: FilterState): Task[] => {
  return tasks
    .filter(task => matchesCategory(task, filters.category))
    .filter(task => matchesPriority(task, filters.priority))
    .filter(task => matchesTags(task, filters.tags))
    .filter(task => matchesSearch(task, filters.search));
};
```

#### Sorting Logic
```typescript
const applySorting = (tasks: Task[], sortBy: SortOption): Task[] => {
  const sortFunctions = {
    created: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    priority: (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
    category: (a, b) => (a.category || '').localeCompare(b.category || '')
  };
  
  return [...tasks].sort(sortFunctions[sortBy]);
};
```

### Configuration Management

#### Categories Configuration
```typescript
const categories: Category[] = [
  { id: 'work', name: 'Work', icon: Briefcase, color: '#3B82F6' },
  { id: 'personal', name: 'Personal', icon: Home, color: '#10B981' },
  // ... additional categories
];
```

#### Tags Configuration
```typescript
const availableTags: Tag[] = [
  { id: 'urgent', name: 'Urgent', color: '#DC2626' },
  { id: 'important', name: 'Important', color: '#7C3AED' },
  // ... additional tags
];
```

## Performance Architecture

### Optimization Strategies

#### Rendering Optimization
- **React.memo**: Component memoization for expensive renders
- **useMemo**: Computation memoization for derived state
- **useCallback**: Event handler memoization
- **Key Props**: Efficient list rendering

#### Memory Management
- **Cleanup Effects**: useEffect cleanup functions
- **Event Listener Management**: Proper event binding/unbinding
- **State Normalization**: Efficient state structure
- **Garbage Collection**: Proper object lifecycle management

#### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for large features
- **Asset Optimization**: Image and CSS optimization
- **Dependency Analysis**: Bundle size monitoring

### Scalability Considerations

#### Future Enhancements
- **Component Splitting**: Breaking down the monolithic App component
- **State Management**: Migration to Redux or Zustand for complex state
- **Virtual Scrolling**: For large task lists
- **Web Workers**: For heavy computations

#### Performance Monitoring
- **Bundle Analysis**: Regular bundle size monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Memory Profiling**: Memory leak detection
- **Render Profiling**: Component render optimization

## Security Architecture

### Data Security
- **Input Sanitization**: XSS prevention
- **Data Validation**: Type and format validation
- **localStorage Security**: Client-side data protection
- **Error Handling**: Secure error messages

### Privacy Considerations
- **Local Storage**: No external data transmission
- **No Tracking**: Privacy-focused design
- **Data Ownership**: User controls all data
- **Export/Import**: User-controlled data portability

## Testing Architecture

### Testing Strategy
- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **Data Tests**: Data operation validation
- **Error Tests**: Error handling verification

### Test Structure
```
__tests__/
├── unit/
│   ├── task-operations.test.ts
│   ├── filtering.test.ts
│   └── data-persistence.test.ts
├── integration/
│   ├── task-lifecycle.test.ts
│   └── user-workflows.test.ts
└── App.test.tsx
```

This architecture provides a solid foundation for the current application while maintaining flexibility for future enhancements and scalability requirements.
