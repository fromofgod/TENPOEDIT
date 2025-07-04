import { useState, useEffect } from 'react';
import { trainStationData, getStationsByLineName as getStationsFromCSV, searchTrainLines as searchLinesFromCSV } from '../data/trainStationData';

export const useTrainLines = () => {
  const [trainLines, setTrainLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrainLines = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚆 Loading train lines from CSV data...');
      
      // CSVデータを直接使用（確実に動作）
      setTrainLines(trainStationData);
      
      console.log(`✅ Loaded ${trainStationData.length} train lines from CSV`);
    } catch (err) {
      console.error('❌ Error loading train lines:', err);
      setError(err.message);
      
      // エラー時も空配列ではなくCSVデータを設定
      setTrainLines(trainStationData);
    } finally {
      setLoading(false);
    }
  };

  const getStationsByLineId = async (lineId) => {
    try {
      console.log(`🚉 Getting stations for line ID: ${lineId}`);
      const line = trainStationData.find(line => line.id === lineId);
      const stations = line ? line.stations : [];
      console.log(`✅ Found ${stations.length} stations`);
      return stations;
    } catch (err) {
      console.error('❌ Error getting stations:', err);
      return [];
    }
  };

  const getStationsByLineName = (lineName) => {
    if (!lineName) return [];
    
    // CSVデータから直接検索
    const stations = getStationsFromCSV(lineName);
    console.log(`🚉 Found ${stations.length} stations for ${lineName}`);
    return stations;
  };

  const searchTrainLines = (query) => {
    if (!query) return trainStationData;
    
    // CSVデータから検索
    const filtered = searchLinesFromCSV(query);
    console.log(`🔍 Filtered ${filtered.length} lines for query: ${query}`);
    return filtered;
  };

  // 初回読み込み
  useEffect(() => {
    loadTrainLines();
  }, []);

  // デバッグ情報
  useEffect(() => {
    if (trainLines.length > 0) {
      console.log('🚆 Train lines loaded:', {
        count: trainLines.length,
        companies: [...new Set(trainLines.map(line => line.company))],
        sampleLines: trainLines.slice(0, 3).map(line => ({
          name: line.name,
          company: line.company,
          stationsCount: line.stations ? line.stations.length : 0
        }))
      });
    } else if (!loading) {
      console.log('⚠️ No train lines loaded');
    }
  }, [trainLines, loading]);

  return {
    trainLines,
    loading,
    error,
    getStationsByLineId,
    getStationsByLineName,
    searchTrainLines,
    refreshTrainLines: loadTrainLines
  };
};

export default useTrainLines;