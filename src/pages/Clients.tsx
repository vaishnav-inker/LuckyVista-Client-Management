import { useState } from 'react';
import { ClientListView } from '../components/clients/ClientListView';
import { ClientForm } from '../components/clients/ClientForm';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const handleAddClient = () => {
    setEditingClientId(null);
    setShowForm(true);
  };

  const handleEditClient = (clientId: string) => {
    setEditingClientId(clientId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClientId(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingClientId(null);
  };

  if (showForm) {
    return (
      <DashboardLayout title={editingClientId ? 'Edit Client' : 'Add New Client'}>
        <div className="mb-6">
          <button
            onClick={handleCloseForm}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Client List
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ClientForm
            clientId={editingClientId || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Client Management">
      <ClientListView
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
      />
    </DashboardLayout>
  );
};
