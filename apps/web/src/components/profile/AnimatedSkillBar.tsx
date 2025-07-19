'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Skill {
  name: string
  level: number
  category: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}

interface AnimatedSkillBarProps {
  skill: Skill
  index: number
  inView: boolean
}

export const AnimatedSkillBar: React.FC<AnimatedSkillBarProps> = ({ skill, index, inView }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0)

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setAnimatedLevel(skill.level)
      }, index * 100)
      return () => clearTimeout(timer)
    }
  }, [inView, skill.level, index])

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'from-green-400 to-green-600'
    if (level >= 80) return 'from-blue-400 to-blue-600'
    if (level >= 70) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getSkillLevelText = (level: number) => {
    if (level >= 90) return 'Expert'
    if (level >= 80) return 'Advanced'
    if (level >= 70) return 'Intermediate'
    return 'Beginner'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {skill.icon && (
                <skill.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {skill.name}
              </h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {skill.category}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  skill.level >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  skill.level >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  skill.level >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {getSkillLevelText(skill.level)}
                </span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {skill.level}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {skill.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {skill.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: inView ? `${skill.level}%` : 0 }}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className={`h-full bg-gradient-to-r ${getSkillLevelColor(skill.level)} relative overflow-hidden`}
            >
              {/* Shimmer effect */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: inView ? "100%" : "-100%" }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.1 + 0.5,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent opacity-30"
              />
            </motion.div>
          </div>
          
          {/* Level markers */}
          <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Hover effect - additional info */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: inView ? 1 : 0,
            height: inView ? 'auto' : 0 
          }}
          transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
          className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Experience Level</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 + 1.5 + i * 0.05 }}
                  className={`w-2 h-2 rounded-full mr-1 ${
                    i < Math.floor(skill.level / 20) 
                      ? 'bg-indigo-500' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}