// Shared Barangay Officials Store & Real-Time Synchronization Engine for Brgy360
// Synchronizes Admin Console (admin.html) and Public Website (index.html)

export const OFFICIALS_STORAGE_KEY = 'brgy360_officials';
export const OFFICIALS_SYNC_EVENT = 'brgy360_officials_changed';
export const OFFICIALS_CHANNEL_NAME = 'brgy360_officials_channel';

export const DEFAULT_OFFICIALS = [
  {
    id: 1,
    name: 'Romy D. Catilo',
    position: 'Punong Barangay',
    role: 'Executive Leadership & Council Presiding Officer',
    contact: '0917 512 8843',
    schedule: 'Monday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r1c1',
    isLeader: true,
    avatarSvgType: 'star'
  },
  {
    id: 2,
    name: 'Ricardo C. Villestas',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Peace & Order and Public Safety',
    contact: '0918 226 7741',
    schedule: 'Tuesday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r1c2',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 3,
    name: 'Jesus M. Bagos',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Appropriations, Ways & Means',
    contact: '0920 445 9128',
    schedule: 'Wednesday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r1c3',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 4,
    name: 'Lucila D. Macalalad',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Health, Sanitation & Cleanliness',
    contact: '0921 337 6605',
    schedule: 'Thursday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r1c4',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 5,
    name: 'Ma. Victoria M. Marasigan',
    position: 'Brgy. Secretary',
    role: 'Barangay Secretariat, Records & Civil Registry',
    contact: '0939 550 1186',
    schedule: 'Monday - Friday, 8:00 AM - 5:00 PM',
    term: 'Appointed',
    status: 'Active',
    gridClass: 'official-r1c5',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 6,
    name: 'Aldrin P. Abraham',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Public Works, Infrastructure & Drainage',
    contact: '0927 118 4432',
    schedule: 'Monday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r2c1',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 7,
    name: 'Christopher M. Santos',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Education, Youth & Sports Development',
    contact: '0928 904 5576',
    schedule: 'Tuesday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r2c2',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 8,
    name: 'Emelia C. Obsioma',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Social Services, Women & Senior Citizens',
    contact: '0935 672 3390',
    schedule: 'Wednesday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r2c3',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 9,
    name: 'Ismael A. Catilo',
    position: 'Sangguniang Barangay Member',
    role: 'Committee on Agriculture, Livelihood & Environment',
    contact: '0936 221 8847',
    schedule: 'Thursday, 8:00 AM - 5:00 PM',
    term: '2023 - 2026',
    status: 'Active',
    gridClass: 'official-r2c4',
    isLeader: false,
    avatarSvgType: 'user'
  },
  {
    id: 10,
    name: 'Mennen M. Bolos',
    position: 'Brgy. Treasurer',
    role: 'Fiscal Management, Custody of Funds & Disbursements',
    contact: '0945 883 2274',
    schedule: 'Monday - Friday, 8:00 AM - 5:00 PM',
    term: 'Appointed',
    status: 'Active',
    gridClass: 'official-r2c5',
    isLeader: false,
    avatarSvgType: 'user'
  }
];

export function escapeOfficialHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Load officials from localStorage, seeding with DEFAULT_OFFICIALS if not present.
 */
export function loadOfficials() {
  try {
    const raw = localStorage.getItem(OFFICIALS_STORAGE_KEY);
    if (!raw) {
      saveOfficials(DEFAULT_OFFICIALS, false);
      return [...DEFAULT_OFFICIALS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveOfficials(DEFAULT_OFFICIALS, false);
    return [...DEFAULT_OFFICIALS];
  } catch (err) {
    console.warn('[OfficialsStore] Error parsing officials from localStorage, reverting to defaults:', err);
    return [...DEFAULT_OFFICIALS];
  }
}

/**
 * Save officials array to localStorage and notify listeners across tabs and components.
 */
export function saveOfficials(officialsList, notify = true) {
  try {
    localStorage.setItem(OFFICIALS_STORAGE_KEY, JSON.stringify(officialsList));
    if (notify) {
      // Dispatch in-page event
      window.dispatchEvent(new CustomEvent(OFFICIALS_SYNC_EVENT, { detail: officialsList }));

      // Also trigger a synthetic storage event for same-tab listeners
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: OFFICIALS_STORAGE_KEY,
          newValue: JSON.stringify(officialsList)
        }));
      } catch (_) {}

      // Cross-tab broadcast channel
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const ch = new BroadcastChannel(OFFICIALS_CHANNEL_NAME);
          ch.postMessage({ type: 'OFFICIALS_UPDATED', data: officialsList });
          ch.close();
        } catch (_) {}
      }
    }
    return true;
  } catch (err) {
    console.error('[OfficialsStore] Failed to save officials:', err);
    return false;
  }
}

/**
 * Update a single official by ID and persist changes.
 */
export function updateOfficial(id, updatedFields) {
  const current = loadOfficials();
  const numericId = Number(id);
  const index = current.findIndex(o => Number(o.id) === numericId);
  if (index === -1) {
    console.warn(`[OfficialsStore] Official with ID ${id} not found.`);
    return null;
  }

  current[index] = {
    ...current[index],
    ...updatedFields,
    id: numericId // Ensure ID is preserved
  };

  saveOfficials(current, true);
  return current[index];
}

/**
 * Reset all officials back to default roster
 */
export function resetOfficialsToDefault() {
  saveOfficials(DEFAULT_OFFICIALS, true);
  return [...DEFAULT_OFFICIALS];
}

/**
 * Subscribe to officials updates (both custom event and cross-tab storage changes)
 */
export function subscribeOfficials(callback) {
  if (typeof callback !== 'function') return () => {};

  const handleCustom = (e) => {
    callback(e.detail || loadOfficials());
  };

  const handleStorage = (e) => {
    if (e.key === OFFICIALS_STORAGE_KEY) {
      callback(loadOfficials());
    }
  };

  window.addEventListener(OFFICIALS_SYNC_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);

  let broadcastCh = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      broadcastCh = new BroadcastChannel(OFFICIALS_CHANNEL_NAME);
      broadcastCh.onmessage = (msg) => {
        if (msg.data && msg.data.type === 'OFFICIALS_UPDATED') {
          callback(msg.data.data || loadOfficials());
        }
      };
    } catch (_) {}
  }

  return () => {
    window.removeEventListener(OFFICIALS_SYNC_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
    if (broadcastCh) {
      broadcastCh.close();
    }
  };
}
