import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShare2, FiCopy, FiCheck, FiTwitter, FiFacebook, FiMail, FiMessageCircle } = FiIcons;

const ShareButton = ({ 
  url = window.location.href, 
  title = document.title, 
  text = '', 
  className = '',
  size = 'normal'
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    small: 'p-1.5 text-xs',
    normal: 'p-2 sm:p-3 text-sm sm:text-base',
    large: 'p-3 sm:p-4 text-base sm:text-lg'
  };

  // Web Share APIがサポートされているかチェック
  const canUseWebShare = navigator.share && navigator.canShare;

  // Web Share APIを使用
  const handleWebShare = async () => {
    try {
      const shareData = {
        title: title,
        text: text,
        url: url
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('✅ Shared successfully');
      } else {
        // Web Share APIが使えない場合はドロップダウンを表示
        setShowDropdown(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('❌ Share failed:', error);
        // エラー時はドロップダウンを表示
        setShowDropdown(true);
      }
    }
  };

  // URLをクリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // 成功メッセージを表示
      const message = document.createElement('div');
      message.textContent = 'URLをクリップボードにコピーしました！';
      message.className = 'fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
      document.body.appendChild(message);
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);
    } catch (error) {
      console.error('❌ Copy failed:', error);
      // フォールバック: テキストエリアを使用
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SNSシェア用のURL生成
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
  };

  // SNSシェアを開く
  const openShare = (platform) => {
    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
    setShowDropdown(false);
  };

  const handleMainButtonClick = () => {
    if (canUseWebShare) {
      handleWebShare();
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleMainButtonClick}
        className={`${sizeClasses[size]} rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ${className}`}
        title={canUseWebShare ? 'シェア' : 'シェアオプションを表示'}
      >
        <SafeIcon icon={FiShare2} />
      </button>

      {/* シェアドロップダウン（Web Share API非対応時） */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">この物件をシェア</h3>
            </div>
            
            <div className="p-3 space-y-2">
              {/* URLコピー */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={copied ? FiCheck : FiCopy} className={`text-sm ${copied ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {copied ? 'コピー完了！' : 'URLをコピー'}
                  </p>
                  <p className="text-xs text-gray-500">クリップボードにコピー</p>
                </div>
              </button>

              {/* Twitter */}
              <button
                onClick={() => openShare('twitter')}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiTwitter} className="text-sm text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Twitter</p>
                  <p className="text-xs text-gray-500">ツイートでシェア</p>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={() => openShare('facebook')}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiFacebook} className="text-sm text-blue-800" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Facebook</p>
                  <p className="text-xs text-gray-500">Facebookでシェア</p>
                </div>
              </button>

              {/* LINE */}
              <button
                onClick={() => openShare('line')}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiMessageCircle} className="text-sm text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">LINE</p>
                  <p className="text-xs text-gray-500">LINEでシェア</p>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={() => openShare('email')}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiMail} className="text-sm text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">メール</p>
                  <p className="text-xs text-gray-500">メールでシェア</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景クリックでドロップダウンを閉じる */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ShareButton;