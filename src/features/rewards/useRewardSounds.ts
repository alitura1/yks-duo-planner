import { useMemo } from 'react';

function makeSound(src: string) {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
}

export function useRewardSounds() {
  return useMemo(
    () => ({
      click: makeSound('/sfx/click.mp3'),
      open: makeSound('/sfx/open.mp3'),
      won: makeSound('/sfx/reward.mp3'),
      used: makeSound('/sfx/use.mp3'),
      complete: makeSound('/sfx/complete.mp3'),
    }),
    []
  );
}
