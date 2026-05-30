import React, { useState } from 'react';
import { TicketProvider, useTickets } from './context/TicketContext';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import CreateTicketModal from './components/CreateTicketModal';

function MainApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedTicket } = useTickets();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header / Navbar */}
      <header className="bg-slate-900 text-white py-4 px-6 flex justify-between items-center shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 0A7.5 7.5 0 105.146 19.82m10.038-10.998L20.5 4.5M10.146 15.82a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight flex items-center gap-1.5 leading-none">
              DataStraw <span className="text-xs px-2 py-0.5 rounded-md bg-brand-500 text-white font-extrabold uppercase">CRM</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Customer Support Ticketing Hub</p>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all scale-100 hover:scale-[1.02] active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / List - Hidden on mobile if a ticket is selected */}
        <div
          className={`${
            selectedTicket ? 'hidden md:flex' : 'flex'
          } w-full md:w-[380px] shrink-0 h-full flex-col`}
        >
          <TicketList />
        </div>

        {/* Details Pane - Hidden on mobile if no ticket is selected */}
        <div
          className={`${
            selectedTicket ? 'flex' : 'hidden md:flex'
          } flex-1 h-full flex-col`}
        >
          <TicketDetails />
        </div>
      </div>

      {/* New Ticket Modal */}
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <TicketProvider>
      <MainApp />
    </TicketProvider>
  );
}
