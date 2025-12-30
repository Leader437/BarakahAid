// Reports Page - Analytics and PDF Export
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
} from 'recharts';
import { jsPDF } from 'jspdf';
import { Card, Button, Badge } from '../../components/ui';
import { selectDashboardStats, selectMonthlyDonations, selectUsersByRole, fetchDashboardStats } from '../../store/adminSlice';
import { selectDonationsStats, selectDonations, fetchDonations } from '../../store/donationsSlice';
import { selectUsers, fetchUsers } from '../../store/usersSlice';
import { selectCampaigns, fetchCampaigns } from '../../store/campaignsSlice';
import { selectRequests, fetchRequests } from '../../store/requestsSlice';
import { formatCurrency } from '../../utils/helpers';

// Chart colors
const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#d946ef', '#64748b'];



const ReportsPage = () => {
    const dispatch = useDispatch();

    // Redux data
    const dashboardStats = useSelector(selectDashboardStats);
    const monthlyDonations = useSelector(selectMonthlyDonations);
    const usersByRole = useSelector(selectUsersByRole);
    const donationsStats = useSelector(selectDonationsStats);
    const donations = useSelector(selectDonations);
    const users = useSelector(selectUsers);
    const campaigns = useSelector(selectCampaigns);
    const requests = useSelector(selectRequests);

    useEffect(() => {
        // Fetch all required data for reports
        dispatch(fetchDashboardStats());
        dispatch(fetchUsers());
        dispatch(fetchDonations());
        dispatch(fetchCampaigns());
        dispatch(fetchRequests());
    }, [dispatch]);

    // Local state
    const [reportType, setReportType] = useState('donations');
    const [dateRange, setDateRange] = useState('month');
    const [category, setCategory] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);

    // Calculated KPIs from real data
    const verifiedNGOs = users.filter((u) => u.role === 'NGO' && u.verificationStatus === 'VERIFIED').length;
    const activeUsers = users.filter((u) => !u.isBlocked && !u.isSuspended).length;
    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
    const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

    // Calculate donation stats from actual donations array
    const completedDonations = donations.filter((d) => d.status === 'COMPLETED').length;
    const totalDonationAmount = donations
        .filter((d) => d.status === 'COMPLETED')
        .reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const avgDonation = completedDonations > 0 ? totalDonationAmount / completedDonations : 0;

    // Transform data for pie chart
    const roleData = Object.entries(usersByRole).map(([role, count]) => ({
        name: role,
        value: count,
    }));

    // Category distribution - computed from real campaign data
    const categoryData = React.useMemo(() => {
        // Group campaigns by category and sum their raised amounts
        const categoryMap = {};
        campaigns.forEach(campaign => {
            const categoryName = campaign.category?.name || campaign.category || 'General';
            const amount = Number(campaign.raisedAmount || 0);
            if (categoryMap[categoryName]) {
                categoryMap[categoryName] += amount;
            } else {
                categoryMap[categoryName] = amount;
            }
        });

        // Convert to array format for chart
        const data = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

        // If no data, return some placeholder categories with 0
        if (data.length === 0) {
            return [
                { name: 'No campaign data', value: 1 }
            ];
        }
        return data;
    }, [campaigns]);

    // Generate PDF Report
    const generatePDF = useCallback(() => {
        setIsGenerating(true);

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(14, 165, 233);
        doc.text('BarakahAid', 20, 25);

        doc.setFontSize(16);
        doc.setTextColor(100, 116, 139);
        doc.text('Analytics Report', 20, 35);

        // Report info
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
        doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 20, 52);
        doc.text(`Date Range: ${dateRange}`, 20, 59);

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 65, pageWidth - 20, 65);

        // KPI Section
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text('Key Performance Indicators', 20, 78);

        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);

        const kpis = [
            ['Total Donations', formatCurrency(dashboardStats.totalDonations)],
            ['Active Users', activeUsers.toString()],
            ['Verified NGOs', verifiedNGOs.toString()],
            ['Active Campaigns', activeCampaigns.toString()],
            ['Pending Requests', dashboardStats.pendingRequests.toString()],
        ];

        let yPos = 90;
        kpis.forEach(([label, value]) => {
            doc.setTextColor(100, 116, 139);
            doc.text(label + ':', 20, yPos);
            doc.setTextColor(15, 23, 42);
            doc.text(value, 80, yPos);
            yPos += 8;
        });

        // Monthly Donations Table
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text('Monthly Donations Summary', 20, yPos);

        yPos += 10;
        doc.setFontSize(10);

        // Table header
        doc.setFillColor(248, 250, 252);
        doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
        doc.setTextColor(71, 85, 105);
        doc.text('Month', 25, yPos);
        doc.text('Amount', 80, yPos);

        yPos += 8;

        // Table rows
        monthlyDonations.slice(0, 6).forEach((item) => {
            doc.setTextColor(71, 85, 105);
            doc.text(item.month, 25, yPos);
            doc.text(formatCurrency(item.amount), 80, yPos);
            yPos += 7;
        });

        // Users by Role
        yPos += 15;
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text('Users by Role', 20, yPos);

        yPos += 10;
        doc.setFontSize(10);

        Object.entries(usersByRole).forEach(([role, count]) => {
            doc.setTextColor(71, 85, 105);
            doc.text(role, 25, yPos);
            doc.text(count.toString(), 80, yPos);
            yPos += 7;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
            'This report was automatically generated by BarakahAid Admin Panel',
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );

        // Save PDF
        doc.save(`barakahaid-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
        setIsGenerating(false);
    }, [reportType, dateRange, dashboardStats, activeUsers, verifiedNGOs, activeCampaigns, monthlyDonations, usersByRole]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Reports & Analytics</h1>
                    <p className="text-secondary-700 mt-1">
                        Generate and export platform analytics reports
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={generatePDF}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export to PDF
                        </>
                    )}
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Total Donations</p>
                        <p className="text-2xl font-bold text-secondary-900">{formatCurrency(dashboardStats.totalDonations)}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Active Users</p>
                        <p className="text-2xl font-bold text-secondary-900">{activeUsers}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Verified NGOs</p>
                        <p className="text-2xl font-bold text-secondary-900">{verifiedNGOs}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Active Campaigns</p>
                        <p className="text-2xl font-bold text-secondary-900">{activeCampaigns}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Pending Requests</p>
                        <p className="text-2xl font-bold text-secondary-900">{pendingRequestsCount}</p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Report Type */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-secondary-900 mb-2">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="donations">Donations Report</option>
                            <option value="users">Users Report</option>
                            <option value="campaigns">Campaigns Report</option>
                            <option value="requests">Requests Report</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-secondary-900 mb-2">Date Range</label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="quarter">Last 3 Months</option>
                            <option value="year">Last 12 Months</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-secondary-900 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="education">Education</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="food">Food</option>
                            <option value="shelter">Shelter</option>
                            <option value="disaster">Disaster Relief</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Donations Bar Chart */}
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Monthly Donations</h2>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyDonations}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#334155' }} />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#334155' }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [formatCurrency(value), 'Donations']}
                                    />
                                    <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>

                {/* Users by Role Pie Chart */}
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Users by Role</h2>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {roleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>

                {/* Donations by Category */}
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Donations by Category</h2>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name }) => name}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [formatCurrency(value), 'Donations']}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>

                {/* Donation Trend Line Chart */}
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Donation Trend</h2>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyDonations}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#334155' }} />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#334155' }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [formatCurrency(value), 'Donations']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ fill: '#22c55e', strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Summary Statistics */}
            <Card>
                <Card.Header>
                    <h2 className="text-lg font-semibold text-secondary-900">Summary Statistics</h2>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <p className="text-3xl font-bold text-primary-600">{users.length}</p>
                            <p className="text-sm text-secondary-600 mt-1">Total Users</p>
                        </div>
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <p className="text-3xl font-bold text-success-600">{completedDonations}</p>
                            <p className="text-sm text-secondary-600 mt-1">Completed Donations</p>
                        </div>
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <p className="text-3xl font-bold text-accent-600">{campaigns.length}</p>
                            <p className="text-sm text-secondary-600 mt-1">Total Campaigns</p>
                        </div>
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <p className="text-3xl font-bold text-warning-600">
                                {formatCurrency(avgDonation)}
                            </p>
                            <p className="text-sm text-secondary-600 mt-1">Avg. Donation</p>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ReportsPage;
