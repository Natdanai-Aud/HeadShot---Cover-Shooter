/*
 * Headless smoke test for the cover shooter engine.
 * Runs the game logic inside Node with a stubbed browser (no canvas/DOM rendering).
 *
 * Usage:  node test/smoke.js   (from the project root)
 * Requires: Node.js >= 18
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SCRIPT_PATH = path.join(__dirname, '..', 'script.js');
const code = fs.readFileSync(SCRIPT_PATH, 'utf8');

let passed = 0;
let failed = 0;

function assert(name, cond, extra) {
    if (cond) { passed++; console.log('  PASS  ' + name + (extra ? '  -> ' + extra : '')); }
    else { failed++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
}

/* ---------- Minimal browser stub ---------- */
const listeners = {};
const elems = {};

function getEl(id) {
    if (!elems[id]) {
        elems[id] = {
            getContext() { return ctx2d; },
            addEventListener() {},
            classList: { add() {}, remove() {}, contains() { return false; } },
            style: {},
            dataset: {},
            textContent: '',
            innerHTML: '',
            children: [],
            appendChild(c) { this.children.push(c); return c; }
        };
    }
    return elems[id];
}

const ctx2d = new Proxy({}, {
    get(t, p) {
        if (p === 'createLinearGradient' || p === 'createRadialGradient') return () => ({ addColorStop() {} });
        if (p === 'measureText') return () => ({ width: 10 });
        return () => {};
    },
    set() { return true; }
});

const sandbox = {
    window: {
        innerWidth: 1280,
        innerHeight: 720,
        addEventListener(ev, fn) { listeners[ev] = fn; },
        requestAnimationFrame() {},
        AudioContext: undefined,
        webkitAudioContext: undefined
    },
    document: {
        getElementById: getEl,
        querySelectorAll() { return []; },
        createElement() {
            return { classList: { add() {} }, addEventListener() {}, dataset: {}, innerHTML: '', appendChild() {} };
        }
    },
    requestAnimationFrame() {},
    localStorage: { getItem() { return null; }, setItem() {} },
    performance: { now: () => Date.now() },
    navigator: { maxTouchPoints: 0 },
    console, Math, Date, JSON, Promise, setTimeout, clearTimeout
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'script.js' });
if (!listeners.load) throw new Error('No load listener registered');
listeners.load();

const g = sandbox.window._game;
if (!g) throw new Error('window._game is undefined');
const SO = v => vm.runInContext(v, sandbox);

/* ---------- Tests ---------- */
console.log('\nHeadShot engine smoke tests\n');

// 1. Level 1 loads with 4 covers and full health
g.startLevel(0);
assert('level-1 loads', g.state === 'playing' && g.covers.length === 4 && g.player.health === 100, 'covers=' + g.covers.length);

// 2. Hiding behind cover absorbs enemy fire (cover takes damage, player does not)
g.startLevel(0);
const sol1 = new (SO('Soldier'))(950, 500);
g.enemies.push(sol1);
g.mouse = { x: 800, y: 300, down: false };
sol1.fireTimer = 0.001;
let hp0 = g.player.health;
for (let i = 0; i < 140; i++) g.update(1 / 60);
const coverDmg = g.covers[0].maxHp - g.covers[0].hp;
assert('cover absorbs fire while hiding', g.player.health === hp0 && coverDmg > 0, 'coverDmg=' + coverDmg.toFixed(1));

// 3. Settled peek exposes the player to damage
g.startLevel(0);
g.mouse = { x: 800, y: 300, down: true };
for (let i = 0; i < 40; i++) g.update(1 / 60); // let the peek settle
const sol2 = new (SO('Soldier'))(950, 500);
g.enemies.push(sol2);
sol2.fireTimer = 0.001;
g.update(1 / 60);
let peekHit = false;
for (let i = 0; i < 200 && !peekHit; i++) {
    g.update(1 / 60);
    if (g.player.health < 100) peekHit = true;
}
assert('peeking exposes player to bullets', peekHit, 'hp=' + g.player.health.toFixed(1));

// 4. Reload refills the magazine
g.player.weapons[0].ammo = 5;
g.player.weapons[0].reloading = false;
g.playerWeaponReload();
for (let i = 0; i < 130; i++) g.update(1 / 60);
assert('reload refills magazine', g.player.weapons[0].ammo === 30, 'ammo=' + g.player.weapons[0].ammo);

// 5. Weapon switching selects the sniper
g.playerWeaponSwitch(2);
assert('weapon switch -> sniper', g.player.weapons[g.player.currentWeapon].def.id === 'sniper');

// 6. Firing while moving stops the player and fires from the open
g.startLevel(0);
g.mouse = { x: 900, y: 300, down: false };
g.keys = { d: true, a: false, arrowleft: false, arrowright: false };
g.update(0.04);
g.mouse.down = true;
g.keys.d = false;
g.update(0.04);
assert('fire-while-moving pauses and opens up', g.player.moving === false && g.player.inOpen === true);

// 7. Star calculation reaches 3 with all missions done
g.startLevel(4);
g.stats.kills = 99; g.stats.headshots = 99; g.stats.bossKills = 99; g.levelTime = 1;
assert('stars = 3 when all missions met', g.calculateStars() === 3, 'stars=' + g.calculateStars());

// 8. Boss launches a missile after preparation
g.startLevel(0);
g.enemies.push(new (SO('BossEnemy'))(1000, 500));
let missileSeen = false;
for (let i = 0; i < 90 && !missileSeen; i++) {
    g.update(0.1);
    if (g.missiles.length > 0) missileSeen = true;
}
assert('boss launches missile', missileSeen, 'missiles=' + g.missiles.length);

// 9. Victory fires when all enemies are cleared
g.startLevel(0);
g.waveIndex = 9999;
g.enemies = [];
g.missiles = [];
g.update(1 / 60);
assert('victory on clearing all enemies', g.state === 'victory');

// 10. Game over fires when the player dies
g.startLevel(0);
g.player.takeDamage(999);
g.update(1 / 60);
assert('game over on player death', g.state === 'gameOver');

/* ---------- Summary ---------- */
console.log('\n' + passed + ' passed, ' + failed + ' failed\n');
process.exit(failed === 0 ? 0 : 1);