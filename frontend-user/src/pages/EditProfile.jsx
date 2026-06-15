import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import UserService from '../services/userService';
import useAuth from '../hooks/useAuth';

const EditProfile = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth(); // just to have the token available if needed
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await UserService.getProfile();
        // Prefill form fields
        setValue('name', data.name);
        setValue('phone', data.phone || '');
        setValue('address', data.address || '');
        setValue('upi_id', data.upi_id || '');
        
        if (data.profile_image) {
          setImagePreview(`${import.meta.env.VITE_API_URL.replace('/api', '')}${data.profile_image}`);
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    loadProfile();
  }, [setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // 1. Update text profile details
      await UserService.updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address
      });

      // 2. Update UPI ID if changed
      if (data.upi_id) {
        await UserService.updateUpiId({ upiId: data.upi_id });
      }

      // 3. Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        await UserService.uploadImage(formData);
      }

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      
      <button 
        onClick={() => navigate('/profile')} 
        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}
      >
        <FaArrowLeft /> Back to Profile
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Image Upload Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <img 
              src={imagePreview || 'https://placehold.co/150x150?text=Upload'}
              alt="Preview" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '2px dashed var(--color-text-muted)' }} 
            />
            <label htmlFor="profileImage" style={{ cursor: 'pointer', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <FaUpload /> Change Profile Picture
            </label>
            <input 
              type="file" 
              id="profileImage" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" {...register('name', { required: true })} />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-input" {...register('phone')} />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" className="form-input" {...register('address')} />
          </div>

          <div className="form-group">
            <label className="form-label">UPI ID (For receiving payments)</label>
            <input type="text" className="form-input" placeholder="e.g. username@okbank" {...register('upi_id')} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
