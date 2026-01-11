import { Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  passwordCount: number;
  onAddClick: () => void;
}

export function Header({ passwordCount, onAddClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-border">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">SecureVault</h1>
            <p className="text-xs text-muted-foreground">
              {passwordCount} password{passwordCount !== 1 ? 's' : ''} secured
            </p>
          </div>
        </div>
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
