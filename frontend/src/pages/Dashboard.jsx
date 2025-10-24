import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  Circle,
} from "lucide-react";
import ApexCharts from "apexcharts";

// Helper to calculate weekly earnings
const getStartOfWeek = (date = new Date()) => {
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
};

const calculateWeeklyData = (orders) => {
  const startOfWeek = getStartOfWeek();
  const weekMap = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    weekMap[key] = 0;
  }

  orders.forEach((o) => {
    if (o.status?.toLowerCase() === "paid") {
      const key = new Date(o.date_time).toISOString().slice(0, 10);
      if (weekMap[key] !== undefined) weekMap[key] += Number(o.total || 0);
    }
  });

  return Object.entries(weekMap).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }),
    value,
  }));
};

const calculateMonthlyData = (orders) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthMap = {};
  for (let i = 1; i <= daysInMonth; i++) {
    const key = new Date(year, month, i).toISOString().slice(0, 10);
    monthMap[key] = 0;
  }

  orders.forEach((o) => {
    if (o.status?.toLowerCase() === "paid") {
      const key = new Date(o.date_time).toISOString().slice(0, 10);
      if (monthMap[key] !== undefined) monthMap[key] += Number(o.total || 0);
    }
  });

  return Object.entries(monthMap).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    }),
    value,
  }));
};

// Status badge colors
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

// Helper to calculate elapsed time
const getElapsedTime = (orderTime) => {
  const orderDate = new Date(orderTime);
  const now = new Date();
  const diffMins = Math.floor((now - orderDate) / 60000);
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
};

// Stat Card
function StatCard({ title, value, percentage, icon }) {
  const isPositive = parseFloat(percentage) >= 0;
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
      <p
        className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
      >
        {percentage} Since yesterday
      </p>
    </div>
  );
}

// ===== Main Dashboard Component =====
export default function Dashboard() {
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [yesterdayOrders, setYesterdayOrders] = useState(0);
  const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
  const [orders, setOrders] = useState([]);
  const [avgDailyEarnings, setAvgDailyEarnings] = useState(0);
  const [prevMonthAvg, setPrevMonthAvg] = useState(0);
  const [todayCustomers, setTodayCustomers] = useState(0);
  const [yesterdayCustomers, setYesterdayCustomers] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  menuItems;
  const [TodayPaymentEarning, setTodayPaymentEarning] = useState([]);
  const [menuItems, setmenuItems] = useState([]);
const [todayTableEarnings, setTodayTableEarnings] = useState([]);

  const STATUS_FILTER = "paid"; // change as needed (e.g. 'COMPLETED')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const reservations = await window.api.getOrders();
        const TodayPaymentEarning =await window.api.getTodayPaymentMethodEarnings();
        const menuItems = await window.api.getTodayMenuItemEarnings();
        const getTodayTableEarnings =await window.api.getTodayTableEarnings();
        setTodayTableEarnings(getTodayTableEarnings);
        console.log("getTodayTableEarnings....", getTodayTableEarnings);
        setTodayPaymentEarning(TodayPaymentEarning);
        setmenuItems(menuItems);
        // ✅ Filter only desired status
        const validOrders = reservations.filter(
          (r) => r.status === STATUS_FILTER
        );

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (d1, d2) =>
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();

        const todayData = validOrders.filter((r) =>
          isSameDay(new Date(r.date_time), today)
        );
        const yesterdayData = validOrders.filter((r) =>
          isSameDay(new Date(r.date_time), yesterday)
        );

        const todayDatacount = reservations.filter((r) =>
          isSameDay(new Date(r.date_time), today)
        );
        setTodayOrders(todayDatacount.length);
        setTodayEarnings(
          todayData.reduce((sum, r) => sum + Number(r.total || 0), 0)
        );

        setYesterdayOrders(yesterdayData.length);
        setYesterdayEarnings(
          yesterdayData.reduce((sum, r) => sum + Number(r.total || 0), 0)
        );

        setOrders(reservations); // keep full list if needed
        setAvgDailyEarnings(calculateAvgDailyEarnings(validOrders));
        const prevAvg = calculatePrevMonthAvg(validOrders);
        setPrevMonthAvg(prevAvg);

        // ✅ TODAY Customers (unique, excluding canceled & draft if needed)
        const todayCustomersSet = new Set(
          reservations
            .filter((r) => {
              const d = new Date(r.date_time);
              return (
                isSameDay(d, today) &&
                r.status !== "canceled" &&
                r.status !== "draft"
              );
            })
            .map((r) => r.customer_id || r.customer_name)
            .filter((v) => v) // remove null or undefined
        );
        const todayCustCount = todayCustomersSet.size;
        setTodayCustomers(todayCustCount);

        // ✅ YESTERDAY Customers (unique)
        const yesterdayCustomersSet = new Set(
          reservations
            .filter((r) => {
              const d = new Date(r.date_time);
              return (
                isSameDay(d, yesterday) &&
                r.status !== "canceled" &&
                r.status !== "draft"
              );
            })
            .map((r) => r.customer_id || r.customer_name)
            .filter((v) => v)
        );
        const yestCustCount = yesterdayCustomersSet.size;
        setYesterdayCustomers(yestCustCount);

        // Calculate weekly data
        const monthlyChartData = calculateMonthlyData(reservations);
        setWeeklyData(monthlyChartData); // rename weeklyData to chartData for clarity
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Render ApexCharts weekly chart
  useEffect(() => {
    if (!weeklyData.length) return;

    const darkMode = document.documentElement.classList.contains("dark");
    const options = {
      chart: {
        type: "area",
        height: 420,
        toolbar: { show: false },
        foreColor: darkMode ? "#9CA3AF" : "#6B7280",
      },
      series: [
        {
          name: "Earnings",
          data: weeklyData.map((d) => d.value),
          color: "#0B0E52",
        },
      ],
      markers: { size: 5, strokeColors: "#ffffff", hover: { sizeOffset: 3 } },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: darkMode ? 0 : 0.45,
          opacityTo: darkMode ? 0.15 : 0,
        },
      },
      xaxis: {
        categories: weeklyData.map((d) => d.date),
        axisBorder: { color: darkMode ? "#374151" : "#F3F4F6" },
        axisTicks: { color: darkMode ? "#374151" : "#F3F4F6" },
      },
      yaxis: { labels: { formatter: (val) => `AED${val}` } },
      tooltip: { y: { formatter: (val) => `AED${val.toFixed(2)}` } },
    };

    const chart = new ApexCharts(
      document.querySelector("#weekly-sales-chart"),
      options
    );
    chart.render();

    return () => chart.destroy();
  }, [weeklyData]);

  // ✅ Avg earnings current month with status filter
  const calculateAvgDailyEarnings = (orders) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // ✅ Only paid orders in current month
    const currentMonthOrders = orders.filter((o) => {
      const d = new Date(o.date_time);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        o.status === STATUS_FILTER
      );
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const totalEarnings = currentMonthOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    return totalEarnings / daysInMonth;
  };

  const calculatePrevMonthAvg = (orders) => {
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();

    // ✅ Only paid orders in previous month
    const prevMonthOrders = orders.filter((o) => {
      const d = new Date(o.date_time);
      return (
        d.getFullYear() === prevYear &&
        d.getMonth() === prevMonth &&
        o.status === STATUS_FILTER
      );
    });

    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    const totalEarnings = prevMonthOrders.reduce(
      (sum, o) => sum + Number(o.amount_paid || o.total || 0),
      0
    );

    return totalEarnings / daysInPrevMonth;
  };

  // % Comparisons remain same
  const ordersPercent = yesterdayOrders
    ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(2)
    : 0;

  const earningsPercent = yesterdayEarnings
    ? (((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100).toFixed(
        2
      )
    : 0;

  const customersPercent = yesterdayCustomers
    ? (
        ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) *
        100
      ).toFixed(2)
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
              value={todayCustomers}
              percentage={`${customersPercent}%`}
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
              
            {/* Weekly Sales Chart */}
            <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 shadow-sm">
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
              <div id="weekly-sales-chart"></div>
            </div>
          </div>

          {/* Payment Method & Top Selling */}
          <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Payment Method (Today)
            </h3>

            {TodayPaymentEarning && TodayPaymentEarning.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {TodayPaymentEarning.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      {item.payment_method === "cash" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-cash-stack"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                          <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
                        </svg>
                      )}
                      {item.payment_method === "card" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-credit-card"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1z" />
                          <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                        </svg>
                      )}
                      {item.payment_method === "upi" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-qr-code-scan"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zM12 .5a.5.5 0 0 1 .5-.5h3..." />
                        </svg>
                      )}
                      <span className="capitalize text-sm font-medium">
                        {item.payment_method}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      AED {parseFloat(item.total_amount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No Payment Found
              </p>
            )}
          </div>

          <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
              Top Selling Dish (Today)
            </h3>

            {menuItems && menuItems.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {menuItems.map((item, index) => (
                  <li key={item.id} className="py-1 sm:py-2">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex-1 min-w-0">
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-3">
                            {/* Rank */}
                            <span className="text-gray-400 text-sm">
                              #{index + 1}
                            </span>

                            {/* Item Image */}

                            <img
                              className="rounded-md object-cover h-10 w-10"
                              src={
                                item.item_photo_url
                                  ? `/images/menu/${item.item_photo_url}`
                                  : "./images/food.svg"
                              }
                              alt={item.item_name}
                              onError={(e) => {
                                e.target.src = "./images/food.svg";
                              }}
                            />
                            {/* Name & Quantity */}
                            <div>
                              <h5 className="text-sm font-medium tracking-tight text-gray-900 dark:text-white">
                                {item.item_name}
                              </h5>
                              <span className="text-gray-600 dark:text-white text-xs">
                                {item.total_quantity || 0} qty
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Earning */}
                      <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                        AED {parseFloat(item.total_earning || 0).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No data found
              </p>
            )}
          </div>
       
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
  <div className="w-full">
    <h3 className="text-base font-normal text-gray-500 dark:text-gray-400 mb-4">
      Top Tables (Today)
    </h3>

    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {todayTableEarnings && todayTableEarnings.length > 0 ? (
        todayTableEarnings.map((item, index) => (
          <li key={index} className="py-1 sm:py-2">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-1 min-w-0">
                <div className="w-full max-w-sm space-y-2">
                  <div>
                    <div className="flex items-center gap-3">
                      {/* Index Number */}
                      <span className="text-gray-400 text-sm">#{index + 1}</span>

                      {/* Table Code */} 
                      <div className="p-2 rounded-md tracking-wide bg-blue-100 text-blue-700">
                        <h3 className="font-semibold">{item.table_code}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="inline-flex items-center text-base font-medium text-gray-900 dark:text-white">
                AED {parseFloat(item.total_earning).toFixed(2)}
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="py-2">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                No Payment Found
              </p>
            </div>
          </div>
        </li>
      )}
    </ul>
  </div>
       </div>

        </div>

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
                                {order.customer_name||"----"}
                              </span>
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
