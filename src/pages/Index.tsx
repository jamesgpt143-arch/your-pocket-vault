import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePasswords } from '@/hooks/usePasswords';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { PasswordCard } from '@/components/PasswordCard';
import { AddPasswordModal } from '@/components/AddPasswordModal';
import { EmptyState } from '@/components/EmptyState';
import { PasswordEntry } from '@/types/password';
import { Shield, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { passwords, isLoading: passwordsLoading, addPassword, updatePassword, deletePassword, searchPasswords } = usePasswords(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPasswords = useMemo(
    () => searchPasswords(searchQuery),
    [passwords, searchQuery]
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleEdit = (entry: PasswordEntry) => {
    setEditEntry(entry);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editEntry) {
      await updatePassword(editEntry.id, data);
    } else {
      await addPassword(data);
    }
    setEditEntry(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePassword(deleteId);
      setDeleteId(null);
    }
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) setEditEntry(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        passwordCount={passwords.length}
        onAddClick={() => setModalOpen(true)}
        userEmail={user.email}
      />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {passwordsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredPasswords.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="space-y-3">
            {filteredPasswords.map((entry, index) => (
              <div
                key={entry.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PasswordCard
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={setDeleteId}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <AddPasswordModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        onSave={handleSave}
        editEntry={editEntry}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-effect border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Password?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This password will be permanently deleted from your vault.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
