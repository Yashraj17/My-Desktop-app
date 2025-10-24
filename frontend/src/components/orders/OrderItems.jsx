import { ChefHat, Timer } from "lucide-react";
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "kot":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "paid":
      return "bg-green-100 text-green-700 border-green-300";
    case "billed":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "preparing":
      return "bg-purple-100 text-purple-700 border-purple-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};
const OrderCard = ({
  orderNo = "65656",
  table ,
  dateTime = "Sep 30, 2025 15:28 PM",
  elapsedTime = "170:33",
  status = "Order Preparing",
  order_status,
  amount ="AED33.00",
  amount_paid,
  kotCount ="1",
  staff = "admin",
}) => {
  return (
    <div className="flex flex-col my-4 px-4 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all p-4">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-2">
          {table && (
            <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-md text-sm w-fit">
              {table}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-800 dark:text-gray-200 font-semibold">
              Order #{orderNo}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>{order_status}</span>
          </div>
        </div>

        <div>
  <span
    className={`text-xs font-semibold px-2 py-1 border rounded-md ${getStatusColor(status)}`}
  >
    {status?.toUpperCase()}
  </span>
</div>

      </div>

      {/* Middle Section */}
<div className="flex justify-between items-center text-sm">
        <div className="text-sm text-gray-500">{dateTime}</div>
        <div className="flex justify-end items-center gap-4 text-teal-600 font-semibold text-sm">
          <Timer className="w-2 h-2" />
          <span>{elapsedTime}</span>
           <div className="text-sm font-medium text-gray-800 dark:text-gray-400">
          {kotCount} KOT
        </div>
        </div>
       
      </div>

      <hr className="border-gray-300 dark:border-gray-600 mb-2 " />

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {amount}
        </div>
        <div className="flex items-center gap-3">
           {status?.toLowerCase() === "kot" &&
                              amount_paid === 0 && (
                                <button className="border border-gray-300 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100">
                                  New KOT
                                </button>
                              )}
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-200 text-sm font-medium">
            <ChefHat className="w-4 h-4" />
            <span>{staff}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;