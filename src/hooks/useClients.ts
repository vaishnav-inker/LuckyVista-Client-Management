import { useState, useEffect, useCallback } from 'react';
import { clientService, GetClientsOptions } from '../services/clientService';
import { ClientRecord } from '../types/client';
import { supabase } from '../lib/supabase';

interface UseClientsReturn {
  clients: ClientRecord[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  refetch: () => Promise<void>;
}

export const useClients = (options: GetClientsOptions = {}): UseClientsReturn => {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await clientService.getClients(options);
      setClients(result.clients);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
    } finally {
      setLoading(false);
    }
  }, [
    options.searchQuery,
    options.statusFilter,
    options.categoryFilter,
    options.page,
    options.pageSize,
  ]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
        },
        () => {
          // Refetch clients when any change occurs
          fetchClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    totalCount,
    refetch: fetchClients,
  };
};
