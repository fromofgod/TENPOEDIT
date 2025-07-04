import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTool, FiDollarSign, FiFileText, FiUsers, FiCheckCircle, FiPhone, FiMail, FiCalendar } = FiIcons;

const OpeningSupportPage = () => {
  const supportServices = [
    {
      icon: FiFileText,
      title: '開業手続きサポート',
      description: '営業許可申請、届出書類の作成から提出まで専門スタッフがサポート',
      details: [
        '飲食店営業許可申請',
        '防火管理者選任届',
        '深夜酒類提供飲食店営業開始届出書',
        '労働基準監督署への届出',
        '税務署への開業届'
      ]
    },
    {
      icon: FiDollarSign,
      title: '資金調達サポート',
      description: '開業資金の調達方法をアドバイス、融資申請もサポートします',
      details: [
        '日本政策金融公庫の創業融資',
        '地方自治体の制度融資',
        '銀行融資のサポート',
        '事業計画書の作成支援',
        '資金繰り計画の策定'
      ]
    },
    {
      icon: FiTool,
      title: '内装・設備サポート',
      description: '信頼できる内装業者や設備業者をご紹介、コストダウンも実現',
      details: [
        '内装デザイナーのご紹介',
        '厨房設備業者のご紹介',
        '電気・ガス・水道工事業者',
        '看板・サイン業者',
        '清掃業者のご紹介'
      ]
    },
    {
      icon: FiUsers,
      title: 'マーケティングサポート',
      description: '集客戦略から広告宣伝まで、開業後の成功をサポートします',
      details: [
        'ターゲット分析',
        'メニュー開発のアドバイス',
        'SNSマーケティング',
        'グルメサイト登録支援',
        'プレスリリース作成'
      ]
    }
  ];

  const openingFlow = [
    { step: 1, title: '物件決定', description: '理想の店舗物件を決定' },
    { step: 2, title: '事業計画作成', description: '詳細な事業計画書を作成' },
    { step: 3, title: '資金調達', description: '融資申請・資金確保' },
    { step: 4, title: '許可申請', description: '営業許可等の申請手続き' },
    { step: 5, title: '内装工事', description: '店舗の内装・設備工事' },
    { step: 6, title: 'スタッフ採用', description: '従業員の採用・研修' },
    { step: 7, title: '開業準備', description: '最終準備・プレオープン' },
    { step: 8, title: 'グランドオープン', description: '正式オープン・集客開始' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              開業サポート
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              店舗開業の夢を実現するため、手続きから資金調達まで専門スタッフが全面サポート
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              開業サポートサービス
            </h2>
            <p className="text-lg text-gray-600">
              あらゆる開業手続きを専門スタッフがサポートします
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={service.icon} className="text-xl text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                          <SafeIcon icon={FiCheckCircle} className="text-green-500 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Flow */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              開業までの流れ
            </h2>
            <p className="text-lg text-gray-600">
              計画から開業まで、ステップバイステップでサポートします
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {openingFlow.map((flow, index) => (
              <motion.div
                key={flow.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="text-center bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {flow.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {flow.title}
                </h3>
                <p className="text-gray-600 text-sm">{flow.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              開業サポートのご相談
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              無料相談を実施中！お気軽にお問い合わせください
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiPhone} className="text-xl" />
                <span className="text-lg">03-1234-5678</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiMail} className="text-xl" />
                <span className="text-lg">support@tenpo-bukken.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiCalendar} className="text-xl" />
                <span className="text-lg">平日 9:00-18:00</span>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">開業サポート料金</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="font-medium mb-2">基本サポートパック</h4>
                  <p className="text-blue-100 text-sm">手続き代行 + 業者紹介</p>
                  <p className="text-2xl font-bold">¥150,000〜</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">フルサポートパック</h4>
                  <p className="text-blue-100 text-sm">全工程サポート + アフターケア</p>
                  <p className="text-2xl font-bold">¥300,000〜</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OpeningSupportPage;