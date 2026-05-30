import React, { useState, useEffect } from 'react';
import { useTickets } from '../context/TicketContext';

export default function TicketDetails() {
  const { selectedTicket, updateTicket, detailsLoading, setSelectedTicket } = useTickets();
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state with selected ticket
  useEffect(() => {
    if (selectedTicket) {
      setStatus(selectedTicket.status);
      setNewNote('');
    }
  }, [selectedTicket]);

  if (!selectedTicket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-8 text-slate-400 text-center h-full">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-300">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-700 mb-1">No Ticket Selected</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Choose a ticket from the left sidebar or create a new one to view details, update status, and manage team collaboration notes.
        </p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!status) return;
    
    setUpdating(true);
    setSuccessMsg('');
    try {
      await updateTicket(selectedTicket.ticket_id, status, newNote);
      setNewNote('');
      setSuccessMsg('Ticket updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'CS';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-y-auto">
      {detailsLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Header Panel */}
          <div className="bg-white p-6 border-b border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="md:hidden mt-0.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all mr-1"
                title="Back to List"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 tracking-wider">
                    {selectedTicket.ticket_id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Opened {formatDate(selectedTicket.created_at)}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-snug">
                  {selectedTicket.subject}
                </h2>
              </div>
            </div>
            
            {/* Status Change Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="ticket-status-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status:
              </label>
              <select
                id="ticket-status-select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  // Automatically trigger status update when changed
                  updateTicket(selectedTicket.ticket_id, e.target.value, '');
                }}
                className={`text-sm font-semibold py-1.5 px-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all ${
                  status === 'Open'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : status === 'In Progress'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="p-6 space-y-6 max-w-4xl">
            {/* Customer Information Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-base font-extrabold shadow-inner">
                {getInitials(selectedTicket.customer_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Customer</p>
                <h4 className="text-base font-bold text-slate-800 truncate">
                  {selectedTicket.customer_name}
                </h4>
                <p className="text-sm text-slate-500 truncate font-medium">
                  {selectedTicket.customer_email}
                </p>
              </div>
            </div>

            {/* Ticket Description */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Description
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedTicket.description}
              </p>
            </div>

            {/* Note Entry Form & Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-6">
              <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <svg className="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Team Collaboration & Activity Logs
              </h4>

              {/* Note input form */}
              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label htmlFor="new-note-textarea" className="sr-only">Add collaborative note</label>
                  <textarea
                    id="new-note-textarea"
                    rows="3"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                    placeholder="Type an internal note, progress update, or resolution details here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-emerald-600">{successMsg}</span>
                  <button
                    type="submit"
                    disabled={updating || !newNote.trim()}
                    className="inline-flex items-center px-4 py-2 bg-brand-600 border border-transparent rounded-xl text-xs font-bold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Saving...' : 'Add Note & Save'}
                  </button>
                </div>
              </form>

              {/* Notes List Timeline */}
              <div className="pt-4 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Note History ({selectedTicket.notes?.length || 0})
                </h5>
                
                {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {selectedTicket.notes.map((note, noteIdx) => (
                        <li key={note.id}>
                          <div className="relative pb-8">
                            {noteIdx !== selectedTicket.notes.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center ring-8 ring-white">
                                  <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                <div className="text-sm text-slate-800">
                                  <p className="font-semibold text-slate-700 text-xs mb-0.5">Support Agent</p>
                                  <p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                                    {note.note_text}
                                  </p>
                                </div>
                                <div className="text-right text-xs whitespace-nowrap text-slate-400 font-medium">
                                  <time dateTime={note.created_at}>{formatDate(note.created_at)}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <span className="text-xs font-semibold">No notes added to this ticket yet. Add a note above to record work.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
