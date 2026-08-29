import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AuthProvider, useAuth } from '../hooks/useAuth.jsx';
import toast from 'react-hot-toast';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center px-5">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,151,62,0.03)_0%,transparent_60%)]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl tracking-[0.2em] font-bold text-ink">
            OLA<span className="text-brand-500">FLEX</span>
          </span>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ink-muted">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 border border-border bg-surface-card">
          <h2 className="font-display text-lg font-semibold text-ink text-center mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">Username</label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="input-luxury" placeholder="Enter username" autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="input-luxury pr-10" placeholder="Enter password" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-6 btn-gold justify-center disabled:opacity-50">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-muted">OLAFLEX Admin Panel</p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <>
      <Helmet><title>Admin Login — OLAFLEX</title></Helmet>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </>
  );
}
