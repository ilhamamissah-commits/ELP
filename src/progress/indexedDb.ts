export interface ProgressAttempt {
  id: string;
  profileId: string;
  objectiveId: string;
  activityId: string;
  score: number;
  stars: number;
  completedAt: number;
}

const DB_NAME = 'early-learning-engine';
const STORE = 'progressAttempts';

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('byProfile', 'profileId');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAttempt(attempt: ProgressAttempt): Promise<void> {
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(attempt);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

export async function getAttempts(profileId: string): Promise<ProgressAttempt[]> {
  const db = await database();
  const attempts = await new Promise<ProgressAttempt[]>((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).index('byProfile').getAll(profileId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return attempts;
}
