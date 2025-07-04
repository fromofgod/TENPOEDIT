import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyCard from './PropertyCard';
import { useAirtableProperties } from '../hooks/useAirtableProperties';

const { FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiArrowRight } = FiIcons;

const NewPropertiesCarousel = () => {
  const { properties } = useAirtableProperties();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Get the newest properties from Airtable
  const newProperties = properties
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 6);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isHovered || newProperties.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === Math.max(0, newProperties.length - 3) ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, newProperties.length]);

  if (newProperties.length === 0) {
    return null; // 物件がない場合は表示しない
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.max(0, newProperties.length - 3) ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, newProperties.length - 3) : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const maxSlides = Math.max(0, newProperties.length - 2);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">新着物件</h2>
            <p className="text-lg text-gray-600">Airtableから取得した最新の物件情報</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title={isAutoPlaying ? '自動再生を停止' : '自動再生を開始'}
            >
              <SafeIcon icon={isAutoPlaying ? FiPause : FiPlay} className="text-gray-600" />
            </button>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
                disabled={currentIndex === 0}
              >
                <SafeIcon icon={FiChevronLeft} className="text-primary-600" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors"
                disabled={currentIndex >= maxSlides}
              >
                <SafeIcon icon={FiChevronRight} className="text-primary-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {newProperties.map((property) => (
              <div key={property.id} className="w-1/3 flex-shrink-0 px-3">
                <PropertyCard property={property} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        {maxSlides > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to="/search?sort=newest"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>新着物件をすべて見る</span>
            <SafeIcon icon={FiArrowRight} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewPropertiesCarousel;