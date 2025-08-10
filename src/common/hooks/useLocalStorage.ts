import { ActionDispatch, Reducer, useEffect, useReducer } from "react";

interface UseLocalStorageProps<T, A> {
  key: string;
  initialValue: T;
  reducer: Reducer<T, A>;
}

export function useLocalStorage<T, A>({
  key,
  initialValue,
  reducer,
}: UseLocalStorageProps<T, A>): [T, ActionDispatch<[A]>] {
  const persistedData = window.localStorage.getItem(key);
  const [state, dispatch] = useReducer<T, [A]>(
    reducer,
    persistedData ? JSON.parse(persistedData) : initialValue,
  );

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
}
