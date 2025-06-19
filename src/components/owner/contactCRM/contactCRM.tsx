'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

import {
  fetchOwnerContacts,
  updateOwnerContact,
  deleteOwnerContact,
  clearError,
  clearContacts,
} from '@/store/owner/ownerContactCRMSlice';

import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';

interface EditableContact {
  [key: string]: any;
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export default function ContactCRM() {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts, status, error } = useSelector((state: RootState) => state.ownerContactCRM);

  const [editContactId, setEditContactId] = useState<number | null>(null);
  const [editableContact, setEditableContact] = useState<EditableContact>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOwnerContacts());
    return () => {
      dispatch(clearContacts());
      dispatch(clearError());
    };
  }, [dispatch]);

  const stageColors: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-800',
    nurture: 'bg-yellow-100 text-yellow-800',
    conversion: 'bg-purple-100 text-purple-800',
    closed: 'bg-green-100 text-green-800',
    follow_up: 'bg-red-100 text-red-800',
  };

  function startEdit(contact: EditableContact) {
    setEditContactId(contact.id);
    setEditableContact({ ...contact });
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditContactId(null);
    setEditableContact({});
  }

  function onEditInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditableContact((prev) => ({ ...prev, [name]: value }));
  }

  async function saveEditedContact() {
    if (editContactId === null) return;
    await dispatch(updateOwnerContact({ id: editContactId, contact: editableContact }));
    closeEditModal();
  }

  function confirmDeleteContact(id: number) {
    setDeleteContactId(id);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteContactId(null);
    setDeleteModalOpen(false);
  }

  async function deleteContact() {
    if (deleteContactId === null) return;
    await dispatch(deleteOwnerContact(deleteContactId));
    closeDeleteModal();
  }

  const stageOptions = ['lead', 'nurture', 'conversion', 'closed', 'follow_up'];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <HiOutlineUserGroup className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Client CRM Dashboard</h1>
        </div>
      </div>

      {status === 'loading' && <p>Loading contacts...</p>}
      {status === 'failed' && <p className="text-red-600">{error}</p>}
      {status === 'succeeded' && contacts.length === 0 && <p>No contacts found.</p>}

      {status === 'succeeded' && contacts.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-gray-800">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">Client</th>
                 <th className="p-3">Property</th> 
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Message</th>
                <th className="p-3">Project Type</th>
                <th className="p-3">Lead Source</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Last Contact</th>
                <th className="p-3">Next Step</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Competitor</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{contact.client_name}</td>
                      <td className="p-3">{contact.property?.title || '-'}</td> 
                  <td className="p-3">{contact.email}</td>
                  <td className="p-3">{contact.phone_whatsapp || '-'}</td>
                  <td className="p-3 text-gray-600 max-w-xs truncate" title={contact.message || ''}>
                    {contact.message || '-'}
                  </td>
                  <td className="p-3">{contact.project_type || '-'}</td>
                  <td className="p-3">{contact.lead_source || '-'}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${stageColors[contact.stage] || ''}`}>
                      {contact.stage?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(contact.last_contact)}</td>
                  <td className="p-3">{contact.next_step || '-'}</td>
                  <td className="p-3 text-gray-600 max-w-xs truncate" title={contact.notes || ''}>
                    {contact.notes || '-'}
                  </td>
                  <td className="p-3">{contact.competitor || '-'}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => startEdit(contact)}
                      title="Edit"
                      className="p-2 rounded text-blue-600 hover:bg-blue-100"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => confirmDeleteContact(contact.id)}
                      title="Delete"
                      className="p-2 rounded text-red-600 hover:bg-red-100"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeEditModal} aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded shadow-xl max-w-3xl w-full p-6 relative overflow-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-6">Edit Contact</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEditedContact();
                }}
                className="space-y-6"
              >
                <ContactFormFields
                  contact={editableContact}
                  onChange={onEditInputChange}
                  stageOptions={stageOptions}
                />
                <div className="flex justify-end space-x-3 pt-2 sticky bottom-0 bg-white mt-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeDeleteModal} aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded shadow-xl max-w-md w-full p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this contact? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteContact}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Form fields reused in the edit modal
function ContactFormFields({
  contact,
  onChange,
  stageOptions,
}: {
  contact: EditableContact;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  stageOptions: string[];
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Client Name" name="client_name" value={contact.client_name} onChange={onChange} required />
        <Input label="Email" name="email" type="email" value={contact.email} onChange={onChange} required />
        <Input label="Phone/WhatsApp" name="phone_whatsapp" value={contact.phone_whatsapp} onChange={onChange} />
        <Input label="Project Type" name="project_type" value={contact.project_type} onChange={onChange} />
        <Input label="Lead Source" name="lead_source" value={contact.lead_source} onChange={onChange} />
        <Select label="Stage" name="stage" value={contact.stage} options={stageOptions} onChange={onChange} />
        <Input
          label="Last Contact"
          name="last_contact"
          type="date"
          value={contact.last_contact ? formatDate(contact.last_contact) : ''}
          onChange={onChange}
        />
        <Input label="Next Step" name="next_step" type="text" value={contact.next_step || ''} onChange={onChange} />
        <Input label="Competitor" name="competitor" value={contact.competitor} onChange={onChange} />
      </div>
      <TextArea label="Message" name="message" value={contact.message} onChange={onChange} />
      <TextArea label="Notes" name="notes" value={contact.notes} onChange={onChange} />
    </>
  );
}

function Input({ label, name, value, onChange, type = 'text', required = false }: any) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange }: any) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        value={value || ''}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}
