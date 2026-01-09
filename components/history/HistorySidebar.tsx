"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
} from "date-fns";
import {
  FileText,
  Search,
  X,
  Star,
  Clock,
  Filter,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui";
import type { SimplificationMode } from "@/lib/types";

export interface HistoryItemData {
  id: string;
  originalText: string;
  simplifiedText: string;
  mode: SimplificationMode;
  sourceUrl?: string;
  isFavorite: boolean;
  createdAt: string;
}

interface HistorySidebarProps {
  items: HistoryItemData[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isLoading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  modeFilter: SimplificationMode | "all";
  onModeFilterChange: (mode: SimplificationMode | "all") => void;
}

// Group items by date
function groupItemsByDate(items: HistoryItemData[]) {
  const groups: Record<string, HistoryItemData[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    "This Month": [],
    Earlier: [],
  };

  items.forEach((item) => {
    const date = new Date(item.createdAt);
    if (isToday(date)) {
      groups["Today"].push(item);
    } else if (isYesterday(date)) {
      groups["Yesterday"].push(item);
    } else if (isThisWeek(date)) {
      groups["This Week"].push(item);
    } else if (isThisMonth(date)) {
      groups["This Month"].push(item);
    } else {
      groups["Earlier"].push(item);
    }
  });

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([, items]) => items.length > 0)
  );
}

export function HistorySidebar({
  items,
  selectedId,
  onSelect,
  onDelete,
  onToggleFavorite,
  isLoading,
  searchQuery,
  onSearchChange,
  modeFilter,
  onModeFilterChange,
}: HistorySidebarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const groupedItems = groupItemsByDate(items);
  const flatItems = Object.values(groupedItems).flat();

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Find currently selected index
  useEffect(() => {
    if (selectedId) {
      const index = flatItems.findIndex((item) => item.id === selectedId);
      if (index !== -1) {
        setFocusedIndex(index);
      }
    }
  }, [selectedId, flatItems]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        onSearchChange("");
        return;
      }

      // Arrow key navigation when not in search input
      if (e.target === searchInputRef.current) return;

      if (flatItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          focusedIndex < flatItems.length - 1 ? focusedIndex + 1 : 0;
        setFocusedIndex(nextIndex);
        onSelect(flatItems[nextIndex].id);
        itemRefs.current.get(flatItems[nextIndex].id)?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          focusedIndex > 0 ? focusedIndex - 1 : flatItems.length - 1;
        setFocusedIndex(prevIndex);
        onSelect(flatItems[prevIndex].id);
        itemRefs.current.get(flatItems[prevIndex].id)?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocusedIndex(0);
        onSelect(flatItems[0].id);
        itemRefs.current.get(flatItems[0].id)?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const lastIndex = flatItems.length - 1;
        setFocusedIndex(lastIndex);
        onSelect(flatItems[lastIndex].id);
        itemRefs.current.get(flatItems[lastIndex].id)?.focus();
      }
    },
    [flatItems, focusedIndex, onSearchChange, onSelect]
  );

  const setItemRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  return (
    <div
      className="flex flex-col h-full bg-card/50 border-r border-border/50"
      onKeyDown={handleKeyDown}
      role="navigation"
      aria-label="Simplification history"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold">History</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? (
              <X className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search and Filter */}
        {showSearch && (
          <div className="space-y-2 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 h-9 text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select
              value={modeFilter}
              onValueChange={(v) =>
                onModeFilterChange(v as SimplificationMode | "all")
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="accessible">Accessible</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={FileText}
              title="No history yet"
              description="Your simplified texts will appear here"
              className="py-8"
            />
          </div>
        ) : (
          <div className="py-2">
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group} className="mb-2">
                <div className="px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {group}
                  </span>
                </div>
                <div
                  className="px-2"
                  role="listbox"
                  aria-label={`${group} items`}
                >
                  {groupItems.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      onSelect={onSelect}
                      onDelete={onDelete}
                      onToggleFavorite={onToggleFavorite}
                      ref={(el) => setItemRef(item.id, el)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Individual History Item Component
interface HistoryItemProps {
  item: HistoryItemData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

import { forwardRef } from "react";

const HistoryItem = forwardRef<HTMLDivElement, HistoryItemProps>(
  function HistoryItem(
    { item, isSelected, onSelect, onDelete, onToggleFavorite },
    ref
  ) {
    const [menuOpen, setMenuOpen] = useState(false);

    // Get preview text (first 60 chars)
    const previewText = item.originalText.substring(0, 60).trim();
    const hasMore = item.originalText.length > 60;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => onSelect(item.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(item.id);
          }
          if (e.key === "Delete" && onDelete) {
            e.preventDefault();
            onDelete(item.id);
          }
          if (e.key === "f" && onToggleFavorite) {
            e.preventDefault();
            onToggleFavorite(item.id);
          }
        }}
        className={cn(
          "group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all outline-none",
          "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          isSelected && "bg-accent"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Mode indicator dot */}
          <div
            className={cn(
              "w-2 h-2 rounded-full mt-2 shrink-0",
              item.mode === "simple" && "bg-green-500",
              item.mode === "accessible" && "bg-blue-500",
              item.mode === "summary" && "bg-purple-500"
            )}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium line-clamp-2 leading-snug">
                {previewText}
                {hasMore && "..."}
              </p>

              {/* Actions dropdown - show on hover/selected */}
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      (isSelected || menuOpen) && "opacity-100"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/shared/${item.id}`, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </DropdownMenuItem>
                  {onToggleFavorite && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 mr-2",
                          item.isFavorite && "fill-yellow-500 text-yellow-500"
                        )}
                      />
                      {item.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {item.isFavorite && (
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              )}
              {item.sourceUrl && (
                <Badge variant="outline" className="h-5 text-xs px-1.5">
                  URL
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
