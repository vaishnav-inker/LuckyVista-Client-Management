// Enums
export type ClientStatus = 'active' | 'inactive' | 'pending_verification';
export type VerificationStatus = 'verified' | 'pending' | 'rejected';
export type DrawFrequency = 'weekly' | 'monthly' | 'campaign_based' | 'custom';

// Database record interface (matches Supabase table structure)
export interface ClientRecord {
  id: string;
  tenant_id: string;
  
  // Core Organization Details
  organization_name: string;
  organization_logo_url: string | null;
  business_category: string;
  
  // Tenant Admin Details
  tenant_admin_full_name: string;
  tenant_admin_email: string;
  tenant_admin_mobile: string;
  tenant_admin_role: string | null;
  
  // Branding & Display
  preferred_display_name: string | null;
  brand_color: string | null;
  
  // Operational Details
  default_time_zone: string | null;
  country_region: string | null;
  draw_frequency: DrawFrequency | null;
  
  // Compliance
  business_verification_status: VerificationStatus | null;
  data_usage_consent: boolean;
  data_privacy_acknowledgment: boolean;
  
  // Communication Contacts
  primary_contact_person: string | null;
  support_contact_email: string | null;
  escalation_contact: string | null;
  
  // Status
  status: ClientStatus;
  
  // Audit Trail
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

// Client list item (for table display)
export interface ClientListItem {
  id: string;
  organizationName: string;
  businessCategory: string;
  status: ClientStatus;
  tenantAdminName: string;
  tenantAdminEmail: string;
  createdAt: string;
  logoUrl?: string;
}

// Form data interface
export interface ClientFormData {
  // Core Organization Details
  organizationName: string;
  organizationLogo?: File;
  businessCategory: string;
  
  // Tenant Admin Details
  tenantAdminFullName: string;
  tenantAdminEmail: string;
  tenantAdminMobile: string;
  tenantAdminRole?: string;
  
  // Branding & Display
  preferredDisplayName?: string;
  brandColor?: string;
  
  // Operational Details
  defaultTimeZone?: string;
  countryRegion?: string;
  drawFrequency?: DrawFrequency;
  
  // Compliance
  businessVerificationStatus?: VerificationStatus;
  dataUsageConsent: boolean;
  dataPrivacyAcknowledgment: boolean;
  
  // Communication Contacts
  primaryContactPerson?: string;
  supportContactEmail?: string;
  escalationContact?: string;
  
  // Status
  status?: ClientStatus;
}

// Client entity (domain model)
export interface Client {
  id: string;
  tenantId: string;
  
  organizationName: string;
  organizationLogoUrl?: string;
  businessCategory: string;
  
  tenantAdmin: {
    fullName: string;
    email: string;
    mobile: string;
    role?: string;
  };
  
  branding: {
    preferredDisplayName?: string;
    brandColor?: string;
  };
  
  operational: {
    defaultTimeZone?: string;
    countryRegion?: string;
    drawFrequency?: DrawFrequency;
  };
  
  compliance: {
    businessVerificationStatus?: VerificationStatus;
    dataUsageConsent: boolean;
    dataPrivacyAcknowledgment: boolean;
  };
  
  contacts: {
    primaryContactPerson?: string;
    supportContactEmail?: string;
    escalationContact?: string;
  };
  
  status: ClientStatus;
  
  audit: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  };
}
