import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiArrowLeft,
  HiCalendar,
  HiLocationMarker,
  HiUserGroup,
  HiTag,
  HiPhotograph,
  HiX
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { useDispatch } from 'react-redux';
import { useToast } from '../../components/ui/Toast';
import { updateEvent } from '../../store/ngoSlice';
import api from '../../utils/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: { address: '' },
    requiredSkills: [],
    maxVolunteers: 10
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/volunteers/events/${id}`);
        const result = response.data || response;
        const event = result.data || result;
        
        setFormData({
          title: event.title || '',
          description: event.description || '',
          eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
          location: event.location || { address: '' },
          requiredSkills: event.requiredSkills || [],
          maxVolunteers: event.maxVolunteers || 10
        });
        setCurrentImage(event.image);
      } catch (error) {
        toast.error('Failed to load event');
        navigate('/ngo/events');
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setFormData(prev => ({ ...prev, location: { ...prev.location, address: value } }));
    } else if (name === 'maxVolunteers') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (!imagePreview) {
      setCurrentImage(null);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.location.address.trim()) newErrors.address = 'Location is required';
    if (formData.maxVolunteers < 1) newErrors.maxVolunteers = 'At least 1 volunteer required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('eventDate', formData.eventDate);
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('requiredSkills', JSON.stringify(formData.requiredSkills));
      submitData.append('maxVolunteers', formData.maxVolunteers.toString());
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await dispatch(updateEvent({ id, data: submitData })).unwrap();
      toast.success('Event updated successfully!');
      navigate('/ngo/events');
    } catch (error) {
      toast.error(error || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen py-8 bg-secondary-50 flex items-center justify-center">
        <p className="text-secondary-600">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-3xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-secondary-100"
          >
            <HiArrowLeft className="w-5 h-5 text-secondary-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Edit Event</h1>
            <p className="mt-1 text-secondary-600">Update event details</p>
          </div>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Image */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">
                <HiPhotograph className="inline w-4 h-4 mr-1" />
                Event Image
              </label>
              {(imagePreview || currentImage) ? (
                <div className="relative w-full h-48 overflow-hidden rounded-lg">
                  <img 
                    src={imagePreview || currentImage} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute p-1 text-white bg-error-600 rounded-full top-2 right-2 hover:bg-error-700"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-secondary-300 hover:border-primary-500 bg-secondary-50">
                  <HiPhotograph className="w-12 h-12 text-secondary-400" />
                  <span className="mt-2 text-sm text-secondary-600">Click to upload event image</span>
                  <span className="mt-1 text-xs text-secondary-500">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Community Clean-up Day"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-error-500' : 'border-secondary-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-error-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the event..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-error-500' : 'border-secondary-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-error-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700">
                  <HiCalendar className="inline w-4 h-4 mr-1" />
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.eventDate ? 'border-error-500' : 'border-secondary-300'
                  }`}
                />
                {errors.eventDate && <p className="mt-1 text-sm text-error-600">{errors.eventDate}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700">
                  <HiUserGroup className="inline w-4 h-4 mr-1" />
                  Max Volunteers *
                </label>
                <input
                  type="number"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleChange}
                  min={1}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.maxVolunteers ? 'border-error-500' : 'border-secondary-300'
                  }`}
                />
                {errors.maxVolunteers && <p className="mt-1 text-sm text-error-600">{errors.maxVolunteers}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">
                <HiLocationMarker className="inline w-4 h-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street, City"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.address ? 'border-error-500' : 'border-secondary-300'
                }`}
              />
              {errors.address && <p className="mt-1 text-sm text-error-600">{errors.address}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">
                <HiTag className="inline w-4 h-4 mr-1" />
                Required Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="e.g., First Aid, Driving"
                  className="flex-1 px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <SecondaryButton type="button" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;
