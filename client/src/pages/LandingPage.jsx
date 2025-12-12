// Landing Page
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiHeart, HiStar, HiChevronRight, HiCheckCircle, HiUserAdd, HiCreditCard, HiUserGroup } from 'react-icons/hi';
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";
import Footer from "../components/layout/Footer";
import useTextAnimation from "../hooks/useTextAnimation";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  
  // Initialize text animations
  useTextAnimation();

  // Statistics data
  const stats = [
    { value: "21", label: "Years" },
    { value: "$877M", label: "Dollars" },
    { value: "1,793,907", label: "Donors" },
    { value: "35,706", label: "Projects" },
    { value: "175+", label: "Countries" },
    { value: "580", label: "Companies" },
  ];

  // News articles
  const news = [
    {
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop",
      title: "Youth-led Community Voices Initiatives",
      excerpt:
        "She travelling acceptance men unpleasant her especially to impression led",
      date: "2 days ago",
    },
    {
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop",
      title: "Rebuilding in the Aftermath of the World's Largest",
      excerpt:
        "Needed feebly dining oh talked wisdom oppose at began music began",
      date: "1 week ago",
    },
    {
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop",
      title: "Take to the primary and mental health",
      excerpt:
        "Lady does being style stuff quick sense of his. An active curiosity",
      date: "2 weeks ago",
    },
    {
      image:
        "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400&h=300&fit=crop",
      title: "How to Help Turkey, Syria Relief efforts after earthquakes",
      excerpt:
        "We must require express caution when even when faced with challenges",
      date: "3 weeks ago",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Regular Donor",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
      content:
        "BarakahAid has made donating so transparent and easy. I can see exactly where my contributions go and the impact they make.",
    },
    {
      name: "Ahmed Hassan",
      role: "NGO Partner",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80",
      content:
        "As an organization, this platform has connected us with donors globally. The verification process builds trust and credibility.",
    },
    {
      name: "Maria Rodriguez",
      role: "Campaign Creator",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80",
      content:
        "Creating a campaign was seamless. Within days, I had support from people around the world. Truly remarkable!",
    },
  ];

  // Impact stories
  const impactStories = [
    {
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop&q=80",
      category: "Healthcare",
      title: "Building Medical Clinics in Remote Villages",
      description:
        "Providing essential healthcare services to 5,000+ families in rural communities.",
      raised: "$45,000",
      backers: 1250,
    },
    {
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80",
      category: "Education",
      title: "School Supplies for Underprivileged Children",
      description:
        "Ensuring every child has access to quality education materials and resources.",
      raised: "$32,500",
      backers: 890,
    },
    {
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&q=80",
      category: "Emergency",
      title: "Emergency Relief for Flood Victims",
      description:
        "Providing immediate aid including food, shelter, and medical supplies.",
      raised: "$68,000",
      backers: 2100,
    },
  ];

  // Partners/Organizations
  const partners = [
    "UNICEF",
    "Red Cross",
    "WHO",
    "Save the Children",
    "Doctors Without Borders",
    "World Vision",
  ];

  // FAQs data
  const faqs = [
    {
      question: "How does BarakahAid ensure donation transparency?",
      answer:
        "We use blockchain technology and provide real-time tracking of all donations. Every transaction is recorded and verified, ensuring complete transparency from donor to recipient.",
    },
    {
      question: "What percentage of my donation goes to the cause?",
      answer:
        "We maintain a 95% pass-through rate. Only 5% covers platform maintenance and payment processing fees. This ensures the vast majority of your contribution reaches those in need.",
    },
    {
      question: "Can I create my own fundraising campaign?",
      answer:
        "Yes! After creating a free account, you can start a campaign in minutes. Our team reviews all campaigns to ensure legitimacy and provides guidance for successful fundraising.",
    },
    {
      question: "How do I know the campaigns are legitimate?",
      answer:
        "All campaigns undergo verification by our team. We check documentation, verify identities, and monitor fund usage. Verified campaigns display a trust badge.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, PayPal, bank transfers, and cryptocurrency. All transactions are secured with industry-standard encryption.",
    },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-secondary-50 to-white md:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-secondary-900 md:text-5xl lg:text-6xl" data-text-split data-letters-slide-up>
                Make changes and help change the world
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-secondary-600">
                Hope for tomorrow relies upon gentle organizations that
                collaborates with champion on delivery every level both domestic
                and worldwide.
              </p>
              <div className="flex gap-4">
                <Link to="/register">
                  <PrimaryButton>Donate now!</PrimaryButton>
                </Link>
                <Link to="/login">
                  <SecondaryButton>Learn more</SecondaryButton>
                </Link>
              </div>
            </div>

            {/* Right Content - Project Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 transition-shadow bg-white rounded-xl shadow-card hover:shadow-card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop&q=80"
                    alt="Project"
                    className="object-cover w-full h-32 mb-3 rounded-lg"
                  />
                  <h3 className="mb-2 text-sm font-semibold line-clamp-2">
                    Educate UNO Students in Rural Areas
                  </h3>
                  <div className="flex justify-between mb-2 text-xs text-secondary-600">
                    <span>$14,280</span>
                    <span className="text-primary-600">$25,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary-200 rounded-full">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: "57%" }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 transition-shadow bg-white rounded-xl shadow-card hover:shadow-card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=300&h=200&fit=crop&q=80"
                    alt="Project"
                    className="object-cover w-full h-32 mb-3 rounded-lg"
                  />
                  <h3 className="mb-2 text-sm font-semibold line-clamp-2">
                    Everything Began Starting from June
                  </h3>
                  <div className="flex justify-between mb-2 text-xs text-secondary-600">
                    <span>$22,150</span>
                    <span className="text-primary-600">$30,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary-200 rounded-full">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: "74%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="p-4 transition-shadow bg-white rounded-xl shadow-card hover:shadow-card-hover">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop&q=80"
                    alt="Project"
                    className="object-cover w-full h-32 mb-3 rounded-lg"
                  />
                  <h3 className="mb-2 text-sm font-semibold line-clamp-2">
                    Provide Urgent Medical Care
                  </h3>
                  <div className="flex justify-between mb-2 text-xs text-secondary-600">
                    <span>$8,450</span>
                    <span className="text-primary-600">$15,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary-200 rounded-full">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: "56%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card">
                  <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full bg-primary-100">
                    <HiCheckCircle className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-secondary-600">
                      Verified by
                    </p>
                    <p className="text-sm font-semibold">BarakahAid Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-primary-700">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-white md:text-4xl" data-text-split data-letters-slide-up>
            How it works
          </h2>

          <div className="grid gap-8 mb-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white rounded-lg bg-opacity-20">
                <HiUserAdd className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Enter wallet, passport info
              </h3>
              <p className="text-sm text-primary-100">
                Create something collecting fundraisers financial insights
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white rounded-lg bg-opacity-20">
                <HiCreditCard className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Citizen all accessed info
              </h3>
              <p className="text-sm text-primary-100">
                Kindness it announced will them please human to valid platform
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white rounded-lg bg-opacity-20">
                <HiUserGroup className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Create or Join incidences
              </h3>
              <p className="text-sm text-primary-100">
                Improve are forever at highlighting feature of team or
                supporting
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t md:grid-cols-6 border-primary-600">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section id="impact" className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl" data-text-split data-letters-slide-up>
              Real Impact Stories
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-secondary-600">
              See how your contributions are making a difference in communities
              around the world
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {impactStories.map((story, index) => (
              <div
                key={index}
                className="overflow-hidden transition-shadow bg-white rounded-xl shadow-card hover:shadow-card-hover"
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                    {story.category}
                  </span>
                  <h3 className="mb-2 text-xl font-bold text-secondary-900">
                    {story.title}
                  </h3>
                  <p className="block mt-auto mb-4 text-secondary-600">{story.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                    <div>
                      <p className="text-sm text-secondary-600">Raised</p>
                      <p className="font-bold text-primary-600">
                        {story.raised}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600">Backers</p>
                      <p className="font-bold text-secondary-900">
                        {story.backers}
                      </p>
                    </div>
                  </div>
                  <Link to="/register">
                    <PrimaryButton className="w-full mt-4">
                      Support This Cause
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl" data-text-split data-letters-slide-up>
              What Our Community Says
            </h2>
            <p className="text-lg text-secondary-600">
              Hear from donors, recipients, and partners who are part of the
              BarakahAid family
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-card">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover w-16 h-16 mr-4 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-secondary-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-secondary-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="italic text-secondary-700">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="py-12 bg-white border-y border-secondary-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h3 className="mb-8 font-medium text-center text-secondary-600">
            Trusted by leading organizations worldwide
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-xl font-bold transition-colors text-secondary-400 hover:text-primary-600"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl" data-text-split data-letters-slide-up>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-secondary-600">
              Find answers to common questions about donating and using
              BarakahAid
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="p-6 cursor-pointer rounded-xl bg-secondary-50 group"
              >
                <summary className="flex items-center justify-between text-lg font-bold text-secondary-900">
                  {faq.question}
                  <HiChevronRight className="w-5 h-5 transition-transform transform text-primary-600 group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-relaxed text-secondary-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-secondary-600">Still have questions?</p>
            <Link to="/contact">
              <SecondaryButton>Contact Support</SecondaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Disaster Recovery Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-secondary-900 md:text-4xl" data-text-split data-letters-slide-up>
                Disaster Recovery
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-secondary-600">
                Support immediate relief for disaster-stricken regions while
                helping communities build toward lasting recovery and
                resilience.
              </p>
              <div className="flex gap-4">
                <Link to="/register">
                  <PrimaryButton>Donate now!</PrimaryButton>
                </Link>
                <Link to="/login">
                  <SecondaryButton>Learn more</SecondaryButton>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&q=80"
                alt="Disaster Recovery"
                className="object-cover w-full shadow-lg rounded-2xl h-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-secondary-900 md:text-4xl" data-text-split data-letters-slide-up>
            News
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {news.map((article, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 transition-shadow bg-white border rounded-xl border-secondary-200 hover:shadow-card"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="flex-shrink-0 object-cover w-32 h-32 rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-secondary-900 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mb-3 text-sm text-secondary-600 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <button className="text-sm font-medium text-primary-600 hover:underline">
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-white">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary-100">
              <HiHeart className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>
            Get incredible stories, promotions,
            <br />& offers in your inbox
          </h2>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex max-w-md gap-3 mx-auto mt-8"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <PrimaryButton type="submit">Subscribe</PrimaryButton>
          </form>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl" data-text-split data-letters-slide-up>
            Ready to Make a Difference?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-primary-100">
            Join thousands of compassionate individuals making the world a
            better place. Your contribution, no matter the size, creates lasting
            change.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <PrimaryButton buttonType="secondary">Start Donating Today!</PrimaryButton>
            </Link>
            <Link to="/campaigns">
              <SecondaryButton buttonType="secondary">Browser Campaigns</SecondaryButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
