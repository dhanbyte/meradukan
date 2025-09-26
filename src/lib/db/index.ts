import { getDatabase } from '../mongodb';

export { getDatabase };

export async function getCollection<T = any>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

export const collections = {
  users: 'users',
  referrals: 'referrals',
  withdrawals: 'withdrawals',
  referralEarnings: 'referral_earnings'
};
