import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for lazy loading Supabase client
let supabaseClientInstance: any = null;

function getSupabaseClient() {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
    return supabaseClientInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

// API Routes

// 1. Get Supabase Status
app.get('/api/supabase-status', (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  const isConfigured = !!(url && key);
  
  res.json({
    configured: isConfigured,
    url: url ? `${url.substring(0, 15)}...` : null,
    message: isConfigured 
      ? 'Supabase configuration detected!' 
      : 'Supabase credentials missing. App falling back to local storage.'
  });
});

// Auth Routes

// 1.1 Signup
app.post('/api/auth/signup', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(200).json({
      success: false,
      error: 'Supabase not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your secrets.'
    });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      success: true,
      user: data.user,
      session: data.session,
      message: 'Signup successful! Check email if confirmation is required.'
    });
  } catch (err: any) {
    console.error('Error signing up with Supabase:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// 1.15 Resend Verification Email
app.post('/api/auth/resend', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(200).json({
      success: false,
      error: 'Supabase not configured.'
    });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;

    res.json({
      success: true,
      message: 'Verification email resent successfully.'
    });
  } catch (err: any) {
    console.error('Error resending confirmation with Supabase:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// 1.2 Login
app.post('/api/auth/login', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(200).json({
      success: false,
      error: 'Supabase not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to your secrets.'
    });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    console.error('Error logging in with Supabase:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Fetch all events / tasks
app.get('/api/events', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(200).json({ 
      success: false, 
      error: 'Supabase is not configured yet. Fallback to local storage.',
      events: [] 
    });
  }

  const userId = req.headers['x-user-id'];

  try {
    let query = supabase.from('calendar_events').select('*');
    
    if (userId && userId !== 'undefined') {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Map database snake_case fields back to camelCase objects
    const mappedEvents = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      date: row.date,
      category: row.category,
      tag: row.tag || 'Ongoing',
      isAllDay: row.is_all_day ?? false,
      startTime: row.start_time || '10:00 AM',
      endTime: row.end_time || '02:00 PM',
      isCompleted: row.is_completed ?? false,
    }));

    res.json({ success: true, events: mappedEvents });
  } catch (err: any) {
    console.error('Error fetching from Supabase:', err);
    res.status(500).json({ success: false, error: err.message, events: [] });
  }
});

// 3. Create a new event / task
app.post('/api/events', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(400).json({ success: false, error: 'Supabase not configured' });
  }

  const userId = req.headers['x-user-id'];
  const { id, title, description, date, category, tag, isAllDay, startTime, endTime, isCompleted } = req.body;

  try {
    const insertObj: any = {
      id,
      title,
      description,
      date,
      category,
      tag,
      is_all_day: isAllDay,
      start_time: startTime,
      end_time: endTime,
      is_completed: isCompleted,
    };

    if (userId && userId !== 'undefined') {
      insertObj.user_id = userId;
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([insertObj])
      .select();

    if (error) {
      throw error;
    }

    res.json({ success: true, event: data[0] });
  } catch (err: any) {
    console.error('Error creating event in Supabase:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update an existing event / task status or details
app.put('/api/events/:id', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(400).json({ success: false, error: 'Supabase not configured' });
  }

  const { id } = req.params;
  const userId = req.headers['x-user-id'];
  const updates = req.body;

  // Map camelCase parameters to snake_case for PostgreSQL database
  const mappedUpdates: any = {};
  if (updates.title !== undefined) mappedUpdates.title = updates.title;
  if (updates.description !== undefined) mappedUpdates.description = updates.description;
  if (updates.date !== undefined) mappedUpdates.date = updates.date;
  if (updates.category !== undefined) mappedUpdates.category = updates.category;
  if (updates.tag !== undefined) mappedUpdates.tag = updates.tag;
  if (updates.isAllDay !== undefined) mappedUpdates.is_all_day = updates.isAllDay;
  if (updates.startTime !== undefined) mappedUpdates.start_time = updates.startTime;
  if (updates.endTime !== undefined) mappedUpdates.end_time = updates.endTime;
  if (updates.isCompleted !== undefined) mappedUpdates.is_completed = updates.isCompleted;

  try {
    let query = supabase
      .from('calendar_events')
      .update(mappedUpdates)
      .eq('id', id);

    if (userId && userId !== 'undefined') {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.select();

    if (error) {
      throw error;
    }

    res.json({ success: true, event: data[0] });
  } catch (err: any) {
    console.error('Error updating event in Supabase:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete an event
app.delete('/api/events/:id', async (req, res) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(400).json({ success: false, error: 'Supabase not configured' });
  }

  const { id } = req.params;
  const userId = req.headers['x-user-id'];

  try {
    let query = supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (userId && userId !== 'undefined') {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;

    if (error) {
      throw error;
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting event from Supabase:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server with Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export app for serverless / Vercel integration
export default app;

// Only start the server if not running in a Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}
