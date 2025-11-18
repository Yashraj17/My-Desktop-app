import { X, Printer, Phone, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"



export function BillingDrawer({ isOpen, onClose, orderData = {} }) {
  const {
    orderNumber = "661",
    admin = "Admin",
    orderType = "Dine In",
    status = "BILLED",
    items = [],
    itemsCount = 0,
    discount = 0,
    subTotal = 0,
    vat = 0,
    total = 0,
    balanceReturned = 0,
  } = orderData
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-150 transform bg-background overflow-y-auto transition-transform duration-300 ease-in-out border-l ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Order #{orderNumber}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>👤 {admin}</span>
              <span>•</span>
              <span>{orderType}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md border bg-card hover:bg-accent transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Order Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Set Order Status</h4>
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                {status}
              </span>
            </div>

            {/* Status indicators */}
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  ✓
                </div>
                <span className="text-[11px] font-medium text-center">Order Placed</span>
              </div>
              <div className="flex-1 h-0.5 bg-border" />
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  ✓
                </div>
                <span className="text-[11px] font-medium text-center">Order Confirmed</span>
              </div>
              <div className="flex-1 h-0.5 bg-border" />
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  ✓
                </div>
                <span className="text-[11px] font-medium text-center">Order Preparing</span>
              </div>
              <div className="flex-1 h-0.5 bg-border" />
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="size-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-300">
                  ✓
                </div>
                <span className="text-[11px] font-medium text-center">Order Served</span>
              </div>
            </div>
          </div>

          {/* Items Section - Grid Table */}
          <div className="border-t pt-4 space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-5 items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border">
              <span className="text-xs font-semibold text-muted-foreground">ITEM NAME</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">QTY</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">PRICE</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">AMOUNT</span>
              <span className="text-xs font-semibold text-muted-foreground text-center">ACTION</span>
            </div>

            {/* Items Rows */}
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={item.key || idx}
                  className="grid grid-cols-5 items-center gap-2 px-3 py-2 border-b hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium truncate">{item.name}</span>
                  <span className="text-sm text-center text-muted-foreground">{item.qty}</span>
                  <span className="text-sm text-center text-muted-foreground">
                    AED {Number(item.price).toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-center">
                    AED {Number(item.amount).toFixed(2)}
                  </span>
                  <div className="flex justify-center">
                    <button
                      onClick={() => onRemoveItem && onRemoveItem(item.key || idx)}
                      className="inline-flex items-center justify-center p-1.5 hover:bg-red-100 rounded transition-colors"
                      title="Delete item"
                    >
                      <Trash className="size-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No items in order
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Item(s)</span>
              <span className="font-medium">{itemsCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-emerald-600 font-medium">
                {discount > 0 ? "-" : ""}AED {Math.abs(discount).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sub Total (Before Tax)</span>
              <span className="font-medium">AED {Number(subTotal).toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">VAT (5.00%) - Tax Inclusive</span>
              <span className="font-medium">AED {Number(vat).toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">AED {Number(total).toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Balance Returned</span>
              <span className="font-medium">AED {Number(balanceReturned).toFixed(2)}</span>
            </div>
          </div>

          {/* Add Payment Button */}
          <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium">
            Add Payment
          </Button>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="h-10 rounded-md flex items-center justify-center gap-2"
            >
              <Printer className="size-4" />
              <span className="text-xs font-medium">PRINT</span>
            </Button>
            <Button className="h-10 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium">
              Cancel
            </Button>
            <Button className="h-10 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium">
              Delete
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full h-10 rounded-md text-xs font-medium"
          >
            ✕ Close
          </Button>

          {/* WhatsApp Button */}
          <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium flex items-center justify-center gap-2">
            <Phone className="size-4" />
            <span>WhatsApp</span>
          </Button>
        </div>
      </div>
    </>
  )
}
