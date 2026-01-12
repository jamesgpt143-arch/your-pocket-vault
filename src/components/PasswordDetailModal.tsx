import { useState } from 'react';
import { Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PasswordEntry, categoryIcons, categoryLabels } from '@/types/password';
import { toast } from 'sonner';

interface PasswordDetailModalProps {
  entry: PasswordEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordDetailModal({ entry, open, onOpenChange }: PasswordDetailModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!entry) return null;

  const isNotesOnly = entry.category === 'notes';

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
              {categoryIcons[entry.category]}
            </div>
            <div>
              <DialogTitle className="text-xl">{entry.siteName}</DialogTitle>
              <p className="text-sm text-muted-foreground">{categoryLabels[entry.category]}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Site URL */}
          {entry.siteUrl && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Website</p>
              <a
                href={entry.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline break-all"
              >
                {entry.siteUrl}
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </div>
          )}

          {/* Username/Email - hide for notes only */}
          {!isNotesOnly && entry.username && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Username / Email</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 break-all">{entry.username}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(entry.username, 'Username')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Password - hide for notes only */}
          {!isNotesOnly && entry.password && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Password</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg px-3 py-2 font-mono text-sm break-all">
                  {showPassword ? entry.password : '•'.repeat(Math.min(entry.password.length, 20))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(entry.password, 'Password')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Notes</p>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words">
                {entry.notes}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-2 border-t border-border text-xs text-muted-foreground space-y-1">
            <p>Created: {new Date(entry.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
