import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiUpload } from 'react-icons/hi';
import api from '../../utils/api';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import Card from '../../components/ui/Card';

const CreateRequest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        urgency: 'MEDIUM',
        category: '', // Would ideally fetch categories
        location: '',
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                // Handle different response structures (direct array or wrapped in data property)
                if (Array.isArray(res.data)) {
                    setCategories(res.data);
                } else if (res.data && Array.isArray(res.data.data)) {
                    setCategories(res.data.data);
                } else {
                    console.warn('Categories response format not recognized:', res.data);
                    setCategories([]);
                }
            } catch (err) {
                console.error('Failed to fetch categories', err);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataPayload = new FormData();
            formDataPayload.append('title', formData.title);
            formDataPayload.append('description', formData.description);
            formDataPayload.append('amount', formData.amount);
            formDataPayload.append('urgency', formData.urgency);
            formDataPayload.append('categoryId', formData.category);
            formDataPayload.append('location', JSON.stringify({
                type: 'Point',
                coordinates: [0, 0],
                address: formData.location
            }));
            
            if (media) {
                formDataPayload.append('media', media);
            }

            await api.post('/donation-requests', formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/ngo/dashboard');
        } catch (error) {
            console.error('Failed to create request', error);
            alert('Failed to create request: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 bg-secondary-50">
            <div className="px-4 mx-auto max-w-3xl sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/ngo/dashboard')}
                        className="flex items-center text-sm text-secondary-600 hover:text-secondary-900"
                    >
                        <HiArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className="mt-2 text-2xl font-bold text-secondary-900">Create Donation Request</h1>
                    <p className="mt-1 text-secondary-600">Request specific items or funds for a beneficiary.</p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Request Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="block w-full mt-1 border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="e.g. School Supplies for Orphanage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Category</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="block w-full mt-1 border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                <option value="">Select a Category</option>
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full mt-1 border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Describe the need and urgency..."
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-secondary-700">Media / Image</label>
                            <div className="flex items-center gap-4 mt-1">
                                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer w-44 border-secondary-300 hover:border-primary-500 hover:bg-secondary-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <HiUpload className="w-8 h-8 mb-2 text-secondary-400" />
                                        <p className="text-xs text-secondary-500">Click to upload</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleMediaChange} accept="image/*" />
                                </label>
                                {mediaPreview && (
                                    <div className="relative h-32 rounded-lg w-44">
                                        <img src={mediaPreview} alt="Preview" className="object-cover w-full h-full rounded-lg" />
                                        <button 
                                            type="button" 
                                            onClick={() => {setMedia(null); setMediaPreview(null);}}
                                            className="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Amount Needed ($)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    min="1"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="block w-full mt-1 border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Urgency</label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleChange}
                                    className="block w-full mt-1 border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Location / Address</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="block w-full mt-1 border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="City, Country or Address"
                            />
                        </div>

                        <div className="pt-4 border-t border-secondary-200">
                            <div className="flex justify-end gap-3">
                                <SecondaryButton type="button" onClick={() => navigate('/ngo/dashboard')}>
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Request'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateRequest;
