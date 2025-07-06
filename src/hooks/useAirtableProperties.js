import {useState, useEffect} from 'react';
import {
  fetchAllProperties, 
  searchProperties, 
  getPropertyStats, 
  validateAirtableConnection
} from '../services/airtableService';

export const useAirtableProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const loadProperties = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      setConnectionStatus('connecting');

      console.log('🔄 Starting property sync...');

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
      setLastSyncTime(new Date());

      // 統計情報も取得
      if (data.length > 0) {
        const statsData = await getPropertyStats();
        setStats(statsData);
      }

      console.log(`✅ Loaded ${data.length} properties from Airtable`);
      
      // 成功メッセージを表示
      showSyncMessage(`${data.length}件の物件データを同期しました`, 'success');

    } catch (err) {
      const errorMessage = err.message || 'データの読み込みに失敗しました';
      setError(errorMessage);
      setConnectionStatus('error');
      console.error('❌ Error loading properties:', err);
      
      // エラーメッセージを表示
      showSyncMessage(`同期エラー: ${errorMessage}`, 'error');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
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

  const refreshProperties = async () => {
    console.log('🔄 Manual refresh triggered...');
    await loadProperties(true);
  };

  // メッセージ表示関数
  const showSyncMessage = (text, type = 'success') => {
    const message = document.createElement('div');
    message.textContent = text;
    message.className = `fixed top-20 right-4 px-4 py-3 rounded-lg shadow-lg z-50 text-sm text-white max-w-sm ${
      type === 'success' ? 'bg-green-600' : 
      type === 'error' ? 'bg-red-600' : 
      type === 'info' ? 'bg-blue-600' : 'bg-gray-600'
    }`;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        message.style.transition = 'opacity 0.3s ease-out';
        message.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
        }, 300);
      }
    }, 5000);
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
        withImages: properties.filter(p => p.images && p.images.length > 0).length,
        types: [...new Set(properties.map(p => p.type))],
        wards: [...new Set(properties.map(p => p.ward).filter(Boolean))],
        lastSync: lastSyncTime?.toLocaleTimeString('ja-JP')
      });
    }
  }, [properties, lastSyncTime]);

  // 定期同期（5分間隔）
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Auto-sync triggered...');
      loadProperties(false); // 自動同期時はローディング表示しない
    }, 5 * 60 * 1000); // 5分

    return () => clearInterval(interval);
  }, []);

  return {
    properties,
    loading,
    error,
    stats,
    connectionStatus,
    lastSyncTime,
    searchPropertiesWithFilters,
    refreshProperties
  };
};

export default useAirtableProperties;