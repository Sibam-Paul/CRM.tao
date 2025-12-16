'use client'

import { useState } from 'react';
import { createTeamMember } from '@/app/actions/team';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn or similar
import { Input } from '@/components/ui/input';

export default function AddUserForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'user' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to generate the password preview
  const getPasswordPreview = () => {
    if (!form.name || !form.phone) return "...";
    const firstName = form.name.split(' ')[0];
    const phonePrefix = form.phone.substring(0, 4);
    return `${firstName}@${phonePrefix}`;
  };

  const handleConfirmClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all fields");
      return;
    }
    setShowConfirm(true); // Show the card
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    const result = await createTeamMember(formData);

    if (result.success) {
      alert("✅ User Created Successfully!");
      setShowConfirm(false);
      setForm({ name: '', email: '', phone: '', role: 'user' }); // Reset
    } else {
      alert("❌ Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
      
      <form onSubmit={handleConfirmClick} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            placeholder="e.g. Arjun Singh"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input 
            type="email"
            value={form.email} 
            onChange={(e) => setForm({...form, email: e.target.value})} 
            placeholder="arjun@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <Input 
            type="tel"
            value={form.phone} 
            onChange={(e) => setForm({...form, phone: e.target.value})} 
            placeholder="9876543210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select 
            className="w-full p-2 border rounded"
            value={form.role}
            onChange={(e) => setForm({...form, role: e.target.value})}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" className="w-full">
          Create User
        </Button>
      </form>

      {/* --- CONFIRMATION CARD (MODAL) --- */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Confirm New User</h3>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Name:</span> {form.name}</p>
              <p><span className="font-semibold">Email:</span> {form.email}</p>
              <p><span className="font-semibold">Role:</span> {form.role.toUpperCase()}</p>
              
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-2">
                <p className="text-xs text-yellow-800 font-semibold uppercase">Auto-Generated Password</p>
                <p className="text-lg font-mono font-bold text-yellow-900 mt-1">
                  {getPasswordPreview()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleFinalSubmit} disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Confirm & Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}