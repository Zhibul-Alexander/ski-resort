/**
 * Простое извлечение опций экипировки из данных pricing
 */
export interface RentalItemOption {
  id: string;
  label: string;
  category: "adults" | "kids" | "accessories";
  segments: ("economy" | "premium" | "n/a")[];
  hasSegments: boolean;
}

export function extractRentalItemOptions(pricing: {
  rental: {
    tables: {
      id: string;
      rows: { label: string; values: string[] }[];
    }[];
  };
}): RentalItemOption[] {
  const options: RentalItemOption[] = [];
  
  // Маппинг индексов строк на типы (порядок одинаковый во всех языках)
  const adultMapping: Array<{ id: string; hasSegments: boolean }> = [
    { id: "adult_ski_full", hasSegments: true },
    { id: "adult_snowboard_full", hasSegments: true },
    { id: "adult_skis", hasSegments: true },
    { id: "adult_snowboard", hasSegments: true },
    { id: "adult_ski_boots", hasSegments: false },
    { id: "adult_snowboard_boots", hasSegments: false },
    { id: "adult_poles", hasSegments: false }
  ];
  
  const accessoriesMapping: Array<{ id: string; hasSegments: boolean }> = [
    { id: "helmet", hasSegments: false },
    { id: "goggles", hasSegments: false },
    { id: "jacket", hasSegments: false },
    { id: "pants", hasSegments: false },
    { id: "gloves", hasSegments: false }
  ];
  
  for (const table of pricing.rental.tables) {
    if (table.id === "adults") {
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const mapping = adultMapping[i];
        if (!mapping) continue;
        
        const label = row.label;
        // Проверяем наличие "/" в ценах (values), что означает две цены: economy и premium
        const hasSegments = mapping.hasSegments && row.values.some(v => v.includes("/"));
        
        options.push({
          id: mapping.id,
          label,
          category: "adults",
          segments: hasSegments ? ["economy", "premium"] : ["n/a"],
          hasSegments: mapping.hasSegments && hasSegments
        });
      }
    } else if (table.id === "accessories") {
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const mapping = accessoriesMapping[i];
        if (!mapping) continue;
        
        const label = row.label;
        options.push({
          id: mapping.id,
          label,
          category: "accessories",
          segments: ["n/a"],
          hasSegments: false
        });
      }
    }
  }
  
  return options;
}
