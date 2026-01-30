# Study Hall Web Application - Deployment Guide

## 🚀 Quick Start

### Local Development
```bash
# Start all services
docker-compose up -d

# Access the application
# Frontend + Backend: http://localhost
# MySQL: localhost:3310
```

### Production Deployment
```bash
# Set environment variables (see Environment Variables section)
# Build and deploy
docker-compose up -d

# Access via your domain
# Example: http://yourdomain.com
```

---

## 📋 Architecture Overview

```
User Browser
     ↓
Nginx (Port 80/443)
     ├─→ / → React Frontend (Static Files)
     └─→ /api/* → Spring Boot Backend (Port 8080)
                      ↓
                  MySQL Database (Port 3306)
```

**Benefits:**
- ✅ **No CORS Issues** - Everything served from same domain
- ✅ **Single Entry Point** - Nginx handles all traffic
- ✅ **Security** - Backend not directly exposed
- ✅ **Easy HTTPS** - Single SSL certificate needed
- ✅ **Scalable** - Easy to add load balancing

---

## 🔧 Environment Variables

### Backend Environment Variables

Set these via Docker Compose or your hosting platform (Azure, AWS, etc.):

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | localhost URLs | `http://yourdomain.com,https://yourdomain.com` |
| `SPRING_DATASOURCE_URL` | MySQL connection string | mysql:3306 | `jdbc:mysql://mysql:3306/studyhall` |
| `SPRING_DATASOURCE_USERNAME` | Database username | root | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - | `your_secure_password` |

### Frontend Environment Variables

Automatically handled via `.env.development` and `.env.production`:

- **Development**: `VITE_API_BASE_URL=http://localhost:8082`
- **Production**: `VITE_API_BASE_URL=/api`

---

## 🌐 Deployment to Cloud Platforms

### Azure App Service

1. **Build and push Docker images:**
   ```bash
   # Backend
   cd backend
   docker build -t your-registry/study-hall-backend:latest .
   docker push your-registry/study-hall-backend:latest

   # Frontend
   cd ../frontend
   docker build -t your-registry/study-hall-frontend:latest .
   docker push your-registry/study-hall-frontend:latest
   ```

2. **Deploy using Azure Container Instances or App Service:**
   - Create a new Web App for Containers
   - Set environment variables in Application Settings
   - Deploy using Docker Compose (Multi-container support)

3. **Configure Custom Domain & SSL:**
   - Add custom domain in Azure Portal
   - Enable SSL certificate (free with App Service)

### AWS EC2 / ECS

1. **Launch EC2 instance or ECS cluster**

2. **Install Docker and Docker Compose:**
   ```bash
   sudo yum update -y
   sudo yum install docker -y
   sudo systemctl start docker
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clone and deploy:**
   ```bash
   git clone your-repo
   cd study-hall-web-app
   docker-compose up -d
   ```

4. **Configure Security Groups:**
   - Allow inbound traffic on ports 80 and 443

### DigitalOcean Droplet

1. **Create Droplet** (Ubuntu 22.04 recommended)

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Deploy application:**
   ```bash
   git clone your-repo
   cd study-hall-web-app
   docker-compose up -d
   ```

4. **Configure Domain:**
   - Point your domain to Droplet IP
   - Use Nginx SSL setup (see HTTPS Setup)

---

## 🔒 HTTPS Setup (SSL/TLS)

### Using Let's Encrypt (Free SSL)

1. **Install Certbot:**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Update nginx.conf to include your domain:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       # ... rest of config
   }
   ```

3. **Obtain certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

4. **Auto-renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

### Using Cloud Provider SSL

Most cloud providers (Azure, AWS) offer free SSL certificates:
- **Azure**: Use App Service Managed Certificate
- **AWS**: Use AWS Certificate Manager (ACM)
- **DigitalOcean**: Use Load Balancer with SSL

---

## 🧪 Testing Your Deployment

### Health Checks

```bash
# Nginx health check
curl http://your-domain/health

# Backend health check (if Spring Actuator is enabled)
curl http://your-domain/api/actuator/health

# Frontend check
curl http://your-domain/
```

### Verify CORS Headers

```bash
# Test CORS preflight request
curl -H "Origin: http://your-domain" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://your-domain/api/students/register \
     -v
```

Expected headers:
```
Access-Control-Allow-Origin: http://your-domain
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

### Browser Console Test

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try registering a student
4. Verify:
   - ✅ No CORS errors
   - ✅ Requests go to `/api/students/register`
   - ✅ Status 200 OK

---

## 🐛 Troubleshooting

### CORS Errors Still Appear

**Solution 1**: Check `CORS_ALLOWED_ORIGINS` environment variable
```bash
docker-compose exec backend env | grep CORS
```

**Solution 2**: Verify Nginx is routing correctly
```bash
docker-compose logs nginx
```

**Solution 3**: Ensure frontend uses `/api` in production
```bash
# Check built frontend files
docker-compose exec frontend cat /app/dist/assets/index-*.js | grep api
```

### Backend Not Accessible

**Check backend is running:**
```bash
docker-compose ps
docker-compose logs backend
```

**Check Nginx can reach backend:**
```bash
docker-compose exec nginx wget -O- http://backend:8080/
```

### Database Connection Issues

**Check MySQL is healthy:**
```bash
docker-compose ps mysql
docker-compose logs mysql
```

**Test connection from backend:**
```bash
docker-compose exec backend curl mysql:3306
```

### Port Already in Use

```bash
# Find what's using port 80
sudo lsof -i :80

# Stop the service or change nginx port
# In compose.yml: - "8080:80" instead of "80:80"
```

---

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Container Stats

```bash
# Real-time resource usage
docker stats

# Specific container
docker stats study-hall-backend
```

---

## 🔄 Updating Your Application

### Pull Latest Images

```bash
# Pull from Docker Hub
docker-compose pull

# Restart services
docker-compose up -d
```

### Rolling Update (Zero Downtime)

```bash
# Scale up with new version
docker-compose up -d --scale backend=2

# Remove old container
docker-compose up -d --scale backend=1
```

---

## 🗄️ Database Backup & Restore

### Backup

```bash
# Backup to file
docker-compose exec mysql mysqldump -u root -pSanjil@2021 studyhall > backup_$(date +%Y%m%d).sql

# Or use Docker volume
docker run --rm --volumes-from study-hall-mysql -v $(pwd):/backup ubuntu tar cvf /backup/mysql_backup.tar /var/lib/mysql
```

### Restore

```bash
# Restore from SQL file
docker-compose exec -T mysql mysql -u root -pSanjil@2021 studyhall < backup_20260130.sql
```

---

## 🎯 Performance Optimization

### Enable Gzip Compression
Already configured in `nginx.conf` ✅

### Add Caching Headers
Already configured for static assets ✅

### Database Connection Pooling
Spring Boot handles this automatically ✅

### Scale Services

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3

# Update nginx.conf to load balance:
upstream backend {
    server backend:8080;
    server backend:8080;
    server backend:8080;
}
```

---

## 📝 Important Notes

1. **Change default passwords** before production deployment
2. **Use environment variables** for sensitive data (never commit to git)
3. **Enable HTTPS** for production (required for most browsers)
4. **Set up automated backups** for database
5. **Monitor logs** regularly for errors
6. **Update Docker images** periodically for security patches

---

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review troubleshooting section above
3. Check environment variables are set correctly
4. Verify all containers are running: `docker-compose ps`

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Let's Encrypt](https://letsencrypt.org/)
