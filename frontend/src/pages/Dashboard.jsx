import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  Circle,
} from "lucide-react";

// ===== Simple Chart Component =====
const data = [
  { date: "01 Oct", value: 20 },
  { date: "02 Oct", value: 55 },
  { date: "03 Oct", value: 35 },
  { date: "04 Oct", value: 30 },
  { date: "05 Oct", value: 50 },
  { date: "06 Oct", value: 60 },
  { date: "07 Oct", value: 100 },
];

function StatCard({ title, value, percentage, icon }) {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
        </p>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {percentage} Since yesterday
      </p>
    </div>
  );
}

function SimpleLineChart({
  data,
  width = 700,
  height = 250,
  stroke = "#0B0E52",
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = 50;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - (d.value / maxValue) * (height - 2 * padding);
    return { x, y };
  });

  return (
    <svg
      width={width}
      height={height}
      style={{ background: "#fff", borderRadius: 6 }}
    >
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={stroke} stopOpacity={0.3} />
          <stop offset="95%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodColor="rgba(0, 0, 0, 0.2)"
          />
        </filter>
      </defs>

      {[0, 25, 50, 75, 100, 125, 150].map((val) => {
        const y = height - padding - (val / maxValue) * (height - 2 * padding);
        return (
          <g key={val}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#E5E7EB"
              strokeDasharray="4 4"
            />
            <text
              x={padding - 10}
              y={y + 4}
              fontSize="12"
              fill="#94A3B8"
              textAnchor="end"
            >
              {`AED${val}`}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => (
        <text
          key={d.date}
          x={points[i].x}
          y={height - padding + 20}
          fontSize="12"
          fill="#94A3B8"
          textAnchor="middle"
        >
          {d.date}
        </text>
      ))}

      <polyline
        fill="url(#gradient)"
        stroke={stroke}
        strokeWidth="3"
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        filter="url(#shadow)"
      />

      {points.map(({ x, y }, i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={5}
          fill={stroke}
          stroke="#fff"
          strokeWidth={2}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: "pointer" }}
        />
      ))}

      {hoveredIndex !== null && (
        <g>
          <rect
            x={points[hoveredIndex].x - 60}
            y={points[hoveredIndex].y - 70}
            width={130}
            height={50}
            fill="white"
            stroke="#94A3B8"
            rx={6}
            ry={6}
            filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))"
          />
          <polygon
            points={`
              ${points[hoveredIndex].x - 10},${points[hoveredIndex].y - 20}
              ${points[hoveredIndex].x + 10},${points[hoveredIndex].y - 20}
              ${points[hoveredIndex].x},${points[hoveredIndex].y - 10}
            `}
            fill="white"
            stroke="#94A3B8"
          />
          <text
            x={points[hoveredIndex].x}
            y={points[hoveredIndex].y - 50}
            fontSize="14"
            fontWeight="600"
            fill="#0B0E52"
            textAnchor="middle"
          >
            {data[hoveredIndex].date}
          </text>
          <text
            x={points[hoveredIndex].x}
            y={points[hoveredIndex].y - 30}
            fontSize="14"
            fill="#0B0E52"
            textAnchor="middle"
          >
            Earnings:{" "}
            <tspan fontWeight="700">
              AED{data[hoveredIndex].value.toFixed(2)}
            </tspan>
          </text>
        </g>
      )}
    </svg>
  );
}

// ===== Helper Functions =====
const getElapsedTime = (orderTime) => {
  const orderDate = new Date(orderTime);
  const now = new Date();
  const diffMins = Math.floor((now - orderDate) / 60000);
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
};

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

// ===== Main Dashboard Component =====
export default function Dashboard() {
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [yesterdayOrders, setYesterdayOrders] = useState(0);
  const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
  const [orders, setOrders] = useState([]);
  const [avgDailyEarnings, setAvgDailyEarnings] = useState(0);
  const [prevMonthAvg, setPrevMonthAvg] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const reservations = await window.api.getOrders();
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (d1, d2) =>
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();

        const todayData = reservations.filter((r) =>
          isSameDay(new Date(r.date_time), today)
        );
        const yesterdayData = reservations.filter((r) =>
          isSameDay(new Date(r.date_time), yesterday)
        );

        setTodayOrders(todayData.length);
        setTodayEarnings(
          todayData.reduce(
            (sum, r) => sum + Number(r.amount_paid || r.total || 0),
            0
          )
        );
        setYesterdayOrders(yesterdayData.length);
        setYesterdayEarnings(
          yesterdayData.reduce(
            (sum, r) => sum + Number(r.amount_paid || r.total || 0),
            0
          )
        );
        setOrders(reservations);
        setAvgDailyEarnings(calculateAvgDailyEarnings(reservations));
        const prevAvg = calculatePrevMonthAvg(reservations);
        setAvgDailyEarnings(calculateAvgDailyEarnings(reservations));
        setPrevMonthAvg(prevAvg);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const calculateAvgDailyEarnings = (orders) => {
    const now = new Date();
    const currentMonthOrders = orders.filter(
      (o) => new Date(o.date_time).getMonth() === now.getMonth()
    );

    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const totalEarnings = currentMonthOrders.reduce(
      (sum, o) => sum + Number(o.amount_paid || o.total || 0),
      0
    );

    return totalEarnings / daysInMonth;
  };

  // Calculate previous month's average daily earnings
  const calculatePrevMonthAvg = (orders) => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthOrders = orders.filter(
      (o) => new Date(o.date_time).getMonth() === prevMonth.getMonth()
    );

    const daysInPrevMonth = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1,
      0
    ).getDate();

    const totalEarnings = prevMonthOrders.reduce(
      (sum, o) => sum + Number(o.amount_paid || o.total || 0),
      0
    );

    return totalEarnings / daysInPrevMonth;
  };

  const ordersPercent = yesterdayOrders
    ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(2)
    : 0;
  const earningsPercent = yesterdayEarnings
    ? (((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100).toFixed(
        2
      )
    : 0;

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Statistics</p>
        </div>
        <div className="inline-flex items-center gap-1 dark:text-white text-gray-700">
          <Clock size={16} />
          <span>
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="w-3/4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
              title="Today's Orders"
              value={todayOrders}
              percentage={`${ordersPercent}%`}
              icon={<ShoppingCart size={16} />}
            />
            <StatCard
              title="Today's Customers"
              value="0"
              percentage="0%"
              icon={<Users size={16} />}
            />
            <StatCard
              title="Today's Earnings"
              value={`AED ${todayEarnings.toFixed(2)}`}
              percentage={`${earningsPercent}%`}
              icon={<DollarSign size={16} />}
            />
            <StatCard
              title={`Avg Daily Earnings (${new Date().toLocaleString(
                "default",
                { month: "short" }
              )})`}
              value={`AED ${avgDailyEarnings.toFixed(2)}`}
              percentage={`${
                prevMonthAvg
                  ? (
                      ((avgDailyEarnings - prevMonthAvg) / prevMonthAvg) *
                      100
                    ).toFixed(2)
                  : 0
              }%`}
              icon={<BarChart3 size={16} />}
            />
          </div>

          <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 shadow-sm max-w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AED 146.10
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Sales This Month
                </p>
              </div>
              <div className="text-green-600 dark:text-green-400 flex items-center space-x-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span className="text-sm font-semibold">40.99%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Since Previous Month
                </span>
              </div>
            </div>
            <SimpleLineChart data={data} />
          </div>

          {/* Payment Method & Top Selling */}
          <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Payment Method (Today)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No Payment Found
            </p>
          </div>
          <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Top Selling Dish (Today)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No Data Found
            </p>
          </div>
          <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Top Selling Tables (Today)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No Payment Found
            </p>
          </div>
        </div>

        {/* Right Column — Today Orders */}
        {/* Right Column — Today Orders */}
        <div className="w-1/4">
          <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Today Orders
            </h3>

            {orders.filter((r) => {
              const d = new Date(r.date_time);
              const t = new Date();
              return (
                d.getDate() === t.getDate() &&
                d.getMonth() === t.getMonth() &&
                d.getFullYear() === t.getFullYear()
              );
            }).length > 0 ? (
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {orders
                  .filter((r) => {
                    const d = new Date(r.date_time);
                    const t = new Date();
                    return (
                      d.getDate() === t.getDate() &&
                      d.getMonth() === t.getMonth() &&
                      d.getFullYear() === t.getFullYear()
                    );
                  })
                  .map((order) => {
                    const preparingSince = getElapsedTime(order.date_time);
                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-3"
                      >
                        {/* ===== Header ===== */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-semibold">
                              --
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-700 font-semibold">
                                Order #{order.order_number}
                              </span>
                              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                                Order Preparing
                              </div>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-semibold px-2 py-1 border rounded-md ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status?.toUpperCase()}
                          </span>
                        </div>

                        {/* ===== Middle Info ===== */}
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                          <div>
                            {new Date(order.date_time).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock size={13} className="mr-1 text-gray-500" />
                            <span className="font-medium">
                              {preparingSince}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-700">
                            {order.total_kots
                              ? `${order.total_kots} KOT`
                              : "1 KOT"}
                          </span>
                        </div>

                        {/* ===== Divider Line ===== */}
                        <div className="border-t border-gray-200 my-3"></div>

                        {/* ===== Footer ===== */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-800">
                            AED {order.total?.toFixed(2) || "0.00"}
                          </span>

                          <div className="flex items-center gap-2">
                            {order.status?.toLowerCase() === "kot" &&
                              order.amount_paid === 0 && (
                                <button className="border border-gray-300 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100">
                                  New KOT
                                </button>
                              )}

                            <div className="flex items-center text-xs text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.79.635 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {order.waiter_name || "Demo"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Waiting for today’s first order 🕐
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
