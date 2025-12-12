// FAQ Page
import React, { useState } from 'react';
import { HiSearch, HiChevronDown, HiEmojiSad, HiSupport, HiClock, HiMail } from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { Link } from 'react-router-dom';
import useTextAnimation from '../hooks/useTextAnimation';

const FAQ = () => {
  useTextAnimation();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'donations', label: 'Donations' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'account', label: 'Account' },
    { id: 'payments', label: 'Payments' },
    { id: 'security', label: 'Security' },
    { id: 'platform', label: 'Platform' }
  ];

  const faqs = [
    // Donations
    {
      category: 'donations',
      question: 'How does BarakahAid ensure donation transparency?',
      answer: 'We use blockchain technology and provide real-time tracking of all donations. Every transaction is recorded and verified, ensuring complete transparency from donor to recipient. You can track your donation journey and see exactly how funds are being used.'
    },
    {
      category: 'donations',
      question: 'What percentage of my donation goes to the cause?',
      answer: 'We maintain a 95% pass-through rate. Only 5% covers platform maintenance and payment processing fees. This ensures the vast majority of your contribution reaches those in need.'
    },
    {
      category: 'donations',
      question: 'Can I get a tax receipt for my donation?',
      answer: 'Yes, you will automatically receive a tax receipt via email after making a donation. The tax-deductibility depends on the recipient\'s status and your country of residence. For U.S. donors, donations to verified 501(c)(3) organizations are typically tax-deductible.'
    },
    {
      category: 'donations',
      question: 'Can I donate anonymously?',
      answer: 'Yes, you can choose to make anonymous donations. During the donation process, simply check the "Donate anonymously" option. Your name will not be displayed publicly, though we still keep a record for legal and tax purposes.'
    },
    {
      category: 'donations',
      question: 'Can I set up recurring donations?',
      answer: 'Absolutely! You can set up monthly, quarterly, or annual recurring donations to your favorite campaigns. You can modify or cancel recurring donations at any time from your account dashboard.'
    },

    // Campaigns
    {
      category: 'campaigns',
      question: 'How do I create a fundraising campaign?',
      answer: 'Creating a campaign is simple: 1) Sign up or log in to your account, 2) Click "Create Campaign" from your dashboard, 3) Fill in the campaign details including title, description, goal amount, and category, 4) Upload supporting documents and images, 5) Submit for verification. Our team typically reviews campaigns within 24-48 hours.'
    },
    {
      category: 'campaigns',
      question: 'How long does campaign verification take?',
      answer: 'Most campaigns are verified within 24-48 hours. We check documentation, verify identities, and ensure compliance with our guidelines. You\'ll receive an email notification once your campaign is approved or if we need additional information.'
    },
    {
      category: 'campaigns',
      question: 'What types of campaigns are allowed?',
      answer: 'We support campaigns for healthcare, education, disaster relief, poverty eradication, community development, and other charitable causes. Campaigns must be legal, ethical, and transparent. We do not allow campaigns for illegal activities, personal loans, or misleading purposes.'
    },
    {
      category: 'campaigns',
      question: 'Can I withdraw funds before reaching my goal?',
      answer: 'Yes, funds are available for withdrawal as soon as they are donated. You don\'t need to wait until your campaign goal is reached. However, we recommend providing regular updates to donors about fund usage.'
    },
    {
      category: 'campaigns',
      question: 'How do I promote my campaign?',
      answer: 'Share your campaign link on social media, email it to friends and family, embed it on your website, and regularly post updates. Campaigns with frequent updates and compelling stories tend to receive more donations. We also feature high-quality campaigns on our homepage.'
    },

    // Account
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Get Started" or "Register" at the top of any page. Fill in your basic information including name, email, and password. You\'ll receive a verification email to confirm your account. You can also sign up using your Google or Facebook account.'
    },
    {
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password. If you don\'t receive the email, check your spam folder.'
    },
    {
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'Yes, you can update your email address from your account settings. Go to Profile → Settings → Email and enter your new email. You\'ll need to verify the new email address before the change takes effect.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Settings → Account → Delete Account. Please note that this action is permanent and cannot be undone. All your data will be removed, though donation records may be retained for legal and tax purposes.'
    },
    {
      category: 'account',
      question: 'Can I have multiple accounts?',
      answer: 'We recommend maintaining one account per person or organization. However, if you represent multiple organizations, you can create separate verified accounts for each. Contact our support team for assistance with organizational accounts.'
    },

    // Payments
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and cryptocurrency (Bitcoin, Ethereum). All transactions are secured with industry-standard encryption and processed by trusted payment providers.'
    },
    {
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, absolutely. We use PCI-DSS compliant payment processors and never store your complete credit card information on our servers. All payment data is encrypted using SSL/TLS technology during transmission.'
    },
    {
      category: 'payments',
      question: 'Can I get a refund for my donation?',
      answer: 'Donations are generally non-refundable as they are charitable contributions. However, if there\'s a case of fraud or technical error, please contact our support team immediately. We handle refund requests on a case-by-case basis.'
    },
    {
      category: 'payments',
      question: 'How long does it take for campaign creators to receive funds?',
      answer: 'Funds are typically available for withdrawal within 2-5 business days after a donation is made. The exact timing depends on the payment method used and your bank\'s processing time. Bank transfers may take 3-5 business days, while PayPal transfers are usually faster.'
    },
    {
      category: 'payments',
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees. We clearly display our 5% platform fee before you complete a donation. This fee covers payment processing, platform maintenance, and fraud prevention. There are no additional charges or surprises.'
    },

    // Security
    {
      category: 'security',
      question: 'How do you verify campaigns are legitimate?',
      answer: 'All campaigns undergo verification by our team. We check documentation, verify identities, perform background checks, and monitor fund usage. Verified campaigns display a trust badge. We also investigate reports from the community and take swift action against fraudulent activity.'
    },
    {
      category: 'security',
      question: 'What security measures do you have in place?',
      answer: 'We employ multiple security layers: SSL encryption, two-factor authentication, regular security audits, fraud detection systems, secure payment processing, and data encryption at rest. Our team monitors for suspicious activity 24/7.'
    },
    {
      category: 'security',
      question: 'Do you offer two-factor authentication?',
      answer: 'Yes, we highly recommend enabling two-factor authentication (2FA) for your account. You can enable it in Settings → Security. 2FA adds an extra layer of protection by requiring a code from your phone in addition to your password.'
    },
    {
      category: 'security',
      question: 'What should I do if I suspect fraud?',
      answer: 'If you suspect fraudulent activity, report it immediately using the "Report" button on the campaign page or contact our support team at support@barakahaid.com. We investigate all reports promptly and take appropriate action, including campaign suspension and fund recovery when necessary.'
    },
    {
      category: 'security',
      question: 'How do you protect my personal information?',
      answer: 'We follow strict data protection practices in compliance with GDPR and other privacy regulations. Your personal information is encrypted, never sold to third parties, and only used for platform operations. See our Privacy Policy for complete details.'
    },

    // Platform
    {
      category: 'platform',
      question: 'Is BarakahAid available in my country?',
      answer: 'BarakahAid is available in 175+ countries worldwide. However, certain payment methods and features may vary by region due to local regulations. Check our country-specific information page or contact support for availability in your area.'
    },
    {
      category: 'platform',
      question: 'Can I use BarakahAid on my mobile device?',
      answer: 'Yes, our platform is fully responsive and works on all devices including smartphones, tablets, and desktop computers. We also have mobile apps for iOS and Android coming soon. You can donate, create campaigns, and manage your account from any device.'
    },
    {
      category: 'platform',
      question: 'How can I contact customer support?',
      answer: 'You can reach us through: Email (support@barakahaid.com), Phone (+1 619-555-0123), Live chat on our website, or by submitting a ticket through your account dashboard. We typically respond within 12-24 hours during business days.'
    },
    {
      category: 'platform',
      question: 'Do you have an API for integrations?',
      answer: 'Yes, we offer a robust API for organizations, developers, and partners who want to integrate BarakahAid functionality into their own platforms. Contact our partnerships team at partnerships@barakahaid.com for API documentation and access.'
    },
    {
      category: 'platform',
      question: 'Can organizations and NGOs use BarakahAid?',
      answer: 'Absolutely! We welcome registered nonprofits, NGOs, and charitable organizations. We offer special features for verified organizations including enhanced profiles, priority support, and bulk campaign management. Contact us to set up an organizational account.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-secondary-900 md:text-5xl" data-text-split data-letters-slide-up>
              Frequently Asked Questions
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-secondary-600">
              Find answers to common questions about using BarakahAid
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-4 transition-shadow border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-secondary-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <details className="cursor-pointer group">
                    <summary className="flex items-center justify-between p-6 text-lg font-bold list-none text-secondary-900">
                      <span className="flex-1 pr-4">{faq.question}</span>
                      <HiChevronDown className="flex-shrink-0 w-5 h-5 transition-transform transform text-primary-600 group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="leading-relaxed text-secondary-700">{faq.answer}</p>
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <HiEmojiSad className="w-16 h-16 mx-auto mb-4 text-secondary-400" />
              <h3 className="mb-2 text-xl font-bold text-secondary-900">No questions found</h3>
              <p className="text-secondary-600">Try adjusting your search or category filter</p>
            </Card>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <Card className="p-8 text-center bg-gradient-to-br from-primary-50 to-white border-primary-200">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 text-primary-600">
              <HiSupport className="w-8 h-8" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Still Need Help?</h2>
            <p className="max-w-2xl mx-auto mb-6 text-lg text-secondary-600">
              Can't find what you're looking for? Our support team is here to assist you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <PrimaryButton>
                  Contact Support
                </PrimaryButton>
              </Link>
              <a href="mailto:support@barakahaid.com">
                <SecondaryButton>
                  Email Us
                </SecondaryButton>
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <HiClock className="w-5 h-5 text-primary-600" />
                <span>Response within 12-24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <HiMail className="w-5 h-5 text-primary-600" />
                <span>support@barakahaid.com</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
