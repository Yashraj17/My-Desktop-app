import React,{useState,useEffect} from "react"
import { ShoppingCart, Users, DollarSign, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { date: "01 Oct", value: 20 },
  { date: "02 Oct", value: 55 },
  { date: "03 Oct", value: 35 },
  { date: "04 Oct", value: 30 },
  { date: "05 Oct", value: 50 },
  { date: "06 Oct", value: 60 },
  { date: "07 Oct", value: 100 },
]

function StatCard({ title, value, percentage, icon }) {
  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</p>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{percentage} Since yesterday</p>
    </div>
  )
}

function SimpleLineChart({ data, width = 700, height = 250, stroke = "#0B0E52" }) {
  const maxValue = Math.max(...data.map(d => d.value))
  const padding = 50
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1)
    const y = height - padding - (d.value / maxValue) * (height - 2 * padding)
    return { x, y }
  })

  return (
    <svg width={width} height={height} style={{ background: "#fff", borderRadius: 6 }}>
      {/* Gradient & Shadow definitions */}
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={stroke} stopOpacity={0.3} />
          <stop offset="95%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0, 0, 0, 0.2)" />
        </filter>
      </defs>

      {/* Y axis lines and labels */}
      {[0, 25, 50, 75, 100, 125, 150].map((val) => {
        const y = height - padding - (val / maxValue) * (height - 2 * padding)
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
        )
      })}

      {/* X axis labels */}
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

      {/* Line with shadow */}
      <polyline
        fill="url(#gradient)"
        stroke={stroke}
        strokeWidth="3"
        points={points.map(p => `${p.x},${p.y}`).join(" ")}
        filter="url(#shadow)"  // <-- SHADOW APPLIED HERE
      />

      {/* Data points */}
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

      {/* Tooltip */}
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
            Earnings: <tspan fontWeight="700">AED{data[hoveredIndex].value.toFixed(2)}</tspan>
          </text>
        </g>
      )}
    </svg>
  )
}



export default function Dashboard() {

  const [todayOrders, setTodayOrders] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [yesterdayOrders, setYesterdayOrders] = useState(0);orders
  const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
  const [orders, setorders] = useState(0);

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

        // Filter orders by local date
        const todayData = reservations.filter(r =>
          isSameDay(new Date(r.date_time), today)
        );
        const yesterdayData = reservations.filter(r =>
          isSameDay(new Date(r.date_time), yesterday)
        );

        // Calculate totals
        const todayCount = todayData.length;
        const todayTotal = todayData.reduce(
          (sum, r) => sum + Number(r.amount_paid || r.total || 0),
          0
        );

        const yesterdayCount = yesterdayData.length;
        const yesterdayTotal = yesterdayData.reduce(
          (sum, r) => sum + Number(r.amount_paid || r.total || 0),
          0
        );

        setTodayOrders(todayCount);
        setTodayEarnings(todayTotal);
        setYesterdayOrders(yesterdayCount);
        setYesterdayEarnings(yesterdayTotal);
        setorders(reservations)
        console.log("order data.....",reservations,"today....",todayCount)
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Calculate % change
  const ordersPercent = yesterdayOrders
    ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(2)
    : todayOrders > 0
    ? 100
    : 0;

  const earningsPercent = yesterdayEarnings
    ? (((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100).toFixed(2)
    : todayEarnings > 0
    ? 100
    : 0;

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Statistics</p>
        </div>
     <div className="inline-flex items-center gap-1 dark:text-white text-gray-700">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-calendar-event"
    viewBox="0 0 16 16"
  >
    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
  </svg>

  <span>
    {(() => {
      const d = new Date();
      const weekday = d.toLocaleString("en-US", { weekday: "long" });
      const day = d.toLocaleString("en-US", { day: "2-digit" });
      const month = d.toLocaleString("en-US", { month: "short" });
      const time = d.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return `${weekday}, ${day} ${month}, ${time}`;
    })()}
  </span>
</div>

      </div>

      {/* Two columns */}
      <div className="flex gap-6">

        {/*  Left Column - 75% */}
        <div className="w-3/4 space-y-6">
          {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
              title="Today's Orders"
              value={todayOrders}
              percentage={`${ordersPercent >= 0 ? `+${ordersPercent}` : ordersPercent}%`}
              icon={<ShoppingCart size={16} />}
            />
            <StatCard title="Today's Customers" value="0" percentage="0%" icon={<Users size={16} />} />
            <StatCard title="Today's Earnings" value="AED 0.00" percentage="0%" icon={<DollarSign size={16} />} />
            <StatCard title="Avg Daily Earnings (Oct)" value="AED 14.61" percentage="+162.51%" icon={<BarChart3 size={16} />} />
          </div>

          {/* Sales Chart */}
          <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 shadow-sm max-w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AED 146.10</h2>
                <p className="text-gray-600 dark:text-gray-300">Sales This Month</p>
              </div>
              <div className="text-green-600 dark:text-green-400 flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <span className="text-sm font-semibold">40.99%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Since Previous Month</span>
              </div>
            </div>
            <SimpleLineChart data={data} />
          </div>

          {/* Payment Method & Top Selling */}
            <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payment Method (Today)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No Payment Found</p>
            </div>
            <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Top Selling Dish (Today)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No Data Found</p>
            </div>
            <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Top Selling Tables (Today)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No Payment Found</p>
            </div>
        </div>

         {/*  Right Column - 25% */}
        <div className="w-1/4 space-y-6">
         <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Today Orders</h3>
  {todayOrders > 0 ? (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {orders
        .filter(r => {
          const d = new Date(r.date_time);
          const today = new Date();
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        })
        .map(order => (
          <div key={order.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">Order #{order.order_number}</p>
              <p className="text-xs text-gray-500">{order.order_status}</p>
            </div>
            <div className="text-sm font-bold">AED {order.total}</div>
          </div>
        ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Waiting for the today's first order 🕐
    </p>
  )}
</div>

          {/* You can add more widgets in left column if needed */}
        </div>
      </div>
    </div>
  )
}

