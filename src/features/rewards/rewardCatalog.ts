export const REWARD_CHANCE = 0.1; // %5

export const REWARD_POOL = [
  'Çikolata',
  'Burcu sarma',
  'Kahve ısmarlama',
  'Tatlı',
  'Ne istersen',
];

export function pickRandomReward() {
  const ix = Math.floor(Math.random() * REWARD_POOL.length);
  return REWARD_POOL[ix];
}
