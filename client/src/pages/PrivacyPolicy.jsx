// Privacy Policy Page
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import useTextAnimation from '../hooks/useTextAnimation';

const PrivacyPolicy = () => {
  useTextAnimation();
  
  return (
    <div className="min-h-screen py-12 bg-secondary-50">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Privacy Policy</h1>
          <p className="text-lg text-secondary-600">Last updated: December 6, 2025</p>
        </div>

        <Card className="p-8">
          <div className="space-y-8 text-secondary-700">
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Introduction</h2>
              <p className="leading-relaxed">
                At BarakahAid, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary-800">Personal Information</h3>
                  <p className="mb-2 leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="pl-6 space-y-2 list-disc">
                    <li>Name, email address, and contact information</li>
                    <li>Payment and billing information</li>
                    <li>Donation history and preferences</li>
                    <li>Account credentials and profile information</li>
                    <li>Communications with our support team</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary-800">Automatically Collected Information</h3>
                  <ul className="pl-6 space-y-2 list-disc">
                    <li>Device information and IP address</li>
                    <li>Browser type and operating system</li>
                    <li>Usage data and browsing patterns</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">How We Use Your Information</h2>
              <p className="mb-3 leading-relaxed">
                We use the collected information for various purposes:
              </p>
              <ul className="pl-6 space-y-2 list-disc">
                <li>Processing donations and transactions</li>
                <li>Sending receipts and transaction confirmations</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Sending updates about campaigns and impact stories</li>
                <li>Improving our platform and user experience</li>
                <li>Detecting and preventing fraud and security threats</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Information Sharing and Disclosure</h2>
              <p className="mb-3 leading-relaxed">
                We may share your information in the following circumstances:
              </p>
              <ul className="pl-6 space-y-2 list-disc">
                <li><strong>With Campaign Creators:</strong> When you donate, we share necessary information with the recipient</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in payment processing and platform operations</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                We never sell your personal information to third parties.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Data Security</h2>
              <p className="leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, 
                secure servers, and regular security audits. However, no method of transmission over the internet 
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Your Rights and Choices</h2>
              <p className="mb-3 leading-relaxed">You have the right to:</p>
              <ul className="pl-6 space-y-2 list-disc">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use cookies and similar technologies to enhance your experience on our platform. 
                You can manage your cookie preferences through your browser settings. For more information, 
                please see our <Link to="/cookies" className="font-semibold text-primary-600 hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Children's Privacy</h2>
              <p className="leading-relaxed">
                Our platform is not intended for users under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">International Data Transfers</h2>
              <p className="leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Contact Us</h2>
              <p className="mb-3 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-4 border rounded-lg bg-secondary-50 border-secondary-200">
                <p className="font-semibold">BarakahAid Privacy Team</p>
                <p>Email: privacy@barakahaid.com</p>
                <p>Address: 3002 Suter Avenue, San Diego, CA 92103</p>
                <p className="mt-2">
                  <Link to="/contact" className="font-semibold text-primary-600 hover:underline">
                    Go to Contact Page →
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
