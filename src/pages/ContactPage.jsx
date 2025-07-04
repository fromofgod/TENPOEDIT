import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

const { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiFax, FiDatabase } = FiIcons;

const ContactPage = () => {
  const { companyInfo, loading } = useCompanyInfo();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  const inquiryTypes = [
    { value: '', label: 'お問い合わせ種別を選択' },
    { value: 'property-search', label: '物件探しについて' },
    { value: 'property-listing', label: '物件掲載について' },
    { value: 'partnership', label: '業務提携について' },
    { value: 'system', label: 'システム・技術について' },
    { value: 'other', label: 'その他' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('お問い合わせを受け付けました。2営業日以内にご返信いたします。');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      inquiryType: '',
      subject: '',
      message: ''
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="bg-primary-600 h-64"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">会社情報の読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  const contactInfo = [
    {
      icon: FiPhone,
      title: '電話番号',
      content: companyInfo.phone,
      description: companyInfo.businessHours
    },
    {
      icon: FiMail,
      title: 'メールアドレス',
      content: companyInfo.email,
      description: '24時間受付'
    },
    {
      icon: FiMapPin,
      title: '所在地',
      content: companyInfo.fullAddress,
      description: '本社所在地'
    },
    {
      icon: FiClock,
      title: '営業時間',
      content: companyInfo.businessHours,
      description: `定休日: ${companyInfo.closedDays}`
    }
  ];

  // FAXがある場合は追加
  if (companyInfo.fax) {
    contactInfo.splice(2, 0, {
      icon: FiFax,
      title: 'FAX番号',
      content: companyInfo.fax,
      description: '24時間受付'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold">お問い合わせ</h1>
              {companyInfo.source === 'airtable' && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  <SafeIcon icon={FiDatabase} className="text-sm" />
                  <span>Live</span>
                </div>
              )}
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              ご質問やご相談がございましたら、お気軽にお問い合わせください
            </p>
            <p className="text-blue-200 mt-4">
              {companyInfo.name}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">各種お問い合わせ先</h2>
            <p className="text-lg text-gray-600">お急ぎの場合はお電話でのお問い合わせをおすすめします</p>
          </motion.div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(contactInfo.length, 4)} gap-8`}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={info.icon} className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-900 font-medium mb-1 break-all">
                  {info.content}
                </p>
                <p className="text-sm text-gray-600">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">お問い合わせフォーム</h2>
            <p className="text-lg text-gray-600">下記フォームにご記入の上、送信してください</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="山田 太郎"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="03-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    会社名・団体名
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="株式会社○○"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  お問い合わせ種別 *
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {inquiryTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  件名 *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="お問い合わせの件名をご記入ください"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  お問い合わせ内容 *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="お問い合わせの詳細をご記入ください"
                />
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiSend} />
                  <span>送信する</span>
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>
                  ※ お問い合わせ内容によっては、回答にお時間をいただく場合がございます。<br />
                  ※ 営業時間外のお問い合わせは、翌営業日以降の対応となります。
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">アクセスマップ</h2>
            <p className="text-lg text-gray-600">ご来社をご希望の方は事前にお電話でご連絡ください</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-200 rounded-lg h-96 flex items-center justify-center"
          >
            <div className="text-center text-gray-600">
              <SafeIcon icon={FiMapPin} className="text-4xl mx-auto mb-4" />
              <p className="text-lg font-medium">{companyInfo.name}</p>
              <p className="text-sm mb-2">{companyInfo.fullAddress}</p>
              {companyInfo.latitude && companyInfo.longitude && (
                <p className="text-xs text-gray-500">
                  座標: {companyInfo.latitude.toFixed(4)}, {companyInfo.longitude.toFixed(4)}
                </p>
              )}
              {companyInfo.mapUrl && (
                <a
                  href={companyInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                >
                  Google Mapsで開く
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Branches */}
      {companyInfo.branches && companyInfo.branches.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">支社・営業所</h2>
              <p className="text-lg text-gray-600">各地域での対応も承っております</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companyInfo.branches.map((branch, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold text-primary-600 mb-4">{branch.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{branch.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiPhone} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{branch.phone}</span>
                    </div>
                    {branch.manager && (
                      <div className="text-gray-500 text-xs border-t pt-2">
                        責任者: {branch.manager}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ContactPage;