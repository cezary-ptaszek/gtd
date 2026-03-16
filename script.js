const mainMenu = document.getElementById("mainMenu");
const gameScreen = document.getElementById("gameScreen");
const menuStartBtn = document.getElementById("menuStartBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameArea = document.querySelector(".game-area");
const canvasWrap = document.querySelector(".canvas-wrap");

const goldValue = document.getElementById("goldValue");
const baseHpValue = document.getElementById("baseHpValue");
const waveValue = document.getElementById("waveValue");
const enemiesLeftValue = document.getElementById("enemiesLeftValue");
const selectedTowerPanel = document.getElementById("selectedTowerPanel");
const upgradeBtn = document.getElementById("upgradeBtn");
const sellBtn = document.getElementById("sellBtn");
const startWaveBtn = document.getElementById("startWaveBtn");
const autoWaveBtn = document.getElementById("autoWaveBtn");
const restartBtn = document.getElementById("restartBtn");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayRestartBtn = document.getElementById("overlayRestartBtn");
const overlayMenuBtn = document.getElementById("overlayMenuBtn");
const statusText = document.getElementById("statusText");
const waveBanner = document.getElementById("waveBanner");

const buildButtons = Array.from(document.querySelectorAll(".build-btn"));
const speedButtons = Array.from(document.querySelectorAll(".speed-btn"));

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const towerCosts = {
    emerald: 70,
    ruby: 95,
    diamond: 115,
    amethyst: 100,
    topaz: 85
};

const towerData = {
    emerald: {
        name: "Szmaragd",
        color: "#2ee38c",
        range: [135, 155, 175],
        damage: [7, 12, 18],
        fireRate: [0.9, 1.05, 1.22],
        poisonDps: [8, 13, 20],
        poisonDuration: [2.6, 3.2, 4.0],
        upgradeCost: [65, 100],
        sellMultiplier: 0.7,
        description: "Truje i dobrze radzi sobie z szybkimi jednostkami."
    },
    ruby: {
        name: "Rubin",
        color: "#ff4d67",
        range: [110, 125, 140],
        damage: [22, 34, 50],
        fireRate: [0.62, 0.74, 0.9],
        splash: [48, 58, 72],
        upgradeCost: [80, 120],
        sellMultiplier: 0.7,
        description: "Potężny splash przeciw tłumom."
    },
    diamond: {
        name: "Diament",
        color: "#7fd7ff",
        range: [175, 200, 225],
        damage: [24, 38, 58],
        fireRate: [0.58, 0.7, 0.84],
        critChance: [0.22, 0.28, 0.34],
        critMultiplier: [1.9, 2.25, 2.7],
        armorPierce: [3, 5, 8],
        upgradeCost: [95, 145],
        sellMultiplier: 0.7,
        description: "Snajper na tanki i bossów."
    },
    amethyst: {
        name: "Ametyst",
        color: "#b26cff",
        range: [140, 160, 180],
        damage: [11, 16, 24],
        fireRate: [0.95, 1.12, 1.32],
        chainCount: [2, 3, 4],
        chainFalloff: [0.72, 0.78, 0.84],
        upgradeCost: [85, 125],
        sellMultiplier: 0.7,
        description: "Łańcuchowe uderzenia energii."
    },
    topaz: {
        name: "Topaz",
        color: "#ffc94d",
        range: [125, 145, 165],
        damage: [10, 15, 22],
        fireRate: [1.3, 1.5, 1.72],
        slowPower: [0.78, 0.68, 0.58],
        slowDuration: [1.2, 1.5, 1.8],
        upgradeCost: [75, 110],
        sellMultiplier: 0.7,
        description: "Spowalnia wrogów i wspiera resztę obrony."
    }
};

const enemyTypes = {
    basic: {
        name: "Basic",
        color: "#dde4f5",
        hp: 38,
        speed: 58,
        reward: 14,
        damage: 1,
        armor: 0,
        radius: 14
    },
    fast: {
        name: "Fast",
        color: "#ffd166",
        hp: 28,
        speed: 96,
        reward: 16,
        damage: 1,
        armor: 0,
        radius: 12
    },
    tank: {
        name: "Tank",
        color: "#8b99b4",
        hp: 105,
        speed: 38,
        reward: 26,
        damage: 2,
        armor: 4,
        radius: 17
    },
    boss: {
        name: "Boss",
        color: "#b96dff",
        hp: 520,
        speed: 34,
        reward: 180,
        damage: 7,
        armor: 8,
        radius: 24
    }
};

const path = [
    { x: -40, y: 96 },
    { x: 160, y: 96 },
    { x: 160, y: 224 },
    { x: 352, y: 224 },
    { x: 352, y: 416 },
    { x: 608, y: 416 },
    { x: 608, y: 160 },
    { x: 800, y: 160 },
    { x: 800, y: 544 },
    { x: 1010, y: 544 }
];

const buildSpots = [
    { id: 1, x: 96, y: 176, r: 24 },
    { id: 2, x: 96, y: 304, r: 24 },
    { id: 3, x: 224, y: 304, r: 24 },
    { id: 4, x: 288, y: 144, r: 24 },
    { id: 5, x: 288, y: 352, r: 24 },
    { id: 6, x: 416, y: 288, r: 24 },
    { id: 7, x: 480, y: 480, r: 24 },
    { id: 8, x: 544, y: 352, r: 24 },
    { id: 9, x: 672, y: 288, r: 24 },
    { id: 10, x: 736, y: 96, r: 24 },
    { id: 11, x: 736, y: 288, r: 24 },
    { id: 12, x: 736, y: 480, r: 24 },
    { id: 13, x: 864, y: 256, r: 24 },
    { id: 14, x: 864, y: 448, r: 24 }
];

let mouseX = -999;
let mouseY = -999;
let game;

function createAmbientMotes(count = 26) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        vx: (Math.random() - 0.5) * 8,
        vy: -4 - Math.random() * 10,
        r: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() < 0.45 ? "#7fd7ff" : "#b26cff"
    }));
}

function createGameState() {
    return {
        gold: 220,
        baseHp: 24,
        wave: 0,
        maxWaves: 12,
        enemies: [],
        towers: [],
        projectiles: [],
        effects: [],
        floatingTexts: [],
        beams: [],
        selectedTowerId: null,
        buildMode: null,
        waveInProgress: false,
        spawnQueue: [],
        spawnTimer: 0,
        lastTime: 0,
        gameOver: false,
        victory: false,
        timeScale: 1,
        bannerTimer: 0,
        ambientMotes: createAmbientMotes(26),
        autoWaveEnabled: false,
        autoWaveCountdown: 0
    };
}

function resetGame() {
    game = createGameState();
    hideOverlay();
    clearBuildSelection(false);
    showBanner("Przygotuj obronę");
    statusText.textContent = "Kliknij Spację, aby rozpocząć pierwszą falę.";
    updateHUD();
    resizeGameViewport();
}

function resizeGameViewport() {
    if (!gameArea || !canvasWrap) return;

    const rect = gameArea.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return;

    const aspect = WIDTH / HEIGHT;
    let cssWidth = rect.width;
    let cssHeight = cssWidth / aspect;

    if (cssHeight > rect.height) {
        cssHeight = rect.height;
        cssWidth = cssHeight * aspect;
    }

    cssWidth = Math.max(320, Math.floor(cssWidth));
    cssHeight = Math.max(210, Math.floor(cssHeight));

    // Rozmiar wizualny
    canvasWrap.style.width = `${cssWidth}px`;
    canvasWrap.style.height = `${cssHeight}px`;

    // Rozmiar renderu (HiDPI)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderWidth = Math.floor(cssWidth * dpr);
    const renderHeight = Math.floor(cssHeight * dpr);

    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth;
        canvas.height = renderHeight;
    }
}

class Enemy {
    constructor(typeKey, scale, hpScale, rewardScale) {
        const type = enemyTypes[typeKey];
        this.typeKey = typeKey;
        this.name = type.name;
        this.color = type.color;
        this.maxHp = Math.round(type.hp * hpScale);
        this.hp = this.maxHp;
        this.speed = type.speed * scale;
        this.reward = Math.round(type.reward * rewardScale);
        this.baseDamage = type.damage;
        this.armor = Math.round(type.armor * (0.8 + hpScale * 0.12));
        this.radius = type.radius;
        this.x = path[0].x;
        this.y = path[0].y;
        this.pathIndex = 1;
        this.poison = null;
        this.slowEffects = [];
        this.dead = false;
        this.reachedBase = false;
        this.hitFlash = 0;
    }

    getSpeedMultiplier() {
        let mult = 1;
        for (const s of this.slowEffects) {
            mult = Math.min(mult, s.multiplier);
        }
        return mult;
    }

    update(dt) {
        if (this.dead) return;

        this.hitFlash = Math.max(0, this.hitFlash - dt * 4);

        for (const slow of this.slowEffects) {
            slow.timeLeft -= dt;
        }
        this.slowEffects = this.slowEffects.filter(s => s.timeLeft > 0);

        if (this.poison) {
            this.poison.timeLeft -= dt;
            this.hp -= this.poison.dps * dt;
            if (Math.random() < 0.18) {
                game.effects.push(new ParticleEffect(this.x, this.y, "#37ff9e", 4, 0.25, 22));
            }
            if (this.poison.timeLeft <= 0) this.poison = null;
        }

        if (this.hp <= 0) {
            this.die();
            return;
        }

        if (this.pathIndex >= path.length) {
            this.dead = true;
            this.reachedBase = true;
            game.baseHp -= this.baseDamage;
            game.floatingTexts.push(new FloatingText(this.x, this.y - 24, `-${this.baseDamage} HP`, "#ff8c9a", 1.0, 24));
            if (game.baseHp <= 0) {
                game.baseHp = 0;
                endGame(false);
            }
            return;
        }

        const target = path[this.pathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 1) {
            this.pathIndex += 1;
            return;
        }

        const move = this.speed * this.getSpeedMultiplier() * dt;
        this.x += (dx / dist) * Math.min(move, dist);
        this.y += (dy / dist) * Math.min(move, dist);
    }

    applyPoison(dps, duration) {
        if (!this.poison || this.poison.dps < dps) {
            this.poison = { dps, timeLeft: duration };
        } else {
            this.poison.timeLeft = Math.max(this.poison.timeLeft, duration);
        }
    }

    applySlow(multiplier, duration) {
        this.slowEffects.push({ multiplier, timeLeft: duration });
    }

    takeDamage(amount, pierce = 0) {
        this.hitFlash = 1;
        const actual = Math.max(1, amount - Math.max(0, this.armor - pierce));
        this.hp -= actual;
        if (this.hp <= 0) this.die();
        return actual;
    }

    die() {
        if (this.dead) return;
        this.dead = true;
        game.gold += this.reward;
        game.effects.push(new BurstEffect(this.x, this.y, this.color, 18, 0.5));
        game.floatingTexts.push(new FloatingText(this.x, this.y - 16, `+${this.reward} gold`, "#ffe36b", 1.2, 20, true));
    }

    draw(ctx) {
        ctx.save();

        const glow = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, this.radius * 2.1);
        glow.addColorStop(0, hexToRgba(this.color, 0.85));
        glow.addColorStop(1, hexToRgba(this.color, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.hitFlash > 0 ? "#ffffff" : this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        if (this.typeKey === "tank" || this.typeKey === "boss") {
            ctx.strokeStyle = "rgba(255,255,255,0.28)";
            ctx.lineWidth = this.typeKey === "boss" ? 4 : 3;
            ctx.stroke();
        }

        if (this.poison) {
            ctx.strokeStyle = "#37ff9e";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (this.slowEffects.length > 0) {
            ctx.strokeStyle = "#ffd56e";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        const barW = 36;
        const barH = 5;
        const ratio = Math.max(0, this.hp / this.maxHp);
        ctx.fillStyle = "rgba(0,0,0,0.46)";
        ctx.fillRect(this.x - barW / 2, this.y - this.radius - 17, barW, barH);
        ctx.fillStyle = ratio > 0.5 ? "#68e6a6" : ratio > 0.25 ? "#ffd166" : "#ff6f7c";
        ctx.fillRect(this.x - barW / 2, this.y - this.radius - 17, barW * ratio, barH);

        ctx.restore();
    }
}

class Tower {
    constructor(type, spot) {
        this.id = createId();
        this.type = type;
        this.spotId = spot.id;
        this.x = spot.x;
        this.y = spot.y;
        this.level = 1;
        this.cooldown = 0;
        this.flash = 0;
        this.totalSpent = towerCosts[type];
    }

    getData() {
        return towerData[this.type];
    }

    getStat(key) {
        return this.getData()[key][this.level - 1];
    }

    getRange() {
        return this.getStat("range");
    }

    getUpgradeCost() {
        const arr = this.getData().upgradeCost;
        return this.level >= 3 ? null : arr[this.level - 1];
    }

    canUpgrade() {
        return this.level < 3;
    }

    getSellValue() {
        return Math.round(this.totalSpent * this.getData().sellMultiplier);
    }

    upgrade() {
        const cost = this.getUpgradeCost();
        if (!this.canUpgrade() || game.gold < cost) return false;
        game.gold -= cost;
        this.totalSpent += cost;
        this.level += 1;
        game.effects.push(new BurstEffect(this.x, this.y, this.getData().color, 22, 0.6));
        game.floatingTexts.push(new FloatingText(this.x, this.y - 20, "UP", "#ffffff", 0.9, 26));
        return true;
    }

    update(dt) {
        this.flash = Math.max(0, this.flash - dt * 3.2);
        this.cooldown -= dt;
        if (this.cooldown > 0) return;

        const target = this.findTarget();
        if (!target) return;

        this.attack(target);
        this.cooldown = 1 / this.getStat("fireRate");
        this.flash = 1;
    }

    findTarget() {
        let best = null;
        let bestScore = -Infinity;
        const range = this.getRange();

        for (const enemy of game.enemies) {
            if (enemy.dead) continue;
            const d = distance(this.x, this.y, enemy.x, enemy.y);
            if (d > range) continue;
            const nextPath = path[Math.min(enemy.pathIndex, path.length - 1)];
            const score = enemy.pathIndex * 10000 - distance(enemy.x, enemy.y, nextPath.x, nextPath.y);
            if (score > bestScore) {
                bestScore = score;
                best = enemy;
            }
        }
        return best;
    }

    attack(target) {
        const color = this.getData().color;

        if (this.type === "emerald") {
            const damage = this.getStat("damage");
            const dps = this.getStat("poisonDps");
            const duration = this.getStat("poisonDuration");

            game.projectiles.push(new Projectile(this.x, this.y, target, 320, color, 5, () => {
                if (target.dead) return;
                const dealt = target.takeDamage(damage, 0);
                target.applyPoison(dps, duration);
                game.effects.push(new BurstEffect(target.x, target.y, color, 10, 0.35));
                game.floatingTexts.push(new FloatingText(target.x, target.y - 10, `${Math.round(dealt)}`, color));
            }));
        }

        if (this.type === "ruby") {
            const damage = this.getStat("damage");
            const splash = this.getStat("splash");

            game.projectiles.push(new Projectile(this.x, this.y, target, 280, color, 6, () => {
                if (target.dead) return;
                game.effects.push(new RingEffect(target.x, target.y, splash, color, 0.35));
                for (const enemy of game.enemies) {
                    if (enemy.dead) continue;
                    const dist = distance(target.x, target.y, enemy.x, enemy.y);
                    if (dist <= splash) {
                        const falloff = dist < 1 ? 1 : clamp(1 - dist / splash, 0.42, 1);
                        const dealt = enemy.takeDamage(damage * falloff, 0);
                        game.floatingTexts.push(new FloatingText(enemy.x, enemy.y - 10, `${Math.round(dealt)}`, color));
                    }
                }
            }));
        }

        if (this.type === "diamond") {
            const damage = this.getStat("damage");
            const critChance = this.getStat("critChance");
            const critMultiplier = this.getStat("critMultiplier");
            const pierce = this.getStat("armorPierce");

            game.projectiles.push(new Projectile(this.x, this.y, target, 460, color, 5, () => {
                if (target.dead) return;

                const crit = Math.random() < critChance;
                const raw = crit ? damage * critMultiplier : damage;
                const armorReduction = Math.max(0, target.armor - pierce);
                const baseDealt = Math.max(1, damage - armorReduction);
                const totalDealt = target.takeDamage(raw, pierce);
                const critBonus = crit ? Math.max(0, totalDealt - baseDealt) : 0;

                game.effects.push(new BurstEffect(target.x, target.y, crit ? "#f0fbff" : color, crit ? 18 : 10, 0.35));
                game.floatingTexts.push(new FloatingText(target.x - (crit ? 14 : 0), target.y - 14, `${Math.round(baseDealt)}`, color, 0.95, 22));

                if (crit && critBonus > 0) {
                    game.floatingTexts.push(
                        new FloatingText(target.x + 18, target.y - 20, `CRIT +${Math.round(critBonus)}`, "#ffffff", 1.05, 28, true)
                    );
                }
            }));
        }

        if (this.type === "amethyst") {
            const damage = this.getStat("damage");
            const chainCount = this.getStat("chainCount");
            const chainFalloff = this.getStat("chainFalloff");
            const chainRange = 105;

            let current = target;
            let chainDamage = damage;
            const hitEnemies = new Set();

            for (let i = 0; i < chainCount; i++) {
                if (!current || current.dead || hitEnemies.has(current)) break;
                hitEnemies.add(current);

                const dealt = current.takeDamage(chainDamage, 1);
                game.floatingTexts.push(new FloatingText(current.x, current.y - 10, `${Math.round(dealt)}`, color));
                game.effects.push(new BurstEffect(current.x, current.y, color, 8, 0.28));
                game.effects.push(new ParticleEffect(current.x, current.y, "#d9b8ff", 6, 0.2, 30));

                let next = null;
                let nearest = Infinity;
                for (const enemy of game.enemies) {
                    if (enemy.dead || hitEnemies.has(enemy)) continue;
                    const dist = distance(current.x, current.y, enemy.x, enemy.y);
                    if (dist <= chainRange && dist < nearest) {
                        nearest = dist;
                        next = enemy;
                    }
                }

                if (next) {
                    game.beams.push(new BeamEffect(current.x, current.y, next.x, next.y, color, 0.12, 3.6, { jagged: true, electric: true }));
                }

                current = next;
                chainDamage *= chainFalloff;
            }

            game.beams.push(new BeamEffect(this.x, this.y, target.x, target.y, color, 0.16, 4.4, { jagged: true, electric: true }));
        }

        if (this.type === "topaz") {
            const damage = this.getStat("damage");
            const slowPower = this.getStat("slowPower");
            const slowDuration = this.getStat("slowDuration");

            game.projectiles.push(new Projectile(this.x, this.y, target, 340, color, 5, () => {
                if (target.dead) return;
                const dealt = target.takeDamage(damage, 0);
                target.applySlow(slowPower, slowDuration);
                game.effects.push(new RingEffect(target.x, target.y, 28, color, 0.25));
                game.floatingTexts.push(new FloatingText(target.x, target.y - 10, `${Math.round(dealt)}`, color));
            }));
        }
    }

    draw(ctx) {
        const data = this.getData();
        const selected = game.selectedTowerId === this.id;
        const glowRadius = 30 + this.flash * 12;

        ctx.save();

        if (selected) {
            ctx.strokeStyle = "rgba(255,255,255,0.36)";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.getRange(), 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        glow.addColorStop(0, hexToRgba(data.color, 0.4));
        glow.addColorStop(1, hexToRgba(data.color, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(7,12,22,0.95)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = selected ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.12)";
        ctx.lineWidth = 2;
        ctx.stroke();

        drawGem(ctx, this.x, this.y, 18 + this.level * 2, data.color, this.type, this.level);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`L${this.level}`, this.x, this.y + 41);

        ctx.restore();
    }
}

class Projectile {
    constructor(x, y, target, speed, color, radius, onHit) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = speed;
        this.color = color;
        this.radius = radius;
        this.onHit = onHit;
        this.dead = false;
        this.trail = [];
    }

    update(dt) {
        if (this.dead) return;
        if (!this.target || this.target.dead) {
            this.dead = true;
            return;
        }

        this.trail.push({ x: this.x, y: this.y, life: 0.18 });
        if (this.trail.length > 7) this.trail.shift();
        for (const t of this.trail) t.life -= dt;
        this.trail = this.trail.filter(t => t.life > 0);

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < Math.max(6, this.target.radius * 0.7)) {
            this.dead = true;
            this.onHit();
            return;
        }

        const step = Math.min(this.speed * dt, dist);
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
    }

    draw(ctx) {
        ctx.save();

        for (const t of this.trail) {
            ctx.globalAlpha = t.life / 0.18 * 0.4;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * 0.85, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        const glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, 14);
        glow.addColorStop(0, this.color);
        glow.addColorStop(1, hexToRgba(this.color, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class ParticleEffect {
    constructor(x, y, color, count = 8, life = 0.35, spread = 32) {
        this.particles = Array.from({ length: count }, () => ({
            x,
            y,
            vx: (Math.random() - 0.5) * spread * 2,
            vy: (Math.random() - 0.5) * spread * 2,
            life,
            maxLife: life,
            r: 2 + Math.random() * 3,
            color
        }));
        this.dead = false;
    }

    update(dt) {
        let alive = 0;
        for (const p of this.particles) {
            p.life -= dt;
            if (p.life > 0) alive += 1;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
        }
        this.dead = alive === 0;
    }

    draw(ctx) {
        for (const p of this.particles) {
            if (p.life <= 0) continue;
            ctx.save();
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

class BurstEffect extends ParticleEffect {
    constructor(x, y, color, count = 16, life = 0.45) {
        super(x, y, color, count, life, 90);
    }
}

class RingEffect {
    constructor(x, y, radius, color, life = 0.25) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.dead = false;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) this.dead = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (1.12 - this.life / this.maxLife * 0.2), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

class BeamEffect {
    constructor(x1, y1, x2, y2, color, life = 0.18, width = 3, options = {}) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.width = width;
        this.dead = false;
        this.jagged = Boolean(options.jagged);
        this.electric = Boolean(options.electric);
        this.phase = Math.random() * Math.PI * 2;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) this.dead = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;

        const points = this.jagged ? this.getLightningPoints() : null;

        ctx.strokeStyle = hexToRgba(this.color, this.electric ? 0.4 : 0.28);
        ctx.lineWidth = this.width * (this.electric ? 2.7 : 2.4);
        ctx.beginPath();
        if (points) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        } else {
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
        }
        ctx.stroke();

        ctx.strokeStyle = this.electric ? "#f2f8ff" : this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        if (points) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        } else {
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
        }
        ctx.stroke();

        ctx.restore();
    }

    getLightningPoints() {
        const points = [];
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / dist;
        const ny = dx / dist;
        const segments = Math.max(3, Math.min(7, Math.round(dist / 34)));
        const t = performance.now() * 0.02 + this.phase;

        points.push({ x: this.x1, y: this.y1 });

        for (let i = 1; i < segments; i++) {
            const p = i / segments;
            const jitter = Math.sin(t + i * 1.7) * (5 + this.width * 0.9) * (1 - Math.abs(0.5 - p));
            points.push({
                x: this.x1 + dx * p + nx * jitter,
                y: this.y1 + dy * p + ny * jitter
            });
        }

        points.push({ x: this.x2, y: this.y2 });
        return points;
    }
}

class FloatingText {
    constructor(x, y, text, color, life = 0.7, rise = 24, bold = false) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.rise = rise;
        this.bold = bold;
        this.dead = false;
        this.scale = bold ? 1.08 : 1;
    }

    update(dt) {
        this.life -= dt;
        this.y -= this.rise * dt;
        this.scale += dt * 0.15;
        if (this.life <= 0) this.dead = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 3;
        const weight = this.bold ? "900" : "700";
        ctx.font = `${weight} ${Math.round(13 * this.scale)}px Arial`;
        ctx.textAlign = "center";
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

function generateWave(waveNumber) {
    const queue = [];
    const hpScale = 1 + (waveNumber - 1) * 0.18;
    const speedScale = 1 + Math.min(0.32, (waveNumber - 1) * 0.018);
    const rewardScale = 1 + (waveNumber - 1) * 0.09;

    const add = (type, count, interval) => {
        for (let i = 0; i < count; i++) {
            queue.push({ type, interval, hpScale, speedScale, rewardScale });
        }
    };

    add("basic", 5 + waveNumber, 0.82);

    if (waveNumber >= 2) add("fast", 2 + Math.floor(waveNumber * 0.8), 0.64);
    if (waveNumber >= 3) add("tank", 1 + Math.floor(waveNumber / 2), 1.25);
    if (waveNumber >= 5) add("basic", 4 + waveNumber, 0.56);
    if (waveNumber >= 6) add("fast", 4 + Math.floor(waveNumber * 0.9), 0.44);
    if (waveNumber >= 8) add("tank", 2 + Math.floor(waveNumber / 2), 1.0);
    if (waveNumber === 12) {
        queue.push({
            type: "boss",
            interval: 2.0,
            hpScale: hpScale * 1.65,
            speedScale: 1.0,
            rewardScale: rewardScale * 1.8
        });
    }

    return queue;
}

function startNextWave() {
    if (game.gameOver || game.waveInProgress) return;
    if (game.wave >= game.maxWaves) return;

    game.wave += 1;
    game.spawnQueue = generateWave(game.wave);
    game.spawnTimer = 0.25;
    game.waveInProgress = true;

    statusText.textContent = `Fala ${game.wave} rozpoczęta.`;
    showBanner(`Fala ${game.wave}`);
    updateHUD();
}

function spawnEnemyFromQueue() {
    if (game.spawnQueue.length === 0) return;
    const data = game.spawnQueue.shift();
    const enemy = new Enemy(data.type, data.speedScale, data.hpScale, data.rewardScale);
    game.enemies.push(enemy);
    game.spawnTimer = data.interval;
}

function update(dtRaw) {
    if (game.gameOver) {
        updateBanner(dtRaw);
        return;
    }

    const dt = dtRaw * game.timeScale;

    updateBanner(dtRaw);

    if (!game.waveInProgress && game.autoWaveEnabled && game.autoWaveCountdown > 0) {
        game.autoWaveCountdown -= dtRaw;
        if (game.autoWaveCountdown <= 0) {
            game.autoWaveCountdown = 0;
            startNextWave();
        }
    }

    if (game.waveInProgress && game.spawnQueue.length > 0) {
        game.spawnTimer -= dt;
        while (game.spawnTimer <= 0 && game.spawnQueue.length > 0) {
            spawnEnemyFromQueue();
        }
    }

    for (const enemy of game.enemies) enemy.update(dt);
    for (const tower of game.towers) tower.update(dt);
    for (const projectile of game.projectiles) projectile.update(dt);
    for (const effect of game.effects) effect.update(dt);
    for (const text of game.floatingTexts) text.update(dt);
    for (const beam of game.beams) beam.update(dtRaw);
    updateAmbient(dtRaw);

    game.enemies = game.enemies.filter(enemy => !(enemy.dead && !enemy.reachedBase));
    game.projectiles = game.projectiles.filter(p => !p.dead);
    game.effects = game.effects.filter(effect => !effect.dead);
    game.floatingTexts = game.floatingTexts.filter(text => !text.dead);
    game.beams = game.beams.filter(beam => !beam.dead);

    if (game.waveInProgress && game.spawnQueue.length === 0 && game.enemies.length === 0) {
        game.waveInProgress = false;
        const bonus = 40 + game.wave * 10;
        game.gold += bonus;
        game.floatingTexts.push(new FloatingText(140, 40, `Premia fali +${bonus} gold`, "#ffe36b", 1.3, 20, true));
        showBanner(`Fala ${game.wave} ukończona`);

        if (game.wave >= game.maxWaves) {
            endGame(true);
        } else if (game.autoWaveEnabled) {
            game.autoWaveCountdown = 0.75;
            statusText.textContent = `Fala ${game.wave} ukończona. Auto fala za chwilę...`;
        } else {
            statusText.textContent = `Fala ${game.wave} ukończona. Naciśnij Spację, aby wystartować kolejną.`;
        }
    }

    if (game.selectedTowerId && !game.towers.find(t => t.id === game.selectedTowerId)) {
        game.selectedTowerId = null;
    }

    updateHUD();
}

function draw() {
    // Czyścimy pełny bufor pikseli
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Skala z bufora pikseli do świata gry 980x640
    const sx = canvas.width / WIDTH;
    const sy = canvas.height / HEIGHT;
    ctx.setTransform(sx, 0, 0, sy, 0, 0);

    drawBackground();
    drawPath();
    drawAmbient();
    drawBuildSpots();
    drawDecorations();

    for (const tower of game.towers) tower.draw(ctx);
    for (const beam of game.beams) beam.draw(ctx);
    for (const projectile of game.projectiles) projectile.draw(ctx);
    for (const enemy of game.enemies) enemy.draw(ctx);
    for (const effect of game.effects) effect.draw(ctx);
    for (const text of game.floatingTexts) text.draw(ctx);

    drawBase();
    drawBuildGhost();
}

function gameLoop(timestamp) {
    if (!game.lastTime) game.lastTime = timestamp;
    const dt = Math.min(0.033, (timestamp - game.lastTime) / 1000);
    game.lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

function updateAmbient(dt) {
    for (const mote of game.ambientMotes) {
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;

        if (mote.x < -10) mote.x = WIDTH + 10;
        if (mote.x > WIDTH + 10) mote.x = -10;
        if (mote.y < -12) {
            mote.y = HEIGHT + 8;
            mote.x = Math.random() * WIDTH;
        }
    }
}

function drawAmbient() {
    const t = performance.now() * 0.004;
    for (const mote of game.ambientMotes) {
        ctx.save();
        const pulse = 0.3 + ((Math.sin(t + mote.phase) + 1) * 0.5) * 0.5;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = mote.color;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawBackground() {
    ctx.save();

    const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    bg.addColorStop(0, "#10213d");
    bg.addColorStop(1, "#091426");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let x = 0; x <= WIDTH; x += 64) {
        for (let y = 0; y <= HEIGHT; y += 64) {
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.strokeRect(x, y, 64, 64);
        }
    }

    for (let i = 0; i < 30; i++) {
        const x = (i * 87) % WIDTH;
        const y = (i * 131) % HEIGHT;
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.beginPath();
        ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
    }

    const sweep = (performance.now() * 0.03) % (WIDTH + 220) - 110;
    const streak = ctx.createLinearGradient(sweep - 120, 0, sweep + 120, HEIGHT);
    streak.addColorStop(0, "rgba(122,169,255,0)");
    streak.addColorStop(0.5, "rgba(122,169,255,0.06)");
    streak.addColorStop(1, "rgba(122,169,255,0)");
    ctx.fillStyle = streak;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.restore();
}

function drawPath() {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "rgba(0,0,0,0.24)";
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, 80, WIDTH, 560);
    grad.addColorStop(0, "#6f6258");
    grad.addColorStop(1, "#948174");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke();

    const pulse = 0.12 + ((Math.sin(performance.now() * 0.005) + 1) * 0.5) * 0.2;
    ctx.strokeStyle = `rgba(132, 214, 255, ${pulse.toFixed(3)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke();

    ctx.restore();
}

function drawDecorations() {
    const gems = [
        { x: 48, y: 54, c: "#2ee38c" },
        { x: 214, y: 586, c: "#ff4d67" },
        { x: 664, y: 72, c: "#7fd7ff" },
        { x: 922, y: 72, c: "#b26cff" },
        { x: 928, y: 604, c: "#ffc94d" }
    ];

    for (const g of gems) {
        ctx.save();
        const glow = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, 22);
        glow.addColorStop(0, hexToRgba(g.c, 0.28));
        glow.addColorStop(1, hexToRgba(g.c, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(g.x, g.y, 22, 0, Math.PI * 2);
        ctx.fill();
        drawGem(ctx, g.x, g.y, 10, g.c, "diamond");
        ctx.restore();
    }
}

function drawBuildSpots() {
    for (const spot of buildSpots) {
        const occupied = game.towers.some(t => t.spotId === spot.id);
        const hovered = isMouseNearSpot(spot);

        ctx.save();
        ctx.fillStyle = occupied ? "rgba(255,255,255,0.12)" : hovered ? "rgba(255,255,255,0.26)" : "rgba(255,255,255,0.14)";
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = hovered && !occupied ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.14)";
        ctx.lineWidth = 2;
        ctx.stroke();

        if (!occupied) {
            ctx.strokeStyle = "rgba(255,255,255,0.08)";
            ctx.beginPath();
            ctx.moveTo(spot.x - 10, spot.y);
            ctx.lineTo(spot.x + 10, spot.y);
            ctx.moveTo(spot.x, spot.y - 10);
            ctx.lineTo(spot.x, spot.y + 10);
            ctx.stroke();
        }

        ctx.restore();
    }
}

function drawBase() {
    const base = path[path.length - 1];
    ctx.save();

    const glow = ctx.createRadialGradient(base.x, base.y, 10, base.x, base.y, 58);
    glow.addColorStop(0, "rgba(120,190,255,0.4)");
    glow.addColorStop(1, "rgba(120,190,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(base.x, base.y, 58, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4b7fd0";
    ctx.fillRect(base.x - 19, base.y - 19, 38, 38);

    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(base.x - 19, base.y - 19, 38, 38);

    ctx.fillStyle = "#eef7ff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("BASE", base.x, base.y - 30);

    ctx.restore();
}

function drawBuildGhost() {
    if (!game.buildMode) return;
    const type = towerData[game.buildMode];
    const spot = getSpotAt(mouseX, mouseY);
    if (!spot) return;
    if (game.towers.some(t => t.spotId === spot.id)) return;

    const canAfford = game.gold >= towerCosts[game.buildMode];
    ctx.save();
    ctx.globalAlpha = canAfford ? 0.84 : 0.45;
    ctx.strokeStyle = canAfford ? "rgba(255,255,255,0.55)" : "rgba(255,120,120,0.75)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, type.range[0], 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    drawGem(ctx, spot.x, spot.y, 19, type.color, game.buildMode);
    ctx.restore();
}

function updateAutoWaveButton() {
    if (!autoWaveBtn) return;
    autoWaveBtn.classList.toggle("active", game.autoWaveEnabled);
    autoWaveBtn.textContent = game.autoWaveEnabled ? "Auto fale: WŁ" : "Auto fale: WYŁ";
}

function updateHUD() {
    goldValue.textContent = game.gold;
    baseHpValue.textContent = game.baseHp;
    waveValue.textContent = `${game.wave}/${game.maxWaves}`;
    enemiesLeftValue.textContent = game.enemies.length + game.spawnQueue.length;

    renderSelectedTowerInfo();

    const selectedTower = getSelectedTower();
    const canUpgrade = selectedTower && selectedTower.canUpgrade() && game.gold >= selectedTower.getUpgradeCost();
    upgradeBtn.disabled = !canUpgrade;
    sellBtn.disabled = !selectedTower;

    startWaveBtn.disabled = game.waveInProgress || game.gameOver || game.wave >= game.maxWaves;
    updateAutoWaveButton();
}

function renderSelectedTowerInfo() {
    const tower = getSelectedTower();
    if (!tower) {
        selectedTowerPanel.innerHTML = `<p>Nie wybrano wieży.</p>`;
        return;
    }

    const data = tower.getData();
    const nextCost = tower.getUpgradeCost();

    let special = "";
    if (tower.type === "emerald") {
        special = `Poison: ${tower.getStat("poisonDps")}/s przez ${tower.getStat("poisonDuration").toFixed(1)}s`;
    } else if (tower.type === "ruby") {
        special = `Splash: ${tower.getStat("splash")}`;
    } else if (tower.type === "diamond") {
        special = `Crit: ${Math.round(tower.getStat("critChance") * 100)}% | Pierce: ${tower.getStat("armorPierce")}`;
    } else if (tower.type === "amethyst") {
        special = `Chain: ${tower.getStat("chainCount")} | Falloff: ${Math.round(tower.getStat("chainFalloff") * 100)}%`;
    } else if (tower.type === "topaz") {
        special = `Slow: ${Math.round((1 - tower.getStat("slowPower")) * 100)}% przez ${tower.getStat("slowDuration").toFixed(1)}s`;
    }

    selectedTowerPanel.innerHTML = `
    <div class="name" style="color:${data.color}">${data.name}</div>
    <div class="row"><span>Poziom</span><strong>${tower.level}</strong></div>
    <div class="row"><span>Damage</span><strong>${tower.getStat("damage")}</strong></div>
    <div class="row"><span>Range</span><strong>${tower.getRange()}</strong></div>
    <div class="row"><span>Atk/s</span><strong>${tower.getStat("fireRate").toFixed(2)}</strong></div>
    <div class="row"><span>Specjalne</span><strong>${special}</strong></div>
    <div class="row"><span>Upgrade</span><strong>${nextCost ? nextCost + " gold" : "MAX"}</strong></div>
    <div class="row"><span>Sprzedaż</span><strong>${tower.getSellValue()} gold</strong></div>
  `;
}

function getSelectedTower() {
    return game.towers.find(t => t.id === game.selectedTowerId) || null;
}

function buildTower(type, spot) {
    const cost = towerCosts[type];
    if (game.gold < cost) {
        statusText.textContent = "Za mało golda na tę wieżę.";
        return;
    }

    if (game.towers.some(t => t.spotId === spot.id)) {
        statusText.textContent = "To pole jest zajęte.";
        return;
    }

    game.gold -= cost;
    const tower = new Tower(type, spot);
    game.towers.push(tower);
    game.selectedTowerId = tower.id;
    game.effects.push(new BurstEffect(spot.x, spot.y, tower.getData().color, 24, 0.6));
    game.floatingTexts.push(new FloatingText(spot.x, spot.y - 22, `-${cost}`, "#ffb8b8", 0.9, 18));
    statusText.textContent = `Postawiono ${tower.getData().name}.`;
    updateHUD();
}

function sellSelectedTower() {
    const tower = getSelectedTower();
    if (!tower) return;

    const value = tower.getSellValue();
    game.gold += value;
    game.effects.push(new BurstEffect(tower.x, tower.y, tower.getData().color, 20, 0.5));
    game.floatingTexts.push(new FloatingText(tower.x, tower.y - 18, `+${value} gold`, "#ffe36b", 1.2, 20, true));
    game.towers = game.towers.filter(t => t.id !== tower.id);
    game.selectedTowerId = null;
    statusText.textContent = `Sprzedano ${tower.getData().name}.`;
    updateHUD();
}

function endGame(victory) {
    if (game.gameOver) return;
    game.gameOver = true;
    game.victory = victory;
    showOverlay(
        victory ? "Zwycięstwo!" : "Game Over",
        victory
            ? `Przetrwałeś wszystkie ${game.maxWaves} fal. Pozostałe HP bazy: ${game.baseHp}.`
            : `Baza została zniszczona podczas fali ${game.wave}.`
    );
    statusText.textContent = victory ? "Wygrana!" : "Przegrana.";
}

function showOverlay(title, text) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlay.classList.remove("hidden");
}

function hideOverlay() {
    overlay.classList.add("hidden");
}

function showBanner(text) {
    waveBanner.textContent = text;
    waveBanner.classList.remove("hidden");
    game.bannerTimer = 1.8;
}

function updateBanner(dt) {
    if (game.bannerTimer > 0) {
        game.bannerTimer -= dt;
        if (game.bannerTimer <= 0) {
            waveBanner.classList.add("hidden");
        }
    }
}

function getSpotAt(x, y) {
    return buildSpots.find(spot => distance(x, y, spot.x, spot.y) <= spot.r + 6) || null;
}

function getTowerAt(x, y) {
    return game.towers.find(tower => distance(x, y, tower.x, tower.y) <= 26) || null;
}

function isMouseNearSpot(spot) {
    return distance(mouseX, mouseY, spot.x, spot.y) <= spot.r + 8;
}

function setGameSpeed(speed) {
    game.timeScale = speed;
    updateHUD();
}

function clearBuildSelection(update = true) {
    game.buildMode = null;
    if (update) updateHUD();
}

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    mouseY = ((e.clientY - rect.top) / rect.height) * HEIGHT;
});

canvas.addEventListener("mouseleave", () => {
    mouseX = -999;
    mouseY = -999;
});

canvas.addEventListener("click", (e) => {
    if (game.gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * HEIGHT;

    const clickedTower = getTowerAt(x, y);
    if (clickedTower) {
        game.selectedTowerId = clickedTower.id;
        statusText.textContent = `Wybrano ${clickedTower.getData().name}.`;
        updateHUD();
        return;
    }

    const spot = getSpotAt(x, y);
    if (spot && game.buildMode) {
        buildTower(game.buildMode, spot);
        return;
    }

    game.selectedTowerId = null;
    updateHUD();
});

buildButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (game.gameOver) return;
        const type = btn.dataset.tower;
        game.buildMode = game.buildMode === type ? null : type;
        statusText.textContent = game.buildMode
            ? `Tryb budowy: ${towerData[type].name}. Kliknij wolne pole.`
            : "Anulowano tryb budowy.";
        updateHUD();
    });
});

speedButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        setGameSpeed(Number(btn.dataset.speed));
    });
});

upgradeBtn.addEventListener("click", () => {
    const tower = getSelectedTower();
    if (!tower) return;

    if (!tower.canUpgrade()) {
        statusText.textContent = "Ta wieża ma już maksymalny poziom.";
        return;
    }

    const cost = tower.getUpgradeCost();
    if (game.gold < cost) {
        statusText.textContent = "Za mało golda na ulepszenie.";
        return;
    }

    tower.upgrade();
    statusText.textContent = `${tower.getData().name} ulepszono do poziomu ${tower.level}.`;
    updateHUD();
});

sellBtn.addEventListener("click", sellSelectedTower);
startWaveBtn.addEventListener("click", startNextWave);

autoWaveBtn.addEventListener("click", () => {
    if (game.gameOver) return;
    game.autoWaveEnabled = !game.autoWaveEnabled;

    if (game.autoWaveEnabled) {
        if (!game.waveInProgress && game.wave < game.maxWaves) {
            if (game.spawnQueue.length === 0 && game.enemies.length === 0) {
                startNextWave();
            }
        }
        statusText.textContent = game.waveInProgress
            ? "Auto fale aktywne."
            : "Auto fale aktywne."
    } else {
        game.autoWaveCountdown = 0;
        statusText.textContent = "Auto fale wyłączone.";
    }

    updateHUD();
});
restartBtn.addEventListener("click", resetGame);
overlayRestartBtn.addEventListener("click", resetGame);

menuStartBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    resetGame();
    requestAnimationFrame(() => {
        resizeGameViewport();
    });
});

backToMenuBtn.addEventListener("click", () => {
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    hideOverlay();
});

overlayMenuBtn.addEventListener("click", () => {
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    hideOverlay();
});

window.addEventListener("keydown", (e) => {
    if (mainMenu.classList.contains("hidden") === false) return;

    if (e.code === "Space") {
        e.preventDefault();
        startNextWave();
    }

    if (e.code === "Escape") {
        clearBuildSelection();
        statusText.textContent = "Anulowano tryb budowy.";
    }

    if (e.key === "1") setGameSpeed(1);
    if (e.key === "2") setGameSpeed(2);
    if (e.key === "3") setGameSpeed(3);
});

window.addEventListener("resize", () => {
    resizeGameViewport();
});

function drawGem(ctx, x, y, size, color, type, level = 1) {
    ctx.save();

    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8);
    glow.addColorStop(0, hexToRgba(color, 0.28));
    glow.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
    ctx.fill();

    const gradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.12, lightenHex(color, 0.45));
    gradient.addColorStop(0.4, color);
    gradient.addColorStop(1, darkenHex(color, 0.4));

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(255,255,255,0.42)";
    ctx.lineWidth = 2;

    ctx.beginPath();

    if (type === "emerald") {
        if (level <= 1) {
            ctx.moveTo(x - size * 0.18, y - size);
            ctx.lineTo(x + size * 0.36, y - size * 0.84);
            ctx.lineTo(x + size * 0.78, y - size * 0.2);
            ctx.lineTo(x + size * 0.5, y + size * 0.76);
            ctx.lineTo(x - size * 0.16, y + size);
            ctx.lineTo(x - size * 0.7, y + size * 0.42);
            ctx.lineTo(x - size * 0.82, y - size * 0.24);
            ctx.lineTo(x - size * 0.48, y - size * 0.78);
        } else if (level === 2) {
            ctx.moveTo(x - size * 0.62, y - size * 0.86);
            ctx.lineTo(x + size * 0.62, y - size * 0.86);
            ctx.lineTo(x + size, y - size * 0.3);
            ctx.lineTo(x + size, y + size * 0.3);
            ctx.lineTo(x + size * 0.62, y + size * 0.86);
            ctx.lineTo(x - size * 0.62, y + size * 0.86);
            ctx.lineTo(x - size, y + size * 0.3);
            ctx.lineTo(x - size, y - size * 0.3);
        } else {
            // L3: emerald cut (prostokatny step cut).
            ctx.moveTo(x - size * 0.56, y - size * 0.82);
            ctx.lineTo(x + size * 0.56, y - size * 0.82);
            ctx.lineTo(x + size * 0.8, y - size * 0.5);
            ctx.lineTo(x + size * 0.8, y + size * 0.5);
            ctx.lineTo(x + size * 0.56, y + size * 0.82);
            ctx.lineTo(x - size * 0.56, y + size * 0.82);
            ctx.lineTo(x - size * 0.8, y + size * 0.5);
            ctx.lineTo(x - size * 0.8, y - size * 0.5);
        }
    } else if (type === "ruby") {
        if (level <= 1) {
            ctx.moveTo(x - size * 0.16, y - size);
            ctx.lineTo(x + size * 0.42, y - size * 0.82);
            ctx.lineTo(x + size * 0.86, y - size * 0.16);
            ctx.lineTo(x + size * 0.52, y + size * 0.86);
            ctx.lineTo(x - size * 0.12, y + size);
            ctx.lineTo(x - size * 0.76, y + size * 0.42);
            ctx.lineTo(x - size * 0.88, y - size * 0.18);
            ctx.lineTo(x - size * 0.46, y - size * 0.82);
        } else if (level === 2) {
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size * 0.9, y - size * 0.06);
            ctx.lineTo(x + size * 0.45, y + size * 0.88);
            ctx.lineTo(x - size * 0.45, y + size * 0.88);
            ctx.lineTo(x - size * 0.9, y - size * 0.06);
        } else {
            // L3: cushion cut (zaokraglony kwadrat).
            const r = size * 0.78;
            const c = r * 0.42;
            ctx.moveTo(x - r + c, y - r);
            ctx.lineTo(x + r - c, y - r);
            ctx.quadraticCurveTo(x + r, y - r, x + r, y - r + c);
            ctx.lineTo(x + r, y + r - c);
            ctx.quadraticCurveTo(x + r, y + r, x + r - c, y + r);
            ctx.lineTo(x - r + c, y + r);
            ctx.quadraticCurveTo(x - r, y + r, x - r, y + r - c);
            ctx.lineTo(x - r, y - r + c);
            ctx.quadraticCurveTo(x - r, y - r, x - r + c, y - r);
        }
    } else if (type === "diamond") {
        if (level <= 1) {
            // L1: surowy, nieoszlifowany ksztalt.
            ctx.moveTo(x - size * 0.18, y - size);
            ctx.lineTo(x + size * 0.34, y - size * 0.82);
            ctx.lineTo(x + size * 0.78, y - size * 0.24);
            ctx.lineTo(x + size * 0.56, y + size * 0.56);
            ctx.lineTo(x + size * 0.08, y + size);
            ctx.lineTo(x - size * 0.64, y + size * 0.52);
            ctx.lineTo(x - size * 0.84, y - size * 0.12);
            ctx.lineTo(x - size * 0.52, y - size * 0.74);
        } else if (level === 2) {
            // L2: dociety klasyczny diament.
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size * 0.52, y - size * 0.28);
            ctx.lineTo(x + size * 0.84, y + size * 0.2);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x - size * 0.84, y + size * 0.2);
            ctx.lineTo(x - size * 0.52, y - size * 0.28);
        } else {
            // L3: brylant widziany z boku (profil).
            ctx.moveTo(x - size * 0.82, y - size * 0.05);
            ctx.lineTo(x - size * 0.52, y - size * 0.44);
            ctx.lineTo(x - size * 0.16, y - size * 0.66);
            ctx.lineTo(x + size * 0.16, y - size * 0.66);
            ctx.lineTo(x + size * 0.52, y - size * 0.44);
            ctx.lineTo(x + size * 0.82, y - size * 0.05);
            ctx.lineTo(x + size * 0.34, y + size * 0.58);
            ctx.lineTo(x, y + size * 0.94);
            ctx.lineTo(x - size * 0.34, y + size * 0.58);
        }
    } else if (type === "amethyst") {
        if (level <= 1) {
            ctx.moveTo(x - size * 0.22, y - size);
            ctx.lineTo(x + size * 0.28, y - size * 0.9);
            ctx.lineTo(x + size * 0.86, y - size * 0.24);
            ctx.lineTo(x + size * 0.64, y + size * 0.66);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x - size * 0.64, y + size * 0.66);
            ctx.lineTo(x - size * 0.86, y - size * 0.24);
            ctx.lineTo(x - size * 0.34, y - size * 0.9);
        } else if (level === 2) {
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size * 0.7, y - size * 0.55);
            ctx.lineTo(x + size * 0.92, y + size * 0.08);
            ctx.lineTo(x + size * 0.45, y + size * 0.9);
            ctx.lineTo(x - size * 0.45, y + size * 0.9);
            ctx.lineTo(x - size * 0.92, y + size * 0.08);
            ctx.lineTo(x - size * 0.7, y - size * 0.55);
        } else {
            // L3: oval cut.
            ctx.moveTo(x, y - size);
            ctx.bezierCurveTo(x + size * 0.88, y - size, x + size * 0.98, y + size * 0.18, x, y + size);
            ctx.bezierCurveTo(x - size * 0.98, y + size * 0.18, x - size * 0.88, y - size, x, y - size);
        }
    } else {
        if (level <= 1) {
            ctx.moveTo(x - size * 0.2, y - size);
            ctx.lineTo(x + size * 0.36, y - size * 0.84);
            ctx.lineTo(x + size * 0.82, y - size * 0.2);
            ctx.lineTo(x + size * 0.54, y + size * 0.78);
            ctx.lineTo(x - size * 0.06, y + size);
            ctx.lineTo(x - size * 0.72, y + size * 0.46);
            ctx.lineTo(x - size * 0.84, y - size * 0.18);
            ctx.lineTo(x - size * 0.5, y - size * 0.82);
        } else if (level === 2) {
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size * 0.8, y - size * 0.22);
            ctx.lineTo(x + size * 0.5, y + size);
            ctx.lineTo(x - size * 0.5, y + size);
            ctx.lineTo(x - size * 0.8, y - size * 0.22);
        } else {
            // L3: pear cut (gruszka).
            ctx.moveTo(x, y - size);
            ctx.bezierCurveTo(x + size * 0.88, y - size * 0.66, x + size * 0.98, y + size * 0.4, x, y + size);
            ctx.bezierCurveTo(x - size * 0.98, y + size * 0.4, x - size * 0.88, y - size * 0.66, x, y - size);
        }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (type === "diamond" && level >= 2) {
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y - size * 0.84);
        ctx.lineTo(x, y + size * 0.86);
        ctx.moveTo(x - size * 0.42, y - size * 0.3);
        ctx.lineTo(x + size * 0.42, y - size * 0.3);
        ctx.stroke();
    }

    if (type === "diamond" && level >= 3) {
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // Table and girdle
        ctx.moveTo(x - size * 0.16, y - size * 0.66);
        ctx.lineTo(x, y - size * 0.05);
        ctx.lineTo(x + size * 0.16, y - size * 0.66);
        // Crown facets
        ctx.moveTo(x - size * 0.52, y - size * 0.44);
        ctx.lineTo(x, y - size * 0.05);
        ctx.lineTo(x + size * 0.52, y - size * 0.44);
        // Pavilion facets
        ctx.moveTo(x - size * 0.34, y + size * 0.58);
        ctx.lineTo(x, y + size * 0.94);
        ctx.lineTo(x + size * 0.34, y + size * 0.58);
        ctx.moveTo(x - size * 0.82, y - size * 0.05);
        ctx.lineTo(x - size * 0.34, y + size * 0.58);
        ctx.moveTo(x + size * 0.82, y - size * 0.05);
        ctx.lineTo(x + size * 0.34, y + size * 0.58);
        ctx.stroke();

        // Subtelny shimmer tylko dla brylantu L3.
        const shimmerTime = performance.now() * 0.003;
        const shimmerPulse = 0.28 + ((Math.sin(shimmerTime) + 1) * 0.5) * 0.52;
        const sparkleX = x + Math.sin(shimmerTime * 0.7) * size * 0.22;
        const sparkleY = y - size * 0.5 + Math.cos(shimmerTime * 0.9) * size * 0.08;

        ctx.save();
        ctx.globalAlpha = shimmerPulse;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sparkleX - size * 0.1, sparkleY);
        ctx.lineTo(sparkleX + size * 0.1, sparkleY);
        ctx.moveTo(sparkleX, sparkleY - size * 0.1);
        ctx.lineTo(sparkleX, sparkleY + size * 0.1);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, size * 0.045, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fill();
        ctx.restore();
    }

    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.78);
    ctx.lineTo(x + size * 0.28, y + size * 0.06);
    ctx.lineTo(x - size * 0.28, y + size * 0.06);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fill();

    ctx.restore();
}

function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lightenHex(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const nr = Math.round(r + (255 - r) * amount);
    const ng = Math.round(g + (255 - g) * amount);
    const nb = Math.round(b + (255 - b) * amount);
    return rgbToHex(nr, ng, nb);
}

function darkenHex(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const nr = Math.round(r * (1 - amount));
    const ng = Math.round(g * (1 - amount));
    const nb = Math.round(b * (1 - amount));
    return rgbToHex(nr, ng, nb);
}

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function createId() {
    return "id-" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

resetGame();
requestAnimationFrame(() => {
    resizeGameViewport();
});
requestAnimationFrame(gameLoop);

