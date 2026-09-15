'use strict';

/* ================================================================
   CONFIGURATION
   ================================================================ */
const VW = 1200, VH = 675, GROUND_Y = 570;
const PEEK_OFFSET = 110;
const PLAYER_H = 80;
const PLAYER_SPEED = 500;

const WEAPON_DEFS = [
    { id:'assault', name:'Assault Rifle', damage:18, fireRate:140, magSize:30, reloadTime:2000, spread:0.06, speed:1400, count:1, color:'#ffff00', icon:'AR' },
    { id:'shotgun', name:'Shotgun', damage:12, fireRate:750, magSize:6, reloadTime:2500, spread:0.28, speed:1100, count:7, color:'#ff9900', icon:'SG' },
    { id:'sniper', name:'Sniper Rifle', damage:85, fireRate:1400, magSize:5, reloadTime:2800, spread:0.015, speed:2200, count:1, color:'#00ffff', icon:'SR', piercing:true, headshotMult:2.5 }
];

const LEVELS = [
    {
        name:'First Contact', timer:120, coverHP:250,
        covers:[{x:150,w:70,h:140},{x:330,w:70,h:140},{x:510,w:70,h:140},{x:690,w:70,h:140}],
        waves:[
            {t:1500,enemies:[{type:'soldier',x:1000,y:GROUND_Y-70}]},
            {t:4000,enemies:[{type:'soldier',x:1060,y:GROUND_Y-70}]},
            {t:7000,enemies:[{type:'soldier',x:950,y:GROUND_Y-70},{type:'soldier',x:1080,y:GROUND_Y-70}]},
            {t:10000,enemies:[{type:'soldier',x:1000,y:GROUND_Y-70},{type:'soldier',x:1100,y:GROUND_Y-70}]},
            {t:14000,enemies:[{type:'soldier',x:960,y:GROUND_Y-70},{type:'soldier',x:1040,y:GROUND_Y-70},{type:'soldier',x:1100,y:GROUND_Y-70}]}
        ],
        missions:[{desc:'Kill 8 enemies',type:'kills',target:8},{desc:'Score 3 headshots',type:'headshots',target:3},{desc:'Finish in 90s',type:'time',target:90}]
    },
    {
        name:'Sniper Alley', timer:120, coverHP:220,
        covers:[{x:150,w:70,h:140},{x:330,w:70,h:140},{x:510,w:70,h:140},{x:690,w:70,h:140}],
        waves:[
            {t:1000,enemies:[{type:'soldier',x:1000,y:GROUND_Y-70}]},
            {t:3000,enemies:[{type:'sniper',x:1050,y:GROUND_Y-90}]},
            {t:6000,enemies:[{type:'soldier',x:950,y:GROUND_Y-70},{type:'soldier',x:1080,y:GROUND_Y-70}]},
            {t:9000,enemies:[{type:'sniper',x:1000,y:GROUND_Y-90},{type:'soldier',x:1100,y:GROUND_Y-70}]},
            {t:13000,enemies:[{type:'soldier',x:960,y:GROUND_Y-70},{type:'sniper',x:1060,y:GROUND_Y-90},{type:'soldier',x:1100,y:GROUND_Y-70}]}
        ],
        missions:[{desc:'Kill 6 with Sniper',type:'weaponKills',weapon:2,target:6},{desc:'Kill 10 enemies',type:'kills',target:10},{desc:'Finish in 80s',type:'time',target:80}]
    },
    {
        name:'Heavy Fire', timer:150, coverHP:200,
        covers:[{x:150,w:70,h:140},{x:330,w:70,h:140},{x:510,w:70,h:140},{x:690,w:70,h:140}],
        waves:[
            {t:1000,enemies:[{type:'soldier',x:1000,y:GROUND_Y-70},{type:'soldier',x:1100,y:GROUND_Y-70}]},
            {t:4000,enemies:[{type:'sniper',x:1050,y:GROUND_Y-90}]},
            {t:7000,enemies:[{type:'soldier',x:960,y:GROUND_Y-70},{type:'soldier',x:1040,y:GROUND_Y-70},{type:'sniper',x:1100,y:GROUND_Y-90}]},
            {t:11000,enemies:[{type:'soldier',x:950,y:GROUND_Y-70},{type:'soldier',x:1050,y:GROUND_Y-70},{type:'soldier',x:1100,y:GROUND_Y-70}]},
            {t:15000,enemies:[{type:'sniper',x:1000,y:GROUND_Y-90},{type:'sniper',x:1080,y:GROUND_Y-90},{type:'soldier',x:1040,y:GROUND_Y-70}]},
            {t:19000,enemies:[{type:'soldier',x:950,y:GROUND_Y-70},{type:'soldier',x:1030,y:GROUND_Y-70},{type:'sniper',x:1100,y:GROUND_Y-90}]}
        ],
        missions:[{desc:'Kill 14 enemies',type:'kills',target:14},{desc:'Score 5 headshots',type:'headshots',target:5},{desc:'Keep 50% cover',type:'coverHP',target:50}]
    },
    {
        name:'Boss Encounter', timer:150, coverHP:250,
        covers:[{x:150,w:70,h:140},{x:330,w:70,h:140},{x:510,w:70,h:140},{x:690,w:70,h:140}],
        waves:[
            {t:1000,enemies:[{type:'soldier',x:1000,y:GROUND_Y-70}]},
            {t:3000,enemies:[{type:'soldier',x:1060,y:GROUND_Y-70},{type:'sniper',x:1100,y:GROUND_Y-90}]},
            {t:7000,enemies:[{type:'boss',x:1050,y:GROUND_Y-100}]},
            {t:12000,enemies:[{type:'soldier',x:960,y:GROUND_Y-70},{type:'soldier',x:1060,y:GROUND_Y-70}]},
            {t:16000,enemies:[{type:'sniper',x:1000,y:GROUND_Y-90},{type:'soldier',x:1080,y:GROUND_Y-70}]}
        ],
        missions:[{desc:'Kill the Boss',type:'bossKill',target:1},{desc:'Kill 10 enemies',type:'kills',target:10},{desc:'Finish in 100s',type:'time',target:100}]
    },
    {
        name:'Last Stand', timer:180, coverHP:200,
        covers:[{x:150,w:70,h:140},{x:330,w:70,h:140},{x:510,w:70,h:140},{x:690,w:70,h:140}],
        waves:[
            {t:1000,enemies:[{type:'soldier',x:980,y:GROUND_Y-70},{type:'soldier',x:1060,y:GROUND_Y-70},{type:'soldier',x:1120,y:GROUND_Y-70}]},
            {t:5000,enemies:[{type:'sniper',x:1000,y:GROUND_Y-90},{type:'sniper',x:1080,y:GROUND_Y-90}]},
            {t:9000,enemies:[{type:'boss',x:1050,y:GROUND_Y-100}]},
            {t:14000,enemies:[{type:'soldier',x:950,y:GROUND_Y-70},{type:'soldier',x:1030,y:GROUND_Y-70},{type:'sniper',x:1100,y:GROUND_Y-90}]},
            {t:18000,enemies:[{type:'soldier',x:960,y:GROUND_Y-70},{type:'soldier',x:1040,y:GROUND_Y-70},{type:'soldier',x:1100,y:GROUND_Y-70},{type:'sniper',x:1080,y:GROUND_Y-90}]},
            {t:23000,enemies:[{type:'boss',x:1050,y:GROUND_Y-100},{type:'sniper',x:1000,y:GROUND_Y-90}]},
            {t:28000,enemies:[{type:'soldier',x:950,y:GROUND_Y-70},{type:'soldier',x:1030,y:GROUND_Y-70},{type:'soldier',x:1100,y:GROUND_Y-70}]}
        ],
        missions:[{desc:'Kill 20 enemies',type:'kills',target:20},{desc:'Kill 2 bosses',type:'bossKill',target:2},{desc:'Score 8 headshots',type:'headshots',target:8}]
    }
];

/* ================================================================
   UTILITIES
   ================================================================ */
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function dist(x1,y1,x2,y2){return Math.hypot(x2-x1,y2-y1);}
function rand(a,b){return a+Math.random()*(b-a);}
function randInt(a,b){return Math.floor(rand(a,b+1));}
function circleRectOverlap(cx,cy,cr,rx,ry,rw,rh){
    const nx=clamp(cx,rx,rx+rw);
    const ny=clamp(cy,ry,ry+rh);
    return dist(cx,cy,nx,ny)<cr;
}

/* ================================================================
   SOUND MANAGER (Web Audio API procedural sounds)
   ================================================================ */
class SoundManager {
    constructor(){
        this.ctx = null;
        this.enabled = true;
    }
    init(){
        try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }
        catch(e){ this.enabled = false; }
    }
    resume(){ if(this.ctx && this.ctx.state==='suspended') this.ctx.resume(); }
    _noise(dur, freq, type, vol, decay){
        if(!this.enabled||!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type||'square';
        o.frequency.setValueAtTime(freq||800, this.ctx.currentTime);
        if(decay) o.frequency.exponentialRampToValueAtTime(decay, this.ctx.currentTime+dur);
        g.gain.setValueAtTime(vol||0.15, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime+dur);
        o.connect(g).connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime+dur);
    }
    shoot(type){
        if(type==='shotgun'){ this._noise(0.1,200,'sawtooth',0.12,80); this._noise(0.06,600,'square',0.08,200); }
        else if(type==='sniper'){ this._noise(0.15,1200,'sine',0.1,400); this._noise(0.08,2000,'square',0.06,600); }
        else { this._noise(0.06,800,'square',0.08,300); }
    }
    reload(){ this._noise(0.1,400,'sine',0.06,200); setTimeout(()=>this._noise(0.08,600,'sine',0.06,300),100); }
    hit(){ this._noise(0.06,300,'triangle',0.08,100); }
    explosion(){ this._noise(0.3,100,'sawtooth',0.15,30); this._noise(0.2,200,'square',0.08,50); }
    enemyShoot(){ this._noise(0.05,500,'square',0.05,200); }
    sniperCharge(){ this._noise(1.2,300,'sine',0.04,900); }
    playerHurt(){ this._noise(0.15,200,'sawtooth',0.1,80); }
}

/* ================================================================
   PARTICLE
   ================================================================ */
class Particle {
    constructor(x,y,vx,vy,color,life,size){
        this.x=x; this.y=y; this.vx=vx; this.vy=vy;
        this.color=color; this.life=life; this.maxLife=life;
        this.size=size||3; this.alive=true;
    }
    update(dt){
        this.x+=this.vx*dt; this.y+=this.vy*dt;
        this.vy+=200*dt;
        this.life-=dt;
        if(this.life<=0) this.alive=false;
    }
    draw(ctx){
        const a = clamp(this.life/this.maxLife,0,1);
        ctx.globalAlpha=a;
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
        ctx.globalAlpha=1;
    }
}

class HeadshotText extends Particle {
    constructor(x,y){
        super(x,y,0,-60,'#ffff00',1,0);
        this.text='HEADSHOT';
    }
    draw(ctx){
        const a=clamp(this.life/this.maxLife,0,1);
        ctx.globalAlpha=a;
        ctx.fillStyle='#ff0';
        ctx.font='bold 14px Arial';
        ctx.textAlign='center';
        ctx.fillText(this.text,this.x,this.y);
        ctx.globalAlpha=1;
    }
}

/* ================================================================
   PROJECTILE
   ================================================================ */
class Projectile {
    constructor(x,y,vx,vy,damage,owner,color,isPlayer){
        this.x=x; this.y=y; this.vx=vx; this.vy=vy;
        this.damage=damage; this.owner=owner; this.color=color;
        this.isPlayer=isPlayer; this.alive=true; this.radius=isPlayer?3:4;
        this.piercing=false; this.headshotMult=1;
    }
    update(dt){
        this.x+=this.vx*dt; this.y+=this.vy*dt;
        if(this.x<-20||this.x>VW+20||this.y<-20||this.y>VH+20) this.alive=false;
    }
    draw(ctx){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle=this.color;
        ctx.globalAlpha=0.4;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x-this.vx*0.02,this.y-this.vy*0.02);
        ctx.stroke();
        ctx.globalAlpha=1;
    }
}

/* ================================================================
   COVER
   ================================================================ */
class Cover {
    constructor(x,w,h,hp){
        this.x=x; this.w=w; this.h=h;
        this.hp=hp; this.maxHp=hp;
        this.destroyed=false;
        this.rubbleParticles=[];
    }
    get top(){ return GROUND_Y-this.h; }
    get centerX(){ return this.x+this.w/2; }
    takeDamage(d){
        if(this.destroyed) return;
        this.hp-=d;
        if(this.hp<=0){ this.hp=0; this.destroyed=true; this._createRubble(); }
    }
    _createRubble(){
        for(let i=0;i<12;i++){
            this.rubbleParticles.push({
                x:this.x+rand(0,this.w), y:this.top+rand(0,this.h),
                vx:rand(-100,100), vy:rand(-200,-50),
                size:rand(4,10), life:rand(0.5,1.2), color:'#777'
            });
        }
    }
    draw(ctx){
        if(this.destroyed){
            ctx.fillStyle='#555';
            for(let i=0;i<this.rubbleParticles.length;i++){
                const r=this.rubbleParticles[i];
                ctx.globalAlpha=clamp(r.life,0,1);
                ctx.fillRect(r.x-r.size/2,r.y-r.size/2,r.size,r.size);
            }
            ctx.globalAlpha=1;
            return;
        }
        const dmg = 1-this.hp/this.maxHp;
        const r = Math.floor(100+dmg*40);
        const g = Math.floor(100-dmg*40);
        const b = Math.floor(100-dmg*40);
        ctx.fillStyle=`rgb(${r},${g},${b})`;
        ctx.fillRect(this.x,this.top,this.w,this.h);
        ctx.strokeStyle='#888';
        ctx.lineWidth=2;
        ctx.strokeRect(this.x,this.top,this.w,this.h);
        if(dmg>0.3){
            ctx.strokeStyle='rgba(60,50,40,0.6)';
            ctx.lineWidth=1;
            ctx.beginPath();
            ctx.moveTo(this.x+this.w*0.3, this.top);
            ctx.lineTo(this.x+this.w*0.5, this.top+this.h*0.4);
            ctx.lineTo(this.x+this.w*0.4, this.top+this.h*0.7);
            ctx.stroke();
        }
        if(dmg>0.6){
            ctx.beginPath();
            ctx.moveTo(this.x+this.w*0.7, this.top+this.h*0.2);
            ctx.lineTo(this.x+this.w*0.6, this.top+this.h*0.6);
            ctx.lineTo(this.x+this.w*0.8, this.top+this.h*0.9);
            ctx.stroke();
        }
    }
    updateRubble(dt){
        this.rubbleParticles.forEach(r=>{
            r.x+=r.vx*dt; r.y+=r.vy*dt; r.vy+=400*dt; r.life-=dt;
        });
        this.rubbleParticles=this.rubbleParticles.filter(r=>r.life>0);
    }
}

/* ================================================================
   WEAPON INSTANCE
   ================================================================ */
class WeaponInstance {
    constructor(def){
        this.def=def;
        this.ammo=def.magSize;
        this.reloading=false;
        this.reloadTimer=0;
        this.lastFire=-9999;
    }
    canFire(now){ return !this.reloading && this.ammo>0 && (now-this.lastFire)>=this.def.fireRate; }
    startReload(){
        if(this.reloading||this.ammo===this.def.magSize) return;
        this.reloading=true;
        this.reloadTimer=this.def.reloadTime;
    }
    update(dt){
        if(this.reloading){
            this.reloadTimer-=dt*1000;
            if(this.reloadTimer<=0){
                this.ammo=this.def.magSize;
                this.reloading=false;
            }
        }
    }
    fire(now,px,py,tx,ty){
        if(!this.canFire(now)) return [];
        this.ammo--;
        this.lastFire=now;
        const d=this.def;
        const angle=Math.atan2(ty-py,tx-px);
        const projectiles=[];
        for(let i=0;i<d.count;i++){
            const spread=rand(-d.spread,d.spread);
            const a=angle+spread;
            const p=new Projectile(px,py,Math.cos(a)*d.speed,Math.sin(a)*d.speed,d.damage,null,d.color,true);
            if(d.piercing) p.piercing=true;
            if(d.headshotMult) p.headshotMult=d.headshotMult;
            projectiles.push(p);
        }
        if(this.ammo<=0) this.startReload();
        return projectiles;
    }
    get reloadPct(){
        if(!this.reloading) return 1;
        return 1-this.reloadTimer/this.def.reloadTime;
    }
}

/* ================================================================
   PLAYER
   ================================================================ */
class Player {
    constructor(levelDef){
        this.maxHealth=100;
        this.health=this.maxHealth;
        this.currentCover=0;
        this.targetCover=null;
        this.moveProgress=0;
        this.moving=false;
        this.peeking=false;
        this.inOpen=false;
        this.moveFromX=0;
        this.alive=true;
        this.x=0;
        this.baseY=GROUND_Y;
        this.displayY=GROUND_Y;
        this.weapons=WEAPON_DEFS.map(d=>new WeaponInstance(d));
        this.currentWeapon=0;
        this.coverHP=levelDef.coverHP||200;
        this.coverMaxHP=this.coverHP;
        this.damageFlash=0;
    }
    get weapon(){ return this.weapons[this.currentWeapon]; }
    switchWeapon(i){
        if(i>=0&&i<this.weapons.length&&i!==this.currentWeapon){
            this.currentWeapon=i;
        }
    }
    startMove(dir,covers){
        if(this.moving) return;
        let target;
        if(this.inOpen){
            let nearest=-1, nearestDist=Infinity;
            covers.forEach((c,i)=>{
                const dx=c.centerX-this.x;
                if((dir>0&&dx>0)||(dir<0&&dx<0)){
                    const d=Math.abs(dx);
                    if(d<nearestDist){ nearestDist=d; nearest=i; }
                }
            });
            if(nearest<0) return;
            target=nearest;
        } else {
            target=this.currentCover+dir;
            if(target<0||target>=covers.length) return;
        }
        if(covers[target].destroyed) return;
        this.targetCover=target;
        this.moving=true;
        this.moveProgress=0;
        this.peeking=false;
        this.inOpen=false;
        this.moveFromX=this.x;
    }
    update(dt,covers,keys,mouse,now,game){
        if(!this.alive) return;
        if(this.moving&&this.targetCover!==null){
            this.moveProgress+=dt*3.5;
            if(this.moveProgress>=1){
                this.currentCover=this.targetCover;
                this.targetCover=null;
                this.moving=false;
                this.moveProgress=0;
            }
        }
        if(mouse.down&&this.moving){
            this.moving=false;
            this.targetCover=null;
            this.moveProgress=0;
            this.inOpen=true;
        }
        if(this.moving){
            const to=covers[Math.min(this.targetCover,covers.length-1)];
            this.x=lerp(this.moveFromX,to.centerX,this.moveProgress);
            this.baseY=GROUND_Y;
        } else {
            if(!this.inOpen){
                const c=covers[Math.max(0,Math.min(this.currentCover,covers.length-1))];
                this.x=c.centerX;
            }
            this.baseY=GROUND_Y;
        }
        if(this.inOpen){
            this.peeking=mouse.down&&this.alive;
            this.displayY=lerp(this.displayY,GROUND_Y-10,dt*12);
        } else {
            this.peeking=!this.moving&&mouse.down&&this.alive;
            if(this.peeking){
                const c=covers[this.currentCover];
                if(c.destroyed){
                    this.displayY=lerp(this.displayY,GROUND_Y-10,dt*12);
                } else {
                    this.displayY=lerp(this.displayY,GROUND_Y-PEEK_OFFSET,dt*12);
                }
            } else {
                this.displayY=lerp(this.displayY,GROUND_Y-10,dt*12);
            }
        }
        this.weapons.forEach(w=>w.update(dt));
        if(this.damageFlash>0) this.damageFlash-=dt*3;
    }
    shoot(now,mx,my,covers){
        if(!this.alive||this.moving) return [];
        const py=this.displayY-PLAYER_H+10;
        return this.weapon.fire(now,this.x,py,mx,my);
    }
    takeDamage(d){
        this.health-=d;
        this.damageFlash=1;
        if(this.health<=0){ this.health=0; this.alive=false; }
    }
    drawBody(ctx){
        const px=this.x, py=this.displayY;
        ctx.fillStyle='#3d6b4e';
        ctx.fillRect(px-11,py-PLAYER_H+10,22,PLAYER_H-10);
        ctx.fillStyle='#d4a574';
        ctx.beginPath();
        ctx.arc(px,py-PLAYER_H,10,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle='#333';
        ctx.lineWidth=3;
        ctx.beginPath();
        ctx.moveTo(px+8,py-PLAYER_H+18);
        const gunLen=28;
        ctx.lineTo(px+gunLen,py-PLAYER_H+14);
        ctx.stroke();
        ctx.fillStyle='#555';
        ctx.fillRect(px+gunLen-4,py-PLAYER_H+12,8,5);
        if(this.damageFlash>0){
            ctx.fillStyle=`rgba(255,0,0,${this.damageFlash*0.3})`;
            ctx.fillRect(px-15,py-PLAYER_H-10,30,PLAYER_H+20);
        }
    }
}

/* ================================================================
   ENEMY BASE
   ================================================================ */
class Enemy {
    constructor(type,x,y,hp,fireRate,damage,speed){
        this.type=type; this.x=x; this.y=y;
        this.hp=hp; this.maxHp=hp;
        this.fireRate=fireRate; this.damage=damage;
        this.speed=speed||0;
        this.lastFire=0; this.alive=true;
        this.fireTimer=rand(0.5,2);
        this.flash=0;
        this.h=70; this.w=30;
        this.moveDir=0; this.moveTimer=rand(2,5);
    }
    get headY(){ return this.y-this.h+8; }
    get centerX(){ return this.x; }
    takeDamage(d){
        this.hp-=d; this.flash=0.15;
        if(this.hp<=0){ this.hp=0; this.alive=false; }
    }
    baseUpdate(dt,playerX,playerY){
        this.flash=Math.max(0,this.flash-dt);
        this.fireTimer-=dt;
        if(this.speed>0){
            this.moveTimer-=dt;
            if(this.moveTimer<=0){
                this.moveDir=rand(-1,1)>0?1:-1;
                this.moveTimer=rand(1.5,4);
            }
            this.x+=this.moveDir*this.speed*dt;
            this.x=clamp(this.x,VW*0.6,VW-30);
        }
    }
    drawBody(ctx,color){
        ctx.fillStyle=this.flash>0?'#fff':color;
        ctx.fillRect(this.x-this.w/2,this.y-this.h,this.w,this.h);
        ctx.fillStyle='#c9a07a';
        ctx.beginPath();
        ctx.arc(this.x,this.y-this.h-8,8,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle='#333';
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(this.x-8,this.y-this.h+15);
        ctx.lineTo(this.x-30,this.y-this.h+10);
        ctx.stroke();
    }
    drawHealthBar(ctx){
        if(this.hp>=this.maxHp) return;
        const bw=this.w+10;
        const bx=this.x-bw/2;
        const by=this.y-this.h-20;
        ctx.fillStyle='#333';
        ctx.fillRect(bx,by,bw,4);
        ctx.fillStyle='#f44';
        ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),4);
    }
}

/* ================================================================
   SOLDIER
   ================================================================ */
class Soldier extends Enemy {
    constructor(x,y){
        super('soldier',x,y,60,2.2,12,20);
    }
    update(dt,now,game){
        this.baseUpdate(dt,game.player.x,game.player.displayY);
        if(this.fireTimer<=0&&this.alive){
            this.fireTimer=this.fireRate+rand(-0.3,0.3);
            return this._fire(game);
        }
        return null;
    }
    _fire(game){
        const startX=this.x-15, startY=this.y-this.h+12;
        const angle=Math.atan2(game.player.displayY-PLAYER_H/2-startY,game.player.x-startX);
        const spd=500;
        const p=new Projectile(startX,startY,Math.cos(angle)*spd,Math.sin(angle)*spd,this.damage,null,'#ff4444',false);
        game.sound.enemyShoot();
        return [p];
    }
    draw(ctx){
        this.drawBody(ctx,'#8b4513');
        this.drawHealthBar(ctx);
    }
}

/* ================================================================
   SNIPER ENEMY
   ================================================================ */
class SniperEnemy extends Enemy {
    constructor(x,y){
        super('sniper',x,y,80,4.5,40,0);
        this.charging=false;
        this.chargeTime=1.8;
        this.chargeTimer=0;
        this.chargeComplete=false;
        this.sightColor='rgba(255,0,0,0.5)';
    }
    update(dt,now,game){
        this.baseUpdate(dt,game.player.x,game.player.displayY);
        if(this.charging){
            this.chargeTimer+=dt;
            if(this.chargeTimer>=this.chargeTime){
                this.charging=false;
                this.chargeTimer=0;
                this.chargeComplete=true;
            }
        }
        if(this.fireTimer<=0&&!this.charging&&this.alive){
            this.fireTimer=this.fireRate+rand(-0.5,0.5);
            this.charging=true;
            this.chargeTimer=0;
            this.chargeComplete=false;
            game.sound.sniperCharge();
        }
        if(this.chargeComplete){
            this.chargeComplete=false;
            return this._fire(game);
        }
        return null;
    }
    _fire(game){
        const startX=this.x-15, startY=this.y-this.h+12;
        const angle=Math.atan2(game.player.displayY-PLAYER_H/2-startY,game.player.x-startX);
        const spd=800;
        const p=new Projectile(startX,startY,Math.cos(angle)*spd,Math.sin(angle)*spd,this.damage,null,'#ff0000',false);
        p.radius=5;
        game.sound.enemyShoot();
        return [p];
    }
    draw(ctx){
        this.drawBody(ctx,'#5c1010');
        this.drawHealthBar(ctx);
        if(this.charging){
            const progress=this.chargeTimer/this.chargeTime;
            const px=this.x-15;
            const py=this.y-this.h+12;
            ctx.strokeStyle=`rgba(255,0,0,${0.3+progress*0.7})`;
            ctx.lineWidth=1+progress*2;
            ctx.beginPath();
            ctx.moveTo(px,py);
            ctx.lineTo(px-1500,py+(VH)*0.1);
            ctx.stroke();
            ctx.fillStyle=`rgba(255,50,50,${progress})`;
            ctx.beginPath();
            ctx.arc(px,py,4+progress*4,0,Math.PI*2);
            ctx.fill();
        }
    }
}

/* ================================================================
   BOSS ENEMY
   ================================================================ */
class BossEnemy extends Enemy {
    constructor(x,y){
        super('boss',x,y,500,0,25,40);
        this.w=50; this.h=90;
        this.missileCooldown=5;
        this.missileTimer=3;
        this.preparing=false;
        this.prepareTime=2;
        this.prepareTimer=0;
        this.moveTargetX=x;
    }
    update(dt,now,game){
        this.baseUpdate(dt,game.player.x,game.player.displayY);
        this.missileTimer-=dt;
        if(this.missileTimer<=0&&!this.preparing){
            this.preparing=true;
            this.prepareTimer=0;
            this.moveDir=0;
        }
        if(this.preparing){
            this.prepareTimer+=dt;
            if(this.prepareTimer>=this.prepareTime){
                this.preparing=false;
                this.missileTimer=this.missileCooldown;
                return this._launchMissile(game);
            }
        }
        return null;
    }
    _launchMissile(game){
        const cover=game.covers[game.player.currentCover];
        const tx=cover.centerX;
        const ty=cover.top;
        const m=new Missile(this.x-20,this.y-this.h/2,tx,ty);
        game.sound.explosion();
        return {missile:m};
    }
    draw(ctx){
        const flash=this.flash>0;
        ctx.fillStyle=flash?'#fff':'#8b0000';
        ctx.fillRect(this.x-this.w/2,this.y-this.h,this.w,this.h);
        ctx.fillStyle=flash?'#ddd':'#a01010';
        ctx.fillRect(this.x-this.w/2+5,this.y-this.h+5,this.w-10,this.h-10);
        ctx.fillStyle='#c9a07a';
        ctx.beginPath();
        ctx.arc(this.x,this.y-this.h-10,12,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle='#333';
        ctx.lineWidth=4;
        ctx.beginPath();
        ctx.moveTo(this.x-15,this.y-this.h+25);
        ctx.lineTo(this.x-40,this.y-this.h+20);
        ctx.stroke();
        ctx.fillStyle='#555';
        ctx.fillRect(this.x-48,this.y-this.h+16,12,10);
        if(this.preparing){
            const pct=this.prepareTimer/this.prepareTime;
            ctx.fillStyle=`rgba(255,100,0,${0.3+pct*0.5})`;
            ctx.beginPath();
            ctx.arc(this.x-40,this.y-this.h+21,6+pct*6,0,Math.PI*2);
            ctx.fill();
            ctx.strokeStyle='#f80';
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.arc(this.x-40,this.y-this.h+21,10+pct*8,0,Math.PI*2*pct);
            ctx.stroke();
        }
        this.drawHealthBar(ctx);
    }
    drawHealthBar(ctx){
        const bw=this.w+20;
        const bx=this.x-bw/2;
        const by=this.y-this.h-25;
        ctx.fillStyle='#333';
        ctx.fillRect(bx,by,bw,6);
        ctx.fillStyle='#f44';
        ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),6);
    }
}

/* ================================================================
   MISSILE
   ================================================================ */
class Missile {
    constructor(x,y,targetX,targetY){
        this.x=x; this.y=y;
        this.targetX=targetX; this.targetY=targetY;
        this.speed=220; this.hp=40; this.maxHp=40;
        this.damage=45; this.coverDamage=100;
        this.alive=true; this.radius=8;
        this.trail=[];
        const a=Math.atan2(targetY-y,targetX-x);
        this.vx=Math.cos(a)*this.speed;
        this.vy=Math.sin(a)*this.speed;
    }
    update(dt){
        this.trail.push({x:this.x,y:this.y,life:0.5});
        if(this.trail.length>15) this.trail.shift();
        this.trail.forEach(t=>t.life-=dt);
        this.trail=this.trail.filter(t=>t.life>0);
        this.x+=this.vx*dt;
        this.y+=this.vy*dt;
        if(dist(this.x,this.y,this.targetX,this.targetY)<20){
            this.alive=false;
            return true;
        }
        if(this.x<-30||this.x>VW+30||this.y<-30||this.y>VH+30) this.alive=false;
        return false;
    }
    takeDamage(d){
        this.hp-=d;
        if(this.hp<=0){ this.hp=0; this.alive=false; }
    }
    draw(ctx){
        this.trail.forEach(t=>{
            ctx.globalAlpha=clamp(t.life/0.5,0,0.5);
            ctx.fillStyle='#f80';
            ctx.beginPath();
            ctx.arc(t.x,t.y,3+t.life*6,0,Math.PI*2);
            ctx.fill();
        });
        ctx.globalAlpha=1;
        ctx.fillStyle='#ff3333';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle='#ffaa00';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius-3,0,Math.PI*2);
        ctx.fill();
        if(this.hp<this.maxHp){
            const bw=20;
            ctx.fillStyle='#333';
            ctx.fillRect(this.x-bw/2,this.y-18,bw,3);
            ctx.fillStyle='#f44';
            ctx.fillRect(this.x-bw/2,this.y-18,bw*(this.hp/this.maxHp),3);
        }
    }
}

/* ================================================================
   GAME
   ================================================================ */
class Game {
    constructor(){
        this.canvas=document.getElementById('gameCanvas');
        this.ctx=this.canvas.getContext('2d');
        this.sound=new SoundManager();
        this.state='menu';
        this.currentLevel=0;
        this.unlockedLevels=1;
        this.stars=LEVELS.map(()=>0);
        this.player=null;
        this.enemies=[];
        this.projectiles=[];
        this.particles=[];
        this.covers=[];
        this.missiles=[];
        this.timer=0;
        this.levelTime=0;
        this.waveIndex=0;
        this.stats={kills:0,headshots:0,weaponKills:[0,0,0],bossKills:0};
        this.screenShake=0;
        this.lastTime=0;
        this.keys={};
        this.mouse={x:VW/2,y:VH/2,down:false};
        this.isMobile=false;
        this.virtualScale=1;
        this.offsetX=0; this.offsetY=0;
        this.bgBuildings=[];
        for(let i=0;i<12;i++){
            this.bgBuildings.push({x:i*110+rand(-20,20),w:rand(50,90),h:rand(60,160),c:`hsl(220,10%,${rand(8,15)}%)`});
        }
    }
    init(){
        this.resize();
        window.addEventListener('resize',()=>this.resize());
        this.setupInput();
        this.setupUI();
        this.loadProgress();
        this.sound.init();
        this.populateLevelSelect();
        this.populateLoadout();
        requestAnimationFrame(t=>this.gameLoop(t));
    }
    resize(){
        this.canvas.width=window.innerWidth;
        this.canvas.height=window.innerHeight;
        const sx=this.canvas.width/VW;
        const sy=this.canvas.height/VH;
        this.virtualScale=Math.min(sx,sy);
        this.offsetX=(this.canvas.width-VW*this.virtualScale)/2;
        this.offsetY=(this.canvas.height-VH*this.virtualScale)/2;
    }
    screenToVirtual(sx,sy){
        return{x:(sx-this.offsetX)/this.virtualScale,y:(sy-this.offsetY)/this.virtualScale};
    }
    setupInput(){
        this.isMobile='ontouchstart' in window||navigator.maxTouchPoints>0;
        window.addEventListener('keydown',e=>{
            this.keys[e.key.toLowerCase()]=true;
            if(this.state==='playing'){
                if(e.key.toLowerCase()==='r') this.playerWeaponReload();
                if(e.key==='1') this.playerWeaponSwitch(0);
                if(e.key==='2') this.playerWeaponSwitch(1);
                if(e.key==='3') this.playerWeaponSwitch(2);
            }
        });
        window.addEventListener('keyup',e=>{ this.keys[e.key.toLowerCase()]=false; });
        this.canvas.addEventListener('mousemove',e=>{
            const v=this.screenToVirtual(e.clientX,e.clientY);
            this.mouse.x=v.x; this.mouse.y=v.y;
        });
        this.canvas.addEventListener('mousedown',e=>{
            if(e.button===0){
                this.mouse.down=true;
                this.sound.resume();
            }
        });
        window.addEventListener('mouseup',e=>{ if(e.button===0) this.mouse.down=false; });
        this.canvas.addEventListener('wheel',e=>{
            if(this.state==='playing'&&this.player){
                const dir=e.deltaY>0?1:-1;
                const next=(this.player.currentWeapon+dir+3)%3;
                this.playerWeaponSwitch(next);
            }
        },{passive:true});
        this.canvas.addEventListener('contextmenu',e=>e.preventDefault());
        this._setupTouch();
    }
    _setupTouch(){
        if(!this.isMobile) return;
        const tc=document.getElementById('touchControls');
        tc.classList.remove('hidden');
        const addTouch=(id,cb,endCb)=>{
            const el=document.getElementById(id);
            if(!el) return;
            el.addEventListener('touchstart',e=>{e.preventDefault();this.sound.resume();cb();},{passive:false});
            if(endCb){
                const off=e=>{e.preventDefault();endCb();};
                el.addEventListener('touchend',off,{passive:false});
                el.addEventListener('touchcancel',off,{passive:false});
            }
        };
        addTouch('btnLeft',()=>{this.keys['a']=true;},()=>{this.keys['a']=false;});
        addTouch('btnRight',()=>{this.keys['d']=true;},()=>{this.keys['d']=false;});
        addTouch('btnFire',()=>{this.mouse.down=true;},()=>{this.mouse.down=false;});
        addTouch('btnReload',()=>{this.playerWeaponReload();});
        document.querySelectorAll('.wpn-btn').forEach(btn=>{
            btn.addEventListener('touchstart',e=>{
                e.preventDefault();
                this.sound.resume();
                const idx=parseInt(btn.dataset.weapon);
                this.playerWeaponSwitch(idx);
                document.querySelectorAll('.wpn-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
            },{passive:false});
        });
    }
    playerWeaponReload(){
        if(this.player) this.player.weapon.startReload();
    }
    playerWeaponSwitch(i){
        if(this.player){ this.player.switchWeapon(i); this.sound.reload(); }
    }
    setupUI(){
        const bind=(id,fn)=>{
            const el=document.getElementById(id);
            if(el) el.addEventListener('click',()=>{this.sound.resume();fn();});
        };
        bind('btnStart',()=>{
            this.currentLevel=Math.min(this.currentLevel,this.unlockedLevels-1);
            this.startLevel(this.currentLevel);
        });
        bind('btnLevels',()=>this.showScreen('levelSelect'));
        bind('btnLoadout',()=>this.showScreen('loadout'));
        bind('btnHowTo',()=>this.showScreen('howToPlay'));
        bind('btnBackLevels',()=>this.showScreen('mainMenu'));
        bind('btnBackHowTo',()=>this.showScreen('mainMenu'));
        bind('btnBackLoadout',()=>this.showScreen('mainMenu'));
        bind('btnNextLevel',()=>{
            if(this.currentLevel+1<LEVELS.length){
                this.currentLevel++;
                this.startLevel(this.currentLevel);
            } else {
                this.showScreen('mainMenu');
            }
        });
        bind('btnMenuVictory',()=>this.showScreen('mainMenu'));
        bind('btnRestart',()=>this.startLevel(this.currentLevel));
        bind('btnMenuGameOver',()=>this.showScreen('mainMenu'));
    }
    showScreen(name){
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
        const el=document.getElementById(name==='mainMenu'?'mainMenu':name==='levelSelect'?'levelSelect':name==='loadout'?'loadout':name==='howToPlay'?'howToPlay':name==='victory'?'victoryScreen':name==='gameOver'?'gameOverScreen':'mainMenu');
        if(el) el.classList.add('active');
        if(name==='menu'||name==='mainMenu'){
            this.state='menu';
            document.getElementById('hud').classList.add('hidden');
            if(this.isMobile) document.getElementById('touchControls').classList.add('hidden');
        }
        if(name==='levelSelect') this.populateLevelSelect();
    }
    populateLevelSelect(){
        const grid=document.getElementById('levelGrid');
        grid.innerHTML='';
        LEVELS.forEach((lev,i)=>{
            const btn=document.createElement('button');
            btn.className='level-btn'+(i>=this.unlockedLevels?' locked':'');
            const starsStr=Array(3).fill(0).map((_,si)=>si<this.stars[i]?'★':'☆').join('');
            btn.innerHTML=`${i+1}<span class="level-stars">${i<this.unlockedLevels?starsStr:'🔒'}</span>`;
            if(i<this.unlockedLevels){
                btn.addEventListener('click',()=>{this.sound.resume();this.currentLevel=i;this.startLevel(i);});
            }
            grid.appendChild(btn);
        });
    }
    populateLoadout(){
        const list=document.getElementById('weaponList');
        list.innerHTML='';
        WEAPON_DEFS.forEach(w=>{
            const card=document.createElement('div');
            card.className='weapon-card';
            card.innerHTML=`<h3>${w.name}</h3><div class="weapon-stats">
                <div>Damage: <span>${w.damage}${w.headshotMult?' (x'+w.headshotMult+')':''}</span></div>
                <div>Fire Rate: <span>${(1000/w.fireRate).toFixed(1)}/s</span></div>
                <div>Magazine: <span>${w.magSize}</span></div>
                <div>Reload: <span>${(w.reloadTime/1000).toFixed(1)}s</span></div>
                <div>Pellets: <span>${w.count}</span></div>
                <div>Spread: <span>${(w.spread*180/Math.PI).toFixed(1)}°</span></div>
                ${w.piercing?'<div>Special: <span>Piercing</span></div>':''}</div>`;
            list.appendChild(card);
        });
    }
    startLevel(index){
        this.currentLevel=index;
        const lev=LEVELS[index];
        this.player=new Player(lev);
        this.enemies=[];
        this.projectiles=[];
        this.particles=[];
        this.missiles=[];
        this.covers=lev.covers.map(c=>new Cover(c.x,c.w,c.h,lev.coverHP));
        this.timer=lev.timer;
        this.levelTime=0;
        this.waveIndex=0;
        this.stats={kills:0,headshots:0,weaponKills:[0,0,0],bossKills:0};
        this.screenShake=0;
        this.state='playing';
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
        document.getElementById('hud').classList.remove('hidden');
        if(this.isMobile) document.getElementById('touchControls').classList.remove('hidden');
        this.updateMissionTracker();
    }
    updateMissionTracker(){
        const lev=LEVELS[this.currentLevel];
        const el=document.getElementById('missionTracker');
        let html='';
        lev.missions.forEach(m=>{
            const done=this._checkMission(m);
            let prog='';
            if(m.type==='kills') prog=`${this.stats.kills}/${m.target}`;
            else if(m.type==='headshots') prog=`${this.stats.headshots}/${m.target}`;
            else if(m.type==='weaponKills') prog=`${this.stats.weaponKills[m.weapon]||0}/${m.target}`;
            else if(m.type==='bossKill') prog=`${this.stats.bossKills}/${m.target}`;
            else if(m.type==='time') prog=`${Math.ceil(this.timer)}s left`;
            else if(m.type==='coverHP'){
                const c=this.covers&&this.covers[this.player.currentCover];
                prog=`${c?Math.round((c.destroyed?0:c.hp)/c.maxHp*100):0}%`;
            }
            html+=`<div class="mission-item${done?' complete':''}">${m.desc} <b>${prog}</b></div>`;
        });
        if(el.innerHTML!==html) el.innerHTML=html;
    }
    _checkMission(m){
        switch(m.type){
            case 'kills': return this.stats.kills>=m.target;
            case 'headshots': return this.stats.headshots>=m.target;
            case 'weaponKills': return(this.stats.weaponKills[m.weapon]||0)>=m.target;
            case 'bossKill': return this.stats.bossKills>=m.target;
            case 'time': return this.levelTime<=m.target;
            case 'coverHP': {
                const c=this.covers&&this.covers[this.player.currentCover];
                return c&&!c.destroyed&&(c.hp/c.maxHp*100)>=m.target;
            }
            default: return false;
        }
    }
    calculateStars(){
        const lev=LEVELS[this.currentLevel];
        let stars=0;
        lev.missions.forEach(m=>{ if(this._checkMission(m)) stars++; });
        return stars;
    }
    gameLoop(ts){
        const dt=Math.min((ts-this.lastTime)/1000,0.05);
        this.lastTime=ts;
        if(this.state==='playing') this.update(dt);
        this.render();
        requestAnimationFrame(t=>this.gameLoop(t));
    }
    update(dt){
        this.levelTime+=dt;
        this.timer-=dt;
        if(this.timer<=0){ this.timer=0; this._gameOver(); return; }
        if(!this.player.alive){ this._gameOver(); return; }
        if(this.keys['a']||this.keys['arrowleft']) this.player.startMove(-1,this.covers);
        if(this.keys['d']||this.keys['arrowright']) this.player.startMove(1,this.covers);
        this.player.update(dt,this.covers,this.keys,this.mouse,performance.now(),this);
        if(this.mouse.down&&this.player.peeking&&!this.player.moving){
            let aimX=this.mouse.x, aimY=this.mouse.y;
            if(this.isMobile){
                let best=null, bd=Infinity;
                const targets=this.enemies.concat(this.missiles);
                targets.forEach(t=>{
                    const tx=t.type==='missile'?t.x:t.x;
                    const ty=t.type==='missile'?t.y:(t.y-t.h/2);
                    const d=dist(this.player.x,this.player.displayY-30,tx,ty);
                    if(d<bd){ bd=d; best=t; }
                });
                if(best){
                    aimX=best.x;
                    aimY=best.type==='missile'?best.y:(best.y-best.h/2);
                } else {
                    aimX=VW*0.85; aimY=VH*0.35;
                }
            }
            const projs=this.player.shoot(performance.now(),aimX,aimY,this.covers);
            if(projs.length>0){
                this.projectiles.push(...projs);
                this.sound.shoot(WEAPON_DEFS[this.player.currentWeapon].id);
                this._spawnMuzzleFlash(this.player.x+10,this.player.displayY-PLAYER_H+15);
            }
        }
        this._spawnWaves();
        for(let i=this.enemies.length-1;i>=0;i--){
            const e=this.enemies[i];
            const result=e.update(dt,performance.now(),this);
            if(result){
                if(Array.isArray(result)){
                    this.projectiles.push(...result);
                } else if(result.missile){
                    this.missiles.push(result.missile);
                }
            }
            if(!e.alive){
                this._spawnDeathParticles(e.x,e.y-e.h/2);
                this.enemies.splice(i,1);
            }
        }
        for(let i=this.missiles.length-1;i>=0;i--){
            const m=this.missiles[i];
            const hit=m.update(dt);
            if(hit){
                if(this.player.alive){
                    const pc=this.covers[this.player.currentCover];
                    if(!pc.destroyed){
                        const coverDist=Math.abs(this.player.x-m.targetX);
                        if(coverDist<60){
                            this.player.takeDamage(m.damage);
                            this.sound.playerHurt();
                        }
                    } else {
                        this.player.takeDamage(m.damage);
                        this.sound.playerHurt();
                    }
                    pc.takeDamage(m.coverDamage);
                    this.screenShake=0.4;
                    this.sound.explosion();
                    this._spawnExplosion(m.x,m.y);
                }
                this.missiles.splice(i,1);
                continue;
            }
            if(!m.alive){
                this._spawnExplosion(m.x,m.y);
                this.sound.explosion();
                this.missiles.splice(i,1);
            }
        }
        this._checkCollisions();
        this.projectiles.forEach(p=>p.update(dt));
        this.projectiles=this.projectiles.filter(p=>p.alive);
        this.particles.forEach(p=>p.update(dt));
        this.particles=this.particles.filter(p=>p.alive);
        this.covers.forEach(c=>c.updateRubble(dt));
        if(this.screenShake>0) this.screenShake-=dt*2;
        this._checkWinCondition();
        this._updateHUD();
    }
    _spawnWaves(){
        const lev=LEVELS[this.currentLevel];
        while(this.waveIndex<lev.waves.length&&this.levelTime*1000>=lev.waves[this.waveIndex].t){
            const wave=lev.waves[this.waveIndex];
            wave.enemies.forEach(ed=>{
                let enemy;
                if(ed.type==='soldier') enemy=new Soldier(ed.x,ed.y);
                else if(ed.type==='sniper') enemy=new SniperEnemy(ed.x,ed.y);
                else if(ed.type==='boss') enemy=new BossEnemy(ed.x,ed.y);
                if(enemy) this.enemies.push(enemy);
            });
            this.waveIndex++;
        }
    }
    _checkCollisions(){
        for(let i=this.projectiles.length-1;i>=0;i--){
            const p=this.projectiles[i];
            if(!p.alive) continue;
            if(p.isPlayer){
                for(let j=this.enemies.length-1;j>=0;j--){
                    const e=this.enemies[j];
                    if(!e.alive) continue;
                    if(circleRectOverlap(p.x,p.y,p.radius,e.x-e.w/2,e.y-e.h,e.w,e.h)){
                        let dmg=p.damage;
                        let isHeadshot=false;
                        if(p.y<e.headY+10&&p.headshotMult>1){
                            dmg*=p.headshotMult;
                            isHeadshot=true;
                            this.stats.headshots++;
                        }
                        e.takeDamage(dmg);
                        if(isHeadshot) this._spawnHeadshotText(e.x,e.y-e.h-20);
                        this._spawnHitParticles(p.x,p.y);
                        this.sound.hit();
                        if(!e.alive){
                            this.stats.kills++;
                            if(e.type==='boss') this.stats.bossKills++;
                            const wIdx=WEAPON_DEFS.findIndex(w=>w.color===p.color);
                            if(wIdx>=0) this.stats.weaponKills[wIdx]++;
                            this.screenShake=0.2;
                        }
                        if(!p.piercing){ p.alive=false; }
                        break;
                    }
                }
                for(let j=this.missiles.length-1;j>=0;j--){
                    const m=this.missiles[j];
                    if(!m.alive) continue;
                    if(dist(p.x,p.y,m.x,m.y)<m.radius+p.radius+4){
                        m.takeDamage(p.damage);
                        this._spawnHitParticles(p.x,p.y);
                        this.sound.hit();
                        p.alive=false;
                        if(!m.alive){
                            this._spawnExplosion(m.x,m.y);
                            this.sound.explosion();
                            this.screenShake=0.3;
                        }
                        break;
                    }
                }
            } else {
                const pc=this.covers[this.player.currentCover];
                if(!pc.destroyed){
                    if(circleRectOverlap(p.x,p.y,p.radius,pc.x,pc.top,pc.w,pc.h)){
                        pc.takeDamage(p.damage*0.5);
                        p.alive=false;
                        this._spawnHitParticles(p.x,p.y);
                        continue;
                    }
                }
                if(this.player.alive){
                    if(circleRectOverlap(p.x,p.y,p.radius,this.player.x-12,this.player.displayY-PLAYER_H,24,PLAYER_H)){
                        this.player.takeDamage(p.damage);
                        p.alive=false;
                        this.sound.playerHurt();
                        this.screenShake=0.15;
                    }
                }
            }
        }
    }
    _checkWinCondition(){
        const allSpawned=this.waveIndex>=LEVELS[this.currentLevel].waves.length;
        const allDead=this.enemies.length===0;
        if(allSpawned&&allDead&&this.missiles.length===0){
            this._victory();
        }
    }
    _victory(){
        this.state='victory';
        document.getElementById('hud').classList.add('hidden');
        if(this.isMobile) document.getElementById('touchControls').classList.add('hidden');
        const stars=this.calculateStars();
        if(stars>this.stars[this.currentLevel]) this.stars[this.currentLevel]=stars;
        if(this.currentLevel+1>=this.unlockedLevels&&this.currentLevel+1<LEVELS.length){
            this.unlockedLevels=this.currentLevel+2;
        }
        this.saveProgress();
        const starsEl=document.getElementById('victoryStars');
        starsEl.innerHTML='';
        for(let i=0;i<3;i++){
            const s=document.createElement('span');
            s.className='star'+(i<stars?' earned':'');
            s.textContent='★';
            starsEl.appendChild(s);
        }
        const statsEl=document.getElementById('victoryStats');
        statsEl.innerHTML=`Kills: ${this.stats.kills} | Headshots: ${this.stats.headshots} | Time: ${Math.floor(this.levelTime)}s`;
        document.getElementById('btnNextLevel').style.display=this.currentLevel+1<LEVELS.length?'':'none';
        this.showScreen('victory');
    }
    _gameOver(){
        this.state='gameOver';
        document.getElementById('hud').classList.add('hidden');
        if(this.isMobile) document.getElementById('touchControls').classList.add('hidden');
        this.showScreen('gameOver');
    }
    _updateHUD(){
        const h=this.player.health;
        const m=this.player.maxHealth;
        const hpPct=h/m*100;
        document.getElementById('healthFill').style.width=hpPct+'%';
        document.getElementById('healthText').textContent=`${Math.ceil(h)} HP`;
        if(hpPct<30) document.getElementById('healthFill').style.background='#cc2222';
        else if(hpPct<60) document.getElementById('healthFill').style.background='#ccaa22';
        else document.getElementById('healthFill').style.background='linear-gradient(90deg,#cc2222,#44cc44)';
        const curCover=this.covers[this.player.currentCover];
        const cPct=curCover.destroyed?0:curCover.hp/curCover.maxHp*100;
        document.getElementById('coverFill').style.width=cPct+'%';
        document.getElementById('coverText').textContent=`COVER ${curCover.destroyed?0:Math.ceil(curCover.hp)}`;
        const min=Math.floor(this.timer/60);
        const sec=Math.floor(this.timer%60);
        const tEl=document.getElementById('timerDisplay');
        tEl.textContent=`${min}:${sec.toString().padStart(2,'0')}`;
        tEl.className='timer'+(this.timer<15?' warning':'');
        const w=this.player.weapon;
        document.getElementById('ammoCount').textContent=w.reloading?`Reloading...`: `${w.ammo} / ${w.def.magSize}`;
        document.getElementById('ammoCount').className='ammo-count'+(w.ammo<=5&&!w.reloading?' low':'');
        document.getElementById('weaponName').textContent=w.def.name;
        this.updateMissionTracker();
    }
    _spawnMuzzleFlash(x,y){
        for(let i=0;i<4;i++){
            this.particles.push(new Particle(x,y,rand(-80,80),rand(-120,40),'#ffaa00',rand(0.05,0.15),rand(2,5)));
        }
    }
    _spawnHitParticles(x,y){
        for(let i=0;i<5;i++){
            this.particles.push(new Particle(x,y,rand(-100,100),rand(-100,100),'#ff0',rand(0.1,0.3),rand(2,4)));
        }
    }
    _spawnDeathParticles(x,y){
        for(let i=0;i<15;i++){
            this.particles.push(new Particle(x,y,rand(-150,150),rand(-200,-50),'#f44',rand(0.3,0.8),rand(3,7)));
        }
    }
    _spawnExplosion(x,y){
        for(let i=0;i<20;i++){
            const a=rand(0,Math.PI*2);
            const s=rand(50,200);
            const colors=['#f80','#f44','#ff0','#fff'];
            this.particles.push(new Particle(x,y,Math.cos(a)*s,Math.sin(a)*s,colors[i%4],rand(0.3,0.8),rand(3,8)));
        }
    }
    _spawnHeadshotText(x,y){
        this.particles.push(new HeadshotText(x,y));
    }
    /* ---- RENDERING ---- */
    render(){
        const ctx=this.ctx;
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.save();
        ctx.translate(this.offsetX,this.offsetY);
        ctx.scale(this.virtualScale,this.virtualScale);
        if(this.screenShake>0){
            ctx.translate(rand(-3,3)*this.screenShake*10,rand(-3,3)*this.screenShake*10);
        }
        this._drawBackground(ctx);
        if(this.state==='playing'||this.state==='victory'||this.state==='gameOver'){
            this._drawScene(ctx);
        } else {
            this._drawMenuBg(ctx);
        }
        ctx.restore();
    }
    _drawBackground(ctx){
        const grad=ctx.createLinearGradient(0,0,0,VH);
        grad.addColorStop(0,'#0a0e1a');
        grad.addColorStop(0.4,'#151d30');
        grad.addColorStop(0.7,'#1a2540');
        grad.addColorStop(1,'#2a1a1a');
        ctx.fillStyle=grad;
        ctx.fillRect(0,0,VW,VH);
        this.bgBuildings.forEach(b=>{
            ctx.fillStyle=b.c;
            ctx.fillRect(b.x,GROUND_Y-b.h,b.w,b.h);
        });
        ctx.fillStyle='#3a2a1a';
        ctx.fillRect(0,GROUND_Y,VW,VH-GROUND_Y);
        ctx.strokeStyle='#4a3a2a';
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(0,GROUND_Y);
        ctx.lineTo(VW,GROUND_Y);
        ctx.stroke();
    }
    _drawMenuBg(ctx){
        ctx.fillStyle='rgba(0,0,0,0.4)';
        ctx.fillRect(0,0,VW,VH);
        const t=performance.now()/1000;
        ctx.fillStyle='rgba(255,106,0,0.08)';
        ctx.fillRect(VW*0.1+Math.sin(t)*20,VH*0.3,200,100);
        ctx.fillStyle='rgba(100,150,255,0.06)';
        ctx.fillRect(VW*0.6+Math.cos(t)*15,VH*0.2,150,120);
    }
    _drawScene(ctx){
        this.enemies.forEach(e=>e.draw(ctx));
        this.projectiles.filter(p=>!p.isPlayer).forEach(p=>p.draw(ctx));
        if(this.player&&this.player.alive&&!this.player.moving&&!this.player.inOpen){
            this.player.drawBody(ctx);
        }
        this.covers.forEach(c=>c.draw(ctx));
        if(this.player&&this.player.alive&&(this.player.moving||this.player.inOpen)){
            this.player.drawBody(ctx);
        }
        this.projectiles.filter(p=>p.isPlayer).forEach(p=>p.draw(ctx));
        this.missiles.forEach(m=>m.draw(ctx));
        this.particles.forEach(p=>p.draw(ctx));
    }
    saveProgress(){
        try{
            localStorage.setItem('headshot_unlocked',this.unlockedLevels);
            localStorage.setItem('headshot_stars',JSON.stringify(this.stars));
        }catch(e){}
    }
    loadProgress(){
        try{
            const u=localStorage.getItem('headshot_unlocked');
            const s=localStorage.getItem('headshot_stars');
            if(u) this.unlockedLevels=parseInt(u)||1;
            if(s) this.stars=JSON.parse(s);
        }catch(e){}
    }
}

/* ================================================================
   INITIALIZATION
   ================================================================ */
window.addEventListener('load',()=>{
    const game=new Game();
    game.init();
    window._game=game;
});
