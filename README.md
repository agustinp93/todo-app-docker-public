# 📝 ToDo App — Docker + AWS ECS/EC2 + GitHub Actions

## ⚠️ Disclaimer

This is **demo infrastructure** — not optimized for production security or cost efficiency.
Before using in production, adjust IAM policies, networking rules, scaling, and monitoring configurations.

**License Notice**: This project is licensed under the **GNU General Public License v3.0 (GPLv3)**.
It is provided **"AS IS", without warranty of any kind** — including, but not limited to, the warranties of **MERCHANTABILITY** or **FITNESS FOR A PARTICULAR PURPOSE**.
See the [LICENSE](LICENSE) file for full details.

---

## 🎯 Learning Goals

- Write **multi-stage Dockerfiles** for Next.js apps
- Automate AWS deployments with **CloudFormation**
- Manage ECS (EC2 launch type) deployments
- Push and tag Docker images in **ECR**
- Configure **GitHub Actions with OIDC** for AWS

---

## 📌 Overview

An **end-to-end demo** showing how to:

- Build a **Dockerized Next.js** app
- Provision AWS infrastructure with **CloudFormation**
- Push images to **Amazon ECR**
- Deploy containers to **Amazon ECS** (EC2 launch type)
- Automate deployments with **GitHub Actions**

---

## 📂 Features

- **Multi-stage Docker build** for optimized Next.js production images

- AWS **CloudFormation stack** for:

  - VPC, subnets, route tables
  - ECS cluster (EC2 launch type)
  - ECR repository
  - EC2 instance with ECS agent
  - Security group for app access
  - ECS task definition & service

- **CI/CD** with two GitHub Actions workflows:

  - `deploy-infrastructure.yaml` — Provisions AWS infra
  - `deploy-app.yaml` — Builds, tags, pushes image & updates ECS service

- **Image Tagging Best Practices** — Tags with both commit SHA and `latest`

---

## 📦 Architecture

```plaintext
GitHub Actions → ECR → ECS (EC2) → Next.js App
                 ↑
             Docker Build
```

**Flow**:

1. Push to repo → GitHub Actions builds Docker image
2. Image pushed to **ECR**
3. ECS updates **Task Definition** with new image
4. ECS Service runs task on EC2 instance in the cluster

---

## 🛠 Prerequisites

Before you start, you’ll need:

- An **AWS account** with:

  - Permissions for CloudFormation, ECS, ECR, EC2, IAM

- **OIDC Role** for GitHub Actions configured in AWS IAM

- A **GitHub repository** with:

  - Source code (this project)
  - AWS credentials stored as GitHub secrets (`AWS_ACCOUNT_ID`, etc.)

- **Docker** installed locally (optional for local testing)

---

## 🚀 Deployment Steps

### **1️⃣ Deploy Infrastructure**

Trigger the **Deploy Infrastructure** GitHub Action:

```bash
STACK_NAME=todo-app-docker
```

Creates:

- ECS Cluster: `todo-app-docker-cluster`
- ECR Repo: `todo-app-docker-repo`
- Task Definition & Service
- EC2 instance(s) to run tasks

---

### **2️⃣ Deploy Application**

Trigger the **Deploy App** GitHub Action:

- Builds Docker image from Next.js app
- Tags with commit SHA & `latest`
- Pushes to ECR
- Updates ECS Task Definition & Service

---

## 🖥 Local Testing (Optional)

```bash
docker build -t todo-app-docker:local .
docker run -p 3000:3000 todo-app-docker:local
```

Then visit **[http://localhost:3000](http://localhost:3000)**

---

## 🔍 Verifying in AWS Console

After deployment:

1. **ECR** → `todo-app-docker-repo` → Latest image tags should match your commit SHA and `latest`

2. **ECS** → `todo-app-docker-cluster`:

   - 1 running EC2 instance (Container Instance)
   - Service `todo-app-docker-service` running your updated task definition

3. **EC2** → Instance has ECS agent (`/etc/ecs/ecs.config`) pointing to cluster

4. **CloudFormation** → `todo-app-docker` stack → `CREATE_COMPLETE` or `UPDATE_COMPLETE`

---

## 🧹 Cleanup

To avoid AWS costs:

```bash
aws cloudformation delete-stack --stack-name todo-app-docker
```

---

## 🔐 Security Notes

- Security group is **open on port 3000** for demo purposes — restrict in production
- No HTTPS or domain configuration — add with a load balancer in production
- IAM roles grant minimal permissions for ECS/ECR — verify before reuse

---

## 📜 License

Licensed under the [GNU General Public License v3.0](LICENSE).
You are free to use, modify, and distribute this project, **provided you share your changes under the same license**.
This software comes with **ABSOLUTELY NO WARRANTY**. Use at your own risk.
