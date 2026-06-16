import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import WasteService from '../services/wasteService';
import axios from 'axios';

const AddWaste = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      return toast.error('Please upload an image of the waste item');
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('condition_status', data.condition_status);
      formData.append('price', data.price);
      formData.append('wasteImage', imageFile); // Backend backend ma 'wasteImage' naam thi file expect kare che

      await WasteService.createWaste(formData);
      toast.success('Waste item listed successfully!');
      navigate('/my-listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>List a New Item</h1>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Image Upload Area (Photo select karva mate) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div 
              style={{ 
                width: '100%', 
                height: '250px', 
                borderRadius: 'var(--radius-md)', 
                border: '2px dashed var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '1rem',
                background: 'rgba(0,0,0,0.2)'
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  <FaUpload style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                  <p>Click below to upload image</p>
                </div>
              )}
            </div>
            
            <label htmlFor="wasteImage" style={{ cursor: 'pointer', color: 'var(--color-primary)', display: 'inline-block', padding: '0.5rem 1rem', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
              Select Image
            </label>
            <input 
              type="file" 
              id="wasteImage" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" placeholder="e.g. Old Dell Monitor" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="error-text">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" placeholder="Describe the item..." {...register('description', { required: 'Description is required' })}></textarea>
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select className="form-input" {...register('category', { required: true })}>
                {categories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Condition</label>
              <select className="form-input" {...register('condition_status', { required: true })}>
                <option value="good">Good (Reusable)</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor (Needs Recycling)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹) - Enter 0 to Donate for 15 Green Points!</label>
            <input type="number" className="form-input" min="0" defaultValue="0" {...register('price', { required: true, valueAsNumber: true })} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Listing Item...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWaste;
