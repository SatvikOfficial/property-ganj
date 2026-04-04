/**
 * Recently Viewed / interacted-with properties.
 * Uses localStorage so the profile page can immediately reflect the last
 * properties the user opened, liked, or submitted interest for.
 */

const STORAGE_KEY = 'pg_recently_viewed';
const UPDATE_EVENT = 'pg:recently-viewed:update';
const MAX_ITEMS = 10;

export type RecentPropertyActivity = 'view' | 'like' | 'interest' | 'other';

export interface RecentlyViewedItem {
  propertyId: string;
  viewedAt: number;
  lastAction: RecentPropertyActivity;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function normalizeItems(items: unknown): RecentlyViewedItem[] {
  if (!Array.isArray(items)) return [];

  const seen = new Set<string>();
  return items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const propertyId = typeof item.propertyId === 'string' ? item.propertyId.trim() : '';
      if (!propertyId || seen.has(propertyId)) return null;
      seen.add(propertyId);
      const viewedAt = Number((item as { viewedAt?: number }).viewedAt);
      const lastAction =
        typeof (item as { lastAction?: string }).lastAction === 'string'
          ? ((item as { lastAction?: string }).lastAction as RecentPropertyActivity)
          : 'view';

      return {
        propertyId,
        viewedAt: Number.isFinite(viewedAt) ? viewedAt : Date.now(),
        lastAction,
      };
    })
    .filter((item): item is RecentlyViewedItem => Boolean(item))
    .sort((left, right) => right.viewedAt - left.viewedAt)
    .slice(0, MAX_ITEMS);
}

function persist(items: RecentlyViewedItem[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent<RecentlyViewedItem[]>(UPDATE_EVENT, {
        detail: items,
      }),
    );
  } catch {
    // Best effort only.
  }
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function recordPropertyActivity(
  propertyId: string,
  lastAction: RecentPropertyActivity = 'view',
): void {
  if (!isBrowser() || !propertyId?.trim()) return;

  const items = getRecentlyViewed().filter((item) => item.propertyId !== propertyId);
  items.unshift({
    propertyId: propertyId.trim(),
    viewedAt: Date.now(),
    lastAction,
  });
  persist(items.slice(0, MAX_ITEMS));
  console.log(`[RecentlyViewed] Recorded activity '${lastAction}' for property ${propertyId}. Current count: ${items.length}`);
}

export function addRecentlyViewed(propertyId: string): void {
  recordPropertyActivity(propertyId, 'view');
}

export function getRecentlyViewedIds(limit = 5): string[] {
  return getRecentlyViewed()
    .slice(0, limit)
    .map((item) => item.propertyId);
}

export function subscribeToRecentlyViewed(
  callback: (items: RecentlyViewedItem[]) => void,
) {
  if (!isBrowser()) return () => undefined;

  const handleCustomEvent = (event: Event) => {
    const nextItems = (event as CustomEvent<RecentlyViewedItem[]>).detail || getRecentlyViewed();
    callback(nextItems);
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback(getRecentlyViewed());
    }
  };

  window.addEventListener(UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}
