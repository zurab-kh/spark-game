var ce=Object.defineProperty;var de=(n,t,e)=>t in n?ce(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var h=(n,t,e)=>de(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}})();const Tt=.95,ue=.05,fe=100,st=3,Dt=1e3,it=500,me=14e-5,pe=.01,he=700,ot={cool:"#ffffff",warm:"#ffb627",hot:"#ff6b1a",burn:"#ef4444"};function at(n){return n>4?ot.burn:n>2.5?ot.hot:n>1.5?ot.warm:ot.cool}const wt="spark_v1",ve=2;function z(){return{balance:Dt,wins:0,losses:0,streak:0,longestStreak:0,totalDuels:0,totalPL:0,history:[],clientSeed:"p-"+Math.random().toString(36).slice(2,8),nonce:0,xp:0,dailyStreak:0,dailyLastClaim:0}}function be(){try{const n=localStorage.getItem(wt);if(!n)return z();const t=JSON.parse(n);if(!t||!t.s)return z();const e={...z(),...t.s};return(!Number.isFinite(e.balance)||e.balance<0)&&(e.balance=Dt),Array.isArray(e.history)||(e.history=[]),Number.isFinite(e.xp)||(e.xp=0),Number.isFinite(e.dailyStreak)||(e.dailyStreak=0),Number.isFinite(e.dailyLastClaim)||(e.dailyLastClaim=0),e}catch{return z()}}function Mt(n){try{localStorage.setItem(wt,JSON.stringify({v:ve,s:n}))}catch{}}function ge(){try{localStorage.removeItem(wt)}catch{}return z()}const G=[{name:"Bronze",minXp:0,color:"#cd7f32"},{name:"Silver",minXp:100,color:"#c0c0c0"},{name:"Gold",minXp:300,color:"#ffb627"},{name:"Platinum",minXp:700,color:"#00e676"},{name:"Diamond",minXp:1500,color:"#00bfff"}];function Q(n){let t=G[0],e=null;for(let o=0;o<G.length;o++)n>=G[o].minXp&&(t=G[o],e=G[o+1]??null);const s=e?(n-t.minXp)/(e.minXp-t.minXp):1;return{rank:t,next:e,progress:Math.max(0,Math.min(1,s))}}function ye(n){const t=n.stake*2,e=t*(1-ue);return n.youFried?{net:-10,pot:t,payout:e,outcome:"lose"}:{net:Math.round((e-n.stake)*100)/100,pot:t,payout:e,outcome:"win"}}function ke(n){const t=Math.pow(2,52),s=parseInt(n.slice(0,13),16)/t;let o=st+Tt/(1-s)-Tt;return(!Number.isFinite(o)||o<st)&&(o=st),o=Math.min(o,fe),Math.max(st,Math.round(o*100)/100)}function St(n){let t="";for(let e=0;e<n.length;e++)t+=n[e].toString(16).padStart(2,"0");return t}function xe(n){const t=new Uint8Array(n);return crypto.getRandomValues(t),St(t)}async function we(n){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(n));return St(new Uint8Array(t))}async function Me(n,t){const e=await crypto.subtle.importKey("raw",new TextEncoder().encode(n),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),s=await crypto.subtle.sign("HMAC",e,new TextEncoder().encode(t));return St(new Uint8Array(s))}async function Se(n,t){const e=xe(18),s=await we(e),o=await Me(e,`${n}:${t}`),i=ke(o);return{serverSeed:e,commit:s,clientSeed:n,nonce:t,B:i}}function Ee(n){return me*(1+(n-1)*pe)}function Be(n,t){const e=Math.min(50,t);return n*Math.exp(Ee(n)*e)}const _t={timid:{baseHold:1100,passCeiling:.8,heatSensitivity:.85,jitter:.18},balanced:{baseHold:1500,passCeiling:.88,heatSensitivity:.65,jitter:.22},degen:{baseHold:2e3,passCeiling:.94,heatSensitivity:.45,jitter:.28}};let ht="balanced",H=_t.balanced,ft=0,Z=!1;function Ce(){const n=["timid","balanced","degen"];return ht=n[Math.floor(Math.random()*n.length)],H=_t[ht],ft=0,Z=!1,ht}function Ut(n,t,e){Z=!0;const s=Math.max(0,Math.min(1,(t-1)/9)),o=1-H.heatSensitivity*s*.75,i=1+(Math.random()*2-1)*H.jitter;let a=H.baseHold*o*i;const l=e*H.passCeiling;t>=l&&(a=Math.min(a,100+Math.random()*150)),a=Math.max(80,a),ft=n+a}function Le(){ft=0,Z=!1}function $e(n,t,e){return Z?t>=e*H.passCeiling?!0:n>=ft?(Z=!1,!0):!1:!1}const Ie=["pass","short","win","lose","tick","ui","charge","cd3","cd2","cd1","go","ambient"];let S=null;const mt=new Map;let w=null,I=null,R=null,Y=!1,V=null,q=0;function et(){if(S)return S;const n=window.AudioContext||window.webkitAudioContext;if(!n)return null;S=new n,w=S.createGain(),w.gain.value=.9;const t=S.createDynamicsCompressor();return t.threshold.value=-14,t.ratio.value=6,w.connect(t),t.connect(S.destination),S}async function Nt(){const n=et();n&&await Promise.all(Ie.map(async t=>{try{const s=await(await fetch(`./sfx/${t}.mp3`)).arrayBuffer(),o=await n.decodeAudioData(s);mt.set(t,o)}catch{}}))}function Te(){const n=et();n&&n.state==="suspended"&&n.resume()}function B(n,t=1,e=1){const s=et();if(!s||!w)return;const o=mt.get(n);if(!o)return;const i=s.createBufferSource();i.buffer=o,i.playbackRate.value=e;const a=s.createGain();a.gain.value=Math.max(0,Math.min(1,t)),i.connect(a),a.connect(w),i.onended=()=>{try{a.disconnect(),i.disconnect()}catch{}},i.start()}function Ft(n){const t=et();if(!t||!w)return;const e=Math.max(0,Math.min(1,n));if(e<=.01){Ht();return}const s=mt.get("ambient");s&&(Y||(I=t.createBufferSource(),I.buffer=s,I.loop=!0,R=t.createGain(),R.gain.value=0,I.connect(R),R.connect(w),I.onended=()=>{Y=!1,I=null,R=null},I.start(),Y=!0),R.gain.setTargetAtTime(.05+e*.37,t.currentTime,.3))}function Ht(){if(!Y||!S||!R||!I)return;R.gain.setTargetAtTime(0,S.currentTime,.15);const n=I;window.setTimeout(()=>{try{n.stop()}catch{}},300),Y=!1}function Pe(n){Et(),q=Math.max(0,Math.min(1,n));const t=()=>{B("tick",.3+q*.35),V=window.setTimeout(t,Pt(q))};V=window.setTimeout(t,Pt(q))}function Pt(n){return Math.round(1300-n*1100)}function Ae(n){q=Math.max(0,Math.min(1,n))}function Et(){V!==null&&(window.clearTimeout(V),V=null)}function bt(){Et(),Ht()}let x=null,D=null,T=!1;function Ot(){if(T)return;const n=et();if(!n||!w)return;const t=mt.get("ambient");!t||x||(x=n.createBufferSource(),x.buffer=t,x.loop=!0,D=n.createGain(),D.gain.value=0,x.connect(D),D.connect(w),x.onended=()=>{x=null,D=null},x.start(),D.gain.setTargetAtTime(.08,n.currentTime,1))}function Xt(){if(!x||!rt())return;D&&D.gain.setTargetAtTime(0,rt().currentTime,.3);const n=x;setTimeout(()=>{try{n.stop()}catch{}},400),x=null}function rt(){return S}function Re(){T=!T;try{localStorage.setItem("spark:muted",T?"1":"0")}catch{}return w&&rt()&&w.gain.setTargetAtTime(T?0:.9,rt().currentTime,.1),T&&Xt(),T}function De(){return T}function _e(){try{T=localStorage.getItem("spark:muted")==="1"}catch{}}class Ue{constructor(t){h(this,"canvas");h(this,"ctx");h(this,"state",null);h(this,"particles",[]);h(this,"sparks",[]);h(this,"shake",0);h(this,"w",0);h(this,"h",0);h(this,"dpr",1);h(this,"tossActive",!1);h(this,"tossProgress",0);h(this,"tossFromX",0);h(this,"tossFromY",0);h(this,"tossToX",0);h(this,"tossToY",0);this.canvas=t;const e=t.getContext("2d");if(!e)throw new Error("no 2d context");this.ctx=e,this.resize()}resize(){this.dpr=Math.min(2,window.devicePixelRatio||1);const t=this.canvas.getBoundingClientRect();this.w=t.width||390,this.h=t.height||700,this.canvas.width=Math.max(1,Math.floor(this.w*this.dpr)),this.canvas.height=Math.max(1,Math.floor(this.h*this.dpr)),this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}setState(t){this.state=t}getWidth(){return this.w}getHeight(){return this.h}flashScreen(t){}clear(){this.particles=[],this.sparks=[],this.shake=0,this.tossActive=!1,this.ctx.setTransform(1,0,0,1,0,0),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}ballX(t){return this.tossActive?this.tossFromX+(this.tossToX-this.tossFromX)*this.tossProgress:t===1?this.w*.25:this.w*.75}ballY(){if(this.tossActive){const t=this.tossProgress;return this.h*.5-Math.sin(t*Math.PI)*this.h*.12}return this.h*.5}tossBall(t){this.tossFromX=this.ballX(this.state?.holder??1),this.tossFromY=this.h*.5,this.tossToX=t===1?this.w*.25:this.w*.75,this.tossToY=this.h*.5,this.tossProgress=0,this.tossActive=!0}hitParticles(t,e,s){for(let o=0;o<12;o++){const i=Math.random()*Math.PI*2,a=50+Math.random()*100;this.particles.push({x:t,y:e,vx:Math.cos(i)*a,vy:Math.sin(i)*a,life:300+Math.random()*200,max:500,size:2+Math.random()*2.5,color:s})}}burst(t,e){this.hitParticles(t,e,"#ff8a1f"),this.hitParticles(t,e,"#ffd966")}explosion(t,e){for(let s=0;s<40;s++){const o=Math.random()*Math.PI*2,i=80+Math.random()*200;this.particles.push({x:t,y:e,vx:Math.cos(o)*i,vy:Math.sin(o)*i,life:500+Math.random()*400,max:900,size:2+Math.random()*4,color:["#ff6b00","#ffd966","#ffffff","#a855f7"][Math.floor(Math.random()*4)]})}for(let s=0;s<8;s++){const o=s/8*Math.PI*2+Math.random()*.5,i=60+Math.random()*80;this.sparks.push({x1:t,y1:e,x2:t+Math.cos(o)*i,y2:e+Math.sin(o)*i,life:300,max:300})}this.shake=24}update(t){const e=t/1e3;if(this.tossActive&&(this.tossProgress+=t/300,this.tossProgress>=1&&(this.tossProgress=1,this.tossActive=!1),Math.random()<.7)){const s=this.ballX(this.state?.holder??1),o=this.ballY();this.particles.push({x:s,y:o,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,life:200,max:350,size:1.5+Math.random()*2,color:"#ff8a1f"})}for(const s of this.particles)s.x+=s.vx*e,s.y+=s.vy*e,s.vx*=.93,s.vy*=.93,s.vy+=40*e,s.life-=t;this.particles=this.particles.filter(s=>s.life>0);for(const s of this.sparks)s.life-=t;this.sparks=this.sparks.filter(s=>s.life>0),this.shake*=.87,this.shake<.1&&(this.shake=0)}render(t){if(!this.state)return;this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);const{ctx:e,w:s,h:o}=this,i=this.state,a=i.heat,l=Math.min(1,(a-1)/3);e.save();const d=e.createRadialGradient(s/2,o*.4,0,s/2,o*.4,Math.max(s,o)*.7),u=Math.floor(20+l*40),p=Math.floor(14+l*10);d.addColorStop(0,`rgb(${u}, ${p}, 16)`),d.addColorStop(1,"#060810"),e.fillStyle=d,e.fillRect(0,0,s,o),e.strokeStyle=`rgba(40, 60, 100, ${.08+l*.04})`,e.lineWidth=1,e.beginPath();for(let c=0;c<s;c+=35)e.moveTo(c,0),e.lineTo(c,o);for(let c=0;c<o;c+=35)e.moveTo(0,c),e.lineTo(s,c);e.stroke();const b=this.shake?(Math.random()-.5)*this.shake:0,k=this.shake?(Math.random()-.5)*this.shake:0;e.translate(b,k),this.drawZones(i.holder,s,o,l),(i.phase==="running"||i.phase==="resolving")&&this.drawBomb(a,l,t,i.lockout,i.lockProgress),e.save(),e.globalCompositeOperation="lighter";for(const c of this.sparks){const m=Math.max(0,c.life/c.max);e.globalAlpha=m,e.strokeStyle="#ffd966",e.lineWidth=2,e.shadowColor="#ff6b00",e.shadowBlur=8,e.beginPath(),e.moveTo(c.x1,c.y1),e.lineTo(c.x2,c.y2),e.stroke()}e.restore(),e.save(),e.globalCompositeOperation="lighter";for(const c of this.particles)e.globalAlpha=Math.max(0,c.life/c.max),e.fillStyle=c.color,e.beginPath(),e.arc(c.x,c.y,c.size,0,Math.PI*2),e.fill();if(e.restore(),l>.2){const c=e.createRadialGradient(s/2,o/2,s*.3,s/2,o/2,s*.75);c.addColorStop(0,"transparent"),c.addColorStop(1,`rgba(255, 51, 0, ${Math.min(.4,l*.35)})`),e.fillStyle=c,e.fillRect(-b,-k,s,o)}e.restore()}drawZones(t,e,s,o){const i=this.ctx;i.strokeStyle=`rgba(255, 255, 255, ${.04+o*.03})`,i.lineWidth=1,i.setLineDash([4,12]),i.beginPath(),i.moveTo(e/2,0),i.lineTo(e/2,s),i.stroke(),i.setLineDash([]);const a=t===1?e*.25:e*.75,l=t===1?"#10b981":"#ff6b00",d=i.createRadialGradient(a,s*.5,0,a,s*.5,e*.35);d.addColorStop(0,`${l}22`),d.addColorStop(1,"transparent"),i.fillStyle=d,i.fillRect(0,0,e,s),i.font='700 14px "Sora", sans-serif',i.textAlign="center",i.fillStyle=t===1?"#10b981":"rgba(16, 185, 129, 0.4)",i.fillText("ТЫ",e*.25,36),i.fillStyle=t===2?"#ff8a1f":"rgba(255, 138, 31, 0.4)",i.fillText("СОПЕРНИК",e*.75,36)}drawBomb(t,e,s,o,i){const a=this.ctx,l=this.state.holder,d=this.ballX(l),u=this.ballY(),p=Math.min(this.w,this.h)*.09,b=e>.5?(Math.random()-.5)*(e-.5)*8:0,k=e>.5?(Math.random()-.5)*(e-.5)*8:0,c=o?1+Math.sin(s*.018)*.08:1+Math.sin(s*.005)*.03,m=Math.max(8,p*c),A=at(t);a.save(),a.globalCompositeOperation="lighter";const X=m*(1.8+e*1.5),U=a.createRadialGradient(d+b,u+k,0,d+b,u+k,X);U.addColorStop(0,A),U.addColorStop(.25,A),U.addColorStop(1,"transparent"),a.globalAlpha=.3+e*.3,a.fillStyle=U,a.beginPath(),a.arc(d+b,u+k,X,0,Math.PI*2),a.fill(),a.restore(),a.save(),a.translate(b,k);const nt=a.createRadialGradient(d-m*.3,u-m*.35,m*.05,d,u,m);nt.addColorStop(0,"#3a3a48"),nt.addColorStop(.5,"#1a1a24"),nt.addColorStop(1,"#0a0a10"),a.fillStyle=nt,a.beginPath(),a.arc(d,u,m,0,Math.PI*2),a.fill(),a.strokeStyle=A,a.lineWidth=1.5,a.shadowColor=A,a.shadowBlur=10+e*12,a.beginPath(),a.arc(d,u,m,0,Math.PI*2),a.stroke(),a.shadowBlur=0,a.globalAlpha=.25+e*.15,a.fillStyle=A,a.beginPath(),a.ellipse(d-m*.2,u-m*.4,m*.4,m*.18,-.4,0,Math.PI*2),a.fill(),a.restore(),this.drawFuse(d+b,u+k-m,m,t,e,s),o&&i>0&&(a.save(),a.strokeStyle="#ef4444",a.lineWidth=3,a.shadowColor="#ef4444",a.shadowBlur=14,a.beginPath(),a.arc(d+b,u+k,m+8,-Math.PI/2,-Math.PI/2+i*Math.PI*2),a.stroke(),a.restore())}drawFuse(t,e,s,o,i,a){const l=this.ctx,d=s*(.4+i*.8),u=e-d,p=Math.sin(a*.007)*(s*.12),b=t+p;l.save(),l.globalCompositeOperation="lighter",l.strokeStyle=at(o),l.lineWidth=2.5,l.lineCap="round",l.globalAlpha=.5+i*.3,l.beginPath(),l.moveTo(t,e),l.quadraticCurveTo(t+p*.5,e-d*.5,b,u),l.stroke();const k=s*.15*(1+Math.sin(a*.025)*.3),c=l.createRadialGradient(b,u,0,b,u,k*3.5);c.addColorStop(0,"#ffffff"),c.addColorStop(.3,at(o)),c.addColorStop(1,"transparent"),l.globalAlpha=.9,l.fillStyle=c,l.beginPath(),l.arc(b,u,k*3.5,0,Math.PI*2),l.fill();const m=Math.floor(2+i*8);for(let A=0;A<m;A++){const X=-Math.PI/2+(Math.random()-.5)*2,U=k*(1+Math.random()*3);l.globalAlpha=.5*Math.random(),l.fillStyle=Math.random()>.5?"#ffd966":at(o),l.beginPath(),l.arc(b+Math.cos(X)*U,u+Math.sin(X)*U,1+Math.random()*1.5,0,Math.PI*2),l.fill()}l.restore()}}function L(n){const t=document.createElement("template");return t.innerHTML=n.trim(),t.content.firstElementChild}function pt(n){document.querySelectorAll(".screen").forEach(t=>{t.classList.toggle("visible",t.dataset.screen===n)})}function Ne(n,t){n.appendChild(L(`
    <section class="screen intro-screen visible" data-screen="intro">
      <div class="intro-wrap">
        <div class="intro-logo"><svg viewBox="0 0 120 130" width="104" height="112">
          <defs>
            <radialGradient id="bombBody" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stop-color="#3a2230"/>
              <stop offset="0.5" stop-color="#1a1218"/>
              <stop offset="1" stop-color="#080608"/>
            </radialGradient>
            <linearGradient id="fuse" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#ff6b00"/>
              <stop offset="0.5" stop-color="#ffb020"/>
              <stop offset="1" stop-color="#fff7cc"/>
            </linearGradient>
            <radialGradient id="sparkCore" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stop-color="#ffffff"/>
              <stop offset="0.3" stop-color="#fff7cc"/>
              <stop offset="0.6" stop-color="#ffb020"/>
              <stop offset="1" stop-color="#ff6b00" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- bomb body -->
          <circle cx="60" cy="74" r="38" fill="url(#bombBody)" stroke="rgba(255,107,0,0.35)" stroke-width="1.5"/>
          <!-- highlight -->
          <ellipse cx="46" cy="60" rx="14" ry="9" fill="rgba(255,255,255,0.10)"/>

          <!-- fuse cap -->
          <rect x="54" y="32" width="12" height="8" rx="2" fill="#2a2018" stroke="rgba(255,107,0,0.4)" stroke-width="1"/>

          <!-- fuse line -->
          <path d="M60 34 Q64 22 56 14 Q50 8 62 4" fill="none" stroke="url(#fuse)" stroke-width="3" stroke-linecap="round"/>

          <!-- spark explosion at fuse tip -->
          <circle cx="62" cy="4" r="10" fill="url(#sparkCore)"/>
          <circle cx="62" cy="4" r="3.5" fill="#ffffff"/>

          <!-- flying sparks -->
          <line x1="62" y1="4" x2="72" y2="-2" stroke="#ffb020" stroke-width="2" stroke-linecap="round"/>
          <line x1="62" y1="4" x2="54" y2="-3" stroke="#ff6b00" stroke-width="2" stroke-linecap="round"/>
          <line x1="62" y1="4" x2="68" y2="14" stroke="#ff8a1f" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="74" cy="2" r="1.4" fill="#fff7cc"/>
          <circle cx="50" cy="6" r="1.2" fill="#ffb020"/>
          <circle cx="70" cy="16" r="1" fill="#ff6b00"/>
        </svg></div>
        <h1 class="title-main">SPARK</h1>
        <div class="subtitle">Передавай бомбу. Не оставайся с ней, когда рванёт.</div>
        <button class="btn-primary intro-cta" id="introPlay">ИГРАТЬ</button>
        <p class="intro-foot">Ставка <b>10 монет</b> · победитель забирает 95% · hot potato</p>
      </div>
    </section>
  `)),document.getElementById("introPlay").addEventListener("click",t)}function Fe(n,t,e){const{rank:s,next:o,progress:i}=Q(t.xp),a=t.streak>=3;n.appendChild(L(`
    <section class="screen lobby-screen" data-screen="lobby">
      <div class="menu-wrap">
        <div class="header">
          <div class="header-left"><span class="hello">Привет,</span> <b id="helloName">${t.name}</b></div>
          <div class="header-right-wrap">
            <button class="mute-btn" id="muteBtn" title="Звук">🔊</button>
            <div class="bal-pill" title="Баланс"><b id="balVal">${M(t.balance)}</b> <span class="unit">USDT</span></div>
          </div>
        </div>

        <div class="online-bar"><span class="online-dot"></span><span id="onlineCount">${t.online}</span> игроков онлайн</div>

        <article class="lobby-hero">
          <!-- ранг + прогресс-бар (п.4) -->
          <div class="rank-row">
            <div class="rank-info">
              <div class="rank-name" style="color:${s.color}">${s.name.toUpperCase()}</div>
              <div class="rank-sub">${o?`До ${o.name}: ${o.minXp-t.xp} XP`:"Максимальный ранг!"}</div>
            </div>
            <div class="rank-xp">${t.xp} XP</div>
          </div>
          <div class="rank-bar"><div class="rank-bar-fill" style="width:${i*100}%;background:${s.color}"></div></div>

          <div class="lobby-stats-strip">
            <div class="stat"><div class="v" id="stWL">${t.wins}–${t.losses}</div><div class="k">П–П</div></div>
            <div class="stat${a?" fire-streak":""}"><div class="v${a?" streak-fire":" fire"}" id="stStreak">${a?"🔥 ":""}${t.streak}</div><div class="k">СЕРИЯ</div></div>
            <div class="stat"><div class="v" id="stWR">${Gt(t.wins,t.losses)}%</div><div class="k">ВИНРЕЙТ</div></div>
            <div class="stat"><div class="v pl-pos" id="stNet">${t.net>=0?"+":"−"}${M(Math.abs(t.net))}</div><div class="k">ПРОФИТ</div></div>
          </div>

          <div class="lobby-stake-info">
            <span class="lab-inline">Ставка</span>
            <span class="stake-fixed">10 USDT</span>
            <span class="pot-preview" id="potPreview"></span>
          </div>

          <div class="play-hit">
            <button class="play-big" id="playBtn">ИГРАТЬ <span class="amt">10 USDT</span></button>
          </div>
        </article>

        <div class="lobby-bottom-grid">
          <div class="lobby-recent-inset">
            <div class="lobby-recent-label">Недавние</div>
            <div class="lobby-recent-feed" id="recentFeed"><div class="lobby-recent-empty">Дуэлей пока нет — жми ИГРАТЬ</div></div>
          </div>
          <div class="lobby-tip-card">
            <div class="lobby-recent-label">Суть игры</div>
            <div class="lobby-tip-body">Бомба <b>нагревается</b> в твоих руках. Передай сопернику — жми <b>ПАСС</b>. Кто с бомбой в момент взрыва — <b>проигрывает</b>.</div>
          </div>
        </div>

        <nav class="menu-pills">
          <button type="button" id="profileBtn">Профиль</button>
          <button type="button" id="leaderboardBtn">Рейтинг</button>
          <button type="button" id="historyBtn">История</button>
          <button type="button" id="achBtn">Награды</button>
          <button type="button" id="inviteBtn">Пригласить</button>
          <button type="button" id="rulesBtn">Правила</button>
          <button type="button" class="pill-warn" id="resetBtn">Сброс</button>
        </nav>
      </div>
    </section>
  `)),document.getElementById("playBtn").addEventListener("click",e.onPlay),document.getElementById("rulesBtn").addEventListener("click",e.onRules),document.getElementById("leaderboardBtn").addEventListener("click",e.onLeaderboard),document.getElementById("profileBtn").addEventListener("click",e.onProfile),document.getElementById("achBtn").addEventListener("click",e.onAchievements),document.getElementById("inviteBtn").addEventListener("click",e.onInvite),document.getElementById("historyBtn").addEventListener("click",e.onHistory),He(t.stake)}function He(n){const t=document.getElementById("potPreview");t&&(t.textContent=`Банк ${M(n*2)} · выигрыш ~${M(n*2*.95)}`)}function Oe(n){const t=document.getElementById("balVal");t&&(t.textContent=M(n))}function Xe(n){const t=document.getElementById("stWL");t&&(t.textContent=`${n.wins}–${n.losses}`);const e=document.getElementById("stStreak");e&&(e.textContent=String(n.streak));const s=document.getElementById("stWR");s&&(s.textContent=Gt(n.wins,n.losses)+"%");const o=document.getElementById("stNet");o&&(o.textContent=`${n.net>=0?"+":"−"}${M(Math.abs(n.net))}`)}function Gt(n,t){const e=n+t;return e>0?Math.round(n/e*100):0}function Ge(n){const t=document.getElementById("onlineCount");t&&(t.textContent=String(n))}function We(n){const t=document.getElementById("recentFeed");if(t){if(!n.length){t.innerHTML='<div class="lobby-recent-empty">Дуэлей пока нет — жми ИГРАТЬ</div>';return}t.innerHTML=n.map(e=>`
    <div class="lobby-recent-row">
      <span class="ic">${e.ic}</span>
      <span class="who"><b>@${e.opp}</b> · ${e.stake} USDT</span>
      <span class="amt" style="color:${e.col}">${e.amt}</span>
    </div>`).join("")}}function ze(n,t,e){n.appendChild(L(`
    <section class="screen arena-screen" data-screen="arena">
      <button class="arena-exit" id="arenaExit" title="Выйти">×</button>
      <button class="arena-help" id="arenaHelp" title="Правила">?</button>
      <div class="heat-pill" id="heatPill"><span class="heat-pill-label">НАГРЕВ</span><span class="heat-pill-val" id="heatVal">1.00×</span></div>
      <canvas id="arenaCanvas" class="arena-canvas pong-canvas"></canvas>
      <div class="countdown" id="countdown"><span id="cdNum">3</span></div>
      <button class="btn-pass pass" id="passBtn" disabled>ПАСС</button>
    </section>
  `));const s=document.getElementById("arenaCanvas");return document.getElementById("arenaExit").addEventListener("click",()=>{confirm("Выйти из раунда? Это засчитывается как поражение.")&&e()}),document.getElementById("arenaHelp").addEventListener("click",()=>Vt()),document.getElementById("passBtn").addEventListener("click",()=>{t()}),s}let j=1,$=1,lt=0;function Wt(n){j=n,lt||(lt=window.requestAnimationFrame(zt))}function zt(){$+=(j-$)*.2,Math.abs(j-$)<.005&&($=j);const n=document.getElementById("heatVal");n&&(n.textContent=$.toFixed(2)+"×");const t=document.getElementById("heatPill");t&&($>4?t.className="heat-pill burn":$>2.5?t.className="heat-pill hot":$>1.5?t.className="heat-pill warm":t.className="heat-pill cool"),Math.abs(j-$)>=.005?lt=window.requestAnimationFrame(zt):lt=0}function K(n){const t=document.getElementById("passBtn");if(t)switch(t.className="btn-pass "+n,n){case"pass":t.disabled=!1,t.textContent="ПАСС";break;case"locked":t.disabled=!0,t.textContent="БЛОК";break;case"waiting":t.disabled=!0,t.textContent="ЖДЁМ";break;case"disabled":t.disabled=!0,t.textContent="—";break}}function qe(n,t){const e=document.createElement("div");e.className="float-bal neg",e.textContent=n;const s=document.getElementById("balVal");if(s){const o=s.getBoundingClientRect();e.style.left=o.left+o.width/2+"px",e.style.top=o.bottom+4+"px"}else e.style.right="20px",e.style.top="60px";document.getElementById("app")?.appendChild(e),setTimeout(()=>e.remove(),1400)}function je(n,t){const e=document.getElementById("app");if(!e)return;const s=document.createElement("div");s.className="modal on",s.id="rankUpModal",s.innerHTML=`<div class="mcard" style="text-align:center">
    <div style="font-size:56px;margin-bottom:8px">🏆</div>
    <div style="font-size:14px;color:var(--mut);margin-bottom:6px">Ранг повышен!</div>
    <div class="rankup-name" style="font-family:var(--display);font-size:42px;font-weight:800;color:${t};margin-bottom:16px;letter-spacing:1px">${n.toUpperCase()}</div>
    <div class="mbtns"><button class="mbtn go" id="rankUpClose">Отлично!</button></div>
  </div>`,e.appendChild(s),document.getElementById("rankUpClose").addEventListener("click",()=>s.remove()),s.addEventListener("click",o=>{o.target===s&&s.remove()})}function vt(n){const t=document.getElementById("countdown"),e=document.getElementById("cdNum");if(!(!t||!e)){if(n<0){t.classList.remove("on");return}t.classList.add("on"),e.textContent=n>0?String(n):"GO",e.className=n>0?"tick":"go tick"}}function Ke(n,t,e){n.querySelector('[data-screen="result"]')?.remove();const s=t.win?"ВЫЖИЛ":"СГОРЕЛ",o=t.win?"win":"lose",i=t.net>=0?"+":"−";n.appendChild(L(`
    <section class="screen result-screen visible" data-screen="result">
      <div class="result-wrap ${o}">
        <div class="res-badge">${t.win?'<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':'<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'}</div>
        <h2 class="res-verdict ${o}">${s}</h2>
        <div class="res-amt ${o}">${i}${M(Math.abs(t.net))} USDT</div>
        <div class="res-meta"><div class="res-row"><span>Взрыв на</span><b>${Math.floor(t.heat*100)} НАГРЕВ</b></div></div>
        <button class="btn-primary" id="rematchBtn">РЕВАНШ</button>
        <div class="res-secondary">
          <button class="btn-ghost res-share" id="shareBtn">Поделиться</button>
          <button class="btn-ghost" id="lobbyBtn">В ЛОББИ</button>
        </div>
      </div>
    </section>
  `)),document.getElementById("rematchBtn").addEventListener("click",e.onRematch),document.getElementById("lobbyBtn").addEventListener("click",e.onLobby),document.getElementById("shareBtn").addEventListener("click",()=>e.onShare());const a=document.querySelector(".res-amt");if(a){a.classList.add("counting");let l=0;const d=Math.abs(t.net),u=d/20,p=setInterval(()=>{l+=u,l>=d&&(l=d,clearInterval(p)),a.textContent=`${i}${M(l)} USDT`},30)}if(t.win){const l=document.getElementById("app");if(l){const d=["#ffb627","#ff6b1a","#00e676","#ffffff","#ff8c42"];for(let u=0;u<30;u++){const p=document.createElement("div");p.className="confetti-piece",p.style.left=Math.random()*100+"%",p.style.top="20%",p.style.background=d[Math.floor(Math.random()*d.length)],p.style.animationDelay=Math.random()*.3+"s",p.style.animationDuration=1+Math.random()*.8+"s",l.appendChild(p),setTimeout(()=>p.remove(),2500)}}}pt("result")}function qt(n,t,e,s){const i=[...[{name:"volt_king",pl:12450,duels:234},{name:"ohm_master",pl:9870,duels:198},{name:"surge_07",pl:7320,duels:156},{name:"arc.duelist",pl:5600,duels:142},{name:"kil0watt",pl:4200,duels:121},{name:"jolt_pro",pl:3800,duels:110},{name:"rez.in",pl:2950,duels:98},{name:"static_x",pl:1800,duels:76},{name:"fusebox",pl:950,duels:54}],{name:t||"Ты",pl:Math.round(e),duels:s}].sort((l,d)=>d.pl-l.pl);n.querySelector("#leaderboardModal")?.remove(),n.appendChild(L(`
    <div class="modal" id="leaderboardModal">
      <div class="mcard">
        <h3>🏆 Рейтинг</h3>
        <div class="lb-list">
          ${i.map((l,d)=>`
            <div class="lb-row${l.name===(t||"Ты")?" me":""}">
              <span class="lb-pos">${d+1}</span>
              <span class="lb-name">${l.name===(t||"Ты")?"<b>Ты</b>":l.name}</span>
              <span class="lb-pl">${l.pl>=0?"+":""}${M(l.pl)}</span>
              <span class="lb-duels">${l.duels}</span>
            </div>`).join("")}
        </div>
        <div class="mbtns"><button class="mbtn go" id="lbClose">Закрыть</button></div>
      </div>
    </div>`));const a=document.getElementById("leaderboardModal");document.getElementById("lbClose").addEventListener("click",()=>a.classList.remove("on")),a.addEventListener("click",l=>{l.target===a&&a.classList.remove("on")})}function Ye(){document.getElementById("leaderboardModal")?.classList.add("on")}function jt(n,t){const e=t.wins+t.losses>0?Math.round(t.wins/(t.wins+t.losses)*100):0;n.querySelector("#profileModal")?.remove(),n.appendChild(L(`
    <div class="modal" id="profileModal">
      <div class="mcard" style="text-align:center">
        <h3>Профиль</h3>
        <div style="font-size:48px;margin:4px 0 8px">👤</div>
        <div style="font-size:20px;font-weight:700;color:var(--ink);margin-bottom:2px">${t.name}</div>
        <div style="font-size:14px;color:${t.rankColor};font-weight:600;margin-bottom:14px">${t.rank.toUpperCase()} · ${t.xp} XP</div>
        <div class="prof-grid">
          <div class="prof-cell"><div class="prof-v">${t.wins}–${t.losses}</div><div class="prof-k">П–П</div></div>
          <div class="prof-cell"><div class="prof-v">${e}%</div><div class="prof-k">ВИНРЕЙТ</div></div>
          <div class="prof-cell"><div class="prof-v">🔥 ${t.streak}</div><div class="prof-k">СЕРИЯ</div></div>
          <div class="prof-cell"><div class="prof-v">${t.longestStreak}</div><div class="prof-k">РЕКОРД</div></div>
          <div class="prof-cell"><div class="prof-v">${t.duels}</div><div class="prof-k">ДУЭЛИ</div></div>
          <div class="prof-cell"><div class="prof-v" style="color:${t.net>=0?"var(--safe)":"var(--short)"}">${t.net>=0?"+":""}${M(t.net)}</div><div class="prof-k">ПРОФИТ</div></div>
        </div>
        <div class="mbtns"><button class="mbtn go" id="profClose">Закрыть</button></div>
      </div>
    </div>`));const s=document.getElementById("profileModal");document.getElementById("profClose").addEventListener("click",()=>s.classList.remove("on")),s.addEventListener("click",o=>{o.target===s&&s.classList.remove("on")})}function Ve(){document.getElementById("profileModal")?.classList.add("on")}function Je(n){const t=n.history.length>0?Math.max(...n.history.filter(e=>e.stake).map(e=>e.stake)):0;return[{id:"first_win",name:"Первая кровь",desc:"Выиграй первую дуэль",unlocked:n.wins>=1},{id:"streak5",name:"На огне",desc:"5 побед подряд",unlocked:n.longestStreak>=5},{id:"duels10",name:"Боец",desc:"10 дуэлей",unlocked:n.totalDuels>=10},{id:"duels50",name:"Ветеран",desc:"50 дуэлей",unlocked:n.totalDuels>=50},{id:"stake500",name:"Хайроллер",desc:"Сыграй на ставке 500",unlocked:t>=500}]}function Kt(n,t){const e=Je(t);n.querySelector("#achModal")?.remove(),n.appendChild(L(`
    <div class="modal" id="achModal">
      <div class="mcard">
        <h3>🏅 Достижения</h3>
        <div class="ach-list">
          ${e.map(o=>`
            <div class="ach-row${o.unlocked?" unlocked":""}">
              <span class="ach-ic">${o.unlocked?"✅":"🔒"}</span>
              <div class="ach-info"><div class="ach-name">${o.name}</div><div class="ach-desc">${o.desc}</div></div>
            </div>`).join("")}
        </div>
        <div class="mbtns"><button class="mbtn go" id="achClose">Закрыть</button></div>
      </div>
    </div>`));const s=document.getElementById("achModal");document.getElementById("achClose").addEventListener("click",()=>s.classList.remove("on")),s.addEventListener("click",o=>{o.target===s&&s.classList.remove("on")})}function Qe(){document.getElementById("achModal")?.classList.add("on")}function Yt(n,t){n.querySelector("#historyModal")?.remove();const e=o=>new Date(o).toLocaleDateString("ru-RU",{day:"numeric",month:"short"});n.appendChild(L(`
    <div class="modal" id="historyModal">
      <div class="mcard">
        <h3>История дуэлей</h3>
        <div class="hist-full-list">
          ${t.length===0?'<div style="color:var(--dim);text-align:center;padding:20px">Дуэлей пока нет</div>':t.map(o=>`
            <div class="hist-full-row">
              <span class="hist-ic">${o.win?"✓":"✕"}</span>
              <div class="hist-info">
                <div class="hist-top"><b>@${o.opp}</b> · ${e(o.t)}</div>
                <div class="hist-bot">Ставка ${o.stake} · НАГРЕВ ${Math.floor(o.heat*100)}</div>
              </div>
              <span class="hist-amt" style="color:${o.net>=0?"var(--safe)":"var(--short)"}">${o.net>=0?"+":""}${M(o.net)}</span>
            </div>`).join("")}
        </div>
        <div class="mbtns"><button class="mbtn go" id="histClose">Закрыть</button></div>
      </div>
    </div>`));const s=document.getElementById("historyModal");document.getElementById("histClose").addEventListener("click",()=>s.classList.remove("on")),s.addEventListener("click",o=>{o.target===s&&s.classList.remove("on")})}function Ze(){document.getElementById("historyModal")?.classList.add("on")}function tn(n,t){n.appendChild(L(`
    <div class="modal" id="rulesModal">
      <div class="mcard">
        <h3>Как играть в SPARK</h3>
        <div class="info-steps">
          <div class="info-step"><div class="num orange">1</div><div class="txt"><b>Бомба</b> — Она нагревается с каждой секундой. Чем выше нагрев, тем ближе взрыв.</div></div>
          <div class="info-step"><div class="num green">2</div><div class="txt"><b>Пас</b> — Жми <b>ПАСС</b> или тапни по арене, чтобы перекинуть бомбу сопернику.</div></div>
          <div class="info-step"><div class="num gold">3</div><div class="txt"><b>Блок</b> — После получения бомбы <b>500мс</b> нельзя пасовать. Думай быстрее!</div></div>
          <div class="info-step"><div class="num red">4</div><div class="txt"><b>Взрыв</b> — Кто держит бомбу в момент взрыва — <b>проигрывает</b>. Точка взрыва честная (provably-fair).</div></div>
          <div class="info-step"><div class="num orange">5</div><div class="txt"><b>Ставки</b> — Ставка 10 монет. Победитель забирает банк минус 5% комиссии.</div></div>
        </div>
        <div class="mbtns"><button class="mbtn go" id="rulesClose">Понятно</button></div>
      </div>
    </div>
  `));const e=document.getElementById("rulesModal");document.getElementById("rulesClose").addEventListener("click",()=>{e.classList.remove("on")}),e.addEventListener("click",s=>{s.target===e&&e.classList.remove("on")})}function Vt(){document.getElementById("rulesModal")?.classList.add("on")}const Jt="spark:onboarded",W=[{icon:"💣",title:"Бомба нагревается",body:"Бомба <b>нагревается</b> с каждой секундой. Чем дольше держишь — тем выше шанс взрыва."},{icon:"👆",title:"Передай сопернику",body:"Жми <b>ПАСС</b> или тапни по арене, чтобы перекинуть бомбу сопернику. Кто держит — тот рискует."},{icon:"💥",title:"Не окажись с бомбой",body:"Кто держит бомбу в момент <b>взрыва</b> — проигрывает. Передавай вовремя!"},{icon:"🏆",title:"Готов!",body:"Ставка 10 монет · победитель забирает 95% банка. Удачи!"}];function en(){try{return localStorage.getItem(Jt)!=="1"}catch{return!1}}function nn(n,t){n.appendChild(L('<div class="onboard" id="onboard"></div>'));let e=0;const s=document.getElementById("onboard"),o=()=>{const i=W[e];s.innerHTML=`
      <div class="onboard-card">
        <div class="onboard-icon">${i.icon}</div>
        <div class="onboard-step">Шаг ${e+1} из ${W.length}</div>
        <div class="onboard-title">${i.title}</div>
        <div class="onboard-body">${i.body}</div>
        <div class="onboard-dots">${W.map((a,l)=>`<div class="onboard-dot${l===e?" active":""}"></div>`).join("")}</div>
        <button class="onboard-btn" id="obNext">${e===W.length-1?"ПОЕХАЛИ":"ДАЛЕЕ"}</button>
      </div>`,document.getElementById("obNext").addEventListener("click",()=>{if(e++,e>=W.length){try{localStorage.setItem(Jt,"1")}catch{}s.classList.remove("on")}else o()})};s.classList.add("on"),o()}function M(n){return n.toLocaleString("ru-RU",{minimumFractionDigits:n%1===0?0:2,maximumFractionDigits:2})}function _(){return window.Telegram?.WebApp}_();function sn(){const n=_();if(n){try{n.ready()}catch{}try{n.expand()}catch{}setTimeout(()=>{try{n.expand()}catch{}},300),setTimeout(()=>{try{n.expand()}catch{}},800),setTimeout(()=>{try{n.expand()}catch{}},1500)}}function gt(){const t=_()?.initDataUnsafe?.user;if(t&&typeof t.id=="number")return{id:t.id,first_name:t.first_name,username:t.username};let e=0;try{e=Number(localStorage.getItem("spark:demoId"))}catch{}if(!e){e=Math.floor(Math.random()*1e6)+1e4;try{localStorage.setItem("spark:demoId",String(e))}catch{}}return{id:e,first_name:"Игрок"}}function Qt(){const n=_(),t=document.documentElement,e=n?.themeParams??{},s=(o,i,a)=>{i?t.style.setProperty(o,i):a&&t.style.setProperty(o,a)};if(s("--tg-bg",e.bg_color,"#07070b"),s("--tg-text",e.text_color,"#f4f4f5"),s("--tg-hint",e.hint_color,"#71717a"),s("--tg-button",e.button_color,"#f97316"),s("--tg-button-text",e.button_text_color,"#ffffff"),s("--tg-secondary",e.secondary_bg_color,"#13131a"),n)try{n.onEvent("themeChanged",Qt)}catch{}}function Bt(n="medium"){_()?.HapticFeedback?.impactOccurred(n)}function Zt(n){_()?.HapticFeedback?.notificationOccurred(n)}const ct="https://zurab-kh.github.io/spark-game/";function on(){const n=_(),t="🔥 Сыграй со мной в SPARK — дуэль на бомбе! Передавай, пока не рванула.";if(n?.openTelegramLink){const e=`https://t.me/share/url?url=${encodeURIComponent(ct)}&text=${encodeURIComponent(t)}`;n.openTelegramLink(e)}else window.open(`https://t.me/share/url?url=${encodeURIComponent(ct)}&text=${encodeURIComponent(t)}`,"_blank")}function an(n,t,e,s){const o=_(),a=`${n?`🎉 ВЫЖИЛ в SPARK! +${t.toFixed(2)} USDT`:`💥 Сгорел в SPARK... −${t.toFixed(2)} USDT`}
НАГРЕВ: ${Math.floor(e*100)} · vs @${s}
Сможешь лучше?`;if(o?.openTelegramLink){const l=`https://t.me/share/url?url=${encodeURIComponent(ct)}&text=${encodeURIComponent(a)}`;o.openTelegramLink(l)}else window.open(`https://t.me/share/url?url=${encodeURIComponent(ct)}&text=${encodeURIComponent(a)}`,"_blank")}const E=10,g=document.getElementById("app");let r=be(),f=null,v="idle",P="solo",rn="host",yt="",y=1,C=1,N=5,At=null,F=0,J=0,tt=0,kt=0,dt=[],xt=!1;function ln(){sn(),Qt(),_e(),De()&&document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("muteBtn");e&&(e.textContent="🔇")}),Nt();const n=gt();Ne(g,()=>{dn()}),Fe(g,cn(n.first_name),{onPlay:()=>{B("ui",.4),Bt("medium"),pn()},onRules:()=>Vt(),onLeaderboard:()=>Ye(),onProfile:()=>Ve(),onAchievements:()=>Qe(),onInvite:()=>{B("ui",.4),on()},onHistory:()=>Ze()}),tn(g),qt(g,n.first_name,r.totalPL,r.totalDuels),jt(g,te(n.first_name)),Kt(g,r),Yt(g,r.history),ee(),document.getElementById("muteBtn")?.addEventListener("click",()=>{const e=Re();document.getElementById("muteBtn").textContent=e?"🔇":"🔊",e||Ot()}),document.getElementById("resetBtn")?.addEventListener("click",()=>{confirm("Сбросить весь прогресс?")&&(r=ge(),Mt(r),Ct(),f?.clear(),bt(),ut("<b>Сброс.</b> 1,000 монет"))}),pt("intro");const t=document.getElementById("preloader");t&&(t.classList.add("hide"),setTimeout(()=>t.remove(),500)),document.addEventListener("visibilitychange",()=>{document.hidden?bt():v==="running"&&(tt=performance.now())})}function cn(n){return{balance:r.balance,stake:E,wins:r.wins,losses:r.losses,streak:r.streak,net:r.totalPL,online:le(90,240),name:n,xp:r.xp,duels:r.totalDuels}}function te(n){const{rank:t}=Q(r.xp);return{name:n,rank:t.name,rankColor:t.color,xp:r.xp,wins:r.wins,losses:r.losses,streak:r.streak,longestStreak:r.longestStreak,duels:r.totalDuels,net:r.totalPL}}function dn(){Te(),Nt(),Bt("light"),O(),en()&&nn(g)}function ee(){if(f)return;const n=ze(g,()=>{ae()},()=>{v==="running"||v==="countdown"?re(1):O()});f=new Ue(n),window.addEventListener("resize",()=>f?.resize()),un()}function un(){const n=document.querySelector(".arena-screen");if(!n)return;const t=e=>{v!=="running"||e.target.closest(".arena-exit, .arena-help, .btn-pass, .heat-pill")||(e.preventDefault(),ae())};n.addEventListener("touchstart",e=>t(e),{passive:!1}),n.addEventListener("mousedown",e=>t(e))}function O(){v="idle",Lt(),$t(),bt(),P="solo",xt||(Ot(),xt=!0),f?.clear(),Ct(),pt("lobby")}function Ct(){Oe(r.balance),Xe({wins:r.wins,losses:r.losses,streak:r.streak,net:r.totalPL,duels:r.totalDuels}),Ge(le(90,240)),We(mn()),fn(),qt(g,gt().first_name,r.totalPL,r.totalDuels),jt(g,te(gt().first_name)),Kt(g,r),Yt(g,r.history);const n=document.getElementById("playBtn");n&&(n.disabled=r.balance<E)}function fn(){const{rank:n,next:t,progress:e}=Q(r.xp),s=document.querySelector(".rank-name");s&&(s.textContent=n.name.toUpperCase(),s.style.color=n.color);const o=document.querySelector(".rank-sub");o&&(o.textContent=t?`До ${t.name}: ${t.minXp-r.xp} XP`:"Максимальный ранг!");const i=document.querySelector(".rank-xp");i&&(i.textContent=`${r.xp} XP`);const a=document.querySelector(".rank-bar-fill");a&&(a.style.width=`${e*100}%`,a.style.background=n.color)}function mn(){return r.history.slice(0,3).map(n=>({ic:n.win?"✓":"✕",opp:n.opp,stake:n.stake,amt:(n.net>0?"+":"−")+Math.abs(n.net).toFixed(2),col:n.net>0?"var(--neon-green)":n.net<0?"var(--danger)":"var(--text-tertiary)"}))}function pn(){if(r.balance<E){ut("Недостаточно средств");return}Lt(),Xt(),xt=!1,f?.clear(),P="solo",yt=yn(["volta","jolt_","ohm.eye","surge_07","arc.dx","kil0watt","rez.in","static_x"]),ne()}function Lt(){window.clearTimeout(kt),kt=0,dt.forEach(n=>window.clearTimeout(n)),dt=[]}async function ne(){if(!(v==="countdown"||v==="running"||v==="resolving")){if(r.balance<E){O();return}Lt(),v="countdown",At=await Se(r.clientSeed,r.nonce),r.nonce++,N=At.B,Mt(r),P==="solo"&&(Ce(),Le()),C=Math.random()<.5?1:2,y=1,F=0,ee(),pt("arena"),f?.resize(),f?.clear(),oe(),Wt(y),It(),await hn(),vn()}}function hn(){return new Promise(n=>{let t=3;const e=()=>{t>0?(vt(t),B("cd3",.55,t===3?1:t===2?.85:.7),t--,dt.push(window.setTimeout(e,he))):(vt(0),B("go",.6),dt.push(window.setTimeout(()=>{vt(-1),n()},450)))};e()})}function vn(){if(r.balance<E){O();return}v="running",qe(`−${E} USDT`),P==="solo"&&C===2&&Ut(performance.now(),y,N),C===1&&(F=performance.now()),Ft(.3),Pe(.3),It(),tt=performance.now(),bn()}function bn(){$t(),tt=performance.now(),J=requestAnimationFrame(se)}function $t(){J&&(cancelAnimationFrame(J),J=0)}function se(n){if(v!=="running")return;const t=Math.min(50,n-tt);if(tt=n,(P==="solo"||P==="pvp"&&rn==="host")&&(y=Be(y,t)),Wt(y),y>=N){gn(C);return}P==="solo"&&C===2&&$e(n,y,N)&&ie(2);const e=Math.max(0,Math.min(1,(y-1)/(N-1)));Ae(e),Ft(.3+e*.6),oe(),f?.update(t),f?.render(n),J=requestAnimationFrame(se)}function oe(){if(!f)return;const n=performance.now()-F<it,t=n?1-Math.max(0,(performance.now()-F)/it):0,e={holder:C,heat:y,burnPoint:N,lockout:n&&C===1,lockProgress:t,phase:v==="running"?"running":"resolving"};f.setState(e)}function ae(){v==="running"&&C===1&&(performance.now()-F<it||ie(1))}function ie(n){const t=n===1?2:1;C=t,F=performance.now(),f?.burst(f.getWidth()*(n===1?.27:.73),f.getHeight()*.46),B("pass",.5),Bt("medium"),P==="solo"&&t===2&&Ut(performance.now(),y,N),It()}function It(){if(v!=="running"){K("disabled");return}C===1?performance.now()-F<it?K("locked"):K("pass"):K("waiting")}function gn(n){v="resolving",$t(),Et();const t=n===1,e=n,s=f?f.getWidth()*(e===1?.27:.73):0,o=f?f.getHeight()*.46:0;f?.explosion(s,o),f?.flashScreen(t?"red":"green"),B("short",.7),Zt(t?"error":"success"),K("disabled"),kt=window.setTimeout(()=>{re(e)},1400)}function re(n){const t=n!==1,e=ye({youFried:!t,stake:E}),s=Q(r.xp).rank;r.balance=Math.max(0,Math.round((r.balance+e.net)*100)/100),t?(r.wins++,r.streak++,r.totalPL+=e.net,r.streak>r.longestStreak&&(r.longestStreak=r.streak),r.xp+=10+Math.floor(E/10)):(r.losses++,r.streak=0,r.totalPL+=e.net,r.xp+=3),r.totalDuels++,r.history.unshift({t:Date.now(),stake:E,win:t,net:e.net,opp:yt,heat:y}),r.history.length>12&&(r.history.length=12),Mt(r);const o=Q(r.xp).rank,i=o.name!==s.name;t?(B("win",.55),Zt("success")):B("lose",.5),v="idle",Ke(g,{win:t,net:e.net,heat:y},{onRematch:()=>{if(r.balance<E){ut("Недостаточно средств"),O();return}if(P==="pvp"){const a=document.getElementById("rematchBtn");a&&(a.disabled=!0,a.textContent="ЖДЁМ..."),ut("Ожидание соперника...")}else ne()},onLobby:O,onShare:()=>an(t,Math.abs(e.net),y,yt)}),Ct(),i&&setTimeout(()=>{je(o.name,o.color),B("win",.5)},2e3)}let Rt=0;function ut(n){let t=document.getElementById("toast");t||(t=document.createElement("div"),t.id="toast",t.className="toast",g.appendChild(t)),t.innerHTML=n,t.classList.add("on"),window.clearTimeout(Rt),Rt=window.setTimeout(()=>t.classList.remove("on"),2400)}function le(n,t){return Math.floor(n+Math.random()*(t-n+1))}function yn(n){return n[Math.floor(Math.random()*n.length)]}ln();
