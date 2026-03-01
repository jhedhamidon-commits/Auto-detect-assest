# HAMMS Asset AutoDetect v2.1
**DOPMC · GSD · Hospital Asset Management & Maintenance System**
> Room-by-room asset inspection tool with offline support and CSV export.

---

## 📁 Folder Structure

```
hamms-autodetect/
├── index.html           ← Full app (PWA-patched)
├── manifest.json        ← PWA manifest
├── service-worker.js    ← Offline cache logic
├── README.md            ← This file
└── icons/
    ├── icon-192.png     ← App icon 192×192
    └── icon-512.png     ← App icon 512×512
```

---

## 🚀 Step 1 — Host on GitHub Pages (Free HTTPS)

PWA requires HTTPS. GitHub Pages is free.

1. Go to **https://github.com** → Sign in or Sign up
2. Tap **+** → **New repository**
   - Name: `hamms-autodetect`
   - Set to **Public**
   - Tap **Create repository**
3. Upload all files:
   - Tap **Add file** → **Upload files**
   - Upload: `index.html`, `manifest.json`, `service-worker.js`, `README.md`
   - For icons: upload `icon-192.png` and `icon-512.png`
     - In the filename field type: `icons/icon-192.png` → GitHub auto-creates the folder
   - Tap **Commit changes**
4. Enable Pages:
   - Go to **Settings** → **Pages** (left sidebar)
   - Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
   - Tap **Save** → wait 2–3 minutes
5. Your live URL will be:
   ```
   https://YOUR-USERNAME.github.io/hamms-autodetect/
   ```

---

## 📱 Step 2 — Install as PWA on Android

1. Open your GitHub Pages URL in **Chrome**
2. Wait ~10 seconds for service worker to register
3. Chrome shows banner: **"Add HAMMS to Home Screen"**
   - Tap **Install**
   - If no banner: tap Chrome **⋮ menu** → **Install app**
4. HAMMS icon appears on your home screen
5. **Test offline:** Enable Airplane Mode → tap the icon → app still works ✅

---

## 📦 Step 3 — Build Android APK with PWABuilder

1. Open **https://www.pwabuilder.com** in Chrome
2. Paste your GitHub Pages URL → tap **Start**
3. Wait for PWA score (should show green for Manifest, SW, Security)
4. Tap **Package for stores** → select **Android**
5. Tap **Generate Package** → **Download** (you get a `.zip`)
6. Extract the zip (use ZArchiver app on Android)
7. Tap the `.apk` file to install
   - If blocked: **Settings** → **Install unknown apps** → enable for your file manager

---

## ✅ Deploy Checklist

- [ ] `index.html` uploaded to repo root
- [ ] `manifest.json` uploaded to repo root
- [ ] `service-worker.js` uploaded to repo root
- [ ] `icons/icon-192.png` in `icons/` subfolder
- [ ] `icons/icon-512.png` in `icons/` subfolder
- [ ] GitHub Pages enabled on `main` branch
- [ ] HTTPS URL loads correctly in Chrome
- [ ] PWA install banner appeared
- [ ] Offline mode tested (Airplane mode)
- [ ] PWABuilder scored green
- [ ] APK downloaded and installed

---

## ⚙️ PWA Technical Details

| Property | Value |
|---|---|
| Cache Name | `mantrack-cache-v1` |
| Display | `standalone` |
| Theme Color | `#0f172a` |
| Background | `#090d12` |
| Offline Strategy | Cache-first for shell, Network-first for CDN |
| SW Scope | `./` |

---

## 🔧 Troubleshooting

**"Install app" not showing in Chrome**
→ Must be on HTTPS URL, not `file://`. Wait 30s after page loads.

**PWABuilder: "Manifest not found"**
→ Verify `manifest.json` is in repo root. Test: `https://YOUR-URL/manifest.json`

**APK installs but shows blank screen**
→ Uninstall, clear Chrome cache, reinstall APK.

**Icons not showing on home screen**
→ Check `https://YOUR-URL/icons/icon-192.png` loads in browser.

---

## 📋 App Features

- **Session setup** — Ward name, Inspector, Date
- **Smart room detection** — Type room name, auto-suggest assets
- **20 room templates** — Ward, ICU, OR, Delivery Room, Corridor, CR, etc.
- **7 asset categories** — Electrical, Ventilation, Plumbing, Civil, Medical, Safety, Housekeeping
- **Spec picker per asset** — Wattage, capacity, type, size, brand, gang, etc.
- **Condition tagging** — ✅ Good / 🔧 Need Repair / ❌ For Replacement
- **Session panel** — All rooms tracked with live summary counts
- **Master CSV export** — All rooms, specs, conditions, remarks in one file
- **Fully offline** — Works with no internet after first load

---

*DOPMC · General Services Division · HAMMS v2.0*
