import React, {useState, useEffect} from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {validateAirtableConnection} from '../services/airtableService';

const {FiDatabase, FiCheck, FiX, FiRefreshCw, FiInfo, FiImage, FiAlertTriangle, FiWifi, FiClock, FiEye, FiExternalLink} = FiIcons;

const AirtableDebugPanel = ({properties, stats}) => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastTestTime, setLastTestTime] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      console.log('🔧 Testing Airtable connection...');
      const result = await validateAirtableConnection();
      setConnectionInfo(result);
      setConnectionStatus(result.success ? 'connected' : 'error');
      setLastTestTime(new Date());
      
      console.log('🔧 Connection test result:', result);
    } catch (error) {
      setConnectionStatus('error');
      setConnectionInfo({
        success: false,
        error: error.message
      });
      setLastTestTime(new Date());
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
    averageImages: properties.length > 0 ? 
      Math.round(properties.reduce((sum, p) => sum + (p.images?.length || 0), 0) / properties.length * 10) / 10 : 0
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
            className={`text-gray-400 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-3 pb-3 border-t border-gray-200">
            <div className="space-y-3 mt-3">
              {/* View Information */}
              {connectionInfo?.viewId && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <SafeIcon icon={FiEye} className="text-xs" />
                    <span>使用ビュー</span>
                  </h4>
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>View ID:</span>
                      <span className="font-mono text-xs">{connectionInfo.viewId}</span>
                    </div>
                    {connectionInfo.viewUrl && (
                      <div className="mt-1">
                        <a 
                          href={connectionInfo.viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                        >
                          <span>Airtableで開く</span>
                          <SafeIcon icon={FiExternalLink} className="text-xs" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Connection Status */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <SafeIcon icon={FiWifi} className="text-xs" />
                  <span>接続状況</span>
                </h4>
                <div className="text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>状態:</span>
                    <span className={`font-medium ${
                      connectionStatus === 'connected' ? 'text-green-600' :
                      connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {connectionStatus === 'connected' ? '接続中' :
                       connectionStatus === 'error' ? 'エラー' : 'テスト中'}
                    </span>
                  </div>
                  {lastTestTime && (
                    <div className="flex items-center justify-between mt-1">
                      <span>最終テスト:</span>
                      <span className="text-gray-500">
                        {lastTestTime.toLocaleTimeString('ja-JP')}
                      </span>
                    </div>
                  )}
                  {connectionInfo && (
                    <>
                      {connectionInfo.success ? (
                        <div className="text-green-600 mt-1">✅ ビュー接続成功</div>
                      ) : (
                        <div className="text-red-600 mt-1 break-words">
                          ❌ {connectionInfo.error}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Data Stats */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <SafeIcon icon={FiDatabase} className="text-xs" />
                  <span>データ統計</span>
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>総物件数:</span>
                    <span className="font-medium">{properties?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>座標あり:</span>
                    <span className="font-medium text-blue-600">
                      {properties?.filter(p => p.coordinates).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>利用可能:</span>
                    <span className="font-medium text-green-600">
                      {properties?.filter(p => p.isAvailable).length || 0}
                    </span>
                  </div>
                  {stats && (
                    <>
                      <div className="flex justify-between">
                        <span>平均賃料:</span>
                        <span className="font-medium">¥{stats.averageRent?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>対応エリア:</span>
                        <span className="font-medium">{Object.keys(stats.byWard || {}).length}</span>
                      </div>
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
                    <div className="flex justify-between">
                      <span>総画像数:</span>
                      <span className="font-medium">{imageStats.totalImages}枚</span>
                    </div>
                    <div className="flex justify-between">
                      <span>平均画像数:</span>
                      <span className="font-medium">{imageStats.averageImages}枚/物件</span>
                    </div>
                    <div className="flex justify-between">
                      <span>実写画像あり:</span>
                      <span className="font-medium text-blue-600">{imageStats.withRealImages}件</span>
                    </div>
                    <div className="flex justify-between">
                      <span>画像なし:</span>
                      <span className="font-medium text-orange-600">
                        {imageStats.total - imageStats.withImages}件
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Field Analysis */}
              {connectionInfo?.fieldAnalysis && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">フィールド分析</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>基本情報:</span>
                      <span className="font-medium">{connectionInfo.fieldAnalysis.basicInfo?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>価格情報:</span>
                      <span className="font-medium">{connectionInfo.fieldAnalysis.priceInfo?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>位置情報:</span>
                      <span className="font-medium">{connectionInfo.fieldAnalysis.locationInfo?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>画像情報:</span>
                      <span className="font-medium">{connectionInfo.fieldAnalysis.imageInfo?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Missing Fields Warning */}
              {connectionInfo?.missingFields && connectionInfo.missingFields.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center space-x-1">
                    <SafeIcon icon={FiAlertTriangle} className="text-xs text-orange-500" />
                    <span>不足フィールド</span>
                  </h4>
                  <div className="text-xs text-orange-600 max-h-16 overflow-y-auto">
                    {connectionInfo.missingFields.slice(0, 3).map((field, index) => (
                      <div key={index}>• {field}</div>
                    ))}
                    {connectionInfo.missingFields.length > 3 && (
                      <div className="text-orange-400">...他{connectionInfo.missingFields.length - 3}個</div>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Info */}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>同期間隔:</span>
                  <span>5分</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>タイムアウト:</span>
                  <span>45秒</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>データ品質:</span>
                  <span className="text-green-600">
                    {properties && properties.length > 0 ? 
                      `${Math.round(properties.filter(p => p.coordinates).length / properties.length * 100)}%` : 
                      '0%'
                    }
                  </span>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-1"
              >
                <SafeIcon icon={FiRefreshCw} className={`${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>再テスト</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirtableDebugPanel;