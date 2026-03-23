import { useState, useCallback } from "react";
import api from "../services/api";
import { type Customer } from "../services/customersService";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Customer[]>("/customer");
      setCustomers(response.data);
    } catch (err: any) {
      setError("Error loading clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    customers,
    loading,
    error,
    loadCustomers,
  };
};
export default useCustomers;
