import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../hooks/useAuth.jsx';
import { LayoutDashboard, Package, Plus, Store, LogOut, Menu, X, KeyRound } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen.jsx';

function AdminSidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/products/new', icon: Plus, label: 'Add Product' },
    { to: '/', icon: Store, label: 'View Store' },
    { to: '/admin/change-password', icon: KeyRound, label: 'Change Password' },
  ];

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const isActive = (path) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-card border-b border-border h-14 flex items-center justify-between px-4 shadow-sm">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="font-display text-lg tracking-wider text-ink">OLA<span className="text-brand-500">FLEX</span></span>
          <span className="text-[10px] text-ink-muted uppercase tracking-widest">Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-ink-muted hover:text-ink">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink/20" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-surface-card border-r border-border pt-16 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 space-y-1">
              {links.map(link => (
                <button key={link.to} onClick={() => { navigate(link.to); setMobileOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded text-sm transition-colors text-left ${
                    isActive(link.to) ? 'bg-brand-50 text-brand-500 font-medium' : 'text-ink-secondary hover:text-ink hover:bg-surface-alt'
                  }`}>
                  <link.icon size={18} /> {link.label}
                </button>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <div className="text-xs text-ink-muted mb-2">{user?.username}</div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-ink-muted hover:text-status-out transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-surface-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="block">
            <span className="font-display text-xl tracking-wider text-ink">OLA<span className="text-brand-500">FLEX</span></span>
            <div className="text-[10px] text-ink-muted uppercase tracking-[0.3em] mt-1">Admin Panel</div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-colors ${
                isActive(link.to) ? 'bg-brand-50 text-brand-500 font-medium' : 'text-ink-secondary hover:text-ink hover:bg-surface-alt'
              }`}>
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="text-xs text-ink-muted mb-2">Signed in as <span className="text-ink font-medium">{user?.username}</span></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-ink-muted hover:text-status-out transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

function AdminLayoutInner() {
  return (
    <div className="min-h-screen bg-admin-bg">
      <AdminSidebar />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{<Outlet />}</div>
      </div>
    </div>
  );
}

export default function AdminLayoutWrapper() {
  return (
    <AuthProvider>
      <AdminLayoutInner />
    </AuthProvider>
  );
}
