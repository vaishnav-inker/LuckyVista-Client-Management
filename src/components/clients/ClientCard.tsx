import { Client, ClientStatus } from '../../types/client';

interface ClientCardProps {
  client: Client;
  onEdit: (clientId: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      {/* Logo and Organization Name */}
      <div className="flex items-center space-x-3">
        {client.organization_logo_url ? (
          <img
            src={client.organization_logo_url}
            alt={client.organization_name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100 flex-shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ring-2 ring-purple-100 flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {client.organization_name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {client.organization_name}
          </h3>
          <p className="text-sm text-gray-600 truncate">{client.business_category}</p>
        </div>
      </div>

      {/* Tenant Admin Info */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {client.tenant_admin_full_name}
        </p>
        <p className="text-sm text-gray-500 truncate">{client.tenant_admin_email}</p>
      </div>

      {/* Status and Date */}
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
            client.status
          )}`}
        >
          {client.status.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-500">{formatDate(client.created_at)}</span>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(client.id)}
        className="w-full min-h-[44px] px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm"
      >
        Edit Client
      </button>
    </div>
  );
};
