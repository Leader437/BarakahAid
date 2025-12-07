// Donation Request Card Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import { formatCurrency, calculatePercentage, getRelativeTime } from '../../utils/helpers';

/**
 * Card component for displaying donation requests
 */
const RequestCard = ({ request, showActions = true, variant = 'default' }) => {
  const navigate = useNavigate();
  const percentage = calculatePercentage(request.currentAmount, request.targetAmount);

  const handleViewDetails = () => {
    navigate(`/request/${request.id}`);
  };

  const handleDonate = (e) => {
    e.stopPropagation();
    navigate(`/donate/${request.id}`);
  };

  return (
    <Card hoverable={variant === 'default'} onClick={variant === 'default' ? handleViewDetails : undefined} className="h-full flex flex-col">
      {/* Image */}
      {request.images && request.images.length > 0 ? (
        <img
          src={request.images[0]}
          alt={request.title}
          className="w-full h-48 object-cover rounded-t-card"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-card flex items-center justify-center">
          <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-secondary-900 text-lg mb-1 line-clamp-2">
              {request.title}
            </h3>
            <p className="text-sm text-secondary-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {request.location}
            </p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant={request.urgency || 'default'} size="sm">
              {request.urgency?.toUpperCase()}
            </Badge>
            <Badge variant={request.status} size="sm">
              {request.status}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary-700 text-sm mb-4 line-clamp-2 flex-grow">
          {request.description}
        </p>

        {/* Stats */}
        <div className="space-y-3 mb-4">
          <ProgressBar
            value={request.currentAmount}
            max={request.targetAmount}
            color={percentage >= 100 ? 'success' : 'primary'}
          />
          
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="font-semibold text-secondary-900">
                {formatCurrency(request.currentAmount)}
              </span>
              <span className="text-secondary-600"> raised of </span>
              <span className="font-semibold text-secondary-900">
                {formatCurrency(request.targetAmount)}
              </span>
            </div>
            <span className="text-primary-600 font-semibold">{percentage}%</span>
          </div>

          <div className="flex gap-4 text-xs text-secondary-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {request.donorCount || 0} donors
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getRelativeTime(request.createdAt)}
            </span>
          </div>
        </div>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
            {request.category?.replace('_', ' ')}
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-auto">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleDonate}
            >
              Donate Now
            </Button>
            <Button
              variant="outlineSecondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              Details
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestCard;
