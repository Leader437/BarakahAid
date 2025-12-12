// Cookies Policy Page
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import useTextAnimation from '../hooks/useTextAnimation';

const Cookies = () => {
  useTextAnimation();
  
  return (
    <div className="min-h-screen py-12 bg-secondary-50">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Cookie Policy</h1>
          <p className="text-lg text-secondary-600">Last updated: December 6, 2025</p>
        </div>

        <Card className="p-8">
          <div className="space-y-8 text-secondary-700">
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">What Are Cookies?</h2>
              <p className="leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us 
                provide you with a better experience by remembering your preferences and understanding how you use our platform.
              </p>
            </section>

            {/* How We Use Cookies */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">How We Use Cookies</h2>
              <p className="mb-4 leading-relaxed">
                BarakahAid uses cookies for various purposes to enhance your experience on our platform:
              </p>

              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <h3 className="mb-2 text-xl font-semibold text-blue-900">
                    <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Essential Cookies
                  </h3>
                  <p className="mb-2 text-blue-800">These cookies are necessary for the platform to function properly.</p>
                  <ul className="pl-6 space-y-1 text-sm text-blue-700 list-disc">
                    <li>Authentication and security</li>
                    <li>Session management</li>
                    <li>Load balancing</li>
                    <li>Form submissions</li>
                  </ul>
                </div>

                {/* Functional Cookies */}
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <h3 className="mb-2 text-xl font-semibold text-green-900">
                    <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Functional Cookies
                  </h3>
                  <p className="mb-2 text-green-800">These cookies remember your preferences and choices.</p>
                  <ul className="pl-6 space-y-1 text-sm text-green-700 list-disc">
                    <li>Language preferences</li>
                    <li>Theme settings (light/dark mode)</li>
                    <li>Region and currency settings</li>
                    <li>Saved filters and search preferences</li>
                  </ul>
                </div>

                {/* Analytics Cookies */}
                <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                  <h3 className="mb-2 text-xl font-semibold text-purple-900">
                    <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics Cookies
                  </h3>
                  <p className="mb-2 text-purple-800">These help us understand how visitors interact with our platform.</p>
                  <ul className="pl-6 space-y-1 text-sm text-purple-700 list-disc">
                    <li>Page views and navigation patterns</li>
                    <li>Time spent on pages</li>
                    <li>Traffic sources</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>

                {/* Marketing Cookies */}
                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <h3 className="mb-2 text-xl font-semibold text-orange-900">
                    <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    Marketing Cookies
                  </h3>
                  <p className="mb-2 text-orange-800">These track your activity to deliver relevant advertisements.</p>
                  <ul className="pl-6 space-y-1 text-sm text-orange-700 list-disc">
                    <li>Personalized content recommendations</li>
                    <li>Retargeting campaigns</li>
                    <li>Social media integration</li>
                    <li>Campaign effectiveness measurement</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Third-Party Cookies</h2>
              <p className="mb-3 leading-relaxed">
                We work with trusted third-party service providers who may also set cookies on your device:
              </p>
              <ul className="pl-6 space-y-2 list-disc">
                <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                <li><strong>Payment Processors:</strong> To securely process donations (e.g., Stripe, PayPal)</li>
                <li><strong>Social Media Platforms:</strong> For social sharing features (Facebook, Twitter, LinkedIn)</li>
                <li><strong>Content Delivery Networks:</strong> To optimize performance and load times</li>
              </ul>
            </section>

            {/* Managing Cookies */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Managing Your Cookie Preferences</h2>
              <p className="mb-4 leading-relaxed">
                You have control over cookies and can manage them in several ways:
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-secondary-50 border-secondary-200">
                  <h3 className="mb-2 font-semibold text-secondary-900">Browser Settings</h3>
                  <p className="text-sm leading-relaxed">
                    Most browsers allow you to refuse or delete cookies. Please note that blocking essential cookies 
                    may affect the functionality of the platform.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                      Chrome Settings →
                    </a>
                    <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                      Firefox Settings →
                    </a>
                    <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                      Safari Settings →
                    </a>
                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                      Edge Settings →
                    </a>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-secondary-50 border-secondary-200">
                  <h3 className="mb-2 font-semibold text-secondary-900">Opt-Out Options</h3>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                    <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Network Advertising Initiative Opt-Out</a></li>
                    <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Digital Advertising Alliance Opt-Out</a></li>
                    <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Analytics Opt-Out Browser Add-On</a></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookie Duration */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Cookie Duration</h2>
              <p className="mb-3 leading-relaxed">
                Cookies can be either session cookies or persistent cookies:
              </p>
              <ul className="pl-6 space-y-2 list-disc">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted (typically 30 days to 2 years)</li>
              </ul>
            </section>

            {/* Do Not Track */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Do Not Track Signals</h2>
              <p className="leading-relaxed">
                Some browsers support "Do Not Track" (DNT) signals. Currently, there is no industry standard for 
                responding to DNT signals. We do not currently respond to DNT signals but may do so in the future.
              </p>
            </section>

            {/* Updates */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Updates to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. 
                Please review this page periodically for the latest information.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-secondary-900">Questions About Cookies?</h2>
              <p className="mb-3 leading-relaxed">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="p-4 border rounded-lg bg-secondary-50 border-secondary-200">
                <p className="font-semibold">BarakahAid Privacy Team</p>
                <p>Email: privacy@barakahaid.com</p>
                <p className="mt-2">
                  <Link to="/privacy" className="font-semibold text-primary-600 hover:underline">
                    View Privacy Policy →
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

export default Cookies;
