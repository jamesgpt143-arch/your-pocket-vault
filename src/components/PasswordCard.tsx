import { useState } from 'react';
import { Eye, EyeOff, Copy, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { PasswordEntry, categoryIcons } from '@/types/password';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PasswordCardProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export function PasswordCard({ entry, onEdit, onDelete }: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const maskedPassword = '•'.repeat(Math.min(entry.password.length, 16));

  return (
    <div className="vault-card animate-fade-in group hover:glow-border transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
            {categoryIcons[entry.category]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{entry.siteName}</h3>
              {entry.siteUrl && (
                <a
                  href={entry.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{entry.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(entry)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-lg px-3 py-2 font-mono text-sm">
          {showPassword ? entry.password : maskedPassword}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => copyToClipboard(entry.password, 'Password')}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs h-7"
          onClick={() => copyToClipboard(entry.username, 'Username')}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy username
        </Button>
      </div>
    </div>
  );
}
