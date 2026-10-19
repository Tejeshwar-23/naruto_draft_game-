# Naruto Draft — Character Artwork Manifest

This manifest documents the exact artwork asset requirements for all 30 characters in the Naruto Draft roster.

---

## Technical Image Requirements

- **Target Directory:** `public/characters/`
- **Preferred Format:** `WEBP` (Modern compression, alpha channel support, lightweight)
- **Recommended Source Resolution:** At least `600 × 800 px` (supports high-DPI displays)
- **Aspect Ratio:** Approximately `3:4` (portrait / character-focused orientation)
- **Cropping & Framing:** Character face/head, headband, and upper torso centered in the upper-middle region
- **Background Style:** Transparent background OR clean/simple dark ninja backdrop
- **File Size Target:** Under `500 KB` per character asset after optimization
- **File Naming:** Must **strictly** match the expected filenames listed below.

---

## Character Artwork Roster Manifest (30 Characters)

| # | Character Name | Version / Era | Required Filename | Status | Notes / Visual Guidance |
|---|----------------|---------------|-------------------|--------|-------------------------|
| 1 | Naruto Uzumaki | Sage Mode | `naruto-uzumaki.webp` | Pending | Sage Mode eye pigment, orange/black jacket, scroll |
| 2 | Sasuke Uchiha | Hebi | `sasuke-uchiha.webp` | Pending | White open-collar shirt, blue sash, purple rope belt, Kusanagi sword |
| 3 | Sakura Haruno | Medical Specialist | `sakura-haruno.webp` | Pending | Shippuden medical outfit, pink hair, red ninja dress |
| 4 | Kakashi Hatake | Copy Ninja | `kakashi-hatake.webp` | Pending | Flak jacket, pulled-up headband, Sharingan eye visible |
| 5 | Itachi Uchiha | Akatsuki | `itachi-uchiha.webp` | Pending | Black Akatsuki cloak with red clouds, Sharingan |
| 6 | Madara Uchiha | Legendary Warlord | `madara-uchiha.webp` | Pending | Edo/Reanimated or Prime warlord armor, long spiky hair |
| 7 | Obito Uchiha | Masked Leader | `obito-uchiha.webp` | Pending | Orange swirl mask / Akatsuki leader cloak |
| 8 | Pain | Deva Path | `pain-nagato.webp` | Pending | Deva Path orange hair, chakra receivers/piercings, Rinnegan |
| 9 | Konan | Angel of Amegakure | `konan.webp` | Pending | Paper flower in hair, Akatsuki cloak, paper origami wings |
| 10 | Minato Namikaze | Yellow Flash | `minato-namikaze.webp` | Pending | White/flame Hokage haori, spiky blond hair, kunai |
| 11 | Hashirama Senju | God of Shinobi | `hashirama-senju.webp` | Pending | Red samurai shinobi armor, dark hair, Senju emblem |
| 12 | Tobirama Senju | Second Hokage | `tobirama-senju.webp` | Pending | Blue armor, white fur collar, forehead protector with plate |
| 13 | Hiruzen Sarutobi | The Professor | `hiruzen-sarutobi.webp` | Pending | Battle outfit (black armor mesh) or Hokage robes |
| 14 | Tsunade | Fifth Hokage | `tsunade-senju.webp` | Pending | Green haori with "賭" (gamble) on back, Byakugou mark |
| 15 | Jiraiya | Toad Sage | `jiraiya.webp` | Pending | Spiky white hair, red face markings, toad oil scroll |
| 16 | Orochimaru | Immortal Scholar | `orochimaru.webp` | Pending | Pale skin, purple eye markings, thick purple rope belt |
| 17 | Gaara | Fifth Kazekage | `gaara.webp` | Pending | Kazekage coat, red hair, gourd on back, "愛" forehead tattoo |
| 18 | Killer B | Eight Tails | `killer-b.webp` | Pending | Dual horns tattoo on cheek, seven swords, sunglasses |
| 19 | Might Guy | Sublime Green Beast | `might-guy.webp` | Pending | Green jumpsuit, orange leg warmers, flak jacket |
| 20 | Rock Lee | Lotus of Konoha | `rock-lee.webp` | Pending | Green jumpsuit, bandages on hands, determined battle pose |
| 21 | Neji Hyuga | Gentle Fist Prodigy | `neji-hyuga.webp` | Pending | Byakugan veins activated, Hyuga clan robes |
| 22 | Hinata Hyuga | Twin Lion Fists | `hinata-hyuga.webp` | Pending | Shippuden jacket, dark purple hair, Byakugan |
| 23 | Shikamaru Nara | Shadow Strategist | `shikamaru-nara.webp` | Pending | Konoha flak jacket, ponytail, tactical expression |
| 24 | Choji Akimichi | Butterfly Mode | `choji-akimichi.webp` | Pending | Butterfly chakra wings or red armor Shippuden battle gear |
| 25 | Kiba Inuzuka | Man-Beast Fusion | `kiba-inuzuka.webp` | Pending | Red fang cheek markings, fur-trimmed hood, fierce grin |
| 26 | Tenten | Weapons Master | `tenten.webp` | Pending | Chinese-style tunic, dual buns, weapons scroll |
| 27 | Kisame Hoshigaki | Monster of the Mist | `kisame-hoshigaki.webp` | Pending | Samehada wrapped on shoulder, shark-like facial gill markings |
| 28 | Deidara | Explosive Artist | `deidara.webp` | Pending | Akatsuki cloak, blond hair covering eye, explosive clay scope |
| 29 | Sasori | Red Sand Puppeteer | `sasori.webp` | Pending | Red hair, puppet body / Akatsuki cloak |
| 30 | Kabuto Yakushi | Snake Infiltrator | `kabuto-yakushi.webp` | Pending | Glasses, purple robe, snake scales/senjutsu traits |

---

## Integration Workflow

When a file (e.g. `itachi-uchiha.webp`) is placed into `public/characters/`:
1. The app automatically detects and renders it via standard web asset serving (`/characters/itachi-uchiha.webp`).
2. Run `npm run check:images` in the terminal to verify that the file is recognized.
3. If an image is missing or cannot be loaded, the app automatically displays the stylized shinobi silhouette and initials badge fallback with zero broken-image icons.
