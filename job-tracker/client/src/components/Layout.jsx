import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Calendar, LogOut,
  Menu, Search, X, Settings, Sun, Moon, ClipboardList
} from 'lucide-react';
import { Input } from './ui/input';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export function Layout({ children }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [searchResults, setSearchResults]       = useState(null);
  const [isSearchFocused, setIsSearchFocused]   = useState(false);
  const [isAvatarOpen, setIsAvatarOpen]         = useState(false);
  const avatarRef = useRef(null);

  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Companies',  path: '/companies',  icon: Briefcase },
    { name: 'Calendar',   path: '/calendar',   icon: Calendar },
  ];

  const personalItems = [
    { name: 'Tasks', path: '/tasks', icon: ClipboardList },
  ];

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length === 0) { setSearchResults(null); return; }
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get(`${API_URL}/api/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
      ? 'bg-blue-600 text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 flex flex-col
        transform transition-transform duration-200
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-lg text-blue-600">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            ReachlistTracker
          </div>
          <button className="lg:hidden ml-auto text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {/* Main menu */}
          <div className="space-y-1">
            <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</p>
            {menuItems.map((item) => (
              <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={navItemClass}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Personal section */}
          <div className="space-y-1">
            <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Personal</p>
            {personalItems.map((item) => (
              <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={navItemClass}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 shrink-0 z-30 gap-3">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md">
            <Menu className="h-5 w-5" />
          </button>
          <span className="lg:hidden font-bold text-blue-600 text-sm">ReachlistTracker</span>

          <div className="flex items-center gap-3 ml-auto">
            {/* Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 w-44 sm:w-64 h-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 rounded-full text-sm transition-all"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
              </div>

              {isSearchFocused && searchResults && searchQuery.trim() !== '' && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                  {searchResults.companies.length === 0 && searchResults.jobs.length === 0 && searchResults.people.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">No results for "{searchQuery}"</div>
                  ) : (
                    <div className="py-1">
                      {searchResults.companies.length > 0 && (
                        <div className="px-3 pt-2 pb-1">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Companies</p>
                          {searchResults.companies.map(c => (
                            <div key={c.id} onClick={() => navigate(`/company/${c.id}`)} className="cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-md text-sm text-gray-800 font-medium">
                              {c.name}
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.jobs.length > 0 && (
                        <div className="px-3 pt-2 pb-1 border-t border-gray-50">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Jobs</p>
                          {searchResults.jobs.map(j => (
                            <div key={j.id} onClick={() => navigate(`/company/${j.company_id || j.id}`)} className="cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-md text-sm flex justify-between items-center">
                              <span className="text-gray-800 font-medium">{j.role}</span>
                              <span className="text-gray-400 text-xs truncate ml-2">{j.company_name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.people.length > 0 && (
                        <div className="px-3 pt-2 pb-1 border-t border-gray-50">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">People</p>
                          {searchResults.people.map(p => (
                            <div key={p.id} onClick={() => navigate(`/person/${p.id}`)} className="cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-md text-sm flex justify-between items-center">
                              <span className="text-gray-800 font-medium">{p.name}{p.role ? ` · ${p.role}` : ''}</span>
                              <span className="text-gray-400 text-xs truncate ml-2">{p.company_name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Avatar dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setIsAvatarOpen(prev => !prev)}
                className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition-colors ring-2 ring-transparent hover:ring-blue-200"
              >
                {initials}
              </button>

              {isAvatarOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email || ''}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setIsAvatarOpen(false); navigate('/settings'); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      Settings
                    </button>

                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {isDark
                          ? <Sun className="h-4 w-4 text-amber-400" />
                          : <Moon className="h-4 w-4 text-gray-400" />
                        }
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                      </div>
                      <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isDark ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>

                  <div className="py-1 border-t border-gray-50">
                    <button
                      onClick={() => { setIsAvatarOpen(false); handleLogout(); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
