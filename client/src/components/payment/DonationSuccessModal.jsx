import React, { useEffect, useState } from 'react';
import { HiCheck, HiDownload, HiShare, HiX, HiHeart, HiCalendar, HiCreditCard } from 'react-icons/hi';
import jsPDF from 'jspdf';

const DonationSuccessModal = ({
  isOpen,
  onClose,
  campaign,
  amount,
  donorName,
  paymentMethod,
  transactionId
}) => {
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setConfetti(true);
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const close = () => {
    setVisible(false);
    document.body.style.overflow = 'unset';
    setTimeout(onClose, 200);
  };

  const handleDownloadReceipt = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 20;
  let y = 20;

  const primaryGreen = [22, 163, 74];   // green-600
  const darkGray = [31, 41, 55];        // gray-800
  const mutedGray = [107, 114, 128];    // gray-500
  const lightGray = [243, 244, 246];    // gray-100

  const receiptId =
    transactionId?.substring(0, 10).toUpperCase() ||
    Math.random().toString(36).substring(2, 10).toUpperCase();

  const donationAmount =
    typeof amount === 'number' ? amount.toFixed(2) : '0.00';

  /* ================= HEADER ================= */
  doc.setFillColor(...primaryGreen);
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text('BarakahAid', marginX, 28);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Official Donation Receipt', marginX, 36);

  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text(`Receipt #${receiptId}`, pageWidth - marginX, 26, { align: 'right' });

  doc.setFont(undefined, 'normal');
  doc.text(
    `Date: ${new Date().toLocaleDateString()}`,
    pageWidth - marginX,
    34,
    { align: 'right' }
  );

  y = 75;

  /* ================= THANK YOU ================= */
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Thank you for your generosity!', pageWidth / 2, y, { align: 'center' });

  y += 10;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...mutedGray);
  doc.text(
    `Dear ${donorName || 'Supporter'}, your donation is making a real impact.`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  /* ================= AMOUNT CARD ================= */
  y += 18;

  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(...primaryGreen);
  doc.setLineWidth(1);
  doc.roundedRect(marginX, y, pageWidth - marginX * 2, 38, 6, 6, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(...mutedGray);
  doc.text('Donation Amount', marginX + 10, y + 12);

  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryGreen);
  doc.text(`$${donationAmount}`, marginX + 10, y + 28);

  y += 55;

  /* ================= DETAILS ================= */
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...darkGray);
  doc.text('Donation Details', marginX, y);

  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 10;

  const details = [
    ['Campaign', campaign?.title || 'General Donation'],
    ['Donor Name', donorName || 'Anonymous'],
    ['Payment Method', paymentMethod || 'N/A'],
    ['Transaction ID', transactionId || 'N/A'],
    [
      'Donation Date',
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    ],
  ];

  doc.setFontSize(10);

  details.forEach(([label, value]) => {
    doc.setTextColor(...mutedGray);
    doc.setFont(undefined, 'bold');
    doc.text(label, marginX, y);

    doc.setFont(undefined, 'normal');
    doc.setTextColor(...darkGray);
    const wrapped = doc.splitTextToSize(value, pageWidth - marginX * 2 - 60);
    doc.text(wrapped, marginX + 60, y);

    y += wrapped.length * 6 + 4;
  });

  /* ================= IMPACT BOX ================= */
  y += 8;

  doc.setFillColor(...lightGray);
  doc.roundedRect(marginX, y, pageWidth - marginX * 2, 24, 6, 6, 'F');

  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryGreen);
  doc.text('Your Impact', marginX + 10, y + 10);

  doc.setFont(undefined, 'normal');
  doc.setTextColor(...darkGray);
  doc.text(
    'Your donation directly supports our mission and helps those in need.',
    marginX + 10,
    y + 18
  );

  /* ================= FOOTER ================= */
  const footerY = pageHeight - 30;

  doc.setDrawColor(229, 231, 235);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);

  doc.setFontSize(8);
  doc.setTextColor(...mutedGray);
  doc.text(
    'BarakahAid • www.barakahaid.com',
    pageWidth / 2,
    footerY + 10,
    { align: 'center' }
  );

  doc.text(
    'This receipt confirms your charitable donation.',
    pageWidth / 2,
    footerY + 16,
    { align: 'center' }
  );

  doc.save(`BarakahAid-Receipt-${receiptId}.pdf`);
};


  const handleShareReceipt = async () => {
    const doc = handleDownloadReceipt();
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const shareText = `I just donated $${typeof amount === 'number' ? amount.toFixed(2) : '0.00'} to ${campaign?.title || 'a great cause'} through BarakahAid. Join me in making a difference! 💚`;
    
    // Try to share with Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BarakahAid Donation Receipt',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Donation message copied to clipboard! You can share it manually.');
      });
    }
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
  };

  if (!visible) return null;

  // Fix: Amount is passed in dollars, so we just format it directly
  const formattedAmount = typeof amount === 'number' ? amount.toFixed(2) : '0.00';
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes checkBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Confetti Overlay */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animation: `confettiFall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <span style={{ 
                color: ['#22c55e', '#16a34a', '#eab308', '#3b82f6'][Math.floor(Math.random() * 4)],
                fontSize: `${Math.random() * 1.5 + 0.5}rem`
              }}>
                {['●', '■', '▲', '★'][Math.floor(Math.random() * 4)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={close}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[modalIn_0.4s_cubic-bezier(0.16,1,0.3,1)] my-8">
          
          {/* Decorative Header Background */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-green-600 to-green-700 z-0">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          {/* Close Button */}
          <button 
            onClick={close}
            className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-md"
          >
            <HiX className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 px-8 pt-12 pb-8 flex flex-col items-center text-center">
            
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-xl mb-10 animate-[checkBounce_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
              <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                <HiCheck className="w-10 h-10 text-white stroke-2" />
              </div>
            </div>

            {/* Headings */}
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Thank You, {donorName?.split(' ')[0] || 'Donor'}!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your donation has been successfully processed. You are making a real difference.
            </p>

            {/* Amount Card */}
            <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Donation</p>
              <div className="text-4xl font-bold text-green-600 mb-4 font-heading">
                ${formattedAmount}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <HiHeart className="w-4 h-4" /> Campaign
                  </span>
                  <span className="font-medium text-gray-900 truncate max-w-[180px]">{campaign?.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <HiCalendar className="w-4 h-4" /> Date
                  </span>
                  <span className="font-medium text-gray-900">{today}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <HiCreditCard className="w-4 h-4" /> Method
                  </span>
                  <span className="font-medium text-gray-900">{paymentMethod}</span>
                </div>
                {transactionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ref ID</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded">{transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <button 
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                <HiDownload className="w-5 h-5" />
                <span>Receipt</span>
              </button>
              <button 
                onClick={handleShareReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
              >
                <HiShare className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            <button 
              onClick={close}
              className="mt-6 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              Return to Home
            </button>

          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default DonationSuccessModal;
