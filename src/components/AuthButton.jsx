import React,{useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AuthModal from './AuthModal';
import {useAuth} from '../contexts/AuthContext';
import {Link} from 'react-router-dom';

const {FiUser,FiLogOut,FiHeart,FiSettings,FiChevronDown,FiEdit,FiShield}=FiIcons;

const AuthButton=()=> {
  const {user,signOut,loading,isAdmin}=useAuth();
  const [showDropdown,setShowDropdown]=useState(false);
  const [showAuthModal,setShowAuthModal]=useState(false);
  const [authModalMode,setAuthModalMode]=useState('signin');

  const handleSignIn=(mode='signin')=> {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut=async ()=> {
    await signOut();
    setShowDropdown(false);
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center space-x-3">
          <button
            onClick={()=> handleSignIn('signin')}
            className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            ログイン
          </button>
          <button
            onClick={()=> handleSignIn('signup')}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            新規登録
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={()=> setShowAuthModal(false)}
          initialMode={authModalMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={()=> setShowDropdown(!showDropdown)}
          className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="relative">
            <img
              src={user.picture}
              alt={user.name}
              className="w-7 h-7 rounded-full ring-2 ring-emerald-100"
            />
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-white"></div>
            )}
          </div>
          <span className="hidden md:block max-w-24 truncate">{user.name}</span>
          {isAdmin && (
            <span className="hidden sm:block bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              管理者
            </span>
          )}
          <motion.div
            animate={{rotate: showDropdown ? 180 : 0}}
            transition={{duration: 0.2}}
          >
            <SafeIcon icon={FiChevronDown} className="text-xs text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{opacity: 0,y: -10,scale: 0.95}}
              animate={{opacity: 1,y: 0,scale: 1}}
              exit={{opacity: 0,y: -10,scale: 0.95}}
              transition={{duration: 0.2}}
              className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-12 h-12 rounded-full ring-3 ring-emerald-200"
                    />
                    {isAdmin && (
                      <div className="absolute -bottom-1 -right-1">
                        <SafeIcon icon={FiShield} className="w-5 h-5 text-purple-600 bg-white rounded-full p-1" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {isAdmin && (
                        <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-0.5 rounded-full">
                          管理者
                        </span>
                      )}
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {user.provider==='google' ? 'Google' : 'メール'}
                      </span>
                      {user.emailConfirmed===false && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          未確認
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  to="/favorites"
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={()=> setShowDropdown(false)}
                >
                  <SafeIcon icon={FiHeart} className="text-red-500" />
                  <span>お気に入り物件</span>
                </Link>

                {isAdmin && (
                  <>
                    <div className="border-t border-gray-100 my-2"></div>
                    <div className="px-4 py-2">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">管理者機能</p>
                    </div>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={()=> setShowDropdown(false)}
                    >
                      <SafeIcon icon={FiShield} className="text-purple-500" />
                      <span>管理者ダッシュボード</span>
                    </Link>
                    <Link
                      to="/admin/article/new"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={()=> setShowDropdown(false)}
                    >
                      <SafeIcon icon={FiEdit} className="text-blue-500" />
                      <span>記事を投稿</span>
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} />
                  <span>ログアウト</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={()=> setShowDropdown(false)}
          />
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={()=> setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default AuthButton;