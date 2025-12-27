// useFetch.js - Generic data fetching hook with simulated API delay and error states
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 * Simulates API delay for development, will use real API calls later
 * 
 * @param {string|Function} urlOrFetcher - API URL or custom fetch function
 * @param {Object} options - Fetch options
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @param {number} options.delay - Simulated delay in ms (default: 500)
 * @param {any} options.initialData - Initial data value
 * @param {Function} options.onSuccess - Callback on successful fetch
 * @param {Function} options.onError - Callback on fetch error
 * @returns {Object} { data, loading, error, refetch, setData }
 */
const useFetch = (urlOrFetcher, options = {}) => {
  const {
    immediate = true,
    delay = 500,
    initialData = null,
    onSuccess,
    onError,
    dependencies = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch function
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for development
      if (import.meta.env?.DEV) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      let result;

      if (typeof urlOrFetcher === 'function') {
        // Custom fetch function provided
        result = await urlOrFetcher(params);
      } else if (typeof urlOrFetcher === 'string') {
        // URL provided - use fetch API
        const token = localStorage.getItem('token');
        const response = await fetch(urlOrFetcher, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          ...params,
        });

        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        result = await response.json();
      } else {
        throw new Error('Invalid fetcher provided');
      }

      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching data';
      setError(errorMessage);
      onError?.(err);

      // Log error in development
      if (import.meta.env?.DEV) {
        console.error('useFetch error:', err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [urlOrFetcher, delay, onSuccess, onError]);

  // Refetch function
  const refetch = useCallback((params = {}) => {
    return fetchData(params);
  }, [fetchData]);

  // Fetch on mount if immediate is true
  useEffect(() => {
    if (immediate && urlOrFetcher) {
      fetchData();
    }
  }, [immediate, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refetch,
    setData,
    isLoading: loading,
    isError: !!error,
    isSuccess: !loading && !error && data !== null,
  };
};

/**
 * Helper for POST requests
 */
export const usePost = (url, options = {}) => {
  return useFetch(url, { ...options, immediate: false });
};

/**
 * Helper for mocking API responses in development
 */
export const mockFetch = (data, delay = 500, shouldFail = false) => {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Mock API error'));
        } else {
          resolve(data);
        }
      }, delay);
    });
};

export default useFetch;
