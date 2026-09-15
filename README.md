# HEADSHOT — 2D Cover Shooter

A modular, production-ready 2D side-scrolling cover shooter built with **HTML5 Canvas**, **JavaScript**, and **CSS** — inspired by *Garena HeadShot*.

> 🇹🇭 เกมยิงปืนแนว Cover Shooter แบบ 2D มุมมองด้านข้าง พัฒนาด้วย HTML5 Canvas + JavaScript + CSS ล้วน ๆ ไม่มี library หรือ build step ใด ๆ

---

## 📖 Overview / ภาพรวม

- **Perspective:** 2D side-scroller — the player ducks behind cover points and pops up to shoot.
- **Tech stack:** plain `index.html` + `style.css` + `script.js`. No frameworks, no dependencies, no build step.
- **Rendering:** HTML5 Canvas 2D via `requestAnimationFrame`, using a virtual 1200×675 coordinate system that scales to any screen.
- **Playable out of the box:** if sprite/audio files are missing, every entity falls back to clean color-coded geometric shapes, and sound effects are generated procedurally with the Web Audio API — so the game runs 100% with zero assets.

> 🇹🇭 เกมเล่นได้ทันทีแม้ไม่มีไฟล์ภาพ/เสียงใด ๆ ระบบ fallback จะวาดเป็นรูปทรงเรขาคณิตพร้อมป้ายชื่อ เพิ่มยกระดับเสียงแบบ procedural ผ่าน Web Audio API ให้ฟรีทั้งระบบ.

---

## ✨ Features / คุณสมบัติ

- 🧱 **Cover system** — auto-duck behind cover, pop up only while firing, covers have durability and can be destroyed.
- 🔫 **3 weapons** — Assault Rifle, Shotgun, Sniper Rifle with genuinely different behaviour (magazine, fire rate, spread, piercing, headshot bonus).
- 👾 **3 enemy types** — Regular soldier, sniper (red laser charge warning), and a missile boss who is vulnerable while preparing a launch.
- 🚀 **Interceptable missiles** — shoot them mid-air, or dodge by leaving the targeted cover.
- 🗺️ **5 levels** with a countdown timer and 3 mission objectives per level driving a **1–3 star rating**.
- ✅ **Progression** — level unlocks and earned stars persist via `localStorage`.
- 🎮 **Full input** — keyboard + mouse on PC, virtual on-screen buttons on touch devices (with auto-aim).
- 🧪 **Headless test suite** — see [Automated Testing](#-automated-testing-การทดสอบอัตโนมัติ).

> 🇹🇭 ครบทั้ง cover system, อาวุธ 3 ชนิด, ศัตรู 3 แบบรวมบอสขีปนาวุธ, 5 เลเวลพร้อมระบบ 3 ดาว, บันทึกความคืบหน้า, รองรับทั้งคีย์บอร์ดและจอสัมผัส.

---

## 🚀 Getting Started / วิธีเริ่มเล่น

```bash
# Option A: double-click index.html — it runs straight from the file system
# Option B: serve it locally (optional)
python -m http.server 8000
# then open http://localhost:8000
```

- **No installation, no build, no package.json needed.**
- Works in any modern browser (Chrome, Edge, Firefox, Safari). Tested against Node.js ≥ 18 for the headless test suite.

> 🇹🇭 แค่เปิดไฟล์ `index.html` ในเบราว์เซอร์ก็เล่นได้เลย ไม่ต้องติดตั้งหรือ build อะไรทั้งสิ้น.

---

## 🎮 How to Play / วิธีเล่น

### Objective
Eliminate every enemy within the time limit while completing as many mission objectives as possible. Each completed mission = 1 star (max 3 stars per level).

### Controls

| Action | PC | Mobile |
| --- | --- | --- |
| Move between covers | `A` / `D` or `←` / `→` | On-screen ◀ ▶ buttons |
| Aim | Mouse cursor | Auto-aim at nearest target |
| Shoot / peek | Hold `Left Click` | Hold **FIRE** |
| Reload | `R` | **R** button |
| Switch weapon | `1` `2` `3` or mouse scroll wheel | `1` `2` `3` buttons |

### Tips
- Peeking exposes you — release fire to drop back behind cover.
- Covers can be destroyed; relocate when your cover is about to break.
- Shoot incoming missiles before they reach you.
- Snipers telegraph their shot with a red laser — stay hidden while it's active.
- A boss standing still is preparing a missile — that's your best damage window.

> 🇹🇭 เป้าประสงค์คือกำจัดศัตรูให้หมดในเวลาที่กำหนด + ทำภารกิจให้ครบเพื่อได้ 3 ดาว ฟันเฟืองหลัก: ยิงค้างเพื่อโผล่ยิง ปล่อยเพื่อหลบหลังกำบัง อาวุธสลับด้วย 1/2/3 หรือสกรอลเมาส์ ยิงขีปนาวุธก่อนถึงตัว ขณะบอสเตรียมยิงคือช่วงที่บอสอ่อนแอ.

---

## 🔫 Weapons System / ระบบอาวุธ

Unlimited total ammo, magazine-based reload (manual with `R` or automatic when the mag hits 0).

| Weapon | Damage | Fire rate | Magazine | Reload | Spread | Pellets | Special |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Assault Rifle** | 18 | 140 ms | 30 | 2.0 s | low | 1 | Balanced all-rounder |
| **Shotgun** | 12/pellet | 750 ms | 6 | 2.5 s | wide | 7 | Massive burst up close |
| **Sniper Rifle** | 85 | 1.4 s | 5 | 2.8 s | pinpoint | 1 | **Piercing** + 2.5× headshot bonus |

> 🇹🇭 กระสุนรวมไม่จำกัด แต่จำกัดต่อแม็กกาซีน (รีโหลดเองค้างแม็กหมดได้อัตโนมัติ) ปืนไรเฟิลสมดุล ปืนลูกซองยิงเป็นชุดกระจาย 7 เม็ด สไนเปอร์แรงสะท้าน 4 เท่า + ดาเมจหัวเพิ่ม 2.5 เท่า และยิงทะลุศัตรูต่อเนื่อง.

---

## 👾 Enemies / ศัตรู

| Type | HP | Behaviour |
| --- | --- | --- |
| **Soldier** | 60 | Basic gunfire at regular intervals. |
| **Sniper** | 80 | Shows a glowing red warning sight (1.8 s) before a heavy, high-damage shot. |
| **Boss (Missile)** | 500 | Moves between points. When preparing a missile launch it stands still — an open target. Missiles can be shot down mid-air or dodged by abandoning the targeted cover. |

> 🇹🇭 ทหารยิงเป็นระยะ สไนเปอร์มีเลเซอร์แดงเตือนก่อนยิงแรง บอสไฟต์เคลื่อนที่เองและุ่ยืนนิ่งช่วงเตรียมยิงขีปนาวุธ — ยิงขีปนาวุธให้พังกลางอากาศหรือย้ายที่หลบได้.

---

## 🗺️ Levels & Mission Tasks / เลเวลและภารกิจ (3-Star Rating)

| # | Level | Time | Notable content |
| --- | --- | --- | --- |
| 1 | First Contact | 120 s | Soldier tutorials — 8 kills, 3 headshots, finish in 90 s |
| 2 | Sniper Alley | 120 s | Introduces snipers — 6 sniper-kills, 10 kills, finish in 80 s |
| 3 | Heavy Fire | 150 s | Enemy mix — 14 kills, 5 headshots, keep 50% cover |
| 4 | Boss Encounter | 150 s | Missile boss debut — kill the boss, 10 kills, finish in 100 s |
| 5 | Last Stand | 180 s | Full assault — 20 kills, 2 boss kills, 8 headshots |

**Mission objective types:** `kills`, `headshots`, `weaponKills`, `bossKill`, `time`, `coverHP`.

**Rating:** 1 star = clear the level · 2 stars = two objectives · 3 stars = all three objectives.

> 🇹🇭 มีทั้งหมด 5 เลเวล แต่ละเลเวลมี 3 ภารกิจย่อย — ทำภารกิจละ 1 ดาว สูงสุด 3 ดาว พอจบแต่ละเลเวลจะปลดล็อกเลเวลถัดไป.

---

## 📁 Project Structure / โครงสร้างไฟล์

```
demo-game/
├── index.html      # Page structure, UI overlays (menu, HUD, end screens, touch controls)
├── style.css       # Styling, responsive layout, touch-control positioning, themes
├── script.js       # Game engine: canvas rendering, game loop, state management
└── test/
    └── smoke.js    # Headless Node smoke tests (see below)
```

| File | Responsibility |
| --- | --- |
| `index.html` | Canvas element + all overlay screens (main menu, level select, how-to-play, loadout, HUD, victory, game over). |
| `style.css` | Military theme, modal/button styling, HUD bars, and the mobile virtual-control layout. |
| `script.js` | Engine & classes below, input handling, collision, AI, missions, and rendering. |

> 🇹🇭 โค้ดแบ่งเป็น 3 ไฟล์ตามบทบาทชัดเจน — HTML = โครงสร้าง UI, CSS = สไตล์+เลย์เอาต์ปุ่มสัมผัส, JS = เอนจินทั้งหมด (Canvas/เกมลูป/รัฐของเกม).

---

## 🏗️ Game Architecture / สถาปัตยกรรมโค้ด

The code is written in ES classes with separation of concerns.

```
CONFIG  →  WEAPON_DEFS  →  LEVELS
Game ── update(dt) ── render()
 ├─ Player (3 × WeaponInstance)
 ├─ Cover[]
 ├─ Enemy │→ Soldier │→ SniperEnemy │→ BossEnemy
 ├─ Projectile[] → Missile[]
 ├─ Particle[] (+ HeadshotText)
 └─ SoundManager (procedural Web Audio)
```

| Class | Role |
| --- | --- |
| `Game` | State machine, level setup, game loop, input, collisions, missions, HUD updates, saving. |
| `Player` | Cover index tracking, movement/tweening between covers, peek & "in the open" states. |
| `WeaponInstance` | Magazine, reload timer, fire rate, spread and projectile generation per weapon def. |
| `Cover` | Health/durability, destruction + rubble particles, collision rect. |
| `Enemy` (base) | Shared body/health-bar rendering and footprint movement. |
| `Soldier`, `SniperEnemy`, `BossEnemy` | Per-type AI + attacks (sniper laser sight, boss missile prep). |
| `Missile` | Slow tracking projectile — interceptable, explodes on the targeted cover. |
| `Projectile` | Linear bullets; player bullets support piercing + headshot multiplier. |
| `Particle`, `HeadshotText` | Muzzle flash, impact sparks, explosions, floating "HEADSHOT" popups. |
| `SoundManager` | Zero-asset sound effects generated live with the Web Audio API. |

**Game loop:** `requestAnimationFrame` → delta-time → `update(dt)` → `render()`, with a hard 50 ms frame cap.

**Coordinate system:** all logic runs in virtual 1200×675 space; the canvas scales and letterboxes to the window.

**Asset fallback:** sprites are optional — if a PNG fails or is missing, entities draw as labeled geometric shapes, keeping the game fully playable.

> 🇹🇭 โค้ดแยกคลาสตามหน้าที่ — Game คุมสถานะ/ลูปเกม, Player จัดการ cover & peek, Enemy มี 3 subclass ตาม AI, Missile ยิงสกัดได้, SoundManager สร้างเสียงสดจาก Web Audio โค้ดรันบนพิกัด virtual 1200×675 แล้ว scale ตามหน้าจอ และมีระบบ fallback วาดรูปทรงแทนสไปรต์.

---

## 📸 Screenshots / ตัวอย่างภาพ

> Replace the placeholder lines with your own captures.
>
> วางรูปภาพ/การจับหน้าจอของคุณลงในช่องนี้ได้เลย (เช่น หน้าจอหลัก, HUD ในเกม, หน้าจอชัยชนะ)

```
![Main menu](screenshots/main-menu.png)
![Gameplay](screenshots/gameplay.png)
![Victory](screenshots/victory.png)
```

> 🇹🇭 ส่วนนี้เป็นส่วนวางภาพหน้าจอ/สาธิตเกมของคุณเอง — รองรับไฟล์ GIF ได้ถ้าต้องการ.

---

## 🧪 Automated Testing / การทดสอบอัตโนมัติ

The engine is covered by a headless **Node smoke test** — no browser or canvas needed. It stubs `document`, `window`, `canvas` and `localStorage`, boots the game, and asserts on the core mechanics.

```bash
node test/smoke.js      # Node.js >= 18 required
```

**What it checks:** level loading · cover absorbing enemy fire while hiding · player taking damage while peeking · reload refilling the magazine · weapon switching · fire-while-moving opening up the player · 3-star calculation · boss missile launch · victory and game-over transitions.

Sample output:

```
HeadShot engine smoke tests
  PASS  cover absorbs fire while hiding  -> coverDmg=6.0
  PASS  peeking exposes player to bullets -> hp=88.0
  ...
10 passed, 0 failed
```

> 🇹🇭 ทดสอบอัตโนมัติแบบ headless รันด้วยคำสั่ง `node test/smoke.js` — จำลอง environment เบราว์เซอร์ไว้ในตัว ตรวจสอบกลไกหลัก 10 ข้อ (กำบัง, โผล่ยิง, รีโหลด, สลับอาวุธ, ยิงระหว่างเดิน, คำนวณดาว, บอส, จบเกม) แนะนำ Node.js 18+.

---

## 📄 License / ลิขสิทธิ์

[MIT License](./LICENSE) — free to use, modify and distribute, provided the copyright notice is retained.

> 🇹🇭 เผยแพร่ภายใต้ลิขสิทธิ์ MIT — นำไปใช้ แก้ไข และแจกจ่ายได้อิสระ (กรุณาเก็บข้อความเครดิตเดิมไว้).

### Acknowledgements & Disclaimer
- **HEADSHOT** is a fan-driven demo created as an educational reference, **not affiliated with** or endorsed by *Garena* / *HeadShot*.
- Gameplay is conceptually inspired by Garena HeadShot's cover-shooting style; all code, art (placeholders) and sounds are original.

> 🇹🇭 โปรเจกต์นี้เป็น demo เพื่อการศึกษา/อ้างอิงโค้ด ไม่มีความเกี่ยวข้องหรือได้รับการสนับสนุนจาก Garena / HeadShot — แนวคิด gameplay ได้แรงบันดาลใจจากเกมดังกล่าว แต่โค้ด, กราฟิก (แบบชั่วคราว) และเสียงเป็นของโปรเจกต์เองทั้งหมด.