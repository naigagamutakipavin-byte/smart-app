import { createClient } from '@supabase/supabase-js';

// 1. Detect Direct Client-side Credentials
// Supports both Vite environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
// and user-specified credentials input directly via the UI (stored in localStorage)
const directUrl = (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem('local_supabase_url') || '';
const directKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('local_supabase_anon_key') || '';

export const isDirectMode = !!(directUrl && directKey);

// 2. Initialize Direct Client-side Supabase client
export const supabaseClient = isDirectMode
  ? createClient(directUrl, directKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// 3. Mapping Helpers between database (snake_case) and local state (camelCase)
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: 'birthday' | 'holiday' | 'meeting' | 'task';
  tag: 'Urgent' | 'Running' | 'Ongoing';
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
}

export function mapRowToEvent(row: any): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    date: row.date,
    category: row.category,
    tag: row.tag || 'Ongoing',
    isAllDay: row.is_all_day ?? false,
    startTime: row.start_time || 'All Day',
    endTime: row.end_time || 'All Day',
    isCompleted: row.is_completed ?? false,
  };
}

export function mapEventToRow(evt: CalendarEvent, userId?: string | null): any {
  const row: any = {
    id: evt.id,
    title: evt.title,
    description: evt.description,
    date: evt.date,
    category: evt.category,
    tag: evt.tag,
    is_all_day: evt.isAllDay,
    start_time: evt.startTime,
    end_time: evt.endTime,
    is_completed: evt.isCompleted,
  };
  if (userId) {
    row.user_id = userId;
  }
  return row;
}

// 4. Abstracted Hybrid Sync and CRUD Operations
export async function getSyncStatus(): Promise<{ configured: boolean; mode: 'direct' | 'proxy' | 'offline'; url?: string; message: string }> {
  if (isDirectMode) {
    return {
      configured: true,
      mode: 'direct',
      url: directUrl ? `${directUrl.substring(0, 20)}...` : undefined,
      message: 'Client connected directly to Supabase!',
    };
  }

  try {
    const res = await fetch('/api/supabase-status');
    const status = await res.json();
    if (status.configured) {
      return {
        configured: true,
        mode: 'proxy',
        url: status.url,
        message: 'Connected via backend API proxy.',
      };
    }
  } catch (err) {
    console.warn('Backend API proxy status check failed. Falling back to offline.');
  }

  return {
    configured: false,
    mode: 'offline',
    message: 'Offline Mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect.',
  };
}

// 5. Auth Handlers
export async function hybridSignUp(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      return { success: data.success, user: data.user, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export async function hybridLogIn(email: string, password: string): Promise<{ success: boolean; user?: any; session?: any; error?: string }> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      return { success: data.success, user: data.user, session: data.session, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export async function hybridResend(email: string): Promise<{ success: boolean; error?: string }> {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient.auth.resend({ type: 'signup', email });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

// 6. Database CRUD Handlers
export async function hybridFetchEvents(userId?: string | null): Promise<{ success: boolean; events: CalendarEvent[]; error?: string }> {
  if (supabaseClient) {
    try {
      let query = supabaseClient.from('calendar_events').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return {
        success: true,
        events: (data || []).map(mapRowToEvent),
      };
    } catch (err: any) {
      return { success: false, events: [], error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const headers: any = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/events', { headers });
      const data = await res.json();
      return { success: data.success, events: data.events || [], error: data.error };
    } catch (err: any) {
      return { success: false, events: [], error: err.message };
    }
  }
}

export async function hybridCreateEvent(event: CalendarEvent, userId?: string | null): Promise<{ success: boolean; error?: string }> {
  if (supabaseClient) {
    try {
      const row = mapEventToRow(event, userId);
      const { error } = await supabaseClient.from('calendar_events').insert([row]);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/events', {
        method: 'POST',
        headers,
        body: JSON.stringify(event),
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export async function hybridUpdateEvent(id: string, updateObj: Partial<CalendarEvent>, userId?: string | null): Promise<{ success: boolean; error?: string }> {
  if (supabaseClient) {
    try {
      // Map properties
      const mappedUpdate: any = {};
      if (updateObj.title !== undefined) mappedUpdate.title = updateObj.title;
      if (updateObj.description !== undefined) mappedUpdate.description = updateObj.description;
      if (updateObj.date !== undefined) mappedUpdate.date = updateObj.date;
      if (updateObj.category !== undefined) mappedUpdate.category = updateObj.category;
      if (updateObj.tag !== undefined) mappedUpdate.tag = updateObj.tag;
      if (updateObj.isAllDay !== undefined) mappedUpdate.is_all_day = updateObj.isAllDay;
      if (updateObj.startTime !== undefined) mappedUpdate.start_time = updateObj.startTime;
      if (updateObj.endTime !== undefined) mappedUpdate.end_time = updateObj.endTime;
      if (updateObj.isCompleted !== undefined) mappedUpdate.is_completed = updateObj.isCompleted;

      let query = supabaseClient.from('calendar_events').update(mappedUpdate).eq('id', id);
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      const { error } = await query;
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateObj),
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export async function hybridDeleteEvent(id: string, userId?: string | null): Promise<{ success: boolean; error?: string }> {
  if (supabaseClient) {
    try {
      let query = supabaseClient.from('calendar_events').delete().eq('id', id);
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      const { error } = await query;
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    // Fallback to proxy
    try {
      const headers: any = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      return { success: data.success, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
