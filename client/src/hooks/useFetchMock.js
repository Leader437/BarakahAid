// useFetchMock Hook - Mock data fetching
import { useState, useEffect } from 'react';

/**
 * Custom hook for simulating API data fetching
 * @param {Function} fetchFunction - Function that returns a promise
 * @param {Array} dependencies - Dependencies array for re-fetching
 */
const useFetchMock = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const result = await fetchFunction();
        
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const result = await fetchFunction();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default useFetchMock;
