'use client'

import React from 'react'
import { 
  ChartBarIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { StatCard } from '../components/ui/StatCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { SafetyOverview } from '../components/dashboard/SafetyOverview'
import { JobsOverview } from '../components/dashboard/JobsOverview'

const mockStats = [
  {
    name: 'Active Jobs',
    value: '12',
    change: '+2.5%',
    changeType: 'increase' as const,
    icon: BriefcaseIcon,
  },
  {
    name: 'Total Workers',
    value: '48',
    change: '+12%',
    changeType: 'increase' as const,
    icon: UsersIcon,
  },
  {
    name: 'Safety Score',
    value: '98.5%',
    change: '+0.5%',
    changeType: 'increase' as const,
    icon: ShieldCheckIcon,
  },
  {
    name: 'Avg. Response Time',
    value: '2.4h',
    change: '-15%',
    changeType: 'decrease' as const,
    icon: ClockIcon,
  },
]

const mockRecentActivity = [
  {
    id: '1',
    type: 'job_posted',
    title: 'New crane operation job posted',
    description: 'High-rise construction project in CBD',
    timestamp: '2 hours ago',
    icon: BriefcaseIcon,
  },
  {
    id: '2', 
    type: 'worker_certified',
    title: 'John Smith completed safety certification',
    description: 'Height safety and rigging certification',
    timestamp: '4 hours ago',
    icon: CheckCircleIcon,
  },
  {
    id: '3',
    type: 'safety_incident',
    title: 'Safety check completed',
    description: 'Weekly safety inspection - all clear',
    timestamp: '6 hours ago',
    icon: ShieldCheckIcon,
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your workforce today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockStats.map((stat) => (
            <StatCard key={stat.name} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Jobs Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Jobs Overview
                </h2>
              </div>
              <div className="p-6">
                <JobsOverview />
              </div>
            </div>

            {/* Safety Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Safety Overview
                </h2>
              </div>
              <div className="p-6">
                <SafetyOverview />
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <QuickActions />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <RecentActivity activities={mockRecentActivity} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}