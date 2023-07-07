export function useSessionStorage(key, value) {
  if (sessionStorage.getItem(key)) return true

  sessionStorage.setItem(key, value);
  return false
}