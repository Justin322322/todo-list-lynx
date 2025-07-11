import { useEffect, useState, useCallback, useMemo } from '@lynx-js/react'
import {
  Plus,
  Trash2,
  Download,
  Upload,
  CheckSquare,
  Square,
  Briefcase,
  Home,
  ShoppingCart,
  Heart,
  BookOpen,
  DollarSign,
  Repeat
} from 'lucide-react'
import './App.css'

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

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

export function App(props: {
  onMounted?: () => void
}) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('todoTasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert date strings back to Date objects
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          subtasks: task.subtasks?.map((subtask: any) => ({
            ...subtask,
            createdAt: new Date(subtask.createdAt)
          })) || []
        }));
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
    }
    return [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'category'>('created');

  const categories = [
    { id: 'work', name: 'Work', icon: Briefcase, color: '#3B82F6' },
    { id: 'personal', name: 'Personal', icon: Home, color: '#10B981' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: '#F59E0B' },
    { id: 'health', name: 'Health', icon: Heart, color: '#EF4444' },
    { id: 'learning', name: 'Learning', icon: BookOpen, color: '#8B5CF6' },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: '#06B6D4' }
  ];

  const availableTags = [
    { id: 'urgent', name: 'Urgent', color: '#DC2626' },
    { id: 'important', name: 'Important', color: '#7C3AED' },
    { id: 'quick', name: 'Quick Task', color: '#059669' },
    { id: 'meeting', name: 'Meeting', color: '#2563EB' },
    { id: 'deadline', name: 'Deadline', color: '#EA580C' },
    { id: 'research', name: 'Research', color: '#0891B2' },
    { id: 'creative', name: 'Creative', color: '#C026D3' },
    { id: 'routine', name: 'Routine', color: '#65A30D' }
  ];

  useEffect(() => {
    console.info('Hello, Todo App with ReactLynx!')
    props.onMounted?.()
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('todoTasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const addTask = useCallback(() => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        priority: selectedPriority,
        category: selectedCategory || undefined,
        tags: selectedTags,
        subtasks: [],
        isRecurring: isRecurring,
        recurringType: isRecurring ? recurringType : undefined,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setSelectedPriority('medium');
      setSelectedCategory('');
      setSelectedTags([]);
      setIsRecurring(false);
      setRecurringType('daily');
    }
  }, [newTaskTitle, selectedPriority, selectedCategory, selectedTags]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };

        // If completing a recurring task, create a new instance
        if (!task.completed && task.isRecurring && task.recurringType) {
          const nextDate = new Date();
          switch (task.recurringType) {
            case 'daily':
              nextDate.setDate(nextDate.getDate() + 1);
              break;
            case 'weekly':
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case 'monthly':
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
          }

          // Create new recurring task instance
          const newRecurringTask: Task = {
            ...task,
            id: Date.now().toString(),
            completed: false,
            subtasks: task.subtasks.map(subtask => ({
              ...subtask,
              id: Date.now().toString() + Math.random(),
              completed: false
            })),
            createdAt: nextDate
          };

          // Add the new task to the list
          setTimeout(() => {
            setTasks(current => [...current, newRecurringTask]);
          }, 100);
        }

        return updatedTask;
      }
      return task;
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const addSubtask = useCallback((taskId: string, subtaskTitle: string) => {
    if (subtaskTitle.trim()) {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [...task.subtasks, {
                id: Date.now().toString(),
                title: subtaskTitle.trim(),
                completed: false,
                createdAt: new Date()
              }]
            }
          : task
      ));
    }
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    ));
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
          }
        : task
    ));
  }, []);

  const exportData = useCallback(() => {
    try {
      const dataToExport = {
        tasks,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }, [tasks]);

  const importData = useCallback((event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.tasks && Array.isArray(importedData.tasks)) {
            const importedTasks = importedData.tasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              subtasks: task.subtasks?.map((subtask: any) => ({
                ...subtask,
                createdAt: new Date(subtask.createdAt)
              })) || []
            }));
            setTasks(importedTasks);
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const clearAllData = useCallback(() => {
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      setTasks([]);
      localStorage.removeItem('todoTasks');
    }
  }, []);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    // Apply priority filter
    if (filterPriority) {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Apply tag filter
    if (filterTag) {
      filtered = filtered.filter(task => task.tags.includes(filterTag));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.tags.some(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          return tag && tag.name.toLowerCase().includes(query);
        }) ||
        (task.category && categories.find(c => c.id === task.category)?.name.toLowerCase().includes(query))
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'category':
          const aCat = a.category || 'zzz';
          const bCat = b.category || 'zzz';
          return aCat.localeCompare(bCat);
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [tasks, filterCategory, filterPriority, filterTag, searchQuery, sortBy, availableTags, categories]);

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  // Get task statistics by category
  const categoryStats = useMemo(() => {
    return categories.map(category => {
      const categoryTasks = tasks.filter(task => task.category === category.id);
      return {
        ...category,
        total: categoryTasks.length,
        completed: categoryTasks.filter(task => task.completed).length,
        pending: categoryTasks.filter(task => !task.completed).length
      };
    });
  }, [tasks, categories]);

  return (
    <view className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <view className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-0">
        {/* Header */}
        <view className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-4">
          <view className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <text className="text-xl sm:text-2xl font-bold text-gray-900">My Todo List</text>

            {/* Data Management */}
            <view className="flex gap-1 sm:gap-2 flex-wrap">
              <view
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
                bindtap={exportData}
              >
                <Download size={16} />
                <text className="text-white text-xs sm:text-sm font-medium hidden sm:inline">Export</text>
              </view>

              <view
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-colors"
                bindtap={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = importData;
                  input.click();
                }}
              >
                <Upload size={16} />
                <text className="text-white text-xs sm:text-sm font-medium hidden sm:inline">Import</text>
              </view>

              <view
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-colors"
                bindtap={clearAllData}
              >
                <Trash2 size={16} />
                <text className="text-white text-xs sm:text-sm font-medium hidden sm:inline">Clear</text>
              </view>
            </view>
          </view>

          <view className="grid grid-cols-3 gap-2 sm:gap-4 sm:flex sm:flex-wrap">
            <view className="flex flex-col items-center bg-blue-50 rounded-lg px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-[80px]">
              <text className="text-lg sm:text-xl font-bold text-blue-600">{tasks.length}</text>
              <text className="text-xs sm:text-sm text-blue-600 opacity-70">Total</text>
            </view>
            <view className="flex flex-col items-center bg-yellow-50 rounded-lg px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-[80px]">
              <text className="text-lg sm:text-xl font-bold text-yellow-600">{pendingTasks.length}</text>
              <text className="text-xs sm:text-sm text-yellow-600 opacity-70">Pending</text>
            </view>
            <view className="flex flex-col items-center bg-green-50 rounded-lg px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-[80px]">
              <text className="text-lg sm:text-xl font-bold text-green-600">{completedTasks.length}</text>
              <text className="text-xs sm:text-sm text-green-600 opacity-70">Completed</text>
            </view>
          </view>
        </view>

        {/* Filter and Sort Section */}
        <view className="bg-gray-50 border-b border-gray-200 px-3 sm:px-6 py-4">
          <text className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</text>

          {/* Search Bar */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Search Tasks:</text>
            <view className="flex gap-2 items-center mb-2">
              <view className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg bg-white min-h-[40px] flex items-center">
                <text className="text-sm text-gray-500">{searchQuery || 'Type to search tasks, tags, categories...'}</text>
              </view>
              <view
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer transition-colors"
                bindtap={() => setSearchQuery('')}
              >
                <text className="text-sm font-medium text-gray-700">Clear</text>
              </view>
            </view>

            {/* Quick Search Suggestions */}
            <view className="flex gap-2 flex-wrap">
              {['urgent', 'work', 'today', 'meeting', 'important'].map(suggestion => (
                <view
                  key={suggestion}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer transition-colors"
                  bindtap={() => setSearchQuery(suggestion)}
                >
                  <text className="text-xs text-gray-600 font-medium">{suggestion}</text>
                </view>
              ))}
            </view>
          </view>

          {/* Category Filter */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Filter by Category:</text>
            <view className="flex gap-2 flex-wrap">
              <view
                className={`flex items-center gap-1 px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                  !filterCategory
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                bindtap={() => setFilterCategory('')}
              >
                <text className="text-sm font-medium">All</text>
              </view>
              {categories.map(category => (
                <view
                  key={category.id}
                  className={`flex items-center gap-1 px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                    filterCategory === category.id
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  bindtap={() => setFilterCategory(category.id)}
                >
                  <category.icon size={16} />
                  <text className="text-sm font-medium">{category.name}</text>
                </view>
              ))}
            </view>
          </view>

          {/* Priority Filter */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority:</text>
            <view className="flex gap-2 flex-wrap">
              <view
                className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                  !filterPriority
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                bindtap={() => setFilterPriority('')}
              >
                <text className="text-sm font-medium">All</text>
              </view>
              {(['high', 'medium', 'low'] as const).map(priority => (
                <view
                  key={priority}
                  className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                    filterPriority === priority
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  bindtap={() => setFilterPriority(priority)}
                >
                  <text className="text-sm font-medium">{priority.toUpperCase()}</text>
                </view>
              ))}
            </view>
          </view>

          {/* Tag Filter */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Filter by Tag:</text>
            <view className="flex gap-2 flex-wrap">
              <view
                className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                  !filterTag
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                bindtap={() => setFilterTag('')}
              >
                <text className="text-sm font-medium">All</text>
              </view>
              {availableTags.map(tag => (
                <view
                  key={tag.id}
                  className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                    filterTag === tag.id
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ borderColor: filterTag === tag.id ? '#3b82f6' : tag.color }}
                  bindtap={() => setFilterTag(tag.id)}
                >
                  <text
                    className="text-sm font-medium"
                    style={{ color: filterTag === tag.id ? 'white' : tag.color }}
                  >
                    {tag.name}
                  </text>
                </view>
              ))}
            </view>
          </view>

          {/* Sort Options */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Sort by:</text>
            <view className="flex gap-2 flex-wrap">
              {[
                { id: 'created', label: 'Created Date' },
                { id: 'priority', label: 'Priority' },
                { id: 'category', label: 'Category' }
              ].map(option => (
                <view
                  key={option.id}
                  className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                    sortBy === option.id
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  bindtap={() => setSortBy(option.id as 'created' | 'priority' | 'category')}
                >
                  <text className="text-sm font-medium">{option.label}</text>
                </view>
              ))}
            </view>
          </view>

          {/* Filter Status and Clear */}
          <view className="mt-4 pt-4 border-t border-gray-200">
            {(searchQuery || filterCategory || filterPriority || filterTag) && (
              <view className="mb-3">
                <text className="block text-sm font-medium text-gray-700 mb-2">Active Filters:</text>
                <view className="flex gap-2 flex-wrap mb-2">
                  {searchQuery && (
                    <view className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                      <text className="text-white font-medium">Search: "{searchQuery}"</text>
                      <text className="text-white font-bold cursor-pointer px-1" bindtap={() => setSearchQuery('')}>×</text>
                    </view>
                  )}
                  {filterCategory && (
                    <view className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                      <text className="text-white font-medium">Category: {categories.find(c => c.id === filterCategory)?.name}</text>
                      <text className="text-white font-bold cursor-pointer px-1" bindtap={() => setFilterCategory('')}>×</text>
                    </view>
                  )}
                  {filterPriority && (
                    <view className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                      <text className="text-white font-medium">Priority: {filterPriority.toUpperCase()}</text>
                      <text className="text-white font-bold cursor-pointer px-1" bindtap={() => setFilterPriority('')}>×</text>
                    </view>
                  )}
                  {filterTag && (
                    <view className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                      <text className="text-white font-medium">Tag: {availableTags.find(t => t.id === filterTag)?.name}</text>
                      <text className="text-white font-bold cursor-pointer px-1" bindtap={() => setFilterTag('')}>×</text>
                    </view>
                  )}
                </view>
                <view
                  className="inline-block px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer transition-colors"
                  bindtap={() => {
                    setSearchQuery('');
                    setFilterCategory('');
                    setFilterPriority('');
                    setFilterTag('');
                  }}
                >
                  <text className="text-white font-medium text-sm">Clear All</text>
                </view>
              </view>
            )}

            <view className="text-center py-2">
              <text className="text-sm text-gray-500 font-medium">
                Showing {pendingTasks.length + completedTasks.length} of {tasks.length} tasks
              </text>
            </view>
          </view>

          {/* Category Statistics */}
          <view className="mt-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Category Overview:</text>
            <view className="flex gap-3 flex-wrap">
              {categoryStats.map(stat => (
                <view
                  key={stat.id}
                  className="flex flex-col items-center p-3 border-2 rounded-lg bg-white min-w-[80px] hover:shadow-md transition-shadow"
                  style={{ borderColor: stat.color }}
                >
                  <stat.icon size={20} />
                  <text className="text-xs font-medium text-gray-700 mb-1">{stat.name}</text>
                  <text className="text-sm font-bold text-gray-600">{stat.pending}/{stat.total}</text>
                </view>
              ))}
            </view>
          </view>
        </view>

        {/* Add Task Section */}
        <view className="bg-white px-3 sm:px-6 py-4 border-b border-gray-200">
          <text className="text-lg font-semibold text-gray-900 mb-4">Add New Task</text>

          {/* Quick Templates */}
          <view className="flex gap-2 flex-wrap mb-4">
            {[
              'Buy groceries',
              'Call dentist',
              'Review project',
              'Exercise',
              'Read book'
            ].map(template => (
              <view
                key={template}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer transition-colors"
                bindtap={() => setNewTaskTitle(template)}
              >
                <text className="text-sm text-gray-700">{template}</text>
              </view>
            ))}
          </view>

          {/* Priority Selection */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Priority</text>
            <view className="flex gap-2 flex-wrap">
              {(['low', 'medium', 'high'] as const).map(priority => (
                <view
                  key={priority}
                  className={`px-4 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPriority === priority
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  bindtap={() => setSelectedPriority(priority)}
                >
                  <text className="text-sm font-medium">{priority.toUpperCase()}</text>
                </view>
              ))}
            </view>
          </view>

          {/* Category Selection */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Category</text>
            <view className="flex gap-2 flex-wrap">
              <view
                className={`flex items-center gap-1 px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                  !selectedCategory
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                bindtap={() => setSelectedCategory('')}
              >
                <text className="text-sm font-medium">No Category</text>
              </view>
              {categories.map(category => (
                <view
                  key={category.id}
                  className={`flex items-center gap-1 px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  bindtap={() => setSelectedCategory(category.id)}
                >
                  <category.icon size={16} />
                  <text className="text-sm font-medium">{category.name}</text>
                </view>
              ))}
            </view>
          </view>

          {/* Tags Selection */}
          <view className="mb-4">
            <text className="block text-sm font-medium text-gray-700 mb-2">Tags</text>
            <view className="flex gap-2 flex-wrap">
              {availableTags.map(tag => (
                <view
                  key={tag.id}
                  className={`px-3 py-1.5 border-2 rounded-full cursor-pointer transition-all text-xs font-medium ${
                    selectedTags.includes(tag.id)
                      ? 'text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                    borderColor: tag.color,
                    color: selectedTags.includes(tag.id) ? 'white' : tag.color
                  }}
                  bindtap={() => {
                    if (selectedTags.includes(tag.id)) {
                      setSelectedTags(prev => prev.filter(id => id !== tag.id));
                    } else {
                      setSelectedTags(prev => [...prev, tag.id]);
                    }
                  }}
                >
                  <text
                    className="text-xs font-medium"
                    style={{
                      color: selectedTags.includes(tag.id) ? 'white' : tag.color
                    }}
                  >
                    {tag.name}
                  </text>
                </view>
              ))}
            </view>
          </view>

          {/* Recurring Task Options */}
          <view className="mb-4">
            <view className="flex items-center gap-2 mb-2">
              <view
                className={`w-4 h-4 border-2 rounded cursor-pointer transition-colors flex items-center justify-center ${
                  isRecurring
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
                bindtap={() => setIsRecurring(!isRecurring)}
              >
                {isRecurring && <CheckSquare size={12} className="text-white" />}
              </view>
              <text className="text-sm font-medium text-gray-700">Make this a recurring task</text>
            </view>

            {isRecurring && (
              <view className="ml-6">
                <text className="block text-sm font-medium text-gray-700 mb-2">Repeat every:</text>
                <view className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map(type => (
                    <view
                      key={type}
                      className={`px-3 py-1.5 border-2 rounded-lg cursor-pointer transition-all ${
                        recurringType === type
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      bindtap={() => setRecurringType(type)}
                    >
                      <text className="text-sm font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</text>
                    </view>
                  ))}
                </view>
              </view>
            )}
          </view>

          {/* Add Task Actions */}
          <view className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <view className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[40px] flex items-center">
              <text className="text-sm text-gray-500">{newTaskTitle || 'Select a template above or tap here to enter custom task...'}</text>
            </view>
            <view
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-center ${
                !newTaskTitle.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              bindtap={!newTaskTitle.trim() ? undefined : addTask}
            >
              <text className={`font-semibold ${!newTaskTitle.trim() ? 'text-gray-500' : 'text-white'}`}>Add Task</text>
            </view>
          </view>
        </view>

        {/* Task List */}
        <scroll-view className="flex-1 px-3 sm:px-6 py-4">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <view className="mb-6">
              <text className="text-lg font-semibold text-gray-900 mb-3">Pending Tasks ({pendingTasks.length})</text>
              <view className="space-y-2">
                {pendingTasks.map(task => {
                  const category = categories.find(c => c.id === task.category);
                  const priorityColors = {
                    high: 'bg-red-500',
                    medium: 'bg-yellow-500',
                    low: 'bg-green-500'
                  };

                  return (
                    <view key={task.id} className="relative flex bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                      {/* Priority indicator */}
                      <view className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${priorityColors[task.priority]}`} />

                      <view className="flex-1 ml-2">
                        <view className="flex items-start gap-3 mb-2">
                          <view
                            className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mt-0.5"
                            bindtap={() => toggleTask(task.id)}
                          >
                            <Square size={16} className="text-gray-400" />
                          </view>
                          <text className="flex-1 text-sm sm:text-base font-medium text-gray-900 cursor-pointer">{task.title}</text>
                          <view className="flex gap-2">
                            <view
                              className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              bindtap={() => deleteTask(task.id)}
                            >
                              <Trash2 size={16} />
                            </view>
                          </view>
                        </view>

                        {/* Task metadata */}
                        <view className="flex gap-2 items-center flex-wrap mb-2">
                          {/* Category */}
                          {category && (
                            <view className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: category.color }}>
                              <category.icon size={12} />
                              <text className="text-xs font-medium text-white">{category.name}</text>
                            </view>
                          )}

                          {/* Priority */}
                          <view className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            <text className="text-xs font-medium">{task.priority.toUpperCase()}</text>
                          </view>

                          {/* Recurring indicator */}
                          {task.isRecurring && (
                            <view className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                              <Repeat size={12} />
                              <text className="text-xs font-medium">{task.recurringType}</text>
                            </view>
                          )}

                          {/* Created date */}
                          <view className="px-2 py-1 bg-gray-100 rounded-full">
                            <text className="text-xs text-gray-600">Created: {task.createdAt.toLocaleDateString()}</text>
                          </view>
                        </view>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <view className="flex gap-1 flex-wrap mt-2">
                            {task.tags.map(tagId => {
                              const tag = availableTags.find(t => t.id === tagId);
                              return tag ? (
                                <view
                                  key={tagId}
                                  className="px-2 py-0.5 rounded-full text-xs text-white"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  <text className="text-xs font-medium text-white">{tag.name}</text>
                                </view>
                              ) : null;
                            })}
                          </view>
                        )}

                        {/* Subtasks */}
                        {task.subtasks.length > 0 && (
                          <view className="mt-3 pl-4 border-l-2 border-gray-200">
                            <text className="text-sm font-medium text-gray-700 mb-2">Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</text>
                            <view className="space-y-1">
                              {task.subtasks.map(subtask => (
                                <view key={subtask.id} className="flex items-center gap-2">
                                  <view
                                    className={`w-4 h-4 border rounded cursor-pointer transition-colors ${
                                      subtask.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-300 hover:border-blue-500'
                                    }`}
                                    bindtap={() => toggleSubtask(task.id, subtask.id)}
                                  >
                                    {subtask.completed && <CheckSquare size={12} className="text-white" />}
                                  </view>
                                  <text className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                    {subtask.title}
                                  </text>
                                  <view
                                    className="text-red-500 hover:bg-red-50 rounded p-1 cursor-pointer"
                                    bindtap={() => deleteSubtask(task.id, subtask.id)}
                                  >
                                    <Trash2 size={12} />
                                  </view>
                                </view>
                              ))}
                            </view>
                          </view>
                        )}

                        {/* Add Subtask */}
                        <view className="mt-3 pt-2 border-t border-gray-100">
                          <view className="flex gap-2 items-center">
                            <view className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50">
                              <text className="text-xs text-gray-500">Add subtask...</text>
                            </view>
                            <view
                              className="flex items-center justify-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs cursor-pointer transition-colors"
                              bindtap={() => addSubtask(task.id, 'New subtask')}
                            >
                              <Plus size={12} />
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  );
                })}
              </view>
            </view>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <view className="mb-6">
              <text className="text-lg font-semibold text-gray-900 mb-3">Completed Tasks ({completedTasks.length})</text>
              <view className="space-y-2">
                {completedTasks.map(task => {
                  const category = categories.find(c => c.id === task.category);
                  const priorityColors = {
                    high: 'bg-red-500',
                    medium: 'bg-yellow-500',
                    low: 'bg-green-500'
                  };

                  return (
                    <view key={task.id} className="relative flex bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-70">
                      {/* Priority indicator */}
                      <view className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${priorityColors[task.priority]} opacity-50`} />

                      <view className="flex-1 ml-2">
                        <view className="flex items-start gap-3 mb-2">
                          <view
                            className="w-5 h-5 bg-green-500 border-2 border-green-500 rounded flex items-center justify-center cursor-pointer mt-0.5"
                            bindtap={() => toggleTask(task.id)}
                          >
                            <CheckSquare size={16} className="text-white" />
                          </view>
                          <text className="flex-1 text-base font-medium text-gray-600 line-through cursor-pointer">{task.title}</text>
                          <view className="flex gap-2">
                            <view
                              className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              bindtap={() => deleteTask(task.id)}
                            >
                              <Trash2 size={16} />
                            </view>
                          </view>
                        </view>

                        {/* Task metadata */}
                        <view className="flex gap-2 items-center flex-wrap mb-2 opacity-70">
                          {/* Category */}
                          {category && (
                            <view className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: category.color }}>
                              <category.icon size={12} />
                              <text className="text-xs font-medium text-white">{category.name}</text>
                            </view>
                          )}

                          {/* Priority */}
                          <view className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            <text className="text-xs font-medium">{task.priority.toUpperCase()}</text>
                          </view>

                          {/* Created date */}
                          <view className="px-2 py-1 bg-gray-100 rounded-full">
                            <text className="text-xs text-gray-600">Completed</text>
                          </view>
                        </view>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <view className="flex gap-1 flex-wrap mt-2 opacity-70">
                            {task.tags.map(tagId => {
                              const tag = availableTags.find(t => t.id === tagId);
                              return tag ? (
                                <view
                                  key={tagId}
                                  className="px-2 py-0.5 rounded-full text-xs text-white"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  <text className="text-xs font-medium text-white">{tag.name}</text>
                                </view>
                              ) : null;
                            })}
                          </view>
                        )}
                      </view>
                    </view>
                  );
                })}
              </view>
            </view>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <view className="flex flex-col items-center justify-center py-16 text-center">
              <view className="mb-4 opacity-50">
                <CheckSquare size={64} className="text-gray-400" />
              </view>
              <text className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</text>
              <text className="text-gray-500 max-w-xs leading-relaxed">
                Select a template above to create your first task!
              </text>
            </view>
          )}
        </scroll-view>
      </view>
    </view>
  )
}
