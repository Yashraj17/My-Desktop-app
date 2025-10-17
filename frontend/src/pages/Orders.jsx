import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import OrderCard from "../components/orders/OrderItems";

const dateRangeSelectData = [
  { value: "today", label: "Today" },
  { value: "currentWeek", label: "Current Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "last7Days", label: "Last 7 Days" },
  { value: "currentMonth", label: "Current Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "currentYear", label: "Current Year" },
  { value: "lastYear", label: "Last Year" },
];

const orderStatusOptions = [
  { value: "all", label: "Show All Orders" },
  { value: "kot", label: "KOT" },
  { value: "billed", label: "Billed" },
  { value: "paid", label: "Paid" },
  { value: "canceled", label: "Canceled" },
  { value: "out_for_delivery", label: "Out For Delivery" },
  { value: "payment_due", label: "Payment Due" },
  { value: "delivered", label: "Delivered" },
];

const waiterOptions = [
  { value: "all", label: "Show All Waiter" },
  { value: "john", label: "John" },
  { value: "jane", label: "Jane" },
  { value: "mark", label: "Mark" },
];

const autoRefreshOptions = [
  { value: "10", label: "10 Seconds" },
  { value: "30", label: "30 Seconds" },
  { value: "60", label: "1 Minute" },
  { value: "300", label: "5 Minutes" },
];

const filterByOptions = [
  { value: "all", label: "All" },
  { value: "dineIn", label: "Dine In" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
];

const mockOrders = [
  {
    id: 1,
    status: "paid",
    waiter: "john",
    type: "dineIn",
    table: "T01",
    amount: 45.5,
    time: "12:30 PM",
    date: "2024-12-15",
    timestamp: "2024-12-15T12:30:00",
  },
  {
    id: 2,
    status: "billed",
    waiter: "jane",
    type: "takeaway",
    table: "TW01",
    amount: 32.75,
    time: "1:15 PM",
    date: "2024-12-15",
    timestamp: "2024-12-15T13:15:00",
  },
  {
    id: 3,
    status: "canceled",
    waiter: "mark",
    type: "delivery",
    table: "D01",
    amount: 28.9,
    time: "2:00 PM",
    date: "2024-12-14",
    timestamp: "2024-12-14T14:00:00",
  },
  {
    id: 4,
    status: "paid",
    waiter: "john",
    type: "dineIn",
    table: "T02",
    amount: 67.25,
    time: "12:45 PM",
    date: "2024-12-13",
    timestamp: "2024-12-13T12:45:00",
  },
  {
    id: 5,
    status: "billed",
    waiter: "jane",
    type: "dineIn",
    table: "T03",
    amount: 55.0,
    time: "1:30 PM",
    date: "2024-12-12",
    timestamp: "2024-12-12T13:30:00",
  },
  {
    id: 6,
    status: "paid",
    waiter: "mark",
    type: "takeaway",
    table: "TW02",
    amount: 42.3,
    time: "2:15 PM",
    date: "2024-12-11",
    timestamp: "2024-12-11T14:15:00",
  },
  {
    id: 7,
    status: "billed",
    waiter: "john",
    type: "delivery",
    table: "D02",
    amount: 38.75,
    time: "3:00 PM",
    date: "2024-12-10",
    timestamp: "2024-12-10T15:00:00",
  },
  {
    id: 8,
    status: "paid",
    waiter: "jane",
    type: "dineIn",
    table: "T04",
    amount: 29.99,
    time: "3:45 PM",
    date: "2024-12-09",
    timestamp: "2024-12-09T15:45:00",
  },
];

const getCurrentDateTime = () => {
  return new Date();
};

const getCurrentDate = () => {
  return getCurrentDateTime().toISOString().split("T")[0];
};

const getMaxDate = () => {
  return getCurrentDate();
};

const isFutureDate = (dateString) => {
  const inputDate = new Date(dateString);
  const today = getCurrentDateTime();
  const inputDateStart = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return inputDateStart > todayStart;
};

const calculateDateRange = (rangeType) => {
  const today = getCurrentDateTime();
  const start = new Date(today);
  const end = new Date(today);

  switch (rangeType) {
    case "today":
      start.setDate(today.getDate());
      end.setDate(today.getDate());
      break;
    case "currentWeek":
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      end.setDate(today.getDate());
      break;
    case "lastWeek":
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      start.setTime(lastWeekStart.getTime());
      end.setTime(lastWeekEnd.getTime());
      break;
    case "last7Days":
      start.setDate(today.getDate() - 6);
      end.setDate(today.getDate());
      break;
    case "currentMonth":
      start.setDate(1);
      end.setDate(today.getDate());
      break;
    case "lastMonth":
      start.setMonth(today.getMonth() - 1, 1);
      end.setMonth(today.getMonth(), 0);
      break;
    case "currentYear":
      start.setMonth(0, 1);
      end.setDate(today.getDate());
      break;
    case "lastYear":
      start.setFullYear(today.getFullYear() - 1, 0, 1);
      end.setFullYear(today.getFullYear() - 1, 11, 31);
      break;
    default:
      start.setDate(today.getDate());
      end.setDate(today.getDate());
  }

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

export function Orders() {
  const [dateRangeType, setDateRangeType] = useState("currentYear");
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [orderStatus, setOrderStatus] = useState("all");
  const [waiter, setWaiter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("10");
  const [filterBy, setFilterBy] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [dateError, setDateError] = useState("");
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const { start, end } = calculateDateRange(dateRangeType);
    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    let filtered = [...order];

    // ✅ Order Status (paid, billed, canceled, all)
    if (orderStatus !== "all") {
      filtered = filtered.filter((o) => o.status === orderStatus);
    }

    // ✅ Waiter
    if (waiter !== "all") {
      filtered = filtered.filter((o) => o.waiter_name === waiter);
    }

    // ✅ Filter By (dine_in / takeaway / delivery)
    if (filterBy !== "all") {
      // convert order_type to unified format
      const typeMap = {
        dineIn: "dine_in",
        takeaway: "takeaway",
        delivery: "delivery",
        pickup: "pickup",
      };
      filtered = filtered.filter((o) => o.order_type === typeMap[filterBy]);
    }

    // ✅ Date Range
    filtered = filtered.filter((o) => {
      const orderDate = o.date_time.split("T")[0];
      return orderDate >= startDate && orderDate <= endDate;
    });

    setFilteredOrders(filtered);
  }, [order, orderStatus, waiter, filterBy, startDate, endDate]);

  const handleDateRangeChange = (value) => {
    setDateRangeType(value);
    setDateError("");

    if (value !== "custom") {
      const { start, end } = calculateDateRange(value);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;

    if (isFutureDate(newStartDate)) {
      setDateError("Start date cannot be in the future");
      return;
    }

    setStartDate(newStartDate);
    setDateRangeType("custom");
    setDateError("");

    if (newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;

    if (isFutureDate(newEndDate)) {
      setDateError("End date cannot be in the future");
      return;
    }

    setEndDate(newEndDate);
    setDateRangeType("custom");
    setDateError("");

    if (newEndDate < startDate) {
      setStartDate(newEndDate);
    }
  };

  const handleOrderStatusChange = (value) => {
    setOrderStatus(value);
  };

  const handleWaiterChange = (value) => {
    setWaiter(value);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleRefreshIntervalChange = (value) => {
    setRefreshInterval(value);
  };

  const handleFilterByChange = (value) => {
    setFilterBy(value);
  };

  useEffect(() => {
    let intervalId;

    if (autoRefresh) {
      intervalId = setInterval(() => {
        console.log("Auto-refreshing orders...");
      }, parseInt(refreshInterval) * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const loadData = async () => {
    try {
      const data = await window.api.getOrders();
      console.log("hello this is order", data);
      setOrder(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Failed to load areas:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateElapsedTime = (dateString) => {
    if (!dateString) return "--";

    const orderTime = new Date(dateString);
    const now = new Date();

    let diff = Math.floor((now - orderTime) / 1000); // seconds

    if (diff < 0) return "0s";

    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setOrder((prev) => [...prev]); // triggers re-render to update elapsed time
  //   }, 1000); // update every second (can change to 60000 for every 1 min)

  //   return () => clearInterval(interval);
  // }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return "--";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short", // Oct
      day: "2-digit", // 16
      year: "numeric", // 2025
      hour: "2-digit", // 01
      minute: "2-digit", // 56
      hour12: true, // PM
    });
  };

  return (
    <div className="min-h-screen bg-white p-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Orders ({filteredOrders.length})
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Auto Refresh
            </span>
            <button
              onClick={handleAutoRefreshToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Refresh Interval */}
          <Select
            value={refreshInterval}
            onValueChange={handleRefreshIntervalChange}
          >
            <SelectTrigger className="">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {autoRefreshOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter By */}
          <Select value={filterBy} onValueChange={handleFilterByChange}>
            <SelectTrigger className="w-[120px] bg-white border-gray-200 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white shadow-sm">
        {/* Date Range Select */}
        <Select value={dateRangeType} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-[160px] bg-white border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRangeSelectData.map((menu) => (
              <SelectItem key={menu.value} value={menu.value}>
                {menu.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start Date Input */}
        <div className="relative">
          <Input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            max={getMaxDate()}
            className="w-[160px] pl-10 bg-white border-gray-300"
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        {/* To Label */}
        <span className="text-sm font-medium text-gray-600 px-2">To</span>

        {/* End Date Input */}
        <div className="relative">
          <Input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            max={getMaxDate()}
            className="w-[160px] pl-10 bg-white border-gray-300"
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Order Status Dropdown */}
        <Select value={orderStatus} onValueChange={handleOrderStatusChange}>
          <SelectTrigger className="w-[180px] bg-white border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {orderStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Waiter Dropdown */}
        <Select value={waiter} onValueChange={handleWaiterChange}>
          <SelectTrigger className="w-[180px] bg-white border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {waiterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* New Order Button */}
        <Button className="ml-auto bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium shadow-sm">
          New Order
        </Button>
      </div>

      {/* Error Message */}
      {dateError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{dateError}</p>
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((o) => (
            //   <OrderCard
            //     key={o.id}
            //     orderNo={o.order_number}
            //     table={o.table_id ? `Table ${o.table_id}` : "--"}
            //     dateTime={formatDateTime(o.date_time)}
            //     elapsedTime={calculateElapsedTime(o.date_time)}
            //     status={o.status}
            //     order_status={`Order ${o.order_status}`}
            //     amount={`AED ${o.total}`}
            //     amount_paid={o.amount_paid}
            //     kotCount={o.total_kots}
            //     staff={o.waiter_name}
            //   />
            <OrderCard
              key={o.id}
              orderNo={o.order_number}
              table={o.table_id ? `Table ${o.table_id}` : "--"}
              dateTime={formatDateTime(o.date_time)}
              elapsedTime={calculateElapsedTime(o.date_time)}
              status={o.status} // preparing / served
              order_status={`Order ${o.order_status}`} // paid / billed / canceled
              amount={`AED ${o.total}`}
              amount_paid={o.amount_paid}
              kotCount={o.total_kots}
              staff={o.waiter_name}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                No orders found
              </p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters to find what you're looking for
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
