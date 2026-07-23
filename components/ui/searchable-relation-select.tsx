"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RelationOption {
  value: string; // the id / foreign-key value stored in the form
  label: string; // what the user sees in the dropdown
}

interface Props {
  /** All available options (pre-fetched by the parent). */
  options: RelationOption[];
  /** Controlled value — the currently selected option's `value`. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Empty-selection label shown inside the trigger when nothing is selected. */
  emptyLabel?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function SearchableRelationSelect({
  options,
  value,
  onChange,
  placeholder = "Buscar...",
  emptyLabel = "Seleccionar...",
  disabled = false,
  required = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = useCallback(
    (opt: RelationOption) => {
      onChange(opt.value);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
    if (e.key === "Enter" && filtered.length === 1) {
      e.preventDefault();
      handleSelect(filtered[0]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
    >
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-[var(--border)] rounded-lg text-sm text-left transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/20 focus:border-[var(--brand-teal)]",
          disabled && "opacity-60 cursor-not-allowed bg-[var(--muted)]",
          !disabled && "hover:border-[var(--brand-teal)] cursor-pointer",
          open && "border-[var(--brand-teal)] ring-2 ring-[var(--brand-teal)]/20",
        )}
      >
        <span
          className={cn(
            "truncate",
            selected
              ? "text-[var(--foreground)]"
              : "text-[var(--muted-foreground)]",
          )}
        >
          {selected ? selected.label : emptyLabel}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          {selected && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e as never)}
              className="p-0.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Limpiar selección"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-150",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {/* Hidden native select for form submission / required validation */}
      <select
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        value={value}
        onChange={() => {}}
        className="sr-only"
      >
        <option value="" />
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden"
          role="listbox"
        >
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
            <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 text-sm bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          {/* Options list */}
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-center text-[var(--muted-foreground)]">
                Sin resultados
              </li>
            )}
            {filtered.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(opt)}
                tabIndex={0}
                className={cn(
                  "px-3 py-2.5 text-sm cursor-pointer transition-colors",
                  opt.value === value
                    ? "bg-[var(--brand-teal-muted)] text-[var(--brand-teal)] font-semibold"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)]",
                )}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
