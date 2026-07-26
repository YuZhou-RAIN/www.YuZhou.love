const LANG_KEY = 'yuzhouLang';
const SUPPORTED_LANGS = ['auto', 'zh', 'en', 'ja', 'ko'];
const LANG_NATIVE = { zh: '中文', en: 'English', ja: '日本語', ko: '한국어' };
let currentLang = 'zh';

const i18nData = {
  zh: {
    site: { title: '雨州 Minecraft' },
    sidebar: { title: '雨州 Minecraft' },
    nav: { home: '首页', features: '特色', join: '加入', about: '关于' },
    topbar: { title: '雨州 Minecraft' },
    theme: { auto: '跟随系统', light: '浅色模式', dark: '深色模式' },
    copy: {
      ip: '复制服务器IP',
      success: { ip: '服务器IP已复制！', qq: 'QQ群号已复制！' }
    },
    menu: { label: '菜单' },
    language: { label: '语言' },
    footer: {
      copyright: 'Copyright © 2025-2026 ',
      rights: '. All Rights Reserved.',
      home: '首页', features: '特色', join: '加入', about: '关于'
    },
    error: { load: '加载失败' },
    loading: { alt: '雨州Minecraft加载中' },
    lang: {
      auto: '跟随系统', zh: '中文', en: '英语', ja: '日语', ko: '韩语'
    },
    hero: {
      title1: '雨州', title2: 'Minecraft 服务器',
      subtitle: '跨平台互通体验，打造最佳游戏世界。无论你是Java版还是基岩版玩家，都能在这里相遇。',
      joinBtn: '立即加入', exploreBtn: '探索特色'
    },
    server: { address: { label: '服务器地址' }, qq: { label: 'QQ交流群' } },
    features: {
      tag: 'FEATURES', title: '服务器特色',
      desc: '我们致力于提供稳定、有趣的游戏体验',
      card1: { title: '跨平台支持', desc: 'Java版与基岩版完全互通，无论使用PC、手机还是主机，都能一起游戏。' },
      card2: { title: '安全稳定', desc: '企业级服务器配置，24小时不间断运行，定期备份确保数据安全。' },
      card3: { title: '活跃社区', desc: '友好的玩家社区氛围，定期举办活动，与志同道合的玩家一起探索。' }
    },
    news: {
      tag: 'NEWS', title: '最新动态',
      desc: '了解服务器的最新更新与活动',
      card1: { title: '服务器版本更新', desc: '已升级至最新版本，新增多项游戏功能，优化了服务器性能。' },
      card2: { title: '主城建设启动', desc: '主城建设计划正式启动，欢迎玩家参与建设，共同打造繁华都市。' },
      card3: { title: '开启公测', desc: '雨州服务器正式开启公测，Java版和基岩版玩家均可加入体验！' }
    },
    'features.page': {
      tag: 'FEATURES', title: '服务器特色',
      desc: '企业级配置，打造极致游戏体验'
    },
    'features.section': { title: '核心特性' },
    'features.item1': { title: '全平台互通', desc: 'Java版与基岩版完全互通，无论PC、手机还是主机都能一起游戏' },
    'features.item2': { title: '企业级硬件', desc: 'Intel 20线程处理器，32GB DDR4内存，SSD高速存储' },
    'features.item3': { title: '低延迟网络', desc: '全国平均延迟39ms，热点城市低于20ms，流畅不卡顿' },
    'features.item4': { title: '数据安全', desc: '24小时自动备份，数据永不丢失，专业防护杜绝外挂' },
    'join.page': { tag: 'JOIN US', title: '加入指南', desc: '简单几步，开启你的冒险之旅' },
    'join.section1': { title: 'Java版加入' },
    'join.step1.1': { title: '启动游戏', desc: '打开Minecraft Java版客户端，确保版本兼容' },
    'join.step1.2': { title: '多人游戏', desc: '点击主菜单的"多人游戏"选项' },
    'join.step1.3': { title: '添加服务器', desc: '点击"添加服务器"，输入地址：mc.yuzhou-mc.cn' },
    'join.section2': { title: '基岩版加入' },
    'join.step2.1': { title: '打开游戏', desc: '启动Minecraft基岩版（手机/主机/Windows）' },
    'join.step2.2': { title: '进入服务器', desc: '点击"游玩"→"服务器"→"添加服务器"' },
    'join.step2.3': { title: '填写信息', desc: '地址：mc.yuzhou-mc.cn，端口：19132' },
    'about.page': { tag: 'ABOUT', title: '关于我们', desc: '联系我们，加入社区' },
    'about.section': { title: '联系方式' },
    'about.card1': { title: '服务器地址', btn: '复制地址' },
    'about.card2': { title: 'QQ交流群', btn: '复制群号' }
  },

  en: {
    site: { title: 'YuZhou Minecraft' },
    sidebar: { title: 'YuZhou Minecraft' },
    nav: { home: 'Home', features: 'Features', join: 'Join', about: 'About' },
    topbar: { title: 'YuZhou Minecraft' },
    theme: { auto: 'System', light: 'Light Mode', dark: 'Dark Mode' },
    copy: {
      ip: 'Copy Server IP',
      success: { ip: 'Server IP Copied!', qq: 'QQ Group Number Copied!' }
    },
    menu: { label: 'Menu' },
    language: { label: 'Language' },
    footer: {
      copyright: 'Copyright © 2025-2026 ',
      rights: '. All Rights Reserved.',
      home: 'Home', features: 'Features', join: 'Join', about: 'About'
    },
    error: { load: 'Failed to Load' },
    loading: { alt: 'YuZhou Minecraft Loading' },
    lang: {
      auto: 'Follow System', zh: 'Chinese', en: 'English', ja: 'Japanese', ko: 'Korean'
    },
    hero: {
      title1: 'YuZhou', title2: 'Minecraft Server',
      subtitle: 'Cross-platform connectivity for the ultimate gaming world. Whether you\'re a Java Edition or Bedrock Edition player, you can meet here.',
      joinBtn: 'Join Now', exploreBtn: 'Explore Features'
    },
    server: { address: { label: 'Server Address' }, qq: { label: 'QQ Group' } },
    features: {
      tag: 'FEATURES', title: 'Server Features',
      desc: 'We are dedicated to providing a stable and fun gaming experience',
      card1: { title: 'Cross-Platform Support', desc: 'Full compatibility between Java Edition and Bedrock Edition. Play together on PC, mobile, or console.' },
      card2: { title: 'Security & Stability', desc: 'Enterprise-grade server configuration, 24/7 uptime, and regular backups to ensure data safety.' },
      card3: { title: 'Active Community', desc: 'A friendly player community with regular events. Explore together with like-minded players.' }
    },
    news: {
      tag: 'NEWS', title: 'Latest News',
      desc: 'Stay up to date with the latest updates and events',
      card1: { title: 'Server Version Update', desc: 'Upgraded to the latest version with new game features and optimized server performance.' },
      card2: { title: 'Main City Construction Launched', desc: 'The main city building project has officially started. Players are welcome to join and build a vibrant metropolis together.' },
      card3: { title: 'Open Beta Launch', desc: 'YuZhou server is now in open beta! Both Java Edition and Bedrock Edition players can join and experience it!' }
    },
    'features.page': {
      tag: 'FEATURES', title: 'Server Features',
      desc: 'Enterprise-grade configuration for the ultimate gaming experience'
    },
    'features.section': { title: 'Core Features' },
    'features.item1': { title: 'Cross-Platform Play', desc: 'Full compatibility between Java Edition and Bedrock Edition. Play together on PC, mobile, or console.' },
    'features.item2': { title: 'Enterprise Hardware', desc: 'Intel 20-thread processor, 32GB DDR4 RAM, SSD high-speed storage' },
    'features.item3': { title: 'Low Latency Network', desc: 'National average latency of 39ms, under 20ms in major cities — smooth and lag-free' },
    'features.item4': { title: 'Data Security', desc: '24-hour automatic backups, zero data loss, professional protection against cheating' },
    'join.page': { tag: 'JOIN US', title: 'Joining Guide', desc: 'A few simple steps to begin your adventure' },
    'join.section1': { title: 'Java Edition' },
    'join.step1.1': { title: 'Launch the Game', desc: 'Open the Minecraft Java Edition client and ensure version compatibility' },
    'join.step1.2': { title: 'Multiplayer', desc: 'Click the "Multiplayer" option on the main menu' },
    'join.step1.3': { title: 'Add Server', desc: 'Click "Add Server" and enter the address: mc.yuzhou-mc.cn' },
    'join.section2': { title: 'Bedrock Edition' },
    'join.step2.1': { title: 'Open the Game', desc: 'Launch Minecraft Bedrock Edition (mobile/console/Windows)' },
    'join.step2.2': { title: 'Join Server', desc: 'Click "Play" → "Servers" → "Add Server"' },
    'join.step2.3': { title: 'Fill in Details', desc: 'Address: mc.yuzhou-mc.cn, Port: 19132' },
    'about.page': { tag: 'ABOUT', title: 'About Us', desc: 'Contact us and join the community' },
    'about.section': { title: 'Contact Info' },
    'about.card1': { title: 'Server Address', btn: 'Copy Address' },
    'about.card2': { title: 'QQ Group', btn: 'Copy Number' }
  },

  ja: {
    site: { title: '雨州 Minecraft' },
    sidebar: { title: '雨州 Minecraft' },
    nav: { home: 'ホーム', features: '特徴', join: '参加', about: '概要' },
    topbar: { title: '雨州 Minecraft' },
    theme: { auto: 'システムに従う', light: 'ライトモード', dark: 'ダークモード' },
    copy: {
      ip: 'サーバーIPをコピー',
      success: { ip: 'サーバーIPをコピーしました！', qq: 'QQグループ番号をコピーしました！' }
    },
    menu: { label: 'メニュー' },
    language: { label: '言語' },
    footer: {
      copyright: 'Copyright © 2025-2026 ',
      rights: '. All Rights Reserved.',
      home: 'ホーム', features: '特徴', join: '参加', about: '概要'
    },
    error: { load: '読み込みに失敗しました' },
    loading: { alt: '雨州Minecraft読み込み中' },
    lang: {
      auto: 'システムに従う', zh: '中国語', en: '英語', ja: '日本語', ko: '韓国語'
    },
    hero: {
      title1: '雨州', title2: 'Minecraft サーバー',
      subtitle: 'クロスプラットフォーム対応で、最高のゲーム体験を提供します。Java版でもBedrock版でも、ここで出会えます。',
      joinBtn: '今すぐ参加', exploreBtn: '特徴を見る'
    },
    server: { address: { label: 'サーバーアドレス' }, qq: { label: 'QQグループ' } },
    features: {
      tag: '特徴', title: 'サーバーの特徴',
      desc: '安定した楽しいゲーム体験を提供いたします',
      card1: { title: 'クロスプラットフォーム対応', desc: 'Java版とBedrock版が完全互換。PC、スマホ、コンソールを問わず一緒に遊べます。' },
      card2: { title: '安全性と安定性', desc: 'エンタープライズ級のサーバー構成、24時間稼働、定期的なバックアップでデータを保護します。' },
      card3: { title: '活発なコミュニティ', desc: 'フレンドリーなコミュニティ環境、定期的なイベント開催。仲間と一緒に探索を楽しみましょう。' }
    },
    news: {
      tag: 'ニュース', title: '最新情報',
      desc: 'サーバーの最新アップデートとイベントをご確認ください',
      card1: { title: 'サーバーバージョンアップデート', desc: '最新バージョンにアップグレードし、新機能を追加、サーバーパフォーマンスを最適化しました。' },
      card2: { title: 'メインシティ建設開始', desc: 'メインシティ建設プロジェクトが正式に始動しました。プレイヤーの参加を歓迎し、一緒に賑やかな都市を作り上げましょう。' },
      card3: { title: 'オープンベータ開始', desc: '雨州サーバーは正式にオープンベータを開始しました。Java版およびBedrock版のプレイヤーが参加できます！' }
    },
    'features.page': {
      tag: '特徴', title: 'サーバーの特徴',
      desc: 'エンタープライズ級構成で極上のゲーム体験を'
    },
    'features.section': { title: 'コア機能' },
    'features.item1': { title: '全プラットフォーム互換', desc: 'Java版とBedrock版が完全互換。PC、スマホ、コンソールを問わず一緒に遊べます。' },
    'features.item2': { title: 'エンタープライズ級ハードウェア', desc: 'Intel 20スレッドプロセッサ、32GB DDR4メモリ、SSD高速ストレージ' },
    'features.item3': { title: '低遅延ネットワーク', desc: '全国平均遅延39ms、主要都市では20ms未満の快適なプレイ環境' },
    'features.item4': { title: 'データセキュリティ', desc: '24時間自動バックアップ、データ紛失ゼロ、専門的な不正対策' },
    'join.page': { tag: '参加方法', title: '参加ガイド', desc: '簡単なステップで冒険を始めましょう' },
    'join.section1': { title: 'Java版' },
    'join.step1.1': { title: 'ゲームを起動', desc: 'Minecraft Java版クライアントを開き、バージョンの互換性を確認してください' },
    'join.step1.2': { title: 'マルチプレイ', desc: 'メインメニューの「マルチプレイ」オプションをクリック' },
    'join.step1.3': { title: 'サーバーを追加', desc: '「サーバーを追加」をクリックし、アドレス mc.yuzhou-mc.cn を入力' },
    'join.section2': { title: 'Bedrock版' },
    'join.step2.1': { title: 'ゲームを開く', desc: 'Minecraft Bedrock版を起動（スマホ/コンソール/Windows）' },
    'join.step2.2': { title: 'サーバーに参加', desc: '「プレイ」→「サーバー」→「サーバーを追加」をクリック' },
    'join.step2.3': { title: '情報を入力', desc: 'アドレス：mc.yuzhou-mc.cn、ポート：19132' },
    'about.page': { tag: '概要', title: '私たちについて', desc: 'お問い合わせ、コミュニティに参加' },
    'about.section': { title: 'お問い合わせ' },
    'about.card1': { title: 'サーバーアドレス', btn: 'アドレスをコピー' },
    'about.card2': { title: 'QQグループ', btn: '番号をコピー' }
  },

  ko: {
    site: { title: 'YuZhou Minecraft' },
    sidebar: { title: 'YuZhou Minecraft' },
    nav: { home: '홈', features: '특징', join: '참가', about: '소개' },
    topbar: { title: 'YuZhou Minecraft' },
    theme: { auto: '시스템 따르기', light: '라이트 모드', dark: '다크 모드' },
    copy: {
      ip: '서버 IP 복사',
      success: { ip: '서버 IP가 복사되었습니다!', qq: 'QQ 그룹 번호가 복사되었습니다!' }
    },
    menu: { label: '메뉴' },
    language: { label: '언어' },
    footer: {
      copyright: 'Copyright © 2025-2026 ',
      rights: '. All Rights Reserved.',
      home: '홈', features: '특징', join: '참가', about: '소개'
    },
    error: { load: '로딩 실패' },
    loading: { alt: 'YuZhou Minecraft 로딩 중' },
    lang: {
      auto: '시스템 따르기', zh: '중국어', en: '영어', ja: '일본어', ko: '한국어'
    },
    hero: {
      title1: 'YuZhou', title2: 'Minecraft 서버',
      subtitle: '크로스 플랫폼 호환으로 최고의 게임 세계를 제공합니다. Java Edition과 Bedrock Edition 플레이어 모두 이곳에서 만날 수 있습니다.',
      joinBtn: '지금 참가', exploreBtn: '기능 살펴보기'
    },
    server: { address: { label: '서버 주소' }, qq: { label: 'QQ 그룹' } },
    features: {
      tag: '특징', title: '서버 특징',
      desc: '안정적이고 재미있는 게임 경험을 제공하기 위해 노력합니다',
      card1: { title: '크로스 플랫폼 지원', desc: 'Java Edition과 Bedrock Edition이 완벽하게 호환됩니다. PC, 모바일, 콘솔에서 모두 함께 플레이할 수 있습니다.' },
      card2: { title: '안전 및 안정성', desc: '엔터프라이즈급 서버 구성, 24시간 무중단 운영, 정기적인 백업으로 데이터를 안전하게 보호합니다.' },
      card3: { title: '활발한 커뮤니티', desc: '친근한 플레이어 커뮤니티 분위기, 정기적인 이벤트 개최, 뜻이 맞는 플레이어들과 함께 탐험하세요.' }
    },
    news: {
      tag: '뉴스', title: '최신 소식',
      desc: '서버의 최신 업데이트와 이벤트를 확인하세요',
      card1: { title: '서버 버전 업데이트', desc: '최신 버전으로 업그레이드되어 새로운 게임 기능이 추가되고 서버 성능이 최적화되었습니다.' },
      card2: { title: '메인 시티 건설 시작', desc: '메인 시티 건설 프로젝트가 공식적으로 시작되었습니다. 플레이어 여러분의 참여를 환영하며 함께 번화한 도시를 만들어 갑니다.' },
      card3: { title: '오픈 베타 시작', desc: 'YuZhou 서버가 정식 오픈 베타를 시작했습니다! Java Edition과 Bedrock Edition 플레이어 모두 참여할 수 있습니다!' }
    },
    'features.page': {
      tag: '특징', title: '서버 특징',
      desc: '엔터프라이즈급 구성으로 최고의 게임 경험을 선사합니다'
    },
    'features.section': { title: '핵심 기능' },
    'features.item1': { title: '전 플랫폼 호환', desc: 'Java Edition과 Bedrock Edition이 완벽하게 호환됩니다. PC, 모바일, 콘솔에서 모두 함께 플레이할 수 있습니다.' },
    'features.item2': { title: '엔터프라이즈급 하드웨어', desc: 'Intel 20스레드 프로세서, 32GB DDR4 메모리, SSD 고속 스토리지' },
    'features.item3': { title: '저지연 네트워크', desc: '전국 평균 지연 시간 39ms, 주요 도시 20ms 미만으로 끊김 없이 부드러운 플레이' },
    'features.item4': { title: '데이터 보안', desc: '24시간 자동 백업, 데이터 손실 제로, 전문적인 보호로 불법 프로그램 차단' },
    'join.page': { tag: '참가 안내', title: '참가 가이드', desc: '몇 단계만으로 모험을 시작하세요' },
    'join.section1': { title: 'Java Edition' },
    'join.step1.1': { title: '게임 실행', desc: 'Minecraft Java Edition 클라이언트를 열고 버전 호환성을 확인하세요' },
    'join.step1.2': { title: '멀티플레이어', desc: '메인 메뉴의 "멀티플레이어" 옵션을 클릭하세요' },
    'join.step1.3': { title: '서버 추가', desc: '"서버 추가"를 클릭하고 주소 mc.yuzhou-mc.cn를 입력하세요' },
    'join.section2': { title: 'Bedrock Edition' },
    'join.step2.1': { title: '게임 열기', desc: 'Minecraft Bedrock Edition을 실행하세요 (모바일/콘솔/Windows)' },
    'join.step2.2': { title: '서버 접속', desc: '"플레이" → "서버" → "서버 추가"를 클릭하세요' },
    'join.step2.3': { title: '정보 입력', desc: '주소: mc.yuzhou-mc.cn, 포트: 19132' },
    'about.page': { tag: '소개', title: '저희 소개', desc: '문의하시고 커뮤니티에 참여하세요' },
    'about.section': { title: '연락처' },
    'about.card1': { title: '서버 주소', btn: '주소 복사' },
    'about.card2': { title: 'QQ 그룹', btn: '번호 복사' }
  }
};

function _(key) {
  const parts = key.split('.');
  let obj = i18nData[currentLang];
  for (let i = parts.length; i > 0; i--) {
    const flat = parts.slice(0, i).join('.');
    if (obj[flat] !== undefined) {
      let r = obj[flat];
      for (let j = i; j < parts.length; j++) {
        r = r?.[parts[j]];
      }
      return typeof r === 'string' ? r : key;
    }
  }
  return key;
}

function detectLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && saved !== 'auto') return SUPPORTED_LANGS.includes(saved) ? saved : 'en';
  const raw = (navigator.language || navigator.userLanguage || '').toLowerCase();
  const lang = raw.replace(/[_-].*/, '');
  if (['zh', 'en', 'ja', 'ko'].includes(lang)) return lang;
  if (raw.startsWith('zh')) return 'zh';
  return 'en';
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.textContent = _('site.title');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = _(key);
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', _(key));
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    el.setAttribute('alt', _(key));
  });

  updateLangMenu();
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

function initLang() {
  applyLanguage(detectLang());
  const menu = document.getElementById('langMenu');
  if (menu) menu.classList.remove('open');
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  if (lang === 'auto') {
    applyLanguage(detectLang());
  } else {
    applyLanguage(lang);
  }
}

function toggleLangMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('langMenu');
  menu.classList.toggle('open');
}

function updateLangMenu() {
  const menu = document.getElementById('langMenu');
  if (!menu) return;
  const saved = localStorage.getItem(LANG_KEY) || 'auto';
  const items = menu.querySelectorAll('.lang-menu-item');
  items.forEach(item => {
    const lang = item.dataset.lang;
    if (lang === 'auto') {
      item.textContent = _('lang.auto');
    } else {
      const name = _('lang.' + lang);
      if (lang !== currentLang) {
        item.textContent = name + ' (' + LANG_NATIVE[lang] + ')';
      } else {
        item.textContent = name;
      }
    }
    item.classList.toggle('active', lang === saved);
  });
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('langMenu');
  if (!menu) return;

  const item = e.target.closest('.lang-menu-item');
  if (item) {
    const lang = item.getAttribute('data-lang');
    menu.classList.remove('open');
    setLang(lang);
    return;
  }

  if (menu.classList.contains('open') && !e.target.closest('.lang-toggle-wrapper')) {
    menu.classList.remove('open');
  }
});
