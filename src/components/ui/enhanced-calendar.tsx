import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import { setMonth, setYear } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type EnhancedCalendarProps = Omit<React.ComponentProps<typeof DayPicker>, 'mode'> & {
  mode?: 'single';
  selected?: Date;
  onSelect?: SelectSingleEventHandler;
  onManualDateChange?: (date: Date | undefined) => void;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  onManualDateChange,
  ...props
}: EnhancedCalendarProps) {
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    selected || new Date()
  );
  const [manualInput, setManualInput] = React.useState("");

  const handleMonthChange = (value: string) => {
    const newDate = setMonth(displayMonth, parseInt(value));
    setDisplayMonth(newDate);
  };

  const handleYearChange = (value: string) => {
    const newDate = setYear(displayMonth, parseInt(value));
    setDisplayMonth(newDate);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualInput(value);
    
    // Try to parse the date
    const datePattern = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
    const match = value.match(datePattern);
    
    if (match) {
      const [, day, month, year] = match;
      const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (!isNaN(parsedDate.getTime())) {
        onManualDateChange?.(parsedDate);
        if (onSelect) {
          onSelect(parsedDate, parsedDate, {}, { nativeEvent: {} as MouseEvent } as React.MouseEvent);
        }
        setDisplayMonth(parsedDate);
      }
    }
  };

  return (
    <div className="w-[280px]">
      {/* Manual date input */}
      <div className="px-3 pt-3 pb-2">
        <Input
          placeholder="DD/MM/YYYY"
          value={manualInput}
          onChange={handleManualInputChange}
          className="h-8 text-sm"
        />
      </div>

      {/* Month/Year selectors */}
      <div className="flex gap-2 px-3 pb-2">
        <Select value={displayMonth.getMonth().toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="h-8 flex-1 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-[9999]">
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="h-8 w-20 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-[9999]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DayPicker
        mode="single"
        showOutsideDays={showOutsideDays}
        month={displayMonth}
        onMonthChange={setDisplayMonth}
        selected={selected}
        onSelect={onSelect}
        className={cn("p-3 pointer-events-auto", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center hidden",
          caption_label: "text-sm font-medium hidden",
          nav: "space-x-1 flex items-center hidden",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hidden",
          ),
          nav_button_previous: "absolute left-1 hidden",
          nav_button_next: "absolute right-1 hidden",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  );
}
EnhancedCalendar.displayName = "EnhancedCalendar";

export { EnhancedCalendar };
