/**
 * Форматирует цену в формате "GEL" или "GEL1 / GEL2"
 * @param price - цена в GEL (может быть строкой с "/" для двух цен)
 * @param exchangeRate - не используется, оставлен для совместимости
 * @returns отформатированная строка "GEL" или "GEL1 / GEL2"
 */
export function formatPrice(price: string, exchangeRate: number = 2.7): string {
  if (!price || price.trim() === "" || price === "—") {
    return price;
  }

  // Обработка цен с "/" (например, "60 / 100")
  if (price.includes("/")) {
    const parts = price.split("/").map(p => p.trim());
    const formatted = parts.map(p => {
      if (p === "—") return "—";
      return `${p} GEL`;
    });
    return formatted.join(" / ");
  }

  // Обработка одной цены
  return `${price} GEL`;
}

