// Dashboard Page - Admin Overview with Metrics and Charts
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Card } from '../../components/ui';
import {
    selectDashboardStats,
    selectMonthlyDonations,
    selectUsersByRole,
    selectRecentActivity,
    fetchDashboardStats,
} from '../../store/adminSlice';
import { selectPendingRequestsCount, fetchRequests } from '../../store/requestsSlice';
import { selectActiveCampaignsCount, fetchCampaigns } from '../../store/campaignsSlice';
import { fetchDonations, selectDonations } from '../../store/donationsSlice';
import { formatCurrency } from '../../utils/helpers';

// Chart colors matching theme
const COLORS = {
    primary: '#0ea5e9',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    accent: '#d946ef',
    secondary: '#334155',
};

const ROLE_COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#d946ef'];

const DashboardPage = () => {
    const dispatch = useDispatch();

    // Get data from Redux store
    const dashboardStats = useSelector(selectDashboardStats);
    const monthlyDonations = useSelector(selectMonthlyDonations);
    const usersByRole = useSelector(selectUsersByRole);
    const recentActivity = useSelector(selectRecentActivity);
    const pendingRequests = useSelector(selectPendingRequestsCount);
    const activeCampaigns = useSelector(selectActiveCampaignsCount);
    const donations = useSelector(selectDonations);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchCampaigns());
        dispatch(fetchDonations());
        dispatch(fetchRequests());
    }, [dispatch]);

    // Helper function for time ago
    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    };

    // Generate recent activity from real donations
    const generatedActivity = React.useMemo(() => {
        if (!Array.isArray(donations) || donations.length === 0) return [];

        return [...donations]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8)
            .map(donation => {
                const donorName = donation.donor?.name || 'Anonymous';
                const amount = formatCurrency(donation.amount || 0);
                const campaignTitle = donation.campaign?.title || 'General Donation';
                const timeAgo = getTimeAgo(new Date(donation.createdAt));

                return {
                    type: 'donation',
                    description: `${donorName} donated ${amount} to ${campaignTitle}`,
                    time: timeAgo,
                };
            });
    }, [donations]);

    // Use generated activity or fallback to Redux recentActivity
    const displayActivity = generatedActivity.length > 0 ? generatedActivity : recentActivity;

    // Metric cards data
    const metrics = [
        {
            label: 'Total Users',
            value: dashboardStats?.totalUsers?.toLocaleString() || '0',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'primary',
        },
        {
            label: 'Total Donations',
            value: `$${dashboardStats?.totalDonations?.toLocaleString() || '0'}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'success',
        },
        {
            label: 'Pending Requests',
            value: pendingRequests.toString(),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: 'warning',
        },
        {
            label: 'Active Campaigns',
            value: activeCampaigns.toString(),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            color: 'accent',
        },
    ];

    // Transform usersByRole for pie chart
    const roleData = Object.entries(usersByRole).map(([role, count]) => ({
        name: role,
        value: count,
    }));

    // Activity icon component
    const getActivityIcon = (type) => {
        switch (type) {
            case 'donation':
                return (
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                        </svg>
                    </div>
                );
            case 'campaign':
                return (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6" />
                        </svg>
                    </div>
                );
            case 'verification':
                return (
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-secondary-900 font-heading">Dashboard</h1>
                <p className="text-secondary-700 mt-1">Welcome back! Here's your platform overview.</p>
            </div>

            {/* Metrics Grid - 2x2 on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <Card key={index} className="relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary-700">{metric.label}</p>
                                <p className="text-2xl font-bold text-secondary-900 mt-1">{metric.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                                <span className={`text-${metric.color}-600`}>{metric.icon}</span>
                            </div>
                        </div>
                        {/* Decorative gradient */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600`}></div>
                    </Card>
                ))}
            </div>

            {/* Charts Row - 2 columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Trends Chart */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-secondary-900">Donation Trends</h2>
                            <span className="text-sm text-secondary-700">Last 12 months</span>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
                            {Array.isArray(monthlyDonations) && monthlyDonations.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyDonations}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: '#334155' }}
                                            axisLine={{ stroke: '#e2e8f0' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#334155' }}
                                            axisLine={{ stroke: '#e2e8f0' }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            }}
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Donations']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke={COLORS.primary}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorAmount)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-sm text-secondary-500">
                                    No donation data available
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                {/* Monthly Comparison Bar Chart */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-secondary-900">Monthly Comparison</h2>
                            <span className="text-sm text-secondary-700">This year</span>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
                            {Array.isArray(monthlyDonations) && monthlyDonations.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyDonations}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            axisLine={{ stroke: '#e2e8f0' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            axisLine={{ stroke: '#e2e8f0' }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            }}
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Donations']}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            fill={COLORS.primary}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-sm text-secondary-500">
                                    No donation comparison data available
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Bottom Row - Users by Role & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users by Role Pie Chart */}
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Users by Role</h2>
                    </Card.Header>
                    <Card.Body>
                        <div className="w-full" style={{ height: '300px', minWidth: 0 }}>
                            {Array.isArray(roleData) && roleData.length > 0 ? (
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
                                        >
                                            {roleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
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
                            ) : (
                                <div className="h-full flex items-center justify-center text-sm text-secondary-500">
                                    No user role data available
                                </div>
                            )}
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {roleData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }}
                                    />
                                    <span className="text-sm text-secondary-600">{entry.name}</span>
                                    <span className="text-sm font-medium text-secondary-900">
                                        {typeof entry.value === 'object' ? JSON.stringify(entry.value) : entry.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
                            <a href="/reports" className="text-sm text-primary-600 hover:text-primary-700">
                                View all
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {Array.isArray(displayActivity) && displayActivity.length > 0 ? (
                                displayActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
                                    >
                                        {getActivityIcon(activity.type)}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-secondary-900">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-secondary-700">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-secondary-500 p-4 text-center">No recent activity found.</p>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
