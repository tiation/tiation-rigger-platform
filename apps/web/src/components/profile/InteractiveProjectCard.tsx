'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Project {
  title: string
  description: string
  tech: string[]
  impact: string
  status: string
  color: string
  details?: {
    features: string[]
    metrics: { label: string; value: string }[]
    links?: { label: string; url: string }[]
  }
}

interface InteractiveProjectCardProps {
  project: Project
  index: number
}

export const InteractiveProjectCard: React.FC<InteractiveProjectCardProps> = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`h-2 ${project.color} transition-all duration-300 ${isHovered ? 'h-3' : ''}`}></div>
      
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  project.status === 'Launched' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                  {project.status}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {project.description}
        </p>
        
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <ChartBarIcon className="h-4 w-4 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Impact: {project.impact}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, techIndex) => (
              <motion.span 
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && project.details && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6"
            >
              {project.details.features && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <CodeBracketIcon className="h-4 w-4 mr-2" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {project.details.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {project.details.metrics && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {project.details.metrics.map((metric, metricIndex) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: metricIndex * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
                      >
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {metric.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {project.details.links && (
                <div className="flex flex-wrap gap-3">
                  {project.details.links.map((link, linkIndex) => (
                    <motion.a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: linkIndex * 0.1 }}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {link.label}
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}