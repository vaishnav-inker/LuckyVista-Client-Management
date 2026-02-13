import { useState, useEffect } from 'react';
import { clientService } from '../services/clientService';
import { ClientFormData, ClientRecord } from '../types/client';
import { validateClientForm, ValidationErrors } from '../utils/validation';
import { supabase } from '../lib/supabase';

interface UseClientFormOptions {
  clientId?: string;
  onSuccess: () => void;
}

interface UseClientFormReturn {
  formData: ClientFormData;
  errors: ValidationErrors;
  loading: boolean;
  submitting: boolean;
  handleChange: (field: keyof ClientFormData, value: any) => void;
  handleSubmit: () => Promise<void>;
  handleLogoUpload: (file: File) => Promise<string>;
  setFieldError: (field: string, error: string) => void;
  clearError: (field: string) => void;
}

const initialFormData: ClientFormData = {
  organizationName: '',
  businessCategory: '',
  tenantAdminFullName: '',
  tenantAdminEmail: '',
  tenantAdminMobile: '',
  dataUsageConsent: false,
  dataPrivacyAcknowledgment: false,
  status: 'pending_verification',
};

export const useClientForm = (options: UseClientFormOptions): UseClientFormReturn => {
  const { clientId, onSuccess } = options;
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | undefined>();

  // Load existing client data if editing
  useEffect(() => {
    if (clientId) {
      loadClientData(clientId);
    }
  }, [clientId]);

  // Reload client data when it changes in the database (real-time updates)
  useEffect(() => {
    if (!clientId) return;

    const channel = supabase
      .channel(`client-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'clients',
          filter: `id=eq.${clientId}`,
        },
        (payload) => {
          console.log('Client updated in database:', payload);
          // Reload the client data when it's updated
          if (payload.new) {
            const updatedClient = payload.new as ClientRecord;
            setFormData(mapClientRecordToFormData(updatedClient));
            setLogoUrl(updatedClient.organization_logo_url || undefined);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  const loadClientData = async (id: string) => {
    try {
      setLoading(true);
      const client = await clientService.getClientById(id);
      if (client) {
        setFormData(mapClientRecordToFormData(client));
        setLogoUrl(client.organization_logo_url || undefined);
      }
    } catch (error) {
      console.error('Failed to load client:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapClientRecordToFormData = (client: ClientRecord): ClientFormData => {
    return {
      organizationName: client.organization_name,
      businessCategory: client.business_category,
      tenantAdminFullName: client.tenant_admin_full_name,
      tenantAdminEmail: client.tenant_admin_email,
      tenantAdminMobile: client.tenant_admin_mobile,
      tenantAdminRole: client.tenant_admin_role || undefined,
      preferredDisplayName: client.preferred_display_name || undefined,
      brandColor: client.brand_color || undefined,
      defaultTimeZone: client.default_time_zone || undefined,
      countryRegion: client.country_region || undefined,
      drawFrequency: client.draw_frequency || undefined,
      businessVerificationStatus: client.business_verification_status || undefined,
      dataUsageConsent: client.data_usage_consent,
      dataPrivacyAcknowledgment: client.data_privacy_acknowledgment,
      primaryContactPerson: client.primary_contact_person || undefined,
      supportContactEmail: client.support_contact_email || undefined,
      escalationContact: client.escalation_contact || undefined,
      status: client.status,
    };
  };

  const handleChange = (field: keyof ClientFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLogoUpload = async (file: File): Promise<string> => {
    // Store the file in form data for later upload
    setFormData((prev) => ({
      ...prev,
      organizationLogo: file,
    }));
    clearError('organizationLogo');
    return ''; // Return empty string, actual upload happens on form submit
  };

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setErrors({});

      // Validate form data
      const validationErrors = await validateClientForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      let uploadedLogoUrl = logoUrl;

      // Upload logo if a new file is provided
      if (formData.organizationLogo instanceof File) {
        // For new clients, we need to create the client first to get tenant_id
        // For existing clients, we can upload immediately
        if (clientId) {
          const client = await clientService.getClientById(clientId);
          if (client) {
            uploadedLogoUrl = await clientService.uploadLogo(
              client.tenant_id,
              formData.organizationLogo
            );
          }
        }
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        organizationLogoUrl: uploadedLogoUrl,
      };
      delete (submitData as any).organizationLogo;

      if (clientId) {
        // Update existing client
        await clientService.updateClient(clientId, submitData);
        
        // Reload the client data to get fresh values from database
        await loadClientData(clientId);
      } else {
        // Create new client
        const newClient = await clientService.createClient(submitData);
        
        // Upload logo after client creation if file is provided
        if (formData.organizationLogo instanceof File) {
          const logoUrl = await clientService.uploadLogo(
            newClient.tenant_id,
            formData.organizationLogo
          );
          // Update client with logo URL
          await clientService.updateClient(newClient.id, {
            organizationLogoUrl: logoUrl,
          });
        }
      }

      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save client';
      setFieldError('submit', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    submitting,
    handleChange,
    handleSubmit,
    handleLogoUpload,
    setFieldError,
    clearError,
  };
};
