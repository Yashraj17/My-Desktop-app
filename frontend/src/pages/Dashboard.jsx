import React,{useState} from "react"
import { ShoppingCart, Users, DollarSign, BarChart3 } from "lucide-react"


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
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
Statistics          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Friday, 10 Oct, 12:06 PM
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Orders" value="0" percentage="0%" icon={<ShoppingCart size={16} />} />
        <StatCard title="Today's Customers" value="0" percentage="0%" icon={<Users size={16} />} />
        <StatCard title="Today's Earnings" value="AED 0.00" percentage="0%" icon={<DollarSign size={16} />} />
        <StatCard title="Avg Daily Earnings (Oct)" value="AED 14.61" percentage="+162.51%" icon={<BarChart3 size={16} />} />
      </div>

      {/* Inline Line Chart */}
     {/* Sales This Month with info and chart */}
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 shadow-sm max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AED 146.10</h2>
            <p className="text-gray-600 dark:text-gray-300">Sales This Month</p>
          </div>
          <div className="text-green-600 dark:text-green-400 flex items-center space-x-1">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-sm font-semibold">40.99%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Since Previous Month</span>
          </div>
        </div>

        <SimpleLineChart data={data} />
      </div>
      {/* Orders & Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Today Orders</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Waiting for the today's first order 🕐</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payment Method (Today)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No Payment Found</p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Top Selling Dish (Today)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No Data Found</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Top Selling Tables (Today)</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No Payment Found</p>
      </div>
    </div>
  )
}
