import { Shield } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Shield className="w-10 h-10 text-primary" />
      </div>
      {searchQuery ? (
        <>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            No passwords match "{searchQuery}". Try a different search term.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">Your vault is empty</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Add your first password to get started. Your credentials are stored securely on your device.
          </p>
        </>
      )}
    </div>
  );
}
