# 📱 Quick Mobile Testing Guide

## 🚀 Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🔍 Find Your IP

```bash
ipconfig | findstr IPv4
```
Example output: `192.168.1.100`

## 📱 Access on Mobile

1. Connect phone to **same Wi-Fi** as PC
2. Open browser on phone
3. Go to: `http://YOUR_IP:5173`
   - Example: `http://192.168.1.100:5173`

## ✅ Verify It Works

**Test 1 - Health Check:**
```
http://YOUR_IP:5000/health
```
Should return JSON with `"success": true`

**Test 2 - Turfs API:**
```
http://YOUR_IP:5000/api/turfs
```
Should return list of turfs

**Test 3 - Frontend:**
```
http://YOUR_IP:5173
```
Should load the website

**Test 4 - Browser Console:**
Open console (F12), should see:
```
🔗 API URL: http://YOUR_IP:5000/api
```

## 🔧 If It Doesn't Work

1. **Check Firewall:**
   - Allow Node.js in Windows Firewall
   - Or temporarily disable for testing

2. **Verify Servers:**
   - Both backend and frontend running
   - Check terminal for errors

3. **Network:**
   - Both devices on same Wi-Fi
   - No VPN active

4. **Clear Cache:**
   - Hard refresh on mobile
   - Clear browser cache

## 🎯 What Changed

The API URL now automatically detects your IP:
- **On PC:** Uses `localhost`
- **On Mobile:** Uses your PC's IP address

No manual configuration needed! 🎉

---

For detailed troubleshooting, see: `MOBILE_FIX_GUIDE.md`
