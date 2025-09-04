import { rollRewardForUser } from './api';
import { useRewardSounds } from './useRewardSounds';

export function useOnTaskComplete() {
  const sfx = useRewardSounds();

  return async function onTaskComplete(currentUserId: string) {
    sfx.complete();
    const res = await rollRewardForUser(currentUserId);
    if (res.won) {
      sfx.won();
      console.log('Ödül kazandın:', res.name);
    }
  };
}
