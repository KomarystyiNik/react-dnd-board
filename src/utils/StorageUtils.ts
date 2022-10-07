const saveData = (key: string, value: unknown) => {
  if (typeof value === 'function') return;

  localStorage.setItem(key, JSON.stringify(value));
};

const getData = <T = string>(key: string): T | null => {
  const value = localStorage.getItem(key);

  if (!value) return null;

  try {
    const parsedValue = JSON.parse(value);

    return parsedValue as T;
  } catch {
    return value as T;
  }
};

export { saveData, getData };
