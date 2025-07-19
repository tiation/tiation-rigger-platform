'use client'

import React from 'react'
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

// Mock data for safety metrics
const safetyData = [
  { month: 'Jan', score: 95, incidents: 2, inspections: 12 },
  { month: 'Feb', score: 97, incidents: 1, inspections: 15 },
  { month: 'Mar', score: 94, incidents: 3, inspections: 18 },
  { month: 'Apr', score: 98, incidents: 0, inspections: 20 },
  { month: 'May', score: 96, incidents: 2, inspections: 22 },
  { month: 'Jun', score: 98, incidents: 1, inspections: 25 },
]

const safetyStats = [
  {
    title: 'Safety Score',
    value: '98.5%',
    change: '+0.5%',
    changeType: 'increase' as const,
    icon: ShieldCheckIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Active Incidents',
    value: '0',
    change: '-2',
    changeType: 'decrease' as const,
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    title: 'Inspections This Month',
    value: '25',
    change: '+3',
    changeType: 'increase' as const,
    icon: CheckCircleIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Avg Response Time',
    value: '12 min',
    change: '-3 min',
    changeType: 'decrease' as const,
    icon: ClockIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

const recentIncidents = [
  {
    id: 1,
    type: 'Near Miss',
    description: 'Load swing during crane operation',
    location: 'Site A - Building 3',
    date: '2024-01-15',
    status: 'Resolved',
    severity: 'Low',
  },
  {
    id: 2,
    type: 'Equipment Check',
    description: 'Routine safety inspection completed',
    location: 'Site B - Tower Crane',
    date: '2024-01-14',
    status: 'Completed',
    severity: 'None',
  },
]

export function SafetyOverview() {
  return (
    <div className="space-y-6">
      {/* Safety Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safetyStats.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-gray-700`}>
                  <stat.icon className={`w-5 h-5 ${stat.color} dark:text-white`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Trend Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Safety Trends
          </h3>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Safety Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Incidents</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Inspections</span>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safetyData}>
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Safety Score (%)"
              />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Incidents"
              />
              <Line 
                type="monotone" 
                dataKey="inspections" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Inspections"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Safety Events */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Safety Events
        </h3>
        
        <div className="space-y-4">
          {recentIncidents.map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  incident.severity === 'Low' ? 'bg-yellow-400' :
                  incident.severity === 'None' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {incident.type}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {incident.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {incident.location} • {incident.date}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  incident.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                  incident.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {incident.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            View All Safety Reports →
          </button>
        </div>
      </div>
    </div>
  )
}