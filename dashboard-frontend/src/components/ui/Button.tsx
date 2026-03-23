export const Button = ({ children, loading, ...props }: any) => (
  <button
    {...props}
    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20"
  >
    {loading ? (
      <>
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-white rounded-full"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
        <span>Loading...</span>
      </>
    ) : (
      children
    )}
  </button>
);
