import { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { generatePassword, calculateStrength, PasswordOptions } from '@/utils/passwordGenerator';
import { toast } from 'sonner';

interface PasswordGeneratorProps {
  onSelect?: (password: string) => void;
}

export function PasswordGenerator({ onSelect }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const regenerate = () => {
    setPassword(generatePassword(options));
    setCopied(false);
  };

  useEffect(() => {
    regenerate();
  }, [options]);

  const { strength, score } = calculateStrength(password);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Password copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const strengthColors = {
    weak: 'bg-destructive',
    medium: 'bg-warning',
    strong: 'bg-success',
  };

  const strengthLabels = {
    weak: 'Weak',
    medium: 'Good',
    strong: 'Strong',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <div className="bg-muted rounded-xl p-4 font-mono text-lg break-all min-h-[60px] flex items-center">
            {password}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={regenerate}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
              style={{ width: `${score * 100}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${strength === 'weak' ? 'text-destructive' : strength === 'medium' ? 'text-warning' : 'text-success'}`}>
            {strengthLabels[strength]}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Length</Label>
            <span className="text-sm font-mono text-primary">{options.length}</span>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={([val]) => setOptions({ ...options, length: val })}
            min={8}
            max={32}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'uppercase', label: 'ABC' },
            { key: 'lowercase', label: 'abc' },
            { key: 'numbers', label: '123' },
            { key: 'symbols', label: '#$%' },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2"
            >
              <Label htmlFor={key} className="text-sm font-mono cursor-pointer">
                {label}
              </Label>
              <Switch
                id={key}
                checked={options[key as keyof PasswordOptions] as boolean}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, [key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {onSelect && (
        <Button className="w-full" onClick={() => onSelect(password)}>
          Use This Password
        </Button>
      )}
    </div>
  );
}
