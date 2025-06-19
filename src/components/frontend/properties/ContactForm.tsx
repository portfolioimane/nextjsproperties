'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitContactOwner, ContactFormData } from '@/store/frontend/contactOwnerSlice';

interface Props {
  propertyId: number;
}

export default function ContactForm({ propertyId }: Props) {
  const dispatch = useAppDispatch();
  const { status, error, message: successMessage } = useAppSelector(
    (state) => state.contactOwner
  );

  const [submitted, setSubmitted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: ContactFormData = {
      client_name: clientName,
      email,
      phone_whatsapp: phoneWhatsapp,
      message,
      property_id: propertyId,
    };

    const result = await dispatch(submitContactOwner(payload));

    if (submitContactOwner.fulfilled.match(result)) {
      setSubmitted(true);
      setClientName('');
      setEmail('');
      setPhoneWhatsapp('');
      setMessage('');
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <div className="sticky top-20 self-start p-6 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact the Owner</h2>

      {submitted ? (
        <div className="text-green-600 font-medium text-center">
          {successMessage || 'Thank you! Your message has been sent.'}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'failed' && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="clientName" className="text-sm font-medium text-gray-600">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="clientName"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone (WhatsApp) */}
          <div>
            <label htmlFor="phoneWhatsapp" className="text-sm font-medium text-gray-600">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneWhatsapp"
              type="tel"
              required
              value={phoneWhatsapp}
              onChange={(e) => setPhoneWhatsapp(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+212 600 000 000"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="text-sm font-medium text-gray-600">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type your message..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      )}
    </div>
  );
}
