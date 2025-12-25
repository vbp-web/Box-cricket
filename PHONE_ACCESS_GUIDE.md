# 📱 Access Website from Phone - Setup Guide

## ✅ Configuration Complete!

I've updated the Vite configuration to allow network access. Now follow these steps:

---

## 🔧 Step-by-Step Instructions

### **Step 1: Find Your Computer's IP Address**

**On Windows:**
1. Press `Win + R` on your keyboard
2. Type `cmd` and press Enter
3. In the command prompt, type: `ipconfig`
4. Press Enter
5. Look for **"IPv4 Address"** under your Wi-Fi or Ethernet adapter
6. Note down the IP address (e.g., `192.168.1.100`)

**Example Output:**
```
Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . :
   IPv4 Address. . . . . . . . . . . : 192.168.1.100  ← This is your IP!
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
```

---

### **Step 2: Restart Frontend Server**

The Vite server needs to restart to apply the new configuration:

1. In your terminal running the frontend, press `Ctrl + C` to stop it
2. Run again: `npm run dev`
3. You should see output like:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.100:5173/  ← Use this on your phone!
   ```

---

### **Step 3: Check Windows Firewall**

Windows Firewall might block incoming connections:

**Option 1: Allow Node.js (Recommended)**
1. Search for "Windows Defender Firewall" in Start menu
2. Click "Allow an app through firewall"
3. Click "Change settings"
4. Find "Node.js" in the list
5. Check both "Private" and "Public" boxes
6. Click OK

**Option 2: Temporarily Disable Firewall (For Testing)**
1. Search for "Windows Defender Firewall"
2. Click "Turn Windows Defender Firewall on or off"
3. Select "Turn off" for Private network
4. Click OK
5. **Remember to turn it back on after testing!**

---

### **Step 4: Access from Your Phone**

1. Make sure your phone is connected to the **same Wi-Fi network** as your computer
2. Open a browser on your phone (Chrome, Safari, etc.)
3. Type in the address bar:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   **Example:** `http://192.168.1.100:5173`

4. Press Go/Enter

---

## 🎯 Quick Reference

### **URLs to Use:**

**On Your Computer:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

**On Your Phone:**
- Frontend: `http://YOUR_IP:5173`
- Example: `http://192.168.1.100:5173`

---

## ⚠️ Troubleshooting

### **Problem: Can't find IP address**
**Solution:**
```bash
# Run this in Command Prompt:
ipconfig | findstr IPv4
```

### **Problem: Connection refused on phone**
**Check:**
1. ✅ Both devices on same Wi-Fi network
2. ✅ Frontend server is running
3. ✅ Used correct IP address (not localhost)
4. ✅ Windows Firewall allows Node.js
5. ✅ Typed `http://` before the IP address

### **Problem: Page loads but API doesn't work**
**Solution:**
The backend also needs to accept network connections. Update `backend/server.js`:

```javascript
// Change from:
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// To:
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Network: http://YOUR_IP:${PORT}`);
});
```

### **Problem: Vite shows network URL but phone can't connect**
**Check Firewall:**
```powershell
# Run in PowerShell as Administrator:
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5173
```

---

## 🔥 Quick Test

1. **Get your IP:** Run `ipconfig` in Command Prompt
2. **Restart frontend:** Stop and start `npm run dev`
3. **Check firewall:** Allow Node.js in Windows Firewall
4. **On phone:** Go to `http://YOUR_IP:5173`

---

## 📝 Example Setup

**Computer IP:** `192.168.1.100`

**Access URLs:**
- Computer: `http://localhost:5173`
- Phone: `http://192.168.1.100:5173`
- Tablet: `http://192.168.1.100:5173`
- Any device on same network: `http://192.168.1.100:5173`

---

## ✅ Success Indicators

When it works, you'll see:
- ✅ Vite shows "Network: http://YOUR_IP:5173" when starting
- ✅ Phone browser loads the website
- ✅ You can interact with the site on your phone
- ✅ Bookings and API calls work

---

## 🎉 Benefits

Once set up:
- ✅ Test on real mobile devices
- ✅ Check responsive design
- ✅ Test touch interactions
- ✅ Share with team members on same network
- ✅ Demo to clients

---

**Last Updated:** December 23, 2025  
**Status:** ✅ Configuration Complete - Follow steps above!
