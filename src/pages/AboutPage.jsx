import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCompanyInfo } from '../hooks/useCompanyInfo';

const { FiTarget, FiUsers, FiTrendingUp, FiShield, FiAward, FiMapPin, FiPhone, FiMail, FiClock, FiExternalLink, FiDatabase } = FiIcons;

const AboutPage = () => {
  const { companyInfo, loading } = useCompanyInfo();

  const stats = [
    { number: '10,000+', label: '掲載物件数', icon: FiTarget },
    { number: '5,000+', label: '成約実績', icon: FiTrendingUp },
    { number: '500+', label: '提携企業', icon: FiUsers },
    { number: companyInfo?.established?.includes('2009') ? '15年' : '10年+', label: 'サービス運営', icon: FiAward }
  ];

  const values = [
    {
      icon: FiTarget,
      title: '最適なマッチング',
      description: 'お客様のニーズに最も適した物件をご提案します'
    },
    {
      icon: FiShield,
      title: '安心・安全',
      description: '厳格な審査を通過した信頼できる物件のみを掲載'
    },
    {
      icon: FiUsers,
      title: '専門サポート',
      description: '経験豊富なスタッフが契約まで丁寧にサポート'
    },
    {
      icon: FiTrendingUp,
      title: '市場情報提供',
      description: '最新の市場動向や投資情報を定期的に提供'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="bg-primary-600 h-64"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
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
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">会社概要</h1>
              {companyInfo.source === 'airtable' && (
                <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  <SafeIcon icon={FiDatabase} className="text-sm" />
                  <span>Airtable連携</span>
                </div>
              )}
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {companyInfo.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {companyInfo.name}について
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  {companyInfo.name}は、{companyInfo.established}の設立以来、商業用不動産の専門サイトとして
                  多くのお客様にご利用いただいております。
                </p>
                <p>
                  {companyInfo.business.split('、').map((item, index) => (
                    <span key={index}>
                      {item}
                      {index < companyInfo.business.split('、').length - 1 && '、'}
                    </span>
                  ))}を通じて、お客様の事業成功をサポートしてまいりました。
                </p>
                <p>
                  豊富な経験と専門知識を持つスタッフが、物件探しから契約、
                  開業後のサポートまで一貫してお手伝いいたします。
                </p>
              </div>
              
              {companyInfo.website && (
                <div className="mt-6">
                  <a 
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <span>公式サイトを見る</span>
                    <SafeIcon icon={FiExternalLink} />
                  </a>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
                alt="オフィス風景"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">実績と信頼</h2>
            <p className="text-lg text-gray-600">数字で見る私たちの実績</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={stat.icon} className="text-2xl text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">私たちの価値観</h2>
            <p className="text-lg text-gray-600">お客様に選ばれ続ける理由</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-lg"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={value.icon} className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">会社情報</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-gray-600 font-medium w-24 flex-shrink-0">会社名</div>
                  <div className="text-gray-900">{companyInfo.name}</div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-gray-600 font-medium w-24 flex-shrink-0">設立</div>
                  <div className="text-gray-900">{companyInfo.established}</div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-gray-600 font-medium w-24 flex-shrink-0">資本金</div>
                  <div className="text-gray-900">{companyInfo.capital}</div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-gray-600 font-medium w-24 flex-shrink-0">従業員数</div>
                  <div className="text-gray-900">{companyInfo.employees}</div>
                </div>
                
                {companyInfo.president && (
                  <div className="flex items-start space-x-3">
                    <div className="text-gray-600 font-medium w-24 flex-shrink-0">代表者</div>
                    <div className="text-gray-900">
                      {companyInfo.presidentTitle} {companyInfo.president}
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className="text-gray-600 font-medium w-24 flex-shrink-0">事業内容</div>
                  <div className="text-gray-900">
                    {companyInfo.business}
                  </div>
                </div>

                {companyInfo.license && (
                  <div className="flex items-start space-x-3">
                    <div className="text-gray-600 font-medium w-24 flex-shrink-0">免許番号</div>
                    <div className="text-gray-900 text-sm">{companyInfo.license}</div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">アクセス情報</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiMapPin} className="text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">本社</div>
                    <div className="text-gray-600 text-sm">
                      {companyInfo.fullAddress}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiPhone} className="text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">電話番号</div>
                    <div className="text-gray-600">{companyInfo.phone}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiMail} className="text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">メールアドレス</div>
                    <div className="text-gray-600">{companyInfo.email}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiClock} className="text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">営業時間</div>
                    <div className="text-gray-600">{companyInfo.businessHours}</div>
                    <div className="text-gray-500 text-sm">定休日: {companyInfo.closedDays}</div>
                  </div>
                </div>
              </div>

              {/* Map */}
              {companyInfo.latitude && companyInfo.longitude && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">所在地マップ</h4>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <SafeIcon icon={FiMapPin} className="text-4xl mx-auto mb-2" />
                      <p className="text-sm">Google Maps</p>
                      <p className="text-xs">
                        {companyInfo.latitude.toFixed(4)}, {companyInfo.longitude.toFixed(4)}
                      </p>
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
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Branches */}
          {companyInfo.branches && companyInfo.branches.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">支社・営業所</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyInfo.branches.map((branch, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <h4 className="text-lg font-semibold text-primary-600 mb-3">{branch.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMapPin} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{branch.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiPhone} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{branch.phone}</span>
                      </div>
                      {branch.manager && (
                        <div className="text-gray-500 text-xs mt-2">
                          責任者: {branch.manager}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;