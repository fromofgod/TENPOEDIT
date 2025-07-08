import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 ルーティングテストページ
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">現在の状態</h2>
          <div className="space-y-2 text-sm">
            <p><strong>パス:</strong> {location.pathname}</p>
            <p><strong>ハッシュ:</strong> {window.location.hash}</p>
            <p><strong>完全URL:</strong> {window.location.href}</p>
            <p><strong>Navigate関数:</strong> {typeof navigate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">ナビゲーションテスト</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ホームへ (navigate)
              </button>
              <button
                onClick={() => navigate('/search')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                検索ページへ (navigate)
              </button>
              <button
                onClick={() => navigate('/map-search')}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                地図検索へ (navigate)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">window.location テスト</h3>
            <div className="space-y-3">
              <button
                onClick={() => { window.location.hash = '#/'; }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ホームへ (hash)
              </button>
              <button
                onClick={() => { window.location.hash = '#/search'; }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                検索ページへ (hash)
              </button>
              <button
                onClick={() => { window.location.hash = '#/map-search'; }}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                地図検索へ (hash)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔍 デバッグ情報
          </h3>
          <p className="text-sm text-yellow-700">
            このページが表示されていれば、ルーティングは部分的に動作しています。
            各ボタンをクリックして、どの方法が機能するかテストしてください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;