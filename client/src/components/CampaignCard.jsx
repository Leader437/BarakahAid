// Campaign Card Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { formatCurrency, calculatePercentage, formatDate } from '../../utils/helpers';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const percentage = calculatePercentage(campaign.currentAmount, campaign.targetAmount);

  return (
    <Card hoverable onClick={() => navigate(`/campaign/${campaign.id}`)} className="h-full">
      <div className="aspect-video bg-gradient-to-br from-primary-200 to-accent-200 rounded-lg mb-4 flex items-center justify-center">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      
      <h3 className="font-semibold text-lg text-secondary-900 mb-2 line-clamp-2">
        {campaign.title}
      </h3>
      
      <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
        {campaign.description}
      </p>
      
      <div className="mb-3">
        <Badge variant={campaign.status} size="sm">{campaign.status}</Badge>
      </div>
      
      <ProgressBar
        value={campaign.currentAmount}
        max={campaign.targetAmount}
        color={percentage >= 100 ? 'success' : 'primary'}
        className="mb-2"
      />
      
      <div className="flex justify-between text-sm mb-3">
        <span className="font-semibold text-secondary-900">
          {formatCurrency(campaign.currentAmount)}
        </span>
        <span className="text-primary-600 font-semibold">{percentage}%</span>
      </div>
      
      <div className="flex justify-between text-xs text-secondary-600 pt-3 border-t border-secondary-200">
        <span>{campaign.donorCount} donors</span>
        <span>Ends {formatDate(campaign.endDate)}</span>
      </div>
    </Card>
  );
};

export default CampaignCard;
