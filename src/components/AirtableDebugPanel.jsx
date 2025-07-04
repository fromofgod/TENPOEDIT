import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { validateAirtableConnection } from '../services/airtableService';

const { FiDatabase, FiCheck, FiX, FiRefreshCw, FiInfo, FiImage } = FiIcons;

const AirtableDebugPanel = ({ properties, stats }) => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await validateAirtableConnection();
      setConnectionInfo(result);
      setConnectionStatus(result.success ? 'connected' : 'error');
    } catch (error) {
      setConnectionStatus('error');
      setConnectionInfo({
        success: false,
        error: error.message
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return FiCheck;
      case 'error': return FiX;
      case 'testing': return FiRefreshCw;
      default: return FiDatabase;
    }
  };

  // 画像統計の計算
  const imageStats = properties ? {
    total: properties.length,
    withImages: properties.filter(p => p.images && p.images.length > 0).length,
    withRealImages: properties.filter(p => 
      p.images && p.images.some(img => !img.includes('unsplash.com'))
    ).length,
    totalImages: properties.reduce((sum, p) => sum + (p.images?.length || 0), 0),
    averageImages: properties.length > 0 
      ? Math.round(properties.reduce((sum, p) => sum + (p.images?.length || 0), 0) / properties.length * 10) / 10 
      : 0
  } : null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-300 ${
        isExpanded ? 'w-80 h-auto' : 'w-auto h-auto'
      }`}>
        {/* Header */}
        <div 
          className="p-3 cursor-pointer flex items-center space-x-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            <SafeIcon 
              icon={getStatusIcon()} 
              className={`text-xs mr-1 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} 
            />
            Airtable
          </div>
          {!isExpanded && (
            <span className="text-sm text-gray-600">
              {properties?.length || 0}件
            </span>
          )}
          <SafeIcon 
            icon={FiInfo} 
            className={`text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-3 pb-3 border-t border-gray-200">
            <div className="space-y-3 mt-3">
              {/* Connection Status */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">接続状況</h4>
                <div className="text-xs text-gray-600">
                  <div>状態: {connectionStatus}</div>
                  {connectionInfo && (
                    <>
                      {connectionInfo.success ? (
                        <div className="text-green-600">✅ 接続成功</div>
                      ) : (
                        <div className="text-red-600">❌ {connectionInfo.error}</div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Data Stats */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">データ統計</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>総物件数: {properties?.length || 0}</div>
                  <div>座標あり: {properties?.filter(p => p.coordinates).length || 0}</div>
                  {stats && (
                    <>
                      <div>平均賃料: ¥{stats.averageRent?.toLocaleString()}</div>
                      <div>対応エリア: {Object.keys(stats.byWard || {}).length}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Image Stats */}
              {imageStats && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <SafeIcon icon={FiImage} className="text-xs" />
                    <span>画像統計</span>
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>総画像数: {imageStats.totalImages}枚</div>
                    <div>平均画像数: {imageStats.averageImages}枚/物件</div>
                    <div>実写画像あり: {imageStats.withRealImages}件</div>
                    <div>画像なし: {imageStats.total - imageStats.withImages}件</div>
                  </div>
                </div>
              )}

              {/* Available Fields */}
              {connectionInfo?.fields && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">利用可能フィールド</h4>
                  <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                    {connectionInfo.fields.slice(0, 5).map((field, index) => (
                      <div key={index}>• {field}</div>
                    ))}
                    {connectionInfo.fields.length > 5 && (
                      <div className="text-gray-400">...他{connectionInfo.fields.length - 5}個</div>
                    )}
                  </div>
                </div>
              )}

              {/* Image Fields */}
              {connectionInfo?.imageFields && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <SafeIcon icon={FiImage} className="text-xs" />
                    <span>画像フィールド</span>
                  </h4>
                  <div className="text-xs text-gray-600 max-h-16 overflow-y-auto">
                    {connectionInfo.imageFields.length > 0 ? (
                      connectionInfo.imageFields.map((field, index) => (
                        <div key={index} className="text-blue-600">• {field}</div>
                      ))
                    ) : (
                      <div className="text-orange-600">画像フィールドが見つかりません</div>
                    )}
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                className="w-full px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
              >
                <SafeIcon 
                  icon={FiRefreshCw} 
                  className={`mr-1 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} 
                />
                再テスト
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirtableDebugPanel;