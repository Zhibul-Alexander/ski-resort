"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { clearSlideInRegistry } from "@/components/ui/slide-in";

export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | undefined>(undefined);

  // Функция для прокрутки в самый верх страницы
  const scrollToTop = () => {
    // Используем несколько методов для гарантии прокрутки до самого верха
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Дополнительная проверка и прокрутка через requestAnimationFrame для надежности
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Еще одна проверка для случаев, когда первый кадр не успел
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    });
  };

  useEffect(() => {
    // Обработчик кликов на ссылки для обработки кликов на текущую страницу
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement | null;
      
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);
          
          // Нормализуем пути (убираем trailing slash)
          const linkPath = url.pathname.replace(/\/$/, '') || '/';
          const currentPath = currentUrl.pathname.replace(/\/$/, '') || '/';
          
          // Если клик на ссылку на текущую страницу (без hash)
          if (linkPath === currentPath && !url.hash) {
            // Небольшая задержка для того, чтобы Next.js обработал клик
            setTimeout(() => {
              scrollToTop();
            }, 0);
          }
        } catch (err) {
          // Игнорируем ошибки парсинга URL
        }
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  useEffect(() => {
    // Сохраняем предыдущий pathname для сравнения
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Если это первая загрузка (prevPathname еще не установлен), не делаем ничего
    if (prevPathname === undefined) {
      return;
    }

    // Очищаем реестр анимированных элементов при навигации
    // Это позволяет элементам анимироваться снова на новых страницах
    clearSlideInRegistry();

    // Не прокручиваем вверх, если в URL есть якорь (hash)
    // Позволяем браузеру обработать якорь для скролла к элементу
    // Используем setTimeout для проверки hash после того, как браузер обработает навигацию
    setTimeout(() => {
      if (window.location.hash) {
        return;
      }

      scrollToTop();
    }, 0);
  }, [pathname]);

  return null;
}
