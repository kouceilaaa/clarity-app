"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, Calendar, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { SimplificationMode } from "@/lib/types";
import type { DateRange } from "react-day-picker";

export interface HistoryFilters {
  search: string;
  mode: SimplificationMode | "all";
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  sortBy: "date" | "mode" | "favorite";
  sortOrder: "asc" | "desc";
}

interface HistorySearchProps {
  onFiltersChange: (filters: HistoryFilters) => void;
  totalCount?: number;
}

export function HistorySearch({
  onFiltersChange,
  totalCount,
}: HistorySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial values from URL
  const initialSearch = searchParams.get("q") ?? "";
  const initialMode =
    (searchParams.get("mode") as SimplificationMode | "all") ?? "all";
  const initialSortBy =
    (searchParams.get("sortBy") as "date" | "mode" | "favorite") ?? "date";
  const initialSortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc";
  const initialFrom = searchParams.get("from");
  const initialTo = searchParams.get("to");

  const [search, setSearch] = useState(initialSearch);
  const [mode, setMode] = useState<SimplificationMode | "all">(initialMode);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialFrom || initialTo
      ? {
          from: initialFrom ? new Date(initialFrom) : undefined,
          to: initialTo ? new Date(initialTo) : undefined,
        }
      : undefined
  );
  const [sortBy, setSortBy] = useState<"date" | "mode" | "favorite">(
    initialSortBy
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Update URL when filters change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (mode !== "all") params.set("mode", mode);
    if (sortBy !== "date") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (dateRange?.from)
      params.set("from", dateRange.from.toISOString().split("T")[0]);
    if (dateRange?.to)
      params.set("to", dateRange.to.toISOString().split("T")[0]);

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [pathname, router, search, mode, sortBy, sortOrder, dateRange]);

  // Debounced filter update
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const filters: HistoryFilters = {
        search,
        mode,
        sortBy,
        sortOrder,
        dateRange: dateRange
          ? { from: dateRange.from, to: dateRange.to }
          : undefined,
      };
      onFiltersChange(filters);
      updateUrl();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, mode, sortBy, sortOrder, dateRange, onFiltersChange, updateUrl]);

  const hasActiveFilters =
    mode !== "all" || dateRange || sortBy !== "date" || sortOrder !== "desc";

  const clearAllFilters = () => {
    setSearch("");
    setMode("all");
    setDateRange(undefined);
    setSortBy("date");
    setSortOrder("desc");
  };

  const clearFilter = (
    filterType: "search" | "mode" | "dateRange" | "sort"
  ) => {
    switch (filterType) {
      case "search":
        setSearch("");
        break;
      case "mode":
        setMode("all");
        break;
      case "dateRange":
        setDateRange(undefined);
        break;
      case "sort":
        setSortBy("date");
        setSortOrder("desc");
        break;
    }
  };

  const getModeLabel = (m: SimplificationMode | "all") => {
    switch (m) {
      case "simple":
        return "Simple";
      case "accessible":
        return "Accessible";
      case "summary":
        return "Résumé";
      default:
        return "Tous les modes";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher dans l'historique..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Mode filter */}
          <Select
            value={mode}
            onValueChange={(v) => setMode(v as SimplificationMode | "all")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les modes</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="accessible">Accessible</SelectItem>
              <SelectItem value="summary">Résumé</SelectItem>
            </SelectContent>
          </Select>

          {/* More filters button */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={hasActiveFilters ? "border-primary" : ""}
              >
                <Filter
                  className={`h-4 w-4 ${
                    hasActiveFilters ? "text-primary" : ""
                  }`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="font-medium">Filtres avancés</div>

                {/* Date range */}
                <div className="space-y-2">
                  <Label>Période</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "d MMM", { locale: fr })}{" "}
                              -{" "}
                              {format(dateRange.to, "d MMM yyyy", {
                                locale: fr,
                              })}
                            </>
                          ) : (
                            format(dateRange.from, "d MMM yyyy", { locale: fr })
                          )
                        ) : (
                          "Sélectionner une période"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        locale={fr}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Sort options */}
                <div className="space-y-2">
                  <Label>Trier par</Label>
                  <div className="flex gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(v) => setSortBy(v as typeof sortBy)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="mode">Mode</SelectItem>
                        <SelectItem value="favorite">Favoris</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      <ArrowUpDown
                        className={`h-4 w-4 ${
                          sortOrder === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Clear all button */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={clearAllFilters}
                  >
                    Effacer tous les filtres
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filters chips */}
      {(search ||
        mode !== "all" ||
        dateRange ||
        sortBy !== "date" ||
        sortOrder !== "desc") && (
        <div className="flex flex-wrap gap-2 items-center">
          {search && (
            <Badge variant="secondary" className="gap-1">
              Recherche: &quot;{search}&quot;
              <button
                onClick={() => clearFilter("search")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {mode !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Mode: {getModeLabel(mode)}
              <button
                onClick={() => clearFilter("mode")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {dateRange && (
            <Badge variant="secondary" className="gap-1">
              Période:{" "}
              {dateRange.from
                ? format(dateRange.from, "d MMM", { locale: fr })
                : ""}
              {dateRange.to
                ? ` - ${format(dateRange.to, "d MMM", { locale: fr })}`
                : ""}
              <button
                onClick={() => clearFilter("dateRange")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(sortBy !== "date" || sortOrder !== "desc") && (
            <Badge variant="secondary" className="gap-1">
              Tri:{" "}
              {sortBy === "date"
                ? "Date"
                : sortBy === "mode"
                ? "Mode"
                : "Favoris"}{" "}
              ({sortOrder === "asc" ? "↑" : "↓"})
              <button
                onClick={() => clearFilter("sort")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {totalCount !== undefined && (
            <span className="text-sm text-muted-foreground ml-auto">
              {totalCount} résultat{totalCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
