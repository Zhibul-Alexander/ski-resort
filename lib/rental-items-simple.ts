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
      rows: { label: string }[];
    }[];
  };
}): RentalItemOption[] {
  const options: RentalItemOption[] = [];
  
  // Маппинг индексов строк на типы (порядок одинаковый во всех языках)
  const adultMapping: Array<{ id: string; hasSegments: boolean }> = [
    { id: "adult_ski_full", hasSegments: true },
    { id: "adult_snowboard_full", hasSegments: true },
    { id: "adult_freeride_full", hasSegments: false },
    { id: "adult_freeride_skis", hasSegments: false },
    { id: "adult_skis_snowboard", hasSegments: true },
    { id: "adult_boots", hasSegments: false },
    { id: "adult_poles", hasSegments: false }
  ];
  
  const kidsMapping: Array<{ id: string; hasSegments: boolean }> = [
    { id: "kids_ski_full", hasSegments: false },
    { id: "kids_snowboard_full", hasSegments: false },
    { id: "kids_skis_snowboard", hasSegments: false },
    { id: "kids_boots", hasSegments: false },
    { id: "kids_poles", hasSegments: false }
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
        const hasSegments = mapping.hasSegments && (label.includes("Economy / Premium") || label.includes("— Economy / Premium"));
        const cleanLabel = label.replace(" — Economy / Premium", "").trim();
        
        options.push({
          id: mapping.id,
          label: cleanLabel,
          category: "adults",
          segments: hasSegments ? ["economy", "premium"] : ["n/a"],
          hasSegments: mapping.hasSegments && hasSegments
        });
      }
    } else if (table.id === "kids") {
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const mapping = kidsMapping[i];
        if (!mapping) continue;
        
        const label = row.label;
        options.push({
          id: mapping.id,
          label,
          category: "kids",
          segments: ["n/a"],
          hasSegments: false
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
