import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  showSelectAll?: boolean;
  searchable?: boolean;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  label,
  showSelectAll = true,
  searchable = true,
  className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt => 
      opt.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const isAllSelected = selected.length === options.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemove = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(s => s !== option));
  };

  return (
    <div className={className}>
      {label && <label className="text-sm font-medium mb-1.5 block">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 px-3 py-2"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : selected.length <= 2 ? (
                selected.map(s => (
                  <Badge key={s} variant="secondary" className="mr-1">
                    {s}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={(e) => handleRemove(s, e)}
                    />
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">
                  {selected.length} selected
                </Badge>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[300px] p-0 bg-popover z-[9999]" align="start">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-auto p-2">
            {showSelectAll && (
              <div
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted",
                  isAllSelected && "bg-muted"
                )}
                onClick={handleSelectAll}
              >
                <Checkbox checked={isAllSelected} />
                <span className="font-medium">Select All</span>
              </div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted",
                  selected.includes(option) && "bg-muted/50"
                )}
                onClick={() => handleToggle(option)}
              >
                <Checkbox checked={selected.includes(option)} />
                <span className="text-sm">{option}</span>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No options found
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
