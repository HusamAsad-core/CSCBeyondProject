import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for filtering
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    const res = await fetch('http://localhost:5000/api/admin/edit-role', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, newRole })
    });
    const data = await res.json();
    if (data.success) {
      alert("Role updated successfully!");
      fetchUsers();
    }
  };

  const handleRename = async (userId, newUsername) => {
    if (!newUsername) return;
    const res = await fetch('http://localhost:5000/api/admin/rename-user', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, newUsername })
    });
    const data = await res.json();
    if (data.success) {
      console.log("Username updated");
      fetchUsers();
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          alert("User deleted.");
          fetchUsers();
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

const filteredUsers = users.filter(user => {
  if (user.role === 'admin') return false;

  const username = (user.username || "").toLowerCase();
  const email = (user.email || "").toLowerCase();
  const search = searchTerm.toLowerCase();

  return username.includes(search) || email.includes(search);
});

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Manage Users</h2>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Click on a username to edit. Changes save on blur.</p>
          </div>
          
          {/* Search Bar */}
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '25px', 
              border: '1px solid #ddd', 
              width: '300px',
              outline: 'none'
            }}
          />
        </header>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Current Role</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{user.id}</td>
                <td>
                  <input 
                    type="text" 
                    defaultValue={user.username} 
                    onBlur={(e) => handleRename(user.id, e.target.value)}
                    style={{ border: '1px solid transparent', padding: '5px', borderRadius: '4px', width: '90%' }}
                    onFocus={(e) => e.target.style.border = '1px solid #f39c12'}
                  />
                </td>
                <td>{user.email}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    background: user.role === 'admin' ? '#ffeeba' : '#e2e3e5',
                    color: user.role === 'admin' ? '#856404' : '#383d41',
                    fontWeight: 'bold'
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <select 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)} 
                      defaultValue=""
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="" disabled>Change Role</option>
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                    
                    <button 
                      onClick={() => handleDelete(user.id)}
                      style={{ 
                        background: '#e74c3c', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#c0392b'}
                      onMouseOut={(e) => e.target.style.background = '#e74c3c'}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#999' }}>No users found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;