import { Shield, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface HeaderProps {
  passwordCount: number;
  onAddClick: () => void;
  userEmail?: string;
}

export function Header({ passwordCount, onAddClick, userEmail }: HeaderProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-border">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h1 className="font-bold text-lg leading-tight">SecureVault</h1>
                <p className="text-xs text-muted-foreground">
                  {passwordCount} password{passwordCount !== 1 ? 's' : ''} • Synced
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
              {userEmail}
            </div>
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="icon"
          className="rounded-xl h-10 w-10"
          onClick={onAddClick}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
