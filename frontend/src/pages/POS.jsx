import React, { useState, useEffect, use } from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import MenuItem from '../components/pos/MenuItem';
import OldMenuItem from '../components/pos/OldMenuItem';
import NewMenuItem from '../components/pos/NewMenuItem';

function POS() {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuData, setMenuData] = useState([]);
    const [menuItem, setMenuItem] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Show All');

    // 🆕 NEW STATE FOR IDS
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const loadData = async () => {
        try {
            const data = await window.api.getMenusWithCategoryItems()
            const parsedData = data.map(item => ({
                ...item,
                menu: JSON.parse(item.menu)?.en || 'Unnamed Menu',
                itemCategory: item.itemCategory.map(cat => ({
                    ...cat,
                    itemName: JSON.parse(cat.itemName)?.en || 'Unnamed Category'
                }))
            }));

            setMenuData(parsedData);

            if (parsedData.length > 0) {
                setSelectedMenu(parsedData[0].menu);
                setSelectedMenuId(parsedData[0].menu_id); // 🆕 set menu_id
            }
        } catch (error) {
            console.error("Failed to load menu data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleReset = () => {
        setSearchTerm('');
        setSelectedMenu(menuData.length > 0 ? menuData[0].menu : '');
        setSelectedMenuId(menuData.length > 0 ? menuData[0].menu_id : null); // 🆕 reset menu_id
        setSelectedCategory('Show All');
        setSelectedCategoryId(null); // 🆕 reset category_id
    };

    const handleMenuChange = (value) => {
        setSelectedMenu(value);
        setSelectedCategory('Show All'); // Reset category
        setSelectedCategoryId(null); // 🆕 Reset category_id

        const selected = menuData.find(menu => menu.menu === value);
        if (selected) {
            setSelectedMenuId(selected.menu_id); // 🆕 Set menu_id
        }
    };

    // Get selected menu object
    const currentMenu = menuData.find(menu => menu.menu === selectedMenu) || {};

    // Categories
    const categories = currentMenu.itemCategory ?
        ['Show All', ...currentMenu.itemCategory.map(cat => cat.itemName)] :
        ['Show All'];

    // Category counts
    const categoryCounts = {};
    if (currentMenu.itemCategory) {
        currentMenu.itemCategory.forEach(cat => {
            categoryCounts[cat.itemName] = cat.itemCount;
        });
    }

    const loadMenuItemsData = async () => {
        try {
            const data = await window.api.getMenuItemByMenuId(selectedMenuId);
            console.log("Menu Items Data:", data);
            setMenuItem(data);
        } catch (error) {
            console.error("Failed to load menu items data:", error);
        }
    };

    // ✅ DEBUG: Show selected IDs
    useEffect(() => {
        console.log("Selected Menu ID:", selectedMenuId);
        selectedMenuId && loadMenuItemsData()
    }, [selectedMenuId]);
console.log("Selected Category ID:", selectedCategoryId);
    return (
        <div className='flex-grow lg:flex h-auto'>
            <div className='flex flex-col bg-gray-50 lg:h-full w-full py-4 px-3 dark:bg-gray-900'>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    {/* Menu Selector */}
                    <div className="flex items-center">
                        <Select value={selectedMenu} onValueChange={handleMenuChange}>
                            <SelectTrigger className=" h-10 text-[16px] font-medium text-gray-900 border-gray-300 bg-white rounded-full">
                                <SelectValue placeholder="Select Menu" />
                            </SelectTrigger>
                            <SelectContent>
                                {menuData.map((menu) => (
                                    <SelectItem className="font-medium text-gray-900 text-[16px]" key={menu.menu} value={menu.menu}>
                                        {menu.menu}
                                        {selectedMenu !== menu.menu && (
                                            <span className='ml-2 text-xs font-semibold px-[6px] py-0.5 rounded-full bg-[#000080] text-white'>
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
                            const categoryObj = currentMenu.itemCategory?.find(cat => cat.itemName === category);

                            return (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setSelectedCategoryId(isAll ? null : categoryObj?.item_category_id || null);
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

                {/* Menu Items Grid (Static for now) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 gap-y-4">
                   
                    {/* {menuItem
                        .filter(item =>
                            // If category is not selected → show all
                            selectedCategoryId ? parseInt(item.item_category_id) === selectedCategoryId : true
                        )
                        .map((item) => (
                            <MenuItem
                                key={item.id}
                                name={item.item_name}
                                price={item.price}
                                image={"https://picsum.photos/200/200"}
                                flagIcon={item.type}
                            />
                        ))
                    } */}

                     {menuItem
                        .filter(item =>
                            // If category is not selected → show all
                            selectedCategoryId ? parseInt(item.item_category_id) === selectedCategoryId : true
                        )
                        .map((item) => (
                            <OldMenuItem
                                key={item.id}
                                name={item.item_name}
                                price={item.price}
                                image={"https://picsum.photos/200/200"}
                                flagIcon={item.type}
                            />
                        ))
                    }
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 gap-y-4">

                     {menuItem
                        .filter(item =>
                            // If category is not selected → show all
                            selectedCategoryId ? parseInt(item.item_category_id) === selectedCategoryId : true
                        )
                        .map((item) => (
                            <NewMenuItem
                                key={item.id}
                                name={item.item_name}
                                price={item.price}
                                image={"https://picsum.photos/200/200"}
                                flagIcon={item.type}
                            />
                        ))
                    }
                // </div> */}
            </div>
    </div>
            {/* Order Panel */}
            <div className='lg:w-6/12 flex flex-col bg-white border-1 dark:border-gray-700 min-h-screen h-auto pr-4 px-2 py-4 dark:bg-gray-800'>
                Order Panel
            </div>
        </div>
    );
}

export default POS;
