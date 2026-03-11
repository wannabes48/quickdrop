import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, MessageSquare, Map, Package,
  BarChart3, History, Moon, Sun, Plus, ChevronDown,
  UserCog, LogOut, Settings as SettingsIcon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const getNavItems = (role) => {
  const common = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Settings',  icon: SettingsIcon,    path: '/settings' },
    { name: 'Chats',     icon: MessageSquare,   path: '/chats', badge: 2 },
  ];

  if (role === 'client') {
    return [
      ...common,
      { name: 'Orders',    icon: Package,       path: '/orders' },
      { name: 'History',   icon: History,       path: '/history' },
    ];
  }
  if (role === 'courier' || role === 'partner') {
    return [
      ...common,
      { name: 'Tracking',  icon: Map,           path: '/tracking' },
      { name: 'Earnings',  icon: BarChart3,     path: '/earnings' },
      { name: 'History',   icon: History,       path: '/history' },
    ];
  }
  if (role === 'admin') {
    return [
      ...common,
      { name: 'Tracking',  icon: Map,           path: '/tracking' },
      { name: 'Orders',    icon: Package,       path: '/orders' },
      { name: 'Earnings',  icon: BarChart3,     path: '/earnings' },
      { name: 'Analysis',  icon: BarChart3,     path: '/analysis' },
      { name: 'Partners',  icon: Users,         path: '/partners' }
    ];
  }
  return common; // Fallback
};

function NavItem({ item, depth = 0 }) {
  const location = useLocation();
  const [open, setOpen] = useState(() =>
    item.children?.some(c => location.pathname.startsWith(c.path))
  );

  const isParentActive = item.children
    ? item.children.some(c => location.pathname.startsWith(c.path))
    : false;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(v => !v)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
            isParentActive
              ? 'bg-rose-500 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-4.5 h-4.5" />
            {item.name}
          </div>
          <div className="flex items-center gap-1.5">
            {item.badge && !open && (
              <span className="bg-rose-500 text-white dark:bg-rose-600 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {item.badge}
              </span>
            )}
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 opacity-60" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1 pl-3 border-l border-slate-200 dark:border-slate-700 flex flex-col gap-0.5 pb-1">
                {item.children.map(child => <NavItem key={child.path} item={child} depth={1} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => cn(
        'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group',
        isActive
          ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 dark:shadow-none'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
      )}
    >
      <div className="flex items-center gap-3">
        <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span>{item.name}</span>
      </div>
      {item.badge && (
        <span className="bg-rose-100 text-rose-600 group-[.active]:bg-white/20 group-[.active]:text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = getNavItems(role);

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-colors duration-200">
      {/* Profile */}
      <div className="p-5 flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800 relative group">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=f43f5e&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full ring-2 ring-rose-200 dark:ring-rose-800"
          />
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-rose-500 font-semibold uppercase tracking-wider">{role || 'ROLE'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
        {navItems.map(item => <NavItem key={item.path} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors font-medium"
        >
          {isDarkMode
            ? <Sun className="w-[18px] h-[18px] text-amber-400" />
            : <Moon className="w-[18px] h-[18px] text-slate-500" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.button>

        {(role === 'client' || role === 'admin') && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/requests/trucks')}
            className="flex items-center justify-center gap-2 w-full px-3 py-3 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm shadow-rose-200 dark:shadow-none transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create new request
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </motion.button>

      </div>
    </aside>
  );
}

