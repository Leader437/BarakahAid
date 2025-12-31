import React, { useState, useEffect } from 'react';
import {
  HiSearch,
  HiDownload,
  HiEye,
  HiCheckCircle,
  HiClock,
  HiXCircle
} from 'react-icons/hi';
import jsPDF from 'jspdf';
import Card from '../../components/ui/Card';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { formatCurrency } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNgoDonations, selectNgoDonations, selectNgoLoading } from '../../store/ngoSlice';
import { useToast } from '../../components/ui/Toast';

const DonationsReceived = () => {
  const dispatch = useDispatch();
  const donations = useSelector(selectNgoDonations);
  const loading = useSelector(selectNgoLoading);
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    dispatch(fetchNgoDonations());
  }, [dispatch]);

  const periods = ['All Time', 'Today', 'This Week', 'This Month', 'This Year'];

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = (donation.donor?.name || 'Anonymous').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (donation.campaign?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Period filtering logic can be added here
    return matchesSearch;
  });

  const handleExport = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // Primary green
      doc.text('BarakahAid', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Donations Received Report', pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 38, { align: 'center' });
      
      // Summary section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 15, 55);
      
      const totalAmount = filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);
      const completedCount = filteredDonations.filter(d => !d.status || d.status === 'COMPLETED').length;
      
      doc.setFontSize(10);
      doc.text(`Total Amount Received: ${formatCurrency(totalAmount)}`, 15, 65);
      doc.text(`Total Donations: ${filteredDonations.length}`, 15, 72);
      doc.text(`Completed Donations: ${completedCount}`, 15, 79);
      
      // Table header
      let yPos = 95;
      doc.setFillColor(243, 244, 246);
      doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text('Date', 17, yPos);
      doc.text('Donor', 45, yPos);
      doc.text('Campaign', 90, yPos);
      doc.text('Amount', 150, yPos);
      doc.text('Status', 175, yPos);
      
      // Table rows
      yPos += 10;
      doc.setTextColor(0, 0, 0);
      
      filteredDonations.forEach((donation, index) => {
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(15, yPos - 4, pageWidth - 30, 7, 'F');
        }
        
        const date = new Date(donation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        const donor = (donation.donor?.name || 'Anonymous').substring(0, 18);
        const campaign = (donation.campaign?.title || 'N/A').substring(0, 25);
        const amount = formatCurrency(Number(donation.amount));
        const status = donation.status || 'COMPLETED';
        
        doc.setFontSize(8);
        doc.text(date, 17, yPos);
        doc.text(donor, 45, yPos);
        doc.text(campaign, 90, yPos);
        doc.text(amount, 150, yPos);
        doc.text(status, 175, yPos);
        
        yPos += 8;
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
        doc.text('BarakahAid - Empowering Communities Through Giving', pageWidth / 2, 295, { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`donations-received-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'completed'; // Default to completed for seeded data
    const styles = {
      completed: 'bg-success-100 text-success-700',
      processing: 'bg-warning-100 text-warning-700',
      failed: 'bg-error-100 text-error-700'
    };
    return styles[s] || styles.processing;
  };

  const getStatusIcon = (status) => {
    const s = status ? status.toLowerCase() : 'completed';
    switch (s) {
      case 'completed':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'processing':
        return <HiClock className="w-4 h-4" />;
      case 'failed':
        return <HiXCircle className="w-4 h-4" />;
      default:
        return <HiClock className="w-4 h-4" />;
    }
  };

  const totalAmount = filteredDonations
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const totalDonations = filteredDonations.length;
  // Assuming all fetched donations are successful/completed for now as per controller logic (or pending)
  const completedDonations = filteredDonations.filter(d => !d.status || d.status === 'COMPLETED').length;

  return (
    <div className="py-6 bg-secondary-50 sm:py-8">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl text-secondary-900" data-text-split data-letters-slide-up>Donations Received</h1>
          <p className="mt-1 text-sm sm:text-base text-secondary-600">
            Track and manage all donations received by your organization
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-3">
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total Amount</p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl text-primary-600">{formatCurrency(totalAmount)}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total Donations</p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl text-secondary-900">{totalDonations}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Completed</p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl text-success-600">{completedDonations}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" className="mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by donor, campaign, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Period Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Time Period</label>
              <div className="flex flex-wrap gap-2">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period.toLowerCase().replace(' ', '-'))}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${period.toLowerCase().replace(' ', '-') === selectedPeriod
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <SecondaryButton onClick={handleExport} disabled={exporting || filteredDonations.length === 0}>
            <HiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">{exporting ? 'Generating...' : 'Export Report'}</span>
            <span className="sm:hidden">{exporting ? '...' : 'Export'}</span>
          </SecondaryButton>
        </div>

        {/* Donations List - Card View for Mobile, Table for Desktop */}
        <div className="space-y-3 md:hidden">
          {filteredDonations.map((donation) => (
            <Card key={donation.id} padding="md">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-secondary-500">{donation.id.slice(0, 8)}...</p>
                    <p className="mt-1 text-sm font-semibold truncate text-secondary-900">{donation.donor?.name || 'Anonymous'}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(donation.status)}`}>
                    {getStatusIcon(donation.status)}
                    {(donation.status || 'COMPLETED')}
                  </span>
                </div>
                <div className="pt-2 border-t border-secondary-100">
                  <p className="text-xs truncate text-secondary-600" title={donation.campaign?.title}>{donation.campaign?.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-primary-600">{formatCurrency(Number(donation.amount))}</p>
                    <button className="p-1.5 transition-colors text-secondary-600 hover:text-primary-600">
                      <HiEye className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-secondary-600">
                    <div>
                      <span className="font-medium">Date:</span> {new Date(donation.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Payment:</span> {donation.paymentGateway || 'Card'}
                    </div>
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
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                      Donor
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                      Campaign
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                      Payment
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
                        {donation.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-900">
                        <div className="max-w-[120px] truncate">{donation.donor?.name || 'Anonymous'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        <div className="max-w-[180px] truncate" title={donation.campaign?.title}>{donation.campaign?.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                        {formatCurrency(Number(donation.amount))}
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        <div>{new Date(donation.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        {donation.paymentGateway || 'Card'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(donation.status)}`}>
                          {getStatusIcon(donation.status)}
                          {(donation.status || 'COMPLETED')}
                        </span>
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
              <p className="text-secondary-600">No donations found.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DonationsReceived;
