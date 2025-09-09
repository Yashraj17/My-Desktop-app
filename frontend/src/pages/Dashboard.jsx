

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, ShoppingCart, DollarSign } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 transition-colors duration-300 bg-white dark:bg-gray-900">
      <div>
        <h1 className="text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white">Dashboard</h1>
        <p className="transition-colors duration-300 text-gray-600 dark:text-gray-300">
          Welcome to RestroFox management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-colors duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium transition-colors duration-300 text-gray-900 dark:text-gray-200">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 transition-colors duration-300 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white">1,234</div>
            <p className="text-xs transition-colors duration-300 text-muted-foreground dark:text-gray-400">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium transition-colors duration-300 text-gray-900 dark:text-gray-200">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 transition-colors duration-300 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white">
              $45,231
            </div>
            <p className="text-xs transition-colors duration-300 text-muted-foreground dark:text-gray-400">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium transition-colors duration-300 text-gray-900 dark:text-gray-200">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 transition-colors duration-300 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white">2,350</div>
            <p className="text-xs transition-colors duration-300 text-muted-foreground dark:text-gray-400">
              +180 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium transition-colors duration-300 text-gray-900 dark:text-gray-200">
              Active Tables
            </CardTitle>
            <BarChart3 className="h-4 w-4 transition-colors duration-300 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold transition-colors duration-300 text-gray-900 dark:text-white">12/20</div>
            <p className="text-xs transition-colors duration-300 text-muted-foreground dark:text-gray-400">
              60% occupancy rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
