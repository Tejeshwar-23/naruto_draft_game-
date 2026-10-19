/**
 * Random Character Selector
 * Selects an unused character from the available roster, respecting family ID uniqueness.
 *
 * @param {Array} characters - The complete characters list
 * @param {Set|Array} usedFamilyIds - Collection of already drafted/assigned family IDs
 * @returns {Object|null} A randomly chosen available character, or null if pool is empty
 */
export function getRandomAvailableCharacter(characters = [], usedFamilyIds = new Set()) {
  if (!Array.isArray(characters) || characters.length === 0) {
    return null;
  }

  // Convert to Set for fast O(1) lookup if an Array is passed
  const usedSet = usedFamilyIds instanceof Set ? usedFamilyIds : new Set(usedFamilyIds);

  // Filter out any characters whose family has already been assigned
  const available = characters.filter((char) => !usedSet.has(char.familyId));

  if (available.length === 0) {
    return null;
  }

  // Select a random index without mutating the original array
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * Returns the count of remaining available unique families
 *
 * @param {Array} characters - The complete characters list
 * @param {Set|Array} usedFamilyIds - Collection of already drafted/assigned family IDs
 * @returns {number}
 */
export function getRemainingFamiliesCount(characters = [], usedFamilyIds = new Set()) {
  const usedSet = usedFamilyIds instanceof Set ? usedFamilyIds : new Set(usedFamilyIds);
  const available = characters.filter((char) => !usedSet.has(char.familyId));
  return available.length;
}
