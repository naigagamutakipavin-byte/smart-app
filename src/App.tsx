import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  Check,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Gift,
  MapPin,
  Users,
  CheckSquare,
  X,
  RotateCcw,
  Tag,
  Info,
  ExternalLink,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  UserPlus,
  ShieldAlert,
  User
} from 'lucide-react';

// Type definitions
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: 'birthday' | 'holiday' | 'meeting' | 'task';
  tag: 'Urgent' | 'Running' | 'Ongoing';
  isAllDay: boolean;
  startTime: string; // e.g. "10:00 AM"
  endTime: string; // e.g. "02:00 PM"
  isCompleted: boolean;
}

type ThemeType = 'coral' | 'teal' | 'indigo' | 'rose';

const THEMES = {
  coral: {
    primary: 'bg-[#f97316]',
    text: 'text-[#f97316]',
    border: 'border-[#f97316]',
    borderFocus: 'focus:border-[#f97316]',
    ring: 'focus:ring-[#f97316]',
    light: 'bg-[#ffedd5]',
    lightText: 'text-[#ea580c]',
    gradient: 'from-orange-500 to-amber-500',
    accent: '#f97316',
    hover: 'hover:bg-[#ea580c]',
    bubble: 'bg-orange-100 text-orange-800'
  },
  teal: {
    primary: 'bg-[#0d9488]',
    text: 'text-[#0d9488]',
    border: 'border-[#0d9488]',
    borderFocus: 'focus:border-[#0d9488]',
    ring: 'focus:ring-[#0d9488]',
    light: 'bg-[#ccfbf1]',
    lightText: 'text-[#0f766e]',
    gradient: 'from-teal-500 to-emerald-500',
    accent: '#0d9488',
    hover: 'hover:bg-[#0f766e]',
    bubble: 'bg-teal-100 text-teal-800'
  },
  indigo: {
    primary: 'bg-[#6366f1]',
    text: 'text-[#6366f1]',
    border: 'border-[#6366f1]',
    borderFocus: 'focus:border-[#6366f1]',
    ring: 'focus:ring-[#6366f1]',
    light: 'bg-[#e0e7ff]',
    lightText: 'text-[#4338ca]',
    gradient: 'from-indigo-500 to-purple-500',
    accent: '#6366f1',
    hover: 'hover:bg-[#4f46e5]',
    bubble: 'bg-indigo-100 text-indigo-800'
  },
  rose: {
    primary: 'bg-[#f43f5e]',
    text: 'text-[#f43f5e]',
    border: 'border-[#f43f5e]',
    borderFocus: 'focus:border-[#f43f5e]',
    ring: 'focus:ring-[#f43f5e]',
    light: 'bg-[#ffe4e6]',
    lightText: 'text-[#be123c]',
    gradient: 'from-rose-500 to-pink-500',
    accent: '#f43f5e',
    hover: 'hover:bg-[#e11d48]',
    bubble: 'bg-rose-100 text-rose-800'
  },
};

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Independence Day Picnic',
    description: 'National holiday celebrating freedom. Barbecue, parade, and fireworks with family!',
    date: '2026-07-04',
    category: 'holiday',
    tag: 'Ongoing',
    isAllDay: true,
    startTime: '09:00 AM',
    endTime: '09:00 PM',
    isCompleted: false,
  },
  {
    id: 'evt-2',
    title: 'Project Kickoff Sync',
    description: 'Review modern designs and establish initial roadmap with product owners.',
    date: '2026-07-07',
    category: 'meeting',
    tag: 'Running',
    isAllDay: false,
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    isCompleted: false,
  },
  {
    id: 'evt-3',
    title: "Alice's Surprise Birthday Party",
    description: "Alice turns 28! Surprise party at the rooftop garden. Bring gifts and cupcakes. Cake cutting at 8:00 PM.",
    date: '2026-07-10',
    category: 'birthday',
    tag: 'Urgent',
    isAllDay: false,
    startTime: '07:00 PM',
    endTime: '11:00 PM',
    isCompleted: false,
  },
  {
    id: 'evt-4',
    title: 'Bastille Day Celebration',
    description: 'French National Day. Evening dinner with wine, cheese, and music.',
    date: '2026-07-14',
    category: 'holiday',
    tag: 'Ongoing',
    isAllDay: true,
    startTime: '08:00 AM',
    endTime: '10:00 PM',
    isCompleted: false,
  },
  {
    id: 'evt-5',
    title: 'UI Design Review',
    description: 'Weekly presentation of high-fidelity dashboard interactive calendar views and theme sliders.',
    date: '2026-07-15',
    category: 'meeting',
    tag: 'Running',
    isAllDay: false,
    startTime: '02:30 PM',
    endTime: '04:00 PM',
    isCompleted: false,
  },
  {
    id: 'evt-6',
    title: "Bob's Birthday Dinner",
    description: 'Surprise family dinner with wood-fired pizzas at the local Italian bistro.',
    date: '2026-07-22',
    category: 'birthday',
    tag: 'Ongoing',
    isAllDay: true,
    startTime: '06:00 PM',
    endTime: '09:00 PM',
    isCompleted: false,
  },
  {
    id: 'evt-7',
    title: 'Deliver Figma Visual Assets',
    description: 'Finalize mobile layout templates, export vector files, and submit project checklist.',
    date: '2026-07-25',
    category: 'task',
    tag: 'Urgent',
    isAllDay: false,
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    isCompleted: false,
  },
  {
    id: 'evt-8',
    title: 'Morning Gym Cardio Loop',
    description: 'Early high-intensity interval training, full-body stretch, and dynamic warmups.',
    date: '2026-07-25',
    category: 'task',
    tag: 'Running',
    isAllDay: false,
    startTime: '06:30 AM',
    endTime: '07:30 AM',
    isCompleted: true,
  },
  {
    id: 'evt-9',
    title: "Marketing Sync Briefing",
    description: "Prepare presentation decks for product strategy alignment.",
    date: '2026-07-28',
    category: 'meeting',
    tag: 'Ongoing',
    isAllDay: false,
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    isCompleted: false,
  }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['W', 'T', 'F', 'S', 'S', 'M', 'T']; // Custom weekday alignment to match mockup
const STANDARD_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function App() {
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('coral');

  // User State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('calendar_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Login/Signup Form States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('calendar_user');
    setCurrentUser(null);
    setAuthEmail('');
    setAuthPassword('');
    showToast('🔓 Logged out successfully. Welcome back to local workspace.');
  };

  // Calendar navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 7)); // Default July 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-07'); // Default July 7, 2026
  
  // Supabase integration status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    url: string | null;
    message: string;
  }>({
    configured: false,
    url: null,
    message: 'Checking connection state...'
  });

  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

  // Data State
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('calendar_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved events', e);
      }
    }
    return INITIAL_EVENTS;
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'birthday' | 'holiday' | 'meeting' | 'task'>('all');
  const [searchExpanded, setSearchExpanded] = useState(false);

  // App Layout Responsive State
  const [mobileActiveTab, setMobileActiveTab] = useState<'calendar' | 'create'>('calendar');

  // Month Selector Dropdown state
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  // Form State
  const [formType, setFormType] = useState<'task' | 'event'>('task');
  const [formTitle, setFormTitle] = useState('');
  const [formIsAllDay, setFormIsAllDay] = useState(false);
  const [formDate, setFormDate] = useState('2026-07-07');
  const [formStartTime, setFormStartTime] = useState('10:00 AM');
  const [formEndTime, setFormEndTime] = useState('02:00 PM');
  const [formCategory, setFormCategory] = useState<'birthday' | 'holiday' | 'meeting' | 'task'>('task');
  const [formTag, setFormTag] = useState<'Urgent' | 'Running' | 'Ongoing'>('Running');
  const [formDescription, setFormDescription] = useState('');

  // Toast State for satisfying interactions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check Supabase connection and pull events on component load or user change
  useEffect(() => {
    async function initSupabaseSync() {
      setIsLoadingSupabase(true);
      try {
        const res = await fetch('/api/supabase-status');
        const status = await res.json();
        setSupabaseStatus(status);

        if (status.configured) {
          const headers: any = {};
          if (currentUser && currentUser.id) {
            headers['x-user-id'] = currentUser.id;
          }
          const eventsRes = await fetch('/api/events', { headers });
          const data = await eventsRes.json();
          if (data.success) {
            setEvents(data.events || []);
            if (currentUser) {
              showToast(`⚡ Synchronized perfectly with database for ${currentUser.email}!`);
            } else {
              showToast('⚡ Synchronized perfectly with your Supabase database!');
            }
          } else {
            setSupabaseStatus(prev => ({
              ...prev,
              message: `Error query database: ${data.error || 'Check if calendar_events table is created.'}`
            }));
            showToast(`⚠️ Database Warning: ${data.error || 'Check table configuration'}`);
          }
        }
      } catch (e) {
        console.error('Failed to communicate with proxy API:', e);
      } finally {
        setIsLoadingSupabase(false);
      }
    }

    initSupabaseSync();
  }, [currentUser]);

  // Sync date selection to form
  useEffect(() => {
    setFormDate(selectedDateStr);
  }, [selectedDateStr]);

  // Save localized backup cache
  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }, [events]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper: Month-Year label
  const activeYear = currentDate.getFullYear();
  const activeMonthIndex = currentDate.getMonth();

  // Helper to generate calendar grid (perfect 42-day layout)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarGrid = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    // Let's implement standard Monday-to-Sunday or Sunday-to-Saturday layout.
    // In our calendar widget, let's use standard Sunday-first layout for calculations,
    // which aligns beautifully and reliably.
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

    const prevMonthIndex = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

    const grid: { dayNum: number; dateStr: string; isCurrentMonth: boolean; weekdayName: string }[] = [];

    // 1. Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const m = prevMonthIndex + 1;
      const dateStr = `${prevYear}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(prevYear, prevMonthIndex, day).getDay();
      grid.push({
        dayNum: day,
        dateStr,
        isCurrentMonth: false,
        weekdayName: STANDARD_WEEKDAYS[dayOfWeek]
      });
    }

    // 2. Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const m = month + 1;
      const dateStr = `${year}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayOfWeek = new Date(year, month, i).getDay();
      grid.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
        weekdayName: STANDARD_WEEKDAYS[dayOfWeek]
      });
    }

    // 3. Next month padding
    const remainingCells = 42 - grid.length;
    const nextMonthIndex = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let i = 1; i <= remainingCells; i++) {
      const m = nextMonthIndex + 1;
      const dateStr = `${nextYear}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayOfWeek = new Date(nextYear, nextMonthIndex, i).getDay();
      grid.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
        weekdayName: STANDARD_WEEKDAYS[dayOfWeek]
      });
    }

    return grid;
  };

  const calendarDays = getCalendarGrid(activeYear, activeMonthIndex);

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const m = prev.getMonth();
      const y = prev.getFullYear();
      if (m === 0) return new Date(y - 1, 11, 1);
      return new Date(y, m - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const m = prev.getMonth();
      const y = prev.getFullYear();
      if (m === 11) return new Date(y + 1, 0, 1);
      return new Date(y, m + 1, 1);
    });
  };

  const selectMonth = (idx: number) => {
    setCurrentDate(new Date(activeYear, idx, 1));
    setMonthDropdownOpen(false);
  };

  // Helper to get events for a specific day (used for rendering dots on the grid)
  const getEventsForDay = (dateStr: string) => {
    return events.filter(evt => evt.date === dateStr);
  };

  // Filter & Search Logic
  const filteredEventsForSelectedDay = events
    .filter(evt => {
      // Must be on the selected date
      if (evt.date !== selectedDateStr) return false;
      
      // Must match search query if any
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesDesc = evt.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Must match category filter if not 'all'
      if (filterCategory !== 'all' && evt.category !== filterCategory) return false;

      return true;
    });

  // Dynamic counts for currently selected day
  const selectedDayTotalEvents = events.filter(evt => evt.date === selectedDateStr && evt.category !== 'task').length;
  const selectedDayTotalTasks = events.filter(evt => evt.date === selectedDateStr && evt.category === 'task').length;

  // Form Submission
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('⚠️ Please enter a title');
      return;
    }

    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim() || 'No description provided.',
      date: formDate,
      category: formCategory,
      tag: formTag,
      isAllDay: formIsAllDay,
      startTime: formIsAllDay ? 'All Day' : formStartTime,
      endTime: formIsAllDay ? 'All Day' : formEndTime,
      isCompleted: false
    };

    if (supabaseStatus.configured) {
      try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (currentUser && currentUser.id) {
          headers['x-user-id'] = currentUser.id;
        }
        const res = await fetch('/api/events', {
          method: 'POST',
          headers,
          body: JSON.stringify(newEvent)
        });
        const data = await res.json();
        if (data.success) {
          setEvents(prev => [newEvent, ...prev]);
          showToast(`🎉 Created & synchronized ${newEvent.category} on Supabase!`);
        } else {
          showToast(`❌ Supabase Sync Error: ${data.error}`);
        }
      } catch (err) {
        console.error('Error creating event:', err);
        showToast('❌ Backend connection failed');
      }
    } else {
      setEvents(prev => [newEvent, ...prev]);
      showToast(`🎉 Created ${newEvent.category} (Saved to cache)`);
    }
    
    // Clear title & description
    setFormTitle('');
    setFormDescription('');
    
    // Switch view on mobile
    if (window.innerWidth < 768) {
      setMobileActiveTab('calendar');
    }
  };

  // Delete event
  const handleDeleteEvent = async (id: string) => {
    const eventToDelete = events.find(e => e.id === id);
    if (!eventToDelete) return;

    if (supabaseStatus.configured) {
      try {
        const headers: any = {};
        if (currentUser && currentUser.id) {
          headers['x-user-id'] = currentUser.id;
        }
        const res = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
          headers
        });
        const data = await res.json();
        if (data.success) {
          setEvents(prev => prev.filter(evt => evt.id !== id));
          showToast(`🗑️ Removed "${eventToDelete.title}" from Supabase`);
        } else {
          showToast(`❌ Supabase error: ${data.error}`);
        }
      } catch (err) {
        console.error('Error deleting event:', err);
        showToast('❌ Backend connection failed');
      }
    } else {
      setEvents(prev => prev.filter(evt => evt.id !== id));
      showToast(`🗑️ Removed "${eventToDelete.title}" (Local cache)`);
    }
  };

  // Toggle event/task completion
  const handleToggleCompleted = async (id: string) => {
    const targetEvent = events.find(e => e.id === id);
    if (!targetEvent) return;

    const nextCompletedState = !targetEvent.isCompleted;

    if (supabaseStatus.configured) {
      try {
        const headers: any = { 'Content-Type': 'application/json' };
        if (currentUser && currentUser.id) {
          headers['x-user-id'] = currentUser.id;
        }
        const res = await fetch(`/api/events/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ isCompleted: nextCompletedState })
        });
        const data = await res.json();
        if (data.success) {
          setEvents(prev => prev.map(evt => {
            if (evt.id === id) {
              return { ...evt, isCompleted: nextCompletedState };
            }
            return evt;
          }));
          showToast(nextCompletedState ? '✅ Marked as completed (Supabase)!' : '🔄 Marked as pending (Supabase)');
        } else {
          showToast(`❌ Supabase error: ${data.error}`);
        }
      } catch (err) {
        console.error('Error toggling completion:', err);
        showToast('❌ Backend connection failed');
      }
    } else {
      setEvents(prev => prev.map(evt => {
        if (evt.id === id) {
          return { ...evt, isCompleted: nextCompletedState };
        }
        return evt;
      }));
      showToast(nextCompletedState ? '✅ Marked as completed!' : '🔄 Marked as pending');
    }
  };

  // Auth form submissions handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill in all email and password fields.');
      return;
    }
    
    setAuthLoading(true);
    setAuthError(null);

    const endpoint = authIsSignUp ? '/api/auth/signup' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      
      let data: any = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `HTTP error! status: ${res.status}`);
      }

      if (res.ok && data.success) {
        if (authIsSignUp) {
          showToast('🎉 Registration successful! Verification required.');
          setRegisteredEmail(authEmail);
          setResendSuccess(false);
          setAuthPassword('');
        } else {
          const userSession = {
            id: data.user.id,
            email: data.user.email,
          };
          localStorage.setItem('calendar_user', JSON.stringify(userSession));
          setCurrentUser(userSession);
          showToast(`👋 Welcome back! Authenticated as ${data.user.email}`);
        }
      } else {
        setAuthError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      console.error('Authentication request error:', err);
      setAuthError(`Authentication Error: ${err.message || 'Server unreachable. Try running locally or checking credentials.'}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Resend verification email handler
  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setResendSuccess(false);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResendSuccess(true);
        showToast('✉️ Verification email resent successfully!');
      } else {
        setAuthError(data.error || 'Failed to resend verification email.');
      }
    } catch (err: any) {
      console.error('Resend error:', err);
      setAuthError(`Resend Error: ${err.message || 'Server is unreachable.'}`);
    } finally {
      setResendLoading(false);
    }
  };

  // Guest login bypass handler
  const handleContinueAsGuest = () => {
    const guestUser = { isGuest: true, email: 'guest@local.cache' };
    localStorage.setItem('calendar_user', JSON.stringify(guestUser));
    setCurrentUser(guestUser);
    showToast('✨ Signed in in offline guest mode!');
  };

  // Reset to default events
  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all events to defaults? This will erase custom additions.')) {
      setEvents(INITIAL_EVENTS);
      setCurrentDate(new Date(2026, 6, 7));
      setSelectedDateStr('2026-07-07');
      showToast('🔄 Calendar reset to defaults!');
    }
  };

  // Helper to format date nicely
  const getFormattedSelectedDayName = () => {
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
    return { dayName, monthName, dayNum: day, year };
  };

  const selectedDayInfo = getFormattedSelectedDayName();

  // Color mappings for category rendering
  const getCategoryColorClasses = (category: string, isCompleted: boolean) => {
    if (isCompleted) {
      return {
        badge: 'bg-slate-100 text-slate-400 line-through border border-slate-200',
        bullet: 'bg-slate-400',
        border: 'border-slate-300',
        text: 'text-slate-400 line-through',
        card: 'bg-slate-50 opacity-70 border-l-4 border-l-slate-400'
      };
    }

    switch (category) {
      case 'birthday':
        return {
          badge: 'bg-rose-50 text-rose-700 border border-rose-100',
          bullet: 'bg-rose-500',
          border: 'border-rose-400',
          text: 'text-slate-800',
          card: 'bg-rose-50/50 border-l-4 border-l-rose-500'
        };
      case 'holiday':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
          bullet: 'bg-emerald-500',
          border: 'border-emerald-400',
          text: 'text-slate-800',
          card: 'bg-emerald-50/50 border-l-4 border-l-emerald-500'
        };
      case 'meeting':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
          bullet: 'bg-[#6366f1]',
          border: 'border-[#6366f1]',
          text: 'text-slate-800',
          card: 'bg-indigo-50/40 border-l-4 border-l-indigo-500'
        };
      case 'task':
      default:
        const t = THEMES[selectedTheme];
        return {
          badge: `${t.light} ${t.lightText} border ${t.border.replace('border-', 'border-opacity-30 border-')}`,
          bullet: t.primary,
          border: t.border,
          text: 'text-slate-800',
          card: `bg-slate-50/70 border-l-4 ${t.primary.replace('bg-', 'border-l-')}`
        };
    }
  };

  const currentThemeStyles = THEMES[selectedTheme];

  return (
    <div id="app-root" className="bg-[#f0f3f8] min-h-screen py-6 px-4 font-sans text-slate-800 flex flex-col justify-between selection:bg-orange-200">
      
      {/* Top Main Navigation Header */}
      <header id="main-header" className="max-w-6xl mx-auto w-full bg-white rounded-3xl p-5 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-100">
        <div id="header-brand" className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${currentThemeStyles.primary} text-white shadow-md transition-all duration-300`}>
            <CalendarIcon className="w-6 h-6" id="header-icon-cal" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              Event Calendar <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500">Premium Interactive Organizing System</p>
          </div>
        </div>

        {/* Theme & Controls Area */}
        <div id="header-controls" className="flex flex-wrap items-center justify-center gap-5">
          {/* Theme Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Theme:</span>
            {(Object.keys(THEMES) as ThemeType[]).map((themeName) => (
              <button
                key={themeName}
                id={`theme-btn-${themeName}`}
                onClick={() => {
                  setSelectedTheme(themeName);
                  showToast(`🎨 Theme switched to ${themeName.toUpperCase()}`);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 transform hover:scale-115 ${
                  themeName === 'coral' ? 'bg-[#f97316]' :
                  themeName === 'teal' ? 'bg-[#0d9488]' :
                  themeName === 'indigo' ? 'bg-[#6366f1]' : 'bg-[#f43f5e]'
                } ${selectedTheme === themeName ? 'border-slate-800 ring-2 ring-slate-200 scale-110' : 'border-transparent'}`}
                title={themeName.toUpperCase()}
              />
            ))}
          </div>

          {/* User Profile / Logout */}
          {currentUser && (
            <div id="header-user-badge" className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs">
              <button
                id="btn-header-profile-avatar"
                onClick={() => setProfileModalOpen(true)}
                className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] uppercase hover:bg-slate-300 transition-colors cursor-pointer"
                title="View Profile"
              >
                {currentUser.email ? currentUser.email.charAt(0) : 'G'}
              </button>
              <button
                id="btn-header-profile-email"
                onClick={() => setProfileModalOpen(true)}
                className="font-semibold text-slate-600 max-w-[120px] truncate hover:text-slate-800 transition-colors cursor-pointer"
                title="View Profile"
              >
                {currentUser.email || 'Guest'}
              </button>
              <button 
                id="btn-header-logout" 
                onClick={handleLogout}
                className="ml-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reset Action */}
          <button
            id="btn-reset"
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Calendar
          </button>
        </div>
      </header>

      {/* Main Dual Phone Workspace */}
      <main id="main-content" className="max-w-6xl mx-auto w-full flex-grow flex items-center justify-center mb-8">
        
        {!currentUser ? (
          /* ================= SINGLE DEVICE FRAME (SECURE SIGN IN PORTAL) ================= */
          <div 
            id="auth-device-frame" 
            className="w-full max-w-[380px] h-[800px] bg-slate-50 rounded-[44px] shadow-2xl border-[10px] border-slate-900 relative overflow-hidden flex flex-col mx-auto transition-all duration-500 animate-fade-in"
          >
            {/* Phone Top Speaker & Sensor Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
              <span className="w-12 h-1.5 bg-slate-800 rounded-full"></span>
            </div>

            {/* Inner App Canvas */}
            <div className="flex-grow flex flex-col pt-8 bg-white overflow-hidden text-slate-800 justify-between">
              
              {/* Phone Status Bar Mock */}
              <div className="px-6 pt-1 pb-2 flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>5G</span>
                </div>
              </div>

              {registeredEmail ? (
                /* ================= CONFIRM EMAIL PENDING SCREEN ================= */
                <div className="px-6 py-4 flex-grow flex flex-col justify-between h-full animate-fade-in">
                  
                  {/* Upper Graphic & Messaging */}
                  <div className="text-center my-auto space-y-5">
                    
                    {/* Pulsing Mail Icon */}
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-75"></div>
                      <div className={`relative w-16 h-16 rounded-3xl ${currentThemeStyles.primary} text-white flex items-center justify-center shadow-lg shadow-orange-500/20`}>
                        <Mail className="w-8 h-8 animate-bounce" />
                      </div>
                    </div>

                    <div className="space-y-2 animate-fade-in">
                      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                        Verify Your Email
                      </h2>
                      <p className="text-[12px] text-slate-500 leading-relaxed">
                        We have sent a secure activation link to:
                      </p>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 break-all select-all">
                        {registeredEmail}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pt-1">
                        Please click the verification link in the email to complete registration and enable cloud synchronization.
                      </p>
                    </div>

                    {/* Resend Actions Block */}
                    <div className="pt-2">
                      {resendSuccess ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-100 animate-fade-in">
                          ✉️ A fresh activation link has been resent!
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={resendLoading}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 underline decoration-2 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          {resendLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            'Resend confirmation email'
                          )}
                        </button>
                      )}

                      {authError && (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-100">
                          {authError}
                        </div>
                      )}
                    </div>

                    {/* Quick Access Webmail Links */}
                    <div className="pt-4 text-left bg-slate-50 rounded-2xl p-3 border border-slate-100">
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-2 text-center">
                        Quick Mail Access
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <a 
                          href="https://mail.google.com" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 transition-colors"
                        >
                          Gmail <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                        <a 
                          href="https://outlook.live.com" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 transition-colors"
                        >
                          Outlook <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Back to Login Portal button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setRegisteredEmail(null);
                        setAuthIsSignUp(false);
                        setAuthError(null);
                      }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Back to Sign In
                    </button>
                  </div>

                </div>
              ) : (
                /* ================= LOGIN/SIGNUP FORM CORE ================= */
                <div className="px-6 py-4 flex-grow flex flex-col justify-center animate-fade-in">
                  
                  {/* Brand / Title */}
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${currentThemeStyles.primary} text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                      {authIsSignUp ? 'Create Secure Account' : 'Welcome to Event Calendar'}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                      {authIsSignUp 
                        ? 'Register your email to sync and back up your custom plans.' 
                        : 'Sign in to access your cloud-synchronized event planner.'
                      }
                    </p>
                  </div>

                  {/* Status indicator block */}
                  <div className="mb-4">
                    <div className={`p-3 rounded-2xl border text-[11px] leading-relaxed flex items-start gap-2.5 ${
                      supabaseStatus.configured 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                        : 'bg-amber-50 text-amber-800 border-amber-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${supabaseStatus.configured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div className="flex-grow">
                        <p className="font-bold uppercase tracking-wider text-[9px]">
                          {supabaseStatus.configured ? 'Cloud Sync Enabled' : 'Offline Mode Only'}
                        </p>
                        <p className="text-slate-500 mt-0.5 leading-normal text-[10px]">
                          {supabaseStatus.configured 
                            ? 'Real database connection configured on server.' 
                            : 'Secrets not set yet. Auth will use local cache bypass.'
                          }
                        </p>
                        {!supabaseStatus.configured && (
                          <button
                            type="button"
                            onClick={() => setShowSetupGuide(!showSetupGuide)}
                            className="mt-1.5 text-[10px] font-bold text-amber-900 hover:text-amber-950 underline block cursor-pointer"
                          >
                            {showSetupGuide ? '✕ Hide Setup Instructions' : '🔑 Setup Supabase Database Guide'}
                          </button>
                        )}
                      </div>
                    </div>

                    {showSetupGuide && (
                      <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] leading-relaxed space-y-2.5 animate-fade-in max-h-[300px] overflow-y-auto">
                        <p className="font-extrabold text-slate-700 uppercase tracking-wide text-[9px]">
                          How to Connect Supabase:
                        </p>
                        <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                          <li>
                            Sign up or log in at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-orange-600 font-bold underline">supabase.com</a> and create a new project.
                          </li>
                          <li>
                            Go to <strong>Project Settings</strong> → <strong>API</strong> in the left sidebar.
                          </li>
                          <li>
                            Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong>.
                          </li>
                          <li>
                            In AI Studio, open the <strong>Secrets panel</strong> on the bottom left and add:
                            <div className="mt-1 bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-[9px] text-slate-500 select-all leading-normal space-y-1">
                              <div>• <strong className="text-slate-700">SUPABASE_URL</strong>: your project URL</div>
                              <div>• <strong className="text-slate-700">SUPABASE_ANON_KEY</strong>: your anon public API key</div>
                            </div>
                          </li>
                          <li>
                            Go to the <strong>SQL Editor</strong> in Supabase, create a new query, paste the content of the <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-mono text-[9px]">supabase_schema.sql</code> file, and click <strong>Run</strong>.
                          </li>
                          <li>
                            Restart the dev server to reload your credentials!
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authError && (
                      <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-[11px] font-semibold flex items-start gap-2 border border-rose-100">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {/* Email field */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all text-slate-800 font-mono font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer transition-all ${
                        currentThemeStyles.primary
                      } ${currentThemeStyles.hover} flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50`}
                    >
                      {authLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : authIsSignUp ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Sign Up Now
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Secure Login
                        </>
                      )}
                    </button>
                  </form>

                  {/* Toggle sign in / sign up */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthIsSignUp(!authIsSignUp);
                        setAuthError(null);
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      {authIsSignUp 
                        ? 'Already have an account? Sign In' 
                        : "Don't have an account? Register"
                      }
                    </button>
                  </div>

                  {/* Guest / Bypass Button */}
                  <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer text-center"
                  >
                    Continue as Guest ⚡
                  </button>

                </div>
              )}

              {/* App Internal Footer Info */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
                🔐 Secured proxy authentication portal.
              </div>

            </div>
          </div>
        ) : (
          /* Desktop grid layout rendering both mockup views side-by-side inside mobile frames */
          <div id="devices-grid" className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start justify-center">
          
          {/* ================= LEFT DEVICE FRAME (CALENDAR + DAY VIEW) ================= */}
          <div 
            id="device-left-frame" 
            className={`w-full max-w-[380px] h-[800px] bg-slate-50 rounded-[44px] shadow-2xl border-[10px] border-slate-900 relative overflow-hidden flex flex-col mx-auto transition-all duration-500 ${
              mobileActiveTab === 'calendar' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Phone Top Speaker & Sensor Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
              <span className="w-12 h-1.5 bg-slate-800 rounded-full"></span>
            </div>

            {/* Inner App Canvas */}
            <div className="flex-grow flex flex-col pt-8 bg-white overflow-hidden text-slate-800">
              
              {/* Phone Status Bar Mock */}
              <div className="px-6 pt-1 pb-2 flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">UTC</span>
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* App Internal Header */}
              <div className="px-5 py-3 flex items-center justify-between relative">
                {/* Month Dropdown Selector Button */}
                <div className="relative">
                  <button
                    id="btn-month-dropdown"
                    onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer"
                  >
                    {MONTHS[activeMonthIndex]} {activeYear}
                    <span className="text-[10px] text-slate-500">▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {monthDropdownOpen && (
                    <div id="months-dropdown-list" className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-40 max-h-60 overflow-y-auto">
                      {MONTHS.map((mName, idx) => (
                        <button
                          key={mName}
                          id={`dropdown-month-item-${idx}`}
                          onClick={() => selectMonth(idx)}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-all ${
                            idx === activeMonthIndex ? `${currentThemeStyles.text} font-bold ${currentThemeStyles.light}` : 'text-slate-700'
                          }`}
                        >
                          {mName}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 my-1 pt-1 px-4 flex justify-between">
                        <button 
                          id="btn-year-prev"
                          onClick={() => setCurrentDate(new Date(activeYear - 1, activeMonthIndex, 1))}
                          className="text-[10px] text-slate-500 hover:text-slate-900"
                        >
                          ◀ {activeYear - 1}
                        </button>
                        <button 
                          id="btn-year-next"
                          onClick={() => setCurrentDate(new Date(activeYear + 1, activeMonthIndex, 1))}
                          className="text-[10px] text-slate-500 hover:text-slate-900"
                        >
                          {activeYear + 1} ▶
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right utility buttons: Search Toggle, Profile Mock */}
                <div className="flex items-center gap-2">
                  <button
                    id="btn-toggle-search"
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className={`p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer ${
                      searchExpanded ? `${currentThemeStyles.light} ${currentThemeStyles.text}` : 'text-slate-600'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-profile-left-avatar"
                    onClick={() => setProfileModalOpen(true)}
                    className={`w-8 h-8 rounded-full ${currentThemeStyles.primary} text-white font-bold flex items-center justify-center text-xs shadow-inner hover:scale-105 active:scale-95 transition-all cursor-pointer`}
                    title="View Profile"
                  >
                    {currentUser && currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : 'JD'}
                  </button>
                </div>
              </div>

              {/* Collapsible Expanded Search / Filter Drawer */}
              {searchExpanded && (
                <div id="search-filter-box" className="px-5 pb-3 pt-1 border-b border-slate-100 bg-slate-50 animate-fade-in">
                  <input
                    type="text"
                    id="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, birthdays..."
                    className="w-full bg-white text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                    {(['all', 'birthday', 'holiday', 'meeting', 'task'] as const).map((cat) => (
                      <button
                        key={cat}
                        id={`filter-cat-${cat}`}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all shrink-0 cursor-pointer ${
                          filterCategory === cat
                            ? `${currentThemeStyles.primary} text-white`
                            : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Calendar View (Card Block) */}
              <div className="px-4 py-2">
                <div id="calendar-card" className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
                  
                  {/* Month navigation header arrows inside card */}
                  <div className="flex justify-between items-center mb-3">
                    <button 
                      id="btn-calendar-prev"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {MONTHS[activeMonthIndex]} Grid
                    </span>
                    <button 
                      id="btn-calendar-next"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weekday Labels Grid */}
                  <div className="grid grid-cols-7 text-center gap-1 mb-2">
                    {WEEKDAYS.map((day, idx) => (
                      <span key={idx} className="text-xs font-semibold text-slate-400 w-8 h-8 flex items-center justify-center">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Days Numeric Grid */}
                  <div className="grid grid-cols-7 text-center gap-1">
                    {calendarDays.map((cell, idx) => {
                      const isSelected = cell.dateStr === selectedDateStr;
                      const dayEvents = getEventsForDay(cell.dateStr);
                      const isCurrentLocalToday = cell.dateStr === '2026-07-07';

                      // Event indicators/dots colors mapping
                      const hasBirthday = dayEvents.some(e => e.category === 'birthday');
                      const hasHoliday = dayEvents.some(e => e.category === 'holiday');
                      const hasMeeting = dayEvents.some(e => e.category === 'meeting');
                      const hasTask = dayEvents.some(e => e.category === 'task');

                      return (
                        <button
                          key={idx}
                          id={`calendar-cell-${cell.dateStr}`}
                          onClick={() => setSelectedDateStr(cell.dateStr)}
                          className={`relative w-8 h-8 text-xs font-semibold rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? `${currentThemeStyles.primary} text-white font-bold scale-110 shadow-sm z-10`
                              : cell.isCurrentMonth
                              ? 'text-slate-800 hover:bg-slate-100'
                              : 'text-slate-300 hover:bg-slate-50'
                          } ${isCurrentLocalToday && !isSelected ? 'ring-1 ring-slate-400 font-bold' : ''}`}
                        >
                          <span>{cell.dayNum}</span>
                          
                          {/* Dot Indicators */}
                          {!isSelected && (
                            <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
                              {hasBirthday && <span className="w-1 h-1 rounded-full bg-rose-400"></span>}
                              {hasHoliday && <span className="w-1 h-1 rounded-full bg-emerald-400"></span>}
                              {hasMeeting && <span className="w-1 h-1 rounded-full bg-[#6366f1]"></span>}
                              {hasTask && <span className={`w-1 h-1 rounded-full ${currentThemeStyles.primary}`}></span>}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Day Details Pane */}
              <div className="flex-grow flex flex-col bg-slate-50/50 mt-2 rounded-t-[32px] border-t border-slate-100 px-5 pt-4 overflow-hidden">
                
                {/* Header: Date summary and view all */}
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-center bg-white border border-slate-100 p-2 rounded-2xl w-12 shadow-sm">
                      <span className="block text-xl font-extrabold leading-none text-slate-800">
                        {selectedDayInfo.dayNum}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1 block">
                        {selectedDayInfo.dayName}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                        {selectedDateStr === '2026-07-07' ? 'Today' : `${selectedDayInfo.monthName} ${selectedDayInfo.dayNum}`}
                        {selectedDateStr === '2026-07-07' && (
                          <span className={`w-2 h-2 rounded-full ${currentThemeStyles.primary} animate-ping`}></span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {selectedDayTotalEvents} events and {selectedDayTotalTasks} tasks
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold ${currentThemeStyles.text} cursor-default`}>
                    View All
                  </span>
                </div>

                {/* Events list content */}
                <div id="events-scroll-container" className="flex-grow overflow-y-auto space-y-3 pb-20 pr-1 select-none">
                  {filteredEventsForSelectedDay.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-5 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                      <CalendarIcon className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-400">No events or tasks scheduled</p>
                      <p className="text-[10px] text-slate-400 mt-1">Tap standard keys or "+" to create one.</p>
                    </div>
                  ) : (
                    filteredEventsForSelectedDay.map((evt) => {
                      const colors = getCategoryColorClasses(evt.category, evt.isCompleted);
                      return (
                        <div
                          key={evt.id}
                          id={`event-card-${evt.id}`}
                          className={`group relative p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-all duration-300 ${colors.card}`}
                        >
                          {/* Left Event Description Section */}
                          <div className="flex-grow flex gap-2.5 items-start">
                            {/* Checkbox for Tasks / Events */}
                            <button
                              id={`check-btn-${evt.id}`}
                              onClick={() => handleToggleCompleted(evt.id)}
                              className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                evt.isCompleted
                                  ? 'bg-slate-400 border-slate-400 text-white'
                                  : `border-slate-300 hover:${colors.border} bg-white`
                              }`}
                            >
                              {evt.isCompleted && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className={`text-xs font-bold leading-tight ${colors.text}`}>
                                  {evt.title}
                                </h4>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold tracking-wider uppercase ${colors.badge}`}>
                                  {evt.category}
                                </span>
                              </div>
                              
                              {/* Time Display */}
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{evt.startTime} - {evt.endTime}</span>
                              </div>

                              {/* Description Text */}
                              <p className={`text-[10px] mt-1 line-clamp-2 ${evt.isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                                {evt.description}
                              </p>
                            </div>
                          </div>

                          {/* Swipe/Button action mockup directly visible */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {evt.tag && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                evt.tag === 'Urgent' ? 'bg-rose-50 text-rose-600' :
                                evt.tag === 'Running' ? 'bg-teal-50 text-teal-600' :
                                'bg-indigo-50 text-indigo-600'
                              }`}>
                                {evt.tag}
                              </span>
                            )}
                            <button
                              id={`delete-btn-${evt.id}`}
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Floating Action Button (FAB) at bottom right of app */}
                <button
                  id="fab-add-event"
                  onClick={() => {
                    setMobileActiveTab('create');
                    showToast('📝 Fill details to create event');
                  }}
                  className={`absolute bottom-6 right-6 p-4 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer ${currentThemeStyles.primary}`}
                  title="Add Task / Event"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>

          {/* ================= RIGHT DEVICE FRAME (CREATE TASK/EVENT FORM) ================= */}
          <div 
            id="device-right-frame" 
            className={`w-full max-w-[380px] h-[800px] bg-slate-50 rounded-[44px] shadow-2xl border-[10px] border-slate-900 relative overflow-hidden flex flex-col mx-auto transition-all duration-500 ${
              mobileActiveTab === 'create' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Phone Top Speaker & Sensor Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
              <span className="w-12 h-1.5 bg-slate-800 rounded-full"></span>
            </div>

            {/* Inner App Canvas */}
            <div className="flex-grow flex flex-col pt-8 bg-white overflow-hidden text-slate-800">
              
              {/* Phone Status Bar Mock */}
              <div className="px-6 pt-1 pb-2 flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">UTC</span>
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Header with Exit controls */}
              <div className="px-5 py-3 flex items-center justify-between">
                {/* Back / Close button */}
                <button
                  id="btn-close-create"
                  onClick={() => setMobileActiveTab('calendar')}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
                  title="Back to Calendar"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800">New Entry</span>
                {/* Visual placeholder search/avatar consistent with mockup */}
                <div className="flex items-center gap-2">
                  <span className="p-2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <button
                    id="btn-profile-right-avatar"
                    onClick={() => setProfileModalOpen(true)}
                    className={`w-8 h-8 rounded-full ${currentThemeStyles.primary} text-white font-bold flex items-center justify-center text-xs shadow-inner hover:scale-105 active:scale-95 transition-all cursor-pointer`}
                    title="View Profile"
                  >
                    {currentUser && currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : 'JD'}
                  </button>
                </div>
              </div>

              {/* Main Interactive Entry Form */}
              <form onSubmit={handleCreateEvent} id="create-event-form" className="flex-grow flex flex-col px-6 pt-2 pb-6 overflow-y-auto">
                
                {/* Type Tab Selector (Task vs Event) */}
                <div id="type-tab-selector" className="grid grid-cols-2 p-1 bg-slate-100 rounded-full mb-5">
                  <button
                    type="button"
                    id="tab-task"
                    onClick={() => {
                      setFormType('task');
                      setFormCategory('task');
                    }}
                    className={`py-2 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                      formType === 'task'
                        ? `${currentThemeStyles.primary} text-white shadow`
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Task
                  </button>
                  <button
                    type="button"
                    id="tab-event"
                    onClick={() => {
                      setFormType('event');
                      setFormCategory('meeting'); // default event category
                    }}
                    className={`py-2 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                      formType === 'event'
                        ? `${currentThemeStyles.primary} text-white shadow`
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Event
                  </button>
                </div>

                {/* Task Name Input */}
                <div className="mb-4">
                  <label htmlFor="input-form-title" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {formType === 'task' ? 'Task name' : 'Event name'}
                  </label>
                  <input
                    type="text"
                    id="input-form-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={formType === 'task' ? "e.g. Design App challenge" : "e.g. Project Review"}
                    className="w-full bg-slate-100 border border-transparent rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                  />
                </div>

                {/* Interactive Categorization based on user requirement */}
                <div className="mb-4">
                  <label htmlFor="select-form-category" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Category Type
                  </label>
                  <select
                    id="select-form-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-100 border border-transparent rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300 transition-all cursor-pointer"
                  >
                    {formType === 'task' ? (
                      <option value="task">General Task</option>
                    ) : (
                      <>
                        <option value="meeting">💼 Meeting</option>
                        <option value="birthday">🎂 Birthday</option>
                        <option value="holiday">🌴 Public Holiday</option>
                        <option value="task">Standard Event</option>
                      </>
                    )}
                  </select>
                </div>

                {/* All Day Toggle Block */}
                <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="block text-xs font-bold text-slate-700">All day</span>
                      <span className="text-[10px] text-slate-400">Scheduled for entire day</span>
                    </div>
                  </div>
                  <label htmlFor="toggle-all-day" className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-all-day"
                      checked={formIsAllDay}
                      onChange={(e) => setFormIsAllDay(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f97316]"></div>
                  </label>
                </div>

                {/* Date Selection Box */}
                <div className="mb-4">
                  <label htmlFor="input-form-date" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    id="input-form-date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-100 border border-transparent rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300 transition-all cursor-pointer"
                  />
                </div>

                {/* Time Selection Inputs (Disable if All Day) */}
                {!formIsAllDay && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="input-start-time" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Start time
                      </label>
                      <input
                        type="text"
                        id="input-start-time"
                        value={formStartTime}
                        onChange={(e) => setFormStartTime(e.target.value)}
                        placeholder="10:00 AM"
                        className="w-full bg-slate-100 border border-transparent rounded-2xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-end-time" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        End time
                      </label>
                      <input
                        type="text"
                        id="input-end-time"
                        value={formEndTime}
                        onChange={(e) => setFormEndTime(e.target.value)}
                        placeholder="02:00 PM"
                        className="w-full bg-slate-100 border border-transparent rounded-2xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Description Text Box */}
                <div className="mb-4">
                  <label htmlFor="textarea-description" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="textarea-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide meeting link, requirements, notes..."
                    rows={2}
                    className="w-full bg-slate-100 border border-transparent rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300 transition-all resize-none"
                  />
                </div>

                {/* Interactive Status Tags Row */}
                <div className="mb-6">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Priority Status
                  </span>
                  <div className="flex gap-2 flex-wrap" id="priority-tags-group">
                    {(['Urgent', 'Running', 'Ongoing'] as const).map((tagValue) => {
                      const isActive = formTag === tagValue;
                      return (
                        <button
                          key={tagValue}
                          type="button"
                          id={`form-tag-btn-${tagValue}`}
                          onClick={() => setFormTag(tagValue)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? tagValue === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-300 scale-105' :
                                tagValue === 'Running' ? 'bg-teal-100 text-teal-700 border border-teal-300 scale-105' :
                                'bg-indigo-100 text-indigo-700 border border-indigo-300 scale-105'
                              : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {tagValue}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button at bottom */}
                <div className="mt-auto">
                  <button
                    type="submit"
                    id="btn-submit-form"
                    className={`w-full text-white font-extrabold uppercase py-3 rounded-full text-xs tracking-wider shadow-lg transform active:scale-98 transition-all hover:scale-[1.01] cursor-pointer ${currentThemeStyles.primary} ${currentThemeStyles.hover}`}
                  >
                    Create New {formType === 'task' ? 'Task' : 'Event'}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
        )}
      </main>

      {/* Navigation Help Panel or Toast Notification Banner */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 animate-bounce border border-slate-700"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Responsive bottom mobile navigation buttons */}
      <nav id="mobile-nav-bar" className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex justify-around items-center shadow-lg z-30">
        <button
          id="mobile-nav-calendar"
          onClick={() => setMobileActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
            mobileActiveTab === 'calendar' ? currentThemeStyles.text : 'text-slate-400'
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          Calendar
        </button>
        <button
          id="mobile-nav-create"
          onClick={() => setMobileActiveTab('create')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
            mobileActiveTab === 'create' ? currentThemeStyles.text : 'text-slate-400'
          }`}
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </nav>

      {/* Aesthetic App Footer Footer */}
      <footer id="main-footer" className="text-center text-[10px] text-slate-400 mt-6 max-w-xl mx-auto border-t border-slate-200/50 pt-4">
        <p>Interactive calendar featuring Birthdays, Public Holidays, and Meeting planners.</p>
        <p className="mt-1">Crafted with Tailwind CSS & Lucide Icons. Synchronized to Browser Cache.</p>
      </footer>

      {/* Profile Popup / Modal */}
      {profileModalOpen && (
        <div 
          id="profile-popup-overlay" 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
          onClick={() => setProfileModalOpen(false)}
        >
          <div 
            id="profile-popup-card" 
            className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden relative transition-all duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Accent Top */}
            <div className={`h-28 ${currentThemeStyles.primary} relative flex items-end justify-center`}>
              <button 
                id="profile-popup-close"
                onClick={() => setProfileModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/15 text-white hover:bg-black/25 transition-all cursor-pointer"
                title="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar & Info */}
            <div className="px-6 pb-6 pt-12 relative flex flex-col items-center">
              
              {/* Overlapping Avatar Container */}
              <div className={`absolute -top-12 w-24 h-24 rounded-full border-4 border-white ${currentThemeStyles.primary} text-white font-black text-3xl flex items-center justify-center shadow-lg`}>
                {currentUser && currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : 'JD'}
              </div>

              <div className="text-center space-y-1.5 w-full">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
                  User Profile <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>
                
                {/* User Email block */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 break-all select-all flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{currentUser?.email || 'guest@local.cache'}</span>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    currentUser?.isGuest 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentUser?.isGuest ? 'Guest Mode' : 'Verified Member'}
                  </span>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    supabaseStatus.configured 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {supabaseStatus.configured ? 'Cloud Synced' : 'Local Storage Only'}
                  </span>
                </div>
              </div>

              {/* Stats and metadata */}
              <div className="w-full mt-6 grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Events</span>
                  <span className="text-xl font-black text-slate-800 mt-0.5 block">{events.length}</span>
                </div>
                <div className="text-center border-l border-slate-200">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Theme Selected</span>
                  <span className={`text-xs font-bold ${currentThemeStyles.text} mt-1.5 block uppercase tracking-wide`}>
                    {selectedTheme}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="w-full mt-6 space-y-2">
                <button
                  type="button"
                  id="profile-popup-logout"
                  onClick={() => {
                    handleLogout();
                    setProfileModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out of Session
                </button>
                <button
                  type="button"
                  id="profile-popup-dismiss"
                  onClick={() => setProfileModalOpen(false)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Dismiss Profile
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
