import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiSearch,
  HiPlus,
  HiEye,
  HiTrash,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiExclamation,
  HiX
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../components/ui/Toast';
import {
  fetchMyRequests,
  deleteRequest,
  selectNgoRequests,
  selectNgoLoading
} from '../../store/ngoSlice';

const ManageRequests = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const requests = useSelector(selectNgoRequests);
  const loading = useSelector(selectNgoLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyRequests());
  }, [dispatch]);

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!requestToDelete) return;
    
    setDeleting(true);
    try {
      await dispatch(deleteRequest(requestToDelete.id)).unwrap();
      toast.success(`Request "${requestToDelete.title}" deleted successfully`);
      setDeleteModalOpen(false);
      setRequestToDelete(null);
    } catch (error) {
      toast.error(error || 'Failed to delete request');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setRequestToDelete(null);
  };

  const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Fulfilled'];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' ||
      (request.status && request.status.toLowerCase() === selectedStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const s = status ? status.toUpperCase() : 'PENDING';
    const styles = {
      APPROVED: 'bg-success-100 text-success-700',
      PENDING: 'bg-warning-100 text-warning-700',
      REJECTED: 'bg-error-100 text-error-700',
      FULFILLED: 'bg-primary-100 text-primary-700',
      CLOSED: 'bg-secondary-100 text-secondary-700'
    };
    return styles[s] || styles.PENDING;
  };

  const getStatusIcon = (status) => {
    const s = status ? status.toUpperCase() : 'PENDING';
    switch (s) {
      case 'APPROVED':
      case 'FULFILLED':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <HiClock className="w-4 h-4" />;
      case 'REJECTED':
        return <HiXCircle className="w-4 h-4" />;
      default:
        return <HiExclamation className="w-4 h-4" />;
    }
  };

  const getUrgencyBadge = (urgency) => {
    const u = urgency ? urgency.toUpperCase() : 'MEDIUM';
    const styles = {
      CRITICAL: 'bg-error-100 text-error-700',
      HIGH: 'bg-warning-100 text-warning-700',
      MEDIUM: 'bg-primary-100 text-primary-700',
      LOW: 'bg-secondary-100 text-secondary-700'
    };
    return styles[u] || styles.MEDIUM;
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => !r.status || r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
    fulfilled: requests.filter(r => r.status === 'FULFILLED').length
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-secondary-50 flex items-center justify-center">
        <p className="text-secondary-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Manage Requests</h1>
            <p className="mt-1 text-secondary-600">View and track your donation requests</p>
          </div>
          <Link to="/ngo/requests/new">
            <PrimaryButton>
              <HiPlus className="w-5 h-5" />
              Create Request
            </PrimaryButton>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-5">
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total</p>
              <p className="mt-1 text-2xl font-bold text-secondary-900">{stats.total}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-warning-500">
            <div className="text-center">
              <p className="text-sm text-warning-600">Pending</p>
              <p className="mt-1 text-2xl font-bold text-warning-700">{stats.pending}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-success-500">
            <div className="text-center">
              <p className="text-sm text-success-600">Approved</p>
              <p className="mt-1 text-2xl font-bold text-success-700">{stats.approved}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-error-500">
            <div className="text-center">
              <p className="text-sm text-error-600">Rejected</p>
              <p className="mt-1 text-2xl font-bold text-error-700">{stats.rejected}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-primary-500">
            <div className="text-center">
              <p className="text-sm text-primary-600">Fulfilled</p>
              <p className="mt-1 text-2xl font-bold text-primary-700">{stats.fulfilled}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            <div className="relative">
              <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      status.toLowerCase() === selectedStatus
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <Card key={request.id} padding="none" hoverable className="overflow-hidden">
              {/* Request Image */}
              {request.media && request.media.length > 0 ? (
                <div className="relative h-40 bg-secondary-100">
                  <img 
                    src={request.media[0]} 
                    alt={request.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status || 'PENDING'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBadge(request.urgency)}`}>
                      {request.urgency || 'MEDIUM'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-300">
                    {request.title?.charAt(0)?.toUpperCase() || 'R'}
                  </span>
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status || 'PENDING'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBadge(request.urgency)}`}>
                      {request.urgency || 'MEDIUM'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold text-secondary-900 line-clamp-2">{request.title}</h3>
                <p className="text-sm text-secondary-600 line-clamp-2 mb-3">{request.description}</p>

                <div className="mb-4">
                  <ProgressBar
                    value={Number(request.currentAmount || 0)}
                    max={Number(request.targetAmount || 1)}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-secondary-900">{formatCurrency(Number(request.currentAmount || 0))}</span>
                    <span className="text-secondary-600">of {formatCurrency(Number(request.targetAmount || 0))}</span>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-xs text-secondary-600">
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="font-medium text-secondary-900">{request.category?.name || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="font-medium text-secondary-900">{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-secondary-200">
                  <button 
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center justify-center flex-1 gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50"
                  >
                    <HiEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteClick(request)}
                    className="p-2 transition-colors rounded-lg text-error-600 hover:bg-error-50"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No requests found.</p>
            <p className="mt-2 text-sm text-secondary-500">Try adjusting your filters or create a new request.</p>
            <Link to="/ngo/requests/new" className="inline-block mt-4">
              <PrimaryButton>
                <HiPlus className="w-5 h-5" />
                Create Request
              </PrimaryButton>
            </Link>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-500/20"
          onClick={(e) => e.target === e.currentTarget && setSelectedRequest(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-secondary-200">
              <div>
                <h2 className="text-xl font-bold text-secondary-900">{selectedRequest.title}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status || 'PENDING'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBadge(selectedRequest.urgency)}`}>
                    {selectedRequest.urgency || 'MEDIUM'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-secondary-700 mb-2">Description</h3>
                <p className="text-secondary-600">{selectedRequest.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-secondary-700 mb-2">Funding Progress</h3>
                <ProgressBar
                  value={Number(selectedRequest.currentAmount || 0)}
                  max={Number(selectedRequest.targetAmount || 1)}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-primary-600">{formatCurrency(Number(selectedRequest.currentAmount || 0))} raised</span>
                  <span className="text-secondary-600">of {formatCurrency(Number(selectedRequest.targetAmount || 0))} goal</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500">Category</p>
                  <p className="font-medium text-secondary-900">{selectedRequest.category?.name || 'General'}</p>
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500">Created</p>
                  <p className="font-medium text-secondary-900">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedRequest.location?.address && (
                  <div className="col-span-2 p-3 bg-secondary-50 rounded-lg">
                    <p className="text-xs text-secondary-500">Location</p>
                    <p className="font-medium text-secondary-900">{selectedRequest.location.address}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-secondary-200">
              <SecondaryButton onClick={() => setSelectedRequest(null)} className="w-full">
                Close
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-500/20"
          onClick={(e) => e.target === e.currentTarget && handleCancelDelete()}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-error-100">
                <HiExclamation className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-bold text-center text-secondary-900">Delete Request</h3>
              <p className="mt-2 text-center text-secondary-600">
                Are you sure you want to delete <strong>"{requestToDelete?.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-secondary-200">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-error-600 hover:bg-error-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
