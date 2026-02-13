import { useClientForm } from '../../hooks/useClientForm';
import { LogoUpload } from './LogoUpload';
import { DrawFrequency, VerificationStatus, ClientStatus } from '../../types/client';

interface ClientFormProps {
  clientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  clientId,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    errors,
    loading,
    submitting,
    handleChange,
    handleSubmit,
    handleLogoUpload,
    setFieldError,
  } = useClientForm({ clientId, onSuccess });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Common input class for larger fields like login page
  const inputClass = (hasError: boolean) => `
    block w-full px-4 py-2.5 border rounded-lg h-11
    focus:outline-none focus:ring-2 transition-colors
    bg-gray-50 text-gray-900 placeholder-gray-400
    ${hasError 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
    }
  `;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {/* Core Organization Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Core Organization Details
        </h3>
        <div className="space-y-5">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleChange('organizationName', e.target.value)}
              className={inputClass(!!errors.organizationName)}
              placeholder="Enter organization name"
            />
            {errors.organizationName && (
              <p className="mt-2 text-sm text-red-600">{errors.organizationName}</p>
            )}
          </div>

          <div>
            <LogoUpload
              currentLogoUrl={formData.organizationLogo ? undefined : undefined}
              onUpload={handleLogoUpload}
              onError={(error) => setFieldError('organizationLogo', error)}
              disabled={submitting}
            />
            {errors.organizationLogo && (
              <p className="mt-2 text-sm text-red-600">{errors.organizationLogo}</p>
            )}
          </div>

          <div>
            <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Business Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessCategory"
              value={formData.businessCategory}
              onChange={(e) => handleChange('businessCategory', e.target.value)}
              className={inputClass(!!errors.businessCategory)}
              placeholder="e.g., Retail, Automotive, Entertainment"
            />
            {errors.businessCategory && (
              <p className="mt-2 text-sm text-red-600">{errors.businessCategory}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tenant Admin Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Authorized Tenant Admin Details
        </h3>
        <div className="space-y-5">
          <div>
            <label htmlFor="tenantAdminFullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="tenantAdminFullName"
              value={formData.tenantAdminFullName}
              onChange={(e) => handleChange('tenantAdminFullName', e.target.value)}
              className={inputClass(!!errors.tenantAdminFullName)}
              placeholder="Enter admin full name"
            />
            {errors.tenantAdminFullName && (
              <p className="mt-2 text-sm text-red-600">{errors.tenantAdminFullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="tenantAdminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="tenantAdminEmail"
                value={formData.tenantAdminEmail}
                onChange={(e) => handleChange('tenantAdminEmail', e.target.value)}
                className={inputClass(!!errors.tenantAdminEmail)}
                placeholder="admin@example.com"
              />
              {errors.tenantAdminEmail && (
                <p className="mt-2 text-sm text-red-600">{errors.tenantAdminEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="tenantAdminMobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="tenantAdminMobile"
                value={formData.tenantAdminMobile}
                onChange={(e) => handleChange('tenantAdminMobile', e.target.value)}
                className={inputClass(!!errors.tenantAdminMobile)}
                placeholder="+1234567890"
              />
              {errors.tenantAdminMobile && (
                <p className="mt-2 text-sm text-red-600">{errors.tenantAdminMobile}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="tenantAdminRole" className="block text-sm font-medium text-gray-700 mb-2">
              Role / Designation
            </label>
            <input
              type="text"
              id="tenantAdminRole"
              value={formData.tenantAdminRole || ''}
              onChange={(e) => handleChange('tenantAdminRole', e.target.value)}
              className={inputClass(false)}
              placeholder="e.g., CEO, Operations Manager"
            />
          </div>
        </div>
      </div>

      {/* Branding & Display Preferences */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Branding & Display Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="preferredDisplayName" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Display Name
            </label>
            <input
              type="text"
              id="preferredDisplayName"
              value={formData.preferredDisplayName || ''}
              onChange={(e) => handleChange('preferredDisplayName', e.target.value)}
              className={inputClass(false)}
              placeholder="Display name for posters"
            />
          </div>

          <div>
            <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700 mb-2">
              Brand Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="brandColor"
                value={formData.brandColor || '#000000'}
                onChange={(e) => handleChange('brandColor', e.target.value)}
                className="h-11 w-20 rounded-lg border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.brandColor || ''}
                onChange={(e) => handleChange('brandColor', e.target.value)}
                className={inputClass(!!errors.brandColor)}
                placeholder="#000000"
              />
            </div>
            {errors.brandColor && (
              <p className="mt-2 text-sm text-red-600">{errors.brandColor}</p>
            )}
          </div>
        </div>
      </div>

      {/* Operational & Configuration Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Operational & Configuration Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="defaultTimeZone" className="block text-sm font-medium text-gray-700 mb-2">
              Default Time Zone
            </label>
            <select
              id="defaultTimeZone"
              value={formData.defaultTimeZone || ''}
              onChange={(e) => handleChange('defaultTimeZone', e.target.value)}
              className={inputClass(!!errors.defaultTimeZone)}
            >
              <option value="">Select timezone</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Chicago">America/Chicago (CST)</option>
              <option value="America/Denver">America/Denver (MST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
            {errors.defaultTimeZone && (
              <p className="mt-2 text-sm text-red-600">{errors.defaultTimeZone}</p>
            )}
          </div>

          <div>
            <label htmlFor="countryRegion" className="block text-sm font-medium text-gray-700 mb-2">
              Country / Region
            </label>
            <input
              type="text"
              id="countryRegion"
              value={formData.countryRegion || ''}
              onChange={(e) => handleChange('countryRegion', e.target.value)}
              className={inputClass(false)}
              placeholder="e.g., United States, India"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="drawFrequency" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Draw Frequency
            </label>
            <select
              id="drawFrequency"
              value={formData.drawFrequency || ''}
              onChange={(e) => handleChange('drawFrequency', e.target.value as DrawFrequency)}
              className={inputClass(false)}
            >
              <option value="">Select frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="campaign_based">Campaign Based</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance & Verification */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Compliance & Verification
        </h3>
        <div className="space-y-5">
          <div>
            <label htmlFor="businessVerificationStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Business Verification Status
            </label>
            <select
              id="businessVerificationStatus"
              value={formData.businessVerificationStatus || ''}
              onChange={(e) => {
                const newVerificationStatus = e.target.value as VerificationStatus;
                handleChange('businessVerificationStatus', newVerificationStatus);
                
                // Automatically update client status based on verification status
                if (newVerificationStatus === 'verified') {
                  handleChange('status', 'active');
                } else if (newVerificationStatus === 'rejected') {
                  handleChange('status', 'inactive');
                } else if (newVerificationStatus === 'pending') {
                  handleChange('status', 'pending_verification');
                }
              }}
              className={inputClass(false)}
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Changing this will automatically update the client status
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Client Status
            </label>
            <select
              id="status"
              value={formData.status || 'pending_verification'}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClass(false)}
            >
              <option value="pending_verification">Pending Verification</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Controls whether the client can access the system
            </p>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <input
                id="dataUsageConsent"
                type="checkbox"
                checked={formData.dataUsageConsent}
                onChange={(e) => handleChange('dataUsageConsent', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="dataUsageConsent" className="font-medium text-gray-700">
                Consent for participant data usage
              </label>
              <p className="text-gray-500 mt-1">
                Organization has provided consent to collect and use participant data
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <input
                id="dataPrivacyAcknowledgment"
                type="checkbox"
                checked={formData.dataPrivacyAcknowledgment}
                onChange={(e) => handleChange('dataPrivacyAcknowledgment', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="dataPrivacyAcknowledgment" className="font-medium text-gray-700">
                Data privacy acknowledgment
              </label>
              <p className="text-gray-500 mt-1">
                Organization acknowledges data privacy requirements and regulations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communication & Support Contacts */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Communication & Support Contacts
        </h3>
        <div className="space-y-5">
          <div>
            <label htmlFor="primaryContactPerson" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Contact Person
            </label>
            <input
              type="text"
              id="primaryContactPerson"
              value={formData.primaryContactPerson || ''}
              onChange={(e) => handleChange('primaryContactPerson', e.target.value)}
              className={inputClass(false)}
              placeholder="Contact person name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="supportContactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Support Contact Email
              </label>
              <input
                type="email"
                id="supportContactEmail"
                value={formData.supportContactEmail || ''}
                onChange={(e) => handleChange('supportContactEmail', e.target.value)}
                className={inputClass(!!errors.supportContactEmail)}
                placeholder="support@example.com"
              />
              {errors.supportContactEmail && (
                <p className="mt-2 text-sm text-red-600">{errors.supportContactEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="escalationContact" className="block text-sm font-medium text-gray-700 mb-2">
                Escalation Contact (Optional)
              </label>
              <input
                type="email"
                id="escalationContact"
                value={formData.escalationContact || ''}
                onChange={(e) => handleChange('escalationContact', e.target.value)}
                className={inputClass(!!errors.escalationContact)}
                placeholder="escalation@example.com"
              />
              {errors.escalationContact && (
                <p className="mt-2 text-sm text-red-600">{errors.escalationContact}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px]"
        >
          {submitting ? 'Saving...' : clientId ? 'Update Client' : 'Create Client'}
        </button>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
