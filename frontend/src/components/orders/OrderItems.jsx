import { ChefHat, Timer } from "lucide-react";

/**
 * Format date to readable format
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      meridiem: "short",
    });
  } catch {
    return dateString;
  }
};

/**
 * Calculate elapsed time from created_at to now
 */
const calculateElapsedTime = (createdAt) => {
  if (!createdAt) return "N/A";
  try {
    const startTime = new Date(createdAt);
    const now = new Date();
    const diffMs = now - startTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffHours > 0) {
      return `${diffHours}:${String(remainingMins).padStart(2, "0")}`;
    }
    return `${diffMins}:00`;
  } catch {
    return "N/A";
  }
};

/**
 * Map order_type to display label
 */
const getOrderTypeLabel = (orderType) => {
  const typeMap = {
    dine_in: "Dine In",
    delivery: "Delivery",
    pickup: "Pickup",
  };
  return typeMap[orderType] || orderType;
};

/**
 * Map order_status to display label
 */
const getOrderStatusLabel = (status) => {
  const statusMap = {
    placed: "Order Placed",
    preparing: "Order Preparing",
    ready: "Order Ready",
    served: "Order Served",
    billed: "Billed",
    paid: "Paid",
    canceled: "Canceled",
  };
  return statusMap[status] || status;
};

const OrderCard = ({ order = {} }) => {
  // Destructure order data with fallbacks
  const {
    order_number = "N/A",
    table_id = null,
    total = 0,
    order_status = "placed",
    order_type = "dine_in",
    created_at = null,
    orderItems = [],
  } = order;

  const itemCount = orderItems.length || 0;
  const elapsedTime = calculateElapsedTime(created_at);
  const dateTime = formatDate(created_at);
  const statusLabel = getOrderStatusLabel(order_status);
  const typeLabel = getOrderTypeLabel(order_type);

  return (
    <div className="flex flex-col my-4 px-4 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all p-4">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-2">
          {table_id && (
            <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-md text-sm w-fit">
              {table_id}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-500 text-xs">--</span>
            <span className="text-gray-800 dark:text-gray-200 font-semibold">
              Order {order_number}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300 border border-yellow-400 text-xs font-bold px-2 py-1 rounded uppercase">
          {typeLabel}
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex justify-between text-sm">
        <div className="text-gray-500 text-[12px]">{dateTime}</div>
        <div className="flex items-center gap-4 text-teal-600 font-semibold">
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>{elapsedTime}</span>
          </div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-400">
            {itemCount} Item{itemCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-600 my-2" />

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
          AED {Number(total).toFixed(2)}
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;