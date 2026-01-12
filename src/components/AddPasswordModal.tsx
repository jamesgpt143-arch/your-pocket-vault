import { useState } from 'react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PasswordGenerator } from '@/components/PasswordGenerator';
import { PasswordEntry, PasswordCategory, categoryLabels, categoryIcons } from '@/types/password';

interface AddPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editEntry?: PasswordEntry | null;
}

export function AddPasswordModal({ open, onOpenChange, onSave, editEntry }: AddPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    siteName: editEntry?.siteName || '',
    siteUrl: editEntry?.siteUrl || '',
    username: editEntry?.username || '',
    password: editEntry?.password || '',
    notes: editEntry?.notes || '',
    category: editEntry?.category || 'other' as PasswordCategory,
  });

  const isNotesOnly = formData.category === 'notes';
  const isEmailOnly = formData.category === 'email';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate based on category
    if (isNotesOnly) {
      if (!formData.siteName || !formData.notes) return;
    } else {
      if (!formData.siteName || !formData.username || !formData.password) return;
    }
    onSave(formData);
    onOpenChange(false);
    setFormData({
      siteName: '',
      siteUrl: '',
      username: '',
      password: '',
      notes: '',
      category: 'other',
    });
  };

  const handleGeneratedPassword = (password: string) => {
    setFormData({ ...formData, password });
    setActiveTab('details');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editEntry ? 'Edit Password' : 'Add New Password'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category first so form adapts */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val as PasswordCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{categoryIcons[key as PasswordCategory]}</span>
                          <span>{label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteName">{isNotesOnly ? 'Title *' : 'Site Name *'}</Label>
                <Input
                  id="siteName"
                  placeholder={isNotesOnly ? 'Note title...' : 'Google, Facebook, etc.'}
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  required
                />
              </div>

              {/* Hide URL for email-only and notes-only */}
              {!isEmailOnly && !isNotesOnly && (
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Website URL</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.siteUrl}
                    onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                  />
                </div>
              )}

              {/* Hide username/password for notes-only */}
              {!isNotesOnly && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">{isEmailOnly ? 'Email *' : 'Username / Email *'}</Label>
                    <Input
                      id="username"
                      placeholder="your@email.com"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pr-20 font-mono"
                        required
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setActiveTab('generate')}
                        >
                          <Wand2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">{isNotesOnly ? 'Notes *' : 'Notes'}</Label>
                <Textarea
                  id="notes"
                  placeholder={isNotesOnly ? 'Your notes here...' : 'Optional notes...'}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={isNotesOnly ? 4 : 2}
                  required={isNotesOnly}
                />
              </div>

              <Button type="submit" className="w-full">
                {editEntry ? 'Save Changes' : isNotesOnly ? 'Add Note' : 'Add Password'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="generate" className="mt-4">
            <PasswordGenerator onSelect={handleGeneratedPassword} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
