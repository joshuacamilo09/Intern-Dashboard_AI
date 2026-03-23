import { Calendar } from "lucide-react";

interface DateRangePickerProps {
  onRangeChange: (days: number) => void;
  selectedRange: number;
}

export const DateRangePicker = ({
  onRangeChange,
  selectedRange,
}: DateRangePickerProps) => {
  const ranges = [
    { label: "Today", value: 1 },
    { label: "7 Days", value: 7 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
    { label: "1 Year", value: 365 },
  ];

  return (
    <div className="flex items-center bg-[#1C1C26] border border-white/5 rounded-xl overflow-hidden">
      {/* Ícone de Calendário */}
      <div className="px-3 py-2 border-r border-white/5 flex items-center justify-center">
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>

      {/* Botões de Período */}
      <div className="flex items-center gap-1 p-1">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => {
              console.log(
                `📅 Selected period: ${range.label} (${range.value} days)`
              );
              onRangeChange(range.value);
            }}
            className={`
              px-3 py-1.5 text-xs font-semibold rounded-lg 
              transition-all duration-200
              ${
                selectedRange === range.value
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangePicker;
