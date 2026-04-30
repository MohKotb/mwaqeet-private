/* mwaqeet bundle script - KitKat friendly (var, XHR) */
function $(id) { return document.getElementById(id); }
var isAdhanMuted = false; // القيمة الافتراضية عند تشغيل الكارتة لأول مرة
// --- Global variables & config ---
var ADHAN_DURATION_SECONDS = 185; // Set adhan audio duration here
var PRAYER_NAMES_AR = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'];

var SETTINGS_KEY = 'MW_SETTINGS_FINAL_V3';
var SETTINGS = {
  country: 'EG', province: 'CAIRO2', dst: 'auto',
  timeDisplayMode: 'manual',  // طريقة عرض الساعة: 'manual' أو 'auto'
  iqamaMinutes: { fajr: 10, dhuhr: 10, asr: 10, maghrib: 5, isha: 10 },
  prayerOffsets: { fajr: 0, shurooq: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }, // ◀️ الديفولت صفر
  prayNowMinutes: 10, energySaving: 'off', mosqueName: 'اسم المسجد هنا', // ◀️ ضيف اسم المسجد هنا
  hijriOffset: 0, // ◀️ نضيف هذا للتعديل علي التاريخ الهجري - متوافق مع كيت كات/
  athkarEnabled: 'on',      // ◀️ ضيف هنا
  athkarDelay: 0,           // ◀️ ضيف هنا  
  athkarDuration: 10,      // ◀️ ضيف هنا
  fastingReminderEnabled: 'off',      // ◀️ جديد: تفعيل التذكير بالصيام
  fastingReminderDelay: 5,            // ◀️ جديد: تأخير عرض التذكير بعد الأذكار
  fastingReminderDuration: 10,        // ◀️ جديد: مدة العرض
  fastingReminderPrayers: {           // ◀️ جديد: الصلوات التي يظهر بعدها التذكير
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  },
  fridaySermonEnabled: 'off', // ◀️ خيار جديد للخطبة
  fridaySermonDuration: 20,   // ◀️ مدة الخطبة الافتراضية
  backgroundImage: 'v-2.jpg' // ◀️ متغير للخلفية 
};

// Dynamic color themes for different backgrounds
var THEMES = {
  'v-2.jpg': {
    primary: '#cf8f18',      // Golden clock color
    secondary: '#8B4513',    // Brown prayer headers
    accent: '#FFD700',       // Gold prayer times
    highlight: '#FFD700',    // Gold highlights
    text: '#ffffff',         // White text
    overlay: '#806107',      // Golden overlay text
    menuBg: '#121212',       // Dark menu background
    menuBorder: '#fbfbfb',   // Golden menu border
    remainingBg: 'rgba(4, 109, 138, 0.266)', // Blue remaining time
    tickerText: '#ffffff'    // White ticker text
  },
  'bg1.jpg': {
    primary: '#0d753a',      // Sea green
    secondary: '#1e3a2e',    // Dark green
    accent: '#078e07',       // Lime green
    highlight: '#00FF7F',    // Spring green
    text: '#ffffff',
    overlay: '#228B22',      // Forest green
    menuBg: '#0d1a0f',
    menuBorder: '#32CD32',
    remainingBg: 'rgba(46, 139, 87, 0.3)',
    tickerText: '#ffffff'
  },
  'bg2.jpg': {
    primary: '#1a2957',      // Royal blue
    secondary: '#1e2b4a',    // Dark blue
    accent: '#1a2957',       // Deep sky blue
    highlight: '#1a2957',    // Dodger blue
    text: '#6c2626',
    overlay: '#0606b2',      // Navy
    menuBg: '#010a1e',
    menuBorder: '#00BFFF',
    remainingBg: 'rgba(65, 105, 225, 0.3)',
    tickerText: '#1a2957'
  },
  'bg3.jpg': {
    primary: '#8B0000',      // Dark red
    secondary: '#2d0f0f',    // Very dark red
    accent: '#DC143C',       // Crimson
    highlight: '#FF4500',    // Orange red
    text: '#ffffff',
    overlay: '#8B0000',
    menuBg: '#1a0a0a',
    menuBorder: '#DC143C',
    remainingBg: 'rgba(139, 0, 0, 0.3)',
    tickerText: '#ffffff'
  },
  'bg4.jpg': {
    primary: '#462403',      // Indigo
    secondary: '#3d2f10',    // Dark purple
    accent: '#442b00',       // Medium purple
    highlight: '#8a5800',    // Blue violet
    text: '#ffffff',
    overlay: '#673901',
    menuBg: '#0f0719',
    menuBorder: '#dba970',
    remainingBg: 'rgba(75, 0, 130, 0.3)',
    tickerText: '#ffffff'
  },
  'bg5.jpg': {
    primary: '#FF8C00',      // Dark orange
    secondary: '#4d2a00',    // Dark brown
    accent: '#FFA500',       // Orange
    highlight: '#FFD700',    // Gold
    text: '#ffffff',
    overlay: '#FF8C00',
    menuBg: '#261500',
    menuBorder: '#FFA500',
    remainingBg: 'rgba(255, 140, 0, 0.3)',
    tickerText: '#ffffff'
  },
  'bg6.jpg': {
    primary: '#FF8C00',      // Dark orange
    secondary: '#4d2a00',    // Dark brown
    accent: '#FFA500',       // Orange
    highlight: '#FFD700',    // Gold
    text: '#ffffff',
    overlay: '#FF8C00',
    menuBg: '#261500',
    menuBorder: '#FFA500',
    remainingBg: 'rgba(255, 140, 0, 0.3)',
    tickerText: '#ffffff'
  },
  'bg7.jpg': {
    primary: '#4e1b1b',      // Slate gray
    secondary: '#2c3539',    // Dark slate
    accent: '#531e1e',       // Silver
    highlight: '#531e1e',    // White smoke
    text: '#ffffff',
    overlay: '#708090',
    menuBg: '#161c1f',
    menuBorder: '#C0C0C0',
    remainingBg: 'rgba(112, 128, 144, 0.3)',
    tickerText: '#ffffff'
  }
};
var MANIFEST = null;
var TIMES_OBJ = null;
var countdownInterval = null;
var overlayTimeout = null;
var currentPrayerIndex = -1;
var clockInterval = null;
var isExtremeMode = false;
var menuOpen = false;
var isInit = false;
var lastRenderedDay = -1; // ◀️ متغير جديد لمتابعة تغيير اليوم
var lastDstActive = null;   // لمتابعة تغير حالة التوقيت الصيفي

// === Announcement scheduler globals ===
var ANNOUNCEMENT_STATES = {
  BEFORE_ADHAN: 'BEFORE_ADHAN',
  BETWEEN_ADHAN_IQAMA: 'BETWEEN_ADHAN_IQAMA',
  PRAYER_TIME: 'PRAYER_TIME',
  AZKAR_TIME: 'AZKAR_TIME',
  AFTER_AZKAR: 'AFTER_AZKAR'
};
var announcementState = ANNOUNCEMENT_STATES.BEFORE_ADHAN;
var announcementTimer = null;
var announcementCheckInterval = null;
var announcementActive = false;
var announcementLastEndTime = null;
var announcementQueue = [];
var announcementCooldownSeconds = 6; // فاصل لتجنب العرض المستمر
var TODAY_ADHAN_TIMES = null;

var athkarTimeout = null;    // ◀️ ضيف هناللاذكار بعد الصلاة
var fastingReminderTimeout = null; // ◀️ ضيف هناللتذكير بالصيام بعد الصلاة
var iqamaCountdownInterval = null;
var adhanPlayingInterval = null;
var bellAudio = null; // سنقوم بتهيئته لاحقاً لعمل صوت الجرس عند كتم الاذان
var totalIqamaSeconds = 0;
var elapsedAdhanSeconds = 0;
var fastingImages = {
  monday: 'image/fasting_monday.jpg',
  thursday: 'image/fasting_thursday.jpg',
  whiteDays: 'image/fasting_white_days.jpg'
};

//--------------- دالة تحديث سكريبت المواقيت بدون ريستارت ----------------------
// تحديث بيانات المواقيت تلقائياً دون إعادة تحميل الصفحة
function refreshPrayerScript() {
  var province = SETTINGS.province;
  var country = SETTINGS.country;
  if (!province || !country) {
    console.log("لا توجد محافظة أو دولة محددة لتحديث المواقيت");
    return;
  }
  var path = pathForProvince(province, country); // مثلاً data/CAIRO2.js
  var scriptId = 'timesScript';
  var oldScript = document.getElementById(scriptId);
  if (oldScript && oldScript.parentNode) {
    oldScript.parentNode.removeChild(oldScript);
  }
  var script = document.createElement('script');
  script.id = scriptId;
  script.type = 'text/javascript';
  script.src = path + '?v=' + new Date().getTime();
  script.onload = function () {
    console.log("✅ تم تحديث مواقيت الصلاة بنجاح");
    if (window.TIMES_OBJ) {
      renderTimes(); // إعادة رسم الجدول والهايلايت
    } else {
      console.error("❌ TIMES_OBJ لم يتم تحميله");
      setStatus('فشل تحديث المواقيت');
    }
  };
  script.onerror = function () {
    console.error("❌ خطأ في تحميل ملف المواقيت: " + path);
    setStatus('خطأ في تحديث المواقيت');
  };
  document.body.appendChild(script);
}
// دالة لعمل صيانة لتفريغ الرامات 
var hasUpdatedToday = false; // مفتاح جديد لتحديث البيانات
var hasReloadedToday = false;
function startSystemMaintenance() {
  setInterval(function () {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();

    // 1. تحديث بيانات اليوم الجديد الساعة 12 منتصف الليل (مرة واحدة)
    if (h === 0 && m === 0 && !hasUpdatedToday) {
      hasUpdatedToday = true;
      refreshPrayerScript();
    }

    // 2. ريستارت وقائي الساعة 2 صباحاً (مرة واحدة)
    if (h === 2 && m === 0 && !hasReloadedToday) {
      hasReloadedToday = true;
      window.location.href = window.location.pathname + "?t=" + new Date().getTime();
    }

    // تصفير المفاتيح الساعة 3 فجراً ليوم جديد
    if (h === 3) {
      hasReloadedToday = false;
      hasUpdatedToday = false;
    }

  }, 30000);
}
// === +++++++++++++++++++++دالة منع التكبير في كيت كات (بدون forEach)+++++++++++++ ===
var zoomPreventionEnabled = false;
function preventZoomOnFocus() {
  if (zoomPreventionEnabled) return;
  zoomPreventionEnabled = true;
  console.log("🔧 تفعيل منع التكبير وتثبيت الأبعاد...");

  var viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  var fixedViewport = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover';

  // تعيين viewport مرة واحدة فقط (بدون تغيير متكرر)
  viewportMeta.content = fixedViewport;

  // منع التكبير بالإيماءات (مرة واحدة)
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });

  // تثبيت حجم القائمة الجانبية عبر CSS فقط (لا نغير style.width مباشرة)
  // نضيف كلاس ثابت على body أو sideMenu
  var sideMenu = document.getElementById('sideMenu');
  if (sideMenu) {
    sideMenu.classList.add('fixed-menu-size');
  }

  // بدلاً من ربط events لكل حقل، نستخدم تفويض الحدث (event delegation)
  document.body.addEventListener('focus', function (e) {
    var target = e.target;
    if (target.matches && target.matches('#sideMenu input, #sideMenu select, #sideMenu textarea')) {
      // فقط إعادة تأكيد viewport (بدون تغيير style.width)
      viewportMeta.content = fixedViewport;
    }
  }, true); // use capture

  document.body.addEventListener('blur', function (e) {
    var target = e.target;
    if (target.matches && target.matches('#sideMenu input, #sideMenu select, #sideMenu textarea')) {
      viewportMeta.content = fixedViewport;
    }
  }, true);
}


// --- Hardcoded data (no external file needed) ---  
var HARDCODED_MANIFEST = {
  "EG": {
    "name": "مصر",
    "provinces": [
      { "code": "ALEX", "name": "الإسكندرية" }, { "code": "CAIRO", "name": "القاهرة" }, { "code": "CAIRO2", "name": "2 القاهرة" }, { "code": "Shibin_alkom", "name": "شبين الكوم" }, { "code": "ALFAYYUM", "name": "الفيوم" }, { "code": "ALMANSURAH", "name": "المنصورة" }, { "code": "ALMINYA", "name": "المنيا" }, { "code": "ARISH", "name": "العريش" }, { "code": "ASSUIT", "name": "اسيوط" }, { "code": "BANHA", "name": "بنها" }, { "code": "BANISUWAYF", "name": "بني سويف " }, { "code": "DAMANHUR", "name": "دمنهور" }, { "code": "DAMIETTA", "name": "دمياط" }, { "code": "DIKIRNIS", "name": "دكرنس" }, { "code": "GIZA", "name": "الجيزة" }, { "code": "HURGHADA", "name": "الغردقة" }, { "code": "ISMAILIA", "name": "الاسماعيلية" }, { "code": "KAFRADDAWWAR", "name": "كفر الدوار" }, { "code": "KAFRASHSHAYKH", "name": "كفر الشيخ" }, { "code": "MERSAMATRUH", "name": "مرسي مطروح" }, { "code": "PORT-SAID", "name": "بور سعيد" }, { "code": "QINA", "name": "قنا" }, { "code": "SHARMELSHEIKH", "name": "شرم الشيخ" }, { "code": "SOHAG", "name": "سوهاج" }, { "code": "SUEZ", "name": "السويس" }, { "code": "TANTA", "name": "طنطا" }, { "code": "ZAGAZIG", "name": "الزقازيق" }, { "code": "ZAGAZIG2", "name": "2الزقازيق" }, { "code": "LUXOR", "name": "الاقصر" }
    ]
  },
  "SA": {
    "name": "السعودية",
    "provinces": [
      { "code": "GIDA", "name": "جدة" }, { "code": "MED", "name": "المدينة" }, { "code": "RIYADH", "name": "الرياض" }, { "code": "MAKKAH", "name": "مكة المكرمة" }
    ]
  },
  "AE": {
    "name": "الإمارات",
    "provinces": [
      { "code": "ABUDHABI", "name": "أبو ظبي" }, { "code": "DUBAI", "name": "دبي" }, { "code": "SHARJAH", "name": "الشارقة" }
    ]
  },
  "JO": {
    "name": "الأردن",
    "provinces": [
      { "code": "AMMAN", "name": "عمان" }, { "code": "ZARQA", "name": "الزرقاء" }, { "code": "IRBID", "name": "إربد" }
    ]
  },
  "MA": {
    "name": "المغرب",
    "provinces": [
      { "code": "CASABLANCA", "name": "الدار البيضاء" }, { "code": "RABAT", "name": "الرباط" }, { "code": "MARRAKECH", "name": "مراكش" }
    ]
  },
  "DZ": { "name": "الجزائر", "provinces": [] },
  "BH": { "name": "البحرين", "provinces": [] },
  "IQ": { "name": "العراق", "provinces": [] },
  "KW": { "name": "الكويت", "provinces": [] },
  "LB": { "name": "لبنان", "provinces": [] },
  "LY": { "name": "ليبيا", "provinces": [] },
  "OM": { "name": "عمان", "provinces": [] },
  "PS": { "name": "فلسطين", "provinces": [] },
  "QA": { "name": "قطر", "provinces": [] },
  "SY": { "name": "سوريا", "provinces": [] },
  "TN": { "name": "تونس", "provinces": [] },
  "YE": { "name": "اليمن", "provinces": [] }
  // Add other countries here...
};
// --- End of hardcoded data ---


// --- Helper Functions ---
function pad2(n) { return (n < 10 ? '0' + n : '' + n); }
function to12h(t) { if (!t || t.indexOf(':') === -1) return '--:--'; var p = t.split(':'); var hh = parseInt(p[0], 10), mm = ('0' + parseInt(p[1], 10)).slice(-2); var am = hh >= 12 ? '' : ''; var h = hh % 12; if (h === 0) h = 12; return h + ':' + mm + ' ' + am; }
function hhmmToToday(hhmm) { var p = hhmm.split(':'); var d = new Date(); d.setHours(parseInt(p[0], 10), parseInt(p[1], 10), 0, 0); return d; }

// --- DST (summer time) helpers ---
function getDSTMode() {
  try {
    // Use the mode from the SETTINGS object which is loaded from localStorage
    return SETTINGS.dst;
  } catch (e) {
    return 'auto';
  }
}

function isDSTActiveForDate(date) {
  var year = date.getFullYear();

  // ---- بداية التوقيت الصيفي: آخر جمعة من أبريل ----
  var apr30 = new Date(year, 3, 30); // 30 أبريل
  var aprDay = apr30.getDay();       // 0=أحد ... 5=جمعة
  // كم يوماً نرجع للوراء حتى نصل للجمعة (5)؟
  var daysToFriday = (aprDay - 5 + 7) % 7;
  var lastFridayApril = new Date(year, 3, 30 - daysToFriday);

  // ---- نهاية التوقيت الصيفي: آخر خميس من أكتوبر ----
  var oct31 = new Date(year, 9, 31); // 31 أكتوبر
  var octDay = oct31.getDay();
  // كم يوماً نرجع حتى نصل للخميس (4)؟
  var daysToThursday = (octDay - 4 + 7) % 7;
  var lastThursdayOct = new Date(year, 9, 31 - daysToThursday);

  // يشمل كامل يوم آخر خميس (ينتهي بمنتصف ليل الجمعة)
  var endOfLastThursdayOct = new Date(lastThursdayOct.getFullYear(),
    lastThursdayOct.getMonth(),
    lastThursdayOct.getDate() + 1);

  return date >= lastFridayApril && date < endOfLastThursdayOct;
}



function adjustTimeForDST(hhmm, mode) {
  if (!hhmm || hhmm.indexOf(':') === -1) return hhmm;
  if (mode === 'off') return hhmm;
  var parts = hhmm.split(':');
  var hh = parseInt(parts[0], 10), mm = parseInt(parts[1], 10);
  var active = (mode === 'on') || (mode === 'auto' && isDSTActiveForDate(new Date()));
  if (active) { hh = (hh + 1) % 24; }
  return (('0' + hh).slice(-2)) + ':' + (('0' + mm).slice(-2));
}

// --- ضبط الساعة الكبيرة تلقائياً حسب التوقيت الصيفي ---
function getAdjustedTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  // إذا كان وضع عرض الساعة "تلقائي"، لا نضبط أي شيء
  var displayMode = SETTINGS.timeDisplayMode || 'manual';
  if (displayMode === 'auto') {
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  // وإلا (وضع يدوي) نطبق التوقيت الصيفي حسب الإعدادات
  var mode = getDSTMode();
  var applyDst = false;
  if (mode === 'on') {
    applyDst = true;
  } else if (mode === 'auto') {
    applyDst = isDSTActiveForDate(date);
  }

  if (applyDst) {
    hours = (hours + 1) % 24;
  }

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

//////////////////////////////////////////////////////////
/////////////دوال التعديل علي مواقيت الصلاة ////////////////////////////
/////////////////////////////////////////////////////////
// ◀️ دالة لإضافة أو طرح الدقائق من وقت بصيغة HH:MM
function applyOffset(hhmm, offsetMinutes) {
  if (!hhmm || hhmm.indexOf(':') === -1 || !offsetMinutes || offsetMinutes === 0) return hhmm;
  var parts = hhmm.split(':');
  var hh = parseInt(parts[0], 10);
  var mm = parseInt(parts[1], 10);
  var totalMinutes = (hh * 60) + mm + offsetMinutes;

  if (totalMinutes < 0) totalMinutes += 24 * 60;
  if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;

  var newHH = Math.floor(totalMinutes / 60);
  var newMM = totalMinutes % 60;

  return pad2(newHH) + ':' + pad2(newMM);
}

// ◀️ دالة بتستقبل خط المواقيت الكامل من الداتا وتطبق عليه الفروق
function getAdjustedPrayerTimes(line) {
  if (!line) return [];
  var parts = line.split('|');
  var offsetKeys = ['fajr', 'shurooq', 'dhuhr', 'asr', 'maghrib', 'isha'];

  for (var i = 0; i < parts.length && i < offsetKeys.length; i++) {
    var currentOffset = SETTINGS.prayerOffsets ? (SETTINGS.prayerOffsets[offsetKeys[i]] || 0) : 0;
    parts[i] = applyOffset(parts[i], currentOffset);
  }
  return parts;
}
////////////////////////////////////////////////////////////
//////////////انتهت دوال تعديل المواقيت /////////////////////////////
///////////////////////////////////////////////////////////

// ========== دوال جديدة لاستئناف الحالة بعد التحميل ==========
function getTodayKey() {
  var d = new Date();
  return pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

function resumeCurrentState() {
  if (!TODAY_ADHAN_TIMES || !TODAY_ADHAN_TIMES.length) return;
  var now = new Date();
  var adhanTimes = TODAY_ADHAN_TIMES;

  var currentState = null;
  var stateStartTime = null;
  var prayerIndex = -1;

  for (var i = 0; i < adhanTimes.length; i++) {
    if (i === 1) continue;
    var adhanTimeStr = adhanTimes[i];
    if (!adhanTimeStr || adhanTimeStr === '--:--') continue;
    var adhanDate = hhmmToToday(adhanTimeStr);
    var iqamaMins = getIqamaMinutes(i);
    var iqamaDate = new Date(adhanDate.getTime() + iqamaMins * 60000);
    var prayerEnd = new Date(iqamaDate.getTime() + (SETTINGS.prayNowMinutes || 10) * 60000);
    var azkarStart = new Date(prayerEnd.getTime() + (SETTINGS.athkarDelay || 0) * 60000);
    var azkarEnd = new Date(azkarStart.getTime() + (SETTINGS.athkarDuration || 10) * 60000);

    var nowTime = now.getTime();

    if (nowTime >= adhanDate.getTime() && nowTime < iqamaDate.getTime()) {
      currentState = 'adhan';
      stateStartTime = adhanDate;
      prayerIndex = i;
      break;
    } else if (nowTime >= iqamaDate.getTime() && nowTime < prayerEnd.getTime()) {
      currentState = 'prayerNow';
      stateStartTime = iqamaDate;
      prayerIndex = i;
      break;
    } else if (SETTINGS.athkarEnabled === 'on' && nowTime >= azkarStart.getTime() && nowTime < azkarEnd.getTime()) {
      currentState = 'azkar';
      stateStartTime = azkarStart;
      prayerIndex = i;
      break;
    } else if (SETTINGS.fastingReminderEnabled === 'on') {
      var fastingStart = azkarEnd;
      var fastingEnd = new Date(fastingStart.getTime() + (SETTINGS.fastingReminderDuration || 10) * 60000);
      if (nowTime >= fastingStart.getTime() && nowTime < fastingEnd.getTime()) {
        var prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        if (SETTINGS.fastingReminderPrayers[prayerNames[i]]) {
          currentState = 'fasting';
          stateStartTime = fastingStart;
          prayerIndex = i;
          break;
        }
      }
    }
  }

  if (!currentState) {
    var parts = getAdjustedPrayerTimes(TIMES_OBJ[getTodayKey()]);
    highlightNext(parts);
    return;
  }

  currentPrayerIndex = prayerIndex;

  if (currentState === 'adhan') {
    playAdhanAudioOnly(stateStartTime);
  } else if (currentState === 'prayerNow') {
    showPrayerNowCompatible(stateStartTime);
  } else if (currentState === 'azkar') {
    showAthkarImage(stateStartTime);
  } else if (currentState === 'fasting') {
    var reminderType = getFastingReminderType(getCurrentHijriDateWithOffset());
    if (reminderType) {
      showFastingReminderImage(reminderType, stateStartTime);
    }
  }
}
/// --- Data Loading ---
function loadSettings() {
  try {
    var s = localStorage.getItem(SETTINGS_KEY);
    if (s) SETTINGS = JSON.parse(s);

    // ✅ تحميل حالة كتم الصوت (الجرس/الأذان)
    isAdhanMuted = SETTINGS.isAdhanMuted || false;

    $('dstSelect').value = SETTINGS.dst;
    if (!SETTINGS.timeDisplayMode) {
      SETTINGS.timeDisplayMode = 'manual';
    }
    $('timeDisplayModeSelect').value = SETTINGS.timeDisplayMode;
    $('energySelect').value = SETTINGS.energySaving;
    $('mosqueName').value = SETTINGS.mosqueName;
    $('hijriOffset').value = SETTINGS.hijriOffset || 0;

    $('iqama_fajr').value = SETTINGS.iqamaMinutes.fajr;
    $('iqama_dhuhr').value = SETTINGS.iqamaMinutes.dhuhr;
    $('iqama_asr').value = SETTINGS.iqamaMinutes.asr;
    $('iqama_maghrib').value = SETTINGS.iqamaMinutes.maghrib;
    $('iqama_isha').value = SETTINGS.iqamaMinutes.isha;

    $('prayNowMinutes').value = SETTINGS.prayNowMinutes;

    // خيارات خطبة الجمعة
    $('fridaySermonEnabled').value = SETTINGS.fridaySermonEnabled || 'off';
    $('fridaySermonDuration').value = SETTINGS.fridaySermonDuration || 20;

    // للاذكار بعد الصلاة
    $('athkarEnabled').value = SETTINGS.athkarEnabled || 'on';
    $('athkarDelay').value = SETTINGS.athkarDelay || 0;
    $('athkarDuration').value = SETTINGS.athkarDuration || 10;

    // تحميل إعدادات التذكير بالصيام
    $('fastingReminderEnabled').value = SETTINGS.fastingReminderEnabled || 'off';
    $('fastingReminderDelay').value = SETTINGS.fastingReminderDelay || 5;
    $('fastingReminderDuration').value = SETTINGS.fastingReminderDuration || 10;

    // تحميل اختيارات الصلوات
    var prayers = SETTINGS.fastingReminderPrayers || {};
    var checkboxes = document.getElementsByClassName('prayerCheck');
    for (var i = 0; i < checkboxes.length; i++) {
      var cb = checkboxes[i];
      cb.checked = prayers[cb.value] !== false;
    }

    // تحميل إعداد الخلفية
    var savedBg = localStorage.getItem('MW_BACKGROUND_IMAGE');
    if (savedBg) {
      SETTINGS.backgroundImage = savedBg;
    }
    if ($('backgroundSelect')) {
      $('backgroundSelect').value = SETTINGS.backgroundImage;
    }

    SETTINGS.announcementBufferMinutes = parseInt(SETTINGS.announcementBufferMinutes || 2, 10);
    if (!Array.isArray(SETTINGS.announcements)) {
      SETTINGS.announcements = [];
    }
    for (var annIndex = 0; annIndex < SETTINGS.announcements.length; annIndex++) {
      var ann = SETTINGS.announcements[annIndex];
      ann.id = ann.id || ('ann-' + new Date().getTime() + '-' + annIndex);
      ann.title = ann.title || '';
      ann.content = ann.content || '';
      ann.type = ann.type || 'text';
      ann.mediaUrl = ann.mediaUrl || '';
      ann.duration = parseInt(ann.duration || 15, 10);
      ann.priority = ann.priority || 'normal';
      ann.timing = ann.timing || 'between';
      ann.createdAt = ann.createdAt || new Date().getTime();
    }
    if ($('announcementBuffer')) {
      $('announcementBuffer').value = SETTINGS.announcementBufferMinutes;
    }

    var offsets = SETTINGS.prayerOffsets || { fajr: 0, shurooq: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
    $('offset_fajr').value = offsets.fajr;
    $('offset_shurooq').value = offsets.shurooq;
    $('offset_dhuhr').value = offsets.dhuhr;
    $('offset_asr').value = offsets.asr;
    $('offset_maghrib').value = offsets.maghrib;
    $('offset_isha').value = offsets.isha;

    // إخفاء الزر القديم (muteBtn) نهائياً
    var oldMuteBtn = $('muteBtn');
    if (oldMuteBtn) {
      oldMuteBtn.style.display = 'none';
    }

    // تحديث نص زر الكتم الجديد (muteAdhanBtn) إن وجد
    var newMuteBtn = $('muteAdhanBtn');
    if (newMuteBtn) {
      newMuteBtn.innerHTML = isAdhanMuted ? "وضع الكتم: مشغل (جرس) 🔔" : "وضع الكتم: معطل (أذان) 🔊";
      newMuteBtn.style.backgroundColor = isAdhanMuted ? "#840101" : "#2e7d32";
    }

  } catch (e) {
    console.log("Error loading settings:", e);
  }
}
function saveSettings() {
  try {
    // 1. تجميع كل البيانات الأساسية في كائن SETTINGS
    SETTINGS.dst = $('dstSelect').value;
    SETTINGS.energySaving = $('energySelect').value;
    SETTINGS.mosqueName = $('mosqueName').value;
    SETTINGS.hijriOffset = parseInt($('hijriOffset').value || 0, 10);

    // إعدادات الإقامة
    SETTINGS.iqamaMinutes.fajr = parseInt($('iqama_fajr').value || 10, 10);
    SETTINGS.iqamaMinutes.dhuhr = parseInt($('iqama_dhuhr').value || 10, 10);
    SETTINGS.iqamaMinutes.asr = parseInt($('iqama_asr').value || 10, 10);
    SETTINGS.iqamaMinutes.maghrib = parseInt($('iqama_maghrib').value || 5, 10);
    SETTINGS.iqamaMinutes.isha = parseInt($('iqama_isha').value || 10, 10);

    SETTINGS.prayNowMinutes = parseInt($('prayNowMinutes').value || 10, 10);
    SETTINGS.announcementBufferMinutes = parseInt($('announcementBuffer') ? $('announcementBuffer').value || 2 : 2, 10);

    //اعدادات خطبة الجمعة
    SETTINGS.fridaySermonEnabled = $('fridaySermonEnabled').value;
    SETTINGS.fridaySermonDuration = parseInt($('fridaySermonDuration').value || 20, 10);
    // إعدادات الأذكار
    SETTINGS.athkarEnabled = $('athkarEnabled').value;
    SETTINGS.athkarDelay = parseInt($('athkarDelay').value || 0, 10);
    SETTINGS.athkarDuration = parseInt($('athkarDuration').value || 10, 10);

    // إعدادات تذكير الصيام
    SETTINGS.fastingReminderEnabled = $('fastingReminderEnabled').value;
    SETTINGS.fastingReminderDelay = parseInt($('fastingReminderDelay').value || 5, 10);
    SETTINGS.fastingReminderDuration = parseInt($('fastingReminderDuration').value || 10, 10);

    // تجميع اختيارات الصلوات لتذكير الصيام
    var checkboxes = document.getElementsByClassName('prayerCheck');
    var prayers = {};
    for (var i = 0; i < checkboxes.length; i++) {
      var cb = checkboxes[i];
      prayers[cb.value] = cb.checked;
    }
    SETTINGS.fastingReminderPrayers = prayers;

    // إعدادات الخلفية
    SETTINGS.backgroundImage = $('backgroundSelect').value;

    // تطبيق الخلفية والثيم فوراً للمعاينة
    applyBackground();

    // ◀️ الجزء الجديد: تجميع تعديلات مواقيت الصلاة (Offsets)
    // نستخدم document.getElementById للتأكد من الوصول للعناصر في كيت كات
    SETTINGS.prayerOffsets = {
      fajr: parseInt($('offset_fajr').value || 0, 10),
      shurooq: parseInt($('offset_shurooq').value || 0, 10),
      dhuhr: parseInt($('offset_dhuhr').value || 0, 10),
      asr: parseInt($('offset_asr').value || 0, 10),
      maghrib: parseInt($('offset_maghrib').value || 0, 10),
      isha: parseInt($('offset_isha').value || 0, 10)
    };

    SETTINGS.timeDisplayMode = $('timeDisplayModeSelect').value;
    // 2. عملية الحفظ الفعلي في الذاكرة المحلية (LocalStorage)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
    localStorage.setItem('MW_BACKGROUND_IMAGE', SETTINGS.backgroundImage);

    // 3. إعطاء رد فعل للمستخدم (Feedback)
    if (typeof setStatus === "function") {
      setStatus('تم الحفظ بنجاح.. جاري التحديث');
    } else {
      console.log('Settings Saved Successfully');
    }

    // إغلاق القائمة (إجراء جمالي قبل الريفرش)
    closeSideMenu();

    // 4. عمل الريفرش بعد 800ms ليعطي فرصة للمستخدم لرؤية الرسالة وتحديث البيانات
    setTimeout(function () {
      location.reload();
    }, 800);

  } catch (e) {
    console.error("Error saving settings:", e);
    if (typeof setStatus === "function") {
      setStatus('خطأ في الحفظ');
    }
  }
}

function updateAnnouncementMediaFieldVisibility() {
  var type = $('announcementType') ? $('announcementType').value : 'text';
  var label = $('announcementMediaUrlLabel');
  if (!label) return;
  label.style.display = (type === 'text') ? 'none' : 'block';
}

function clearAnnouncementForm() {
  if ($('announcementId')) $('announcementId').value = '';
  if ($('announcementTitle')) $('announcementTitle').value = '';
  if ($('announcementContent')) $('announcementContent').value = '';
  if ($('announcementType')) $('announcementType').value = 'text';
  if ($('announcementMediaUrl')) $('announcementMediaUrl').value = '';
  if ($('announcementPriority')) $('announcementPriority').value = 'normal';
  if ($('announcementTimingBetween')) $('announcementTimingBetween').checked = true;
  if ($('announcementTimingAfterAzkar')) $('announcementTimingAfterAzkar').checked = false;
  var durationButtons = document.getElementsByClassName('announcement-duration-btn');
  for (var i = 0; i < durationButtons.length; i++) {
    durationButtons[i].className = durationButtons[i].className.replace(' active', '');
  }
  if (durationButtons.length > 0) {
    durationButtons[0].className += ' active';
  }
  updateAnnouncementMediaFieldVisibility();
}

function openAnnouncementEditor(id) {
  if (!Array.isArray(SETTINGS.announcements)) return;
  for (var i = 0; i < SETTINGS.announcements.length; i++) {
    var ann = SETTINGS.announcements[i];
    if (ann.id === id) {
      if ($('announcementId')) $('announcementId').value = ann.id;
      if ($('announcementTitle')) $('announcementTitle').value = ann.title;
      if ($('announcementContent')) $('announcementContent').value = ann.content;
      if ($('announcementType')) $('announcementType').value = ann.type;
      if ($('announcementMediaUrl')) $('announcementMediaUrl').value = ann.mediaUrl;
      if ($('announcementPriority')) $('announcementPriority').value = ann.priority;
      if ($('announcementTimingBetween')) $('announcementTimingBetween').checked = (ann.timing === 'between' || ann.timing === 'both');
      if ($('announcementTimingAfterAzkar')) $('announcementTimingAfterAzkar').checked = (ann.timing === 'afterAzkar' || ann.timing === 'both');
      var durationButtons = document.getElementsByClassName('announcement-duration-btn');
      for (var j = 0; j < durationButtons.length; j++) {
        var btn = durationButtons[j];
        btn.className = btn.getAttribute('data-duration') == ann.duration ? btn.className + ' active' : btn.className.replace(' active', '');
      }
      updateAnnouncementMediaFieldVisibility();
      if (typeof setStatus === 'function') setStatus('جاري تحرير الإعلان');
      return;
    }
  }
}

function renderAnnouncementAdmin() {
  var container = $('announcementList');
  if (!container) return;
  container.innerHTML = '';
  var announcements = Array.isArray(SETTINGS.announcements) ? SETTINGS.announcements : [];
  if (announcements.length === 0) {
    container.innerHTML = '<div class="announcement-empty">لا يوجد إعلانات حتى الآن.</div>';
    return;
  }
  for (var i = 0; i < announcements.length; i++) {
    var ann = announcements[i];
    var card = document.createElement('div');
    card.className = 'announcement-card';
    var priorityLabel = ann.priority === 'high' ? 'عالي' : 'عادي';
    var timingLabel = ann.timing === 'both' ? 'بين الأذان والإقامة و بعد الأذكار' : (ann.timing === 'afterAzkar' ? 'بعد الأذكار' : 'بين الأذان والإقامة');
    var title = document.createElement('strong');
    title.textContent = ann.title || 'بدون عنوان';
    var meta = document.createElement('div');
    meta.className = 'announcement-meta';
    meta.textContent = 'النوع: ' + ann.type + ' • المدة: ' + ann.duration + ' ث • الأولوية: ' + priorityLabel + ' • العرض: ' + timingLabel;
    var body = document.createElement('div');
    body.textContent = ann.content || '';
    var actions = document.createElement('div');
    var editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'تعديل';
    editBtn.onclick = (function (annId) {
      return function () { openAnnouncementEditor(annId); };
    })(ann.id);
    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'حذف';
    deleteBtn.onclick = (function (annId) {
      return function () { deleteAnnouncement(annId); };
    })(ann.id);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(body);
    card.appendChild(actions);
    container.appendChild(card);
  }
}

function saveAnnouncementFromForm() {
  if (!SETTINGS.announcements) SETTINGS.announcements = [];
  var id = $('announcementId') ? $('announcementId').value : '';
  var title = $('announcementTitle') ? $('announcementTitle').value.trim() : '';
  var content = $('announcementContent') ? $('announcementContent').value.trim() : '';
  var type = $('announcementType') ? $('announcementType').value : 'text';
  var mediaUrl = $('announcementMediaUrl') ? $('announcementMediaUrl').value.trim() : '';
  var priority = $('announcementPriority') ? $('announcementPriority').value : 'normal';
  var timingBetween = $('announcementTimingBetween') ? $('announcementTimingBetween').checked : true;
  var timingAfterAzkar = $('announcementTimingAfterAzkar') ? $('announcementTimingAfterAzkar').checked : false;
  var duration = 15;
  var durationButtons = document.getElementsByClassName('announcement-duration-btn');
  for (var i = 0; i < durationButtons.length; i++) {
    var btn = durationButtons[i];
    if (btn.className.indexOf('active') !== -1) {
      duration = parseInt(btn.getAttribute('data-duration') || 15, 10);
      break;
    }
  }
  var timing = 'between';
  if (timingBetween && timingAfterAzkar) {
    timing = 'both';
  } else if (timingAfterAzkar) {
    timing = 'afterAzkar';
  }
  if (!timingBetween && !timingAfterAzkar) {
    if (typeof setStatus === 'function') setStatus('حدد وقت عرض واحد على الأقل');
    return;
  }
  var announcement = {
    id: id || ('ann-' + new Date().getTime() + '-' + Math.floor(Math.random() * 10000)),
    title: title || 'إعلان جديد',
    content: content,
    type: type,
    mediaUrl: (type === 'text') ? '' : mediaUrl,
    duration: duration,
    priority: priority,
    timing: timing,
    createdAt: id ? getAnnouncementCreatedAt(id) : new Date().getTime()
  };
  if (type !== 'text' && !announcement.mediaUrl) {
    if (typeof setStatus === 'function') setStatus('أدخل عنواناً للصورة أو الفيديو');
    return;
  }
  if (id) {
    for (var j = 0; j < SETTINGS.announcements.length; j++) {
      if (SETTINGS.announcements[j].id === id) {
        SETTINGS.announcements[j] = announcement;
        break;
      }
    }
  } else {
    SETTINGS.announcements.push(announcement);
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
  renderAnnouncementAdmin();
  clearAnnouncementForm();
  if (typeof setStatus === 'function') setStatus('تم حفظ الإعلان بنجاح');
  updateAnnouncementStateAndSchedule();
}

function getAnnouncementCreatedAt(id) {
  for (var i = 0; i < SETTINGS.announcements.length; i++) {
    if (SETTINGS.announcements[i].id === id) {
      return SETTINGS.announcements[i].createdAt || new Date().getTime();
    }
  }
  return new Date().getTime();
}

function deleteAnnouncement(id) {
  if (!Array.isArray(SETTINGS.announcements)) return;
  for (var i = 0; i < SETTINGS.announcements.length; i++) {
    if (SETTINGS.announcements[i].id === id) {
      SETTINGS.announcements.splice(i, 1);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
      renderAnnouncementAdmin();
      if (typeof setStatus === 'function') setStatus('تم حذف الإعلان');
      return;
    }
  }
}

function getPrayerDate(index) {
  if (!TODAY_ADHAN_TIMES || !TODAY_ADHAN_TIMES[index]) return null;
  var timeString = TODAY_ADHAN_TIMES[index];
  if (!timeString || timeString.indexOf(':') === -1) return null;
  var parts = timeString.split(':');
  var d = new Date();
  d.setHours(parseInt(parts[0], 10));
  d.setMinutes(parseInt(parts[1], 10));
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

function getNextPrayerDate() {
  return getPrayerDate(currentPrayerIndex);
}

function getCurrentAnnouncementState() {
  if (!TODAY_ADHAN_TIMES || currentPrayerIndex < 0) {
    return ANNOUNCEMENT_STATES.BEFORE_ADHAN;
  }
  var now = new Date();
  var adhanDate = getPrayerDate(currentPrayerIndex);
  if (!adhanDate) {
    return ANNOUNCEMENT_STATES.BEFORE_ADHAN;
  }
  var iqamaDate = new Date(adhanDate.getTime() + getIqamaMinutes(currentPrayerIndex) * 60000);
  if (now < adhanDate) {
    return ANNOUNCEMENT_STATES.BEFORE_ADHAN;
  }
  if (now >= adhanDate && now < iqamaDate) {
    return ANNOUNCEMENT_STATES.BETWEEN_ADHAN_IQAMA;
  }
  var prayerTimeEnd = new Date(iqamaDate.getTime() + (SETTINGS.prayNowMinutes || 10) * 60000);
  if (now >= iqamaDate && now < prayerTimeEnd) {
    return ANNOUNCEMENT_STATES.PRAYER_TIME;
  }
  if (SETTINGS.athkarEnabled === 'on') {
    var azkarStart = new Date(prayerTimeEnd.getTime() + (SETTINGS.athkarDelay || 0) * 60000);
    var azkarEnd = new Date(azkarStart.getTime() + (SETTINGS.athkarDuration || 10) * 60000);
    if (now >= azkarStart && now < azkarEnd) {
      return ANNOUNCEMENT_STATES.AZKAR_TIME;
    }
    if (now >= azkarEnd) {
      return ANNOUNCEMENT_STATES.AFTER_AZKAR;
    }
  } else {
    if (now >= prayerTimeEnd) {
      return ANNOUNCEMENT_STATES.AFTER_AZKAR;
    }
  }
  return ANNOUNCEMENT_STATES.AFTER_AZKAR;
}

function buildAnnouncementQueue(state) {
  var active = [];
  var announcements = Array.isArray(SETTINGS.announcements) ? SETTINGS.announcements : [];
  for (var i = 0; i < announcements.length; i++) {
    var ann = announcements[i];
    if (!ann || !ann.timing) continue;
    if (state === ANNOUNCEMENT_STATES.BETWEEN_ADHAN_IQAMA && (ann.timing === 'between' || ann.timing === 'both')) {
      active.push(ann);
    }
    if (state === ANNOUNCEMENT_STATES.AFTER_AZKAR && (ann.timing === 'afterAzkar' || ann.timing === 'both')) {
      active.push(ann);
    }
  }
  active.sort(function (a, b) {
    var pa = (a.priority === 'high') ? 0 : 1;
    var pb = (b.priority === 'high') ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.createdAt - b.createdAt;
  });
  return active;
}

function getAvailableAnnouncementSeconds(state) {
  var now = new Date();
  if (state === ANNOUNCEMENT_STATES.BETWEEN_ADHAN_IQAMA) {
    var adhanDate = getPrayerDate(currentPrayerIndex);
    if (!adhanDate) return 0;
    var iqamaDate = new Date(adhanDate.getTime() + getIqamaMinutes(currentPrayerIndex) * 60000);
    var bufferSec = (SETTINGS.announcementBufferMinutes || 2) * 60;
    var latestEnd = new Date(iqamaDate.getTime() - bufferSec * 1000);
    var diff = Math.floor((latestEnd.getTime() - now.getTime()) / 1000);
    return diff > 0 ? diff : 0;
  }
  if (state === ANNOUNCEMENT_STATES.AFTER_AZKAR) {
    var nextPrayer = getNextPrayerDate();
    if (!nextPrayer) return 0;
    var diff = Math.floor((nextPrayer.getTime() - now.getTime()) / 1000);
    return diff > 0 ? diff : 0;
  }
  return 0;
}

function findNextAnnouncementForAvailableTime(queue, availableSeconds) {
  for (var i = 0; i < queue.length; i++) {
    if (queue[i].duration <= availableSeconds) {
      return queue[i];
    }
  }
  return null;
}

function showAnnouncement(announcement) {
  if (!announcement || !$('announcementScreen')) return;
  var screen = $('announcementScreen');
  var badge = $('announcementBadge');
  var title = $('announcementTitleDisplay');
  var body = $('announcementBodyDisplay');
  var media = $('announcementMediaDisplay');
  if (badge) badge.textContent = announcement.priority === 'high' ? 'إعلان عاجل' : 'إعلان';
  if (title) title.textContent = announcement.title || 'إعلان مسجد';
  if (body) body.textContent = announcement.content || '';
  if (media) {
    media.innerHTML = '';
    if (announcement.type === 'image' && announcement.mediaUrl) {
      var img = document.createElement('img');
      img.src = announcement.mediaUrl;
      img.alt = announcement.title || 'صورة الإعلان';
      media.appendChild(img);
    }
    if (announcement.type === 'video' && announcement.mediaUrl) {
      var video = document.createElement('video');
      video.src = announcement.mediaUrl;
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.style.width = '100%';
      video.style.maxHeight = '40vh';
      media.appendChild(video);
      try { video.play(); } catch (e) { }
    }
  }
  screen.classList.add('active');
  announcementActive = true;
  if (announcementTimer) clearTimeout(announcementTimer);
  announcementTimer = setTimeout(function () {
    hideAnnouncementScreen();
    announcementActive = false;
    announcementLastEndTime = new Date();
    updateAnnouncementStateAndSchedule();
  }, (announcement.duration || 15) * 1000 + 300);
}

function hideAnnouncementScreen() {
  var screen = $('announcementScreen');
  if (!screen) return;
  screen.classList.remove('active');
  var media = $('announcementMediaDisplay');
  if (media) media.innerHTML = '';
}

function startAnnouncementPlayback() {
  var state = announcementState;
  if (state !== ANNOUNCEMENT_STATES.BETWEEN_ADHAN_IQAMA && state !== ANNOUNCEMENT_STATES.AFTER_AZKAR) {
    return;
  }
  if (announcementActive) {
    return;
  }
  if (announcementLastEndTime) {
    var sinceEnd = Math.floor((new Date().getTime() - announcementLastEndTime.getTime()) / 1000);
    if (sinceEnd < announcementCooldownSeconds) {
      return;
    }
  }
  var queue = buildAnnouncementQueue(state);
  if (queue.length === 0) {
    return;
  }
  var availableSeconds = getAvailableAnnouncementSeconds(state);
  if (availableSeconds <= 0) {
    return;
  }
  var nextAnnouncement = findNextAnnouncementForAvailableTime(queue, availableSeconds);
  if (!nextAnnouncement) {
    return;
  }
  showAnnouncement(nextAnnouncement);
}

function updateAnnouncementStateAndSchedule() {
  var newState = getCurrentAnnouncementState();
  if (newState !== announcementState) {
    announcementState = newState;
  }
  if (announcementActive && newState !== ANNOUNCEMENT_STATES.BETWEEN_ADHAN_IQAMA && newState !== ANNOUNCEMENT_STATES.AFTER_AZKAR) {
    hideAnnouncementScreen();
    announcementActive = false;
  }
  if ((newState === ANNOUNCEMENT_STATES.BETWEEN_ADHAN_IQAMA || newState === ANNOUNCEMENT_STATES.AFTER_AZKAR) && !announcementActive) {
    startAnnouncementPlayback();
  }
}

// ✅ 1. دالة تبديل الكتم (المحرك)
function toggleMute() {
  isAdhanMuted = !isAdhanMuted;

  if (typeof SETTINGS !== 'undefined') {
    SETTINGS.isAdhanMuted = isAdhanMuted;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
  }

  // ✅ لازم الـ ID هنا يكون muteAdhanBtn عشان يطابق الـ HTML
  var btn = document.getElementById('muteAdhanBtn');
  if (btn) {
    btn.innerHTML = isAdhanMuted ? "وضع الكتم: مشغل (جرس) 🔔" : "وضع الكتم: معطل (أذان) 🔊";
    btn.style.backgroundColor = isAdhanMuted ? "#840101" : "#2e7d32";
  }

  updateHeaderAudioIcon();

}
// ✅ 2. دالة تحديث الأيقونة (العرض)
function updateHeaderAudioIcon() {
  var icon = document.getElementById('headerAudioIcon');
  if (!icon) return;

  var v = new Date().getTime(); // عشان يمسح الكاش ويحدث الصورة فوراً

  if (isAdhanMuted === true || String(isAdhanMuted) === "true") {
    icon.src = "image/horn_off.png";// كانت  icon.src = "image/horn_off.png?v=" + v;  وغيرناها للتحميل من الكاش
  } else {
    icon.src = "image/horn_on.png" ; // كانت   icon.src = "image/horn_on.png?v=" + v;  وغيرناها للتحميل من الكاش
  }
}
// ◀️ دالة تطبيق الخلفية والثيم الديناميكي
function applyBackground() {
  var bgImage = SETTINGS.backgroundImage || 'v-2.jpg';
  document.body.style.backgroundImage = "url('image/" + bgImage + "')";

  // تطبيق الثيم الديناميكي
  applyTheme(bgImage);

  // تحديث حالة الخلفية
  setStatus('تم تطبيق الخلفية: ' + bgImage);
}

// تطبيق الثيم الديناميكي للألوان
function applyTheme(bgImage) {
  var theme = THEMES[bgImage] || THEMES['v-2.jpg'];

  // تطبيق الألوان على العناصر المختلفة
  var style = document.getElementById('dynamic-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dynamic-styles';
    document.head.appendChild(style);
  }

  style.textContent = '' +
    '    /* ألوان الساعة */\n' +
    '    #clock {\n' +
    '      color: ' + theme.primary + ';\n' +
    '      text-shadow: 0 4px 15px ' + hexToRgba(theme.secondary, 0.4) + ';\n' +
    '    }\n' +
    '    .digit-container {\n' +
    '      background: linear-gradient(135deg, ' + hexToRgba(theme.primary, 0.3) + ', ' + hexToRgba(theme.secondary, 0.1) + ');\n' +
    '      border: 2px solid ' + hexToRgba(theme.secondary, 0.13) + ';\n' +
    '    }\n' +
    '    .digit { color: ' + theme.primary + '; }\n\n' +
    '    /* ألوان رأس الصلاة - بلون مختلف عن صفوف الصلاة */\n' +
    '    .prayers-header {\n' +
    '      color: ' + theme.primary + ' !important;\n' +
    '      background: ' + (bgImage === 'v-2.jpg' ?
      'linear-gradient(135deg, rgba(244, 233, 226, 0.492), rgba(139, 69, 19, 0.05))' :
      'linear-gradient(135deg, ' + hexToRgba(theme.primary, 0.3) + ', ' + hexToRgba(theme.primary, 0.05) + ')') + ' !important;\n' +
    '      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;\n' +
    '      box-shadow: 0 4px 10px ' + hexToRgba(theme.primary, 0.3) + ' !important;\n' +
    '    }\n\n' +
    '    /* ألوان صفوف الصلاة */\n' +
    '    .prRow {\n' +
    '      background: linear-gradient(135deg, ' + hexToRgba(theme.secondary, 0.25) + ', ' + hexToRgba(theme.secondary, 0.13) + ');\n' +
    '      border: 1px solid ' + hexToRgba(theme.secondary, 0.13) + ';\n' +
    '    }\n' +
    '    .prRow .col {\n' +
    '      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n' +
    '    }\n' +
    '    .prRow .col.name { color: ' + theme.text + '; }\n' +
    '    .prRow .col.time { color: ' + theme.accent + '; }\n\n' +
    '    /* ألوان الصلاة المميزة */\n' +
    '    .prRow.highlight {\n' +
    '      background: linear-gradient(135deg, ' + hexToRgba(theme.accent, 0.45) + ', ' + hexToRgba(theme.secondary, 0.35) + ');\n' +
    '      border: 3px solid ' + theme.highlight + ';\n' +
    '      box-shadow: 0 0 25px ' + hexToRgba(theme.highlight, 0.7) + ', 0 0 50px ' + hexToRgba(theme.highlight, 0.5) + ';\n' +
    '    }\n' +
    '    .prRow.highlight .col.name,\n' +
    '    .prRow.highlight .col.time {\n' +
    '      color: ' + theme.highlight + ';\n' +
    '      text-shadow: 0 2px 10px ' + hexToRgba(theme.highlight, 0.6) + ';\n' +
    '    }\n\n' +
    '    /* ألوان الوقت المتبقي */\n' +
    '    #remaining {\n' +
    '      background: linear-gradient(135deg, ' + theme.remainingBg + ', ' + theme.remainingBg + ');\n' +
    '      color: ' + theme.text + ';\n' +
    '      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.849);\n' +
    '    }\n\n' +
    '    /* ألوان القائمة الجانبية */\n' +
    '    #sideMenu {\n' +
    '      background: ' + theme.menuBg + ';\n' +
    '      border-right: 3px solid ' + theme.menuBorder + ';\n' +
    '    }\n' +


    '    #sideMenu::-webkit-scrollbar-thumb { background: ' + theme.menuBorder + '; }\n' +
    '    .hamburger-lines span { background-color: ' + theme.menuBorder + '; }\n' +
    '    #menuBtn { border: 2px solid ' + theme.menuBorder + '; }\n\n' +
    '    /* ألوان الأزرار */\n' +
    '    .btn { background: ' + theme.accent + '; color: #000; }\n\n' +
    '    /* ألوان النص في التذييل */\n' +
    '    .footer-name { color: ' + theme.accent + '; }\n\n' +
    '    /* ألوان الشاشة السوداء */\n' +
    '    #overlay .title { color: ' + theme.overlay + ' !important; }\n' +
    '    #overlay .counter { color: ' + theme.text + ' !important; }\n\n' +
    '    /* ألوان شريط الأذكار */\n' +
    '    #ticker marquee {\n' +
    '      color: ' + theme.tickerText + ';\n' +
    '      text-shadow: 1px 1px 0 rgba(133, 141, 142, 0.495);\n' +
    '    }\n\n' +
    '    /* ألوان التواريخ */\n' +
    '    .hijri-date, .greg-date, #dayName {\n' +
    '      color: ' + theme.text + ';\n' +
    '      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.572);\n' +
    '    }\n\n' +
    '    /* ألوان اسم المسجد */\n' +
    '    #mosqueDisplay { color: ' + theme.text + ';\n' +
    '    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.572); }\n'

    ;

  // إضافة الأنيميشن للنص المتوهج
  var animationStyle = '' +
    '    @keyframes text-glow {\n' +
    '      0%, 100% {\n' +
    '        transform: scale(1);\n' +
    '        text-shadow: 0 2px 8px ' + hexToRgba(theme.highlight, 0.6) + ', 0 4px 16px ' + hexToRgba(theme.highlight, 0.3) + ';\n' +
    '      }\n' +
    '      50% {\n' +
    '        transform: scale(1.6);\n' +
    '        text-shadow: 0 2px 12px ' + hexToRgba(theme.highlight, 0.9) + ', 0 4px 24px ' + hexToRgba(theme.highlight, 0.6) + ';\n' +
    '      }\n' +
    '    }\n' +
    '    @-webkit-keyframes text-glow {\n' +
    '      0%, 100% {\n' +
    '        -webkit-transform: scale(1);\n' +
    '        -webkit-text-shadow: 0 2px 8px ' + hexToRgba(theme.highlight, 0.6) + ', 0 4px 16px ' + hexToRgba(theme.highlight, 0.3) + ';\n' +
    '      }\n' +
    '      50% {\n' +
    '        -webkit-transform: scale(1.6);\n' +
    '        -webkit-text-shadow: 0 2px 12px ' + hexToRgba(theme.highlight, 0.9) + ', 0 4px 24px ' + hexToRgba(theme.highlight, 0.6) + ';\n' +
    '      }\n' +
    '    }\n';

  style.textContent += animationStyle;
}

// مساعد لتحويل الألوان من hex إلى rgba
function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function setStatus(s) { try { $('status').innerText = s; } catch (e) { } }
function updateMosqueName() {
  try {
    var el = $('mosqueDisplay');
    if (SETTINGS.mosqueName) {
      el.innerText = SETTINGS.mosqueName; el.style.display = 'block';
    }
    else { el.style.display = 'none'; }
  } catch (e) { }
}

function loadManifest(cb) {
  // Now using hardcoded data directly to bypass local file access issues
  MANIFEST = HARDCODED_MANIFEST;
  setStatus('تم تحميل الدول من الكود');
  cb && cb();
}

function populateCountries() {
  var sel = $('countrySelect'); sel.innerHTML = '';
  for (var code in MANIFEST) {
    if (MANIFEST.hasOwnProperty(code)) {
      var opt = document.createElement('option'); opt.value = code; opt.text = MANIFEST[code].name; sel.appendChild(opt);
    }
  }
  try { sel.value = SETTINGS.country; } catch (e) { }
  loadProvinces(sel.value);
}

function loadProvinces(country) {
  var plist = MANIFEST[country] && MANIFEST[country].provinces;
  var sel = $('provinceSelect'); sel.innerHTML = '';
  if (Array.isArray(plist)) {
    for (var i = 0; i < plist.length; i++) {
      var p = plist[i]; var opt = document.createElement('option'); opt.value = p.code; opt.text = p.name; sel.appendChild(opt);
    }
    try { sel.value = SETTINGS.province; } catch (e) { }
    // This is the only remaining XHR call. We will assume the single province file is available.
    loadTimesFor(sel.value, country);
  } else {
    loadTimesFor(null, country);
  }
}

function pathForProvince(code, country) {
  if (code) return 'data/' + code + '.js';
  if (country) return 'data/' + country + '.js';
  return 'data/CAIRO2.js';
}


function loadTimesFor(provinceCode, countryCode) {
  setStatus('تحميل مواقيت...');
  var path = pathForProvince(provinceCode, countryCode).replace('.json', '.js');

  // امسح أي TIMES_OBJ قديم
  TIMES_OBJ = null;

  // اعمل عنصر سكربت جديد
  var script = document.createElement('script');
  script.src = path // قمنا بتعديلها للتحميل من الكاش script.src = path + '?v=' + Date.now();
  script.onload = function () {
    if (window.TIMES_OBJ) {
      setStatus('تم تحميل ' + path);
      renderTimes();
    } else {
      setStatus('فشل تحميل ' + path);
      TIMES_OBJ = {};
      renderTimes();
    }
  };
  script.onerror = function () {
    setStatus('❌ فشل تحميل بيانات المواقيت. تحقق من اتصال الإنترنت أو وجود الملفات.');
    TIMES_OBJ = {};
    renderTimes();
  };
  document.body.appendChild(script);
}

// --- UI Rendering ---
function renderTimes() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = null;
  var container = $('prayerList'); container.innerHTML = '';
  if (!TIMES_OBJ || Object.keys(TIMES_OBJ).length === 0) { container.innerHTML = '<div class="small">لا توجد بيانات مواقيت لهذا اليوم.</div>'; return; }
  var d = new Date(); var mm = pad2(d.getMonth() + 1); var dd = pad2(d.getDate()); var key = mm + '-' + dd;
  var line = TIMES_OBJ[key];
  if (!line) { container.innerHTML = '<div class="small">لا توجد بيانات لليوم ' + key + '</div>'; setStatus('لا بيانات لليوم ' + key); $('remaining').innerText = 'المتبقي للأذان القادم: --:--:--'; return; }
  var parts = getAdjustedPrayerTimes(line);
  TODAY_ADHAN_TIMES = parts.map(function (t) { return adjustTimeForDST(t, dstMode_now); });

  // ◀️ تحديث اليوم الأخير الذي تم عرضه
  lastRenderedDay = d.getDate();

  var labels = PRAYER_NAMES_AR.slice(); // ◀️ نعمل نسخة من المصفوفة الأصلية
  // ◀️ نغير اسم الظهر إلى الجمعة فقط يوم الجمعة
  if (d.getDay() === 5) {
    labels[2] = 'الجمعة';
  }

  var dstMode_now = getDSTMode();

  for (var i = 0; i < labels.length; i++) {
    var div = document.createElement('div');
    div.className = 'prRow';
    div.id = 'row_' + i;

    // العمود الأول: وقت الأذان (اليمين) - لون اصفر
    var adhanTime = document.createElement('div');
    adhanTime.className = 'col time';
    var rawAdhan = parts[i] || '--:--';
    var adjAdhan = adjustTimeForDST(rawAdhan, dstMode_now);
    adhanTime.innerText = to12h(adjAdhan);
    adhanTime.id = 'adhan_' + i;

    // العمود الثاني: اسم الصلاة (الوسط) - أبيض
    var prayerName = document.createElement('div');
    prayerName.className = 'col name';
    prayerName.innerText = labels[i];
    prayerName.id = 'name_' + i;

    // العمود الثالث: وقت الإقامة (اليسار) - لون اصفر
    var iqamaTime = document.createElement('div');
    iqamaTime.className = 'col time';
    var iqamaMinutes = getIqamaMinutes(i);
    if (iqamaMinutes > 0) {
      var adhanDate = hhmmToToday(adjAdhan);
      var iqamaDate = new Date(adhanDate.getTime() + iqamaMinutes * 60000);
      var iqamaHH = iqamaDate.getHours();
      var iqamaMM = pad2(iqamaDate.getMinutes());
      iqamaTime.innerText = to12h(iqamaHH + ':' + iqamaMM);
    } else {
      iqamaTime.innerText = '--:--';
    }
    iqamaTime.id = 'iqama_' + i;

    // نضيف بالترتيب: أذان - اسم - إقامة
    div.appendChild(adhanTime);
    div.appendChild(prayerName);
    div.appendChild(iqamaTime);
    container.appendChild(div);
  }

  // استئناف الحالة الحالية بدلاً من الانتقال المباشر للصلاة القادمة
  resumeCurrentState();

  updateAnnouncementStateAndSchedule();
}

// ✅ تحسين دالة الهايلايت المعدلة لتكون أكثر دقة
// دالة مساعدة: إرجاع الوقت الحالي المعدل (المتوافق مع الساعة الكبيرة)
function getAdjustedNow() {
  var now = new Date();                      // وقت النظام الحقيقي
  var adj = getAdjustedTime(now);            // {hours, minutes, seconds} المعدلة
  var originalTotalMinutes = now.getHours() * 60 + now.getMinutes();
  var adjustedTotalMinutes = adj.hours * 60 + adj.minutes;
  var diffMinutes = adjustedTotalMinutes - originalTotalMinutes;
  // إنشاء كائن تاريخ جديد مع إزاحة الدقائق (يحافظ على اليوم والتاريخ عند تجاوز منتصف الليل)
  return new Date(now.getTime() + diffMinutes * 60 * 1000);
}

// دالة highlightNext المعدلة
function highlightNext(parts) {
  var now = getAdjustedNow();   // ⬅️ بدلاً من new Date()
  var nextIdx = -1;
  var nextDT = null;
  var rows = document.getElementsByClassName('prRow');
  for (var k = 0; k < rows.length; k++) {
    rows[k].className = 'prRow';
  }
  for (var i = 0; i < parts.length; i++) {
    if (i === 1) continue; // تخطي الشروق
    var t = adjustTimeForDST(parts[i], getDSTMode());
    if (!t || t === '--:--') continue;
    var dt = hhmmToToday(t);
    var nowTime = now.getTime();
    var prayerTime = dt.getTime();
    if (prayerTime <= nowTime) {
      dt.setDate(dt.getDate() + 1);
      prayerTime = dt.getTime();
    }
    if (nextDT === null || prayerTime < nextDT.getTime()) {
      nextDT = dt;
      nextIdx = i;
    }
  }
  currentPrayerIndex = nextIdx;
  if (nextIdx >= 0 && nextDT) {
    var highlightedRow = $('row_' + nextIdx);
    if (highlightedRow) highlightedRow.className = 'prRow highlight';
    startCountdownToNextPrayer(nextDT);
  } else {
    var remainingEl = $('remaining');
    if (remainingEl) remainingEl.innerText = 'المتبقي للأذان القادم: --:--:--';
  }
}
// ✅ تحسين دالة العد التنازلي المعدلة للصلاة القادمة
function startCountdownToNextPrayer(nextDT) {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(function () {
    var nowReal = new Date();
    var adj = getAdjustedTime(nowReal);
    // تاريخ وهمي يمثل الوقت الظاهر على الساعة الكبيرة
    var nowVirtual = new Date(
      nowReal.getFullYear(),
      nowReal.getMonth(),
      nowReal.getDate(),
      adj.hours,
      adj.minutes,
      adj.seconds,
      0
    );
    var diff = nextDT.getTime() - nowVirtual.getTime();
    if (diff <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      playAdhanAudioOnly();
    } else {
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var remainingEl = $('remaining');
      if (remainingEl) remainingEl.innerText = 'المتبقي للأذان القادم: ' + pad2(h) + ':' + pad2(m) + ':' + pad2(s);
    }
  }, 1000);
}

function updatePrayerHighlight() {
  if (!TIMES_OBJ) return;

  var d = new Date();
  var mm = pad2(d.getMonth() + 1);
  var dd = pad2(d.getDate());
  var key = mm + '-' + dd;
  var line = TIMES_OBJ[key];

  if (line) {
    var parts = getAdjustedPrayerTimes(line);
    highlightNext(parts);
  }
}

function formatTime(totalSeconds) {
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  if (hours > 0) {
    return pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds);
  } else {
    return pad2(minutes) + ':' + pad2(seconds);
  }
}

function getIqamaMinutes(idx) {
  var iqamaMins = SETTINGS.iqamaMinutes;
  var mins = [iqamaMins.fajr, 0, iqamaMins.dhuhr, iqamaMins.asr, iqamaMins.maghrib, iqamaMins.isha];
  return mins[idx] || 0;
}


// ✅ دالة جديدة لعرض الشاشة السوداء مع النص المطلوب
function showAdhanOverlay(title, counterText) {
  // استخدام الـ overlay الموجود في الـ HTML بدلاً من إنشاء واحد جديد
  var overlay = $('overlay');
  var titleEl = $('overlayTitle');
  var counterEl = $('overlayCounter');

  if (overlay && titleEl && counterEl) {
    titleEl.innerText = title;
    counterEl.innerText = counterText;
    overlay.classList.add('active');
    // إخفاء العناصر الأخرى أثناء العرض
    try {
      var marq = $('marq');
      if (marq) marq.style.display = 'none';
    } catch (e) { }

    console.log("✅ تم عرض الشاشة السوداء: " + title + " - " + counterText);
  } else {
    console.log("❌ عناصر الشاشة السوداء غير موجودة في الـ DOM");
    // إذا العناصر غير موجودة، نستخدم الطريقة القديمة
    showCompatibleOverlay(title, counterText);
  }
}

// ✅ دالة جديدة لتحديث العداد في الشاشة السوداء
function updateAdhanOverlayCounter(counterText) {
  var counterEl = $('overlayCounter');
  if (counterEl) {
    counterEl.innerText = counterText;
  } else {
    // إذا العنصر غير موجود، نستخدم الطريقة القديمة
    var compatibleCounter = $('#compatibleOverlayCounter');
    if (compatibleCounter) {
      compatibleCounter.innerText = counterText;
    }
  }
}

// ✅ دالة جديدة لإخفاء الشاشة السوداء
function hideAdhanOverlay() {
  try {
    var overlay = $('overlay');
    if (overlay) {
      //overlay.style.display = 'none';
      overlay.classList.remove('active');
    }

    var marq = $('marq');

    if (marq) {
      marq.style.display = 'block';
    }

    console.log("✅ تم إخفاء الشاشة السوداء");
  } catch (e) {
    console.log("❌ خطأ في إخفاء الشاشة السوداء:", e);
    // إذا فشلنا، نستخدم الطريقة القديمة
    hideCompatibleOverlay();
  }
}

// ✅ إصلاح دالة تشغيل الأذان - استخدام الشاشة السوداء الجديدة
// ✅ إصلاح دالة تشغيل الأذان - العد التنازلي للإقامة يبدأ من وقت الأذان
function playAdhanAudioOnly(optionalStartTime) {
  if (currentPrayerIndex === undefined || currentPrayerIndex === -1) return;
  var prayerName = PRAYER_NAMES_AR[currentPrayerIndex];
  if (!prayerName) return;

  if (iqamaCountdownInterval) clearInterval(iqamaCountdownInterval);
  if (adhanPlayingInterval) clearInterval(adhanPlayingInterval);
  iqamaCountdownInterval = null;
  adhanPlayingInterval = null;

  var now = new Date();
  var isFriday = (now.getDay() === 5);
  var isFridayDhuhr = (isFriday && currentPrayerIndex === 2);

  showAdhanOverlay(' حان موعد الأذان', prayerName);

  var iqamaMinutes = getIqamaMinutes(currentPrayerIndex);
  if (isFridayDhuhr && SETTINGS.fridaySermonEnabled === 'on') {
    totalIqamaSeconds = ADHAN_DURATION_SECONDS + parseInt(SETTINGS.fridaySermonDuration || 20) * 60;
  } else {
    totalIqamaSeconds = iqamaMinutes * 60;
  }

  var startTime = optionalStartTime || hhmmToToday(TODAY_ADHAN_TIMES[currentPrayerIndex]);
  elapsedAdhanSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  if (elapsedAdhanSeconds < 0) elapsedAdhanSeconds = 0;
  if (elapsedAdhanSeconds > totalIqamaSeconds) elapsedAdhanSeconds = totalIqamaSeconds;

  var adhanAlreadyFinished = (elapsedAdhanSeconds >= ADHAN_DURATION_SECONDS);

  if (totalIqamaSeconds > 0) {
    updateIqamaCountdown();
    iqamaCountdownInterval = setInterval(function () {
      elapsedAdhanSeconds++;
      updateIqamaCountdown();

      if (elapsedAdhanSeconds === ADHAN_DURATION_SECONDS && !adhanAlreadyFinished) {
        if (isFridayDhuhr && SETTINGS.fridaySermonEnabled === 'on') {
          showAdhanOverlay('خطبة الجمعة الآن', 'برجاء الاستماع والهدوء');
          var titleEl = $('overlayTitle');
          if (titleEl) { titleEl.style.fontSize = '15vw'; titleEl.style.color = '#ffffff'; }
        } else {
          hideAdhanOverlay();
        }
      }

      if (elapsedAdhanSeconds >= totalIqamaSeconds) {
        clearInterval(iqamaCountdownInterval);
        iqamaCountdownInterval = null;
        var titleEl = $('overlayTitle');
        if (titleEl) { titleEl.style.fontSize = ''; titleEl.style.color = ''; }
        showPrayerNowCompatible();
      }
    }, 1000);

    if (adhanAlreadyFinished) {
      if (isFridayDhuhr && SETTINGS.fridaySermonEnabled === 'on') {
        showAdhanOverlay('خطبة الجمعة الآن', 'برجاء الاستماع والهدوء');
      } else {
        hideAdhanOverlay();
      }
    }
  } else {
    if (overlayTimeout) clearTimeout(overlayTimeout);
    var remainingAdhan = Math.max(0, ADHAN_DURATION_SECONDS - elapsedAdhanSeconds);
    overlayTimeout = setTimeout(function () {
      hideAdhanOverlay();
      updateNextPrayerAutomatically();
    }, remainingAdhan * 1000);
  }

  if (elapsedAdhanSeconds < ADHAN_DURATION_SECONDS) {
    try {
      var adhanAudio = document.getElementById('adhanAudio');
      var bellAudio = document.getElementById('bellAudio');
      if (adhanAudio) { adhanAudio.pause(); adhanAudio.currentTime = 0; }
      if (bellAudio) { bellAudio.pause(); bellAudio.currentTime = 0; }
      if (isAdhanMuted) {
        if (bellAudio) { bellAudio.volume = 1; bellAudio.play().catch(function (e) { }); }
      } else {
        if (adhanAudio) { adhanAudio.volume = 1; adhanAudio.play().catch(function (e) { }); }
      }
    } catch (e) { }
  }
}
// ✅ دالة جديدة لتحديث العد التنازلي للإقامة
function updateIqamaCountdown() {
  if (totalIqamaSeconds <= 0) return;
  var remainingSeconds = totalIqamaSeconds - elapsedAdhanSeconds;
  if (remainingSeconds < 0) remainingSeconds = 0;
  var remainingEl = $('remaining');
  if (remainingEl) remainingEl.innerText = 'المتبقي للإقامة: ' + formatTime(remainingSeconds);
  var overlayCounter = $('overlayCounter');
  if (overlayCounter && overlayCounter.style.display !== 'none') {
    var minutesLeft = Math.floor(remainingSeconds / 60);
    var secondsLeft = remainingSeconds % 60;
    overlayCounter.innerText = pad2(minutesLeft) + ':' + pad2(secondsLeft);
  }
}
// ✅ دالة جديدة للعد التنازلي للإقامة من بداية وقت الأذان
function startIqamaCountdownFromAdhanStart(totalIqamaSeconds, elapsedSeconds) {
  var remainingSeconds = totalIqamaSeconds - elapsedSeconds;

  // ✅ تحديث النص الرئيسي
  if ($('remaining')) {
    $('remaining').innerText = 'المتبقي للإقامة: ' + formatTime(remainingSeconds);
  }

  console.log("⏳ بدأ العد التنازلي للإقامة: " + remainingSeconds + " ثانية متبقية");
}


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// ✅ إصلاح دالة عرض شاشة الصلاة الآن
function showPrayerNowCompatible(optionalStartTime) {
  $('remaining').innerText = 'الصلاة الآن - فضلاً الهدوء';
  if (iqamaCountdownInterval) { clearInterval(iqamaCountdownInterval); iqamaCountdownInterval = null; }
  if (adhanPlayingInterval) { clearInterval(adhanPlayingInterval); adhanPlayingInterval = null; }
  showAdhanOverlay(' الصلاة الآن', 'فضلاً الهدوء');

  var now = new Date();
  var startTime = optionalStartTime || (function () {
    var adhanDate = hhmmToToday(TODAY_ADHAN_TIMES[currentPrayerIndex]);
    return new Date(adhanDate.getTime() + getIqamaMinutes(currentPrayerIndex) * 60000);
  })();
  var elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  if (elapsed < 0) elapsed = 0;
  var totalPrayerNow = (SETTINGS.prayNowMinutes || 10) * 60;
  var remaining = Math.max(0, totalPrayerNow - elapsed);

  var isFriday = (now.getDay() === 5);
  var isDhuhrPrayer = (currentPrayerIndex === 2);
  if (!(isFriday && isDhuhrPrayer)) {
    try { var a = $('iqamaAudio'); if (a && a.play) a.play().catch(function (e) { }); } catch (e) { }
  }

  if (overlayTimeout) clearTimeout(overlayTimeout);
  overlayTimeout = setTimeout(function () {
    hideAdhanOverlay();
    startAthkarCountdown();
    setTimeout(function () {
      updateNextPrayerAutomatically();
    }, ((SETTINGS.athkarDelay + SETTINGS.athkarDuration) * 60000) + 2000);
  }, remaining * 1000);
}
////////////////////////////////////////////////////////////////////////////
// ✅ تحسين دالة تحديث الصلاة التالية
function updateNextPrayerAutomatically() {
  if (!TIMES_OBJ) {
    console.log("لا توجد بيانات مواقيت");
    return;
  }

  var d = new Date();
  var mm = pad2(d.getMonth() + 1);
  var dd = pad2(d.getDate());
  var key = mm + '-' + dd;
  var line = TIMES_OBJ[key];

  if (line) {
    var parts = getAdjustedPrayerTimes(line);

    console.log("جاري تحديث الصلاة التالية...");

    // ✅ نعيد تعيين المؤشر ونجدد البحث عن الصلاة التالية
    currentPrayerIndex = -1;
    highlightNext(parts);

    // ✅ نضمن تحديث الهايلايت بشكل صحيح
    setTimeout(function () {
      highlightNext(parts);
    }, 100);

    setStatus('تم الانتقال تلقائياً للصلاة التالية');
  } else {
    console.log("لا توجد بيانات لليوم: " + key);
    setStatus('لا توجد بيانات للانتقال التلقائي');
  }
}

// --- Clock & UI Updates ---
var lastSeconds = -1;
var lastMinutes = -1;
var lastHours = -1;

// 🔧 دالة مساعدة للأنيميشن المتوافق مع تنظيف محسّن
function updateDigitWithAnimation(elementId, newValue) {
  var container = $(elementId + '-container');
  if (!container) return;

  var currentDigits = container.getElementsByClassName('digit');
  var currentDigit = currentDigits[0];

  // إذا لم يتغير الرقم، لا تفعل شيئاً
  if (!currentDigit || currentDigit.innerText === newValue) {
    return;
  }

  // تنظيف كامل للعناصر القديمة أولاً
  var oldElements = container.getElementsByClassName('digit old');
  var newElements = container.getElementsByClassName('digit new');

  // إزالة جميع العناصر المؤقتة القديمة
  while (oldElements.length > 0) {
    if (oldElements[0].parentNode === container) {
      container.removeChild(oldElements[0]);
    }
  }
  while (newElements.length > 0) {
    if (newElements[0].parentNode === container) {
      container.removeChild(newElements[0]);
    }
  }

  // 1. إنشاء نسخة من الرقم الحالي ووضعها في الأعلى
  var oldDigit = currentDigit.cloneNode(true);
  oldDigit.className = 'digit old';

  // 2. إنشاء الرقم الجديد ووضعه في الأسفل
  var newDigit = document.createElement('span');
  newDigit.className = 'digit new';
  newDigit.innerText = newValue;

  // 3. إضافة الرقمين الجديد والقديم إلى الحاوية
  container.appendChild(oldDigit);
  container.appendChild(newDigit);

  // 4. مسح الرقم القديم الأصلي
  if (currentDigit.parentNode === container) {
    container.removeChild(currentDigit);
  }

  // 5. تنظيف مؤكد بعد انتهاء الأنيميشن
  setTimeout(function () {
    if (oldDigit.parentNode === container) {
      container.removeChild(oldDigit);
    }
    // نترك newDigit لأنه أصبح الرقم الحالي الجديد
  }, 600); // نزيد الوقت قليلاً عن مدة الأنيميشن في CSS
}

// ◀️ دالة تحديث الساعة مع تطبيق التوقيت الصيفي للساعة الكبيرة
function updateClockUI() {
  var d = new Date();                // وقت الجهاز الحقيقي

  // هل التوقيت الصيفي مُطبَّق فعلاً (حسب الإعدادات والتاريخ)؟
  var currentDst = false;
  var mode = getDSTMode();
  if (mode === 'on') {
    currentDst = true;
  } else if (mode === 'auto') {
    currentDst = isDSTActiveForDate(d);
  }
  // mode === 'off' => currentDst = false

  var currentDay = d.getDate();

  // إعادة رسم المواقيت إذا تغير اليوم أو تغيرت حالة التوقيت الصيفي الفعلي
  if (currentDay !== lastRenderedDay || currentDst !== lastDstActive) {
    lastRenderedDay = currentDay;
    lastDstActive = currentDst;
    renderTimes();
  }

  // ✅ الحصول على الوقت المُعدَّل للساعة الكبيرة
  var adjusted = getAdjustedTime(d);
  var hh = adjusted.hours;
  var mm = adjusted.minutes;
  var ss = adjusted.seconds;

  var am = hh >= 12 ? 'م' : 'ص';
  var h12 = hh % 12;
  if (h12 === 0) h12 = 12;

  updateDigitWithAnimation('hours', pad2(h12));
  updateDigitWithAnimation('minutes', pad2(mm));
  updateDigitWithAnimation('seconds', pad2(ss));

  var ampmEl = $('ampm');
  if (ampmEl) ampmEl.innerText = am;

  updateDatesAndPrayers(d);
  checkEnergySavingMode();
}


function updateDatesAndPrayers(date) {
  // تحديث اليوم مع التحقق من العناصر
  var days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var dayNameEl = $('dayName');
  if (dayNameEl) {
    dayNameEl.innerText = days[date.getDay()];
  }

  // تحديث التاريخ الميلادي مع التحقق من العناصر
  var gregMonths = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'];
  var gregDayEl = $('gregDay');
  var gregMonthEl = $('gregMonth');
  var gregYearEl = $('gregYear');

  if (gregDayEl) gregDayEl.innerText = date.getDate();
  if (gregMonthEl) gregMonthEl.innerText = gregMonths[date.getMonth()];
  if (gregYearEl) gregYearEl.innerText = date.getFullYear();

  // تحديث التاريخ الهجري
  updateHijriDateSimple(date);

  // التحقق من وضع توفير الطاقة
  checkEnergySavingMode();


}

////////////////////////////////////////////

// دالة بسيطة متوافقة مع الإمكانيات المتاحة
function updateHijriDateSimple(date) {
  try {
    var hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    var hijriString = hijriFormatter.format(date);

    // تقسيم النص يدوياً
    var hijriParts = splitHijriDateManual(hijriString);
    var offset = SETTINGS.hijriOffset || 0;

    // ◀️ نطبق التعديل على اليوم فقط
    if (offset !== 0) {
      var originalDay = convertArabicNumberToInt(hijriParts.day);
      if (!isNaN(originalDay)) {
        var newDay = originalDay + offset;

        // نتأكد من أن اليوم within range (1-30)
        if (newDay < 1) newDay = 1;
        if (newDay > 30) newDay = 30;

        // نحول الرقم kembali إلى عربي
        hijriParts.day = convertIntToArabicNumber(newDay);
      }
    }

    // ✅ التحقق من وجود العناصر قبل التحديث
    var hijriDayEl = $('hijriDay');
    var hijriMonthEl = $('hijriMonth');
    var hijriYearEl = $('hijriYear');

    if (hijriDayEl) hijriDayEl.innerText = hijriParts.day || '--';
    if (hijriMonthEl) hijriMonthEl.innerText = hijriParts.month || '-----';
    if (hijriYearEl) hijriYearEl.innerText = hijriParts.year || '--- هـ';

    // نعرض حالة التعديل
    var statusText = 'هجري: ' + hijriParts.day + ' ' + hijriParts.month + ' ' + hijriParts.year;
    if (offset !== 0) {
      statusText += ' (معدل: ' + (offset > 0 ? '+' : '') + offset + ' يوم)';
    }
    setStatus(statusText);

  } catch (e) {
    setStatus('خطأ في التاريخ الهجري');

    // ✅ التحقق من وجود العناصر قبل التحديث
    var hijriDayEl = $('hijriDay');
    var hijriMonthEl = $('hijriMonth');
    var hijriYearEl = $('hijriYear');

    if (hijriDayEl) hijriDayEl.innerText = '--';
    if (hijriMonthEl) hijriMonthEl.innerText = '-----';
    if (hijriYearEl) hijriYearEl.innerText = '--- هـ';
  }
}

// ◀️ دالة مساعدة لتحويل الأرقام العربية
function convertArabicNumberToInt(arabicNum) {
  var arabicDigits = { '٠': 0, '١': 1, '٢': 2, '٣': 3, '٤': 4, '٥': 5, '٦': 6, '٧': 7, '٨': 8, '٩': 9 };
  var result = 0;
  for (var i = 0; i < arabicNum.length; i++) {
    var digit = arabicDigits[arabicNum[i]];
    if (digit !== undefined) {
      result = result * 10 + digit;
    }
  }
  return result;
}

// ◀️ دالة مساعدة لتحويل إلى أرقام عربية
function convertIntToArabicNumber(num) {
  var arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  var result = '';
  var str = num.toString();
  for (var i = 0; i < str.length; i++) {
    var digit = parseInt(str[i]);
    if (!isNaN(digit)) {
      result += arabicDigits[digit];
    }
  }
  return result || '٠';
}

// دالة لتقسيم نص التاريخ الهجري يدوياً
function splitHijriDateManual(hijriString) {
  try {
    var cleanString = hijriString.replace(/ هـ$/, '').trim();
    // إذا كان النص يحتوي على '/' (مثل 10/ربيع الآخر/1446)
    if (cleanString.indexOf('/') !== -1) {
      var parts = cleanString.split('/');
      if (parts.length >= 3) {
        return { day: parts[0], month: parts[1], year: parts[2] };
      }
    }
    // افتراضي: تقسيم حسب المسافات
    var parts = cleanString.split(' ');
    if (parts.length >= 3) {
      var day = parts[0];
      var year = parts[parts.length - 1];
      var monthParts = [];
      for (var i = 1; i < parts.length - 1; i++) {
        monthParts.push(parts[i]);
      }
      var month = monthParts.join(' ');
      return { day: day, month: month, year: year };
    } else {
      return { day: hijriString, month: '-----', year: '---' };
    }
  } catch (e) {
    return { day: hijriString, month: '-----', year: '---' };
  }
}

// 🔧 تحسين وضع توفير الطاقة - يعمل فقط في أوقات الصلوات المحددة
function checkEnergySavingMode() {
  if (SETTINGS.energySaving === 'off' || !TIMES_OBJ) return;

  var now = getAdjustedNow();
  var mm = pad2(now.getMonth() + 1);
  var dd = pad2(now.getDate());
  var key = mm + '-' + dd;
  var line = TIMES_OBJ[key];
  if (!line) return;

  var times = getAdjustedPrayerTimes(line);
  var dstMode = getDSTMode();

  var fajrTime = hhmmToToday(adjustTimeForDST(times[0], dstMode));
  var shurooqTime = hhmmToToday(adjustTimeForDST(times[1], dstMode));
  var dhuhrTime = hhmmToToday(adjustTimeForDST(times[2], dstMode));
  var asrTime = hhmmToToday(adjustTimeForDST(times[3], dstMode));
  var maghribTime = hhmmToToday(adjustTimeForDST(times[4], dstMode));
  var ishaTime = hhmmToToday(adjustTimeForDST(times[5], dstMode));

  var nowTime = now.getTime();

  // === الفترة الوحيدة التي تعبر منتصف الليل ===
  // نجعل fajrTime يشير إلى فجر الغد إذا كان قبل العشاء
  var fajrForIshaInterval = new Date(fajrTime);
  if (fajrForIshaInterval <= ishaTime) {
    fajrForIshaInterval.setDate(fajrForIshaInterval.getDate() + 1);
  }

  var intervals = [
    // بعد العشاء بـ 1.5 ساعة → قبل الفجر بساعة
    {
      start: new Date(ishaTime.getTime() + 90 * 60000),
      end: new Date(fajrForIshaInterval.getTime() - 60 * 60000)
    },
    // بعد الشروق بساعة → قبل الظهر بساعة
    {
      start: new Date(shurooqTime.getTime() + 60 * 60000),
      end: new Date(dhuhrTime.getTime() - 60 * 60000)
    },
    // بعد الظهر بساعة → قبل العصر بـ 45 دقيقة
    {
      start: new Date(dhuhrTime.getTime() + 60 * 60000),
      end: new Date(asrTime.getTime() - 45 * 60000)
    },
    // بعد العصر بساعة → قبل المغرب بـ 45 دقيقة
    {
      start: new Date(asrTime.getTime() + 60 * 60000),
      end: new Date(maghribTime.getTime() - 45 * 60000)
    }
  ];

  var shouldSaveEnergy = false;
  for (var i = 0; i < intervals.length; i++) {
    var startMs = intervals[i].start.getTime();
    var endMs = intervals[i].end.getTime();
    // start < end صحيح الآن دائمًا بعد التصحيح
    if (startMs < endMs && nowTime >= startMs && nowTime < endMs) {
      shouldSaveEnergy = true;
      break;
    }
  }

  applyEnergySaving(shouldSaveEnergy);
}

// دالة تشغيل الاطفاء من خلال مازر بورد الاندرويد
// دوال التحكم في الشاشة - مضمونة 100% على أندرويد 4.4 + Fully Kiosk بدون PLUS
function sendCommand(cmd) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:8080/" + cmd, true);
  xhr.timeout = 3000;
  xhr.send();
}




var hdmiKeepOffInterval = null;

function startHdmiKeepOffLoop() {
  // توقف أي حلقة سابقة إن وجدت
  stopHdmiKeepOffLoop();
  // أرسل أمر إطفاء HDMI فوراً
  sendCommand("hdmi-off");
  // ثم أعد الإرسال كل 10 ثوانٍ
  hdmiKeepOffInterval = setInterval(function () {
    sendCommand("hdmi-off");
  }, 5000); // 5 ثوانٍ
}

function stopHdmiKeepOffLoop() {
  if (hdmiKeepOffInterval) {
    clearInterval(hdmiKeepOffInterval);
    hdmiKeepOffInterval = null;
  }
}

// الدوال الأصلية المعدلة
function turnScreenOn() {
  stopHdmiKeepOffLoop();   // أوقف حلقة تثبيت الإطفاء
  sendCommand("on");        // شغّل كل شيء (إضاءة + HDMI)
}

function turnScreenOff() {
  sendCommand("off");       // أطفئ الإضاءة و HDMI مرة واحدة
  startHdmiKeepOffLoop();   // ابدأ حلقة تمنع عودة HDMI
}

///////////////////////////////////////////

// دالة توفير الطاقة (سيبها زي ما هي)
function applyEnergySaving(isEnergySaving) {
  try {
    if (isEnergySaving) {
      document.body.classList.add('low-power-mode');
      turnScreenOff();     // ← هنا بيطفي الباكلايت فعليًا
    } else {
      document.body.classList.remove('low-power-mode');
      turnScreenOn();      // ← هنا بيشغله تاني
    }
  } catch (e) {
    console.log('Error in energy saving:', e);
  }
}
// 🔧 وضع توفير الطاقة المتطرف
function applyExtremeEnergySaving(isEnergySaving) {
  if (isEnergySaving) {
    document.body.classList.add('low-power-mode');

    // محاولة تقليل الإضاءة الخلفية
    tryControlBacklight(true);

    // ✅ مسح المؤقت القديم قبل إنشاء جديد
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
    if (clockInterval) clearInterval(clockInterval);

    // تحديث كل دقيقة فقط
    clockInterval = setInterval(updateClockUI, 60000);

  } else {
    document.body.classList.remove('low-power-mode');
    tryControlBacklight(false);

    // ✅ مسح المؤقت القديم وإعادة إنشائه مع تحديث سريع
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = setInterval(updateClockUI, 1000);
    }
    // ✅ إعادة تشغيل العد التنازلي للصلاة القادمة
    updatePrayerHighlight();  // أو استدعاء renderTimes() إذا احتجت إعادة الرسم

  }
}

// 🔧 محاولة التحكم في الإضاءة الخلفية (دعم محدود)
function tryControlBacklight(turnOff) {
  try {
    // استخدام CSS filter أكثر قوة
    if (turnOff) {
      document.body.style.filter = 'brightness(0.00) contrast(0.05)';
      document.body.style.backgroundColor = '#000000';
    } else {
      document.body.style.filter = 'brightness(1) contrast(1)';
      document.body.style.backgroundColor = '';
    }

  } catch (e) {
    console.log('Backlight control not supported:', e);
  }
}

// 🔧 دالة تنظيف استباقية للأنيميشن
function cleanupClockAnimations() {
  var containers = [
    'hours-container',
    'minutes-container',
    'seconds-container'
  ];

  for (var i = 0; i < containers.length; i++) {
    var container = $(containers[i]);
    if (!container) continue;

    // إزالة جميع العناصر المؤقتة
    var tempDigits = container.getElementsByClassName('digit old');
    for (var j = tempDigits.length - 1; j >= 0; j--) {
      if (tempDigits[j].parentNode === container) {
        container.removeChild(tempDigits[j]);
      }
    }

    var tempNewDigits = container.getElementsByClassName('digit new');
    for (var k = tempNewDigits.length - 1; k >= 0; k--) {
      if (tempNewDigits[k].parentNode === container) {
        container.removeChild(tempNewDigits[k]);
      }
    }

    // التأكد من وجود رقم أساسي واحد فقط
    var mainDigits = container.getElementsByClassName('digit');
    if (mainDigits.length === 0) {
      var newDigit = document.createElement('span');
      newDigit.className = 'digit';
      newDigit.innerText = '00';
      container.appendChild(newDigit);
    } else if (mainDigits.length > 1) {
      for (var m = 1; m < mainDigits.length; m++) {
        if (mainDigits[m].parentNode === container) {
          container.removeChild(mainDigits[m]);
        }
      }
    }
  }
}



// عناصر الوسائط
var adhanAudio = document.getElementById('adhanAudio');

// ✅ إصلاح دالة إنشاء الشاشة السوداء الاحتياطية
function createCompatibleOverlay() {
  // إنشاء overlay بسيط ومتوافق
  var overlay = document.createElement('div');
  overlay.id = 'compatibleOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = '#000000';
  overlay.style.color = '#FFFFFF';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'none';
  overlay.style.textAlign = 'center';
  overlay.style.paddingTop = '20%';
  overlay.style.fontSize = '36px';
  overlay.style.fontWeight = 'bold';

  var title = document.createElement('div');
  title.id = 'compatibleOverlayTitle';
  title.style.marginBottom = '20px';
  title.style.color = '#FFD700';

  var counter = document.createElement('div');
  counter.id = 'compatibleOverlayCounter';
  counter.style.fontSize = '48px';

  overlay.appendChild(title);
  overlay.appendChild(counter);
  document.body.appendChild(overlay);

  return overlay;
}

// ✅ إصلاح دالة عرض الشاشة السوداء الاحتياطية
function showCompatibleOverlay(title, counterText) {
  var overlay = $('#compatibleOverlay');
  if (!overlay) {
    overlay = createCompatibleOverlay();
  }

  var titleEl = $('#compatibleOverlayTitle');
  var counterEl = $('#compatibleOverlayCounter');

  if (titleEl) titleEl.innerText = title;
  if (counterEl) counterEl.innerText = counterText;

  overlay.style.display = 'block';

  // إخفاء العناصر الأخرى أثناء العرض
  try {
    var marq = $('marq');
    if (marq) marq.style.display = 'none';
  } catch (e) { }
}

// ✅ إصلاح دالة إخفاء الشاشة السوداء الاحتياطية
function hideCompatibleOverlay() {
  try {
    var overlay = $('#compatibleOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    var marq = $('marq');
    if (marq) {
      marq.style.display = 'block';
    }
  } catch (e) {
    console.log("Error hiding overlay:", e);
  }
}



// دالة حفظ إعدادات الصوت
function saveAudioSettings() {
  try {
    var audioSettings = {
      isAdhanMuted: isAdhanMuted
    };
    localStorage.setItem('MW_AUDIO_SETTINGS', JSON.stringify(audioSettings));
  } catch (e) { }
}

// دالة تحميل إعدادات الصوت
function loadAudioSettings() {
  try {
    var s = localStorage.getItem('MW_AUDIO_SETTINGS');
    if (s) {
      var audioSettings = JSON.parse(s);
      isAdhanMuted = audioSettings.isAdhanMuted;

      // تحديث حالة الزر
      var muteBtn = $('muteAdhanBtn');
      if (muteBtn) {
        if (isAdhanMuted) {
          muteBtn.innerHTML = '🔇صوت الأذان مكتوم ';
          muteBtn.classList.add('muted');
        } else {
          muteBtn.innerHTML = '🔊صوت الأذان مفعل';
          muteBtn.classList.remove('muted');
        }

      }
    }
  } catch (e) { }
}
///////////////////////////////////////////
////دالة الاذكار بعد الصلاة /////////
// ◀️ دالة عرض صورة الأذكار

function showAthkarImage(optionalStartTime) {
  console.log("🕌 عرض صورة الأذكار بعد الصلاة");
  if (athkarTimeout) clearTimeout(athkarTimeout);
  hideMainDisplay(true);
  var ticker = document.getElementById('ticker');
  if (ticker) ticker.style.display = 'none';
  closeSideMenu();

  var imgOverlay = document.createElement('div');
  imgOverlay.id = 'athkarOverlay';
  imgOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000000;z-index:10000;display:flex;align-items:center;justify-content:center;';
  var img = document.createElement('img');
  img.src = 'image/athkar.jpg';
  img.style.cssText = 'width:100vw;height:100vh;object-fit:contain;z-index:10001;';
  img.alt = 'أذكار بعد الصلاة';
  imgOverlay.appendChild(img);
  document.body.appendChild(imgOverlay);

  var now = new Date();
  var defaultStart = (function () {
    var adhanDate = hhmmToToday(TODAY_ADHAN_TIMES[currentPrayerIndex]);
    var iqamaDate = new Date(adhanDate.getTime() + getIqamaMinutes(currentPrayerIndex) * 60000);
    var prayerEnd = new Date(iqamaDate.getTime() + (SETTINGS.prayNowMinutes || 10) * 60000);
    return new Date(prayerEnd.getTime() + (SETTINGS.athkarDelay || 0) * 60000);
  })();
  var startTime = optionalStartTime || defaultStart;
  var elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  if (elapsed < 0) elapsed = 0;
  var totalDuration = (SETTINGS.athkarDuration || 10) * 60;
  var remaining = Math.max(0, totalDuration - elapsed);

  athkarTimeout = setTimeout(function () {
    hideAthkarImage();
  }, remaining * 1000);
}

// دالة إخفاء صورة الأذكار
function hideAthkarImage() {
  var overlay = document.getElementById('athkarOverlay');
  if (overlay) {
    document.body.removeChild(overlay);
  }

  if (athkarTimeout) {
    clearTimeout(athkarTimeout);
    athkarTimeout = null;
  }

  // إعادة العرض الرئيسي
  hideMainDisplay(false);

  // إعادة إظهار الشريط المتحرك
  var ticker = document.getElementById('ticker');
  if (ticker) ticker.style.display = 'block';
}


// ◀️ دالة إخفاء/إظهار العناصر الرئيسية
function hideMainDisplay(hide) {
  var elements = ['container', 'ticker', 'mosqueDisplay', 'clock', 'datesRow'];
  for (var i = 0; i < elements.length; i++) {
    var el = document.getElementById(elements[i]);
    if (el) {
      if (hide) {
        el.style.display = 'none';
      } else {
        // نعيد إظهار العناصر حسب حالتها الأصلية
        if (elements[i] === 'ticker') {
          el.style.display = 'block';
        } else {
          el.style.display = 'block';
        }
      }
    }
  }

  // ✅ إضافة هذا الجزء: تحديث اسم المسجد بعد إعادة الإظهار
  if (!hide) {
    updateMosqueName();
  }

  // إخفاء القائمة الجانبية لو كانت مفتوحة
  if (hide) closeSideMenu();
}

// ◀️ دالة بدء العد لعرض الأذكار
function startAthkarCountdown() {
  if (SETTINGS.athkarEnabled !== 'on') return;
  if (athkarTimeout) clearTimeout(athkarTimeout); // ✅ مسح أي مؤقت سابق
  var delay = (SETTINGS.athkarDelay || 0) * 60000;
  athkarTimeout = setTimeout(function () {
    showAthkarImage();
    var athkarDuration = (SETTINGS.athkarDuration || 10) * 60000; // ✅ استخدام مؤقت منفصل لإخفاء الأذكار ثم التحقق من التذكير
    setTimeout(function () {
      hideAthkarImage();// إخفاء الأذكار قبل التحقق من التذكير (إذا لم تخف تلقائياً)
      checkFastingReminder();
    }, athkarDuration);
  }, delay);
}
////////////////////////////////////////////////////////////
// ◀️ دالة التحقق من التذكير بالصيام (معدلة لتتخطى شهر رمضان)
function checkFastingReminder() {
  if (SETTINGS.fastingReminderEnabled !== 'on') return;

  // ✅ إلغاء أي مؤقت سابق للتذكير
  if (fastingReminderTimeout) clearTimeout(fastingReminderTimeout);

  var hijriDate = getCurrentHijriDateWithOffset();
  if (hijriDate && hijriDate.month === 9) {
    console.log("🌙 رمضان: تعطيل التذكير");
    return;
  }

  // حساب الصلاة الحالية بناءً على الوقت الحقيقي
  var now = new Date();
  var prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  var currentPrayer = null;

  if (TIMES_OBJ) {
    var mm = pad2(now.getMonth() + 1);
    var dd = pad2(now.getDate());
    var key = mm + '-' + dd;
    var line = TIMES_OBJ[key];
    if (line) {
      var parts = getAdjustedPrayerTimes(line);
      var dstMode = getDSTMode();
      for (var i = 0; i < parts.length; i++) {
        if (i === 1) continue; // تخطي الشروق
        var t = adjustTimeForDST(parts[i], dstMode);
        if (!t || t === '--:--') continue;
        var prayerTime = hhmmToToday(t);
        var endTime = new Date(prayerTime.getTime() + (getIqamaMinutes(i) * 60000) + (SETTINGS.prayNowMinutes * 60000));
        if (now >= prayerTime && now <= endTime) {
          currentPrayer = prayerNames[i];
          break;
        }
      }
    }
  }

  if (!currentPrayer || !SETTINGS.fastingReminderPrayers[currentPrayer]) {
    return; // لا تذكير في هذه الصلاة
  }

  var reminderType = getFastingReminderType(hijriDate);
  if (reminderType) {
    var delayAfterAthkar = (SETTINGS.fastingReminderDelay || 5) * 60000;
    var athkarDuration = (SETTINGS.athkarDuration || 10) * 60000;
    fastingReminderTimeout = setTimeout(function () {
      showFastingReminderImage(reminderType);
    }, athkarDuration + delayAfterAthkar);
  }
}
/////////////////////////////////////////////////////////////////////

// ◀️ دالة للحصول على التاريخ الهجري الحالي مع التعديل
function getCurrentHijriDateWithOffset() {
  var date = new Date();
  var hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  var hijriString = hijriFormatter.format(date);
  var parts = hijriString.split('/');

  // تطبيق الإزاحة إذا كانت موجودة
  var offset = SETTINGS.hijriOffset || 0;
  var day = parseInt(parts[0]) + offset;

  // تصحيح اليوم إذا كان خارج النطاق (1-30)
  if (day < 1) day = 1;
  if (day > 30) day = 30;

  return {
    day: day,
    month: parseInt(parts[1]),
    year: parseInt(parts[2])
  };
}

// ◀️ دالة لتحديد نوع التذكير
function getFastingReminderType(hijriDate) {
  var day = hijriDate.day;
  var month = hijriDate.month;
  var weekday = new Date().getDay(); // 0=الأحد, 1=الإثنين, ..., 6=السبت

  // التحقق من يوم 13 ذو الحجة (لا صيام)
  if (month === 12 && day === 13) {
    return null;
  }

  // التحقق من الأيام البيض (12, 13, 14)
  if (day >= 12 && day <= 14) {
    return 'whiteDays'; // الأيام البيض
  }

  // التحقق من تذكير الإثنين (يوم الأحد)
  if (weekday === 0) { // الأحد
    return 'monday';
  }

  // التحقق من تذكير الخميس (يوم الأربعاء)
  if (weekday === 3) { // الأربعاء
    return 'thursday';
  }

  return null;
}

// ◀️ دالة عرض صورة التذكير بالصيام
function showFastingReminderImage(type, optionalStartTime) {
  if (SETTINGS.fastingReminderEnabled !== 'on') return;
  if (fastingReminderTimeout) clearTimeout(fastingReminderTimeout);
  hideMainDisplay(true);
  var ticker = document.getElementById('ticker');
  if (ticker) ticker.style.display = 'none';
  closeSideMenu();
  var imgOverlay = document.createElement('div');
  imgOverlay.id = 'fastingOverlay';
  imgOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000000;z-index:10000;display:flex;align-items:center;justify-content:center;';
  var img = document.createElement('img');
  if (type === 'whiteDays') img.src = fastingImages.whiteDays;
  else if (type === 'monday') img.src = fastingImages.monday;
  else if (type === 'thursday') img.src = fastingImages.thursday;
  img.style.cssText = 'width:100vw;height:100vh;object-fit:contain;z-index:10001;';
  img.alt = 'تذكير بالصيام';
  imgOverlay.appendChild(img);
  document.body.appendChild(imgOverlay);

  var now = new Date();
  var defaultStart = (function () {
    var adhanDate = hhmmToToday(TODAY_ADHAN_TIMES[currentPrayerIndex]);
    var iqamaDate = new Date(adhanDate.getTime() + getIqamaMinutes(currentPrayerIndex) * 60000);
    var prayerEnd = new Date(iqamaDate.getTime() + (SETTINGS.prayNowMinutes || 10) * 60000);
    var azkarStart = new Date(prayerEnd.getTime() + (SETTINGS.athkarDelay || 0) * 60000);
    var azkarEnd = new Date(azkarStart.getTime() + (SETTINGS.athkarDuration || 10) * 60000);
    return azkarEnd;
  })();
  var startTime = optionalStartTime || defaultStart;
  var elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  if (elapsed < 0) elapsed = 0;
  var totalDuration = (SETTINGS.fastingReminderDuration || 10) * 60;
  var remaining = Math.max(0, totalDuration - elapsed);

  fastingReminderTimeout = setTimeout(function () {
    hideFastingReminderImage();
  }, remaining * 1000);
}
// دالة إخفاء صورة التذكير بالصيام
function hideFastingReminderImage() {
  var overlay = document.getElementById('fastingOverlay');
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  if (fastingReminderTimeout) {
    clearTimeout(fastingReminderTimeout);
    fastingReminderTimeout = null;
  }
  hideMainDisplay(false);
  var ticker = document.getElementById('ticker');
  if (ticker) ticker.style.display = 'block';
}

// ◀️ دالة الكشف عن الدقة وتطبيق إعدادات خاصة
function detectScreenResolutionAndAdjust() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // تحديد إذا كانت الشاشة بدقة 1080x2340 تقريباً
  if ((width >= 1070 && width <= 1090 && height >= 2330 && height <= 2350) ||
    (height >= 1070 && height <= 1090 && width >= 2330 && width <= 2350)) {

    console.log("📱 شاشة بدقة 2340x1080 مكتشفة، تطبيق إعدادات خاصة...");

    // إضافة صنف خاص للـ body
    document.body.classList.add('tall-screen-2340x1080');

    // يمكنك إضافة تعديلات JavaScript إضافية هنا إذا لزم الأمر
    adjustLayoutForTallScreen();
  }
}

// ◀️ دالة ضبط التخطيط للشاشات الطويلة
function adjustLayoutForTallScreen() {
  // زيادة حجم الخطوط إذا لزم الأمر
  var clockElement = $('clock');
  if (clockElement) {
    // يمكنك تغيير حجم الساعة ديناميكياً
    clockElement.style.fontSize = '9vh';
  }

  // تحسين عرض صفوف الصلاة
  var prayerRows = document.querySelectorAll('.prRow');
  for (var i = 0; i < prayerRows.length; i++) {
    prayerRows[i].style.margin = '8px auto';
    prayerRows[i].style.padding = '18px 0';
  }
}

// ◀️ استدعاء الدالة عند التحميل وعند تغيير حجم النافذة
window.addEventListener('load', function () {
  detectScreenResolutionAndAdjust();

  // تحديث عند تغيير حجم النافذة
  window.addEventListener('resize', detectScreenResolutionAndAdjust);
});

////////////////////////////////////////////////////////////////////////
////////////////// reset function //////////////////////////////////////
// ✅ دالة إعادة ضبط جميع الإعدادات إلى القيم الافتراضية
function resetToDefaultSettings() {
  // تأكيد العملية (استخدم confirm البسيط المتوافق مع KitKat)
  if (!confirm('سيتم إعادة جميع الإعدادات إلى القيم الافتراضية. هل تريد المتابعة؟')) {
    return;
  }

  // 1. حذف بيانات التخزين المحلي
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem('MW_AUDIO_SETTINGS');
  localStorage.removeItem('MW_BACKGROUND_IMAGE');

  // 2. إعادة تعيين الكائن العام إلى القيم الافتراضية
  SETTINGS = {
    country: 'EG', province: 'CAIRO2', dst: 'auto',
    iqamaMinutes: { fajr: 10, dhuhr: 10, asr: 10, maghrib: 5, isha: 10 },
    prayerOffsets: { fajr: 0, shurooq: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    prayNowMinutes: 10, energySaving: 'off', mosqueName: 'اسم المسجد هنا',
    hijriOffset: 0,
    athkarEnabled: 'on',
    athkarDelay: 0,
    athkarDuration: 10,
    fastingReminderEnabled: 'off',
    fastingReminderDelay: 5,
    fastingReminderDuration: 10,
    fastingReminderPrayers: {
      fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true
    },
    fridaySermonEnabled: 'off',
    fridaySermonDuration: 20,
    backgroundImage: 'v-2.jpg',
    isAdhanMuted: false
  };

  // 3. إعادة المتغيرات العامة
  isAdhanMuted = false;

  // 4. تحديث واجهة المستخدم (القيم في الحقول) لتطابق القيم الافتراضية
  // (يمكنك تحديث الحقول مباشرة أو عمل ريلود بسيط)
  if (typeof setStatus === 'function') setStatus('تمت إعادة الضبط... جاري إعادة التحميل');

  // 5. إعادة تحميل الصفحة بعد لحظة لتطبيق القيم الافتراضية بالكامل
  setTimeout(function () {
    location.reload();
  }, 500);
}
////////////////////////////////////////////////////////////////////////

function init() {
  if (isInit) return;
  isInit = true;

  // 1. ربط زر القائمة الرئيسي
  var sideMenu = $('sideMenu');
  var menuBtn = $('menuBtn');
  if (menuBtn && sideMenu) {
    menuBtn.onclick = function () {
      toggleSideMenu();
    };
  }

  // 2. ربط التغييرات التلقائية للحقول الأساسية
  $('countrySelect').onchange = function () { SETTINGS.country = this.value; saveSettings(); loadProvinces(this.value); };
  $('provinceSelect').onchange = function () { SETTINGS.province = this.value; saveSettings(); loadTimesFor(this.value); };
  $('dstSelect').onchange = function () { saveSettings(); renderTimes(); };
  $('mosqueName').onchange = function () { saveSettings(); };
  $('energySelect').onchange = function () { saveSettings(); };

  startSystemMaintenance();


  // 4. ربط أزرار القوائم المنسدلة
  if ($('iqamaToggle')) $('iqamaToggle').onclick = function () { toggleSubMenu('iqamaSubMenu'); };
  if ($('athkarToggle')) $('athkarToggle').onclick = function () { toggleSubMenu('athkarSubMenu'); };
  if ($('fastingReminderToggle')) $('fastingReminderToggle').onclick = function () { toggleSubMenu('fastingReminderSubMenu'); };
  if ($('backgroundToggle')) $('backgroundToggle').onclick = function () { toggleSubMenu('backgroundSubMenu'); };
  if ($('prayerOffsetToggle')) $('prayerOffsetToggle').onclick = function () { toggleSubMenu('prayerOffsetSubMenu'); };
  if ($('announcementToggle')) $('announcementToggle').onclick = function () { toggleSubMenu('announcementSubMenu'); };
  if ($('saveAnnouncementBtn')) $('saveAnnouncementBtn').onclick = saveAnnouncementFromForm;
  if ($('announcementType')) $('announcementType').onchange = updateAnnouncementMediaFieldVisibility;
  var announcementDurations = document.getElementsByClassName('announcement-duration-btn');
  for (var ad = 0; ad < announcementDurations.length; ad++) {
    announcementDurations[ad].onclick = function () {
      for (var x = 0; x < announcementDurations.length; x++) {
        announcementDurations[x].className = announcementDurations[x].className.replace(' active', '');
      }
      this.className += ' active';
    };
  }


  // 5. تحميل الإعدادات والبيانات
  loadSettings();
  checkRemoteUpdate(); // هنا يتم استدعاء التحميل من الموبايل 
  updateMosqueName();
  loadManifest(function () { populateCountries(); });
  loadAudioSettings();
  renderAnnouncementAdmin();
  updateAnnouncementMediaFieldVisibility();

  // حساب حالة DST الفعلية المطبقة على الساعة (لا تُستخدم في وضع auto)
  var currentDst = false;
  var displayMode = SETTINGS.timeDisplayMode || 'manual';
  if (displayMode === 'manual') {
    var mode = getDSTMode();
    currentDst = (mode === 'on') || (mode === 'auto' && isDSTActiveForDate(new Date()));
  }
  lastDstActive = currentDst;

  // 6. تنظيف الـ Intervals المتراكمة لمنع التهنيج في كيت كات
  if (typeof iqamaCountdownInterval !== 'undefined' && iqamaCountdownInterval) clearInterval(iqamaCountdownInterval);
  if (typeof adhanPlayingInterval !== 'undefined' && adhanPlayingInterval) clearInterval(adhanPlayingInterval);

  iqamaCountdownInterval = null;
  adhanPlayingInterval = null;
  totalIqamaSeconds = 0;
  elapsedAdhanSeconds = 0;

  // 7. ربط زر كتم الأذان
  if ($('muteAdhanBtn')) $('muteAdhanBtn').onclick = toggleMute;

  
  // إخفاء زر التوقيت الصيفي القديم لو وجد
  try { if ($('dstToggle')) $('dstToggle').style.display = 'none'; } catch (e) { }

  cleanupClockAnimations();

  // 8. تحميل الملفات الصوتية مسبقاً (تحسين للأداء)
  setTimeout(function () {
    try {
      var adhanAudio = document.getElementById('adhanAudio');
      var iqamaAudio = document.getElementById('iqamaAudio');
      if (adhanAudio) adhanAudio.load();
      if (iqamaAudio) iqamaAudio.load();
      bellAudio = new Audio('audio/bell.mp3');
      bellAudio.load();
      console.log("✅ تم تحميل الملفات الصوتية بنجاح");
    } catch (e) {
      console.log("تحذير: مشكلة في تحميل الملفات الصوتية");
    }
  }, 2000);

  // 9. تشغيل عدادات الوقت (التحديث المستمر)
  clockInterval = setInterval(updateClockUI, 1000);
  setInterval(function () { updateDatesAndPrayers(new Date()); }, 1000);

  // 10. تطبيق الخلفية وتهيئة الشاشة
  applyBackground();
  setTimeout(detectScreenResolutionAndAdjust, 1000);
  setTimeout(fixMarqueeUniversal, 2000);

  updateClockUI();
  announcementCheckInterval = setInterval(updateAnnouncementStateAndSchedule, 1500);

  // 11. إجراءات خاصة بأندرويد كيت كات (منع الزووم وتثبيت الخطوط)
  setTimeout(function () {
    if (typeof preventZoomOnFocus === 'function') preventZoomOnFocus();
  }, 1000);

  // ربط زر إعادة الضبط
  var resetBtn = $('resetToDefaultBtn');
  if (resetBtn) {
    resetBtn.onclick = resetToDefaultSettings;
  }


  // دالة داخلية لإصلاح شريط الأخبار
  function fixMarqueeUniversal() {
    var ticker = document.getElementById('ticker');
    if (ticker) {
      ticker.style.display = 'none';
      ticker.offsetHeight;
      ticker.style.display = 'block';
    }
    console.log("Marquee Fixed");
  }

  // تنظيف عند إغلاق الصفحة
  window.onbeforeunload = function () {
    if (clockInterval) clearInterval(clockInterval);
    if (typeof countdownInterval !== 'undefined') clearInterval(countdownInterval);
  };
}

// 3. الدالة الذكية للتحكم في القوائم المنسدلة (تفتح واحدة وتقفل الباقي)
// ✅ الدالة دي لازم تكون بره الـ init عشان الزراير تشوفها
// ✅ الكود الجديد - يفتح ويغلق بشكل صحيح
function toggleSubMenu(targetId) {
  var menus = [
    'iqamaSubMenu',
    'athkarSubMenu',
    'fastingReminderSubMenu',
    'backgroundSubMenu',
    'prayerOffsetSubMenu',
    'fridaySermonSubmenu',
    'announcementSubMenu'   // أضفنا هذا السطر لضمان تضمين قائمة الإعلانات
  ];

  var target = document.getElementById(targetId);
  if (!target) return;

  // هل القائمة ظاهرة حالياً؟
  var isOpen = (target.style.display === 'block');

  // الخطوة 1: إخفاء جميع القوائم الأخرى
  for (var i = 0; i < menus.length; i++) {
    var m = document.getElementById(menus[i]);
    if (m) m.style.display = 'none';
  }

  // الخطوة 2: إذا كانت القائمة المستهدفة مخفية، نظهرها.
  // أما إذا كانت ظاهرة، نتركها مخفية (لأننا أخفيناها في الخطوة 1).
  if (!isOpen) {
    target.style.display = 'block';
  }
}

function getSideMenuElement() {
  return $('sideMenu');
}

function openSideMenu() {
  var sideMenu = getSideMenuElement();
  if (!sideMenu || sideMenu.classList.contains('active')) return;
  sideMenu.classList.add('active');
  menuOpen = true;
  cleanupClockAnimations();
}

function closeSideMenu() {
  var sideMenu = getSideMenuElement();
  if (!sideMenu || !sideMenu.classList.contains('active')) return;
  sideMenu.classList.remove('active');
  menuOpen = false;
}

function toggleSideMenu() {
  var sideMenu = getSideMenuElement();
  if (!sideMenu) return;
  if (sideMenu.classList.contains('active')) {
    closeSideMenu();
  } else {
    openSideMenu();
  }
}

// تشغيل الدالة أخيراً
init();

// وظيفة إعادة تشغيل التطبيق يومياً الساعة 2 فجراً لتفريغ الذاكرة (Memory Leak Protection)

/////////////////////////////////////////////////


// دالة مساعدة لتحديث مظهر الزر الجانبي (لو عندك زر كتم في القائمة)
function updateSideMuteBtnAppearance(btn) {
  if (isAdhanMuted) {
    btn.innerHTML = '🔇 صوت الاذان مكتوم (جرس)';
    btn.classList.add('muted');
  } else {
    btn.innerHTML = '🔊 صوت الاذان مفعل';
    btn.classList.remove('muted');
  }
}


/////////////////////////////////////////////
function debugAudioSystem() {
  console.log("--- 🕵️ تقرير فحص نظام الصوت ---");

  // 1. فحص المتغير العالمي
  console.log("قيمة المتغير isAdhanMuted الحالية:", isAdhanMuted);

  // 2. فحص وجود عنصر الصورة في الـ HTML
  var icon = document.getElementById('headerAudioIcon');
  if (icon) {
    console.log("✅ عنصر الصورة موجود في الـ HTML");
    console.log("المسار الحالي للصورة (src):", icon.src);
  } else {
    console.error("❌ عطل: لم يتم العثور على عنصر ID اسمه 'headerAudioIcon' في الـ HTML");
  }

  // 3. فحص ملفات الصور في المجلد
  var testImgOn = new Image();
  testImgOn.src = 'image/horn_on.png';
  testImgOn.onerror = function () { console.error("❌ خطأ: ملف 'image/horn_on.png' غير موجود أو المسار غلط"); };
  testImgOn.onload = function () { console.log("✅ ملف 'image/horn_on.png' جاهز وشغال"); };

  var testImgOff = new Image();
  testImgOff.src = 'image/horn_off.png';
  testImgOff.onerror = function () { console.error("❌ خطأ: ملف 'image/horn_off.png' غير موجود أو المسار غلط"); };
  testImgOff.onload = function () { console.log("✅ ملف 'image/horn_off.png' جاهز وشغال"); };

  // 4. فحص الزرار
  var btn = document.getElementById('menuBtn');
  if (btn) {
    console.log("✅ زرار القائمة 'menuBtn' موجود");
    console.log("الوظيفة المربوطة بالزر (onclick):", btn.onclick);
  } else {
    console.error("❌ عطل: لم يتم العثور على زرار ID اسمه 'menuBtn'");
  }
}

// --- تشغيل التجهيزات عند فتح الصفحة ---
preventZoomOnFocus();

loadManifest(function () {
  populateCountries();
  loadSettings();

  // 🔥 التعديل الجوهري: استنى ثانية عشان الـ HTML يلحق يظهر
  setTimeout(function () {
    console.log("🛠️ جاري تحديث أيقونة الهيدر...");
    updateHeaderAudioIcon();
  }, 1000);
});

// تشغيل الفحص بعد تحميل الصفحة بـ 3 ثواني
setTimeout(debugAudioSystem, 3000);
// نداء الدوال عند تحميل الصفحة لأول مرة
loadSettings();
updateHeaderAudioIcon();

////////////////////////////////////////////////////////////
//////////////// دالة التحكم في الاعدادات من الموبايل ///////////////////
///////////////////////////////////////////////////////////
var lastRemoteUpdate = 0;

function checkRemoteUpdate() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://192.168.43.1:8080/remote_settings.json?t=" + new Date().getTime(), true);
  xhr.timeout = 2000;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        var remote = JSON.parse(xhr.responseText);
        if (remote.lastUpdate > lastRemoteUpdate) {
          lastRemoteUpdate = remote.lastUpdate;

          // 1. تحديث الخانات في القائمة الجانبية أولاً (لتجنب مسحها عند استدعاء saveSettings)
          if (remote.mosqueName !== undefined && $('mosqueName')) $('mosqueName').value = remote.mosqueName;
          if (remote.province && $('provinceSelect')) $('provinceSelect').value = remote.province;
          if (remote.dst && $('dstSelect')) $('dstSelect').value = remote.dst;
          if (remote.hijriOffset !== undefined && $('hijriOffset')) $('hijriOffset').value = remote.hijriOffset;

          if (remote.iqamaMinutes) {
            if ($('iqama_fajr')) $('iqama_fajr').value = remote.iqamaMinutes.fajr;
            if ($('iqama_dhuhr')) $('iqama_dhuhr').value = remote.iqamaMinutes.dhuhr;
            if ($('iqama_asr')) $('iqama_asr').value = remote.iqamaMinutes.asr;
            if ($('iqama_maghrib')) $('iqama_maghrib').value = remote.iqamaMinutes.maghrib;
            if ($('iqama_isha')) $('iqama_isha').value = remote.iqamaMinutes.isha;
          }

          if (remote.athkarEnabled && $('athkarEnabled')) $('athkarEnabled').value = remote.athkarEnabled;
          if (remote.athkarDuration && $('athkarDuration')) $('athkarDuration').value = remote.athkarDuration;

          // 2. ضبط إعدادات الجمعة لتتطابق مع منطق الساعة الخاص بك
          if (remote.fridaySettings) {
            if ($('fridaySermonEnabled')) $('fridaySermonEnabled').value = remote.fridaySettings.messageEnabled;
            if ($('fridaySermonDuration')) $('fridaySermonDuration').value = remote.fridaySettings.duration;
          }

          // 3. تطبيق وضع كتم الأذان
          if (remote.isMuted !== undefined) {
            isAdhanMuted = remote.isMuted;
            var btn = $('muteAdhanBtn');
            if (btn) {
              btn.innerHTML = isAdhanMuted ? "وضع الكتم: مشغل (جرس) 🔔" : "وضع الكتم: معطل (أذان) 🔊";
              btn.style.backgroundColor = isAdhanMuted ? "#840101" : "#2e7d32";
            }
            updateHeaderAudioIcon();
            // حفظ إعداد الصوت الخاص
            localStorage.setItem('MW_AUDIO_SETTINGS', JSON.stringify({ isAdhanMuted: isAdhanMuted }));
          }
          // أضف هذا السطر داخل دالة checkRemoteUpdate مع بقية الإعدادات
          if (remote.bgIndex) {
            // تحديث الخلفية في الإعدادات
            SETTINGS.bgIndex = remote.bgIndex;
            // تطبيق التغيير فوراً على جسم الصفحة (Body)
            document.body.style.backgroundImage = "url('image/" + remote.bgIndex + ".jpg')";
            // حفظ التفضيل في المتصفح
            localStorage.setItem('SELECTED_BG_INDEX', remote.bgIndex);
          }
          // 4. استدعاء الحفظ (والذي سيقوم بعمل إعادة تحميل Reload لتطبيق الإعدادات فوراً)
          saveSettings();
          console.log("✅ تم استلام تحديث الريموت وتطبيقه بنجاح");
        }
      } catch (e) { console.log("JSON لم يجهز بعد أو خطأ في القراءة"); }
    }
  };
  xhr.send();
}

// تشغيل الفحص كل 10 ثوانٍ
//setInterval(checkRemoteUpdate, 10000);
///////////////////////////////////////////////////////////////
// ========== نظام التحديث عبر AppCache ==========
// تمت إزالة أي كود قديم متعلق بـ checkForUpdates
if ($('updateBtn')) {
    $('updateBtn').onclick = function() {
        if (!navigator.onLine) {
            alert('يرجى توصيل نقطة اتصال الموبايل أولاً.');
            return;
        }
        setStatus('جاري التحقق من التحديث...');
        try {
            window.applicationCache.update();
        } catch(e) {
            setStatus('المتصفح لا يدعم التحديث التلقائي');
        }
    };
}

window.applicationCache.addEventListener('updateready', function() {
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        alert('تم تحميل النسخة الجديدة، سيتم إعادة التشغيل.');
        window.location.reload();
    }
});

window.applicationCache.addEventListener('noupdate', function() {
    setStatus('نسختك هي الأحدث');
});

window.applicationCache.addEventListener('error', function() {
    setStatus('فشل التحديث، تأكد من الاتصال');
});
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////