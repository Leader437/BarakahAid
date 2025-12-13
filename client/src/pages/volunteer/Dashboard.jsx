import React from "react";
import { Link } from "react-router-dom";
import {
  HiCalendar,
  HiClock,
  HiUserGroup,
  HiTrendingUp,
  HiHeart,
  HiCheckCircle,
  HiLocationMarker,
  HiStar,
} from "react-icons/hi";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import { useSelector } from "react-redux";

const VolunteerDashboard = () => {
  const { user } = useSelector((state) => state.user);

  // Mock data
  const stats = [
    {
      label: "Hours Contributed",
      value: "124",
      change: "+18 this month",
      icon: HiClock,
      color: "primary",
    },
    {
      label: "Events Attended",
      value: "15",
      change: "3 upcoming",
      icon: HiCalendar,
      color: "success",
    },
    {
      label: "People Helped",
      value: "450+",
      change: "Direct impact",
      icon: HiHeart,
      color: "error",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Food Distribution Drive",
      date: "2025-12-15",
      time: "09:00 AM",
      location: "Community Center, Downtown",
      spotsLeft: 5,
      totalSpots: 20,
      type: "Food Relief",
    },
    {
      id: 2,
      title: "Winter Clothing Collection",
      date: "2025-12-18",
      time: "02:00 PM",
      location: "City Plaza",
      spotsLeft: 8,
      totalSpots: 15,
      type: "Clothing",
    },
    {
      id: 3,
      title: "Educational Workshop for Kids",
      date: "2025-12-20",
      time: "10:00 AM",
      location: "Learning Center",
      spotsLeft: 3,
      totalSpots: 10,
      type: "Education",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: "Emergency Relief Package Assembly",
      date: "2025-12-10",
      hours: 6,
      status: "completed",
      badge: "Team Leader",
    },
    {
      id: 2,
      title: "Community Meal Preparation",
      date: "2025-12-08",
      hours: 4,
      status: "completed",
      badge: null,
    },
    {
      id: 3,
      title: "Fundraising Event Support",
      date: "2025-12-05",
      hours: 5,
      status: "completed",
      badge: "Outstanding",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Rising Star",
      description: "Completed 10 volunteer events",
      icon: HiStar,
      earned: true,
    },
    {
      id: 2,
      title: "Time Champion",
      description: "Contributed 100+ hours",
      icon: HiClock,
      earned: true,
    },
    {
      id: 3,
      title: "Team Player",
      description: "Led 5 volunteer teams",
      icon: HiUserGroup,
      earned: false,
    },
  ];

  const colorClasses = {
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-100 text-success-700",
    error: "bg-error-100 text-error-700",
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {user?.name || "Volunteer"}! 👋
          </h1>
          <p className="mt-1 text-secondary-600">
            Track your volunteer activities and find new opportunities to make a
            difference
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} padding="lg" hoverable>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-secondary-600">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-secondary-900">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-secondary-500">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Upcoming Events */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">
                  Upcoming Events
                </h2>
                <Link to="/volunteer/browse-events">
                  <SecondaryButton>View All</SecondaryButton>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 transition-colors border rounded-lg border-secondary-200 hover:bg-secondary-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                            {event.type}
                          </span>
                          {event.spotsLeft <= 5 && (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
                              Only {event.spotsLeft} spots left
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                          {event.title}
                        </h3>
                        <div className="space-y-1 text-sm text-secondary-600">
                          <div className="flex items-center gap-2">
                            <HiCalendar className="w-4 h-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HiClock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HiLocationMarker className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HiUserGroup className="w-4 h-4" />
                            <span>
                              {event.totalSpots - event.spotsLeft}/
                              {event.totalSpots} volunteers registered
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <PrimaryButton>Register</PrimaryButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">
                  Recent Activity
                </h2>
                <Link to="/volunteer/my-activities">
                  <SecondaryButton>View All</SecondaryButton>
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg border-secondary-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-success-100">
                        <HiCheckCircle className="w-5 h-5 text-success-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {new Date(activity.date).toLocaleDateString()} •{" "}
                          {activity.hours} hours
                        </p>
                        {activity.badge && (
                          <span className="inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
                            🏆 {activity.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Quick Actions */}
            <Card padding="lg">
              <h2 className="mb-4 text-lg font-bold text-secondary-900">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <div>
                  <Link to="/volunteer/browse-events">
                    <PrimaryButton className="w-full">
                      <HiCalendar className="w-5 h-5" />
                      Browse Events
                    </PrimaryButton>
                  </Link>
                </div>
                <div>
                  <Link to="/volunteer/my-activities">
                    <SecondaryButton className="w-full">
                      <HiClock className="w-5 h-5" />
                      My Activities
                    </SecondaryButton>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card padding="lg">
              <h2 className="mb-4 text-lg font-bold text-secondary-900">
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.earned
                        ? "bg-primary-50 border-primary-200"
                        : "bg-secondary-50 border-secondary-200 opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <achievement.icon
                        className={`w-6 h-6 ${
                          achievement.earned
                            ? "text-primary-600"
                            : "text-secondary-400"
                        }`}
                      />
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-secondary-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Impact Summary */}
            <Card padding="lg" className="bg-primary-50">
              <h2 className="mb-4 text-lg font-bold text-secondary-900">
                Your Impact
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-secondary-700">
                    Helped feed 120 families
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-secondary-700">
                    Distributed clothes to 80 people
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-primary-600" />
                  <span className="text-secondary-700">Taught 45 children</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
