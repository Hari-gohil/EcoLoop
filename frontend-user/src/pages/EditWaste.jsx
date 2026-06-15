import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import WasteService from '../services/wasteService';
import axios from 'axios';

const EditWaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
        setCategories(catRes.data);

        // Fetch item details
        const data = await WasteService.getWasteById(id);
        
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('category', data.category);
        setValue('condition_status', data.item_condition);
        setValue('price', data.price);
        
        if (data.image_url) {
          setImagePreview(`${import.meta.env.VITE_API_URL.replace('/api', '')}${data.image_url}`);
        }
      } catch (error) {
        toast.error('Failed to load details');
        navigate('/my-listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await WasteService.updateWaste(id, data);
      toast.success('Waste item updated successfully!');
      navigate('/my-listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>Edit Listing</h1>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span className="error-text">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" {...register('description', { required: 'Description is required' })}></textarea>
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Condition</label>
              <select className="form-input" {...register('item_condition', { required: true })}>
                <option value="good">Good (Reusable)</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor (Needs Recycling)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-input" min="0" {...register('price', { required: true, valueAsNumber: true })} />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Status</label>
              <select className="form-input" {...register('status', { required: true })}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="exchanged">Exchanged / Sold</option>
                <option value="recycled">Recycled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => navigate('/my-listings')} className="btn" style={{ flex: 1, background: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWaste;
