import { useState, useEffect } from 'react';
import { fetchAllProperties, searchProperties, getPropertyStats, validateAirtableConnection } from '../services/airtableService';

export const useAirtableProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('connecting');

      // まず接続をテスト
      const connectionTest = await validateAirtableConnection();
      if (!connectionTest.success) {
        throw new Error(`Airtable connection failed: ${connectionTest.error}`);
      }
      
      setConnectionStatus('connected');
      console.log('🔗 Airtable connection validated');

      // データを取得
      const data = await fetchAllProperties();
      setProperties(data);

      // 統計情報も取得
      const statsData = await getPropertyStats();
      setStats(statsData);

      console.log(`✅ Loaded ${data.length} properties from Airtable`);
    } catch (err) {
      setError(err.message);
      setConnectionStatus('error');
      console.error('❌ Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchPropertiesWithFilters = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await searchProperties(filters);
      setProperties(data);
      
      console.log(`🔍 Search returned ${data.length} properties`);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error searching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProperties = () => {
    console.log('🔄 Refreshing properties...');
    loadProperties();
  };

  // 初回読み込み
  useEffect(() => {
    loadProperties();
  }, []);

  // デバッグ情報
  useEffect(() => {
    if (properties.length > 0) {
      console.log('📊 Current properties state:', {
        count: properties.length,
        withCoordinates: properties.filter(p => p.coordinates).length,
        withImages: properties.filter(p => p.images.length > 0).length,
        types: [...new Set(properties.map(p => p.type))],
        wards: [...new Set(properties.map(p => p.ward).filter(Boolean))]
      });
    }
  }, [properties]);

  return {
    properties,
    loading,
    error,
    stats,
    connectionStatus,
    searchPropertiesWithFilters,
    refreshProperties
  };
};

export default useAirtableProperties;