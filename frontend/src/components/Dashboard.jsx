import React, { useState } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { WOOD_TYPES, SIZES, TEMPLE_STYLES } from '../constants/productOptions';

const Dashboard = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    name: '',
    woodType: '',
    price: '',
    size: '',
    templeStyle: ''
  });
  const [images, setImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (index, e) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0];
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('woodType', formData.woodType);
    formPayload.append('price', formData.price);
    if (formData.size) formPayload.append('size', formData.size);
    if (formData.templeStyle) formPayload.append('templeStyle', formData.templeStyle);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true
    };

    try {
      for (const img of images) {
        if (img) {
          const compressedFile = await imageCompression(img, options);
          formPayload.append('images', compressedFile, img.name);
        }
      }
    } catch (err) {
      setMessage('Error compressing images. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('adminToken');
      await axios.post('/api/products', formPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Product added successfully!');
      setFormData({ name: '', woodType: '', price: '', size: '', templeStyle: '' });
      setImages([null, null, null]);
      // Reset file inputs
      [0, 1, 2].forEach(i => {
        const el = document.getElementById(`image-${i}`);
        if(el) el.value = '';
      });
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setAuth(false);
  };

  return (
    <div className="max-w-4xl w-full bg-background border border-primary/10 shadow-xl rounded-[2.5rem] p-8 text-text-primary">
      <div className="flex justify-between items-center mb-8 border-b border-primary/10 pb-4">
        <h2 className="text-3xl font-heading font-extrabold text-primary">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="bg-background-alt p-6 rounded-2xl border border-primary/10">
        <h3 className="text-xl font-heading font-bold mb-4 text-primary">Add New Product</h3>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Wood Type</label>
              <select
                name="woodType"
                value={formData.woodType}
                onChange={handleChange}
                className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300 cursor-pointer"
                required
              >
                <option value="">Select Wood Type</option>
                {WOOD_TYPES.map(wood => (
                  <option key={wood} value={wood}>{wood}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Size</option>
                {SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Temple Style</label>
              <select
                name="templeStyle"
                value={formData.templeStyle}
                onChange={handleChange}
                className="mt-1 block w-full bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Style</option>
                {TEMPLE_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full md:w-1/2 bg-background border-primary/20 rounded-xl shadow-sm focus:border-accent focus:ring-accent text-sm p-3 border outline-none transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Product Images (Up to 3)</label>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  id={`image-${i}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(i, e)}
                  className="flex w-full md:w-1/2 items-center p-2 border border-primary/20 rounded-xl shadow-sm text-sm text-text-muted bg-background file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary/95 transition-all cursor-pointer"
                  required={i === 0}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3.5 rounded-xl shadow-md text-xs font-bold transition-all duration-300 uppercase tracking-wider cursor-pointer
              ${loading ? 'bg-primary/40 text-white/60 cursor-not-allowed' : 'bg-accent text-primary hover:bg-accent/90'}`}
          >
            {loading ? 'Uploading...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
