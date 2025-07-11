# Contributing to Todo List Lynx

Thank you for your interest in contributing to the Todo List Lynx project. This document provides guidelines and information for contributors to ensure a smooth and productive collaboration.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)

## Code of Conduct

### Our Commitment

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or personal characteristics.

### Expected Behavior

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Public or private harassment
- Publishing others' private information without permission
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **Git**: Latest stable version
- **Code Editor**: VS Code recommended with TypeScript support
- **Browser**: Modern browser for testing

### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/todo-list-lynx.git
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

4. **Verify Setup**
   - Ensure the application loads without errors
   - Run tests to confirm everything works: `npm test`
   - Check code quality: `npm run check`

## Development Workflow

### Branch Strategy

1. **Main Branch**: Production-ready code
2. **Feature Branches**: New features and enhancements
3. **Bugfix Branches**: Bug fixes and patches
4. **Hotfix Branches**: Critical production fixes

### Branch Naming Convention

- **Features**: `feature/description-of-feature`
- **Bug Fixes**: `bugfix/description-of-bug`
- **Hotfixes**: `hotfix/description-of-fix`
- **Documentation**: `docs/description-of-changes`

### Workflow Steps

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow coding standards
   - Write tests for new functionality
   - Update documentation as needed

3. **Test Changes**
   ```bash
   npm test                 # Run test suite
   npm run check           # Code quality checks
   npm run format          # Format code
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// Good: Explicit types
interface TaskFormData {
  title: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

// Avoid: Any types
const data: any = getFormData(); // Don't do this
```

#### Interface Definitions
```typescript
// Good: Clear interface structure
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Good: Optional properties
interface TaskUpdate {
  title?: string;
  completed?: boolean;
}
```

### React Best Practices

#### Component Structure
```typescript
// Good: Functional component with hooks
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleToggle = useCallback(() => {
    onToggle(task.id);
  }, [task.id, onToggle]);
  
  return (
    <div className="task-item">
      {/* Component JSX */}
    </div>
  );
}
```

#### Hook Usage
```typescript
// Good: Proper dependency arrays
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);

// Good: Memoized callbacks
const addTask = useCallback((taskData: TaskInput) => {
  setTasks(prev => [...prev, createTask(taskData)]);
}, []);
```

### CSS and Styling

#### Tailwind CSS Usage
```typescript
// Good: Semantic class combinations
<div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">

// Good: Responsive design
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### Custom CSS (when needed)
```css
/* Good: BEM methodology */
.task-item {
  @apply border rounded-lg p-4;
}

.task-item--completed {
  @apply opacity-50 line-through;
}

.task-item__title {
  @apply font-medium text-gray-900;
}
```

### Code Organization

#### File Structure
```
src/
├── components/          # Reusable components
│   ├── TaskItem/
│   │   ├── TaskItem.tsx
│   │   ├── TaskItem.test.tsx
│   │   └── index.ts
├── hooks/              # Custom hooks
├── types/              # Type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

#### Import Organization
```typescript
// 1. External libraries
import React, { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// 2. Internal modules
import { Task, TaskInput } from '../types';
import { createTask, validateTask } from '../utils';

// 3. Relative imports
import './TaskForm.css';
```

## Testing Guidelines

### Test Structure

#### Unit Tests
```typescript
describe('Task Operations', () => {
  it('should create a task with correct properties', () => {
    const taskData: TaskInput = {
      title: 'Test Task',
      priority: 'medium'
    };
    
    const task = createTask(taskData);
    
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeInstanceOf(Date);
  });
});
```

#### Component Tests
```typescript
describe('TaskItem Component', () => {
  it('should render task title correctly', () => {
    const task: Task = {
      id: '1',
      title: 'Test Task',
      completed: false,
      createdAt: new Date()
    };
    
    render(<TaskItem task={task} onToggle={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

### Test Coverage

- **Minimum Coverage**: 80% for new code
- **Critical Paths**: 100% coverage for core functionality
- **Edge Cases**: Test error conditions and boundary cases
- **Integration**: Test component interactions

### Testing Commands

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:ui            # Run tests with UI interface
```

## Pull Request Process

### PR Checklist

Before submitting a pull request, ensure:

- [ ] Code follows project coding standards
- [ ] All tests pass (`npm test`)
- [ ] Code quality checks pass (`npm run check`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] Documentation is updated if needed
- [ ] PR description clearly explains changes
- [ ] Breaking changes are documented
- [ ] Screenshots included for UI changes

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Include screenshots for UI changes.

## Additional Notes
Any additional information or context.
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one maintainer review required
3. **Testing**: Reviewer tests functionality manually
4. **Approval**: PR approved and merged by maintainer

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js: [e.g., 18.0.0]

## Additional Context
Screenshots, error messages, etc.
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the proposed feature.

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches considered.

## Additional Context
Mockups, examples, etc.
```

## Documentation

### Documentation Standards

- **Clear Language**: Use simple, clear language
- **Code Examples**: Include practical examples
- **Screenshots**: Visual aids for UI features
- **Up-to-date**: Keep documentation current with code changes

### Documentation Types

- **README**: Project overview and quick start
- **API Documentation**: Function and interface documentation
- **Architecture**: System design and structure
- **Contributing**: This document
- **Changelog**: Version history and changes

### Writing Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Fix bug" not "Fixes bug")
- Be concise but comprehensive
- Include examples and use cases
- Update related documentation when making changes

## Recognition

Contributors will be recognized in:

- **Contributors List**: GitHub contributors page
- **Changelog**: Major contributions noted in releases
- **Documentation**: Contributor acknowledgments
- **Community**: Shout-outs in project communications

Thank you for contributing to Todo List Lynx! Your efforts help make this project better for everyone.
