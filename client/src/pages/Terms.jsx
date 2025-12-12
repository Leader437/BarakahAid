// Terms of Service Page
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import useTextAnimation from '../hooks/useTextAnimation';

const Terms = () => {
  useTextAnimation();
  
  return (
    <div className="min-h-screen py-12 bg-secondary-50">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Terms of Service</h1>
          <p className="text-lg text-secondary-600">Last updated: December 6, 2025</p>
        </div>

        <Card className="p-8">
          <div className="space-y-8 text-secondary-700">
            {/* Agreement */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing and using BarakahAid ("the Platform"), you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, you are 
                prohibited from using this platform.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Definitions</h2>
              <ul className="pl-6 space-y-2 list-disc">
                <li><strong>"Platform"</strong> refers to the BarakahAid website and services</li>
                <li><strong>"User"</strong> refers to anyone who accesses or uses the Platform</li>
                <li><strong>"Donor"</strong> refers to users who make financial contributions</li>
                <li><strong>"Campaign Creator"</strong> refers to users who create fundraising campaigns</li>
                <li><strong>"Content"</strong> refers to all information, materials, and data on the Platform</li>
              </ul>
            </section>

            {/* Use of Platform */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Use of Platform</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary-800">Eligibility</h3>
                  <p className="leading-relaxed">
                    You must be at least 18 years old to use this Platform. By using the Platform, you represent 
                    and warrant that you meet this age requirement.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-secondary-800">Account Registration</h3>
                  <p className="leading-relaxed">
                    To access certain features, you must create an account. You agree to:
                  </p>
                  <ul className="pl-6 mt-2 space-y-1 list-disc">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Donations */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Donations and Transactions</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <strong>Donation Processing:</strong> All donations are final and non-refundable unless 
                  required by law or in cases of fraud. We charge a platform fee of 5% to cover operational costs.
                </p>
                <p className="leading-relaxed">
                  <strong>Tax Deductibility:</strong> The tax-deductibility of donations depends on the recipient's 
                  status. Consult with a tax professional for guidance.
                </p>
                <p className="leading-relaxed">
                  <strong>Payment Methods:</strong> We accept various payment methods including credit cards, 
                  debit cards, PayPal, and cryptocurrency. Payment processing is handled by third-party providers.
                </p>
              </div>
            </section>

            {/* Campaign Guidelines */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Campaign Creation Guidelines</h2>
              <p className="mb-3 leading-relaxed">Campaign creators must adhere to the following:</p>
              <ul className="pl-6 space-y-2 list-disc">
                <li>Provide truthful and accurate information about the cause</li>
                <li>Use funds only for the stated purpose</li>
                <li>Provide regular updates to donors</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respond to inquiries in a timely manner</li>
                <li>Not engage in fraudulent or misleading activities</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Prohibited Activities</h2>
              <p className="mb-3 leading-relaxed">You may not use the Platform to:</p>
              <ul className="pl-6 space-y-2 list-disc">
                <li>Engage in fraudulent, illegal, or unethical activities</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Violate any intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Create campaigns for illegal purposes</li>
                <li>Impersonate others or misrepresent your identity</li>
                <li>Spam or send unsolicited communications</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Intellectual Property Rights</h2>
              <p className="mb-3 leading-relaxed">
                The Platform and its content, including logos, text, graphics, and software, are owned by 
                BarakahAid and protected by intellectual property laws.
              </p>
              <p className="leading-relaxed">
                You retain ownership of content you submit, but grant us a license to use, display, and 
                distribute it for Platform operations. You represent that you have the right to submit such content.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Disclaimers and Limitations</h2>
              <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                <p className="mb-2 font-semibold text-yellow-900">Important Notice:</p>
                <p className="leading-relaxed text-yellow-800">
                  THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THE 
                  ACCURACY, RELIABILITY, OR AVAILABILITY OF THE PLATFORM. WE ARE NOT LIABLE FOR THE ACTIONS 
                  OF CAMPAIGN CREATORS OR THE USE OF DONATED FUNDS.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, BarakahAid shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of the Platform. Our 
                total liability shall not exceed the amount of fees paid by you in the past 12 months.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Indemnification</h2>
              <p className="leading-relaxed">
                You agree to indemnify and hold harmless BarakahAid from any claims, damages, losses, and 
                expenses arising from your violation of these Terms or your use of the Platform.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Termination</h2>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these 
                Terms or for any other reason. You may also terminate your account at any time by contacting us.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Governing Law and Disputes</h2>
              <p className="mb-3 leading-relaxed">
                These Terms are governed by the laws of the State of California, USA. Any disputes shall be 
                resolved through binding arbitration in San Diego, California.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Changes to Terms</h2>
              <p className="leading-relaxed">
                We may modify these Terms at any time. Continued use of the Platform after changes constitutes 
                acceptance of the modified Terms. We will notify users of significant changes.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Contact Information</h2>
              <p className="mb-3 leading-relaxed">
                For questions about these Terms, please contact us:
              </p>
              <div className="p-4 border rounded-lg bg-secondary-50 border-secondary-200">
                <p className="font-semibold">BarakahAid Legal Team</p>
                <p>Email: legal@barakahaid.com</p>
                <p>Address: 3002 Suter Avenue, San Diego, CA 92103</p>
                <p className="mt-2">
                  <Link to="/contact" className="font-semibold text-primary-600 hover:underline">
                    Contact Us →
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

export default Terms;
