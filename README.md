# Todo List Application

A comprehensive, feature-rich todo list application built with the Lynx React framework, featuring advanced task management capabilities and a modern, responsive user interface.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Task Management
- **Task Creation**: Add tasks with titles, descriptions, and metadata
- **Task Completion**: Mark tasks as complete/incomplete with visual feedback
- **Task Deletion**: Remove tasks with confirmation
- **Data Persistence**: Automatic saving to localStorage with error handling
- **Real-time Statistics**: Live updates of task counts and completion rates

### Advanced Organization
- **Categories**: Six predefined categories (Work, Personal, Shopping, Health, Learning, Finance) with custom icons and colors
- **Priority Levels**: Three-tier priority system (High, Medium, Low) with color-coded indicators
- **Tags System**: Eight predefined tags (Urgent, Important, Quick Task, Meeting, Deadline, Research, Creative, Routine) with custom colors
- **Subtasks**: Hierarchical task breakdown with individual completion tracking
- **Recurring Tasks**: Automated task recreation with daily, weekly, or monthly intervals

### Search and Filtering
- **Full-text Search**: Search across task titles, descriptions, tags, and categories
- **Category Filtering**: Filter tasks by specific categories
- **Priority Filtering**: Filter by priority levels
- **Tag Filtering**: Filter by individual tags
- **Combined Filters**: Multiple simultaneous filters with active filter display
- **Sorting Options**: Sort by creation date, priority, or category

### Data Management
- **Export Functionality**: Download tasks as JSON with metadata and versioning
- **Import Functionality**: Upload and restore from JSON backups
- **Data Validation**: Robust error handling for import/export operations
- **Clear All Data**: Complete data reset with confirmation dialog

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Modern UI**: Clean interface with Tailwind CSS styling
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized rendering with React hooks and memoization
- **Visual Feedback**: Smooth animations and transitions

## Technology Stack

### Frontend Framework
- **Lynx React**: Mobile-first React framework for cross-platform development
- **React Hooks**: useState, useEffect, useCallback, useMemo for state management
- **TypeScript**: Full type safety with interface definitions

### Styling and UI
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Modern icon library for consistent iconography
- **Custom Animations**: CSS keyframes for enhanced user experience
- **Responsive Grid**: CSS Grid and Flexbox for layout management

### Build Tools and Development
- **Rspeedy**: Modern build tool based on Rsbuild and Rspack
- **Rsbuild**: Fast build tool with optimized bundling
- **Rspack**: High-performance bundler written in Rust
- **TypeScript Compiler**: Type checking and compilation
- **PostCSS**: CSS processing with Autoprefixer

### Testing and Quality
- **Vitest**: Fast unit testing framework
- **Testing Library**: React component testing utilities
- **Biome**: Code formatting and linting
- **Type Checking**: Compile-time type validation

### Development Tools
- **Hot Module Replacement**: Instant development feedback
- **Source Maps**: Debugging support
- **Bundle Analysis**: Performance optimization tools
- **QR Code Generation**: Mobile development workflow

## Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components (future expansion)
├── context/            # React context providers (future expansion)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, icons)
├── __tests__/          # Test files
├── App.tsx             # Main application component
├── App.css             # Application styles
└── index.tsx           # Application entry point
```

### Component Architecture
The application follows a single-component architecture with the main `App` component handling all state management and business logic. This approach is suitable for the current scope but can be easily refactored into smaller components as the application grows.

### State Management
- **Local State**: React useState hooks for component state
- **Derived State**: useMemo hooks for computed values
- **Side Effects**: useEffect hooks for data persistence and lifecycle management
- **Event Handlers**: useCallback hooks for optimized event handling

### Data Flow
1. **User Input**: Form interactions and button clicks
2. **State Updates**: Immutable state updates using React setState
3. **Side Effects**: Automatic localStorage synchronization
4. **UI Updates**: React re-rendering with optimized performance
5. **Data Persistence**: Background saving to browser storage

### Type System
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags: string[];
  subtasks: Subtask[];
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

### Performance Optimizations
- **Memoization**: useMemo for expensive computations
- **Callback Optimization**: useCallback for event handlers
- **Conditional Rendering**: Efficient DOM updates
- **List Virtualization**: Ready for large task lists
- **Bundle Splitting**: Code splitting for optimal loading

## Getting Started

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: npm (included with Node.js) or yarn
- **Git**: For version control and repository cloning
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Justin322322/todo-list-lynx.git
   cd todo-list-lynx
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Scan the QR code displayed in the terminal with LynxExplorer app
   - Or open the provided localhost URL in your browser

### Available Scripts

- **`npm run dev`**: Start development server with hot reload
- **`npm run build`**: Create production build
- **`npm run preview`**: Preview production build locally
- **`npm test`**: Run unit tests with Vitest
- **`npm run check`**: Run Biome code quality checks
- **`npm run format`**: Format code with Biome

### Environment Setup

The application requires no additional environment variables for basic functionality. All configuration is handled through the build system and framework defaults.

## Usage Guide

### Creating Your First Task

1. **Quick Templates**: Use predefined templates for common tasks
   - Click any template button (Buy groceries, Call dentist, etc.)
   - The task title will be automatically filled

2. **Custom Tasks**: Enter your own task details
   - Click in the task input area
   - Type your task title
   - Configure additional options as needed

3. **Task Configuration**:
   - **Priority**: Select High, Medium, or Low priority
   - **Category**: Choose from Work, Personal, Shopping, Health, Learning, Finance
   - **Tags**: Add multiple tags for better organization
   - **Recurring**: Enable for repeating tasks with daily, weekly, or monthly intervals

### Managing Tasks

#### Task Operations
- **Complete Task**: Click the checkbox next to any task
- **Delete Task**: Click the trash icon to remove a task
- **Add Subtasks**: Use the "Add subtask" button within any task
- **Manage Subtasks**: Check/uncheck and delete individual subtasks

#### Search and Filtering
- **Search**: Type in the search bar to find tasks by title, description, tags, or category
- **Quick Search**: Use suggestion chips for common searches
- **Category Filter**: Click category buttons to show only tasks from that category
- **Priority Filter**: Filter by High, Medium, or Low priority tasks
- **Tag Filter**: Show only tasks with specific tags
- **Clear Filters**: Use individual filter removal or "Clear All" button

#### Sorting Options
- **Created Date**: Show newest or oldest tasks first (default)
- **Priority**: Sort by priority level (High to Low)
- **Category**: Alphabetical sorting by category name

### Data Management

#### Export Data
1. Click the "Export" button in the header
2. A JSON file will be automatically downloaded
3. File includes all tasks, metadata, and export timestamp
4. Filename format: `todo-backup-YYYY-MM-DD.json`

#### Import Data
1. Click the "Import" button in the header
2. Select a previously exported JSON file
3. Data will be validated and imported
4. Existing tasks will be replaced with imported data

#### Clear All Data
1. Click the "Clear" button in the header
2. Confirm the action in the dialog
3. All tasks and data will be permanently removed
4. localStorage will be cleared

### Advanced Features

#### Recurring Tasks
- **Setup**: Enable "Make this a recurring task" when creating a task
- **Frequency**: Choose daily, weekly, or monthly recurrence
- **Behavior**: When marked complete, a new instance is automatically created
- **Subtasks**: Recurring tasks include all subtasks in new instances

#### Category Statistics
- **Overview**: View task counts by category in the filter section
- **Format**: Shows "pending/total" for each category
- **Visual Indicators**: Color-coded category icons and borders

#### Task Metadata
- **Creation Date**: Automatically tracked for all tasks
- **Completion Status**: Visual indicators and statistics
- **Priority Indicators**: Color-coded left border on task cards
- **Category Icons**: Visual category identification

## API Documentation

### Data Structures

#### Task Interface
```typescript
interface Task {
  id: string;                    // Unique identifier (timestamp-based)
  title: string;                 // Task title (required)
  description?: string;          // Optional task description
  completed: boolean;            // Completion status
  dueDate?: Date;               // Optional due date
  priority: 'low' | 'medium' | 'high';  // Priority level
  category?: string;            // Category ID (optional)
  tags: string[];               // Array of tag IDs
  subtasks: Subtask[];          // Array of subtasks
  isRecurring?: boolean;        // Recurring task flag
  recurringType?: 'daily' | 'weekly' | 'monthly';  // Recurrence frequency
  createdAt: Date;              // Creation timestamp
}
```

#### Subtask Interface
```typescript
interface Subtask {
  id: string;                   // Unique identifier
  title: string;                // Subtask title
  completed: boolean;           // Completion status
  createdAt: Date;             // Creation timestamp
}
```

#### Category Configuration
```typescript
interface Category {
  id: string;                   // Unique category identifier
  name: string;                 // Display name
  icon: React.ComponentType;    // Lucide React icon component
  color: string;                // Hex color code
}
```

#### Tag Configuration
```typescript
interface Tag {
  id: string;                   // Unique tag identifier
  name: string;                 // Display name
  color: string;                // Hex color code
}
```

### Core Functions

#### Task Management
- `addTask()`: Create new task with validation
- `toggleTask(id)`: Toggle task completion status
- `deleteTask(id)`: Remove task and all subtasks
- `addSubtask(taskId, title)`: Add subtask to existing task
- `toggleSubtask(taskId, subtaskId)`: Toggle subtask completion
- `deleteSubtask(taskId, subtaskId)`: Remove specific subtask

#### Data Operations
- `exportData()`: Generate and download JSON backup
- `importData(file)`: Parse and import JSON data
- `clearAllData()`: Remove all tasks and reset application

#### Filtering and Search
- `filteredTasks`: Computed property with applied filters
- `categoryStats`: Statistics by category
- `pendingTasks`: Incomplete tasks only
- `completedTasks`: Completed tasks only

### Local Storage Schema

#### Storage Key
- **Key**: `todoTasks`
- **Type**: JSON string
- **Structure**: Array of Task objects

#### Export Format
```json
{
  "tasks": [...],              // Array of Task objects
  "exportDate": "ISO string",  // Export timestamp
  "version": "1.0"            // Schema version
}
```

## Testing

### Test Suite Overview
The application includes comprehensive unit tests covering core functionality, data operations, and business logic validation.

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Categories

#### Core Functionality Tests
- Task creation with proper data structure
- Task completion status toggling
- Task deletion and cleanup
- Subtask management operations

#### Data Operations Tests
- JSON serialization and deserialization
- localStorage read/write operations
- Export data format validation
- Import data validation and error handling

#### Filtering and Search Tests
- Category-based filtering
- Priority-level filtering
- Tag-based filtering
- Full-text search functionality
- Combined filter operations

#### Validation Tests
- Priority level validation
- Date operation handling
- Data type validation
- Error boundary testing

### Test Files
- `src/App.test.tsx`: Main application component tests
- `src/__tests__/`: Additional test files for specific functionality

### Testing Best Practices
- **Unit Tests**: Focus on individual function testing
- **Integration Tests**: Test component interactions
- **Data Validation**: Ensure type safety and data integrity
- **Error Handling**: Test edge cases and error conditions

## Deployment

### Production Build

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Build Output**
   - Generated files in `dist/` directory
   - Optimized and minified assets
   - Source maps for debugging
   - Static files ready for hosting

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

### Deployment Options

#### Static Hosting Services
- **Vercel**: Automatic deployments from Git
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3**: Scalable cloud storage hosting
- **Firebase Hosting**: Google's hosting platform

#### Deployment Steps (Vercel Example)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on every push to main branch

#### Environment Considerations
- **Browser Compatibility**: Modern browsers with ES2020 support
- **Mobile Optimization**: Responsive design for all screen sizes
- **Performance**: Optimized bundle size and loading times
- **SEO**: Meta tags and structured data ready

### Performance Optimization

#### Build Optimizations
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Lazy loading for optimal performance
- **Asset Optimization**: Image and CSS optimization
- **Bundle Analysis**: Size monitoring and optimization

#### Runtime Optimizations
- **React Memoization**: Optimized re-rendering
- **Efficient State Updates**: Immutable state patterns
- **Event Handler Optimization**: useCallback implementation
- **Memory Management**: Proper cleanup and garbage collection

## Contributing

### Development Workflow

1. **Fork the Repository**
   ```bash
   git fork https://github.com/Justin322322/todo-list-lynx.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

4. **Run Quality Checks**
   ```bash
   npm run check    # Code quality
   npm run format   # Code formatting
   npm test         # Run test suite
   ```

5. **Submit Pull Request**
   - Provide clear description of changes
   - Include test coverage for new features
   - Ensure all checks pass

### Code Standards

#### TypeScript Guidelines
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` types
- Use proper generic types

#### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Follow React performance patterns
- Use proper key props for lists

#### CSS and Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic HTML elements

#### Testing Requirements
- Write tests for all new features
- Maintain test coverage above 80%
- Test both happy path and error cases
- Use descriptive test names

### Project Roadmap

#### Planned Features
- **User Authentication**: Multi-user support with cloud sync
- **Team Collaboration**: Shared task lists and assignments
- **Advanced Scheduling**: Calendar integration and reminders
- **Data Analytics**: Task completion insights and productivity metrics
- **Mobile App**: Native mobile application with offline support
- **API Integration**: Third-party service connections

#### Technical Improvements
- **Performance**: Virtual scrolling for large task lists
- **Accessibility**: Enhanced screen reader support
- **Internationalization**: Multi-language support
- **PWA Features**: Offline functionality and push notifications

## License

### MIT License

Copyright (c) 2024 Todo List Lynx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Built with Lynx React Framework** - A modern, mobile-first approach to web development.
