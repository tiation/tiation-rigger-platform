# Tiation Rigger Platform

Enterprise-grade platform for construction and mining industry recruitment in Western Australia. Features dark neon theme with mobile-first design.

## 🌐 Live Sites
- **Platform Demo**: [Visit Live Demo](https://tiation.github.io/tiation-rigger-platform)
- **Developer Profile**: [View Profile](https://tiation.github.io/tiation-rigger-platform/profile)

## 🏗️ Enterprise Workforce Management & Job Marketplace

A comprehensive platform connecting riggers and construction workers with projects while ensuring safety and compliance.

### 🎯 Business Value
- **Workforce Marketplace**: Connect skilled riggers with construction projects
- **Safety Management**: Real-time safety monitoring and compliance tracking  
- **Job Coordination**: Streamlined project management and worker allocation
- **Analytics Dashboard**: Performance metrics and safety insights

### 🏗️ Architecture

```
ti...
**Migration Progress**: 🚧 In Progress - Setting up unified platform structure
│   ├── shared/              # Shared TypeScript types & utilities
│   ├── ui/                  # React component library
│   └── database/            # Database schemas & migrations
├── infrastructure/
│   ├── docker/              # Container configurations
│   ├── k8s/                 # Kubernetes manifests
│   └── ci-cd/               # GitHub Actions workflows
└── docs/
    ├── api/                 # API documentation
    └── deployment/          # Deployment guides
```

### 🚀 Technology Stack

**Frontend**
- **Web**: Next.js 14, TypeScript, Tailwind CSS
- **Mobile**: React Native, TypeScript
- **UI Library**: Custom component system with Tailwind

**Backend**
- **API**: Node.js, TypeScript, Express/Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: WebSocket connections for live updates

**Infrastructure**
- **Containers**: Docker & Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus & Grafana
- **Deployment**: AWS/GCP with Terraform

### 🔧 Development Setup

```bash
# Clone and setup
git clone <repo-url>
cd tiation-rigger-platform
npm install

# Start development environment
npm run dev

# Run all services
docker-compose up -d
```

### 📱 Applications

#### **Mobile App** (`apps/mobile/`)
- Cross-platform React Native application
- Worker profiles and job applications
- Real-time job notifications
- Safety check-ins and reporting
- GPS tracking for job sites

#### **Web Dashboard** (`apps/web/`)
- Project manager admin interface
- Job posting and management
- Worker verification and onboarding
- Safety compliance monitoring
- Analytics and reporting

#### **API Service** (`apps/api/`)
- RESTful API with OpenAPI documentation
- Real-time WebSocket connections
- Authentication and authorization
- Integration with external services
- Background job processing

### 🎯 Key Features

**For Workers (Riggers)**
- Profile management and skill verification
- Job search and application system
- Safety certification tracking
- Real-time job notifications
- Work history and performance metrics

**For Project Managers**
- Job posting and requirements management
- Worker search and verification
- Project timeline and resource planning
- Safety compliance monitoring
- Performance analytics and reporting

**For Administrators**
- Platform oversight and management
- Safety regulation compliance
- User verification and onboarding
- System monitoring and maintenance
- Business intelligence and reporting

### 🔒 Security & Compliance

- **Data Protection**: GDPR compliant data handling
- **Authentication**: Multi-factor authentication support
- **Authorization**: Role-based access control (RBAC)
- **Safety Compliance**: Industry safety standard tracking
- **Audit Trails**: Comprehensive logging and monitoring

### 📊 Metrics & Analytics

- **Worker Safety**: Incident tracking and prevention
- **Project Efficiency**: Timeline and resource optimization
- **Platform Usage**: User engagement and retention
- **Business Intelligence**: Revenue and growth metrics

### 🚀 Deployment

**Development**
```bash
npm run dev          # Start all services
npm run test         # Run test suite
npm run build        # Build for production
```

**Production**
```bash
npm run deploy:staging    # Deploy to staging
npm run deploy:prod      # Deploy to production
npm run deploy:mobile    # Deploy mobile apps
```

### 📚 Documentation

- [API Documentation](./docs/api/)
- [Mobile App Guide](./docs/mobile/)
- [Web Dashboard Guide](./docs/web/)
- [Deployment Guide](./docs/deployment/)
- [Contributing Guidelines](./CONTRIBUTING.md)

### 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🎯 Migration Status

**Consolidating from:**
- `rigger-connect-AutomationServer`
- `rigger-connect-Infrastructure` 
- `rigger-connect-MetricsDashboard`
- `rigger-connect-RiggerConnect`
- `rigger-connect-RiggerConnectApp`
- `rigger-connect-RiggerConnectMobileApp`
- `rigger-connect-RiggerJobsApp`
- `rigger-connect-Shared`
- `tiation-rigger-automation-server`
- `tiation-rigger-connect-api`
- `tiation-rigger-connect-app`
- `tiation-rigger-hire-app`
- `tiation-rigger-infrastructure`
- `tiation-rigger-jobs-app`
- `tiation-rigger-metrics-dashboard`
- `tiation-rigger-mobile-app`
- `tiation-rigger-shared-libraries`
- `riggerhireapp`

**Migration Progress**: 🚧 In Progress - Setting up unified platform structure
