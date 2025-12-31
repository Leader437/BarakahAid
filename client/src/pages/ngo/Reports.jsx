import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import { useToast } from '../../components/ui/Toast';
import {
    HiArrowLeft,
    HiDownload,
    HiTrendingUp,
    HiCash,
    HiUserGroup,
    HiChartBar,
    HiGlobeAlt,
    HiCheckCircle,
    HiClock,
    HiDocumentReport
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import SecondaryButton from '../../components/ui/SecondaryButton';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { formatCurrency } from '../../utils/helpers';
import {
    fetchMyCampaigns,
    fetchNgoDonations,
    selectMyCampaigns,
    selectNgoDonations,
} from '../../store/ngoSlice';

const Reports = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const campaigns = useSelector(selectMyCampaigns);
    const donations = useSelector(selectNgoDonations);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        dispatch(fetchMyCampaigns());
        dispatch(fetchNgoDonations());
    }, [dispatch]);

    // Calculate stats
    const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE' || !c.status).length;
    const uniqueDonors = new Set(donations.map(d => d.donor?.id)).size;
    const avgDonation = donations.length > 0 ? totalRaised / donations.length : 0;

    // Get top campaigns by raised amount
    const topCampaigns = [...campaigns]
        .sort((a, b) => Number(b.raisedAmount || 0) - Number(a.raisedAmount || 0))
        .slice(0, 5);

    // Get recent donations
    const recentDonations = [...donations]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // Monthly breakdown (simulated based on donations)
    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const data = [];

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthDonations = donations.filter(d => {
                const donDate = new Date(d.createdAt);
                return donDate.getMonth() === monthIndex;
            });
            const amount = monthDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
            data.push({ month: months[monthIndex], amount, count: monthDonations.length });
        }
        return data;
    };

    const monthlyData = getMonthlyData();
    const maxMonthly = Math.max(...monthlyData.map(d => d.amount), 1);

    // Export CSV function
    const handleExportCSV = () => {
        setExporting(true);
        try {
            // Create CSV content
            let csvContent = 'data:text/csv;charset=utf-8,';
            
            // Summary section
            csvContent += 'REPORT SUMMARY\n';
            csvContent += `Generated,${new Date().toLocaleDateString()}\n`;
            csvContent += `Total Raised,${totalRaised}\n`;
            csvContent += `Active Campaigns,${activeCampaigns}\n`;
            csvContent += `Unique Donors,${uniqueDonors}\n`;
            csvContent += `Average Donation,${avgDonation.toFixed(2)}\n\n`;
            
            // Campaigns section
            csvContent += 'CAMPAIGNS\n';
            csvContent += 'Title,Goal Amount,Raised Amount,Progress %,Status\n';
            campaigns.forEach(c => {
                const progress = c.goalAmount ? ((Number(c.raisedAmount || 0) / Number(c.goalAmount)) * 100).toFixed(1) : 0;
                csvContent += `"${c.title}",${c.goalAmount || 0},${c.raisedAmount || 0},${progress}%,${c.status || 'ACTIVE'}\n`;
            });
            
            csvContent += '\nDONATIONS\n';
            csvContent += 'Date,Donor,Campaign,Amount,Status\n';
            donations.forEach(d => {
                const date = new Date(d.createdAt).toLocaleDateString();
                csvContent += `${date},"${d.donor?.name || 'Anonymous'}","${d.campaign?.title || 'N/A'}",${d.amount},${d.status || 'COMPLETED'}\n`;
            });
            
            csvContent += '\nMONTHLY BREAKDOWN\n';
            csvContent += 'Month,Amount,Donations Count\n';
            monthlyData.forEach(m => {
                csvContent += `${m.month},${m.amount},${m.count}\n`;
            });
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `ngo-report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('CSV Export failed:', error);
            toast.error('Failed to generate CSV report');
        } finally {
            setExporting(false);
        }
    };

    // Generate PDF function
    const handleGeneratePDF = () => {
        setExporting(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            
            // Header
            doc.setFontSize(22);
            doc.setTextColor(16, 185, 129);
            doc.text('BarakahAid', pageWidth / 2, 20, { align: 'center' });
            
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('NGO Analytics Report', pageWidth / 2, 30, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 38, { align: 'center' });
            
            // Summary Box
            doc.setFillColor(243, 244, 246);
            doc.rect(15, 45, pageWidth - 30, 35, 'F');
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Summary', 20, 55);
            
            doc.setFontSize(10);
            doc.text(`Total Raised: ${formatCurrency(totalRaised)}`, 20, 65);
            doc.text(`Active Campaigns: ${activeCampaigns}`, 20, 72);
            doc.text(`Unique Donors: ${uniqueDonors}`, 110, 65);
            doc.text(`Avg. Donation: ${formatCurrency(avgDonation)}`, 110, 72);
            
            // Top Campaigns Table
            let yPos = 95;
            doc.setFontSize(12);
            doc.text('Top Campaigns', 15, yPos);
            yPos += 10;
            
            // Table header
            doc.setFillColor(229, 231, 235);
            doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            doc.text('Campaign', 17, yPos);
            doc.text('Raised', 120, yPos);
            doc.text('Goal', 150, yPos);
            doc.text('Progress', 175, yPos);
            
            yPos += 10;
            doc.setTextColor(0, 0, 0);
            
            topCampaigns.forEach((c, i) => {
                if (i % 2 === 0) {
                    doc.setFillColor(249, 250, 251);
                    doc.rect(15, yPos - 4, pageWidth - 30, 7, 'F');
                }
                
                const progress = c.goalAmount ? ((Number(c.raisedAmount || 0) / Number(c.goalAmount)) * 100).toFixed(0) : 0;
                doc.setFontSize(8);
                doc.text(c.title.substring(0, 40), 17, yPos);
                doc.text(formatCurrency(c.raisedAmount || 0), 120, yPos);
                doc.text(formatCurrency(c.goalAmount || 0), 150, yPos);
                doc.text(`${progress}%`, 175, yPos);
                yPos += 8;
            });
            
            // Monthly Trends
            yPos += 15;
            doc.setFontSize(12);
            doc.text('Monthly Donation Trends', 15, yPos);
            yPos += 10;
            
            doc.setFillColor(229, 231, 235);
            doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            doc.text('Month', 17, yPos);
            doc.text('Amount', 80, yPos);
            doc.text('Donations', 130, yPos);
            
            yPos += 10;
            doc.setTextColor(0, 0, 0);
            
            monthlyData.forEach((m, i) => {
                if (i % 2 === 0) {
                    doc.setFillColor(249, 250, 251);
                    doc.rect(15, yPos - 4, pageWidth - 30, 7, 'F');
                }
                doc.setFontSize(8);
                doc.text(m.month, 17, yPos);
                doc.text(formatCurrency(m.amount), 80, yPos);
                doc.text(String(m.count), 130, yPos);
                yPos += 8;
            });
            
            // Impact Summary
            yPos += 15;
            doc.setFontSize(12);
            doc.text('Estimated Impact', 15, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.text(`• Families Helped: ${Math.floor(totalRaised / 50)}+`, 20, yPos);
            yPos += 7;
            doc.text(`• Children Educated: ${Math.floor(totalRaised / 100)}+`, 20, yPos);
            yPos += 7;
            doc.text(`• Meals Provided: ${Math.floor(totalRaised / 200)}+`, 20, yPos);
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('Page 1 of 1', pageWidth / 2, 285, { align: 'center' });
            doc.text('BarakahAid - Empowering Communities Through Giving', pageWidth / 2, 290, { align: 'center' });
            
            // Save
            doc.save(`ngo-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF Generation failed:', error);
            toast.error('Failed to generate PDF report');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen py-8 bg-secondary-50">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/ngo/dashboard')}
                            className="flex items-center text-sm text-secondary-600 hover:text-secondary-900 mb-2"
                        >
                            <HiArrowLeft className="w-4 h-4 mr-1" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-secondary-900">Reports & Analytics</h1>
                        <p className="mt-1 text-secondary-600">Comprehensive insights into your campaign performance</p>
                    </div>
                    <div className="flex gap-3">
                        <SecondaryButton onClick={handleExportCSV} disabled={exporting}>
                            <HiDownload className="w-4 h-4 mr-2" />
                            {exporting ? 'Exporting...' : 'Export CSV'}
                        </SecondaryButton>
                        <PrimaryButton onClick={handleGeneratePDF} disabled={exporting}>
                            <HiDocumentReport className="w-4 h-4 mr-2" />
                            {exporting ? 'Generating...' : 'Generate PDF'}
                        </PrimaryButton>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card padding="lg" className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary-100 rounded-lg">
                                    <HiCash className="w-6 h-6 text-primary-600" />
                                </div>
                                <span className="text-sm text-secondary-600">Total Raised</span>
                            </div>
                            <p className="text-3xl font-bold text-secondary-900">{formatCurrency(totalRaised)}</p>
                            <p className="text-sm text-success-600 mt-1 flex items-center gap-1">
                                <HiTrendingUp className="w-4 h-4" />
                                Lifetime
                            </p>
                        </div>
                    </Card>

                    <Card padding="lg" className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-success-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-success-100 rounded-lg">
                                    <HiChartBar className="w-6 h-6 text-success-600" />
                                </div>
                                <span className="text-sm text-secondary-600">Active Campaigns</span>
                            </div>
                            <p className="text-3xl font-bold text-secondary-900">{activeCampaigns}</p>
                            <p className="text-sm text-secondary-500 mt-1">{campaigns.length} total campaigns</p>
                        </div>
                    </Card>

                    <Card padding="lg" className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-warning-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-warning-100 rounded-lg">
                                    <HiUserGroup className="w-6 h-6 text-warning-600" />
                                </div>
                                <span className="text-sm text-secondary-600">Unique Donors</span>
                            </div>
                            <p className="text-3xl font-bold text-secondary-900">{uniqueDonors}</p>
                            <p className="text-sm text-secondary-500 mt-1">{donations.length} total donations</p>
                        </div>
                    </Card>

                    <Card padding="lg" className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-accent-100 rounded-lg">
                                    <HiGlobeAlt className="w-6 h-6 text-accent-600" />
                                </div>
                                <span className="text-sm text-secondary-600">Avg. Donation</span>
                            </div>
                            <p className="text-3xl font-bold text-secondary-900">{formatCurrency(avgDonation)}</p>
                            <p className="text-sm text-secondary-500 mt-1">Per transaction</p>
                        </div>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Donations Chart */}
                    <Card padding="lg">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Monthly Donation Trends</h3>
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-medium text-secondary-700">
                                        {formatCurrency(data.amount)}
                                    </span>
                                    <div
                                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-700 hover:to-primary-500"
                                        style={{
                                            height: `${Math.max((data.amount / maxMonthly) * 180, 8)}px`,
                                        }}
                                    ></div>
                                    <span className="text-xs text-secondary-600">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Campaign Performance */}
                    <Card padding="lg">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Performing Campaigns</h3>
                        <div className="space-y-4">
                            {topCampaigns.length === 0 ? (
                                <p className="text-secondary-500 text-center py-8">No campaigns yet</p>
                            ) : (
                                topCampaigns.map((campaign, index) => {
                                    const progress = campaign.goalAmount
                                        ? (Number(campaign.raisedAmount || 0) / Number(campaign.goalAmount)) * 100
                                        : 0;
                                    return (
                                        <div key={campaign.id} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-secondary-900 truncate">{campaign.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full"
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-secondary-600 whitespace-nowrap">
                                                        {progress.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-primary-600">{formatCurrency(campaign.raisedAmount || 0)}</p>
                                                <p className="text-xs text-secondary-500">raised</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>
                </div>

                {/* Recent Activity & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Donations */}
                    <Card padding="lg" className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Donations</h3>
                        <div className="space-y-3">
                            {recentDonations.length === 0 ? (
                                <p className="text-secondary-500 text-center py-8">No donations yet</p>
                            ) : (
                                recentDonations.map((donation) => (
                                    <div key={donation.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                                                <HiCheckCircle className="w-5 h-5 text-success-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-secondary-900">{donation.donor?.name || 'Anonymous'}</p>
                                                <p className="text-sm text-secondary-600">
                                                    {donation.campaign?.title || 'General Donation'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-success-600">{formatCurrency(donation.amount)}</p>
                                            <p className="text-xs text-secondary-500">
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Impact Summary */}
                    <Card padding="lg">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Impact Summary</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-primary-50 to-success-50 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <HiUserGroup className="w-8 h-8 text-primary-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-secondary-900">
                                            {Math.floor(totalRaised / 50)}+
                                        </p>
                                        <p className="text-sm text-secondary-600">Families Helped</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-success-50 to-warning-50 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <HiChartBar className="w-8 h-8 text-success-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-secondary-900">
                                            {Math.floor(totalRaised / 100)}+
                                        </p>
                                        <p className="text-sm text-secondary-600">Children Educated</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-warning-50 to-accent-50 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <HiGlobeAlt className="w-8 h-8 text-warning-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-secondary-900">
                                            {Math.floor(totalRaised / 200)}+
                                        </p>
                                        <p className="text-sm text-secondary-600">Meals Provided</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-secondary-200">
                                <p className="text-xs text-secondary-500 text-center">
                                    * Estimates based on average program costs
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
