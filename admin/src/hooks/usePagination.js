// usePagination.js - Pagination management hook
import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing paginated data
 * 
 * @param {Array} data - Full array of data to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 10)
 * @param {Object} options - Pagination options
 * @returns {Object} Pagination state and controls
 */
const usePagination = (data = [], itemsPerPage = 10, options = {}) => {
  const {
    initialPage = 1,
    onPageChange,
  } = options;

  // Current page state
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage) || 1;
  }, [data.length, itemsPerPage]);

  // Ensure current page is valid when data changes
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Get paginated data slice
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Calculate indices for display
  const startIndex = useMemo(() => {
    return data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  }, [currentPage, itemsPerPage, data.length]);

  const endIndex = useMemo(() => {
    return Math.min(currentPage * itemsPerPage, data.length);
  }, [currentPage, itemsPerPage, data.length]);

  // Navigation functions
  const goToPage = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    onPageChange?.(validPage);
  }, [totalPages, onPageChange]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Navigation state
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Generate page numbers for pagination UI
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed
      if (start > 2) pages.push('...');

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push('...');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Reset to first page
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    // Current state
    currentPage,
    totalPages,
    totalItems: data.length,
    itemsPerPage,

    // Paginated data
    paginatedData,

    // Index display (1-indexed for UI)
    startIndex,
    endIndex,

    // Navigation functions
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,

    // Navigation state
    hasNextPage,
    hasPrevPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,

    // Page numbers for UI
    pageNumbers,

    // Setter for external control
    setCurrentPage,
  };
};

export default usePagination;
