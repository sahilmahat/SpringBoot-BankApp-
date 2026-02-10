Spring Boot Bank Application – DevOps Project

This project is an end-to-end DevOps implementation of a simple banking application.
The main goal of this project is not the business logic, but to demonstrate how a production-grade CI/CD + Kubernetes + GitOps pipeline works in real life.

I built this project step by step to understand how modern applications are built, deployed, secured, and operated.

What this project does

The application is a simple bank app with:

A Spring Boot backend (Java 17)

A frontend served using Nginx

A MySQL database

REST APIs with health checks

The real focus is on:

Automation

Security

Deployment

Debugging real production issues

Tech Stack Used

Backend: Spring Boot (Java 17)

Frontend: HTML, CSS, JavaScript (Nginx)

Database: MySQL

CI: Jenkins

Code Quality: SonarQube

Security Scanning: Trivy

Containerization: Docker

Orchestration: Kubernetes (AWS EKS)

Ingress: NGINX Ingress Controller

CD / GitOps: ArgoCD

Cloud: AWS (EC2, EKS)

🔄 CI/CD Flow (High Level)

Developer pushes code to GitHub

Jenkins pipeline triggers automatically

Jenkins performs:

Maven build

SonarQube code analysis

Trivy security scan

Docker image build & push

Kubernetes manifests are updated in Git

ArgoCD syncs changes and deploys to EKS

Application is exposed using NGINX Ingress

☸️ Kubernetes Setup

Separate deployments for:

Backend

Frontend

MySQL

Health checks configured using:

/actuator/health

Secrets managed using Kubernetes Secrets

Ingress routes traffic to frontend, which proxies API calls to backend

🔐 Security & Best Practices

No hardcoded credentials in YAML

Database credentials stored in Kubernetes Secrets

Trivy blocks builds with critical vulnerabilities

SonarQube quality gates enforced

Clean Docker images with Java 17 JVM tuning

Proper liveness & readiness probes

🧪 Real Issues Solved During This Project

This project involved real debugging, not just setup:

Fixed CrashLoopBackOff caused by Java 17 module restrictions

Resolved JVM InaccessibleObjectException using --add-opens

Fixed Kubernetes probe misconfigurations

Resolved Docker permission issues in Jenkins

Fixed Git conflicts between local and remote environments

Debugged frontend ↔ backend networking issues

✅ Final Outcome

Application runs reliably on Kubernetes

CI/CD pipeline is fully automated

Secure, scalable, and production-ready setup

GitOps-ready deployment using ArgoCD

🎯 Why I Built This

I built this project to:

Learn real DevOps, not just tutorials

Understand how production issues actually happen

Practice debugging under realistic conditions

Build something I can confidently explain in interviews

🔮 Future Improvements

Enable ArgoCD auto-sync & self-heal

Add HPA for auto-scaling

Move MySQL to StatefulSet with persistent volumes

Add HTTPS with custom domain

Improve monitoring dashboards

🧑‍💻 Author

Built by Sahil Mahat
DevOps | Cloud | Kubernetes | CI/CD
