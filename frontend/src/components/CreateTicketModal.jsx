import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';

export default function CreateTicketModal({ isOpen, onClose }) {
  const { createTicket } = useTickets();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await createTicket(formData);
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        subject: '',
        description: '',
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit ticket. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal content */}
        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl border border-slate-100 sm:align-middle">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
              Create New Support Ticket
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="customer_name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Customer Name
              </label>
              <input
                id="customer_name"
                type="text"
                name="customer_name"
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                placeholder="Enter customer's full name"
                value={formData.customer_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Customer Email
              </label>
              <input
                id="customer_email"
                type="email"
                name="customer_email"
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                placeholder="customer@example.com"
                value={formData.customer_email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                placeholder="Brief summary of the issue"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                placeholder="Provide detailed description of the support inquiry..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
