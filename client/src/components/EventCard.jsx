// Volunteer Event Card Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate, formatDateTime } from '../../utils/helpers';

const EventCard = ({ event, showRegister = true }) => {
  const navigate = useNavigate();
  const spotsRemaining = event.volunteersNeeded - event.volunteersRegistered;

  return (
    <Card padding="md" className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-secondary-900 flex-1">
          {event.title}
        </h3>
        <Badge variant={event.status || 'upcoming'} size="sm">
          {event.status}
        </Badge>
      </div>
      
      <p className="text-secondary-700 text-sm mb-4 line-clamp-3">
        {event.description}
      </p>
      
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-secondary-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDateTime(event.date)}
        </div>
        
        <div className="flex items-center gap-2 text-secondary-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location}
        </div>
        
        <div className="flex items-center gap-2 text-secondary-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {event.volunteersRegistered} / {event.volunteersNeeded} volunteers
        </div>
      </div>
      
      {spotsRemaining > 0 && spotsRemaining <= 5 && (
        <p className="text-sm text-warning-600 font-medium mb-3">
          Only {spotsRemaining} spots remaining!
        </p>
      )}
      
      {showRegister && event.status === 'upcoming' && (
        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="mt-auto"
          onClick={() => navigate(`/volunteer/event/${event.id}`)}
        >
          {spotsRemaining > 0 ? 'Register' : 'Join Waitlist'}
        </Button>
      )}
    </Card>
  );
};

export default EventCard;
