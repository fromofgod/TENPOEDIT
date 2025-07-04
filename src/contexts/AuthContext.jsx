import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 管理者アカウントリスト
const ADMIN_EMAILS = [
  'tenpotokyo@gmail.com',
  'admin@tenpo-bukken.com'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    console.log('🔐 Initializing Auth Provider...');
    
    // 現在のセッションを取得
    const getSession = async () => {
      try {
        console.log('🔍 Getting current session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        } else {
          console.log('📋 Session status:', session ? 'Active' : 'None');
          setSession(session);
          
          if (session?.user) {
            const userData = processUser(session.user);
            setUser(userData);
            console.log('👤 User authenticated:', userData.email);
          }
        }
      } catch (error) {
        console.error('❌ Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 認証状態の変化を監視
    console.log('👂 Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        setSession(session);
        
        if (session?.user) {
          const userData = processUser(session.user);
          setUser(userData);
          console.log('✅ User logged in:', userData.email);
        } else {
          setUser(null);
          console.log('👋 User logged out');
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  // ユーザーデータを処理
  const processUser = (supabaseUser) => {
    const isAdmin = ADMIN_EMAILS.includes(supabaseUser.email);
    
    const userData = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.user_metadata?.name || 
            supabaseUser.email.split('@')[0],
      picture: supabaseUser.user_metadata?.avatar_url || 
               supabaseUser.user_metadata?.picture ||
               `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email.split('@')[0])}&background=22c55e&color=ffffff`,
      provider: supabaseUser.app_metadata?.provider || 'email',
      loginTime: new Date().toISOString(),
      isAdmin,
      emailConfirmed: supabaseUser.email_confirmed_at ? true : false
    };

    console.log('👤 Processed user data:', {
      email: userData.email,
      provider: userData.provider,
      isAdmin: userData.isAdmin,
      emailConfirmed: userData.emailConfirmed
    });

    return userData;
  };

  // メール・パスワードでサインアップ
  const signUpWithEmail = async (email, password, fullName) => {
    try {
      console.log('📝 Signing up with email:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      console.log('✅ Sign up result:', {
        user: data.user?.email,
        session: !!data.session,
        needsConfirmation: !data.session
      });

      if (data.user && !data.session) {
        showMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。', 'info');
        return { needsConfirmation: true, user: data.user };
      }

      showMessage('アカウントが作成されました！', 'success');
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      showMessage(getErrorMessage(error), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // メール・パスワードでサインイン
  const signInWithEmail = async (email, password) => {
    try {
      console.log('🔑 Signing in with email:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('✅ Sign in successful:', data.user?.email);
      showMessage('ログインしました！', 'success');
      return data;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      showMessage(getErrorMessage(error), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Googleでサインイン
  const signInWithGoogle = async () => {
    try {
      console.log('🔍 Starting Google OAuth...');
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;

      console.log('🔄 OAuth redirect initiated');
      // OAuth の場合、リダイレクトが発生するのでここではメッセージを表示しない
      return data;
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      showMessage(getErrorMessage(error), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // パスワードリセット
  const resetPassword = async (email) => {
    try {
      console.log('📧 Sending password reset to:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      console.log('✅ Password reset email sent');
      showMessage('パスワードリセットメールを送信しました。', 'success');
      return true;
    } catch (error) {
      console.error('❌ Password reset error:', error);
      showMessage(getErrorMessage(error), 'error');
      throw error;
    }
  };

  // パスワード更新
  const updatePassword = async (newPassword) => {
    try {
      console.log('🔒 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      console.log('✅ Password updated successfully');
      showMessage('パスワードが更新されました。', 'success');
      return true;
    } catch (error) {
      console.error('❌ Password update error:', error);
      showMessage(getErrorMessage(error), 'error');
      throw error;
    }
  };

  // プロフィール更新
  const updateProfile = async (updates) => {
    try {
      console.log('👤 Updating profile...');
      
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;

      console.log('✅ Profile updated successfully');
      showMessage('プロフィールが更新されました。', 'success');
      return true;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      showMessage(getErrorMessage(error), 'error');
      throw error;
    }
  };

  // サインアウト
  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      localStorage.removeItem('favorites');
      
      console.log('✅ Sign out successful');
      showMessage('ログアウトしました', 'success');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      showMessage('ログアウトに失敗しました', 'error');
    }
  };

  // エラーメッセージの変換
  const getErrorMessage = (error) => {
    const message = error.message || error.toString();
    
    switch (message) {
      case 'Invalid login credentials':
      case 'Invalid email or password':
        return 'メールアドレスまたはパスワードが正しくありません';
      case 'Email already registered':
      case 'User already registered':
        return 'このメールアドレスは既に登録されています';
      case 'Password should be at least 6 characters':
        return 'パスワードは6文字以上で入力してください';
      case 'Invalid email':
        return '有効なメールアドレスを入力してください';
      case 'User not found':
        return 'ユーザーが見つかりません';
      case 'Email not confirmed':
        return 'メールアドレスが確認されていません。確認メールをチェックしてください。';
      case 'Signup requires a valid password':
        return 'パスワードが無効です。6文字以上で入力してください。';
      case 'Unable to validate email address: invalid format':
        return '無効なメールアドレス形式です';
      default:
        console.log('🔍 Unknown error message:', message);
        return message || '予期しないエラーが発生しました';
    }
  };

  // メッセージ表示
  const showMessage = (text, type = 'success') => {
    const message = document.createElement('div');
    message.textContent = text;
    message.className = `fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 text-sm text-white max-w-sm ${
      type === 'success' ? 'bg-green-600' : 
      type === 'error' ? 'bg-red-600' : 
      type === 'info' ? 'bg-blue-600' : 'bg-gray-600'
    }`;
    document.body.appendChild(message);

    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 5000);
  };

  const value = {
    user,
    session,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    supabase
  };

  console.log('🔐 Auth Provider state:', {
    user: user?.email || 'None',
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};