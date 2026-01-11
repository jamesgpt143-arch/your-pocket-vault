import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PasswordEntry, PasswordCategory } from '@/types/password';
import { toast } from 'sonner';

interface DbPassword {
  id: string;
  user_id: string;
  site_name: string;
  site_url: string | null;
  username: string;
  password: string;
  notes: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

const mapDbToEntry = (db: DbPassword): PasswordEntry => ({
  id: db.id,
  siteName: db.site_name,
  siteUrl: db.site_url || undefined,
  username: db.username,
  password: db.password,
  notes: db.notes || undefined,
  category: db.category as PasswordCategory,
  createdAt: new Date(db.created_at),
  updatedAt: new Date(db.updated_at),
});

export function usePasswords(userId: string | undefined) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPasswords = async () => {
    if (!userId) {
      setPasswords([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('passwords')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch passwords:', error);
      toast.error('Failed to load passwords');
    } else {
      setPasswords((data as DbPassword[]).map(mapDbToEntry));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPasswords();
  }, [userId]);

  const addPassword = async (entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('passwords')
      .insert({
        user_id: userId,
        site_name: entry.siteName,
        site_url: entry.siteUrl || null,
        username: entry.username,
        password: entry.password,
        notes: entry.notes || null,
        category: entry.category,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add password:', error);
      toast.error('Failed to save password');
      return null;
    }

    const newEntry = mapDbToEntry(data as DbPassword);
    setPasswords((prev) => [newEntry, ...prev]);
    toast.success('Password saved!');
    return newEntry;
  };

  const updatePassword = async (
    id: string,
    updates: Partial<Omit<PasswordEntry, 'id' | 'createdAt'>>
  ) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.siteName !== undefined) dbUpdates.site_name = updates.siteName;
    if (updates.siteUrl !== undefined) dbUpdates.site_url = updates.siteUrl || null;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.password !== undefined) dbUpdates.password = updates.password;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;
    if (updates.category !== undefined) dbUpdates.category = updates.category;

    const { error } = await supabase
      .from('passwords')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password');
      return;
    }

    setPasswords((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      )
    );
    toast.success('Password updated!');
  };

  const deletePassword = async (id: string) => {
    const { error } = await supabase.from('passwords').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete password:', error);
      toast.error('Failed to delete password');
      return;
    }

    setPasswords((prev) => prev.filter((p) => p.id !== id));
    toast.success('Password deleted');
  };

  const searchPasswords = (query: string) => {
    if (!query.trim()) return passwords;
    const lower = query.toLowerCase();
    return passwords.filter(
      (p) =>
        p.siteName.toLowerCase().includes(lower) ||
        p.username.toLowerCase().includes(lower) ||
        p.siteUrl?.toLowerCase().includes(lower)
    );
  };

  return {
    passwords,
    isLoading,
    addPassword,
    updatePassword,
    deletePassword,
    searchPasswords,
    refetch: fetchPasswords,
  };
}
