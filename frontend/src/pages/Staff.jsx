import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function Staff() {
  const menuItems = [
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: "$12.99", status: "Available" },
    { id: 2, name: "Caesar Salad", category: "Salads", price: "$8.99", status: "Available" },
    { id: 3, name: "Grilled Chicken", category: "Main Course", price: "$15.99", status: "Out of Stock" },
    { id: 4, name: "Chocolate Cake", category: "Desserts", price: "$6.99", status: "Available" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </div>
        <Button className="bg-[#000080] hover:bg-[#000060]">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.category} • {item.price}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
