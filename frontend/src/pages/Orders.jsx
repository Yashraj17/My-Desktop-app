import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import OrderCard from '../components/orders/OrderItems';
import { BillingDrawer } from '../components/pos/BillingDrawer';

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
    { value: 'all', label: 'Show All Orders' },
    { value: 'billed', label: 'Billed' },
    { value: 'paid', label: 'Paid' },
    { value: 'canceled', label: 'Canceled' },
];

const waiterOptions = [
    { value: 'all', label: 'Show All Waiter' },
    { value: 'john', label: 'John' },
    { value: 'jane', label: 'Jane' },
    { value: 'mark', label: 'Mark' },
];

const autoRefreshOptions = [
    { value: '10', label: '10 Seconds' },
    { value: '30', label: '30 Seconds' },
    { value: '60', label: '1 Minute' },
    { value: '300', label: '5 Minutes' },
];

const filterByOptions = [
    { value: 'all', label: 'All' },
    { value: 'dineIn', label: 'Dine In' },
    { value: 'takeaway', label: 'Takeaway' },
    { value: 'delivery', label: 'Delivery' },
];

const mockOrders = [
    { id: 1, status: 'paid', waiter: 'john', type: 'dineIn', table: 'T01', amount: 45.50, time: '12:30 PM', date: '2024-12-15', timestamp: '2024-12-15T12:30:00' },
    { id: 2, status: 'billed', waiter: 'jane', type: 'takeaway', table: 'TW01', amount: 32.75, time: '1:15 PM', date: '2024-12-15', timestamp: '2024-12-15T13:15:00' },
    { id: 3, status: 'canceled', waiter: 'mark', type: 'delivery', table: 'D01', amount: 28.90, time: '2:00 PM', date: '2024-12-14', timestamp: '2024-12-14T14:00:00' },
    { id: 4, status: 'paid', waiter: 'john', type: 'dineIn', table: 'T02', amount: 67.25, time: '12:45 PM', date: '2024-12-13', timestamp: '2024-12-13T12:45:00' },
    { id: 5, status: 'billed', waiter: 'jane', type: 'dineIn', table: 'T03', amount: 55.00, time: '1:30 PM', date: '2024-12-12', timestamp: '2024-12-12T13:30:00' },
    { id: 6, status: 'paid', waiter: 'mark', type: 'takeaway', table: 'TW02', amount: 42.30, time: '2:15 PM', date: '2024-12-11', timestamp: '2024-12-11T14:15:00' },
    { id: 7, status: 'billed', waiter: 'john', type: 'delivery', table: 'D02', amount: 38.75, time: '3:00 PM', date: '2024-12-10', timestamp: '2024-12-10T15:00:00' },
    { id: 8, status: 'paid', waiter: 'jane', type: 'dineIn', table: 'T04', amount: 29.99, time: '3:45 PM', date: '2024-12-09', timestamp: '2024-12-09T15:45:00' },
];

const getCurrentDateTime = () => {
    return new Date();
};

const getCurrentDate = () => {
    return getCurrentDateTime().toISOString().split('T')[0];
};

const getMaxDate = () => {
    return getCurrentDate();
};

const isFutureDate = (dateString) => {
    const inputDate = new Date(dateString);
    const today = getCurrentDateTime();
    const inputDateStart = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return inputDateStart > todayStart;
};

const calculateDateRange = (rangeType) => {
    const today = getCurrentDateTime();
    const start = new Date(today);
    const end = new Date(today);
    
    switch (rangeType) {
        case 'today':
            start.setDate(today.getDate());
            end.setDate(today.getDate());
            break;
        case 'currentWeek':
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
            end.setDate(today.getDate());
            break;
        case 'lastWeek':
            const lastWeekStart = new Date(today);
            lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
            const lastWeekEnd = new Date(lastWeekStart);
            lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
            start.setTime(lastWeekStart.getTime());
            end.setTime(lastWeekEnd.getTime());
            break;
        case 'last7Days':
            start.setDate(today.getDate() - 6);
            end.setDate(today.getDate());
            break;
        case 'currentMonth':
            start.setDate(1);
            end.setDate(today.getDate());
            break;
        case 'lastMonth':
            start.setMonth(today.getMonth() - 1, 1);
            end.setMonth(today.getMonth(), 0);
            break;
        case 'currentYear':
            start.setMonth(0, 1);
            end.setDate(today.getDate());
            break;
        case 'lastYear':
            start.setFullYear(today.getFullYear() - 1, 0, 1);
            end.setFullYear(today.getFullYear() - 1, 11, 31);
            break;
        default:
            start.setDate(today.getDate());
            end.setDate(today.getDate());
    }
    
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
};

export function Orders() {
    const [dateRangeType, setDateRangeType] = useState('today');
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [orderStatus, setOrderStatus] = useState('all');
    const [waiter, setWaiter] = useState('all');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState('10');
    const [filterBy, setFilterBy] = useState('all');
    const [filteredOrders, setFilteredOrders] = useState(mockOrders);
    const [dateError, setDateError] = useState('');
    const [order, setOrder] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    

    useEffect(() => {
        const { start, end } = calculateDateRange(dateRangeType);
        setStartDate(start);
        setEndDate(end);
    }, []);

    useEffect(() => {
        let filtered = [...mockOrders];

        if (orderStatus !== 'all') {
            filtered = filtered.filter(order => order.status === orderStatus);
        }

        if (waiter !== 'all') {
            filtered = filtered.filter(order => order.waiter === waiter);
        }

        if (filterBy !== 'all') {
            filtered = filtered.filter(order => order.type === filterBy);
        }

        filtered = filtered.filter(order => {
            const orderDate = order.date;
            return orderDate >= startDate && orderDate <= endDate;
        });

        setFilteredOrders(filtered);
    }, [orderStatus, waiter, filterBy, startDate, endDate]);

    const handleDateRangeChange = (value) => {
        setDateRangeType(value);
        setDateError('');
        
        if (value !== 'custom') {
            const { start, end } = calculateDateRange(value);
            setStartDate(start);
            setEndDate(end);
        }
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        
        if (isFutureDate(newStartDate)) {
            setDateError('Start date cannot be in the future');
            return;
        }
        
        setStartDate(newStartDate);
        setDateRangeType('custom');
        setDateError('');
        
        if (newStartDate > endDate) {
            setEndDate(newStartDate);
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        
        if (isFutureDate(newEndDate)) {
            setDateError('End date cannot be in the future');
            return;
        }
        
        setEndDate(newEndDate);
        setDateRangeType('custom');
        setDateError('');
        
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
                console.log('Auto-refreshing orders...');
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
          const data = await window.api.getOrdersWithItems();
        //   console.log("Orders loaded:", data);
          setOrder(data);
        } catch (err) {
          console.error("Failed to load orders:", err);
        }
      };
    
      useEffect(() => {
        loadData();
      }, []);

      const handleOrderCardClick = (ord) => {
        // Transform order items to match drawer format (add key and name if missing)
        const transformedItems = ord.orderItems.map((item, idx) => ({
          key: `${ord.order_number}-${idx}`,
          id: item.menu_item_id,
          name: item.name || `Item ${item.menu_item_id}`,
          qty: item.quantity,
          price: item.price,
          amount: item.amount,
        }));

        const drawerData = {
          orderNumber: ord.order_number,
          admin: "Admin",
          orderType: ord.order_type === 'dine_in' ? 'Dine In' : ord.order_type === 'delivery' ? 'Delivery' : 'Pickup',
          status: ord.status || 'KOT',
          items: transformedItems,
          itemsCount: transformedItems.length,
          discount: ord.discount_amount || 0,
          subTotal: ord.sub_total,
          vat: ord.vat || (ord.sub_total * 0.05),
          total: ord.total,
          balanceReturned: 0,
        };

        setSelectedOrder(drawerData);
        setIsDrawerOpen(true);
      };

    return (
        <div className="min-h-screen bg-white p-2">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders ({filteredOrders.length})</h1>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Auto Refresh Toggle */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Auto Refresh</span>
                        <button
                            onClick={handleAutoRefreshToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Refresh Interval */}
                    <Select value={refreshInterval} onValueChange={handleRefreshIntervalChange}>
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
                {order.length > 0 ? (
                    order.map((ord, idx) => (
                        <div key={ord.order_number || idx} onClick={() => handleOrderCardClick(ord)}>
                            <OrderCard 
                                order={ord}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">No orders found</p>
                            <p className="text-gray-400 text-sm">Try adjusting your filters to find what you're looking for</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Billing Drawer */}
            <BillingDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                orderData={selectedOrder || {}}
            />
        </div>
    );
}