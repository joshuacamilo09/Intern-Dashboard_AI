import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, UserPlus, Package, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
// Troque o import do api pelo service
import {
  analyticsService,
  type ActivityData,
} from "../../services/analyticsService";

const ICON_MAP: any = {
  order: ShoppingBag,
  customer: UserPlus,
  product: Package,
  status: CheckCircle,
};

export const ActivityFeed = () => {
  // Use a interface para tipar o estado
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   const loadActivities = async () => {
     try {
       // Garante que o analyticsService.getRecentActivity aceite apenas o limite
       const data = await analyticsService.getRecentActivity(8);
       setActivities(data);
     } catch (err) {
       console.error(err);
     } finally {
       setLoading(false);
     }
   };
   loadActivities();
 }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6 h-full">
      <h3 className="text-white font-bold text-lg mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((item, index) => {
          const Icon = ICON_MAP[item.type] || ShoppingBag;
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-300 leading-tight">
                  {item.message}
                </p>
                <span className="text-xs text-gray-600 mt-1">
                  {formatDistanceToNow(new Date(item.time), {
                    addSuffix: true,
                    locale: pt,
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;