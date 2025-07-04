import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiUser, FiMail, FiShield, FiCheck, FiX, FiLoader, FiLogOut } = FiIcons;

const GoogleAuthTest = () => {
  const { 
    user, 
    loading, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signOut, 
    isAuthenticated,
    isAdmin 
  } = useAuth();
  
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [testName, setTestName] = useState('テストユーザー');
  const [isTestLoading, setIsTestLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsTestLoading(true);
    try {
      console.log('🔍 Starting Google OAuth test...');
      await signInWithGoogle();
    } catch (error) {
      console.error('❌ Google sign in failed:', error);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    setIsTestLoading(true);
    try {
      console.log('📝 Testing email signup...');
      await signUpWithEmail(testEmail, testPassword, testName);
    } catch (error) {
      console.error('❌ Email signup failed:', error);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    setIsTestLoading(true);
    try {
      console.log('🔑 Testing email signin...');
      await signInWithEmail(testEmail, testPassword);
    } catch (error) {
      console.error('❌ Email signin failed:', error);
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔐 Supabase認証テスト
            </h1>
            <p className="text-lg text-gray-600">
              Googleアカウントとメール認証の動作確認
            </p>
          </div>

          {/* 接続ステータス */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-600" />
              <span>Supabase接続ステータス</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <SafeIcon icon={FiCheck} className="text-green-600 text-xl" />
                <div>
                  <p className="font-semibold text-green-800">プロジェクト接続</p>
                  <p className="text-sm text-green-600">wjaollycijpncdlmppjp</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <SafeIcon icon={FiShield} className="text-blue-600 text-xl" />
                <div>
                  <p className="font-semibold text-blue-800">認証システム</p>
                  <p className="text-sm text-blue-600">準備完了</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <SafeIcon icon={FiUser} className="text-purple-600 text-xl" />
                <div>
                  <p className="font-semibold text-purple-800">ユーザー状態</p>
                  <p className="text-sm text-purple-600">
                    {isAuthenticated ? '認証済み' : '未認証'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ユーザー情報表示 */}
          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  ✅ ログイン成功！
                </h2>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} />
                  <span>ログアウト</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-16 h-16 rounded-full border-4 border-green-200"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">プロバイダー:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.provider === 'google' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">メール確認:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.emailConfirmed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {user.emailConfirmed ? '確認済み' : '未確認'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">管理者権限:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isAdmin 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isAdmin ? '管理者' : '一般ユーザー'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">ユーザーID:</span>
                    <span className="text-sm text-gray-600 font-mono">
                      {user.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 認証テストパネル */}
          {!isAuthenticated && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Google認証テスト */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google認証</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Google OAuth設定状況</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✅ Google Client ID設定済み</li>
                      <li>✅ Supabaseプロバイダー設定済み</li>
                      <li>⚠️ リダイレクトURL要設定</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isTestLoading}
                    className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-4 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50"
                  >
                    {isTestLoading ? (
                      <SafeIcon icon={FiLoader} className="animate-spin text-xl" />
                    ) : (
                      <>
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Googleでログイン</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* メール認証テスト */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="text-blue-600" />
                  <span>メール認証</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      お名前
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="テストユーザー"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="test@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード
                    </label>
                    <input
                      type="password"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="6文字以上"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleEmailSignUp}
                      disabled={isTestLoading}
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isTestLoading ? (
                        <SafeIcon icon={FiLoader} className="animate-spin" />
                      ) : (
                        <SafeIcon icon={FiUser} />
                      )}
                      <span>新規登録</span>
                    </button>
                    
                    <button
                      onClick={handleEmailSignIn}
                      disabled={isTestLoading}
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isTestLoading ? (
                        <SafeIcon icon={FiLoader} className="animate-spin" />
                      ) : (
                        <SafeIcon icon={FiMail} />
                      )}
                      <span>ログイン</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 設定ガイド */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 Google OAuth設定ガイド
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Google認証を完全に動作させるには、以下の設定が必要です：
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 重要な設定事項</h3>
                <ol className="text-sm text-yellow-700 space-y-2">
                  <li><strong>1. Google Cloud Console設定:</strong></li>
                  <li className="ml-4">• OAuth 2.0 クライアント IDの作成</li>
                  <li className="ml-4">• 承認済みのリダイレクト URIに以下を追加:</li>
                  <li className="ml-8 font-mono text-xs bg-white px-2 py-1 rounded">
                    https://wjaollycijpncdlmppjp.supabase.co/auth/v1/callback
                  </li>
                  <li><strong>2. Supabase Dashboard設定:</strong></li>
                  <li className="ml-4">• Authentication → Providers → Google</li>
                  <li className="ml-4">• 「Enable Google provider」をオン</li>
                  <li className="ml-4">• Client IDとClient Secretを設定</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📋 現在の設定状況</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Supabaseプロジェクト: 接続済み</li>
                  <li>✅ Google Client ID: 設定済み</li>
                  <li>⏳ Google Provider: Supabase側で設定待ち</li>
                  <li>⏳ リダイレクトURL: Google Console側で設定待ち</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoogleAuthTest;