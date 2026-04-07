const CarSVG = () => (
  <svg viewBox="0 0 380 175" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', overflow: 'visible' }}>
    <defs>
      <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#3b5bdb"/>
        <stop offset="100%" stopColor="#2d4bc4"/>
      </linearGradient>
      <linearGradient id="carCabin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#364fc7"/>
        <stop offset="100%" stopColor="#3451c1"/>
      </linearGradient>
      <linearGradient id="carGlass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#74c0fc" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#4dabf7" stopOpacity="0.85"/>
      </linearGradient>
      <linearGradient id="carBumper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#2c3e8c"/>
        <stop offset="100%" stopColor="#1e2f7a"/>
      </linearGradient>
      <radialGradient id="carHL" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#fffde0"/>
        <stop offset="100%" stopColor="#ffd700" stopOpacity="0.3"/>
      </radialGradient>
      <radialGradient id="carTL" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#ff6b6b" stopOpacity="0.95"/>
        <stop offset="100%" stopColor="#c92a2a" stopOpacity="0.4"/>
      </radialGradient>
      <radialGradient id="carRefl" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="190" cy="170" rx="145" ry="8" fill="url(#carRefl)"/>
    <rect x="12" y="90" width="356" height="60" rx="10" fill="url(#carBody)"/>
    <path d="M68 90 Q76 42 108 34 L264 34 Q296 42 312 90Z" fill="url(#carCabin)"/>
    <path d="M110 38 Q190 28 264 38" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M12 94 Q190 90 368 94" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
    <path d="M110 90 Q115 48 138 38 L246 38 Q270 48 274 90Z" fill="url(#carGlass)" opacity="0.9"/>
    <path d="M126 88 Q130 60 145 46 L175 46 Q162 66 152 88Z" fill="rgba(255,255,255,0.1)"/>
    <path d="M70 88 Q74 58 94 50 L106 50 Q104 68 102 88Z" fill="url(#carGlass)" opacity="0.75"/>
    <path d="M278 88 Q280 68 280 50 L294 50 Q312 58 314 88Z" fill="url(#carGlass)" opacity="0.75"/>
    <path d="M14 116 Q190 112 366 116" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" fill="none"/>
    <line x1="196" y1="90" x2="192" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
    <line x1="136" y1="90" x2="134" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    <rect x="148" y="118" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
    <rect x="216" y="118" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
    <rect x="14" y="140" width="70" height="12" rx="5" fill="url(#carBumper)"/>
    <rect x="296" y="140" width="70" height="12" rx="5" fill="url(#carBumper)"/>
    <ellipse cx="48" cy="114" rx="22" ry="9"  fill="url(#carHL)"/>
    <ellipse cx="48" cy="114" rx="14" ry="5.5" fill="rgba(255,255,220,0.95)"/>
    <ellipse cx="48" cy="114" rx="6"  ry="2.5" fill="white"/>
    <rect x="30" y="122" width="36" height="3" rx="1.5" fill="rgba(255,255,200,0.6)"/>
    <ellipse cx="48" cy="114" rx="20" ry="8" fill="none" stroke="rgba(255,255,200,0.25)" strokeWidth="1"/>
    <ellipse cx="22" cy="114" rx="16" ry="9" fill="rgba(255,255,180,0.15)"/>
    <ellipse cx="330" cy="114" rx="22" ry="9"  fill="url(#carTL)"/>
    <ellipse cx="330" cy="114" rx="12" ry="5"  fill="rgba(255,80,80,0.9)"/>
    <ellipse cx="330" cy="114" rx="5.5" ry="2" fill="rgba(255,120,120,0.95)"/>
    <path d="M12 98 Q12 90 18 90 L362 90 Q368 90 368 98" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
    <circle cx="96"  cy="150" r="28" fill="#1e2a5e"/>
    <circle cx="96"  cy="150" r="22" fill="#2a3a7a"/>
    <circle cx="96"  cy="150" r="15" fill="#1e2a5e"/>
    <circle cx="96"  cy="150" r="8"  fill="#2d3f88"/>
    <circle cx="96"  cy="150" r="4"  fill="#6366f1"/>
    <circle cx="96"  cy="150" r="2"  fill="#a5b4fc"/>
    {[0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      return (
        <line key={a}
          x1={96  + 9  * Math.cos(rad)} y1={150 + 9  * Math.sin(rad)}
          x2={96  + 20 * Math.cos(rad)} y2={150 + 20 * Math.sin(rad)}
          stroke="rgba(99,102,241,0.7)" strokeWidth="2.8" strokeLinecap="round"/>
      );
    })}
    <path d="M96 122 A28 28 0 0 1 118 136" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="284" cy="150" r="28" fill="#1e2a5e"/>
    <circle cx="284" cy="150" r="22" fill="#2a3a7a"/>
    <circle cx="284" cy="150" r="15" fill="#1e2a5e"/>
    <circle cx="284" cy="150" r="8"  fill="#2d3f88"/>
    <circle cx="284" cy="150" r="4"  fill="#6366f1"/>
    <circle cx="284" cy="150" r="2"  fill="#a5b4fc"/>
    {[0, 60, 120, 180, 240, 300].map(a => {
      const rad = a * Math.PI / 180;
      return (
        <line key={a}
          x1={284 + 9  * Math.cos(rad)} y1={150 + 9  * Math.sin(rad)}
          x2={284 + 20 * Math.cos(rad)} y2={150 + 20 * Math.sin(rad)}
          stroke="rgba(99,102,241,0.7)" strokeWidth="2.8" strokeLinecap="round"/>
      );
    })}
    <path d="M284 122 A28 28 0 0 1 306 136" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <rect x="164" y="32" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
    <line x1="190" y1="32" x2="190" y2="23" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
    <circle cx="190" cy="22" r="2.5" fill="#a5b4fc"/>
  </svg>
);

/* Tiny self-contained car SVG used in the road scene — same design, no gradients IDs conflict */
const TinyCarSVG = ({ flip = false, opacity = 1 }) => (
  <svg
    viewBox="0 0 380 185"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: '100%', height: '100%', display: 'block',
      transform: flip ? 'scaleX(-1)' : 'none',
      opacity,
    }}
  >
    {/* Body */}
    <rect x="12" y="90" width="356" height="60" rx="10" fill="#3b5bdb"/>
    <rect x="12" y="90" width="356" height="60" rx="10" fill="url(#tcb)" />
    {/* Cabin */}
    <path d="M68 90 Q76 42 108 34 L264 34 Q296 42 312 90Z" fill="#364fc7"/>
    {/* Roof highlight */}
    <path d="M110 38 Q190 28 264 38" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Body highlight */}
    <path d="M12 94 Q190 90 368 94" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
    {/* Windshield */}
    <path d="M110 90 Q115 48 138 38 L246 38 Q270 48 274 90Z" fill="#74c0fc" opacity="0.7"/>
    {/* Windshield glare */}
    <path d="M126 88 Q130 60 145 46 L175 46 Q162 66 152 88Z" fill="rgba(255,255,255,0.12)"/>
    {/* Side window L */}
    <path d="M70 88 Q74 58 94 50 L106 50 Q104 68 102 88Z" fill="#74c0fc" opacity="0.6"/>
    {/* Side window R */}
    <path d="M278 88 Q280 68 280 50 L294 50 Q312 58 314 88Z" fill="#74c0fc" opacity="0.6"/>
    {/* Body crease */}
    <path d="M14 116 Q190 112 366 116" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none"/>
    {/* Door handle */}
    <rect x="148" y="118" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
    <rect x="216" y="118" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
    {/* Bumpers */}
    <rect x="14" y="140" width="70" height="12" rx="5" fill="#2c3e8c"/>
    <rect x="296" y="140" width="70" height="12" rx="5" fill="#2c3e8c"/>
    {/* Headlights */}
    <ellipse cx="48" cy="114" rx="20" ry="8" fill="rgba(255,255,210,0.9)"/>
    <ellipse cx="48" cy="114" rx="10" ry="4" fill="white"/>
    {/* Tail lights */}
    <ellipse cx="330" cy="114" rx="20" ry="8" fill="rgba(255,80,80,0.85)"/>
    <ellipse cx="330" cy="114" rx="10" ry="4" fill="rgba(255,110,110,0.9)"/>
    {/* 3D edge */}
    <path d="M12 98 Q12 90 18 90 L362 90 Q368 90 368 98" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none"/>
    {/* Front wheel */}
    <circle cx="96"  cy="152" r="28" fill="#1e2a5e"/>
    <circle cx="96"  cy="152" r="20" fill="#2a3a7a"/>
    <circle cx="96"  cy="152" r="13" fill="#1e2a5e"/>
    <circle cx="96"  cy="152" r="6"  fill="#2d3f88"/>
    <circle cx="96"  cy="152" r="3"  fill="#6366f1"/>
    {[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={96+7*Math.cos(r)} y1={152+7*Math.sin(r)} x2={96+18*Math.cos(r)} y2={152+18*Math.sin(r)} stroke="rgba(99,102,241,0.65)" strokeWidth="2.5" strokeLinecap="round"/>})}
    {/* Rear wheel */}
    <circle cx="284" cy="152" r="28" fill="#1e2a5e"/>
    <circle cx="284" cy="152" r="20" fill="#2a3a7a"/>
    <circle cx="284" cy="152" r="13" fill="#1e2a5e"/>
    <circle cx="284" cy="152" r="6"  fill="#2d3f88"/>
    <circle cx="284" cy="152" r="3"  fill="#6366f1"/>
    {[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={284+7*Math.cos(r)} y1={152+7*Math.sin(r)} x2={284+18*Math.cos(r)} y2={152+18*Math.sin(r)} stroke="rgba(99,102,241,0.65)" strokeWidth="2.5" strokeLinecap="round"/>})}
    {/* Antenna */}
    <line x1="190" y1="34" x2="190" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <circle cx="190" cy="21" r="2.5" fill="#a5b4fc"/>
  </svg>
);

/* Road scene rendered as pure SVG for mobile */
const MobileRoadScene = () => (
  <svg
    viewBox="0 0 400 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', display: 'block' }}
  >
    <defs>
      <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8eaf6"/>
        <stop offset="100%" stopColor="#c5cae9"/>
      </linearGradient>
      <linearGradient id="roadSurface" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#546e7a"/>
        <stop offset="100%" stopColor="#37474f"/>
      </linearGradient>
      {/* Reusable car body gradient per color */}
      <linearGradient id="cb1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b5bdb"/><stop offset="100%" stopColor="#2d4bc4"/>
      </linearGradient>
      <linearGradient id="cb2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0ca678"/><stop offset="100%" stopColor="#087f5b"/>
      </linearGradient>
      <linearGradient id="cb3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e03131"/><stop offset="100%" stopColor="#c92a2a"/>
      </linearGradient>
      <linearGradient id="cb4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7048e8"/><stop offset="100%" stopColor="#5f3dc4"/>
      </linearGradient>
      <linearGradient id="cb5" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f76707"/><stop offset="100%" stopColor="#e8590c"/>
      </linearGradient>
      <radialGradient id="sceneRefl" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
      </radialGradient>
    </defs>

    {/* Sky / background */}
    <rect x="0" y="0" width="400" height="100" fill="#f0f4ff" rx="12"/>

    {/* Background glow blobs */}
    <ellipse cx="80"  cy="55" rx="60" ry="30" fill="rgba(99,102,241,0.06)"/>
    <ellipse cx="320" cy="50" rx="70" ry="35" fill="rgba(139,92,246,0.05)"/>

    {/* Road surface */}
    <rect x="0" y="98" width="400" height="50" fill="url(#roadSurface)" rx="0"/>

    {/* Road edge highlight */}
    <rect x="0" y="98" width="400" height="3" fill="rgba(255,255,255,0.12)"/>

    {/* Road lane dashes */}
    <rect x="0"   y="122" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="70"  y="122" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="140" y="122" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="210" y="122" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="280" y="122" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="350" y="122" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>

    {/* Road kerb bottom */}
    <rect x="0" y="145" width="400" height="3" fill="rgba(255,255,255,0.08)"/>

    {/* ── SMALL MINI CARS ON ROAD ──
        Each minicar: body rect + cabin path + wheels + lights
        We draw 5 cars at different x positions, slightly different sizes for depth */}

    {/* CAR 1 — blue (largest, front) at x=20 */}
    <g transform="translate(10, 62) scale(0.38)">
      <rect x="12" y="90" width="356" height="58" rx="10" fill="url(#cb1)"/>
      <path d="M68 90 Q76 44 108 36 L264 36 Q296 44 312 90Z" fill="#364fc7"/>
      <path d="M110 38 Q190 29 264 38" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none"/>
      <path d="M110 90 Q115 50 138 40 L246 40 Q270 50 274 90Z" fill="#74c0fc" opacity="0.85"/>
      <path d="M70 88 Q74 60 94 52 L106 52 Q104 70 102 88Z" fill="#74c0fc" opacity="0.7"/>
      <path d="M278 88 Q280 70 280 52 L294 52 Q312 60 314 88Z" fill="#74c0fc" opacity="0.7"/>
      <rect x="14" y="140" width="68" height="12" rx="5" fill="#1e2f7a"/>
      <rect x="298" y="140" width="68" height="12" rx="5" fill="#1e2f7a"/>
      <ellipse cx="48" cy="114" rx="20" ry="8" fill="rgba(255,255,210,0.9)"/>
      <ellipse cx="48" cy="114" rx="10" ry="4" fill="white"/>
      <ellipse cx="330" cy="114" rx="20" ry="8" fill="rgba(255,80,80,0.85)"/>
      <ellipse cx="330" cy="114" rx="10" ry="4" fill="rgba(255,110,110,0.9)"/>
      <circle cx="96"  cy="150" r="26" fill="#1e2a5e"/>
      <circle cx="96"  cy="150" r="18" fill="#2a3a7a"/>
      <circle cx="96"  cy="150" r="10" fill="#1e2a5e"/>
      <circle cx="96"  cy="150" r="5"  fill="#6366f1"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={96+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={96+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(99,102,241,0.7)" strokeWidth="3"/>})}
      <circle cx="284" cy="150" r="26" fill="#1e2a5e"/>
      <circle cx="284" cy="150" r="18" fill="#2a3a7a"/>
      <circle cx="284" cy="150" r="10" fill="#1e2a5e"/>
      <circle cx="284" cy="150" r="5"  fill="#6366f1"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={284+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={284+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(99,102,241,0.7)" strokeWidth="3"/>})}
      <rect x="148" y="118" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
      <rect x="216" y="118" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
    </g>

    {/* CAR 2 — green, mirrored (facing left), slightly smaller */}
    <g transform="translate(120, 66) scale(0.33) scale(-1,1) translate(-380,0)">
      <rect x="12" y="90" width="356" height="58" rx="10" fill="url(#cb2)"/>
      <path d="M68 90 Q76 44 108 36 L264 36 Q296 44 312 90Z" fill="#087f5b"/>
      <path d="M110 90 Q115 50 138 40 L246 40 Q270 50 274 90Z" fill="#74c0fc" opacity="0.75"/>
      <path d="M70 88 Q74 60 94 52 L106 52 Q104 70 102 88Z" fill="#74c0fc" opacity="0.6"/>
      <path d="M278 88 Q280 70 280 52 L294 52 Q312 60 314 88Z" fill="#74c0fc" opacity="0.6"/>
      <rect x="14" y="140" width="68" height="12" rx="5" fill="#054f35"/>
      <rect x="298" y="140" width="68" height="12" rx="5" fill="#054f35"/>
      <ellipse cx="48" cy="114" rx="20" ry="8" fill="rgba(255,255,210,0.9)"/>
      <ellipse cx="48" cy="114" rx="10" ry="4" fill="white"/>
      <ellipse cx="330" cy="114" rx="20" ry="8" fill="rgba(255,80,80,0.85)"/>
      <circle cx="96"  cy="150" r="26" fill="#1e3a2e"/>
      <circle cx="96"  cy="150" r="18" fill="#2a4a3a"/>
      <circle cx="96"  cy="150" r="10" fill="#1e3a2e"/>
      <circle cx="96"  cy="150" r="5"  fill="#0ca678"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={96+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={96+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(12,166,120,0.7)" strokeWidth="3"/>})}
      <circle cx="284" cy="150" r="26" fill="#1e3a2e"/>
      <circle cx="284" cy="150" r="18" fill="#2a4a3a"/>
      <circle cx="284" cy="150" r="10" fill="#1e3a2e"/>
      <circle cx="284" cy="150" r="5"  fill="#0ca678"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={284+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={284+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(12,166,120,0.7)" strokeWidth="3"/>})}
    </g>

    {/* CAR 3 — red (medium) */}
    <g transform="translate(198, 68) scale(0.29)">
      <rect x="12" y="90" width="356" height="58" rx="10" fill="url(#cb3)"/>
      <path d="M68 90 Q76 44 108 36 L264 36 Q296 44 312 90Z" fill="#c92a2a"/>
      <path d="M110 90 Q115 50 138 40 L246 40 Q270 50 274 90Z" fill="#74c0fc" opacity="0.75"/>
      <path d="M70 88 Q74 60 94 52 L106 52 Q104 70 102 88Z" fill="#74c0fc" opacity="0.6"/>
      <path d="M278 88 Q280 70 280 52 L294 52 Q312 60 314 88Z" fill="#74c0fc" opacity="0.6"/>
      <rect x="14" y="140" width="68" height="12" rx="5" fill="#7b1a1a"/>
      <rect x="298" y="140" width="68" height="12" rx="5" fill="#7b1a1a"/>
      <ellipse cx="48" cy="114" rx="20" ry="8" fill="rgba(255,255,210,0.9)"/>
      <ellipse cx="48" cy="114" rx="10" ry="4" fill="white"/>
      <ellipse cx="330" cy="114" rx="20" ry="8" fill="rgba(255,80,80,0.85)"/>
      <circle cx="96"  cy="150" r="26" fill="#3b0a0a"/>
      <circle cx="96"  cy="150" r="18" fill="#5c1a1a"/>
      <circle cx="96"  cy="150" r="10" fill="#3b0a0a"/>
      <circle cx="96"  cy="150" r="5"  fill="#e03131"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={96+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={96+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(224,49,49,0.7)" strokeWidth="3"/>})}
      <circle cx="284" cy="150" r="26" fill="#3b0a0a"/>
      <circle cx="284" cy="150" r="18" fill="#5c1a1a"/>
      <circle cx="284" cy="150" r="10" fill="#3b0a0a"/>
      <circle cx="284" cy="150" r="5"  fill="#e03131"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={284+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={284+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(224,49,49,0.7)" strokeWidth="3"/>})}
    </g>

    {/* CAR 4 — purple, mirrored */}
    <g transform="translate(274, 70) scale(0.26) scale(-1,1) translate(-380,0)">
      <rect x="12" y="90" width="356" height="58" rx="10" fill="url(#cb4)"/>
      <path d="M68 90 Q76 44 108 36 L264 36 Q296 44 312 90Z" fill="#5f3dc4"/>
      <path d="M110 90 Q115 50 138 40 L246 40 Q270 50 274 90Z" fill="#74c0fc" opacity="0.75"/>
      <path d="M70 88 Q74 60 94 52 L106 52 Q104 70 102 88Z" fill="#74c0fc" opacity="0.6"/>
      <rect x="14" y="140" width="68" height="12" rx="5" fill="#3b1f8c"/>
      <rect x="298" y="140" width="68" height="12" rx="5" fill="#3b1f8c"/>
      <ellipse cx="48" cy="114" rx="20" ry="8" fill="rgba(255,255,210,0.9)"/>
      <ellipse cx="330" cy="114" rx="20" ry="8" fill="rgba(255,80,80,0.85)"/>
      <circle cx="96"  cy="150" r="26" fill="#1e0a4e"/>
      <circle cx="96"  cy="150" r="18" fill="#2a1a6a"/>
      <circle cx="96"  cy="150" r="10" fill="#1e0a4e"/>
      <circle cx="96"  cy="150" r="5"  fill="#7048e8"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={96+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={96+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(112,72,232,0.7)" strokeWidth="3"/>})}
      <circle cx="284" cy="150" r="26" fill="#1e0a4e"/>
      <circle cx="284" cy="150" r="18" fill="#2a1a6a"/>
      <circle cx="284" cy="150" r="10" fill="#1e0a4e"/>
      <circle cx="284" cy="150" r="5"  fill="#7048e8"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={284+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={284+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(112,72,232,0.7)" strokeWidth="3"/>})}
    </g>

    {/* CAR 5 — orange (smallest/farthest) */}
    <g transform="translate(342, 72) scale(0.22)">
      <rect x="12" y="90" width="356" height="58" rx="10" fill="url(#cb5)"/>
      <path d="M68 90 Q76 44 108 36 L264 36 Q296 44 312 90Z" fill="#e8590c"/>
      <path d="M110 90 Q115 50 138 40 L246 40 Q270 50 274 90Z" fill="#74c0fc" opacity="0.7"/>
      <rect x="14" y="140" width="68" height="12" rx="5" fill="#7c2d12"/>
      <rect x="298" y="140" width="68" height="12" rx="5" fill="#7c2d12"/>
      <ellipse cx="48" cy="114" rx="18" ry="7" fill="rgba(255,255,210,0.9)"/>
      <ellipse cx="330" cy="114" rx="18" ry="7" fill="rgba(255,80,80,0.85)"/>
      <circle cx="96"  cy="150" r="26" fill="#3b1500"/>
      <circle cx="96"  cy="150" r="18" fill="#5c2a00"/>
      <circle cx="96"  cy="150" r="10" fill="#3b1500"/>
      <circle cx="96"  cy="150" r="5"  fill="#f76707"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={96+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={96+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(247,103,7,0.7)" strokeWidth="3"/>})}
      <circle cx="284" cy="150" r="26" fill="#3b1500"/>
      <circle cx="284" cy="150" r="18" fill="#5c2a00"/>
      <circle cx="284" cy="150" r="10" fill="#3b1500"/>
      <circle cx="284" cy="150" r="5"  fill="#f76707"/>
      {[0,72,144,216,288].map(a=>{const r=a*Math.PI/180;return<line key={a} x1={284+6*Math.cos(r)} y1={150+6*Math.sin(r)} x2={284+16*Math.cos(r)} y2={150+16*Math.sin(r)} stroke="rgba(247,103,7,0.7)" strokeWidth="3"/>})}
    </g>

    {/* Ground shadow reflections per car */}
    <ellipse cx="57"  cy="153" rx="38" ry="5" fill="rgba(99,102,241,0.12)"/>
    <ellipse cx="170" cy="155" rx="33" ry="4" fill="rgba(12,166,120,0.1)"/>
    <ellipse cx="252" cy="156" rx="28" ry="3.5" fill="rgba(224,49,49,0.1)"/>
    <ellipse cx="325" cy="157" rx="24" ry="3" fill="rgba(112,72,232,0.1)"/>
    <ellipse cx="388" cy="158" rx="20" ry="2.5" fill="rgba(247,103,7,0.09)"/>

  </svg>
);

const Home = () => (
  <>
    <style>{`
      @keyframes floatCar {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }
      @keyframes shadowPulse {
        0%, 100% { transform: scaleX(1);    opacity: 0.5; }
        50%       { transform: scaleX(0.85); opacity: 0.25; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes roadScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .car-float          { animation: floatCar 3.5s ease-in-out infinite; }
      .car-float-delayed  { animation: floatCar 3.5s ease-in-out infinite; animation-delay: -2.5s; }
      .car-shadow-pulse   { animation: shadowPulse 3.5s ease-in-out infinite; }
      .car-shadow-pulse-d { animation: shadowPulse 3.5s ease-in-out infinite; animation-delay: -2.5s; }

      .fade-up-0 { animation: fadeUp 0.6s ease both; animation-delay: 0s; }
      .fade-up-1 { animation: fadeUp 0.6s ease both; animation-delay: 0.1s; }
      .fade-up-2 { animation: fadeUp 0.6s ease both; animation-delay: 0.2s; }
      .fade-up-3 { animation: fadeUp 0.6s ease both; animation-delay: 0.35s; }
      .fade-up-4 { animation: fadeUp 0.6s ease both; animation-delay: 0.5s; }

      .btn-login {
        display: block; width: 100%;
        padding: 14px 24px; border-radius: 10px;
        background: #6366f1; color: white;
        font-weight: 700; font-size: 15px;
        text-align: center; text-decoration: none; border: none; cursor: pointer;
        transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        box-shadow: 0 4px 18px rgba(99,102,241,0.35);
        font-family: inherit;
      }
      .btn-login:hover { background: #4f46e5; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }

      .btn-ghost-home {
        display: block; width: 100%;
        padding: 13px 24px; border-radius: 10px;
        background: transparent; border: 1.5px solid rgba(99,102,241,0.35);
        color: #4338ca; font-weight: 600; font-size: 15px;
        text-align: center; text-decoration: none;
        transition: background 0.2s, border-color 0.2s, transform 0.15s;
        font-family: inherit;
      }
      .btn-ghost-home:hover { background: rgba(99,102,241,0.07); border-color: rgba(99,102,241,0.55); transform: translateY(-1px); }

      /* Desktop: side cars */
      .car-right {
        display: block;
        position: absolute;
        right: -20px; top: 50%; margin-top: -110px;
        width: 420px; height: 200px; z-index: 1;
      }
      .car-left {
        display: block;
        position: absolute;
        left: -50px; top: 50%; margin-top: 30px;
        width: 260px; height: 120px;
        transform: scaleX(-1); z-index: 1;
      }

      /* Mobile: hide desktop side cars, show road scene */
      .mobile-road { display: none; }

      @media (max-width: 700px) {
        .car-right  { display: none !important; }
        .car-left   { display: none !important; }
        .mobile-road { display: block !important; }
        .stat-row-home { flex-direction: column; border-radius: 8px; }
        .stat-cell-home { border-right: none; border-bottom: 1px solid rgba(99,102,241,0.1); padding: 12px 8px; }
        .stat-cell-home:last-child { border-bottom: none; }
      }

      .stat-row-home {
        display: flex; gap: 0;
        border: 1px solid rgba(99,102,241,0.15);
        border-radius: 12px; overflow: hidden; margin-bottom: 20px;
      }
      .stat-cell-home {
        flex: 1; padding: 14px 8px; text-align: center;
        border-right: 1px solid rgba(99,102,241,0.1);
        background: rgba(99,102,241,0.03);
      }
      .stat-cell-home:last-child { border-right: none; }
      .stat-lbl-home {
        font-size: 11px; color: #64748b;
        text-transform: uppercase; letter-spacing: 0.08em;
        font-weight: 600; line-height: 1.3;
      }
    `}</style>

    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(32px, 5vh) 16px 72px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background tints */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 15% 50%, rgba(99,102,241,0.06) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 85% 40%, rgba(139,92,246,0.05) 0%, transparent 60%)',
      }}/>

      {/* ── DESKTOP RIGHT CAR ── */}
      <div className="car-right">
        <div className="car-float" style={{
          width: '100%', height: '100%',
          transform: 'perspective(900px) rotateY(-16deg) rotateX(5deg)',
          transformStyle: 'preserve-3d', opacity: 0.9,
        }}>
          <CarSVG />
        </div>
        <div className="car-shadow-pulse" style={{
          position: 'absolute', bottom: '-4px', left: '10%',
          width: '80%', height: '14px', borderRadius: '50%',
          background: 'rgba(99,102,241,0.18)', filter: 'blur(6px)',
        }}/>
      </div>

      {/* ── DESKTOP LEFT CAR ── */}
      <div className="car-left">
        <div className="car-float-delayed" style={{
          width: '100%', height: '100%',
          transform: 'perspective(700px) rotateY(-14deg) rotateX(4deg)',
          transformStyle: 'preserve-3d', opacity: 0.45,
        }}>
          <CarSVG />
        </div>
        <div className="car-shadow-pulse-d" style={{
          position: 'absolute', bottom: '-3px', left: '10%',
          width: '80%', height: '10px', borderRadius: '50%',
          background: 'rgba(99,102,241,0.12)', filter: 'blur(5px)',
        }}/>
      </div>

      {/* ── HERO CONTENT ── */}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: '460px', width: '100%', textAlign: 'center',
      }}>

        {/* ── MOBILE ROAD SCENE ── */}
        <div className="mobile-road fade-up-0" style={{
          marginBottom: '16px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.12)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        }}>
          <MobileRoadScene />
        </div>

        {/* Chip */}
        <div className="fade-up-0" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '11px', fontWeight: 700, color: '#6366f1',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}/>
            India's carpooling network
          </span>
        </div>

        {/* Logo */}
        <h1 className="fade-up-1" style={{
          fontSize: 'clamp(1.5rem, 6vw, 3rem)',
          letterSpacing: '-0.04em', lineHeight: 1,
          marginBottom: '12px', color: '#1e1b4b',
        }}>
          Cab<span style={{ color: '#6366f1' }}>Share</span>
        </h1>

        {/* Tagline */}
        <p className="fade-up-2" style={{
          fontSize: 'clamp(12px, 2.2vw, 15px)', color: '#64748b',
          lineHeight: 1.65, marginBottom: '24px',
        }}>
          Carpooling made simple.{' '}
          <strong style={{ color: '#1e1b4b', fontWeight: 600 }}>Split the fare,</strong>{' '}
          reduce traffic.
        </p>

        {/* Stats */}
        <div className="stat-row-home fade-up-2">
          {['Travel smarter', 'Split costs', 'New people. New stories.'].map(lbl => (
            <div key={lbl} className="stat-cell-home">
              <div className="stat-lbl-home">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="/login"  className="btn-login">Login</a>
          <a href="/signup" className="btn-ghost-home">Get started</a>
        </div>

        {/* Fine print */}
        <p className="fade-up-4" style={{
          fontSize: '11px', color: '#94a3b8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '20px',
        }}>
          No surge pricing · No hidden fees · Real people
        </p>
      </div>
    </div>
  </>
);

export default Home;