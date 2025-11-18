import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import OldMenuItem from '../components/pos/OldMenuItem';
import BillingPOS from '../components/pos/BillingPOS';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuData, setMenuData] = useState([]);
  const [menuItem, setMenuItem] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Show All');

  // 🆕 NEW STATE FOR IDs
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // 🆕 MODAL STATES
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variation, setVariation] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  /// Item Modifiers
  const [showModifiersModal, setShowModifiersModal] = useState(false);
 
  // Order / cart state
  const [orderItems, setOrderItems] = useState([]);

  const addItemToOrder = (item, variation = null) => {
    const key = variation ? `${item.id}::${variation.name}` : `${item.id}`;
    setOrderItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) => p.key === key ? { ...p, qty: p.qty + 1, amount: (p.qty + 1) * p.price } : p);
      }
      const price = variation ? Number(variation.price) || 0 : Number(item.price) || 0;
      const newLine = {
        key,
        id: item.id,
        name: variation ? variation.name : item.item_name || item.name,
        price,
        qty: 1,
        amount: price * 1,
      };
      return [...prev, newLine];
    });
  };

  const incrementOrderQty = (key) => {
    setOrderItems((prev) => prev.map((p) => p.key === key ? { ...p, qty: p.qty + 1, amount: (p.qty + 1) * p.price } : p));
  };

  const decrementOrderQty = (key) => {
    setOrderItems((prev) => prev.flatMap((p) => {
      if (p.key !== key) return p;
      if (p.qty <= 1) return []; // remove when reaches zero
      return { ...p, qty: p.qty - 1, amount: (p.qty - 1) * p.price };
    }));
  };

  const removeOrderItem = (key) => {
    setOrderItems((prev) => prev.filter((p) => p.key !== key));
  };

  // 🆕 ORDER INITIATE FUNCTION
  const orderInitiate = (orderType = "dine_in", action = "bill") => {
    // Generate order number (can be replaced with actual API call)
    const orderNumber = `ORD-${Date.now()}`;

    // Calculate totals from orderItems
    const subTotal = orderItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const vat = subTotal * 0.05; // 5% VAT
    const total = subTotal + vat;

    // Map order items to the required format
    const formattedOrderItems = orderItems.map((item) => {
      // Parse the key to extract menu_item_id and variation name
      // Key format is either "itemId" or "itemId::variationName"
      const keyParts = item.key.split('::');
      const menu_item_id = keyParts[0];
      const menu_item_variation_id = keyParts.length > 1 ? keyParts[1] : null;

      return {
        menu_item_id: parseInt(menu_item_id) || menu_item_id,
        menu_item_variation_id,
        quantity: item.qty,
        price: Number(item.price).toFixed(2),
        amount: Number(item.amount).toFixed(2),
      };
    });

    // Build the order object matching your required schema
    const orderData = {
      order_number: orderNumber,
      table_id: null,
      customer_id: null,
      number_of_pax: 1,
      waiter_id: null,
      status: 'kot',
      sub_total: Number(subTotal).toFixed(2),
      tip_amount: '0.00',
      tip_note: null,
      total: Number(total).toFixed(2),
      amount_paid: '0.00',
      order_type: orderType === 'Dine In' ? 'dine_in' : orderType === 'Delivery' ? 'delivery' : 'pickup',
      discount_type: null,
      discount_value: null,
      discount_amount: null,
      order_status: 'placed',
      delivery_fee: '0.00',
      orderItems: formattedOrderItems,
    };

    console.log('Order Data to be sent:', orderData);

    // Call your API here
    // Example: window.api.initiateOrder(orderData).then(...).catch(...)
    // For now, we'll just log it and return the data
    return orderData;
  };

  const loadData = async () => {
    try {
      const data = await window.api.getMenusWithCategoryItems();
      const parsedData = data.map((item) => ({
        ...item,
        menu: JSON.parse(item.menu)?.en || 'Unnamed Menu',
        itemCategory: item.itemCategory.map((cat) => ({
          ...cat,
          itemName: JSON.parse(cat.itemName)?.en || 'Unnamed Category',
        })),
      }));

      setMenuData(parsedData);

      if (parsedData.length > 0) {
        setSelectedMenu(parsedData[0].menu);
        setSelectedMenuId(parsedData[0].menu_id);
      }
    } catch (error) {
      console.error('Failed to load menu data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedMenu(menuData.length > 0 ? menuData[0].menu : '');
    setSelectedMenuId(menuData.length > 0 ? menuData[0].menu_id : null);
    setSelectedCategory('Show All');
    setSelectedCategoryId(null);
  };

  const handleMenuChange = (value) => {
    setSelectedMenu(value);
    setSelectedCategory('Show All');
    setSelectedCategoryId(null);

    const selected = menuData.find((menu) => menu.menu === value);
    if (selected) {
      setSelectedMenuId(selected.menu_id);
    }
  };

  const currentMenu = menuData.find((menu) => menu.menu === selectedMenu) || {};

  const categories = currentMenu.itemCategory
    ? ['Show All', ...currentMenu.itemCategory.map((cat) => cat.itemName)]
    : ['Show All'];

  const categoryCounts = {};
  if (currentMenu.itemCategory) {
    currentMenu.itemCategory.forEach((cat) => {
      categoryCounts[cat.itemName] = cat.itemCount;
    });
  }

  const loadMenuItemsData = async () => {
    try {
      const data = await window.api.getMenuItemByMenuId(selectedMenuId);
      console.log('Menu Items Data:', data);
      setMenuItem(data);
    } catch (error) {
      console.error('Failed to load menu items data:', error);
    }
  };

  useEffect(() => {
    console.log('Selected Menu ID:', selectedMenuId);
    selectedMenuId && loadMenuItemsData();
  }, [selectedMenuId]);

  // 🆕 HANDLE VARIATION SELECTION
  const handleVariationSelect = (variation) => {
    // when a variation is selected, add it to order and close the Variation modal
    setSelectedVariation(variation);
    if (selectedItem) {
      // variation expected to be { name, price }
      addItemToOrder(selectedItem, variation);
    }
    setShowVariationModal(false);
  };




  return (
    <div className="flex-grow lg:flex h-auto">
      <div className="flex flex-col bg-gray-50 lg:h-full w-full py-4 px-3 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Menu Selector */}
          <div className="flex items-center">
            <Select value={selectedMenu} onValueChange={handleMenuChange}>
              <SelectTrigger className="h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full">
                <SelectValue placeholder="Select Menu" />
              </SelectTrigger>
              <SelectContent>
                {menuData.map((menu) => (
                  <SelectItem
                    className="font-medium text-gray-900 text-[16px]"
                    key={menu.menu}
                    value={menu.menu}
                  >
                    {menu.menu}
                    {selectedMenu !== menu.menu && (
                      <span className="ml-2 text-xs font-semibold px-[6px] py-0.5 rounded-full bg-[#000080] text-white">
                        {menu.count}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="flex-1"></div>
          <div className="flex-1 max-w-md mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search your menu item here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 bg-white rounded-full"
              />
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-10 px-4 border-gray-300 bg-white hover:bg-gray-50 rounded-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="gap-2 flex flex-wrap overflow-x-auto pb-2">
            {categories.map((category) => {
              const isAll = category === 'Show All';
              const categoryObj = currentMenu.itemCategory?.find(
                (cat) => cat.itemName === category
              );

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedCategoryId(
                      isAll ? null : categoryObj?.item_category_id || null
                    );
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full cursor-pointer whitespace-nowrap dark:bg-gray-800 dark:text-gray-200 
                    ${selectedCategory === category
                      ? 'bg-[#000080] text-white hover:bg-[#000080] border-[#000080]'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {category}
                  {!isAll && categoryCounts[category] && (
                    <span>{`(${categoryCounts[category]})`}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 gap-y-4">
          {menuItem
            .filter((item) =>
              selectedCategoryId
                ? parseInt(item.item_category_id) === selectedCategoryId
                : true
            )
            .map((item) => (
              <OldMenuItem
                key={item.id}
                name={item.item_name}
                price={item.price}
                image={'https://picsum.photos/200/200'}
                flagIcon={item.type}
                variations={item.variations}
                onClick={() => {
                  // Only open the Variation modal when variations array has items
                  setSelectedItem(item);
                  setVariation(item?.variations ?? null);
                  if (item?.variations && item.variations.length > 0) {
                    setShowVariationModal(true);
                  } else {
                    // No variations: add directly to order with default qty 1
                    setSelectedVariation(null);
                    addItemToOrder(item, null);
                  }
                }}
              />
            ))}
        </div>
      </div>

      {/* Order Panel */}
      <div className="lg:w-6/12 flex flex-col bg-white border-1 dark:border-gray-700 min-h-screen h-auto px-2 py-2 dark:bg-gray-800">
          <BillingPOS
            orderItems={orderItems}
            onIncrement={incrementOrderQty}
            onDecrement={decrementOrderQty}
            onRemove={removeOrderItem}
            onOrderInitiate={orderInitiate}
          />
      </div>

      {/* 🆕 Item Variation Modal */}
      <Dialog open={showVariationModal} onOpenChange={setShowVariationModal}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>Item Variations</DialogTitle>
            <DialogDescription>
              {selectedItem?.item_name} – Choose a variation
            </DialogDescription>
          </DialogHeader>
          <div className="hidden md:grid grid-cols-3 gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase rounded-md">
            <div>Item Name</div>
            <div className="text-center">Price</div>
            <div className="text-right">Action</div>
          </div>
          <div className="mt-4 space-y-3">
            {/* Example variations */}
            {variation?.map((items, idx) => (
              <div key={items?.id ?? items?.variation ?? idx} className="flex items-center justify-between border p-3 rounded-lg">
                <div>
                  <div className="font-medium">{items?.variation || items?.name}</div>
                </div>
                <div className="text-gray-500 text-sm">AED {items?.price}</div>
                <Button
                  className="bg-[#000080] text-white"
                  onClick={() => handleVariationSelect({
                    name: items?.variation || items?.name || 'Variant',
                    price: Number(items?.price) || 0
                  })}
                >
                  Select
                </Button>
              </div>
            ))}


            {/* <div className="flex items-center justify-between border p-3 rounded-lg">
              <div className="font-medium">16 pcs Boneless</div>
              <div className="text-gray-500 text-sm">AED70.00</div>
              <Button
                className="bg-[#000080] text-white"
                onClick={() => handleVariationSelect({
                  name: '16 pcs Boneless',
                  price: 70.00
                })}
              >
                Select
              </Button>
            </div> */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariationModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🆕 Item Modifiers Modal */}

      <Dialog open={showModifiersModal} onOpenChange={setShowModifiersModal}>
        <DialogContent className="max-w-xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Item Modifiers</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            {/* Choice of Flavours (required, multiple up to 2) */}
            <Accordion type="single" collapsible defaultValue="flavours">
              <AccordionItem value="flavours" className="border-0 mb-2">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                    <div className="flex flex-col items-start gap-1 w-full ">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Choice of Flavours</span>
                        <span className="text-red-500 text-sm">*Required</span>
                      </div>
                      <div className="text-[12px] font-normal">Choose your Favourite Flavours!</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Multiple Selection (Max: 2)
                        </span>
                        <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                          Max Quantity: 2
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-0 pb-0">
                    {/* Header Row */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase">
                        <div className="col-span-5">Option Name</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-3 text-center">Quantity</div>
                        <div className="col-span-2 text-center">Select</div>
                      </div>
                    </div>

                    {/* Flavour List */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                      {[
                        "Citrus Honey Pepper",
                        "Atomic",
                        "Mango Habanero",
                        "Cajun",
                        "Original Hot",
                        "Louisiana Rub",
                        "Mild",
                        "BBQ",
                        "Lemon Pepper",
                        "Garlic Parmesan",
                      ].map((flavor, i) => {
                        const isSelected = flavor === "Citrus Honey Pepper"; // demo: preselected one
                        return (
                          <div
                            key={flavor}
                            className={`px-4 py-3 grid grid-cols-12 gap-4 items-center ${isSelected ? "bg-blue-50/30" : "bg-white"
                              }`}
                          >
                            {/* Option Name */}
                            <div className="col-span-5">
                              <span
                                className={`font-medium ${isSelected ? "text-gray-900" : "text-gray-800"
                                  }`}
                              >
                                {flavor}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="col-span-2 text-center text-gray-600">AED 0.00</div>



                            {/* Quantity Buttons */}

                            <div className="col-span-3">
                              <div className="flex items-center justify-center mx-auto">
                                <button
                                  type="button"
                                  className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 rounded-l px-3 h-7 disabled:opacity-50 disabled:cursor-not-allowed ${!isSelected ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                  disabled={!isSelected}
                                  onClick={() => {/* Add your decrement function here */ }}
                                >
                                  –
                                </button>

                                <input
                                  type="text"
                                  readOnly
                                  value={isSelected ? 1 : 0}
                                  className="w-10 text-center h-7 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />

                                <button
                                  type="button"
                                  className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 rounded-r px-3 h-7 disabled:opacity-50 disabled:cursor-not-allowed ${!isSelected ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                  disabled={!isSelected}
                                  onClick={() => {/* Add your increment function here */ }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {/* Checkbox + Selection Label */}
                            <div className="col-span-2 ps-6 justify-center text-center gap-2">
                              <input
                                type="checkbox"
                                className="w-3 h-3 accent-blue-600"
                                checked={isSelected}
                                readOnly
                              />
                              <div
                                className={`text-[11px] font-medium ${isSelected ? "text-blue-600" : "text-gray-400"
                                  }`}
                              >
                                {/* {isSelected ? "1/2" : "½"} */}
                                {isSelected ? "1/2" : "0/2"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Quantity Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total Quantity:</span>
                        <span className="font-medium text-blue-600">1/2</span>
                      </div>
                    </div>
                  </AccordionContent>

                </div>
              </AccordionItem>

              <AccordionItem value="dips" className="border-0">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline  hover:bg-gray-50">
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-gray-900">Choice of Dips</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Single Selection
                          </span>
                        </div>
                      </div>
                      <div className="text-[12px] font-normal">Choose your favourite Dips!</div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-0 pb-0">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase">
                        <div className="col-span-8">OPTION NAME</div>
                        <div className="col-span-2 text-center">PRICE</div>
                        <div className="col-span-2 text-center">SELECT</div>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {/* Dips options */}
                      {[
                        { name: 'Ranch', price: 'AED 0.00' },
                        { name: 'Honey Mustard', price: 'AED 0.00' },
                        { name: 'Hot Cheddar Cheese', price: 'AED 3.00' }
                      ].map((dip, index) => (
                        <div key={dip.name} className="px-4 py-3 border-b border-gray-100">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-8">
                              <span className="font-medium text-gray-900">{dip.name}</span>
                            </div>
                            <div className="col-span-2 text-center text-gray-600">{dip.price}</div>
                            <div className="col-span-2 flex justify-center">
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                {/* Radio button for single selection */}
                                <div className="w-3 h-3 rounded-full bg-transparent"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowModifiersModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-900 text-white hover:bg-blue-800"
              onClick={() => console.log("save modifiers")}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default POS;
