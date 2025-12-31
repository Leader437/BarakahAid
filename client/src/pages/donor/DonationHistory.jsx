import React, { useState, useEffect } from 'react';
import { HiDownload, HiEye, HiClock, HiCheckCircle, HiXCircle, HiSearch, HiFilter } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonations } from '../../store/donationsSlice';
import { formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';

const DonationHistory = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const donations = useSelector((state) => state.donations.donations);
  const loading = useSelector((state) => state.donations.loading);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const handleExport = async () => {
    try {
      const year = new Date().getFullYear();
      const response = await api.get(`/transactions/reports/yearly?year=${year}`, {
        responseType: 'blob',
      });

      if (response.data.type === 'application/json' && response.data.size < 1000) {
          const text = await response.data.text();
          try {
            const error = JSON.parse(text);
            throw new Error(error.message || 'Server error');
          } catch (e) {
            // Not JSON or parse failed
          }
      }

      if (response.data.size === 0) {
        throw new Error('Received an empty file from server');
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `donations-report-${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      const isNetworkError = error.message === 'Network Error';
      const errorMessage = error.response?.data?.message || error.message;

      if (isNetworkError) {
        return; 
      }

      if (error.message !== 'canceled') {
        toast.error(`Failed to export donation history: ${errorMessage}`);
      }
    }
  };

  const handleDownloadReceipt = async (transactionId) => {
    try {
      const response = await api.get(`/transactions/${transactionId}/receipt`, {
        responseType: 'blob',
      });

      if (response.data.type === 'application/json' && response.data.size < 1000) {
          const text = await response.data.text();
          try {
            const error = JSON.parse(text);
            throw new Error(error.message || 'Server error');
          } catch (e) {
            // Not JSON or parse failed
          }
      }

      if (response.data.size === 0) {
        throw new Error('Received an empty file from server');
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      const isNetworkError = error.message === 'Network Error';
      const errorMessage = error.response?.data?.message || error.message;

      if (isNetworkError) {
        return; 
      }

      if (error.message !== 'canceled') {
        toast.error(`Failed to download receipt: ${errorMessage}`);
      }
    }
  };

  const getStatusBadge = (status) => {
    // ... existing logic but handle lowercase
    const normalizedStatus = status ? status.toLowerCase() : 'unknown';
    const styles = {
      completed: 'bg-success-100 text-success-700',
      processing: 'bg-warning-100 text-warning-700',
      pending: 'bg-warning-100 text-warning-700',
      recurring: 'bg-primary-100 text-primary-700',
      failed: 'bg-error-100 text-error-700'
    };

    const icons = {
      completed: <HiCheckCircle className="w-4 h-4" />,
      processing: <HiClock className="w-4 h-4" />,
      pending: <HiClock className="w-4 h-4" />,
      recurring: <HiClock className="w-4 h-4" />,
      failed: <HiXCircle className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${styles[normalizedStatus] || styles.processing}`}>
        {icons[normalizedStatus] || icons.processing}
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </span>
    );
  };

  const safeDonations = Array.isArray(donations) ? donations : [];

  const filteredDonations = safeDonations.filter(donation => {
    if (filter !== 'all' && donation.status !== filter) return false;
    if (searchQuery && !donation.campaignName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalDonated = safeDonations
    .filter(d => d.status === 'completed' || d.status === 'recurring')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDonations = safeDonations.filter(d => d.status === 'completed' || d.status === 'recurring').length;

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Donation History</h1>
            <p className="mt-1 text-secondary-600">
              Track all your contributions and their impact
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card padding="lg">
              <div className="text-center">
                <p className="mb-1 text-sm text-secondary-600">Total Donated</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalDonated)}</p>
              </div>
            </Card>
            <Card padding="lg">
              <div className="text-center">
                <p className="mb-1 text-sm text-secondary-600">Total Donations</p>
                <p className="text-2xl font-bold text-success-600">{totalDonations}</p>
              </div>
            </Card>
            <Card padding="lg">
              <div className="text-center">
                <p className="mb-1 text-sm text-secondary-600">This Month</p>
                <p className="text-2xl font-bold text-accent-600">{formatCurrency(650)}</p>
              </div>
            </Card>
            <Card padding="lg">
              <div className="text-center">
                <p className="mb-1 text-sm text-secondary-600">Recurring</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {donations.filter(d => d.status === 'recurring').length}
                </p>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card padding="lg">
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed'
                    ? 'bg-success-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter('processing')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'processing'
                    ? 'bg-warning-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => setFilter('recurring')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'recurring'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                >
                  Recurring
                </button>
              </div>

              {/* Download Button */}
              <SecondaryButton className="whitespace-nowrap" onClick={handleExport}>
                <HiDownload className="w-4 h-4 mr-2" />
                Export
              </SecondaryButton>
            </div>
          </Card>

          {/* Donations List - Card View for Mobile, Table for Desktop */}
          <div className="space-y-3 md:hidden">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} padding="md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-secondary-500">{donation.id}</p>
                      <p className="mt-1 text-sm font-semibold text-secondary-900">{donation.campaignName}</p>
                      <p className="text-xs text-secondary-600">{donation.category}</p>
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>
                  <div className="pt-2 border-t border-secondary-100">
                    <p className="text-xs text-secondary-600">{donation.impact}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-secondary-900">{formatCurrency(donation.amount)}</p>
                      <div className="flex gap-2">
                        <button className="p-1.5 transition-colors text-primary-600 hover:text-primary-700" title="View Details">
                          <HiEye className="w-5 h-5" />
                        </button>
                        {donation.taxReceiptId && (
                          <button 
                            className="p-1.5 transition-colors text-success-600 hover:text-success-700" 
                            title="Download Receipt"
                            onClick={() => handleDownloadReceipt(donation.id)}
                          >
                            <HiDownload className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-secondary-600">
                      <span className="font-medium">Date:</span> {new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Donations Table - Desktop Only */}
          <div className="hidden md:block">
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-secondary-50 border-secondary-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                        ID
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                        Campaign
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                        Category
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {filteredDonations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-secondary-50">
                        <td className="px-4 py-3 text-sm font-medium text-secondary-900">
                          {donation.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-900">
                          <div className="max-w-[200px]">
                            <div className="font-medium truncate">{donation.campaignName}</div>
                            <div className="text-xs truncate text-secondary-500">{donation.impact}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-600">
                          <div className="max-w-[120px] truncate">{donation.category}</div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-secondary-900">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-600">
                          {new Date(donation.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(donation.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {filteredDonations.length === 0 && (
            <Card padding="lg">
              <div className="py-8 text-center">
                <p className="text-secondary-600">No donations found matching your criteria.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
