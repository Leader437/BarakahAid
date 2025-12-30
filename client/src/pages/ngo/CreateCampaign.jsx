import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    HiArrowLeft,
    HiCurrencyDollar,
    HiCalendar,
    HiTag,
    HiPhotograph
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { createCampaign, selectNgoLoading, selectNgoError } from '../../store/ngoSlice';
import api from '../../utils/api';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(selectNgoLoading);
    const error = useSelector(selectNgoError);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('goalAmount', Number(data.targetAmount));
        formData.append('startDate', new Date(data.startDate).toISOString());
        formData.append('endDate', new Date(data.endDate).toISOString());
        formData.append('categoryId', data.categoryId);
        formData.append('status', 'ACTIVE');
        
        if (image) {
            formData.append('image', image);
        }

        const resultAction = await dispatch(createCampaign(formData));
        if (createCampaign.fulfilled.match(resultAction)) {
            navigate('/ngo/campaigns');
        }
    };

    return (
        <div className="min-h-screen py-8 bg-secondary-50">
            <div className="px-4 mx-auto max-w-3xl sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors text-secondary-600 hover:text-secondary-900"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Campaigns
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900">Create New Campaign</h1>
                    <p className="mt-2 text-secondary-600">Start a new fundraising campaign for your cause.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-md bg-error-50 text-error-700">
                        {typeof error === 'string' ? error : 'Failed to create campaign'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Card padding="lg">
                        <h2 className="mb-6 text-xl font-semibold text-secondary-900">Campaign Details</h2>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-secondary-700">Campaign Title</label>
                                <input
                                    type="text"
                                    {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Minimum 5 characters' } })}
                                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., Emergency Food Relief for Gaza"
                                />
                                {errors.title && <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-secondary-700">Description</label>
                                <textarea
                                    rows="4"
                                    {...register('description', { required: 'Description is required' })}
                                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Describe your campaign goals and impact..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-secondary-700">Category</label>
                                <div className="relative">
                                    <HiTag className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                                    <select
                                        {...register('categoryId', { required: 'Category is required' })}
                                        className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.categoryId && <p className="mt-1 text-sm text-error-600">{errors.categoryId.message}</p>}
                            </div>

                            {/* Campaign Image */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-secondary-700">Campaign Cover Image</label>
                                <div className="flex items-center gap-6">
                                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer w-64 border-secondary-300 hover:border-primary-500 hover:bg-secondary-50 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <HiPhotograph className="w-10 h-10 mb-2 text-secondary-400" />
                                            <p className="text-sm text-secondary-500 font-medium">Click to upload cover</p>
                                            <p className="text-xs text-secondary-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                        </div>
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    
                                    {imagePreview && (
                                        <div className="relative h-40 rounded-xl w-64 ring-2 ring-primary-100 overflow-hidden group">
                                            <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={() => {setImage(null); setImagePreview(null);}}
                                                    className="p-2 text-white bg-red-500/80 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Amount & Dates */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-secondary-700">Goal Amount ($)</label>
                                    <div className="relative">
                                        <HiCurrencyDollar className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                                        <input
                                            type="number"
                                            {...register('targetAmount', { required: 'Goal amount is required', min: { value: 1, message: 'Must be at least $1' } })}
                                            className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="5000"
                                        />
                                    </div>
                                    {errors.targetAmount && <p className="mt-1 text-sm text-error-600">{errors.targetAmount.message}</p>}
                                </div>

                                <div>
                                    {/* Placeholder for future features like currency selection */}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-secondary-700">Start Date</label>
                                    <div className="relative">
                                        <HiCalendar className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                                        <input
                                            type="date"
                                            {...register('startDate', { required: 'Start date is required' })}
                                            className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    {errors.startDate && <p className="mt-1 text-sm text-error-600">{errors.startDate.message}</p>}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-secondary-700">End Date</label>
                                    <div className="relative">
                                        <HiCalendar className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                                        <input
                                            type="date"
                                            {...register('endDate', { required: 'End date is required' })}
                                            className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    {errors.endDate && <p className="mt-1 text-sm text-error-600">{errors.endDate.message}</p>}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <SecondaryButton type="button" onClick={() => navigate(-1)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Campaign'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;
