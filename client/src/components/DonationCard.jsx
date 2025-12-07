// Donation History Card Component
import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const DonationCard = ({ donation }) => {
  return (
    <Card padding="md" className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-secondary-900 mb-1">
            {donation.requestTitle}
          </h4>
          <p className="text-sm text-secondary-600 mb-2">
            Transaction ID: {donation.transactionId}
          </p>
          {donation.message && (
            <p className="text-sm text-secondary-700 italic mb-2">
              "{donation.message}"
            </p>
          )}
          <p className="text-xs text-secondary-500">
            {formatDateTime(donation.createdAt)}
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xl font-bold text-success-600">
            {formatCurrency(donation.amount)}
          </p>
          <Badge variant={donation.status} size="sm">
            {donation.status}
          </Badge>
          {donation.anonymous && (
            <Badge variant="secondary" size="sm">Anonymous</Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DonationCard;
