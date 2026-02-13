import { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import { SearchAndFilter } from './SearchAndFilter';
import { ClientCard } from './ClientCard';
import { Pagination } from './Pagination';
import { ClientStatus } from '../../types/client';
import { useViewport } from '../../hooks/useViewport';

interface ClientListViewProps {
  onAddClient: () => void;
  onEditClient: (clientId: string) => void;
}

export const ClientListView: React.FC<ClientListViewProps> = ({
  onAddClient,
  onEditClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { isMobile } = useViewport();

  const { clients, loading, error, totalCount } = useClients({
    searchQuery,
    statusFilter: statusFilter || undefined,
    categoryFilter: categoryFilter || undefined,
    page,
    pageSize,
  });

  // Extract unique categories from clients
  const categories = Array.from(
    new Set(clients.map((client) => client.business_category))
  ).sort();

  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusBadgeClass = (status: ClientStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading clients: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onAddClient}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 min-h-[44px]"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {isMobile ? 'Add' : 'Add Client'}
        </button>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        onSearchChange={setSearchQuery}
        onStatusFilter={setStatusFilter}
        onCategoryFilter={setCategoryFilter}
        categories={categories}
      />

      {/* Table or Card View */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new client organization.
            </p>
            <div className="mt-6">
              <button
                onClick={onAddClient}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 min-h-[44px]"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Client
              </button>
            </div>
          </div>
        ) : isMobile ? (
          /* Mobile: Card View */
          <div className="p-4 space-y-4">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} onEdit={onEditClient} />
            ))}
          </div>
        ) : (
          /* Desktop: Table View */
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Tenant Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {client.organization_logo_url ? (
                            <img
                              src={client.organization_logo_url}
                              alt={client.organization_name}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-100"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ring-2 ring-purple-100">
                              <span className="text-white font-bold text-sm">
                                {client.organization_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {client.organization_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {client.business_category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.tenant_admin_full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.tenant_admin_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            client.status
                          )}`}
                        >
                          {client.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onEditClient(client.id)}
                          className="text-purple-600 hover:text-purple-900 font-medium transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {/* Pagination */}
        {!loading && clients.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};
