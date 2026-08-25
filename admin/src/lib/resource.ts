/**
 * The eighty lines that stand in for a data-fetching library.
 *
 * Deliberately small: load once, expose { data, error, loading, reload }, and
 * let a mutation call reload() explicitly. No cache, no dedupe, no background
 * revalidation — none of which this panel needs, and all of which would be a
 * dependency larger than the app using it.
 */
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api.ts';

export type Resource<T> = {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  reload: () => void;
};

export function useResource<T>(load: () => Promise<T>, deps: unknown[] = []): Resource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps);

  useEffect(() => {
    let live = true;
    setLoading(true);
    run()
      .then((value) => {
        // Guard against a resolved request from a view the user has left.
        if (live) {
          setData(value);
          setError(null);
        }
      })
      .catch((cause) => {
        if (live) setError(cause instanceof ApiError ? cause : new ApiError('unknown', 0, String(cause)));
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [run, nonce]);

  return { data, error, loading, reload: () => setNonce((n) => n + 1) };
}

/** Tracks one in-flight mutation, so a button can disable itself honestly. */
export function useMutation<A extends unknown[], T>(fn: (...args: A) => Promise<T>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const run = async (...args: A): Promise<T | null> => {
    setBusy(true);
    setError(null);
    try {
      return await fn(...args);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause : new ApiError('unknown', 0, String(cause)));
      return null;
    } finally {
      setBusy(false);
    }
  };

  return { run, busy, error, clearError: () => setError(null) };
}
