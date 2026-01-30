# AWS Deployment Troubleshooting

## 🔴 Problem: Site Not Reachable (ERR_CONNECTION_TIMED_OUT)

This means your AWS server isn't responding at all. Let's debug step by step.

---

## Step 1: Check if Containers Are Running

SSH into your AWS server and check container status:

```bash
ssh -i ~/Sanjil-Jenkins-Key.pem ec2-user@13.63.49.5

# Once connected, run:
cd ~/study-hall-web-app
sudo docker ps
```

**Expected output:** You should see 4 containers running:
- nginx
- backend
- frontend  
- mysql

**If containers are NOT running**, check what went wrong:
```bash
sudo docker ps -a
sudo docker-compose logs
```

---

## Step 2: Check AWS Security Group (Most Common Issue!)

Your AWS EC2 instance might be blocking port 80.

### Fix in AWS Console:

1. **Go to AWS EC2 Console**
2. **Select your instance** (13.63.49.5)
3. **Click "Security" tab**
4. **Click on your Security Group** link
5. **Click "Edit inbound rules"**
6. **Add these rules if missing:**

| Type | Protocol | Port Range | Source | Description |
|------|----------|-----------|--------|-------------|
| HTTP | TCP | 80 | 0.0.0.0/0 | Allow HTTP traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Allow HTTPS traffic |
| SSH | TCP | 22 | Your IP | SSH access |

7. **Click "Save rules"**

---

## Step 3: Restart Docker Compose

If containers aren't running properly:

```bash
ssh -i ~/Sanjil-Jenkins-Key.pem ec2-user@13.63.49.5

cd ~/study-hall-web-app
sudo docker-compose down
sudo docker-compose pull
sudo docker-compose up -d

# Check status
sudo docker ps
```

---

## Step 4: Check Nginx Logs

If nginx container is running but site still doesn't load:

```bash
sudo docker-compose logs nginx
sudo docker-compose logs backend
```

---

## Step 5: Test Locally on AWS Server

SSH into AWS and test if nginx responds locally:

```bash
curl http://localhost/health
```

Should return: `healthy`

If this works but browser doesn't, it's **definitely a security group issue**.

---

## Quick Diagnostic Commands

Run these on your AWS server:

```bash
# Check all containers
sudo docker ps

# Check nginx specifically
sudo docker ps | grep nginx

# Check if port 80 is listening
sudo netstat -tulpn | grep :80

# Test nginx locally
curl http://localhost/health
curl http://localhost/
```

---

## Most Likely Issue: Security Group

**99% of the time when you get ERR_CONNECTION_TIMED_OUT, it's because:**

✅ AWS Security Group is blocking port 80/443

**Fix:** Add HTTP (port 80) inbound rule to your EC2 security group as shown in Step 2.
