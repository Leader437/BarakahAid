import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiSave } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import api from '../../utils/api';

const EditCampaign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalAmount: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/campaigns/${id}`);
                const data = response.data?.data || response.data;
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    goalAmount: data.goalAmount || '',
                    status: data.status || 'ACTIVE',
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load campaign');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Only send valid fields per UpdateCampaignDto
            await api.put(`/campaigns/${id}`, {
                title: formData.title,
                description: formData.description,
                goalAmount: Number(formData.goalAmount),
                status: formData.status,
            });
            navigate(`/ngo/campaigns/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update campaign');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-secondary-50 flex items-center justify-center">
                <p className="text-secondary-600">Loading campaign...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-secondary-50">
            <div className="px-4 mx-auto max-w-2xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Link to={`/ngo/campaigns/${id}`} className="flex items-center text-secondary-600 hover:text-secondary-900">
                        <HiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Campaign
                    </Link>
                </div>

                <Card padding="lg">
                    <h1 className="text-2xl font-bold text-secondary-900 mb-6">Edit Campaign</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Campaign Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                required
                                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Goal Amount */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Goal Amount ($)
                            </label>
                            <input
                                type="number"
                                name="goalAmount"
                                value={formData.goalAmount}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="PAUSED">Paused</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Link to={`/ngo/campaigns/${id}`} className="flex-1">
                                <SecondaryButton type="button" className="w-full">
                                    Cancel
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={saving} className="flex-1">
                                <HiSave className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default EditCampaign;
