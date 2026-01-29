import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Lock, User as UserIcon } from 'lucide-react';
import { User } from '@/app/types/blog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Simple authentication - in real app, this would be handled by backend
    let user: User | null = null;
    
    if (username === 'admin' && password === 'admin123') {
      user = { username: 'admin', role: 'admin' };
    } else if (username === 'user' && password === 'user123') {
      user = { username: 'user', role: 'user' };
    }

    if (user) {
      onLogin(user);
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid credentials. Check the demo accounts below.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="size-5 text-blue-500" />
            Login
          </DialogTitle>
          <DialogDescription>
            Login as admin to manage posts or as a user to comment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin or user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Lock className="size-4" />
                Admin Account
              </div>
              <p>Username: <span className="font-mono">admin</span></p>
              <p>Password: <span className="font-mono">admin123</span></p>
              <p className="text-xs mt-1 text-blue-600">Can manage all posts</p>
            </div>

            <div className="bg-purple-50 p-3 rounded-md text-sm text-purple-700">
              <div className="flex items-center gap-2 font-medium mb-2">
                <UserIcon className="size-4" />
                User Account
              </div>
              <p>Username: <span className="font-mono">user</span></p>
              <p>Password: <span className="font-mono">user123</span></p>
              <p className="text-xs mt-1 text-purple-600">Can comment on posts</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}