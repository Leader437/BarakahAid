// Donations List Page - Donation Management Table
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge } from '../../components/ui';
import {
    selectFilteredDonations,
    selectDonationsFilters,
    selectDonationsStats,
    setFilters,
} from '../../store/donationsSlice';
import usePagination from '../../hooks/usePagination';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const DonationsList = () => {
    const dispatch = useDispatch();
    const donations = useSelector(selectFilteredDonations);
    const filters = useSelector(selectDonationsFilters);
    const stats = useSelector(selectDonationsStats);

    // Pagination
    const {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
        startIndex,
        endIndex,
        totalItems,
    } = usePagination(donations, 10);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    // Handle search
    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Transaction ID', 'Donor', 'Email', 'Campaign', 'Amount', 'Status', 'Payment Method', 'Date'];
        const csvData = donations.map((d) => [
            d.transactionId,
            d.donor?.name || 'Anonymous',
            d.donor?.email || 'N/A',
            d.campaign?.title || 'General',
            d.amount,
            d.status,
            d.paymentGateway,
            d.createdAt,
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `donations-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'FAILED':
                return 'danger';
            case 'REFUNDED':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Donations</h1>
                    <p className="text-secondary-700 mt-1">
                        Track and manage all platform donations ({totalItems} total)
                    </p>
                </div>
                <Button variant="outline" onClick={exportToCSV}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Total Amount</p>
                        <p className="text-2xl font-bold text-secondary-900">{formatCurrency(stats.totalAmount)}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Completed</p>
                        <p className="text-2xl font-bold text-secondary-900">{stats.completed}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-secondary-900">{stats.pending}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Total Donations</p>
                        <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
                    </div>
                </Card>
            </div>

            {/* Filters Card */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by donor name, campaign, or transaction ID..."
                                value={filters.search}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full lg:w-48">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="w-full lg:w-48">
                        <select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Donations Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 border-b border-secondary-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Donor</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Campaign</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-secondary-700">
                                        No donations found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-secondary-50 transition-colors">
                                        {/* Donor */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-success-700 font-semibold text-sm">
                                                        {donation.donor?.name
                                                            ? donation.donor.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                                                            : 'AN'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-secondary-900">
                                                        {donation.donor?.name || 'Anonymous'}
                                                    </p>
                                                    <p className="text-xs text-secondary-600">
                                                        {donation.donor?.email || 'No email'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Campaign */}
                                        <td className="px-6 py-4">
                                            <p className="text-secondary-900 font-medium line-clamp-1">
                                                {donation.campaign?.title || 'General Donation'}
                                            </p>
                                            <p className="text-xs text-secondary-600">{donation.paymentGateway}</p>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-success-600">{formatCurrency(donation.amount)}</p>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-secondary-800">
                                            {formatDateTime(donation.createdAt)}
                                        </td>

                                        {/* Status */}
                                        < td className="px-6 py-4" >
                                            <Badge variant={getStatusVariant(donation.status)} size="sm">
                                                {donation.status}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/donations/${donation.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {
                    totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
                            <p className="text-sm text-secondary-700">
                                Showing {startIndex} to {endIndex} of {totalItems} donations
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={prevPage} disabled={!hasPrevPage}>
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                    ? 'bg-primary-600 text-white'
                                                    : 'text-secondary-700 hover:bg-secondary-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button variant="outline" size="sm" onClick={nextPage} disabled={!hasNextPage}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )
                }
            </Card >
        </div >
    );
};

export default DonationsList;
