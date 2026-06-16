import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { toast } from 'react-hot-toast';
import { FaUserShield, FaBan, FaTrash, FaEye } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, currentStatus, e) => {
    e.stopPropagation(); // Row par click thava nathi devu
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;

    try {
      await adminService.toggleBlockStatus(userId, !currentStatus);
      toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation(); // Row par click thava nathi devu
    if (!window.confirm('CRITICAL: Are you sure you want to completely delete this user? This cannot be undone.')) return;

    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300">
          Total Users: <span className="font-bold text-emerald-400">{users.length}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-center">Items Listed</th>
                <th className="p-4 font-medium text-center">Points</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No users found.</td></tr>
              ) : (
                users.map(user => (
                  <tr 
                    key={user.id} 
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1 text-xs font-medium bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full w-fit">
                          <FaUserShield /> Admin
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 capitalize">{user.role}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                        {user.item_count} items
                      </span>
                    </td>
                    <td className="p-4 text-center text-emerald-400 font-medium">
                      {user.points} pts
                    </td>
                    <td className="p-4 text-center">
                      {user.is_blocked ? (
                        <span className="text-xs font-medium bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full">Blocked</span>
                      ) : (
                        <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full">Active</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/users/${user.id}`); }}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        {user.role !== 'admin' && (
                          <>
                            <button 
                              onClick={(e) => handleToggleBlock(user.id, user.is_blocked, e)}
                              className={`p-2 rounded-lg transition-colors ${user.is_blocked ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-orange-400 hover:bg-orange-500/10'}`}
                              title={user.is_blocked ? "Unblock User" : "Block User"}
                            >
                              <FaBan />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(user.id, e)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete User permanently"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
