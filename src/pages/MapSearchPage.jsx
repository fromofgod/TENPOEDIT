import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import GoogleMap from '../components/GoogleMap';
import PropertyCard from '../components/PropertyCard';
import { useAirtableProperties } from '../hooks/useAirtableProperties';
import { tokyoWards, tokyoCities, tokyoTrainLines } from '../data/tokyoTrainData';

const { FiMap, FiList, FiFilter, FiChevronDown, FiSearch, FiMapPin, FiNavigation, FiRefreshCw, FiDatabase } = FiIcons;

const MapSearchPage = () => {
  const { properties, loading, error, stats, searchPropertiesWithFilters, refreshProperties } = useAirtableProperties();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6762, lng: 139.6503 });
  const [mapZoom, setMapZoom] = useState(12);
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);

  const [filters, setFilters] = useState({
    propertyType: '',
    area: '',
    trainLine: '',
    station: '',
    priceRange: '',
    walkingMinutes: '',
    keyword: ''
  });

  const allAreas = [...tokyoWards, ...tokyoCities];

  // プロパティが更新されたときにフィルタリング
  useEffect(() => {
    filterProperties();
  }, [properties, filters]);

  const filterProperties = () => {
    if (!properties.length) {
      setFilteredProperties([]);
      return;
    }

    let filtered = [...properties];

    // Apply filters
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.type === filters.propertyType);
    }

    if (filters.area) {
      filtered = filtered.filter(p => 
        p.ward === filters.area || 
        p.location.includes(filters.area) ||
        (p.ward && p.ward.includes(filters.area))
      );
    }

    if (filters.station) {
      filtered = filtered.filter(p => 
        p.nearestStation && p.nearestStation.includes(filters.station)
      );
    }

    if (filters.trainLine) {
      filtered = filtered.filter(p => 
        p.trainLines && p.trainLines.some(line => 
          line.includes(filters.trainLine)
        )
      );
    }

    if (filters.keyword) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        (p.ward && p.ward.toLowerCase().includes(filters.keyword.toLowerCase())) ||
        (p.nearestStation && p.nearestStation.toLowerCase().includes(filters.keyword.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(filters.keyword.toLowerCase()))
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        if (!p.rent) return false;
        if (max) return p.rent >= min && p.rent <= max;
        return p.rent >= min;
      });
    }

    if (filters.walkingMinutes) {
      const [, maxWalk] = filters.walkingMinutes.split('-').map(Number);
      filtered = filtered.filter(p => 
        p.walkingMinutes && p.walkingMinutes <= maxWalk
      );
    }

    // 座標を持つ物件のみ表示
    filtered = filtered.filter(p => p.coordinates);

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      area: '',
      trainLine: '',
      station: '',
      priceRange: '',
      walkingMinutes: '',
      keyword: ''
    });
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  // 物件カードクリック時の処理を修正
  const handlePropertyCardClick = (property) => {
    // 地図表示に切り替えて物件を選択
    setSelectedProperty(property);
    setViewMode('map');
    
    // 地図の中心を物件の位置に移動
    if (property.coordinates) {
      setMapCenter(property.coordinates);
      setMapZoom(16);
    }
  };

  // 住所検索機能
  const handleAddressSearch = async () => {
    if (!searchAddress.trim() || !window.google) return;

    setIsSearching(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { 
            address: searchAddress,
            region: 'JP',
            language: 'ja'
          },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });

      const location = result.geometry.location;
      const newCenter = {
        lat: location.lat(),
        lng: location.lng()
      };

      setMapCenter(newCenter);
      setMapZoom(15);

      // 検索結果の表示用メッセージ
      const message = document.createElement('div');
      message.textContent = `${result.formatted_address} に移動しました`;
      message.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      document.body.appendChild(message);
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
    } catch (error) {
      console.error('住所検索エラー:', error);
      alert('住所が見つかりませんでした。別の住所で試してください。');
    } finally {
      setIsSearching(false);
    }
  };

  // 現在地取得
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('お使いのブラウザは位置情報サービスをサポートしていません。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMapCenter(newCenter);
        setMapZoom(15);

        const message = document.createElement('div');
        message.textContent = '現在地に移動しました';
        message.className = 'fixed top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
        document.body.appendChild(message);
        setTimeout(() => {
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
        }, 3000);
      },
      (error) => {
        console.error('位置情報取得エラー:', error);
        alert('位置情報の取得に失敗しました。設定を確認してください。');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const propertyTypes = [
    { value: '', label: 'すべて' },
    { value: 'restaurant', label: '飲食店' },
    { value: 'retail', label: '小売店' },
    { value: 'office', label: 'オフィス' },
    { value: 'warehouse', label: '倉庫・工場' },
    { value: 'service', label: 'サービス業' },
    { value: 'other', label: 'その他' }
  ];

  const priceRanges = [
    { value: '', label: 'すべて' },
    { value: '0-100000', label: '10万円以下' },
    { value: '100000-300000', label: '10万円〜30万円' },
    { value: '300000-500000', label: '30万円〜50万円' },
    { value: '500000-1000000', label: '50万円〜100万円' },
    { value: '1000000-', label: '100万円以上' }
  ];

  const walkingOptions = [
    { value: '', label: 'すべて' },
    { value: '1-3', label: '徒歩3分以内' },
    { value: '1-5', label: '徒歩5分以内' },
    { value: '1-10', label: '徒歩10分以内' },
    { value: '1-15', label: '徒歩15分以内' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiDatabase} className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            データの読み込みに失敗しました
          </h2>
          <p className="text-gray-600 mb-6">
            Airtableからのデータ取得中にエラーが発生しました。
          </p>
          <button
            onClick={refreshProperties}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">地図から物件検索</h1>
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  <SafeIcon icon={FiDatabase} className="text-xs" />
                  <span>Airtable連携</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{filteredProperties.length}件の物件を地図上で確認</span>
                {stats && (
                  <>
                    <span>•</span>
                    <span>総物件数: {stats.total}件</span>
                    <span>•</span>
                    <span>平均賃料: ¥{stats.averageRent?.toLocaleString()}/月</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={refreshProperties}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                title="データを再読み込み"
              >
                <SafeIcon icon={FiRefreshCw} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">更新</span>
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <SafeIcon icon={FiFilter} />
                <span>フィルター</span>
                <SafeIcon 
                  icon={FiChevronDown} 
                  className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                />
              </button>

              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 ${viewMode === 'map' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <SafeIcon icon={FiMap} className="mr-2" />
                  地図
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <SafeIcon icon={FiList} className="mr-2" />
                  一覧
                </button>
              </div>
            </div>
          </div>

          {/* Search Controls */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Address Search */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                  placeholder="住所、駅名、エリア名で検索（例：渋谷駅、東京都港区六本木）"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={handleAddressSearch}
                disabled={isSearching}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <SafeIcon icon={FiSearch} />
                )}
              </button>
              <button
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                title="現在地を取得"
              >
                <SafeIcon icon={FiNavigation} />
              </button>
            </div>

            {/* Stats Display */}
            {stats && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">物件種別:</span>
                  <span>飲食{stats.byType.restaurant || 0}件</span>
                  <span>小売{stats.byType.retail || 0}件</span>
                  <span>オフィス{stats.byType.office || 0}件</span>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    キーワード
                  </label>
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="物件名、エリアなど"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    エリア
                  </label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">すべて</option>
                    {allAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    物件種別
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    賃料
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    駅からの距離
                  </label>
                  <select
                    value={filters.walkingMinutes}
                    onChange={(e) => handleFilterChange('walkingMinutes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {walkingOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    クリア
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Airtableから最新データを取得中。地図を移動すると、表示エリアの物件が自動更新されます。
                </div>
                {loading && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>読み込み中...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex h-screen">
          {viewMode === 'map' ? (
            <>
              {/* Map View */}
              <div className="flex-1 relative">
                {loading ? (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Airtableから物件データを読み込み中...</p>
                    </div>
                  </div>
                ) : (
                  <GoogleMap
                    properties={filteredProperties}
                    onPropertySelect={handlePropertySelect}
                    selectedProperty={selectedProperty}
                    center={mapCenter}
                    zoom={mapZoom}
                  />
                )}
              </div>

              {/* Selected Property Sidebar */}
              {selectedProperty && (
                <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">選択中の物件</h3>
                      <button
                        onClick={() => setSelectedProperty(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <PropertyCard property={selectedProperty} />

                    {/* Airtable Data Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-green-800">
                          <SafeIcon icon={FiDatabase} className="text-sm" />
                          <span className="text-sm font-medium">Airtableデータ</span>
                        </div>
                        <div className="mt-2 text-xs text-green-700 space-y-1">
                          <div>ID: {selectedProperty.id}</div>
                          {selectedProperty.coordinates && (
                            <div>
                              座標: {selectedProperty.coordinates.lat.toFixed(4)},{selectedProperty.coordinates.lng.toFixed(4)}
                            </div>
                          )}
                          <div>更新: {new Date(selectedProperty.postedDate).toLocaleDateString('ja-JP')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* List View */
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handlePropertyCardClick(property)}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <SafeIcon icon={FiMapPin} className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    条件に合う物件が見つかりませんでした。
                  </p>
                  <p className="text-gray-400 mb-6">
                    検索条件を変更するか、フィルターをクリアしてください。
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={clearFilters}
                      className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors mr-4"
                    >
                      検索条件をリセット
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      地図で確認
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSearchPage;