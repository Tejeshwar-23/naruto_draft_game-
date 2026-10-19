/**
 * Character visual utilities & color schemes
 */

// Accent color mapping based on shinobi family / chakra affinity
export function getCharacterColor(char) {
  if (!char) return '#ff6a00';
  const colorMap = {
    naruto_uzumaki: '#f97316',
    sasuke_uchiha: '#8b5cf6',
    sakura_haruno: '#ec4899',
    kakashi_hatake: '#38bdf8',
    itachi_uchiha: '#dc2626',
    madara_uchiha: '#b91c1c',
    obito_uchiha: '#f43f5e',
    pain_nagato: '#f59e0b',
    konan: '#818cf8',
    minato_namikaze: '#eab308',
    hashirama_senju: '#10b981',
    tobirama_senju: '#0284c7',
    hiruzen_sarutobi: '#f59e0b',
    tsunade_senju: '#10b981',
    jiraiya: '#ea580c',
    orochimaru: '#a855f7',
    gaara: '#d97706',
    killer_b: '#06b6d4',
    might_guy: '#22c55e',
    rock_lee: '#16a34a',
    neji_hyuga: '#38bdf8',
    hinata_hyuga: '#818cf8',
    shikamaru_nara: '#64748b',
    choji_akimichi: '#f59e0b',
    kiba_inuzuka: '#b45309',
    tenten: '#e11d48',
    kisame_hoshigaki: '#0284c7',
    deidara: '#eab308',
    sasori: '#b91c1c',
    kabuto_yakushi: '#7c3aed'
  };
  return colorMap[char.familyId] || '#ff6a00';
}

export function getCharacterInitials(name) {
  if (!name) return '忍';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
