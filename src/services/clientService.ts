import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ClientRecord, ClientStatus, ClientFormData } from '../types/client';

export interface GetClientsOptions {
  searchQuery?: string;
  statusFilter?: ClientStatus;
  categoryFilter?: string;
  page?: number;
  pageSize?: number;
}

export interface GetClientsResult {
  clients: ClientRecord[];
  totalCount: number;
}

export interface CreateClientData extends Omit<ClientFormData, 'organizationLogo'> {
  organizationLogoUrl?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export class ClientService {
  constructor(private supabase: SupabaseClient) {}

  async getClients(options: GetClientsOptions = {}): Promise<GetClientsResult> {
    const {
      searchQuery,
      statusFilter,
      categoryFilter,
      page = 1,
      pageSize = 50,
    } = options;

    let query = this.supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      query = query.or(
        `organization_name.ilike.%${searchQuery}%,tenant_admin_full_name.ilike.%${searchQuery}%,tenant_admin_email.ilike.%${searchQuery}%`
      );
    }

    // Apply status filter
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      query = query.eq('business_category', categoryFilter);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return {
      clients: data || [],
      totalCount: count || 0,
    };
  }

  async getClientById(id: string): Promise<ClientRecord | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch client: ${error.message}`);
    }

    return data;
  }

  async createClient(data: CreateClientData): Promise<ClientRecord> {
    // Get current user ID for audit trail
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const clientData = {
      organization_name: data.organizationName,
      organization_logo_url: data.organizationLogoUrl || null,
      business_category: data.businessCategory,
      tenant_admin_full_name: data.tenantAdminFullName,
      tenant_admin_email: data.tenantAdminEmail,
      tenant_admin_mobile: data.tenantAdminMobile,
      tenant_admin_role: data.tenantAdminRole || null,
      preferred_display_name: data.preferredDisplayName || null,
      brand_color: data.brandColor || null,
      default_time_zone: data.defaultTimeZone || null,
      country_region: data.countryRegion || null,
      draw_frequency: data.drawFrequency || null,
      business_verification_status: data.businessVerificationStatus || null,
      data_usage_consent: data.dataUsageConsent,
      data_privacy_acknowledgment: data.dataPrivacyAcknowledgment,
      primary_contact_person: data.primaryContactPerson || null,
      support_contact_email: data.supportContactEmail || null,
      escalation_contact: data.escalationContact || null,
      status: data.status || 'pending_verification' as ClientStatus,
      created_by: user.id,
      updated_by: user.id,
    };

    const { data: client, error } = await this.supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }

    return client;
  }

  async updateClient(id: string, data: UpdateClientData): Promise<ClientRecord> {
    // Get current user ID for audit trail
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {
      updated_by: user.id,
    };

    // Map form data to database columns
    if (data.organizationName !== undefined)
      updateData.organization_name = data.organizationName;
    if (data.organizationLogoUrl !== undefined)
      updateData.organization_logo_url = data.organizationLogoUrl;
    if (data.businessCategory !== undefined)
      updateData.business_category = data.businessCategory;
    if (data.tenantAdminFullName !== undefined)
      updateData.tenant_admin_full_name = data.tenantAdminFullName;
    if (data.tenantAdminEmail !== undefined)
      updateData.tenant_admin_email = data.tenantAdminEmail;
    if (data.tenantAdminMobile !== undefined)
      updateData.tenant_admin_mobile = data.tenantAdminMobile;
    if (data.tenantAdminRole !== undefined)
      updateData.tenant_admin_role = data.tenantAdminRole;
    if (data.preferredDisplayName !== undefined)
      updateData.preferred_display_name = data.preferredDisplayName;
    if (data.brandColor !== undefined) updateData.brand_color = data.brandColor;
    if (data.defaultTimeZone !== undefined)
      updateData.default_time_zone = data.defaultTimeZone;
    if (data.countryRegion !== undefined)
      updateData.country_region = data.countryRegion;
    if (data.drawFrequency !== undefined)
      updateData.draw_frequency = data.drawFrequency;
    if (data.businessVerificationStatus !== undefined)
      updateData.business_verification_status = data.businessVerificationStatus;
    if (data.dataUsageConsent !== undefined)
      updateData.data_usage_consent = data.dataUsageConsent;
    if (data.dataPrivacyAcknowledgment !== undefined)
      updateData.data_privacy_acknowledgment = data.dataPrivacyAcknowledgment;
    if (data.primaryContactPerson !== undefined)
      updateData.primary_contact_person = data.primaryContactPerson;
    if (data.supportContactEmail !== undefined)
      updateData.support_contact_email = data.supportContactEmail;
    if (data.escalationContact !== undefined)
      updateData.escalation_contact = data.escalationContact;
    if (data.status !== undefined)
      updateData.status = data.status;

    const { data: client, error } = await this.supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update client: ${error.message}`);
    }

    return client;
  }

  async updateClientStatus(id: string, status: ClientStatus): Promise<void> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await this.supabase
      .from('clients')
      .update({
        status,
        updated_by: user.id,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update client status: ${error.message}`);
    }
  }

  async uploadLogo(tenantId: string, file: File): Promise<string> {
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.');
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    // Validate image dimensions
    const dimensions = await this.getImageDimensions(file);
    if (dimensions.width < 512 || dimensions.height < 512) {
      throw new Error('Image dimensions must be at least 512x512 pixels.');
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${tenantId}/logo.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from('organization-logos')
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = this.supabase.storage.from('organization-logos').getPublicUrl(filePath);

    return publicUrl;
  }

  async deleteLogo(tenantId: string): Promise<void> {
    const { data: files, error: listError } = await this.supabase.storage
      .from('organization-logos')
      .list(tenantId);

    if (listError) {
      throw new Error(`Failed to list logos: ${listError.message}`);
    }

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${tenantId}/${file.name}`);
      const { error: deleteError } = await this.supabase.storage
        .from('organization-logos')
        .remove(filePaths);

      if (deleteError) {
        throw new Error(`Failed to delete logo: ${deleteError.message}`);
      }
    }
  }

  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

// Export singleton instance
export const clientService = new ClientService(supabase);
