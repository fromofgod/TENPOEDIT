import React from 'react';
import GoogleMap from './GoogleMap';

// 互換性のためのラッパーコンポーネント
const PropertyMap = ({ 
  properties, 
  onPropertySelect, 
  selectedProperty, 
  center = { lat: 35.6762, lng: 139.6503 },
  zoom = 12
}) => {
  // プロパティが配列でない場合は配列に変換
  const propertiesArray = Array.isArray(properties) ? properties : [properties].filter(Boolean);

  // 座標が設定されていない場合のフォールバック座標を生成
  const propertiesWithCoordinates = propertiesArray.map((property, index) => {
    if (!property.coordinates) {
      // 東京都内のランダムな座標を生成（デモ用）
      const fallbackCoordinates = {
        lat: 35.6762 + (Math.random() - 0.5) * 0.2, // 35.5762 - 35.7762
        lng: 139.6503 + (Math.random() - 0.5) * 0.3 // 139.5003 - 139.8003
      };
      
      console.warn(`⚠️ Property ${property.id} missing coordinates, using fallback:`, fallbackCoordinates);
      
      return {
        ...property,
        coordinates: fallbackCoordinates
      };
    }
    return property;
  });

  console.log('🗺️ PropertyMap rendering with properties:', {
    total: propertiesArray.length,
    withCoordinates: propertiesWithCoordinates.filter(p => p.coordinates).length,
    selectedProperty: selectedProperty?.id
  });

  return (
    <GoogleMap
      properties={propertiesWithCoordinates}
      onPropertySelect={onPropertySelect}
      selectedProperty={selectedProperty}
      center={center}
      zoom={zoom}
    />
  );
};

export default PropertyMap;