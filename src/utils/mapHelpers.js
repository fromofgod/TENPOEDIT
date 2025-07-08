// Google Maps APIヘルパー関数

// 住所から座標を取得（Geocoding API）
export const geocodeAddress = async (address) => {
  if (!window.google) return null;

  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode(
      { 
        address: address,
        region: 'JP',
        language: 'ja'
      },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: results[0].formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      }
    );
  });
};

// 座標から住所を取得（Reverse Geocoding）
export const reverseGeocode = async (lat, lng) => {
  if (!window.google) return null;

  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: lat, lng: lng };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({
          formatted_address: results[0].formatted_address,
          components: results[0].address_components
        });
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
  });
};

// 2点間の距離を計算
export const calculateDistance = (point1, point2) => {
  if (!window.google) return null;

  const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(point1.lat, point1.lng),
    new window.google.maps.LatLng(point2.lat, point2.lng)
  );

  return Math.round(distance); // メートル単位
};

// 最寄り駅を検索
export const findNearestStation = async (lat, lng, radius = 1000) => {
  if (!window.google) return null;

  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: radius,
      type: ['subway_station', 'train_station'],
      language: 'ja'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const stations = results.map(place => ({
          name: place.name,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          },
          distance: calculateDistance(
            { lat, lng },
            { 
              lat: place.geometry.location.lat(), 
              lng: place.geometry.location.lng() 
            }
          ),
          place_id: place.place_id,
          types: place.types
        })).sort((a, b) => a.distance - b.distance);

        resolve(stations);
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });
};

// エリアの境界を取得
export const getAreaBounds = (properties) => {
  if (!window.google || properties.length === 0) return null;

  const bounds = new window.google.maps.LatLngBounds();
  
  properties.forEach(property => {
    if (property.coordinates) {
      bounds.extend(new window.google.maps.LatLng(
        property.coordinates.lat, 
        property.coordinates.lng
      ));
    }
  });

  return bounds;
};

// カスタムマーカーアイコンを生成
export const createCustomMarker = (property, isSelected = false, isHovered = false) => {
  const color = isSelected ? '#ef4444' : isHovered ? '#f59e0b' : '#22c55e';
  const scale = isSelected || isHovered ? 1.2 : 1.0;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="${40 * scale}" height="${50 * scale}" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <path d="M20 0C8.95 0 0 8.95 0 20c0 15 20 30 20 30s20-15 20-30C40 8.95 31.05 0 20 0z" 
              fill="${color}" 
              stroke="#ffffff" 
              stroke-width="2"
              filter="url(#shadow)"/>
        <circle cx="20" cy="20" r="8" fill="#ffffff"/>
        <text x="20" y="25" text-anchor="middle" fill="${color}" 
              font-size="12" font-weight="bold">¥</text>
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(40 * scale, 50 * scale),
    anchor: new window.google.maps.Point(20 * scale, 50 * scale)
  };
};

// 地図のスタイル設定
export const getMapStyles = (isDark = false) => {
  if (isDark) {
    return [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#757575" }]
      },
      {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0f1419" }]
      }
    ];
  } else {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{ visibility: 'simplified' }]
      }
    ];
  }
};

// ストリートビューが利用可能かチェック
export const checkStreetViewAvailability = async (lat, lng) => {
  if (!window.google) return false;

  return new Promise((resolve) => {
    const streetViewService = new window.google.maps.StreetViewService();
    
    streetViewService.getPanorama({
      location: { lat, lng },
      radius: 50
    }, (data, status) => {
      resolve(status === 'OK');
    });
  });
};