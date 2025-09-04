export type Reward = {
  id: string;
  ownerId: string;
  name: string;
  used: boolean;
  createdAt: any; // Firestore Timestamp
};
