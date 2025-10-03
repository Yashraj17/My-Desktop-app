// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon, ChevronDownIcon, RefreshCwIcon } from "lucide-react";
// import { format } from "date-fns";

// function Orders() {
//   const [fromDate, setFromDate] = useState(new Date(2025, 8, 9)); // September 9, 2025
//   const [toDate, setToDate] = useState(new Date(2025, 8, 16)); // September 16, 2025
//   const [autoRefresh, setAutoRefresh] = useState("10seconds");
//   const [timeRange, setTimeRange] = useState("Last 7 Days");
//   const [showAllOrders, setShowAllOrders] = useState("Show allOrders");
//   const [waiterFilter, setWaiterFilter] = useState("Show All waiter");

//   // Sample orders data

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Orders (5)</h1>
//           <div className="flex items-center space-x-2">
//             <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-1">
//               <RefreshCwIcon className="h-4 w-4 mr-2 text-gray-500" />
//               <span className="text-sm text-gray-700 mr-2">Autorefresh</span>
//               <Select value={autoRefresh} onValueChange={setAutoRefresh}>
//                 <SelectTrigger className="w-[100px] h-8 border-0 p-0 focus:ring-0 focus:ring-offset-0">
//                   <SelectValue placeholder="10 seconds" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10seconds">10 seconds</SelectItem>
//                   <SelectItem value="30seconds">30 seconds</SelectItem>
//                   <SelectItem value="1minute">1 minute</SelectItem>
//                   <SelectItem value="5minutes">5 minutes</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Time Range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Today">Today</SelectItem>
//               <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
//               <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
//               <SelectItem value="Custom Range">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Separate Date Pickers */}
//           <div className="flex items-center space-x-2">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="w-[120px] justify-start text-left font-normal">
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {fromDate ? format(fromDate, "MM/dd/yyyy") : <span>From</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={fromDate}
//                   onSelect={setFromDate}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
            
//             <span className="text-gray-500">To</span>
            
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="w-[120px] justify-start text-left font-normal">
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {toDate ? format(toDate, "MM/dd/yyyy") : <span>To</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={toDate}
//                   onSelect={setToDate}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           <Select value={showAllOrders} onValueChange={setShowAllOrders}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Order Filter" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Show allOrders">Show all Orders</SelectItem>
//               <SelectItem value="Active only">Active only</SelectItem>
//               <SelectItem value="Completed only">Completed only</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={waiterFilter} onValueChange={setWaiterFilter}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Waiter Filter" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Show All waiter">All Waiters</SelectItem>
//               <SelectItem value="John">John</SelectItem>
//               <SelectItem value="Sarah">Sarah</SelectItem>
//               <SelectItem value="Mike">Mike</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Orders Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         </div>
//       </div>
//     </div>
//   );
// }

// export default Orders;

import { useState } from 'react'; // Import useState hook
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import OrderCard from '../components/orders/OrderItems';

const dateRangeSelectData = [
    { value: 'today', label: 'Today' },
    { value: 'currentWeek', label: 'Current Week' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'last7Days', label: 'Last 7 Days' },
    { value: 'currentMonth', label: 'Current Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'currentYear', label: 'Current Year' },
    { value: 'lastYear', label: 'Last Year' },
];

const orderStatusOptions = [
    { value: 'billed', label: 'Billed' },
    { value: 'paid', label: 'Paid' },
    { value: 'canceled', label: 'Canceled' },
];

const waiterOptions = [
    { value: 'john', label: 'John' },
    { value: 'jane', label: 'Jane' },
    { value: 'mark', label: 'Mark' },
];

export function Orders() {
    const [dateRangeType, setDateRangeType] = useState('today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [waiter, setWaiter] = useState('');

    const handleDateRangeChange = (value) => {
        setDateRangeType(value); // Directly use the value from SelectItem
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleOrderStatusChange = (value) => {
        setOrderStatus(value);
    };

    const handleWaiterChange = (value) => {
        setWaiter(value);
    };

    return (
        <>
            <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <div className="flex gap-4 justify-between items-center">
                        <div className="flex gap-4 items-center">
                                {/* Date Range Select */}
                                <Select value={dateRangeType} onValueChange={handleDateRangeChange}>
                                    <SelectTrigger className=" h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full">
                                        <SelectValue placeholder="Select Date Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dateRangeSelectData.map((menu) => (
                                            <SelectItem
                                                key={menu.value}
                                                value={menu.value}
                                                className="font-medium text-gray-900 text-[16px]"
                                            >
                                                {menu.label} {/* Display the label */}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Start Date Input */}
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full"
                                />

                                {/* End Date Input */}
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    className="h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full"
                                />

                                {/* Order Status Dropdown */}
                                <Select value={orderStatus} onValueChange={handleOrderStatusChange}>
                                    <SelectTrigger className=" h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full">
                                        <SelectValue placeholder="Select Order Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderStatusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="font-medium text-gray-900 text-[16px]"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Waiter Dropdown */}
                                <Select value={waiter} onValueChange={handleWaiterChange}>
                                    <SelectTrigger className=" h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full">
                                        <SelectValue placeholder="Select Waiter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {waiterOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="font-medium text-gray-900 text-[16px]"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                        </div>
                        <Button className="h-10 px-4 border-gray-300 bg-[#000080]/90 hover:bg-[#000080]/100 rounded-full">
                            New Order
                        </Button>
                    </div>

                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Orders (12)
                        </h1>
                    </div>

                    <div className="bg-gray-100 p-2 min-h-screen dark:bg-gray-800">
                        <div className="grid grid-cols-3 gap-4">
                            <OrderCard
                                orderNumber="234"
                                status="BILLED"
                                statusType="info"
                                date="August 23, 2024 12:12 PM"
                                itemsCount={1}
                                amount="AED 23.34"
                                admin="Admin"
                            />
                            <OrderCard
                                orderNumber="234"
                                status="PAID"
                                statusType="success"
                                date="August 23, 2024 12:12 PM"
                                itemsCount={1}
                                amount="AED 23.34"
                                admin="Admin"
                            />
                            <OrderCard
                                orderNumber="234"
                                status="CANCELED"
                                statusType="danger"
                                date="August 23, 2024 12:12 PM"
                                itemsCount={1}
                                amount="AED 23.34"
                                admin="Admin"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}