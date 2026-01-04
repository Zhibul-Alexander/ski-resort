"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled = false
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Группируем опции
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, SelectOption[]> = {};
    options.forEach((opt) => {
      const group = opt.group || "";
      if (!groups[group]) groups[group] = [];
      groups[group].push(opt);
    });
    return groups;
  }, [options]);

  const selectedOption = options.find((opt) => opt.value === value);

  // Закрываем при клике вне компонента
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-card px-3 text-sm shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer hover:bg-secondary/60"
        )}
        suppressHydrationWarning
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[8rem] max-w-[calc(100vw-2rem)] left-0 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <div className="max-h-[300px] overflow-auto p-1">
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <div key={groupName || "default"}>
                {groupName && (
                  <div className="px-2 py-2 text-sm font-semibold text-muted-foreground break-words">
                    {groupName}
                  </div>
                )}
                {groupOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-start rounded-md px-2 py-1.5 text-sm",
                      "outline-none hover:bg-secondary focus:bg-secondary",
                      value === option.value && "bg-secondary font-medium"
                    )}
                  >
                    {value === option.value ? (
                      <>
                        <Check className="mr-2 h-4 w-4 shrink-0 mt-0.5" />
                        <span className="break-words text-left">{option.label}</span>
                      </>
                    ) : (
                      <span className="ml-6 break-words text-left">{option.label}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

