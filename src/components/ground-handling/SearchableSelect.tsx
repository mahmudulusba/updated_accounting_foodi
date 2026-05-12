import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  required = false,
  className,
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt => 
      opt.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium mb-1.5 block">
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between h-10"
          >
            <span className={cn(!value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[250px] p-0 bg-popover z-[9999]" align="start">
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
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted text-sm",
                  value === option && "bg-muted"
                )}
                onClick={() => handleSelect(option)}
              >
                {value === option && <Check className="h-4 w-4" />}
                <span className={cn(value !== option && "ml-6")}>{option}</span>
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
