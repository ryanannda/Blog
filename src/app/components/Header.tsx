import { PenSquare, LogIn, LogOut, Home, Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { User } from '@/app/types/blog';

interface HeaderProps {
  currentUser: User | null;
  currentView: 'blog' | 'admin' | 'post';
  onLoginClick: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export function Header({
  currentUser,
  currentView,
  onLoginClick,
  onLogout,
  onNavigateHome,
  onNavigateAdmin,
}: HeaderProps) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <PenSquare className="size-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              MiniBlog
            </h1>
          </div>

          <nav className="flex items-center gap-2">
            {currentView !== 'blog' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="gap-2"
              >
                <Home className="size-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}

            {isAdmin && currentView !== 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateAdmin}
                className="gap-2"
              >
                <Settings className="size-4" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full">
                  <div className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.username}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onLoginClick}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}