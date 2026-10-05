const HISTORY_KEY = 'foundermind_history';

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
};

export const saveAnalysis = (result) => {
  try {
    const history = getHistory();
    const existingIndex = history.findIndex((h) => h.id === result.id);
    
    if (existingIndex >= 0) {
      history[existingIndex] = result;
    } else {
      history.unshift(result);
    }
    
    // Keep last 50 items
    const trimmed = history.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save analysis:', e);
  }
};

export const deleteAnalysis = (id) => {
  try {
    const history = getHistory();
    const filtered = history.filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete analysis:', e);
  }
};
