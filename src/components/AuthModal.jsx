import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLoader } = FiIcons;

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode); // 'signin', 'signup', 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'パスワードを入力してください';
      } else if (formData.password.length < 6) {
        newErrors.password = 'パスワードは6文字以上で入力してください';
      }
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'お名前を入力してください';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      if (mode === 'signin') {
        await signInWithEmail(formData.email, formData.password);
        handleClose();
      } else if (mode === 'signup') {
        const result = await signUpWithEmail(formData.email, formData.password, formData.fullName);
        if (result.needsConfirmation) {
          setMode('confirmation');
        } else {
          handleClose();
        }
      } else if (mode === 'reset') {
        await resetPassword(formData.email);
        setMode('reset-sent');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // エラーは AuthContext で処理されてメッセージが表示される
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // OAuth の場合、リダイレクトが発生するのでモーダルは閉じない
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {mode === 'signin' && 'ログイン'}
                {mode === 'signup' && 'アカウント作成'}
                {mode === 'reset' && 'パスワードリセット'}
                {mode === 'confirmation' && 'メール確認'}
                {mode === 'reset-sent' && 'メール送信完了'}
              </h2>
              <p className="text-gray-600">
                {mode === 'signin' && 'アカウントにログインしてください'}
                {mode === 'signup' && '新しいアカウントを作成しましょう'}
                {mode === 'reset' && 'パスワードリセット用のメールを送信します'}
                {mode === 'confirmation' && '確認メールを送信しました'}
                {mode === 'reset-sent' && 'パスワードリセットメールを送信しました'}
              </p>
            </div>

            {/* Supabase Connection Status */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Supabase認証システム接続済み</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            {(mode === 'signin' || mode === 'signup') && (
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Googleで{mode === 'signin' ? 'ログイン' : 'アカウント作成'}</span>
              </button>
            )}

            {/* Divider */}
            {(mode === 'signin' || mode === 'signup') && (
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">または</span>
                </div>
              </div>
            )}

            {/* Confirmation Message */}
            {mode === 'confirmation' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiMail} className="text-2xl text-blue-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  {formData.email} に確認メールを送信しました。
                  メール内のリンクをクリックしてアカウントを有効化してください。
                </p>
                <button
                  onClick={() => setMode('signin')}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  ログインページに戻る
                </button>
              </div>
            )}

            {/* Reset Sent Message */}
            {mode === 'reset-sent' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiMail} className="text-2xl text-green-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  {formData.email} にパスワードリセット用のメールを送信しました。
                  メール内の指示に従ってパスワードを変更してください。
                </p>
                <button
                  onClick={() => setMode('signin')}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  ログインページに戻る
                </button>
              </div>
            )}

            {/* Form */}
            {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      お名前 *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="山田 太郎"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                {mode !== 'reset' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="6文字以上"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Confirm Password */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード確認 *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="パスワードを再入力"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showConfirmPassword ? FiEyeOff : FiEye} />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting && <SafeIcon icon={FiLoader} className="animate-spin" />}
                  <span>
                    {mode === 'signin' && 'ログイン'}
                    {mode === 'signup' && 'アカウント作成'}
                    {mode === 'reset' && 'リセットメール送信'}
                  </span>
                </button>
              </form>
            )}

            {/* Mode Switch Links */}
            {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
              <div className="mt-6 text-center space-y-2">
                {mode === 'signin' && (
                  <>
                    <p className="text-sm text-gray-600">
                      アカウントをお持ちでない方は{' '}
                      <button
                        onClick={() => handleModeChange('signup')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        こちら
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      パスワードを忘れた方は{' '}
                      <button
                        onClick={() => handleModeChange('reset')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        こちら
                      </button>
                    </p>
                  </>
                )}
                {mode === 'signup' && (
                  <p className="text-sm text-gray-600">
                    既にアカウントをお持ちの方は{' '}
                    <button
                      onClick={() => handleModeChange('signin')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      こちら
                    </button>
                  </p>
                )}
                {mode === 'reset' && (
                  <p className="text-sm text-gray-600">
                    ログインページに{' '}
                    <button
                      onClick={() => handleModeChange('signin')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      戻る
                    </button>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;