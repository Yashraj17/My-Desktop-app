// import { CircleDot, UserPlus2, Printer, ChevronDown, ShoppingCart, ShieldCheck, NotebookText, CircleUserRound, FilePenLine } from "lucide-react"
// import { Button } from "@/components/ui/button"

// function SegmentedOrderType() {
//   return (
//     <div aria-label="Order type" className="grid grid-cols-3 rounded-lg border bg-secondary text-sm" role="tablist">
//       {[{ label: "Dine In" }, { label: "Delivery" }, { label: "Pickup" }].map((item, i) => (
//         <button
//           key={item.label}
//           role="tab"
//           className={`flex items-center gap-2 px-4 py-3 first:rounded-l-lg last:rounded-r-lg ${i === 0 ? "bg-card shadow-sm" : "opacity-80 hover:opacity-100"}`}
//         >
//           <span className={`inline-flex size-2 rounded-full ${i === 0 ? "bg-chart-3" : "bg-muted-foreground/40"}`} />
//           <span className="text-[13px] font-medium">{item.label}</span>
//         </button>
//       ))}
//     </div>
//   )
// }

// function OrderToolbar() {
//   return (
//     <div className="flex items-center justify-between gap-3">
//       <div className="flex items-center">
//         <div className="inline-flex size-8 items-center justify-center">
//           <span className="sr-only">{"Order icon"}</span>
//           <NotebookText className="size-5  text-black" />
//         </div>
//         <h2 className="text-pretty text-base font-semibold">Order #651</h2>
//       </div>

//       <div className="flex items-center gap-2">
//         <Button variant="secondary" className="h-9 rounded-md border bg-card px-3 text-sm font-semibold">
//           {"+ Add Customer"}
//         </Button>
//         <Button variant="secondary" className="h-9 rounded-md border bg-card px-3 text-sm font-semibold">
//           {"Assign Table"}
//         </Button>
//       </div>
//     </div>
//   )
// }

// function MetaRow() {
//   return (
//     <div className="flex flex-wrap items-center gap-3">
//       <div className="flex items-center gap-2">
//         <span className="text-sm text-muted-foreground">Pax</span>
//         <div className="inline-flex h-9 items-center rounded-md border bg-card px-3">
//           <span className="text-sm font-medium">1</span>
//         </div>
//       </div>

//       <div className="ml-auto flex items-center gap-2">
//         <div className="inline-flex size-9 items-center justify-center rounded-md border bg-card">
//           <FilePenLine size={20} className="size-4 text-muted-foreground" />
//         </div>

//       </div>

//       <div className="flex items-center gap-2">
//         <CircleUserRound size={20} className=" text-muted-foreground" />
//         <span className="text-sm text-muted-foreground">Waiter:</span>
//         <div className="inline-flex h-9 items-center justify-between gap-6 rounded-md border bg-card px-3">
//           <span className="text-sm">Admin</span>
//           <ChevronDown className="size-4 text-muted-foreground" />
//         </div>
//       </div>
//     </div>
//   )
// }

// function ItemsTable() {
//   return (
//     <div className="overflow-hidden rounded-lg border">
//       <div className="grid grid-cols-5 items-center bg-secondary px-4 py-2 text-[12px] font-semibold text-muted-foreground">
//         <div>{"ITEM NAME"}</div>
//         <div className="text-center">{"QTY"}</div>
//         <div className="text-center">{"PRICE"}</div>
//         <div className="text-center">{"AMOUNT"}</div>
//         <div className="text-center">{"ACTION"}</div>
//       </div>

//       <div className="relative h-auto bg-card">
//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-0 bg-center bg-no-repeat opacity-70"
//           style={{
//             backgroundImage: "url('/images/pos-bg.png')",
//             backgroundSize: "cover",
//           }}
//         />
//         <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-3 py-3">
//           <div className=" items-center justify-center">
//             <ShoppingCart className="size-6 text-muted-foreground" />
//           </div>
//           <p className="text-sm font-medium text-muted-foreground">No record found</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// function SummaryPanel() {
//   return (
//     <div className="rounded-lg border bg-card p-4">
//       <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
//         <span className="text-muted-foreground">Item(s)</span>
//         <span className="text-muted-foreground">0</span>

//         <span className="text-muted-foreground">Sub Total (Before Tax)</span>
//         <span className="text-muted-foreground">AED0.00</span>

//         <span className="text-muted-foreground">VAT (5.00%) - Tax Inclusive</span>
//         <span className="text-muted-foreground">AED0.00</span>
//       </div>

//       <div className="mt-4 flex items-center justify-between">
//         <span className="text-base font-semibold">Total</span>
//         <span className="text-base font-bold">AED0.00</span>
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-3">
//         <Button className="h-10 rounded-md bg-[#374151] text-primary-foreground hover:opacity-90">KOT</Button>
//         <Button className="h-10 rounded-md bg-[#374151] text-primary-foreground hover:opacity-90">
//           KOT &amp; Print
//         </Button>
//         </div>
//         <div className="mt-4 grid grid-cols-3 gap-3">

//         <Button className="h-10 rounded-md bg-[#000080]">BILL</Button>
//         <Button className="h-10 rounded-md bg-[#0E9F6E]">
//           Bill &amp; Payment
//         </Button>
//         <Button className=" h-10 rounded-md bg-[#3f83f8] text-primary-foreground">
//           Bill &amp; Print
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default function BillingPOS() {
//   return (
//     <main className="mx-auto space-y-3 ">
//       <SegmentedOrderType />

//       <div className="rounded-lg border bg-card p-3">
//         <OrderToolbar />

//         <div className="my-3 h-px w-full bg-border" />

//         <MetaRow />
//       </div>

//       <ItemsTable />

//       <SummaryPanel />
//     </main>
//   )
// }



import { useState } from "react"
import { ChevronDown, ShoppingCart, NotebookText, CircleUserRound, FilePenLine,Trash  } from "lucide-react"
import { Button } from "@/components/ui/button"
import deliveryExecutiveIcon from "../../components/delivery-executive-icon.svg";
import { BillingDrawer } from "./BillingDrawer";
import Swal from "sweetalert2";

function SegmentedOrderType({ selectedTab, onTabChange }) {
  const tabs = [{ label: "Dine In" }, { label: "Delivery" }, { label: "Pickup" }]

  return (
    <div aria-label="Order type" className="grid grid-cols-3 rounded-lg border bg-secondary text-sm" role="tablist">
      {tabs.map((item, i) => (
        <button
          key={item.label}
          role="tab"
          onClick={() => onTabChange(item.label)}
          aria-selected={selectedTab === item.label}
          className={`flex items-center gap-2 px-4 py-3 first:rounded-l-lg last:rounded-r-lg transition-all ${selectedTab === item.label ? "bg-card shadow-sm" : "opacity-80 hover:opacity-100"
            }`}
        >
          <span
            className={`inline-flex size-2 rounded-full ${selectedTab === item.label ? "bg-chart-3" : "bg-muted-foreground/40"}`}
          />
          <span className="text-[13px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

function OrderToolbar({ selectedTab }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center">
        <div className="inline-flex size-8 items-center justify-center">
          <span className="sr-only">{"Order icon"}</span>
          <NotebookText className="size-5 text-black" />
        </div>
        <h2 className="text-pretty text-base font-semibold">Order #651</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" className="h-9 rounded-md border bg-card px-3 text-sm font-semibold">
          {"+ Add Customer"}
        </Button>
        {selectedTab === "Dine In" && (
          <Button variant="secondary" className="h-9 rounded-md border bg-card px-3 text-sm font-semibold">
            {"Assign Table"}
          </Button>
        )}
      </div>
    </div>
  )
}

function MetaRow({ selectedTab }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {selectedTab === "Dine In" && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Pax</span>
            <div className="inline-flex h-9 items-center rounded-md border bg-card px-3">
              <span className="text-sm font-medium">1</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="inline-flex size-9 items-center justify-center rounded-md border bg-card">
              <FilePenLine size={20} className="size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CircleUserRound size={20} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Waiter:</span>
            <div className="inline-flex h-9 items-center justify-between gap-6 rounded-md border bg-card px-3">
              <span className="text-sm">Admin</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
          </div>
        </>
      )}

      {selectedTab === "Delivery" && (
        <div className="flex items-center gap-2">
          <img
            src={deliveryExecutiveIcon}
            alt="Delivery Executive"
            className="w-5 h-5 text-muted-foreground"
          />
          <div className="inline-flex h-9 items-center justify-between gap-6 rounded-md border bg-card px-3">
            <span className="text-sm text-muted-foreground">Select Delivery Executive</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
          <div className="inline-flex size-9 items-center justify-center rounded-md border bg-card">
            <FilePenLine size={20} className="size-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {selectedTab === "Pickup" && (
        <div className="flex items-center gap-2">
          <div className="inline-flex size-9 items-center justify-center rounded-md border bg-card">
            <FilePenLine size={20} className="size-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}


function ItemsTable({ orderItems = [], onIncrement, onDecrement, onRemove }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="grid grid-cols-5 items-center bg-gray-50 px-4 py-2 text-[12px] font-semibold text-gray-600 uppercase">
        <div className="text-left">ITEM NAME</div>
        <div className="text-center">QTY</div>
        <div className="text-center">PRICE</div>
        <div className="text-center">AMOUNT</div>
        <div className="text-center">ACTION</div>
      </div>

      {/* Table Body */}
      <div className="bg-white">
        {orderItems && orderItems.length > 0 ? (
          orderItems.map((it, index) => (
            <div
              key={it.key}
              className={`grid grid-cols-5 items-center px-4 py-3 text-sm ${index !== orderItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
            >
              {/* Item name */}
              <div className="font-normal text-gray-800 truncate">{it.name}</div>

              {/* Quantity controls */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center rounded-md border border-gray-100">
                  <button
                    type="button"
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 bg-gray-100"
                    onClick={() => onDecrement && onDecrement(it.key)}
                  >
                    –
                  </button>
                  <div className="w-8 text-center font-medium text-[14px]">{it.qty}</div>
                  <button
                    type="button"
                    className="px-2 py-1 text-gray-600 hover:bg-gray-200 bg-gray-100"
                    onClick={() => onIncrement && onIncrement(it.key)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-center text-gray-700 text-[12px]">
                AED {Number(it.price).toFixed(2)}
              </div>

              {/* Amount */}
              <div className="text-center font-semibold text-gray-800 text-[12px]">
                AED {Number(it.amount).toFixed(2)}
              </div>

              {/* Action */}
              <div className="text-center">
                {/* <button
                  className="p-2 text-gray-500 hover:text-red-600 transition"
                  onClick={() => onRemove && onRemove(it.key)}
                  title="Remove item"
                >
                  🗑️
                </button> */}
                <div onClick={() => onRemove && onRemove(it.key)} className="inline-flex size-7 items-center justify-center rounded-md border bg-card">
                  <Trash  size={20} className="size-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <ShoppingCart className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">No record found</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryPanel({ orderItems = [], onBillClick, onBillAndPaymentClick, onOrderInitiate }) {
  const itemsCount = orderItems.reduce((s, it) => s + it.qty, 0);
  const subTotal = orderItems.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  const vat = subTotal * 0.05; // 5% VAT as example
  // const total = subTotal + vat;

  const handleBillClick = async () => {
    try {
      if (onOrderInitiate) {
        const orderData = onOrderInitiate('dine_in', 'bill');
        console.log('Bill clicked - Order Data:', orderData);
        
        // Call the API to initiate order
        const response = await window.api.initiateOrder(orderData);
        console.log('Order initiated successfully:', response);
        
        if (response.success) {
          // Open the drawer if order was created successfully
            Swal.fire({
                    icon: "success",
                    title: "Order created successfully",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                  });
          if (onBillClick) {
            onBillClick();
          }
        } else {
          alert('Failed to create order: ' + response.message);
        }
      }
    } catch (error) {
      console.error('Error initiating order:', error);
      alert('Error creating order: ' + error.message);
    }
  };

  const handleBillAndPaymentClick = async () => {
    try {
      if (onOrderInitiate) {
        const orderData = onOrderInitiate('dine_in', 'bill_and_payment');
        console.log('Bill & Payment clicked - Order Data:', orderData);
        
        // Call the API to initiate order
        const response = await window.api.initiateOrder(orderData);
        console.log('Order initiated successfully:', response);
        
        if (response.success) {
          // Proceed with payment if order was created successfully
          if (onBillAndPaymentClick) {
            onBillAndPaymentClick();
          }
        } else {
          alert('Failed to create order: ' + response.message);
        }
      }
    } catch (error) {
      console.error('Error initiating order:', error);
      alert('Error creating order: ' + error.message);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
        <span className="text-muted-foreground">Item(s)</span>
        <span className="text-muted-foreground">{itemsCount}</span>

        <span className="text-muted-foreground">Sub Total (Before Tax)</span>
        <span className="text-muted-foreground">AED {subTotal.toFixed(2)}</span>

        <span className="text-muted-foreground">VAT (5.00%) - Tax Inclusive</span>
        <span className="text-muted-foreground">AED {vat.toFixed(2)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="text-base font-bold">AED {subTotal.toFixed(2)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button className="h-10 rounded-md bg-[#374151] text-primary-foreground hover:opacity-90">KOT</Button>
        <Button className="h-10 rounded-md bg-[#374151] text-primary-foreground hover:opacity-90">
          KOT &amp; Print
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Button className="h-10 rounded-md bg-[#000080]" onClick={handleBillClick}>BILL</Button>
        <Button className="h-10 rounded-md bg-[#0E9F6E]" onClick={handleBillAndPaymentClick}>Bill &amp; Payment</Button>
        <Button className="h-10 rounded-md bg-[#3f83f8] text-primary-foreground">Bill &amp; Print</Button>
      </div>
    </div>
  )
}

export default function BillingPOS({ orderItems = [], onIncrement, onDecrement, onRemove, onOrderInitiate }) {
  const [selectedTab, setSelectedTab] = useState("Dine In")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const itemsCount = orderItems.reduce((s, it) => s + it.qty, 0)
  const subTotal = orderItems.reduce((s, it) => s + (Number(it.amount) || 0), 0)
  const vat = subTotal * 0.05

  const drawerOrderData = {
    orderNumber: "661",
    admin: "Admin",
    orderType: selectedTab,
    status: "BILLED",
    items: orderItems,
    itemsCount,
    discount: 0,
    subTotal,
    vat,
    total: subTotal,
    balanceReturned: 0,
    onRemoveItem: onRemove,
  }

  return (
    <>
    <main className="mx-auto space-y-3">
      <SegmentedOrderType selectedTab={selectedTab} onTabChange={setSelectedTab} />

      <div className="rounded-lg border bg-card p-3">
        <OrderToolbar selectedTab={selectedTab} />

        <MetaRow selectedTab={selectedTab} />
      </div>

      <ItemsTable orderItems={orderItems} onIncrement={onIncrement} onDecrement={onDecrement} onRemove={onRemove} />

      <SummaryPanel 
        orderItems={orderItems} 
        onBillClick={() => setIsDrawerOpen(true)}
        onBillAndPaymentClick={() => setIsDrawerOpen(true)}
        onOrderInitiate={onOrderInitiate}
      />
    </main>
    <BillingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderData={drawerOrderData}
    />
    </>
  )
}