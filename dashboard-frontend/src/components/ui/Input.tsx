// src/components/ui/Input.tsx
export const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full group">
    {label && (
      <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">
        {label}
      </label>
    )}
    <input
      {...props}
      className="bg-[#1C1C26] border border-[#2D2D3F] text-white rounded-xl px-4 py-3.5 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all placeholder:text-gray-600"
    />
  </div>
);
