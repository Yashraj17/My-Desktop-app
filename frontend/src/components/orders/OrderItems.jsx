import Badge from "../Badge";

const OrderCard = ({
  orderNumber,
  status,
  statusType,
  date,
  itemsCount,
  amount,
  admin,
  avatarUrl,
}) => {
  return (
    <div className="p-2 rounded bg-white dark:bg-gray-900 flex flex-col gap-4 divide-y divide-gray-300 dark:divide-gray-700 shadow hover:shadow-lg duration-200 cursor-pointer">
      <div className="flex flex-col gap-3 pb-2">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            <div
              className="w-7 h-10 bg-gray-400 dark:bg-gray-600 bg-cover bg-center rounded"
              style={{ backgroundImage: `url(${avatarUrl})` }}
            ></div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-800 dark:text-gray-300">--</p>
              <p className="text-sm text-gray-800 dark:text-gray-300">Order #{orderNumber}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge text={status} type={statusType} />
            <div className="flex items-center gap-1">
              <span className="text-blue-500 text-lg">⁌</span>
              <p className="text-xs text-gray-800 dark:text-gray-300">{status}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-slate-600 dark:text-gray-400 text-sm">{date}</p>
          <p className="text-black dark:text-white font-semibold text-sm">
            {itemsCount} Item(s)
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <p className="text-black dark:text-white font-semibold text-lg">{amount}</p>
        <p className="text-slate-900 dark:text-gray-300">{admin}</p>
      </div>
    </div>
  );
};

export default OrderCard;