```markdown
# 🛠 DEV_CHECKLIST.md — Ritualized Build Flow

## 🚀 Pre-Build Ritual
- [ ] 🔄 รัน `npm dedupe` หรือ `pnpm dedupe` เพื่อลด dependency duplication
- [ ] 📦 ตรวจสอบว่า `node --max-old-space-size=8192` ถูกตั้งค่า (ถ้า RAM พอ)
- [ ] 🧹 ลบ `.vite` และ `dist/` ก่อน build (`rm -rf .vite dist`)

## ⚡ Build Ritual
- [ ] 🏗️ รัน `vite build --minify esbuild`
- [ ] 📊 ตรวจสอบ chunk splitting:
  - `react` → แยกออกมา
  - `wagmi` + `viem` → แยกออกมา
  - `@coinbase/wallet-sdk` → แยกออกมา
- [ ] ✅ ตรวจสอบว่าไม่มี “Killed” หรือ memory error

## 🎉 Post-Build Celebration
- [ ] 🏅 ถ้า build สำเร็จ → commit พร้อม mystical badge:
  ```bash
  git commit -m "✨ Build Success — [Badge: 🏆 Ritual Complete]"
  ```
- [ ] 📜 อัปเดต contributor log:
  - วันที่
  - Commit hash
  - Badge ที่ได้รับ
- [ ] 🔔 แจ้ง contributor fleet: “Build ritual สำเร็จแล้ว 🎉”

## 🧭 Recovery Ritual (ถ้า build fail)
- [ ] 🔍 ตรวจสอบ log ว่า fail ที่ขั้นตอน tree-shaking หรือ minify
- [ ] 🛡️ ถ้า memory error → เพิ่ม swap หรือใช้เครื่อง RAM สูงกว่า
- [ ] 🧩 ถ้า dependency conflict → รัน `npm dedupe` อีกครั้ง
- [ ] 🔄 ถ้า error จาก annotation → ใช้ `manualChunks` เพื่อลดการ optimize

---

## 🏆 Badge System
- **First Build Success** → 🌱 Seed Ritual
- **3 Consecutive Builds** → 🔥 Flame Ritual
- **10 Consecutive Builds** → 🏆 Ascension Ritual
- **Recovery from Fail** → 🛡️ Guardian Ritual

---
✨ ทุกครั้งที่ build สำเร็จคือการเฉลิมฉลอง contributor ecosystem ของเรา
```

---

ผมออกแบบให้ checklist นี้เป็นทั้ง **คู่มือ reproducible build** และ **พิธีกรรม contributor celebration** เลยครับ — ทุกครั้งที่ build ผ่านจะมี badge system ให้ทีมรู้สึกเหมือนผ่านด่านเกม 🎮