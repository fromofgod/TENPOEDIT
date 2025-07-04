import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { tokyoAreasFromCSV, tokyoWards, tokyoCities, popularAreas } from '../data/tokyoAreas';
import { useTrainLines } from '../hooks/useTrainLines';

const { FiSearch, FiMapPin, FiNavigation, FiChevronDown, FiLoader } = FiIcons;

const SearchForm = () => {
  const navigate = useNavigate();
  const { trainLines, loading: trainLinesLoading, getStationsByLineName } = useTrainLines();
  
  const [formData, setFormData] = useState({
    keyword: '',
    area: '',
    trainLine: '',
    station: '',
    propertyType: '',
    priceRange: '',
    walkingMinutes: ''
  });
  
  const [availableStations, setAvailableStations] = useState([]);

  const propertyTypes = [
    { value: '', label: '物件種別を選択' },
    { value: 'restaurant', label: '飲食店' },
    { value: 'retail', label: '小売店' },
    { value: 'office', label: 'オフィス' },
    { value: 'warehouse', label: '倉庫・工場' },
    { value: 'service', label: 'サービス業' }
  ];

  const priceRanges = [
    { value: '', label: '賃料を選択' },
    { value: '0-100000', label: '10万円以下' },
    { value: '100000-300000', label: '10万円〜30万円' },
    { value: '300000-500000', label: '30万円〜50万円' },
    { value: '500000-1000000', label: '50万円〜100万円' },
    { value: '1000000-', label: '100万円以上' }
  ];

  const walkingOptions = [
    { value: '', label: '徒歩時間' },
    { value: '1-3', label: '徒歩3分以内' },
    { value: '1-5', label: '徒歩5分以内' },
    { value: '1-10', label: '徒歩10分以内' },
    { value: '1-15', label: '徒歩15分以内' }
  ];

  // 沿線が選択されたときに駅リストを更新
  useEffect(() => {
    if (formData.trainLine) {
      const stations = getStationsByLineName(formData.trainLine);
      setAvailableStations(stations);
      console.log(`🚉 Found ${stations.length} stations for line: ${formData.trainLine}`);
    } else {
      setAvailableStations([]);
    }

    // 沿線が変更されたら駅の選択をリセット
    if (formData.station && formData.trainLine) {
      const stations = getStationsByLineName(formData.trainLine);
      if (!stations.includes(formData.station)) {
        setFormData(prev => ({ ...prev, station: '' }));
      }
    }
  }, [formData.trainLine, getStationsByLineName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-green-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">東京都内の物件を検索</h2>
        <p className="text-gray-600">
          {trainLinesLoading ? '沿線データを読み込み中...' : trainLines.length > 0 
            ? `${trainLines.length}路線・${tokyoAreasFromCSV.length}市区町村の最新データで検索` 
            : '物件データから沿線情報を抽出中...'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Row - Keyword */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キーワード検索
            </label>
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                placeholder="物件名、駅名、特徴など"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Second Row - Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Area - CSVデータを使用したセレクトボックス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              エリア（区・市町村）
              <span className="text-xs text-gray-500 ml-1">
                ({tokyoAreasFromCSV.length}地域)
              </span>
            </label>
            <div className="relative">
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">すべてのエリア</option>
                
                {/* 人気エリア */}
                <optgroup label="🌟 人気エリア">
                  {popularAreas.map((area) => (
                    <option key={`popular-${area}`} value={area}>
                      {area}
                    </option>
                  ))}
                </optgroup>

                {/* 23区 */}
                <optgroup label="🏙️ 東京23区">
                  {tokyoWards.sort().map((ward) => (
                    <option key={`ward-${ward}`} value={ward}>
                      {ward}
                    </option>
                  ))}
                </optgroup>

                {/* 市町村 */}
                <optgroup label="🏘️ 市町村">
                  {tokyoCities.sort().map((city) => (
                    <option key={`city-${city}`} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
              </select>
              <SafeIcon icon={FiChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Train Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              沿線を選択
              {trainLinesLoading && (
                <span className="ml-2 text-xs text-blue-600">
                  <SafeIcon icon={FiLoader} className="animate-spin inline mr-1" />
                  読み込み中...
                </span>
              )}
            </label>
            <div className="relative">
              <SafeIcon icon={FiNavigation} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <select
                name="trainLine"
                value={formData.trainLine}
                onChange={handleChange}
                disabled={trainLinesLoading}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {trainLinesLoading ? "沿線データ読み込み中..." : "すべての沿線"}
                </option>
                
                {!trainLinesLoading && (
                  <>
                    {/* JR線 */}
                    <optgroup label="🚄 JR線">
                      {trainLines
                        .filter(line => line.company === 'JR東日本' || line.company === 'JR東海')
                        .map((line) => (
                          <option key={line.id} value={line.name}>
                            {line.name}
                          </option>
                        ))}
                    </optgroup>

                    {/* 東京メトロ */}
                    <optgroup label="🚇 東京メトロ">
                      {trainLines
                        .filter(line => line.company === '東京メトロ')
                        .map((line) => (
                          <option key={line.id} value={line.name}>
                            {line.name}
                          </option>
                        ))}
                    </optgroup>

                    {/* 都営地下鉄 */}
                    <optgroup label="🚈 都営地下鉄">
                      {trainLines
                        .filter(line => line.company === '都営地下鉄' || line.company === '都営交通')
                        .map((line) => (
                          <option key={line.id} value={line.name}>
                            {line.name}
                          </option>
                        ))}
                    </optgroup>

                    {/* 私鉄 */}
                    <optgroup label="🚊 私鉄">
                      {trainLines
                        .filter(line => 
                          !['JR東日本', 'JR東海', '東京メトロ', '都営地下鉄', '都営交通'].includes(line.company)
                        )
                        .map((line) => (
                          <option key={line.id} value={line.name}>
                            {line.name} ({line.company})
                          </option>
                        ))}
                    </optgroup>
                  </>
                )}
              </select>
              <SafeIcon icon={FiChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Station */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              駅名を選択
              {formData.trainLine && (
                <span className="text-xs text-gray-500 ml-1">
                  ({availableStations.length}駅)
                </span>
              )}
            </label>
            <div className="relative">
              <SafeIcon icon={FiNavigation} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="station"
                value={formData.station}
                onChange={handleChange}
                disabled={!formData.trainLine || trainLinesLoading}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 ${
                  !formData.trainLine || trainLinesLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {trainLinesLoading 
                    ? '沿線データ読み込み中...' 
                    : formData.trainLine 
                      ? 'すべての駅' 
                      : '先に沿線を選択してください'
                  }
                </option>
                {availableStations.map((station, index) => (
                  <option key={index} value={station}>
                    {station}駅
                  </option>
                ))}
              </select>
              <SafeIcon icon={FiChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Third Row - Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              物件種別
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              賃料
            </label>
            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Walking Minutes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              駅からの距離
            </label>
            <select
              name="walkingMinutes"
              value={formData.walkingMinutes}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {walkingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={trainLinesLoading}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {trainLinesLoading ? (
                <SafeIcon icon={FiLoader} className="animate-spin" />
              ) : (
                <SafeIcon icon={FiSearch} />
              )}
              <span>検索</span>
            </button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">人気の検索条件</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '渋谷区', params: { area: '渋谷区' } },
              { label: '新宿区', params: { area: '新宿区' } },
              { label: '港区', params: { area: '港区' } },
              { label: '世田谷区', params: { area: '世田谷区' } },
              { label: '山手線沿線', params: { trainLine: 'ＪＲ山手線' } },
              { label: '銀座線沿線', params: { trainLine: '東京メトロ銀座線' } },
              { label: '飲食店物件', params: { propertyType: 'restaurant' } },
              { label: '徒歩5分以内', params: { walkingMinutes: '1-5' } }
            ].map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, ...item.params }));
                }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Info */}
        <div className="border-t pt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiMapPin} />
              <span>{tokyoAreasFromCSV.length}市区町村</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={trainLinesLoading ? FiLoader : FiNavigation} className={trainLinesLoading ? 'animate-spin' : ''} />
              <span>
                {trainLinesLoading 
                  ? '沿線データを読み込み中...' 
                  : trainLines.length > 0 
                    ? `${trainLines.length}路線のデータを取得済み` 
                    : '物件データから沿線情報を抽出中'
                }
              </span>
            </div>
          </div>
          {!trainLinesLoading && trainLines.length === 0 && (
            <div className="text-xs text-orange-600 mt-1">
              沿線データが見つかりません。物件データの取得を確認してください。
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;