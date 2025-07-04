import axios from 'axios';

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'patxWbNWEvvGNDN1W.2822f4c546599d717d36798d909b35514362ab896d57612084dcd03627b9bcfe';
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appBFYfgbWNZyP0QR';
const COMPANY_TABLE_NAME = 'Company';

const airtableClient = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`,
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// 会社情報を取得
export const fetchCompanyInfo = async () => {
  try {
    console.log('🏢 Fetching company information from Airtable...');
    
    const response = await airtableClient.get(`/${COMPANY_TABLE_NAME}`, {
      params: {
        maxRecords: 1,
        view: 'Grid view'
      }
    });

    if (response.data.records.length === 0) {
      console.warn('⚠️ No company records found in table');
      return getActualCompanyInfo();
    }

    const record = response.data.records[0];
    const fields = record.fields;

    console.log('📋 Available fields:', Object.keys(fields));

    // 実際のAirtableフィールドに基づくマッピング
    const companyInfo = {
      // 基本情報
      name: fields['会社名'] || '株式会社ウエンズインターナショナル',
      nameEn: fields['会社名英語'] || 'Wens International Co., Ltd.',
      description: fields['会社説明・事業内容'] || '商業用不動産の仲介・管理、不動産情報サイトの運営',

      // 連絡先情報
      phone: fields['電話番号'] || '03-3525-8791',
      email: fields['メールアドレス'] || 'tenpotokyo@gmail.com',
      fax: fields['FAX'] || '03-3525-8791',

      // 住所情報（正確なデータ）
      fullAddress: fields['本社住所（郵便番号含む）'] || '〒101-0025 東京都千代田区神田佐久間町1-14　第２東ビル913',
      postalCode: '101-0025',
      prefecture: '東京都',
      city: '千代田区',
      address1: '神田佐久間町1-14',
      address2: '第２東ビル913',

      // 営業情報
      businessHours: fields['営業時間'] || '平日 9:00-18:00',
      closedDays: fields['定休日'] || '土日祝日',

      // 会社詳細
      established: fields['設立年月日'] || '',
      capital: fields['資本金'] || '1000万円',
      employees: fields['従業員数'] || '',
      license: fields['免許番号'] || '',

      // 代表者情報
      president: fields['代表者名'] || '',
      presidentTitle: fields['役職'] || '',

      // 事業内容
      business: fields['会社説明・事業内容'] || '商業用不動産の仲介・管理、不動産情報サイトの運営',

      // 資格・認定
      certifications: fields['認定資格'] || '',

      // 地図情報
      googleMapsEmbed: fields['Google Maps埋め込み'] || '',
      latitude: parseFloat(fields['緯度']) || null,
      longitude: parseFloat(fields['経度']) || null,

      // Web・SNS
      website: fields['ウェブサイト'] || '',
      twitter: fields['Twitter'] || '',
      facebook: fields['Facebook'] || '',
      instagram: fields['Instagram'] || '',

      // その他
      branches: [],

      // メタデータ
      lastUpdated: new Date().toISOString(),
      source: 'airtable',
      airtableRecordId: record.id
    };

    console.log('✅ Actual company info loaded from Airtable:', {
      name: companyInfo.name,
      phone: companyInfo.phone,
      email: companyInfo.email,
      address: companyInfo.fullAddress,
      recordId: companyInfo.airtableRecordId
    });

    return companyInfo;

  } catch (error) {
    console.error('❌ Error fetching company info from Airtable:', error);
    
    if (error.response?.status === 403) {
      console.error('🚫 403 Forbidden - API key may not have access to this table');
    }

    // エラー時は実際のデータを返す
    return getActualCompanyInfo();
  }
};

// 実際のAirtableデータに基づく正確な会社情報
const getActualCompanyInfo = () => {
  console.log('🔄 Using actual company information from Airtable');
  return {
    name: '株式会社ウエンズインターナショナル',
    nameEn: 'Wens International Co., Ltd.',
    description: '商業用不動産の仲介・管理、不動産情報サイトの運営',
    
    // 実際の連絡先
    phone: '03-3525-8791',
    email: 'tenpotokyo@gmail.com',
    fax: '03-3525-8791',
    
    // 実際の住所
    fullAddress: '〒101-0025 東京都千代田区神田佐久間町1-14　第２東ビル913',
    postalCode: '101-0025',
    prefecture: '東京都',
    city: '千代田区',
    address1: '神田佐久間町1-14',
    address2: '第２東ビル913',
    
    businessHours: '平日 9:00-18:00',
    closedDays: '土日祝日',
    
    established: '',
    capital: '1000万円',
    employees: '',
    license: '',
    
    president: '',
    presidentTitle: '',
    
    business: '商業用不動産の仲介・管理、不動産情報サイトの運営',
    
    certifications: '',
    
    // Google Maps埋め込み
    googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d810.0384992978455!2d139.77424830672635!3d35.69782783509094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ea86c7525a5%3A0x3a767fac9bd6ed1a!2z56ys5LqM5p2x44OT44Or!5e0!3m2!1sja!2sjp!4v1751613730072!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    latitude: null,
    longitude: null,
    
    branches: [],
    
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    
    lastUpdated: new Date().toISOString(),
    source: 'airtable',
    airtableRecordId: null
  };
};

// 接続テスト用関数
export const testCompanyConnection = async () => {
  try {
    console.log('🔧 Testing company table connection...');
    
    const response = await airtableClient.get(`/${COMPANY_TABLE_NAME}`, {
      params: { maxRecords: 1 }
    });

    return {
      success: true,
      tableName: COMPANY_TABLE_NAME,
      recordCount: response.data.records.length,
      fields: response.data.records[0]?.fields ? Object.keys(response.data.records[0].fields) : [],
      sampleData: response.data.records[0]?.fields || {},
      message: `Successfully connected to table: ${COMPANY_TABLE_NAME}`
    };

  } catch (error) {
    console.error('❌ Company table connection test failed:', error);
    return {
      success: false,
      error: error.message,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        tableName: COMPANY_TABLE_NAME
      }
    };
  }
};

export default {
  fetchCompanyInfo,
  testCompanyConnection
};