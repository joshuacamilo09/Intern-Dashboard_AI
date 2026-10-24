export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PAID: "bg-green-500/10 text-green-500 border-green-500/20",
    PENDING: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CANCELED: "bg-red-500/10 text-red-500 border-red-500/20",
    REFUNDED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.PENDING
      }`}
    >
      {status}
    </span>
  );
};
export default StatusBadge;
