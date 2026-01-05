// Утилита для определения типа устройства
export function isMobileOrTablet(): boolean {
  if (typeof window === "undefined") return false;
  
  // Проверяем по user agent
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  
  // Регулярные выражения для определения мобильных устройств и планшетов
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  
  // Проверяем user agent
  if (mobileRegex.test(userAgent)) {
    return true;
  }
  
  // Дополнительная проверка для iPad на iOS 13+ (когда user agent не содержит "iPad")
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isIPad = isIOS && !('MSStream' in window) && (window.screen.width >= 768 || window.screen.height >= 1024);
  
  if (isIPad) {
    return true;
  }
  
  // Проверка по touch events (дополнительная проверка)
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 1024;
  
  // Если есть touch screen и маленький экран - вероятно мобильное устройство
  if (hasTouchScreen && isSmallScreen) {
    return true;
  }
  
  return false;
}

