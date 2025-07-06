import React,{Suspense} from 'react';
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {AuthProvider} from './contexts/AuthContext';
import {FavoritesProvider} from './contexts/FavoritesContext';
import {BlogProvider} from './contexts/BlogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MapSearchPage from './pages/MapSearchPage';
import PropertyDetail from './pages/PropertyDetail';
import ListPropertyPage from './pages/ListPropertyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OpeningSupportPage from './pages/OpeningSupportPage';
import RestaurantNewsPage from './pages/RestaurantNewsPage';
import BusinessLinksPage from './pages/BusinessLinksPage';
import RealEstateBlogPage from './pages/RealEstateBlogPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminArticleEditor from './components/AdminArticleEditor';
import AuthTestPage from './pages/AuthTestPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './App.css';

// Loading component
const AppLoading=()=> (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">アプリケーションを読み込み中...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <BlogProvider>
            <div className="min-h-screen bg-gray-50 font-noto">
              <Header />
              <Suspense fallback={<AppLoading />}>
                <motion.main
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{duration: 0.3}}
                >
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/map-search" element={<MapSearchPage />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/list-property" element={<ListPropertyPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/opening-support" element={<OpeningSupportPage />} />
                    <Route path="/restaurant-news" element={<RestaurantNewsPage />} />
                    <Route path="/business-links" element={<BusinessLinksPage />} />
                    <Route path="/real-estate-blog" element={<RealEstateBlogPage />} />
                    <Route path="/auth-test" element={<AuthTestPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/article/new" element={<AdminArticleEditor />} />
                    <Route path="/admin/article/edit/:id" element={<AdminArticleEditor />} />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </motion.main>
              </Suspense>
              <Footer />
            </div>
          </BlogProvider>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;