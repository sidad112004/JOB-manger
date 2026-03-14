import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Calendar, Bell, LogOut, Menu, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

export function Layout({ children }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Companies', path: '/companies', icon: Briefcase },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Briefcase className="h-6 w-6" />
            <span>JobTracker</span>
          </div>
          <button className="lg:hidden ml-auto text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={navItemClass}>
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex items-center px-4 shrink-0 z-30 justify-between md:justify-end">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-2 font-bold text-blue-600">JobTracker</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-sm ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search jobs, people, companies..."
                  className="pl-9 w-48 sm:w-64 md:w-80 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchResults && (searchQuery.trim() !== '') && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border shadow-xl rounded-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {searchResults.companies.length === 0 && searchResults.jobs.length === 0 && searchResults.people.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">No results found for "{searchQuery}"</div>
                  ) : (
                    <div className="py-2">
                      {searchResults.companies.length > 0 && (
                        <div className="px-3 py-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Companies</h4>
                          {searchResults.companies.map(c => (
                            <div key={c.id} onClick={() => navigate(`/company/${c.id}`)} className="cursor-pointer hover:bg-gray-100 p-2 rounded text-sm text-gray-800">
                              {c.name}
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.jobs.length > 0 && (
                        <div className="px-3 py-2 border-t border-gray-100">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Jobs</h4>
                          {searchResults.jobs.map(j => (
                            <div key={j.id} onClick={() => navigate(`/company/${j.company_id || j.id}`)} className="cursor-pointer hover:bg-gray-100 p-2 rounded text-sm flex justify-between items-center">
                              <span className="text-gray-800 font-medium">{j.role}</span>
                              <span className="text-gray-500 text-xs truncate ml-2 max-w-[120px]">{j.company_name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.people.length > 0 && (
                        <div className="px-3 py-2 border-t border-gray-100">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">People</h4>
                          {searchResults.people.map(p => (
                            <div key={p.id} onClick={() => navigate(`/person/${p.id}`)} className="cursor-pointer hover:bg-gray-100 p-2 rounded text-sm flex justify-between items-center">
                              <span className="text-gray-800 font-medium">{p.name} {p.role ? `- ${p.role}` : ''}</span>
                              <span className="text-gray-500 text-xs truncate ml-2 max-w-[120px]">{p.company_name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Notification bell mock */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto w-full z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
