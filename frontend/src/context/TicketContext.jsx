import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const TicketContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL + '/api';

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // empty string means "All"

  // Fetch tickets based on current filters
  const fetchTickets = useCallback(async (status = statusFilter, query = search) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/tickets`;
      const params = [];
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (query) params.push(`search=${encodeURIComponent(query)}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching tickets: ${response.statusText}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  // Fetch ticket details by ticket_id
  const fetchTicketDetails = useCallback(async (ticketId) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
      if (!response.ok) {
        throw new Error(`Error fetching ticket details: ${response.statusText}`);
      }
      const data = await response.json();
      setSelectedTicket(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch ticket details');
      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  // Create new ticket
  const createTicket = async (ticketData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create ticket');
      }
      const result = await response.json();
      // Re-fetch list to include new ticket
      await fetchTickets();
      return result;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status and notes
  const updateTicket = async (ticketId, status, notes) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update ticket');
      }
      const result = await response.json();
      
      // Update selected ticket details if it is the one being updated
      if (selectedTicket && selectedTicket.ticket_id === ticketId) {
        await fetchTicketDetails(ticketId);
      }
      
      // Re-fetch list to update statuses in the sidebar
      await fetchTickets();
      return result;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Trigger search fetch on filter/search change
  useEffect(() => {
    // Fetch tickets with debounce or immediately
    const delayDebounceFn = setTimeout(() => {
      fetchTickets(statusFilter, search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [statusFilter, search, fetchTickets]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        selectedTicket,
        setSelectedTicket,
        loading,
        detailsLoading,
        error,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        fetchTickets,
        fetchTicketDetails,
        createTicket,
        updateTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
