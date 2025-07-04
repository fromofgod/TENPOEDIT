import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { testCompanyConnection, fetchCompanyInfo } from '../services/companyService';

const { FiDatabase, FiCheck, FiX, FiRefreshCw, FiInfo, FiBuilding } = FiIcons;

const CompanyDebugPanel = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await testCompanyConnection();
      setConnectionInfo(result);
      setConnectionStatus(result.success ? 'connected' : 'error');
      
      if (result.success) {
        const data = await fetchCompanyInfo();
        setCompanyData(data);
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionInfo({ success: false, error: error.message });
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

  return (
    <div className="fixed bottom-20 left-4 z-50">
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
            Company
          </div>
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

              {/* Airtable URL */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">データソース</h4>
                <div className="text-xs text-blue-600">
                  <a 
                    href="https://airtable.com/appBFYfgbWNZyP0QR/shrLlhJx9HZtir9oR" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    🔗 Airtable Company Table
                  </a>
                </div>
              </div>

              {/* Company Data */}
              {companyData && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">会社情報</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>会社名: {companyData.name}</div>
                    <div>電話: {companyData.phone}</div>
                    <div>メール: {companyData.email}</div>
                    <div>データソース: {companyData.source}</div>
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

              {/* Sample Data */}
              {connectionInfo?.sampleData && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">サンプルデータ</h4>
                  <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                    {Object.entries(connectionInfo.sampleData).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="truncate">
                        <span className="font-medium">{key}:</span> {String(value).substring(0, 20)}...
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Analysis */}
              {connectionInfo?.fieldAnalysis && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">フィールド分析</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>会社名: {connectionInfo.fieldAnalysis.companyName?.length || 0}個</div>
                    <div>連絡先: {connectionInfo.fieldAnalysis.contact?.length || 0}個</div>
                    <div>住所: {connectionInfo.fieldAnalysis.address?.length || 0}個</div>
                    <div>事業: {connectionInfo.fieldAnalysis.business?.length || 0}個</div>
                  </div>
                </div>
              )}

              {/* Record ID */}
              {companyData?.airtableRecordId && (
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">レコードID</h4>
                  <div className="text-xs text-gray-500 font-mono">
                    {companyData.airtableRecordId}
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                className="w-full px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 disabled:opacity-50"
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

export default CompanyDebugPanel;