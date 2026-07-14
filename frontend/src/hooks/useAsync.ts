import { useCallback, useEffect, useRef, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Run an async function on mount and whenever `deps` change. Guards against
 * setting state after unmount. `fn` should be stable or defined inline (the
 * latest closure is always used).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    fn()
      .then((result) => {
        if (mounted.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (mounted.current) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { data, loading, error, reload: run };
}
