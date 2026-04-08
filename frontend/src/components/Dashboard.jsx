import React, { useState } from 'react';
import axios from 'axios';
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
    
    images.forEach((img) => {
      if (img) {
        formPayload.append('images', img);
      }
    });

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/products/add', formPayload, {
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
    localStorage.removeItem('adminToken');
    setAuth(false);
  };

  return (
    <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-wood-dark">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Product</h3>
        
        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wood Type</label>
              <select
                name="woodType"
                value={formData.woodType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border bg-white"
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
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border bg-white"
              >
                <option value="">Select Size</option>
                {SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Temple Style</label>
              <select
                name="templeStyle"
                value={formData.templeStyle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border bg-white"
              >
                <option value="">Select Style</option>
                {TEMPLE_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-wood-dark focus:ring-wood-dark sm:text-sm p-3 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (Up to 3)</label>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  id={`image-${i}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(i, e)}
                  className="flex w-full md:w-1/2 items-center p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-wood file:text-white hover:file:bg-wood-dark cursor-pointer"
                  required={i === 0}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-wood-dark hover:bg-wood'}`}
          >
            {loading ? 'Uploading...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
