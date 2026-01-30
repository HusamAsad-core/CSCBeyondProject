import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const [newPlan, setNewPlan] = useState({
    name: '',
    course_limit: '',
    price: '',
    features: '', 
    is_recommended: 0 // Default to 0 (false)
  });

  const token = localStorage.getItem('token');

  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/plans');
      const data = await res.json();
      if (data.success) setPlans(data.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const featuresArray = newPlan.features 
      ? newPlan.features.split(',').map(f => f.trim()).filter(f => f !== "")
      : [];

    const planData = {
      name: String(newPlan.name).trim(),
      course_limit: Number(newPlan.course_limit) || 0, 
      courseLimit: Number(newPlan.course_limit) || 0,
      price: Number(newPlan.price) || 0,
      features: featuresArray, 
      is_recommended: newPlan.is_recommended // Sends 0 or 1
    };

    try {
      const res = await fetch('http://localhost:5000/api/plans/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(planData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Plan Added!");
        setIsAdding(false);
        setNewPlan({ name: '', course_limit: '', price: '', features: '', is_recommended: 0 });
        fetchPlans();
      } else {
        alert(`Validation Error: ${data.message}`);
      }
    } catch (err) { alert("Network error"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const featuresArray = typeof editingPlan.features === 'string' 
      ? editingPlan.features.split(',').map(f => f.trim()).filter(f => f !== "")
      : editingPlan.features;

    const updatedData = {
      ...editingPlan,
      course_limit: Number(editingPlan.course_limit),
      courseLimit: Number(editingPlan.course_limit),
      price: Number(editingPlan.price),
      features: featuresArray,
      is_recommended: editingPlan.is_recommended // Sends 0 or 1
    };

    const res = await fetch(`http://localhost:5000/api/admin/edit-plan/${editingPlan.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();
    if (data.success) {
      alert("Plan updated!");
      setEditingPlan(null);
      fetchPlans();
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/plans/delete-plan/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        alert("Plan deleted!");
        setEditingPlan(null);
        fetchPlans();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>Manage Pricing Plans</h2>
          <button onClick={() => setIsAdding(!isAdding)} style={{ background: isAdding ? '#95a5a6' : '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            {isAdding ? 'Cancel' : '+ Add New Plan'}
          </button>
        </div>

        {isAdding && (
          <div style={{ background: '#ecf0f1', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>Create New Plan</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input style={inputStyle} type="text" placeholder="Plan Name" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} required />
                <input style={inputStyle} type="number" placeholder="Price ($5-$50)" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: e.target.value})} required />
                <input style={inputStyle} type="number" placeholder="Course Limit" value={newPlan.course_limit} onChange={e => setNewPlan({...newPlan, course_limit: e.target.value})} required />
                <input style={inputStyle} type="text" placeholder="Features (comma separated)" value={newPlan.features} onChange={e => setNewPlan({...newPlan, features: e.target.value})} required />
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', gridColumn: 'span 2' }}>
                  <input 
                    type="checkbox" 
                    checked={newPlan.is_recommended === 1} 
                    onChange={e => setNewPlan({...newPlan, is_recommended: e.target.checked ? 1 : 0})} 
                  />
                  Mark as Recommended Plan
                </label>
              </div>
              <button type="submit" style={{ background: '#27ae60', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px', width: '100%' }}>Save Plan</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {plans.map(plan => (
            <div key={plan.id} style={{...cardStyle, border: plan.is_recommended === 1 ? '2px solid #27ae60' : '1px solid #ddd'}}>
              <h3 style={{ marginBottom: '10px' }}>
                {plan.name} 
                {plan.is_recommended === 1 && <span style={badgeStyle}>RECOMMENDED</span>}
              </h3>
              <p style={{fontSize: '24px', fontWeight: 'bold', color: '#2c3e50'}}>${plan.price}</p>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>  {plan.course_limit}</p>
              <button onClick={() => setEditingPlan(plan)} style={editBtnStyle}>Edit Plan</button>
            </div>
          ))}
        </div>

        {editingPlan && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Edit Plan</h3>
                <button onClick={() => handleDelete(editingPlan.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px' }}>🗑️</button>
              </div>
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Plan Name</label>
                <input style={inputStyle} type="text" value={editingPlan.name || ''} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} />
                
                <label>Price</label>
                <input style={inputStyle} type="number" value={editingPlan.price || ''} onChange={e => setEditingPlan({...editingPlan, price: e.target.value})} />
                
                <label>Course Enrollment Limit</label>
                <input 
                  style={inputStyle} 
                  type="number" 
                  value={editingPlan.course_limit ?? ''} 
                  onChange={e => setEditingPlan({...editingPlan, course_limit: e.target.value})} 
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                  <input 
                    type="checkbox" 
                    checked={editingPlan.is_recommended === 1} 
                    onChange={e => setEditingPlan({...editingPlan, is_recommended: e.target.checked ? 1 : 0})} 
                  />
                  Is Recommended
                </label>

                <label>Features (comma separated)</label>
                <textarea 
                  style={{...inputStyle, height: '80px'}} 
                  value={Array.isArray(editingPlan.features) ? editingPlan.features.join(', ') : editingPlan.features} 
                  onChange={e => setEditingPlan({...editingPlan, features: e.target.value})} 
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" style={{ flex: 1, background: '#3498db', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                  <button type="button" onClick={() => setEditingPlan(null)} style={{ flex: 1, background: '#95a5a6', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const cardStyle = { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'relative' };
const editBtnStyle = { background: '#3498db', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '8px', width: '450px' };
const badgeStyle = { fontSize: '10px', background: '#27ae60', color: 'white', padding: '2px 8px', borderRadius: '10px', marginLeft: '10px', verticalAlign: 'middle' };

export default ManagePlans;