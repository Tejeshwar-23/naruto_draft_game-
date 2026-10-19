import './PixelBackground.css';

export default function PixelBackground() {
  return (
    <div className="pixel-bg-wrapper" aria-hidden="true">
      {/* 16-bit / 32-bit Pixel Art Canvas: Sasuke (Left) vs Naruto (Right) */}
      <svg
        className="pixel-bg-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Deep Night Sky Gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030407" />
            <stop offset="40%" stopColor="#080a12" />
            <stop offset="68%" stopColor="#140a12" />
            <stop offset="85%" stopColor="#1a0e08" />
            <stop offset="100%" stopColor="#07080e" />
          </linearGradient>

          {/* Chidori Lightning Radial Glow */}
          <radialGradient id="chidoriGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#0284c7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          {/* Rasengan Chakra Radial Glow */}
          <radialGradient id="rasenganGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#7dd3fc" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          {/* Mountain & Horizon Ridge Haze */}
          <linearGradient id="mountainHaze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a121e" />
            <stop offset="100%" stopColor="#07090f" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. SKY & DISTANT CELESTIAL BACKGROUND
            ======================================================== */}
        <rect width="1920" height="1080" fill="url(#skyGrad)" />

        {/* Pixel Stars */}
        <g fill="#e2e8f0" opacity="0.45">
          <rect x="90" y="70" width="3" height="3" />
          <rect x="220" y="140" width="4" height="4" />
          <rect x="360" y="60" width="3" height="3" />
          <rect x="520" y="130" width="4" height="4" />
          <rect x="710" y="80" width="3" height="3" />
          <rect x="880" y="50" width="4" height="4" />
          <rect x="1050" y="90" width="3" height="3" />
          <rect x="1220" y="60" width="4" height="4" />
          <rect x="1390" y="120" width="3" height="3" />
          <rect x="1560" y="70" width="4" height="4" />
          <rect x="1740" y="110" width="3" height="3" />
          <rect x="1860" y="160" width="4" height="4" />
          <rect x="440" y="210" width="3" height="3" />
          <rect x="820" y="190" width="3" height="3" />
          <rect x="1140" y="170" width="4" height="4" />
          <rect x="1640" y="220" width="3" height="3" />
        </g>

        {/* Crescent Pixel Moon in Center-Upper Sky */}
        <g transform="translate(930, 90)">
          <rect x="-10" y="-10" width="42" height="42" fill="#fef08a" opacity="0.08" />
          <rect x="6" y="0" width="8" height="4" fill="#fef9c3" opacity="0.8" />
          <rect x="3" y="4" width="8" height="4" fill="#fef9c3" opacity="0.9" />
          <rect x="0" y="8" width="8" height="8" fill="#fef9c3" opacity="0.9" />
          <rect x="0" y="16" width="8" height="8" fill="#fef9c3" opacity="0.9" />
          <rect x="3" y="24" width="8" height="4" fill="#fef9c3" opacity="0.9" />
          <rect x="6" y="28" width="8" height="4" fill="#fef9c3" opacity="0.8" />
          <rect x="6" y="4" width="6" height="4" fill="#060810" />
          <rect x="3" y="8" width="6" height="16" fill="#060810" />
          <rect x="6" y="24" width="6" height="4" fill="#060810" />
        </g>

        {/* Distant Stepped Pixel Clouds */}
        <g className="pixel-cloud-group" opacity="0.32">
          <g fill="#171322">
            <rect x="80" y="190" width="220" height="12" />
            <rect x="120" y="178" width="140" height="12" />
            <rect x="70" y="202" width="260" height="8" />
            <rect x="130" y="210" width="160" height="3" fill="#38bdf8" opacity="0.3" />
          </g>
          <g fill="#1a1525">
            <rect x="740" y="230" width="300" height="14" />
            <rect x="790" y="216" width="200" height="14" />
            <rect x="720" y="244" width="340" height="8" />
            <rect x="780" y="252" width="220" height="4" fill="#ea580c" opacity="0.3" />
          </g>
          <g fill="#161220">
            <rect x="1420" y="180" width="240" height="12" />
            <rect x="1460" y="168" width="150" height="12" />
            <rect x="1400" y="192" width="280" height="8" />
            <rect x="1450" y="200" width="180" height="3" fill="#38bdf8" opacity="0.3" />
          </g>
        </g>

        {/* ========================================================
            2. DISTANT HOKAGE MOUNTAIN & VALLEY ENVIRONMENT
            ======================================================== */}
        {/* Distant Mountain Ridge */}
        <path
          d="
            M 0 520
            L 140 450 L 220 450 L 320 400 L 460 400 L 560 440 L 700 440
            L 800 390 L 960 390 L 1080 430 L 1220 430 L 1340 390 L 1480 390
            L 1600 440 L 1740 440 L 1920 480 L 1920 1080 L 0 1080 Z
          "
          fill="url(#mountainHaze)"
          opacity="0.88"
        />

        {/* Hokage Rock Carved Faces Silhouette in Mountain (Center-Midground) */}
        <g fill="#101420" opacity="0.8">
          {/* Base cliff face */}
          <path
            d="
              M 300 530 L 440 470 L 600 470 L 720 520 L 900 520 L 1040 470
              L 1200 470 L 1320 520 L 1600 520 L 1920 550 L 1920 1080 L 300 1080 Z
            "
          />
          {/* Hokage 1 (Hashirama) */}
          <g fill="#161b2a">
            <rect x="640" y="480" width="26" height="34" />
            <rect x="636" y="488" width="34" height="18" />
            <rect x="642" y="494" width="5" height="3" fill="#090c13" />
            <rect x="655" y="494" width="5" height="3" fill="#090c13" />
          </g>
          {/* Hokage 2 (Tobirama) */}
          <g fill="#181e2e">
            <rect x="730" y="474" width="32" height="36" />
            <rect x="736" y="510" width="20" height="8" />
            <rect x="734" y="488" width="5" height="3" fill="#090c13" />
            <rect x="749" y="488" width="5" height="3" fill="#090c13" />
          </g>
          {/* Hokage 3 (Hiruzen) */}
          <g fill="#161b2a">
            <rect x="830" y="482" width="28" height="30" />
            <rect x="838" y="512" width="12" height="10" />
            <rect x="834" y="492" width="5" height="3" fill="#090c13" />
            <rect x="847" y="492" width="5" height="3" fill="#090c13" />
          </g>
          {/* Hokage 4 (Minato) */}
          <g fill="#181e2e">
            <rect x="920" y="470" width="36" height="38" />
            <rect x="916" y="478" width="44" height="22" />
            <rect x="924" y="490" width="5" height="3" fill="#090c13" />
            <rect x="941" y="490" width="5" height="3" fill="#090c13" />
          </g>
        </g>

        {/* Lower Konoha Village Silhouette (Framing bottom) */}
        <g fill="#07090e" opacity="0.95">
          <polygon points="0,860 120,810 240,860 240,1080 0,1080" />
          <polygon points="180,880 320,820 460,880 460,1080 180,1080" />
          <polygon points="420,930 560,880 700,930 700,1080 420,1080" />
          <polygon points="680,940 820,890 960,940 960,1080 680,1080" />
          <polygon points="940,935 1080,885 1220,935 1220,1080 940,1080" />
          <polygon points="1200,910 1340,855 1480,910 1480,1080 1200,1080" />
          <polygon points="1440,860 1600,800 1760,860 1760,1080 1440,1080" />
          <polygon points="1720,840 1840,790 1920,830 1920,1080 1720,1080" />

          {/* Faint warm pixel windows */}
          <rect x="230" y="870" width="10" height="12" fill="#f59e0b" opacity="0.25" />
          <rect x="490" y="930" width="12" height="12" fill="#ea580c" opacity="0.2" />
          <rect x="740" y="945" width="10" height="12" fill="#f59e0b" opacity="0.2" />
          <rect x="1150" y="940" width="12" height="12" fill="#f59e0b" opacity="0.2" />
          <rect x="1520" y="870" width="10" height="12" fill="#ea580c" opacity="0.25" />
        </g>

        {/* ========================================================
            3. SASUKE UCHIHA (LEFT SIDE: X: 40 - 520, Y: 280 - 1080)
               Facing Right toward Center / Naruto
            ======================================================== */}
        <g className="pixel-bg-sasuke" transform="translate(60, 260)">
          {/* Subtle Ambient Purple / Blue Rim Aura */}
          <ellipse cx="260" cy="500" rx="220" ry="340" fill="#7e22ce" opacity="0.1" filter="blur(25px)" />

          {/* A. SPIKY BLACK JET HAIR (Stepped 16-bit pixel clusters) */}
          {/* Hair Darkest Under-Shadow */}
          <g fill="#07090e">
            {/* Back spikes flaring left */}
            <polygon points="160,80 100,30 130,95" />
            <polygon points="135,70 70,35 110,110" />
            <polygon points="105,100 40,85 90,140" />
            <polygon points="85,130 20,135 75,175" />
            <polygon points="70,165 15,190 70,215" />
            {/* Top crown spikes */}
            <polygon points="190,70 170,15 220,65" />
            <polygon points="225,55 235,5 260,60" />
            <polygon points="265,50 300,10 305,65" />
            {/* Main mass */}
            <rect x="80" y="55" width="240" height="160" />
          </g>

          {/* Hair Midtone Navy / Indigo */}
          <g fill="#1e1b4b">
            <polygon points="165,82 110,38 135,95" />
            <polygon points="140,75 80,42 115,110" />
            <polygon points="110,105 50,92 95,140" />
            <polygon points="90,135 30,140 80,175" />
            <polygon points="192,72 175,22 215,68" />
            <polygon points="228,58 238,12 258,62" />
            <polygon points="268,54 298,18 302,68" />
            {/* Inner fill */}
            <rect x="95" y="65" width="220" height="145" />
          </g>

          {/* Hair Blue/Indigo Highlights */}
          <g fill="#312e81">
            <polygon points="170,84 125,45 140,95" />
            <polygon points="145,78 95,50 120,110" />
            <polygon points="195,75 180,30 210,70" />
            <polygon points="230,60 240,20 255,65" />
            <rect x="120" y="75" width="160" height="65" />
            <rect x="140" y="65" width="120" height="25" fill="#4338ca" />
          </g>

          {/* Signature Long Side Bangs Framing Face (Facing Right) */}
          <g fill="#1e1b4b">
            {/* Left side bang */}
            <polygon points="175,160 170,250 195,220" />
            {/* Right side front bang hanging over face */}
            <polygon points="275,140 310,240 285,170" />
            <polygon points="290,150 330,225 305,170" />
          </g>

          {/* B. FACE & INTENSE SHINOBI GAZE (FACING RIGHT) */}
          {/* Pale Skin Shadow Tone */}
          <g fill="#94a3b8">
            <polygon points="180,170 305,170 290,270 230,295 185,260" />
          </g>
          {/* Skin Midtone */}
          <g fill="#cbd5e1">
            <polygon points="185,170 300,170 285,262 230,288 190,252" />
          </g>
          {/* Skin Highlight */}
          <g fill="#f1f5f9">
            <polygon points="195,170 292,170 275,250 230,275 200,242" />
          </g>

          {/* Sasuke Eyes: Intense Focus toward Right */}
          <g fill="#09090b">
            <rect x="235,200" width="24" height="6" transform="rotate(-6 235 200)" />
            <rect x="270,196" width="24" height="6" transform="rotate(-4 270 196)" />
            {/* Sharingan / Dark Eye pupil */}
            <rect x="246" y="206" width="10" height="8" fill="#dc2626" />
            <rect x="249" y="208" width="4" height="4" fill="#000000" />
            <rect x="278" y="204" width="10" height="8" fill="#dc2626" />
            <rect x="281" y="206" width="4" height="4" fill="#000000" />
          </g>

          {/* C. SHIPPUDEN SHIRT & UCHIHA CREST */}
          {/* High Folded Collar (Grey-Lavender) */}
          <g fill="#475569">
            <polygon points="170,275 320,275 345,350 150,350" />
            <polygon points="180,280 310,280 335,345 160,345" fill="#64748b" />
            {/* Inner open collar shadow */}
            <polygon points="220,280 270,280 260,335 230,335" fill="#1e293b" />
          </g>

          {/* Grey / Lavender-Blue Shirt Body */}
          <g fill="#475569">
            <path d="M 120 350 L 360 350 L 390 530 L 110 530 Z" />
          </g>
          <g fill="#64748b">
            <path d="M 135 360 L 345 360 L 375 520 L 125 520 Z" />
          </g>
          <g fill="#94a3b8" opacity="0.65">
            <rect x="150" y="370" width="80" height="130" />
          </g>

          {/* Uchiha Fan Crest (Back / Shoulder Motif) */}
          <g transform="translate(160, 390)">
            {/* White upper fan */}
            <path d="M 10 30 Q 30 5 50 30 Z" fill="#f8fafc" />
            {/* Red lower fan */}
            <path d="M 10 30 Q 30 55 50 30 Z" fill="#dc2626" />
            {/* Fan handle */}
            <rect x="28" y="30" width="4" height="18" fill="#f8fafc" />
          </g>

          {/* D. PURPLE SHIMENAWA ROPE BELT & APRON */}
          {/* Dark Navy / Indigo Lower Cloth Wrap */}
          <g fill="#1e1b4b">
            <path d="M 90 530 L 380 530 L 410 810 L 70 810 Z" />
          </g>
          <g fill="#2e1065" opacity="0.75">
            <path d="M 110 540 L 360 540 L 385 800 L 90 800 Z" />
          </g>

          {/* Thick Braided Purple Rope Belt (Shimenawa) with Stepped Coils */}
          <g fill="#581c87">
            <rect x="90" y="525" width="295" height="42" rx="6" />
          </g>
          <g fill="#7e22ce">
            {/* Rope braid coils */}
            <ellipse cx="120" cy="546" rx="20" ry="16" />
            <ellipse cx="160" cy="546" rx="20" ry="16" />
            <ellipse cx="200" cy="546" rx="20" ry="16" />
            <ellipse cx="240" cy="546" rx="20" ry="16" />
            <ellipse cx="280" cy="546" rx="20" ry="16" />
            <ellipse cx="320" cy="546" rx="20" ry="16" />
            <ellipse cx="360" cy="546" rx="20" ry="16" />
          </g>
          <g fill="#a855f7">
            {/* Rope braid highlights */}
            <ellipse cx="120" cy="542" rx="14" ry="10" />
            <ellipse cx="160" cy="542" rx="14" ry="10" />
            <ellipse cx="200" cy="542" rx="14" ry="10" />
            <ellipse cx="240" cy="542" rx="14" ry="10" />
            <ellipse cx="280" cy="542" rx="14" ry="10" />
            <ellipse cx="320" cy="542" rx="14" ry="10" />
            <ellipse cx="360" cy="542" rx="14" ry="10" />
          </g>
          {/* Hanging Rope Tassels Knot */}
          <g fill="#7e22ce" transform="translate(230, 560)">
            <rect x="0" y="0" width="16" height="85" rx="4" transform="rotate(8 0 0)" />
            <rect x="18" y="0" width="16" height="95" rx="4" transform="rotate(-8 18 0)" />
            <rect x="2" y="2" width="12" height="80" rx="3" fill="#a855f7" transform="rotate(8 0 0)" />
            <rect x="20" y="2" width="12" height="90" rx="3" fill="#a855f7" transform="rotate(-8 18 0)" />
          </g>

          {/* Kusanagi Sword Sheath tucked through rope */}
          <g transform="translate(130, 520) rotate(-18)">
            <rect x="-80" y="0" width="180" height="12" fill="#0f172a" rx="2" />
            <rect x="-80" y="2" width="180" height="3" fill="#334155" />
            <rect x="90" y="-1" width="12" height="14" fill="#cbd5e1" /> {/* Sword hilt collar */}
          </g>

          {/* Dark Shinobi Pants & Boots */}
          <g fill="#09090b">
            <path d="M 120 780 L 220 780 L 210 820 L 100 820 Z" />
            <path d="M 260 780 L 360 780 L 370 820 L 270 820 Z" />
          </g>

          {/* E. SASUKE'S RIGHT ARM CHARGING CHIDORI */}
          {/* Arm extending forward toward center right */}
          <g fill="#475569">
            <polygon points="340,370 410,430 370,480 310,410" />
          </g>
          {/* Dark Forearm Warmer / Wrist Wrap */}
          <g fill="#0f172a">
            <polygon points="390,420 440,470 415,510 365,460" />
          </g>
          {/* Hand / Fist clenching Chidori */}
          <g fill="#cbd5e1">
            <polygon points="425,465 455,490 435,520 405,495" />
          </g>

          {/* F. CHIDORI (BRIGHT ELECTRIC BLUE LIGHTNING SPHERE) */}
          {/* Center of Chidori at (X: 435, Y: 495) relative to Sasuke group */}
          <g transform="translate(435, 495)">
            {/* Glowing Aura */}
            <circle cx="0" cy="0" r="95" fill="url(#chidoriGlow)" className="chidori-aura" />

            {/* Jagged Pixelated Lightning Bolts Branching Outward */}
            <g className="chidori-bolts">
              {/* Lightning Bolt 1 (Top Left) */}
              <polyline
                points="0,0 -16,-24 -10,-42 -28,-65 -22,-85 -42,-110"
                stroke="#ffffff"
                strokeWidth="4"
                fill="none"
              />
              <polyline
                points="0,0 -16,-24 -10,-42 -28,-65 -22,-85 -42,-110"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeOpacity="0.6"
                fill="none"
              />

              {/* Lightning Bolt 2 (Toward Center/Naruto) */}
              <polyline
                points="0,0 28,-14 22,-36 52,-48 46,-74 80,-85"
                stroke="#ffffff"
                strokeWidth="4"
                fill="none"
              />
              <polyline
                points="0,0 28,-14 22,-36 52,-48 46,-74 80,-85"
                stroke="#0ea5e9"
                strokeWidth="8"
                strokeOpacity="0.6"
                fill="none"
              />

              {/* Lightning Bolt 3 (Downward Flare) */}
              <polyline
                points="0,0 12,28 -8,46 16,72 -2,95 24,120"
                stroke="#ffffff"
                strokeWidth="4"
                fill="none"
              />
              <polyline
                points="0,0 12,28 -8,46 16,72 -2,95 24,120"
                stroke="#38bdf8"
                strokeWidth="7"
                strokeOpacity="0.6"
                fill="none"
              />

              {/* Lightning Bolt 4 (Rear Crackle) */}
              <polyline
                points="0,0 -32,10 -24,32 -54,42 -44,68 -72,82"
                stroke="#ffffff"
                strokeWidth="3"
                fill="none"
              />
              <polyline
                points="0,0 -32,10 -24,32 -54,42 -44,68 -72,82"
                stroke="#0284c7"
                strokeWidth="6"
                strokeOpacity="0.6"
                fill="none"
              />

              {/* Secondary Branch Bolts */}
              <polyline points="-10,-42 12,-55 24,-78" stroke="#e0f2fe" strokeWidth="2.5" fill="none" />
              <polyline points="22,-36 34,-18 58,-24" stroke="#e0f2fe" strokeWidth="2.5" fill="none" />
              <polyline points="-8,46 -30,58 -42,80" stroke="#e0f2fe" strokeWidth="2.5" fill="none" />
            </g>

            {/* Chidori Electric Sparks */}
            <g className="chidori-sparks" fill="#38bdf8">
              <rect x="-55" y="-30" width="5" height="5" />
              <rect x="45" y="-55" width="6" height="6" />
              <rect x="65" y="30" width="5" height="5" />
              <rect x="-35" y="60" width="6" height="6" />
              <rect x="30" y="70" width="5" height="5" />
              <rect x="-60" y="20" width="4" height="4" fill="#ffffff" />
              <rect x="50" y="-15" width="4" height="4" fill="#ffffff" />
            </g>

            {/* Brilliant White-Hot Lightning Core */}
            <polygon
              points="0,-22 14,-8 25,0 12,14 0,26 -12,12 -24,0 -10,-12"
              fill="#ffffff"
            />
            <circle cx="0" cy="0" r="16" fill="#ffffff" />
          </g>
        </g>

        {/* ========================================================
            4. NARUTO UZUMAKI (RIGHT SIDE: X: 1400 - 1880, Y: 280 - 1080)
               Facing Left toward Center / Sasuke
            ======================================================== */}
        <g className="pixel-bg-naruto" transform="translate(1380, 260)">
          {/* Subtle Ambient Orange Rim Aura */}
          <ellipse cx="230" cy="500" rx="220" ry="340" fill="#ea580c" opacity="0.1" filter="blur(25px)" />

          {/* A. SPIKY BLOND NINJA HAIR (Stepped 16-bit pixel clusters) */}
          {/* Hair Under-Shadow Layer */}
          <g fill="#78350f">
            {/* Top spiky crowns */}
            <polygon points="180,60 210,0 235,65" />
            <polygon points="225,50 265,10 280,65" />
            <polygon points="270,55 315,25 325,75" />
            <polygon points="135,75 160,25 185,80" />
            <polygon points="100,105 115,50 145,110" />
            <polygon points="65,145 75,95 115,150" />
            <polygon points="315,70 365,55 360,115" />
            <polygon points="350,105 405,105 385,160" />
            <polygon points="370,150 425,170 380,210" />
            <rect x="100" y="60" width="280" height="150" />
          </g>

          {/* Hair Midtone Golden Yellow */}
          <g fill="#d97706">
            <polygon points="185,62 210,8 230,65" />
            <polygon points="230,52 265,18 276,65" />
            <polygon points="275,58 312,32 320,75" />
            <polygon points="140,78 162,32 180,82" />
            <polygon points="106,108 118,58 140,112" />
            <polygon points="72,148 80,102 112,152" />
            <polygon points="318,74 360,62 355,115" />
            <polygon points="352,110 398,112 380,158" />
            <polygon points="368,154 418,172 376,206" />
            <rect x="110" y="70" width="260" height="135" />
          </g>

          {/* Hair Bright Highlights */}
          <g fill="#facc15">
            <polygon points="190,65 210,18 225,65" />
            <polygon points="235,55 265,26 272,65" />
            <polygon points="280,62 310,40 316,75" />
            <polygon points="146,82 164,42 176,84" />
            <polygon points="112,112 122,68 136,114" />
            <polygon points="322,78 355,70 350,115" />
            <rect x="140" y="80" width="200" height="70" />
            <rect x="160" y="70" width="160" height="30" fill="#fef08a" />
          </g>

          {/* B. FOREHEAD PROTECTOR (KONOHA HEADBAND) */}
          <g fill="#090d16">
            <rect x="100" y="180" width="280" height="52" rx="4" />
            <polygon points="380,195 440,240 410,270 375,225" />
            <polygon points="385,210 455,270 430,300 385,230" />
          </g>

          {/* Metallic Steel Plate */}
          <g transform="translate(160, 186)">
            <rect x="0" y="0" width="160" height="40" rx="3" fill="#1e293b" />
            <rect x="3" y="3" width="154" height="34" rx="2" fill="#64748b" />
            <rect x="5" y="5" width="150" height="14" fill="#94a3b8" />
            <rect x="8" y="7" width="144" height="4" fill="#cbd5e1" />
            {/* Rivets */}
            <rect x="6" y="8" width="5" height="5" fill="#f1f5f9" />
            <rect x="149" y="8" width="5" height="5" fill="#f1f5f9" />
            <rect x="6" y="27" width="5" height="5" fill="#f1f5f9" />
            <rect x="149" y="27" width="5" height="5" fill="#f1f5f9" />
            {/* Engraved Leaf Spiral */}
            <g fill="#090d16">
              <rect x="74" y="16" width="12" height="12" />
              <rect x="78" y="12" width="12" height="6" />
              <rect x="84" y="18" width="6" height="12" />
              <rect x="72" y="24" width="12" height="6" />
              <rect x="68" y="16" width="6" height="10" />
              <polygon points="68,22 56,25 68,28" />
            </g>
          </g>

          {/* C. FACE & WHISKER MARKS (FACING LEFT TOWARD SASUKE) */}
          <g fill="#b45309">
            <polygon points="135,232 345,232 315,340 220,370 160,330" />
          </g>
          <g fill="#d97706">
            <polygon points="142,232 338,232 310,332 220,360 165,322" />
          </g>
          <g fill="#f59e0b">
            <polygon points="155,232 325,232 300,315 220,345 175,308" />
          </g>

          {/* Cheek Whiskers */}
          <g fill="#78350f">
            {/* Left cheek (facing inward) */}
            <rect x="168" y="282" width="28" height="4" transform="rotate(6 168 282)" />
            <rect x="164" y="294" width="32" height="4" />
            <rect x="166" y="306" width="28" height="4" transform="rotate(-6 166 306)" />
            {/* Right cheek */}
            <rect x="250" y="282" width="28" height="4" transform="rotate(-6 250 282)" />
            <rect x="252" y="294" width="32" height="4" />
            <rect x="254" y="306" width="28" height="4" transform="rotate(6 254 306)" />
          </g>

          {/* Determined Blue Eyes focused toward Sasuke */}
          <g fill="#0f172a">
            <rect x="175" y="250" width="30" height="6" transform="rotate(10 175 250)" />
            <rect x="245" y="250" width="30" height="6" transform="rotate(-10 245 250)" />
            <rect x="184" y="258" width="14" height="8" fill="#0284c7" />
            <rect x="187" y="260" width="6" height="6" fill="#0369a1" />
            <rect x="252" y="258" width="14" height="8" fill="#0284c7" />
            <rect x="255" y="260" width="6" height="6" fill="#0369a1" />
          </g>

          {/* D. HIGH COLLAR & SHIPPUDEN TRACK JACKET */}
          <g fill="#090d16">
            <polygon points="130,340 350,340 380,440 100,440" />
            <polygon points="100,345 130,340 140,430 110,435" fill="#e2e8f0" />
            <polygon points="350,340 380,345 370,435 340,430" fill="#e2e8f0" />
          </g>

          {/* Orange & Black Torso */}
          <g fill="#070a12">
            <path d="M 40 450 L 110 410 L 370 410 L 460 450 L 520 810 L 0 810 Z" />
          </g>
          {/* Orange Body Panels */}
          <g fill="#c2410c">
            <path d="M 80 430 L 220 420 L 220 810 L 60 810 Z" />
            <path d="M 260 420 L 400 430 L 420 810 L 260 810 Z" />
          </g>
          <g fill="#ea580c">
            <path d="M 100 440 L 210 430 L 210 800 L 90 800 Z" />
            <path d="M 270 430 L 380 440 L 390 800 L 270 800 Z" />
          </g>
          <g fill="#f97316" opacity="0.65">
            <rect x="120" y="450" width="70" height="260" />
            <rect x="290" y="450" width="70" height="260" />
          </g>

          {/* Uzumaki Red Swirl Crest on Left Shoulder / Back */}
          <g transform="translate(320, 440)">
            <circle cx="20" cy="20" r="18" fill="#dc2626" />
            <circle cx="20" cy="20" r="14" fill="#ea580c" />
            <path d="M 20 10 A 10 10 0 1 0 30 20" fill="none" stroke="#dc2626" strokeWidth="4" />
          </g>

          {/* Black Zipper */}
          <g fill="#090d16">
            <rect x="220" y="420" width="40" height="390" />
            <rect x="238" y="420" width="4" height="390" fill="#94a3b8" />
          </g>

          {/* Orange Pants with White Bandage Wrap */}
          <g fill="#c2410c">
            <path d="M 80 780 L 210 780 L 190 820 L 70 820 Z" />
            <path d="M 270 780 L 400 780 L 410 820 L 280 820 Z" />
          </g>
          {/* White bandage thigh holster */}
          <g fill="#e2e8f0" transform="translate(100, 785)">
            <rect x="0" y="0" width="70" height="8" />
            <rect x="0" y="12" width="70" height="8" />
          </g>

          {/* E. FORWARD ARM CHARGING RASENGAN */}
          <g fill="#090d16">
            <polygon points="80,510 0,550 -20,630 60,630 110,560" />
            <rect x="-10" y="580" width="60" height="8" fill="#e2e8f0" transform="rotate(-15 20 580)" />
            <polygon points="-40,620 -10,610 20,635 10,660 -30,660" fill="#d97706" />
            <rect x="-35" y="610" width="10" height="20" fill="#f59e0b" transform="rotate(-10 -35 610)" />
            <rect x="-22" y="605" width="10" height="24" fill="#f59e0b" />
            <rect x="-8" y="608" width="10" height="22" fill="#f59e0b" transform="rotate(10 -8 608)" />
          </g>

          {/* F. RASENGAN (SWIRLING BLUE CHAKRA SPHERE) */}
          {/* Center of Rasengan at (X: 10, Y: 560) relative to Naruto group (= 1390, 820) */}
          <g transform="translate(10, 560)">
            {/* Outer Aura Halo */}
            <circle cx="0" cy="0" r="85" fill="url(#rasenganGlow)" className="rasengan-orb-glow" />

            {/* Glowing Chakra Particles */}
            <g fill="#38bdf8" opacity="0.8">
              <rect x="-65" y="-12" width="6" height="6" />
              <rect x="58" y="8" width="6" height="6" />
              <rect x="-15" y="-62" width="6" height="6" />
              <rect x="18" y="56" width="6" height="6" />
              <rect x="42" y="-45" width="5" height="5" />
              <rect x="-48" y="40" width="5" height="5" />
            </g>

            {/* Rotating Swirling Chakra Core */}
            <g className="rasengan-core-spin">
              <circle cx="0" cy="0" r="44" fill="none" stroke="#0284c7" strokeWidth="6" strokeDasharray="30 18" />
              <circle cx="0" cy="0" r="32" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="22 14" />
              <circle cx="0" cy="0" r="22" fill="none" stroke="#7dd3fc" strokeWidth="5" strokeDasharray="16 10" />
              <circle cx="0" cy="0" r="14" fill="#ffffff" />
            </g>

            {/* Curved Chakra Wind Trails (Spiraling Outward like reference art) */}
            <g className="rasengan-wind-trails">
              <path
                d="
                  M -35 -35 Q 0 -60 45 -25
                  M 45 25 Q 0 60 -45 25
                  M -50 15 Q -55 -45 10 -50
                  M 50 -15 Q 55 45 -10 50
                  M -65 -10 Q -70 -70 20 -65
                  M 65 10 Q 70 70 -20 65
                "
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="3.5"
                opacity="0.85"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* Layer 1: Dark Transparent Vignette (Ensures Center UI Readability) */}
      <div className="pixel-bg-vignette" />

      {/* Layer 2: Color Composition & Subtle Rim Lighting */}
      <div className="pixel-bg-lighting" />

      {/* Layer 3: Floating Konoha Leaves, Sparks, & Embers */}
      <div className="pixel-particles-container">
        <span className="pixel-leaf blue-spark" />
        <span className="pixel-leaf orange" />
        <span className="pixel-leaf green" />
        <span className="pixel-leaf blue-spark" />
        <span className="pixel-leaf orange" />
        <span className="pixel-leaf green" />
        <span className="pixel-ember" />
        <span className="pixel-ember" />
      </div>
    </div>
  );
}
