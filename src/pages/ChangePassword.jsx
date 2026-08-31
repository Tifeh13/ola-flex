import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyAdmin, setAdminPassword } from './Login.jsx';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Verify current password
    if (!verifyAdmin('admin', currentPassword)) {
      toast.error('Current password is incorrect');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    await new Promise(r => setTimeout(r, 300));
    setAdminPassword(newPassword);
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Change Password — OLAFLEX Admin</title></Helmet>
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold text-ink mb-6">Change Password</h1>

        <form onSubmit={handleSubmit} className="p-6 border border-border bg-surface-card space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
                className="input-luxury pr-10" placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                className="input-luxury pr-10" placeholder="Enter new password"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-ink-muted">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-ink-muted mb-1.5">Confirm New Password</label>
            <input
              type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              className="input-luxury" placeholder="Confirm new password"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-gold justify-center disabled:opacity-50">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : <><Check size={16} /> Update Password</>}
          </button>
        </form>
      </div>
    </>
  );
}
