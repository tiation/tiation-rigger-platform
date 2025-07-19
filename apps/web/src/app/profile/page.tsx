'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  HeartIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  DevicePhoneMobileIcon,
  ServerIcon,
  CloudIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { InteractiveProjectCard } from '../../components/profile/InteractiveProjectCard'
import { AnimatedSkillBar } from '../../components/profile/AnimatedSkillBar'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const ProfilePage = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const skillsRef = React.useRef(null)
  const skillsInView = useInView(skillsRef, { once: true, threshold: 0.2 })

  useEffect(() => setMounted(true), [])

  const skills = [
    { 
      name: 'React/Next.js', 
      level: 95, 
      category: 'Frontend',
      icon: CodeBracketIcon,
      description: 'Expert in modern React patterns, Next.js 13+ with app router, and advanced state management'
    },
    { 
      name: 'TypeScript', 
      level: 92, 
      category: 'Language',
      icon: CpuChipIcon,
      description: 'Strong typing, advanced generics, and architectural patterns for large-scale applications'
    },
    { 
      name: 'Node.js', 
      level: 88, 
      category: 'Backend',
      icon: ServerIcon,
      description: 'Scalable APIs, microservices architecture, and real-time applications with Socket.io'
    },
    { 
      name: 'PostgreSQL', 
      level: 85, 
      category: 'Database',
      icon: ChartBarIcon,
      description: 'Complex queries, performance optimization, and database design for enterprise applications'
    },
    { 
      name: 'AWS/Cloud', 
      level: 82, 
      category: 'Infrastructure',
      icon: CloudIcon,
      description: 'Containerized deployments, serverless architecture, and CI/CD pipeline automation'
    },
    { 
      name: 'React Native', 
      level: 78, 
      category: 'Mobile',
      icon: DevicePhoneMobileIcon,
      description: 'Cross-platform mobile development with native performance and platform-specific features'
    },
    { 
      name: 'Swift/iOS', 
      level: 75, 
      category: 'Mobile',
      icon: DevicePhoneMobileIcon,
      description: 'Native iOS development with SwiftUI and integration with React Native projects'
    },
    { 
      name: 'System Design', 
      level: 90, 
      category: 'Architecture',
      icon: CpuChipIcon,
      description: 'Designing scalable systems handling millions of users with high availability requirements'
    }
  ]

  const projects = [
    {
      title: 'Rigger Platform',
      description: 'Enterprise workforce management platform for construction industry with real-time safety monitoring and job coordination.',
      tech: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Docker'],
      impact: '50K+ workers managed',
      status: 'Active',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      details: {
        features: [
          'Real-time safety monitoring with IoT sensors',
          'AI-powered risk assessment and prediction',
          'Mobile-first design for field workers',
          'Advanced analytics and reporting dashboard',
          'Integration with existing HR and payroll systems'
        ],
        metrics: [
          { label: 'Safety Incidents Reduced', value: '78%' },
          { label: 'Worker Efficiency Improved', value: '45%' },
          { label: 'Compliance Score', value: '98.5%' },
          { label: 'Response Time', value: '2.4h' }
        ],
        links: [
          { label: 'Live Demo', url: '#demo' },
          { label: 'Case Study', url: '#case-study' }
        ]
      }
    },
    {
      title: 'Social Impact Analytics',
      description: 'AI-powered platform measuring and optimizing social outcomes for non-profit organizations.',
      tech: ['React', 'Python', 'TensorFlow', 'MongoDB'],
      impact: '200+ organizations served',
      status: 'Launched',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      details: {
        features: [
          'Machine learning models for impact prediction',
          'Real-time data visualization and reporting',
          'Community feedback integration',
          'Multi-language support for global organizations',
          'API for third-party integrations'
        ],
        metrics: [
          { label: 'Data Accuracy', value: '94%' },
          { label: 'Organizations Served', value: '200+' },
          { label: 'Lives Impacted', value: '1.2M+' },
          { label: 'Cost Reduction', value: '60%' }
        ],
        links: [
          { label: 'Platform', url: '#platform' },
          { label: 'Research Paper', url: '#research' }
        ]
      }
    },
    {
      title: 'Crisis Response Network',
      description: 'Distributed system connecting resources during emergencies, built after personal experience with systemic failures.',
      tech: ['Vue.js', 'Firebase', 'WebRTC', 'PWA'],
      impact: '15 communities connected',
      status: 'Beta',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      details: {
        features: [
          'Real-time resource matching and allocation',
          'Peer-to-peer communication network',
          'Offline-first Progressive Web App',
          'Multi-modal communication (text, voice, video)',
          'Emergency alert broadcasting system'
        ],
        metrics: [
          { label: 'Response Time', value: '<5min' },
          { label: 'Communities Connected', value: '15' },
          { label: 'Resources Coordinated', value: '500+' },
          { label: 'Uptime', value: '99.8%' }
        ],
        links: [
          { label: 'GitHub', url: 'https://github.com/tiation/crisis-response' },
          { label: 'Documentation', url: '#docs' }
        ]
      }
    }
  ]

  const timeline = [
    {
      year: '2024',
      role: 'Founder & CEO',
      company: 'Tiation',
      description: 'Building technology solutions for systemic change in workforce management and social innovation.'
    },
    {
      year: '2022-2023',
      role: 'Senior Full-Stack Engineer',
      company: 'Tech for Good Initiative',
      description: 'Led development of platforms serving 100k+ users in the social impact space.'
    },
    {
      year: '2020-2022',
      role: 'Systems Architect',
      company: 'Enterprise Solutions Corp',
      description: 'Designed scalable systems handling millions of daily transactions.'
    },
    {
      year: '2019',
      role: 'Product Engineer',
      company: 'Startup Accelerator',
      description: 'Built MVP products for early-stage startups focused on social innovation.'
    }
  ]

  const metrics = [
    { label: 'Lines of Code', value: '500K+', icon: CodeBracketIcon },
    { label: 'Users Impacted', value: '250K+', icon: UserGroupIcon },
    { label: 'Projects Delivered', value: '50+', icon: BriefcaseIcon },
    { label: 'Organizations Served', value: '200+', icon: ShieldCheckIcon }
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {theme === 'dark' ? 
          <SunIcon className="h-6 w-6 text-yellow-500" /> : 
          <MoonIcon className="h-6 w-6 text-gray-600" />
        }
      </motion.button>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="relative inline-block">
                <img
                  src="https://github.com/tiation.png"
                  alt="Tia Astor"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6">
              Tia Astor
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl mb-4 opacity-90">
              Systems Designer & Social Innovation Architect
            </motion.p>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl mb-8 opacity-80 max-w-3xl mx-auto">
              "People are good. Systems are broken." — Building technology that transforms grief into systemic solutions.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5" />
                <span>Global Remote</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5" />
                <span>contact@tiation.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>tiation.com</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Metrics */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-4">
                  <metric.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Key Projects */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Key Projects
          </motion.h2>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <InteractiveProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Technical Skills
          </motion.h2>
          
          <div ref={skillsRef} className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {skills.map((skill, index) => (
              <AnimatedSkillBar
                key={skill.name}
                skill={skill}
                index={index}
                inView={skillsInView}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Career Timeline */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Career Journey
          </motion.h2>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative pl-20 pb-12 last:pb-0"
              >
                <div className="absolute left-6 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.role}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {item.company}
                      </p>
                    </div>
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Philosophy & Current Focus */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Philosophy & Approach
                </h3>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  My work is deeply personal—born from grief and transformed into systemic solutions. 
                  After losing my father to preventable circumstances, I realized that individual tragedies 
                  often stem from broken systems.
                </p>
                <p>
                  I believe technology should serve humanity, not the other way around. Every line of code 
                  I write is guided by the principle that small, intentional changes can create ripple 
                  effects that transform entire systems.
                </p>
                <p>
                  My approach combines technical excellence with deep empathy, always asking: 
                  "How can this make someone's life genuinely better?"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <RocketLaunchIcon className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Current Focus
                </h3>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Workforce Safety Revolution
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Building AI-powered safety systems that predict and prevent workplace accidents 
                    in high-risk industries like construction and mining.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ChartBarIcon className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Social Impact Measurement
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Developing platforms that help organizations measure and optimize their social 
                    impact using real-time data and community feedback.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AcademicCapIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Mentorship & Education
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Teaching the next generation of engineers to build with purpose, 
                    focusing on ethics, accessibility, and social responsibility.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xl mb-4">
              "The best way to predict the future is to build it—with purpose."
            </p>
            <p className="text-gray-400">
              Building tomorrow's solutions, today. Let's create something meaningful together.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default ProfilePage