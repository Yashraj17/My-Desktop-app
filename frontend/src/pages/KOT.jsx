import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronDown, ChefHat, Printer, Trash2, User2, CheckCircle2 } from "lucide-react"

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

const getCurrentDateTime = () => {
    return new Date();
};

const getCurrentDate = () => {
    return getCurrentDateTime().toISOString().split('T')[0];
};

const getMaxDate = () => {
    return getCurrentDate();
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

function KOT() {

    const [dateRangeType, setDateRangeType] = useState('today');
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());

    useEffect(() => {
        const { start, end } = calculateDateRange(dateRangeType);
        setStartDate(start);
        setEndDate(end);
    }, []);

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

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-4 pt-4">
                <h1 className="text-2xl font-medium text-gray-900">Default Kitchen KOT</h1>
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 ">
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

                <div className="ps-8">
                    <Button className="whitespace-nowrap items-center font-medium
                    cursor-pointer px-6 text-center rounded-md text-sm border hover:text-gray-900 bg-white text-black
                    hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700 cols
                    dark:hover:text-white dark:text-neutral-400  border-2 border-skin-base dark:border-skin-base">Pending (0) </Button>
                </div>
                <div className="">
                    <Button className="whitespace-nowrap items-center font-medium
                    cursor-pointer px-6 text-center rounded-md text-sm border hover:text-gray-900 bg-white text-black
                    hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700 cols
                    dark:hover:text-white dark:text-neutral-400  border-2 border-skin-base dark:border-skin-base">In Kitchen (0) </Button>
                </div>
                <div className="">
                    <Button className="whitespace-nowrap items-center font-medium
                    cursor-pointer px-6 text-center rounded-md text-sm border hover:text-gray-900 bg-white text-black
                    hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700 cols
                    dark:hover:text-white dark:text-neutral-400  border-2 border-skin-base dark:border-skin-base">Food is Ready (0) </Button>
                </div>
                <div className="">
                    <Button className="whitespace-nowrap items-center font-medium
                    cursor-pointer px-6 text-center rounded-md text-sm border hover:text-gray-900 bg-white text-black
                    hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700 cols
                    dark:hover:text-white dark:text-neutral-400  border-2 border-skin-base dark:border-skin-base">Cancelled (0) </Button>
                </div>

            </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 ps-4">
               <Card className=" rounded-xl border border-input">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-start justify-between px-5">
                        <div>
                            <a href="#" className="text-base font-semibold text-[color:var(--color-brand)] hover:underline">
                                KOT #916
                            </a>
                            <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                                <User2 className="h-4 w-4 text-muted-foreground" />
                                Admin
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-base font-medium text-foreground">Order #647</div>
                            <div className="mt-1 text-xs text-muted-foreground">October 08, 18:51 PM</div>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center justify-end px-5 pt-3">
                        <Badge variant="outline" className="border border-destructive bg-destructive/10 text-destructive">
                            PENDING CONFIRMATION
                        </Badge>
                    </div>

                    {/* Items box */}
                    <div className="mx-5 mt-4 rounded-lg border border-input bg-card">
                        <div className="rounded-t-lg bg-muted/40 px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground">
                            ITEM NAME
                        </div>
                        <div className="flex items-center justify-between px-5 py-4">
                            <div className="text-sm text-foreground">1 x Falooda</div>
                            <Button variant="outline" className="h-9 gap-2 bg-background">
                                <CheckCircle2 className="h-4 w-4" />
                                Start Cooking
                            </Button>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center gap-4 px-5  pt-4">
                        <Button
                            variant="outline"
                            className="h-12 gap-3 bg-background px-5 text-[color:var(--color-brand)] border-[color:var(--color-brand)]"
                        >
                            <Printer className="h-5 w-5" />
                            Print
                        </Button>
                        <Button variant="outline" className="h-12 gap-3 bg-secondary px-5 border-input">
                            <ChefHat className="h-5 w-5 text-[color:var(--color-warn)]" />
                            Start Cooking
                        </Button>
                        <Button variant="outline" className="h-12 gap-3 bg-destructive/10 px-5 text-destructive border-destructive">
                            <Trash2 className="h-5 w-5" />
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
         
        </div>
    )
}

export default KOT