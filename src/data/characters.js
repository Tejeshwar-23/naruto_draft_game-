/**
 * Naruto Character Database (Step 3 & Step 5 Update)
 * 30 Initial Naruto & Shippuden Shinobi with unified schema.
 *
 * NOTE ON TRAITOR:
 * Normal roleRatings represent positive role suitability:
 *   captain, attacker, tank, medic, support.
 * Traitor is a LIABILITY SLOT (betrays their team during final battle).
 * traitorRisk (1-10) measures how catastrophic/dangerous the character is if they betray your team.
 */

export const CHARACTERS = [
  {
    id: 'naruto_sage',
    familyId: 'naruto_uzumaki',
    name: 'Naruto Uzumaki',
    version: 'Sage Mode',
    image: '/characters/naruto-uzumaki.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 9,
      speed: 8,
      defense: 8,
      chakra: 10,
      intelligence: 6,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 3
    },
    roleRatings: {
      captain: 8,
      attacker: 10,
      tank: 9,
      medic: 4,
      support: 6
    },
    traits: ['jinchuriki', 'senjutsu', 'uzumaki', 'unpredictable'],
    abilities: ['Wind Style: Rasenshuriken', 'Sage Art: Massive Rasengan Mega Barrage', 'Frog Kata']
  },
  {
    id: 'sasuke_hebi',
    familyId: 'sasuke_uchiha',
    name: 'Sasuke Uchiha',
    version: 'Hebi',
    image: '/characters/sasuke-uchiha.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 8,
      speed: 9,
      defense: 7,
      chakra: 8,
      intelligence: 8,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 8
    },
    roleRatings: {
      captain: 7,
      attacker: 10,
      tank: 6,
      medic: 1,
      support: 7
    },
    traits: ['sharingan', 'curse_mark', 'uchiha', 'swordsman'],
    abilities: ['Chidori Stream', 'Kirin', 'Fire Style: Dragon Fire Jutsu']
  },
  {
    id: 'sakura_shippuden',
    familyId: 'sakura_haruno',
    name: 'Sakura Haruno',
    version: 'Medical Specialist',
    image: '/characters/sakura-haruno.webp',
    auctionValue: 6,
    traitorRisk: 4,
    stats: {
      power: 8,
      speed: 6,
      defense: 7,
      chakra: 7,
      intelligence: 8,
      ninjutsu: 8,
      taijutsu: 8,
      genjutsu: 6
    },
    roleRatings: {
      captain: 5,
      attacker: 7,
      tank: 7,
      medic: 10,
      support: 8
    },
    traits: ['medical_ninjutsu', 'chakra_control', 'monster_strength', 'slug_summoner'],
    abilities: ['Cherry Blossom Clash', 'Chakra Enhanced Strength', 'Cellular Extraction Technique']
  },
  {
    id: 'kakashi_hatake',
    familyId: 'kakashi_hatake',
    name: 'Kakashi Hatake',
    version: 'Copy Ninja',
    image: '/characters/kakashi-hatake.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 7,
      speed: 8,
      defense: 7,
      chakra: 6,
      intelligence: 10,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 8
    },
    roleRatings: {
      captain: 10,
      attacker: 8,
      tank: 6,
      medic: 2,
      support: 9
    },
    traits: ['sharingan', 'tactician', 'hatake', 'hound_summoner'],
    abilities: ['Kamui', 'Lightning Blade (Raikiri)', 'Earth Style: Mud Wall']
  },
  {
    id: 'itachi_akatsuki',
    familyId: 'itachi_uchiha',
    name: 'Itachi Uchiha',
    version: 'Akatsuki',
    image: '/characters/itachi-uchiha.webp',
    auctionValue: 9,
    traitorRisk: 10,
    stats: {
      power: 8,
      speed: 9,
      defense: 7,
      chakra: 8,
      intelligence: 10,
      ninjutsu: 9,
      taijutsu: 7,
      genjutsu: 10
    },
    roleRatings: {
      captain: 10,
      attacker: 9,
      tank: 6,
      medic: 1,
      support: 8
    },
    traits: ['sharingan', 'mangekyo', 'genjutsu', 'strategist'],
    abilities: ['Tsukuyomi', 'Amaterasu', 'Susanoo (Totsuka Blade)']
  },
  {
    id: 'madara_reanimated',
    familyId: 'madara_uchiha',
    name: 'Madara Uchiha',
    version: 'Legendary Warlord',
    image: '/characters/madara-uchiha.webp',
    auctionValue: 10,
    traitorRisk: 10,
    stats: {
      power: 10,
      speed: 9,
      defense: 10,
      chakra: 10,
      intelligence: 10,
      ninjutsu: 10,
      taijutsu: 9,
      genjutsu: 9
    },
    roleRatings: {
      captain: 10,
      attacker: 10,
      tank: 10,
      medic: 1,
      support: 8
    },
    traits: ['uchiha_founder', 'rinnegan', 'mangekyo', 'wood_style'],
    abilities: ['Majestic Destroyer Flame', 'Tengai Shinsei', 'Perfect Susanoo']
  },
  {
    id: 'obito_masked',
    familyId: 'obito_uchiha',
    name: 'Obito Uchiha',
    version: 'Masked Leader',
    image: '/characters/obito-uchiha.webp',
    auctionValue: 9,
    traitorRisk: 10,
    stats: {
      power: 8,
      speed: 9,
      defense: 10,
      chakra: 9,
      intelligence: 9,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 9
    },
    roleRatings: {
      captain: 9,
      attacker: 9,
      tank: 10,
      medic: 1,
      support: 9
    },
    traits: ['kamui', 'intangible', 'hashirama_cells', 'mastermind'],
    abilities: ['Kamui Intangibility', 'Wood Style: Cutting Technique', 'Uchiha Flame Formation']
  },
  {
    id: 'pain_deva',
    familyId: 'pain_nagato',
    name: 'Pain',
    version: 'Deva Path',
    image: '/characters/pain-nagato.webp',
    auctionValue: 9,
    traitorRisk: 10,
    stats: {
      power: 10,
      speed: 8,
      defense: 9,
      chakra: 10,
      intelligence: 8,
      ninjutsu: 10,
      taijutsu: 7,
      genjutsu: 7
    },
    roleRatings: {
      captain: 9,
      attacker: 10,
      tank: 9,
      medic: 2,
      support: 9
    },
    traits: ['rinnegan', 'six_paths', 'gravity', 'akatsuki_leader'],
    abilities: ['Shinra Tensei (Almighty Push)', 'Bansho Tenin (Universal Pull)', 'Chibaku Tensei']
  },
  {
    id: 'konan_akatsuki',
    familyId: 'konan',
    name: 'Konan',
    version: 'Angel of Amegakure',
    image: '/characters/konan.webp',
    auctionValue: 7,
    traitorRisk: 7,
    stats: {
      power: 7,
      speed: 8,
      defense: 8,
      chakra: 8,
      intelligence: 8,
      ninjutsu: 9,
      taijutsu: 5,
      genjutsu: 6
    },
    roleRatings: {
      captain: 7,
      attacker: 8,
      tank: 7,
      medic: 2,
      support: 10
    },
    traits: ['paper_ninjutsu', 'aerial', 'amegakure', 'scout'],
    abilities: ['Dance of the Shikigami', 'Paper Shuriken', 'Paper Person of God']
  },
  {
    id: 'minato_namikaze',
    familyId: 'minato_namikaze',
    name: 'Minato Namikaze',
    version: 'Yellow Flash',
    image: '/characters/minato-namikaze.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 8,
      speed: 10,
      defense: 7,
      chakra: 8,
      intelligence: 10,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 6
    },
    roleRatings: {
      captain: 10,
      attacker: 10,
      tank: 6,
      medic: 1,
      support: 9
    },
    traits: ['flying_raijin', 'hokage', 'speedster', 'sealing_master'],
    abilities: ['Flying Raijin: Level 2', 'Spiralling Sphere (Rasengan)', 'Reaper Death Seal']
  },
  {
    id: 'hashirama_first_hokage',
    familyId: 'hashirama_senju',
    name: 'Hashirama Senju',
    version: 'God of Shinobi',
    image: '/characters/hashirama-senju.webp',
    auctionValue: 10,
    traitorRisk: 10,
    stats: {
      power: 10,
      speed: 8,
      defense: 10,
      chakra: 10,
      intelligence: 8,
      ninjutsu: 10,
      taijutsu: 9,
      genjutsu: 7
    },
    roleRatings: {
      captain: 10,
      attacker: 9,
      tank: 10,
      medic: 8,
      support: 8
    },
    traits: ['wood_release', 'senju', 'sage_mode', 'first_hokage'],
    abilities: ['True Several Thousand Hands', 'Wood Golem Jutsu', 'Deep Forest Emergence']
  },
  {
    id: 'tobirama_second_hokage',
    familyId: 'tobirama_senju',
    name: 'Tobirama Senju',
    version: 'Second Hokage',
    image: '/characters/tobirama-senju.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 8,
      speed: 9,
      defense: 8,
      chakra: 9,
      intelligence: 10,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 7
    },
    roleRatings: {
      captain: 10,
      attacker: 9,
      tank: 8,
      medic: 2,
      support: 9
    },
    traits: ['water_master', 'creator_jutsu', 'flying_raijin', 'second_hokage'],
    abilities: ['Water Style: Water Severing Wave', 'Flying Thunder God Slash', 'Mutually Multiplying Explosive Tags']
  },
  {
    id: 'hiruzen_third_hokage',
    familyId: 'hiruzen_sarutobi',
    name: 'Hiruzen Sarutobi',
    version: 'The Professor',
    image: '/characters/hiruzen-sarutobi.webp',
    auctionValue: 7,
    traitorRisk: 7,
    stats: {
      power: 7,
      speed: 6,
      defense: 7,
      chakra: 7,
      intelligence: 10,
      ninjutsu: 10,
      taijutsu: 7,
      genjutsu: 8
    },
    roleRatings: {
      captain: 9,
      attacker: 8,
      tank: 7,
      medic: 3,
      support: 8
    },
    traits: ['five_chakra_natures', 'enma_summoner', 'veteran', 'third_hokage'],
    abilities: ['Shuriken Shadow Clone Jutsu', 'Adamantine Nyoi Staff', 'Fire Style: Dragon Flame Bomb']
  },
  {
    id: 'tsunade_fifth_hokage',
    familyId: 'tsunade_senju',
    name: 'Tsunade',
    version: 'Fifth Hokage',
    image: '/characters/tsunade-senju.webp',
    auctionValue: 8,
    traitorRisk: 7,
    stats: {
      power: 10,
      speed: 6,
      defense: 9,
      chakra: 9,
      intelligence: 9,
      ninjutsu: 8,
      taijutsu: 9,
      genjutsu: 5
    },
    roleRatings: {
      captain: 8,
      attacker: 8,
      tank: 9,
      medic: 10,
      support: 8
    },
    traits: ['mitotic_regeneration', 'legendary_sannin', 'brute_force', 'fifth_hokage'],
    abilities: ['Creation Rebirth: Strength of a Hundred', 'Heavenly Foot of Pain', 'Katsuyu Acid Slime']
  },
  {
    id: 'jiraiya_sannin',
    familyId: 'jiraiya',
    name: 'Jiraiya',
    version: 'Toad Sage',
    image: '/characters/jiraiya.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 8,
      speed: 7,
      defense: 8,
      chakra: 9,
      intelligence: 9,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 8
    },
    roleRatings: {
      captain: 9,
      attacker: 9,
      tank: 8,
      medic: 3,
      support: 8
    },
    traits: ['sage_mode', 'legendary_sannin', 'toad_summoner', 'barrier_jutsu'],
    abilities: ['Ultra-Big Ball Rasengan', 'Sage Art: Frog Call Genjutsu', 'Needle Jizo']
  },
  {
    id: 'orochimaru_sannin',
    familyId: 'orochimaru',
    name: 'Orochimaru',
    version: 'Immortal Scholar',
    image: '/characters/orochimaru.webp',
    auctionValue: 8,
    traitorRisk: 9,
    stats: {
      power: 8,
      speed: 8,
      defense: 9,
      chakra: 9,
      intelligence: 10,
      ninjutsu: 10,
      taijutsu: 7,
      genjutsu: 8
    },
    roleRatings: {
      captain: 8,
      attacker: 8,
      tank: 9,
      medic: 6,
      support: 9
    },
    traits: ['reanimation', 'snake_summoner', 'legendary_sannin', 'immortality'],
    abilities: ['Eight Branches Technique', 'Striking Shadow Snake', 'Impure World Reincarnation']
  },
  {
    id: 'gaara_kazekage',
    familyId: 'gaara',
    name: 'Gaara',
    version: 'Fifth Kazekage',
    image: '/characters/gaara.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 8,
      speed: 6,
      defense: 10,
      chakra: 9,
      intelligence: 8,
      ninjutsu: 9,
      taijutsu: 4,
      genjutsu: 6
    },
    roleRatings: {
      captain: 9,
      attacker: 8,
      tank: 10,
      medic: 1,
      support: 9
    },
    traits: ['absolute_defense', 'sand_control', 'kazekage', 'shukaku'],
    abilities: ['Sand Tsunami', 'Giant Sand Burial', 'Shield of Shukaku']
  },
  {
    id: 'killer_b_jinchuriki',
    familyId: 'killer_b',
    name: 'Killer B',
    version: 'Eight Tails',
    image: '/characters/killer-b.webp',
    auctionValue: 8,
    traitorRisk: 9,
    stats: {
      power: 9,
      speed: 8,
      defense: 8,
      chakra: 10,
      intelligence: 7,
      ninjutsu: 8,
      taijutsu: 9,
      genjutsu: 7
    },
    roleRatings: {
      captain: 7,
      attacker: 9,
      tank: 8,
      medic: 1,
      support: 7
    },
    traits: ['perfect_jinchuriki', 'gyuki', 'seven_swords', 'lightning_cloak'],
    abilities: ['Tailed Beast Bomb (Bijuudama)', 'Acrobat Sword Technique', 'Lariat']
  },
  {
    id: 'might_guy_eight_gates',
    familyId: 'might_guy',
    name: 'Might Guy',
    version: 'Sublime Green Beast',
    image: '/characters/might-guy.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 10,
      speed: 10,
      defense: 7,
      chakra: 7,
      intelligence: 6,
      ninjutsu: 3,
      taijutsu: 10,
      genjutsu: 3
    },
    roleRatings: {
      captain: 7,
      attacker: 10,
      tank: 7,
      medic: 1,
      support: 6
    },
    traits: ['eight_gates', 'taijutsu_god', 'hot_blooded', 'speedster'],
    abilities: ['Night Guy', 'Daytime Tiger (Hirudora)', 'Asakujaku (Morning Peacock)']
  },
  {
    id: 'rock_lee_gates',
    familyId: 'rock_lee',
    name: 'Rock Lee',
    version: 'Lotus of Konoha',
    image: '/characters/rock-lee.webp',
    auctionValue: 6,
    traitorRisk: 5,
    stats: {
      power: 7,
      speed: 9,
      defense: 6,
      chakra: 5,
      intelligence: 5,
      ninjutsu: 1,
      taijutsu: 9,
      genjutsu: 1
    },
    roleRatings: {
      captain: 5,
      attacker: 8,
      tank: 6,
      medic: 1,
      support: 5
    },
    traits: ['eight_gates', 'taijutsu_specialist', 'youth', 'leaf_hurricane'],
    abilities: ['Primary Lotus', 'Hidden Lotus', 'Leaf Severe Whirlwind']
  },
  {
    id: 'neji_hyuga',
    familyId: 'neji_hyuga',
    name: 'Neji Hyuga',
    version: 'Gentle Fist Prodigy',
    image: '/characters/neji-hyuga.webp',
    auctionValue: 7,
    traitorRisk: 6,
    stats: {
      power: 7,
      speed: 8,
      defense: 8,
      chakra: 7,
      intelligence: 8,
      ninjutsu: 6,
      taijutsu: 9,
      genjutsu: 5
    },
    roleRatings: {
      captain: 8,
      attacker: 8,
      tank: 8,
      medic: 1,
      support: 7
    },
    traits: ['byakugan', 'gentle_fist', 'hyuga_genius', 'rotational_defense'],
    abilities: ['Eight Trigrams Sixty-Four Palms', 'Eight Trigrams Palms Revolving Heaven', 'Eight Trigrams Vacuum Palm']
  },
  {
    id: 'hinata_hyuga',
    familyId: 'hinata_hyuga',
    name: 'Hinata Hyuga',
    version: 'Twin Lion Fists',
    image: '/characters/hinata-hyuga.webp',
    auctionValue: 5,
    traitorRisk: 3,
    stats: {
      power: 6,
      speed: 7,
      defense: 7,
      chakra: 6,
      intelligence: 7,
      ninjutsu: 5,
      taijutsu: 8,
      genjutsu: 5
    },
    roleRatings: {
      captain: 4,
      attacker: 7,
      tank: 7,
      medic: 5,
      support: 8
    },
    traits: ['byakugan', 'twin_lion_fists', 'gentle_fist', 'hyuga_heiress'],
    abilities: ['Gentle Step Twin Lion Fists', 'Eight Trigrams Thirty-Two Palms', 'Protection of the Eight Trigrams']
  },
  {
    id: 'shikamaru_chunin',
    familyId: 'shikamaru_nara',
    name: 'Shikamaru Nara',
    version: 'Shadow Strategist',
    image: '/characters/shikamaru-nara.webp',
    auctionValue: 7,
    traitorRisk: 6,
    stats: {
      power: 5,
      speed: 6,
      defense: 6,
      chakra: 5,
      intelligence: 10,
      ninjutsu: 7,
      taijutsu: 5,
      genjutsu: 6
    },
    roleRatings: {
      captain: 10,
      attacker: 5,
      tank: 5,
      medic: 2,
      support: 10
    },
    traits: ['shadow_imitation', 'genius_iq', 'tactical_planner', 'inoshikacho'],
    abilities: ['Shadow Possession Jutsu', 'Shadow Strangle Jutsu', 'Shadow Stitching Jutsu']
  },
  {
    id: 'choji_butterfly',
    familyId: 'choji_akimichi',
    name: 'Choji Akimichi',
    version: 'Butterfly Mode',
    image: '/characters/choji-akimichi.webp',
    auctionValue: 6,
    traitorRisk: 5,
    stats: {
      power: 9,
      speed: 5,
      defense: 8,
      chakra: 7,
      intelligence: 5,
      ninjutsu: 6,
      taijutsu: 8,
      genjutsu: 3
    },
    roleRatings: {
      captain: 4,
      attacker: 8,
      tank: 9,
      medic: 1,
      support: 5
    },
    traits: ['expansion_jutsu', 'butterfly_mode', 'heavy_hitter', 'inoshikacho'],
    abilities: ['Butterfly Bullet Bombing', 'Human Boulder', 'Super Multi-Size Jutsu']
  },
  {
    id: 'kiba_shippuden',
    familyId: 'kiba_inuzuka',
    name: 'Kiba Inuzuka',
    version: 'Man-Beast Fusion',
    image: '/characters/kiba-inuzuka.webp',
    auctionValue: 5,
    traitorRisk: 3,
    stats: {
      power: 6,
      speed: 7,
      defense: 5,
      chakra: 5,
      intelligence: 5,
      ninjutsu: 6,
      taijutsu: 7,
      genjutsu: 2
    },
    roleRatings: {
      captain: 3,
      attacker: 7,
      tank: 5,
      medic: 1,
      support: 6
    },
    traits: ['inuzuka', 'akamaru', 'olfactory_tracker', 'beast_ninjutsu'],
    abilities: ['Fang Over Fang (Gatsuga)', 'Man Beast Combination: Two-Headed Wolf', 'Dynamic Marking']
  },
  {
    id: 'tenten_shippuden',
    familyId: 'tenten',
    name: 'Tenten',
    version: 'Weapons Master',
    image: '/characters/tenten.webp',
    auctionValue: 4,
    traitorRisk: 2,
    stats: {
      power: 5,
      speed: 6,
      defense: 5,
      chakra: 5,
      intelligence: 6,
      ninjutsu: 6,
      taijutsu: 6,
      genjutsu: 3
    },
    roleRatings: {
      captain: 3,
      attacker: 6,
      tank: 4,
      medic: 1,
      support: 7
    },
    traits: ['tool_summoning', 'marksman', 'weapon_barrage', 'ninja_tools'],
    abilities: ['Twin Rising Dragons', 'Iron Ball Unleash', 'Sacred Weapon Barrage']
  },
  {
    id: 'kisame_hoshigaki',
    familyId: 'kisame_hoshigaki',
    name: 'Kisame Hoshigaki',
    version: 'Monster of the Mist',
    image: '/characters/kisame-hoshigaki.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 9,
      speed: 7,
      defense: 9,
      chakra: 10,
      intelligence: 7,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 6
    },
    roleRatings: {
      captain: 7,
      attacker: 9,
      tank: 9,
      medic: 2,
      support: 7
    },
    traits: ['tailless_beast', 'samehada', 'water_dominance', 'chakra_drain'],
    abilities: ['Water Style: Water Shark Bomb Jutsu', 'Giant Water Prison Wave', 'Super Shark Bomb Jutsu']
  },
  {
    id: 'deidara_akatsuki',
    familyId: 'deidara',
    name: 'Deidara',
    version: 'Explosive Artist',
    image: '/characters/deidara.webp',
    auctionValue: 7,
    traitorRisk: 8,
    stats: {
      power: 9,
      speed: 8,
      defense: 6,
      chakra: 8,
      intelligence: 7,
      ninjutsu: 9,
      taijutsu: 5,
      genjutsu: 6
    },
    roleRatings: {
      captain: 5,
      attacker: 9,
      tank: 5,
      medic: 1,
      support: 8
    },
    traits: ['explosive_clay', 'aerial_bomber', 'long_range', 'artist'],
    abilities: ['C3 (Oharako)', 'C4 Karura (Microscopic Clay Bombs)', 'C0 (Ultimate Art Explosion)']
  },
  {
    id: 'sasori_akatsuki',
    familyId: 'sasori',
    name: 'Sasori',
    version: 'Red Sand Puppeteer',
    image: '/characters/sasori.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 8,
      speed: 7,
      defense: 8,
      chakra: 8,
      intelligence: 9,
      ninjutsu: 9,
      taijutsu: 6,
      genjutsu: 6
    },
    roleRatings: {
      captain: 7,
      attacker: 9,
      tank: 8,
      medic: 3,
      support: 9
    },
    traits: ['puppet_master', 'deadly_poison', 'third_kazekage', 'hundred_puppets'],
    abilities: ['Iron Sand Drizzle', 'Secret Red Move: Performance of a Hundred Puppets', 'Flamethrower Pipe']
  },
  {
    id: 'kabuto_yakushi',
    familyId: 'kabuto_yakushi',
    name: 'Kabuto Yakushi',
    version: 'Snake Infiltrator',
    image: '/characters/kabuto-yakushi.webp',
    auctionValue: 7,
    traitorRisk: 8,
    stats: {
      power: 7,
      speed: 8,
      defense: 7,
      chakra: 8,
      intelligence: 10,
      ninjutsu: 9,
      taijutsu: 7,
      genjutsu: 7
    },
    roleRatings: {
      captain: 8,
      attacker: 7,
      tank: 6,
      medic: 9,
      support: 9
    },
    traits: ['medical_ninja', 'chakra_scalpel', 'covert_spy', 'sound_ninja'],
    abilities: ['Chakra Scalpel', 'Temple of Nirvana Jutsu', 'Dead Soul Technique']
  },
  {
    id: 'temari_wind',
    familyId: 'temari',
    name: 'Temari',
    version: 'Wind Scythe Specialist',
    image: '/characters/temari.webp',
    auctionValue: 6,
    traitorRisk: 5,
    stats: {
      power: 7,
      speed: 6,
      defense: 6,
      chakra: 6,
      intelligence: 8,
      ninjutsu: 8,
      taijutsu: 5,
      genjutsu: 4
    },
    roleRatings: {
      captain: 7,
      attacker: 8,
      tank: 5,
      medic: 1,
      support: 8
    },
    traits: ['wind_style', 'iron_fan', 'sunagakure', 'tactician'],
    abilities: ['Wind Style: Great Sickle Weasel Jutsu', 'Wind Style: Cast Net', 'Summoning: Blade Dance (Kiri Kiri Mai)']
  },
  {
    id: 'kankuro_puppeteer',
    familyId: 'kankuro',
    name: 'Kankuro',
    version: 'Puppet Master',
    image: '/characters/kankuro.webp',
    auctionValue: 5,
    traitorRisk: 4,
    stats: {
      power: 6,
      speed: 5,
      defense: 6,
      chakra: 6,
      intelligence: 7,
      ninjutsu: 7,
      taijutsu: 5,
      genjutsu: 4
    },
    roleRatings: {
      captain: 6,
      attacker: 6,
      tank: 6,
      medic: 2,
      support: 8
    },
    traits: ['puppet_master', 'poison_weapons', 'sunagakure', 'black_secret_technique'],
    abilities: ['Black Secret Technique: Machine One Shot', 'Poison Fog Mist: Hell Strangle', 'Karasu & Sanshouo Defense']
  },
  {
    id: 'shino_aburame',
    familyId: 'shino_aburame',
    name: 'Shino Aburame',
    version: 'Kikaichu Master',
    image: '/characters/shino-aburame.webp',
    auctionValue: 6,
    traitorRisk: 6,
    stats: {
      power: 6,
      speed: 5,
      defense: 6,
      chakra: 7,
      intelligence: 9,
      ninjutsu: 8,
      taijutsu: 5,
      genjutsu: 5
    },
    roleRatings: {
      captain: 7,
      attacker: 7,
      tank: 6,
      medic: 2,
      support: 9
    },
    traits: ['aburame', 'parasitic_insects', 'chakra_drain', 'stealth_analyst'],
    abilities: ['Secret Technique: Insect Sphere', 'Insect Clone Jutsu', 'Parasitic Giant Beetle Infestation']
  },
  {
    id: 'sai_ink',
    familyId: 'sai',
    name: 'Sai',
    version: 'Ink Beast Artist',
    image: '/characters/sai.webp',
    auctionValue: 5,
    traitorRisk: 4,
    stats: {
      power: 6,
      speed: 7,
      defense: 5,
      chakra: 6,
      intelligence: 7,
      ninjutsu: 7,
      taijutsu: 6,
      genjutsu: 4
    },
    roleRatings: {
      captain: 5,
      attacker: 6,
      tank: 4,
      medic: 1,
      support: 8
    },
    traits: ['super_beast_scroll', 'root_anbu', 'aerial_scout', 'sealing_technique'],
    abilities: ['Super Beast Imitating Drawing: Roaring Dragon', 'Super Beast Scroll: Birds', 'Sealing Jutsu: Tiger Vision Staring Bullet']
  },
  {
    id: 'yamato_anbu',
    familyId: 'yamato',
    name: 'Yamato',
    version: 'Wood Release Specialist',
    image: '/characters/yamato.webp',
    auctionValue: 7,
    traitorRisk: 6,
    stats: {
      power: 7,
      speed: 6,
      defense: 8,
      chakra: 8,
      intelligence: 8,
      ninjutsu: 8,
      taijutsu: 7,
      genjutsu: 6
    },
    roleRatings: {
      captain: 8,
      attacker: 7,
      tank: 8,
      medic: 2,
      support: 9
    },
    traits: ['wood_style', 'anbu', 'hokage_style_suppression', 'hashirama_cells'],
    abilities: ['Wood Style: Four Pillars Prison Technique', 'Wood Style: Dense Woodland', 'Hokage-Style Sixty-Year-Old Technique: Kakuan Entering Society with Bliss-Bringing Hands']
  },
  {
    id: 'asuma_sarutobi',
    familyId: 'asuma_sarutobi',
    name: 'Asuma Sarutobi',
    version: 'Guardian Shinobi',
    image: '/characters/asuma-sarutobi.webp',
    auctionValue: 6,
    traitorRisk: 6,
    stats: {
      power: 7,
      speed: 7,
      defense: 6,
      chakra: 7,
      intelligence: 8,
      ninjutsu: 7,
      taijutsu: 8,
      genjutsu: 5
    },
    roleRatings: {
      captain: 8,
      attacker: 8,
      tank: 6,
      medic: 1,
      support: 7
    },
    traits: ['wind_chakra_blades', 'sarutobi', 'guardian_twelve', 'close_combat'],
    abilities: ['Flying Swallow (Chakra Blades)', 'Fire Style: Burning Ash (Haisekisho)', 'Welcoming Approach: Thousand-Hand Strike']
  },
  {
    id: 'zabuza_momochi',
    familyId: 'zabuza_momochi',
    name: 'Zabuza Momochi',
    version: 'Demon of the Mist',
    image: '/characters/zabuza-momochi.webp',
    auctionValue: 6,
    traitorRisk: 7,
    stats: {
      power: 8,
      speed: 7,
      defense: 6,
      chakra: 7,
      intelligence: 7,
      ninjutsu: 7,
      taijutsu: 8,
      genjutsu: 6
    },
    roleRatings: {
      captain: 6,
      attacker: 9,
      tank: 6,
      medic: 1,
      support: 6
    },
    traits: ['seven_swordsmen', 'silent_killing', 'kubikiribocho', 'hidden_mist'],
    abilities: ['Hidden Mist Jutsu', 'Water Style: Water Dragon Jutsu', 'Water Prison Jutsu']
  },
  {
    id: 'haku_yuki',
    familyId: 'haku',
    name: 'Haku',
    version: 'Ice Mirror Prodigy',
    image: '/characters/haku.webp',
    auctionValue: 6,
    traitorRisk: 5,
    stats: {
      power: 6,
      speed: 9,
      defense: 6,
      chakra: 6,
      intelligence: 8,
      ninjutsu: 8,
      taijutsu: 6,
      genjutsu: 5
    },
    roleRatings: {
      captain: 5,
      attacker: 8,
      tank: 5,
      medic: 4,
      support: 8
    },
    traits: ['ice_release', 'kekkei_genkai', 'senbon_mastery', 'one_handed_seals'],
    abilities: ['Demonic Ice Crystal Mirrors', 'Thousand Flying Water Needles of Death', 'Acupuncture Point Striking']
  },
  {
    id: 'nagato_uzumaki',
    familyId: 'pain_nagato',
    name: 'Nagato',
    version: 'Rinnegan Awakened',
    image: '/characters/nagato.webp',
    auctionValue: 10,
    traitorRisk: 10,
    stats: {
      power: 10,
      speed: 7,
      defense: 9,
      chakra: 10,
      intelligence: 9,
      ninjutsu: 10,
      taijutsu: 7,
      genjutsu: 8
    },
    roleRatings: {
      captain: 8,
      attacker: 10,
      tank: 8,
      medic: 3,
      support: 10
    },
    traits: ['rinnegan', 'uzumaki', 'six_paths_user', 'gedo_statue'],
    abilities: ['Chibaku Tensei', 'Shinra Tensei', 'Soul Extraction: Human Path']
  },
  {
    id: 'kakuzu_akatsuki',
    familyId: 'kakuzu',
    name: 'Kakuzu',
    version: 'Five Hearts Immortal',
    image: '/characters/kakuzu.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 8,
      speed: 7,
      defense: 9,
      chakra: 9,
      intelligence: 8,
      ninjutsu: 9,
      taijutsu: 8,
      genjutsu: 5
    },
    roleRatings: {
      captain: 6,
      attacker: 9,
      tank: 10,
      medic: 2,
      support: 7
    },
    traits: ['earth_grudge_fear', 'five_hearts', 'akatsuki', 'diamond_skin'],
    abilities: ['Earth Style: Earth Spear (Hardening)', 'Fire Style: Intelligent Hard Work', 'Lightning Style: False Darkness']
  },
  {
    id: 'hidan_akatsuki',
    familyId: 'hidan',
    name: 'Hidan',
    version: 'Jashin Cultist',
    image: '/characters/hidan.webp',
    auctionValue: 7,
    traitorRisk: 9,
    stats: {
      power: 7,
      speed: 7,
      defense: 10,
      chakra: 6,
      intelligence: 4,
      ninjutsu: 6,
      taijutsu: 8,
      genjutsu: 2
    },
    roleRatings: {
      captain: 2,
      attacker: 8,
      tank: 10,
      medic: 1,
      support: 5
    },
    traits: ['immortality', 'curse_technique', 'jashin', 'triple_bladed_scythe'],
    abilities: ['Curse Technique: Death Possessing Blood', 'Triple-Bladed Scythe Slaughter', 'Indestructible Body']
  },
  {
    id: 'chiyo_puppet',
    familyId: 'chiyo',
    name: 'Chiyo',
    version: 'White Secret Master',
    image: '/characters/chiyo.webp',
    auctionValue: 7,
    traitorRisk: 6,
    stats: {
      power: 7,
      speed: 6,
      defense: 7,
      chakra: 7,
      intelligence: 9,
      ninjutsu: 8,
      taijutsu: 7,
      genjutsu: 6
    },
    roleRatings: {
      captain: 8,
      attacker: 7,
      tank: 6,
      medic: 9,
      support: 9
    },
    traits: ['puppet_brigade', 'medical_master', 'reanimation_life_transfer', 'sunagakure_elder'],
    abilities: ['White Secret Technique: Ten Puppets of Chikamatsu', 'Chakra Shield (Mechanized Armor)', "One's Own Life Reincarnation (Kisho Tensei)"]
  },
  {
    id: 'darui_storm',
    familyId: 'darui',
    name: 'Darui',
    version: 'Storm Style Shinobi',
    image: '/characters/darui.webp',
    auctionValue: 7,
    traitorRisk: 7,
    stats: {
      power: 8,
      speed: 8,
      defense: 7,
      chakra: 8,
      intelligence: 8,
      ninjutsu: 9,
      taijutsu: 7,
      genjutsu: 5
    },
    roleRatings: {
      captain: 8,
      attacker: 9,
      tank: 7,
      medic: 1,
      support: 8
    },
    traits: ['storm_release', 'black_lightning', 'kumogakure', 'broadsword'],
    abilities: ['Storm Style: Laser Circus', 'Lightning Style: Black Panther', 'Water Style: Water Wall Combination']
  },
  {
    id: 'a_fourth_raikage',
    familyId: 'a_fourth_raikage',
    name: 'A (Fourth Raikage)',
    version: 'Lightning Armor',
    image: '/characters/a-fourth-raikage.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 9,
      speed: 10,
      defense: 9,
      chakra: 9,
      intelligence: 7,
      ninjutsu: 8,
      taijutsu: 10,
      genjutsu: 4
    },
    roleRatings: {
      captain: 9,
      attacker: 10,
      tank: 9,
      medic: 1,
      support: 6
    },
    traits: ['lightning_chakra_mode', 'fourth_raikage', 'extreme_speed', 'liger_bomb'],
    abilities: ['Liger Bomb', 'Guillotine Drop', 'Lightning Straight']
  },
  {
    id: 'mei_terumi',
    familyId: 'mei_terumi',
    name: 'Mei Terumi',
    version: 'Fifth Mizukage',
    image: '/characters/mei-terumi.webp',
    auctionValue: 8,
    traitorRisk: 8,
    stats: {
      power: 8,
      speed: 7,
      defense: 7,
      chakra: 9,
      intelligence: 8,
      ninjutsu: 9,
      taijutsu: 6,
      genjutsu: 6
    },
    roleRatings: {
      captain: 9,
      attacker: 9,
      tank: 6,
      medic: 2,
      support: 8
    },
    traits: ['lava_release', 'boil_release', 'fifth_mizukage', 'acid_mist'],
    abilities: ['Boil Style: Skilled Mist Jutsu', 'Lava Style: Melting Apparition Technique', 'Water Style: Water Formation Pillar']
  },
  {
    id: 'onoki_fence_sitter',
    familyId: 'onoki',
    name: 'Onoki',
    version: 'Third Tsuchikage',
    image: '/characters/onoki.webp',
    auctionValue: 9,
    traitorRisk: 9,
    stats: {
      power: 9,
      speed: 6,
      defense: 7,
      chakra: 8,
      intelligence: 9,
      ninjutsu: 10,
      taijutsu: 4,
      genjutsu: 6
    },
    roleRatings: {
      captain: 9,
      attacker: 10,
      tank: 6,
      medic: 1,
      support: 9
    },
    traits: ['particle_style', 'third_tsuchikage', 'flight', 'earth_style'],
    abilities: ['Particle Style: Atomic Dismantling Jutsu', 'Earth Style: Light-Weight Rock Jutsu', 'Earth Style: Added-Weight Rock Technique']
  },
  {
    id: 'mifune_samurai',
    familyId: 'mifune',
    name: 'Mifune',
    version: 'General of Iron',
    image: '/characters/mifune.webp',
    auctionValue: 6,
    traitorRisk: 6,
    stats: {
      power: 7,
      speed: 8,
      defense: 7,
      chakra: 6,
      intelligence: 8,
      ninjutsu: 1,
      taijutsu: 9,
      genjutsu: 3
    },
    roleRatings: {
      captain: 8,
      attacker: 8,
      tank: 7,
      medic: 1,
      support: 6
    },
    traits: ['samurai_general', 'iaido_master', 'chakra_flow_blade', 'iron_will'],
    abilities: ['Iaido: Decapitation Strike', 'Dancing Blade Risk', 'Flash Slash']
  },
  {
    id: 'kimimaro_kaguya',
    familyId: 'kimimaro',
    name: 'Kimimaro',
    version: 'Shikotsumyaku Prodigy',
    image: '/characters/kimimaro.webp',
    auctionValue: 7,
    traitorRisk: 8,
    stats: {
      power: 8,
      speed: 8,
      defense: 9,
      chakra: 7,
      intelligence: 7,
      ninjutsu: 7,
      taijutsu: 9,
      genjutsu: 4
    },
    roleRatings: {
      captain: 5,
      attacker: 9,
      tank: 9,
      medic: 1,
      support: 5
    },
    traits: ['shikotsumyaku', 'curse_mark_earth', 'kaguya_clan', 'dance_forms'],
    abilities: ['Dance of the Seedling Fern (Bracken Dance)', 'Dance of the Clematis: Flower', 'Dance of the Camellia']
  },
  {
    id: 'suigetsu_hozuki',
    familyId: 'suigetsu_hozuki',
    name: 'Suigetsu Hozuki',
    version: 'Hydrification Specialist',
    image: '/characters/suigetsu-hozuki.webp',
    auctionValue: 6,
    traitorRisk: 6,
    stats: {
      power: 7,
      speed: 7,
      defense: 9,
      chakra: 7,
      intelligence: 6,
      ninjutsu: 8,
      taijutsu: 7,
      genjutsu: 3
    },
    roleRatings: {
      captain: 4,
      attacker: 8,
      tank: 9,
      medic: 1,
      support: 6
    },
    traits: ['hydrification_technique', 'hozuki_clan', 'kubikiribocho', 'taka'],
    abilities: ['Hydrification Technique', 'Water Gun Jutsu', 'Drowning Water Bubble Technique']
  },
  {
    id: 'karin_uzumaki',
    familyId: 'karin',
    name: 'Karin',
    version: 'Sensory Healer',
    image: '/characters/karin.webp',
    auctionValue: 6,
    traitorRisk: 4,
    stats: {
      power: 4,
      speed: 6,
      defense: 5,
      chakra: 8,
      intelligence: 8,
      ninjutsu: 7,
      taijutsu: 4,
      genjutsu: 5
    },
    roleRatings: {
      captain: 3,
      attacker: 4,
      tank: 5,
      medic: 9,
      support: 10
    },
    traits: ['heal_bite', 'mind_eye_kagura', 'uzumaki_vitality', 'adamantine_chains'],
    abilities: ['Heal Bite (Bite of Healing)', "Mind's Eye of the Kagura", 'Adamantine Attacking Chains']
  }
];

