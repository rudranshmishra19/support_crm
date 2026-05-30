import React from 'react';
import { useTickets } from '../context/TicketContext';

export default function TicketList() {
  const {
    tickets,
    selectedTicket,
    fetchTicketDetails,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loading
  } = useTickets();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Open
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            In Progress
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterTabs = [
    { label: 'All', value: '' },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Closed', value: 'Closed' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-sm"
            placeholder="Search customer, subject, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === tab.value
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ticket List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {loading && tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <svg className="animate-spin h-6 w-6 text-brand-500 mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs">Loading tickets...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <svg className="h-10 w-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm font-medium">No tickets found</span>
          </div>
        ) : (
          tickets.map((ticket) => {
            const isSelected = selectedTicket && selectedTicket.ticket_id === ticket.ticket_id;
            return (
              <button
                key={ticket.ticket_id}
                onClick={() => fetchTicketDetails(ticket.ticket_id)}
                className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 hover:bg-slate-50 ${
                  isSelected
                    ? 'bg-brand-50/70 border-l-4 border-brand-500 pl-3'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold text-brand-600 tracking-wider">
                    {ticket.ticket_id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                  {ticket.subject}
                </h4>
                <div className="flex justify-between items-center w-full mt-1">
                  <span className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[60%]">
                    {ticket.customer_name}
                  </span>
                  {getStatusBadge(ticket.status)}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
