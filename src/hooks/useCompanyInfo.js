import { useState, useEffect } from 'react';
import { fetchCompanyInfo } from '../services/companyService';

export const useCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCompanyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchCompanyInfo();
      setCompanyInfo(data);
      
      console.log('🏢 Company info loaded successfully');
    } catch (err) {
      setError(err.message);
      console.error('❌ Error loading company info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  return {
    companyInfo,
    loading,
    error,
    refreshCompanyInfo: loadCompanyInfo
  };
};

export default useCompanyInfo;