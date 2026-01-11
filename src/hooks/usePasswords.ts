import { useState, useEffect } from 'react';
import { PasswordEntry } from '@/types/password';

const STORAGE_KEY = 'vault_passwords';

export function usePasswords() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPasswords(parsed.map((p: PasswordEntry) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        })));
      } catch (e) {
        console.error('Failed to parse passwords:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveToStorage = (entries: PasswordEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

  const addPassword = (entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: PasswordEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...passwords, newEntry];
    setPasswords(updated);
    saveToStorage(updated);
    return newEntry;
  };

  const updatePassword = (id: string, updates: Partial<Omit<PasswordEntry, 'id' | 'createdAt'>>) => {
    const updated = passwords.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    );
    setPasswords(updated);
    saveToStorage(updated);
  };

  const deletePassword = (id: string) => {
    const updated = passwords.filter((p) => p.id !== id);
    setPasswords(updated);
    saveToStorage(updated);
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
  };
}
