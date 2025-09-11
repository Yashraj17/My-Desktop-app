// import React, { useState, Fragment, useEffect } from 'react';
// import { UtensilsCrossed, Pencil, Trash2, Search, X, ArrowUpDown, MoreHorizontal, Plus, Edit } from 'lucide-react';
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// // Mock data for demonstration. In a real app, you would fetch this from an API.
// const menuCategories = [
//   { id: 1, name: 'Indian', items: 10, language: 'English', showOnSite: true },
//   { id: 2, name: 'Arabian', items: 10, language: 'English', showOnSite: false },
//   { id: 3, name: 'Western', items: 12, language: 'English', showOnSite: true },
//   { id: 4, name: 'Wingstop', items: 2, language: 'English', showOnSite: true },
// ];


// const Drawer = ({ isOpen, onClose, title, children }) => {
//   useEffect(() => {
//     const handleEsc = (event) => {
//       if (event.keyCode === 27) {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);

//     return () => {
//       window.removeEventListener('keydown', handleEsc);
//     };
//   }, [onClose]);

//   return (
//     <div
//       className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//     >
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/60"
//         onClick={onClose}
//         aria-hidden="true"
//       ></div>

//       {/* Drawer Panel */}
//       <div
//         className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
//             <button
//               onClick={onClose}
//               className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
//               aria-label="Close drawer"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//           <div className="flex-grow p-6 overflow-y-auto">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




// const data = [
//   {
//     id: "1",
//     itemName: "Comp Water Bottle",
//     category: "Drinks",
//     convention: "+16,24 %",
//     total: "$49,95",
//     rate: "0.59",
//     status: "PENDING",
//   },
//   {
//     id: "2",
//     itemName: "Spring Rolls",
//     category: "Starters",
//     convention: "+19,33 %",
//     total: "$59,95",
//     rate: "0.79",
//     status: "ACTIVE",
//   },
//   {
//     id: "3",
//     itemName: "Classic Cheeseburger",
//     category: "Burgers",
//     convention: "+12,50 %",
//     total: "$32,95",
//     rate: "0.45",
//     status: "ACTIVE",
//   },
//   {
//     id: "4",
//     itemName: "Chocolate Brownie",
//     category: "Desserts",
//     convention: "+22,15 %",
//     total: "$24,95",
//     rate: "0.35",
//     status: "PENDING",
//   }
// ];

// // Define table columns with optional width properties
// const columns = [
//   {
//     accessorKey: "itemName",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
//         >
//           Item Name
//           <ArrowUpDown/>
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="font-medium text-gray-600">{row.getValue("itemName")}</div>
//     ),
//     width: "200px", // Fixed width for this column
//   },
//   {
//     accessorKey: "category",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0 font-medium text-gray-700 hover:bg-transparent"
//         >
//           Category
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-gray-600">{row.getValue("category")}</div>
//     ),
//     // No width specified - will auto-adjust
//   },
//   {
//     accessorKey: "convention",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0 font-medium text-gray-700 hover:bg-transparent"
//         >
//           Convention
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-green-600 font-medium">{row.getValue("convention")}</div>
//     ),
//     width: "120px", // Fixed width
//   },
//   {
//     accessorKey: "total",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0 font-medium text-gray-700 hover:bg-transparent"
//         >
//           Total
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="font-medium text-gray-900">{row.getValue("total")}</div>
//     ),
//     width: "100px", // Fixed width
//   },
//   {
//     accessorKey: "rate",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0 font-medium text-gray-700 hover:bg-transparent"
//         >
//           Rate
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div className="text-gray-600">{row.getValue("rate")}</div>
//     ),
//     width: "80px", // Fixed width
//   },
//   {
//     accessorKey: "status",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="p-0 font-medium text-gray-700 hover:bg-transparent"
//         >
//           Status
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       const status = row.getValue("status");
//       return (
//         <Badge 
//           className={
//             status === 'PENDING' 
//               ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' 
//               : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
//           }
//         >
//           {status}
//         </Badge>
//       );
//     },
//     width: "100px", // Fixed width
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => {
//       const handleUpdate = () => {
//         console.log("Update item:", row.original);
//       };

//       const handleDelete = () => {
//         console.log("Delete item:", row.original);
//       };

//       return (
//         <div className="flex space-x-2">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handleUpdate}
//             className="h-8 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
//           >
//             <Edit className="h-4 w-4 mr-1" />
//             Update
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handleDelete}
//             className="h-8 px-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
//           >
//             <Trash2 className="h-4 w-4 mr-1" />
//             Delete
//           </Button>
//         </div>
//       );
//     },
//     width: "180px", // Fixed width for actions
//   }
// ];


// export default function Menus() {
//   const [selectedCategory, setSelectedCategory] = useState('Indian');
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [drawerMode, setDrawerMode] = useState('add'); // 'add' or 'update'
//   const [editingMenuName, setEditingMenuName] = useState('');
//   const [sorting, setSorting] = useState([]);

//   // A simple placeholder function for handling delete actions.
//   const handleDelete = (categoryName) => {
//     console.log(`Delete action for: ${categoryName}`);
//     // In a real app, you would show a confirmation modal before deleting.
//   };

//   const handleOpenDrawer = (mode, categoryName = '') => {
//     setDrawerMode(mode);
//     setEditingMenuName(categoryName);
//     setIsDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setIsDrawerOpen(false);
//     setEditingMenuName('');
//   };

//   const handleSaveMenu = (event) => {
//     event.preventDefault();
//     console.log(`${drawerMode === 'add' ? 'Adding' : 'Updating'} menu:`, event.target.menuName.value);
//     handleCloseDrawer();
//   }

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     state: {
//       sorting,
//     },
//   });


//   return (
//     <>
//       <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
//         <div className="w-full mb-1">
//           <div className="mb-4">
//             <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Menus</h1>
//           </div>

//           <div className="items-center justify-between block sm:flex">
//             <div className="flex items-center mb-4 sm:mb-0">
//               <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
//                 <Input type="text" placeholder="Search your menu here" />
//               </div>
//             </div>
//             <div className="inline-flex gap-x-4 mb-4 sm:mb-0">
//               <Button className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-100  dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
//                 Organize Menu Items
//               </Button>

//               <Button onClick={() => handleOpenDrawer('add')} className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white">
//                 Add Menu
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid p-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {menuCategories.map((category) => (
//           <div
//             key={category.id}
//             onClick={() => setSelectedCategory(category.name)}
//             className={`p-3 rounded-lg flex items-center space-x-4 cursor-pointer transition-all duration-200 border ${selectedCategory === category.name
//               ? 'bg-[#000080] text-white border-[#000080] shadow-lg'
//               : 'bg-white text-gray-700 border-gray-200 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
//               }`}
//           >
//             <div className={`p-2 rounded-md ${selectedCategory === category.name ? 'bg-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
//               <UtensilsCrossed className={`h-5 w-5 ${selectedCategory === category.name ? 'text-black' : 'text-gray-500 dark:text-gray-400'}`} />
//             </div>
//             <div>
//               <p className="font-semibold">{category.name}</p>
//               <p className={`text-sm ${selectedCategory === category.name ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
//                 {category.items} item(s)
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Selected Category Actions Section */}
//       {selectedCategory && (
//         <div className="ps-5">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{selectedCategory}</h1>
//             <button
//               onClick={() => handleOpenDrawer('update', selectedCategory)}
//               className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
//             >
//               <Pencil className="w-4 h-4 mr-2" />
//               Update
//             </button>
//             <button
//               onClick={() => handleDelete(selectedCategory)}
//               className="p-[7px] text-red-600 bg-red-100 rounded-md border-1 border-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
//               aria-label={`Delete ${selectedCategory} menu`}
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//       )}




//       {/* /// table */}

//       <div className="p-5 w-full">

//         <div className="overflow-hidden">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id} className="bg-[#F3F4F6] hover:bg-[#F3F4F6] dark:bg-gray-800">
//                   {headerGroup.headers.map((header) => {
//                     const columnDef = header.column.columnDef;
//                     const width = columnDef.width || "auto";

//                     return (
//                       <TableHead
//                         key={header.id}
//                         className="py-1 whitespace-nowrap px-2"
//                         style={{ width }}
//                       >
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                       </TableHead>
//                     );
//                   })}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                     className="border-t bg-white hover:bg-[#f0f1f4]"
//                   >
//                     {row.getVisibleCells().map((cell) => {
//                       const columnDef = cell.column.columnDef;
//                       const width = columnDef.width || "auto";

//                       return (
//                         <TableCell
//                           key={cell.id}
//                           className="py-2 px-4"
//                           style={{ width }}
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>


//       {/* /// Drawer */}
//       <Drawer
//         isOpen={isDrawerOpen}
//         onClose={handleCloseDrawer}
//         title={drawerMode === 'add' ? 'ADD MENU' : 'UPDATE MENU'}
//       >
//         <form onSubmit={handleSaveMenu} className="space-y-6">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             {drawerMode === 'add'
//               ? 'Enter the menu name below to create a new menu.'
//               : `You are updating the ${editingMenuName} menu.`
//             }
//           </p>

//           <div>
//             <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Language</label>
//             <select id="language" name="language" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//               <option>English</option>
//               <option>Spanish</option>
//               <option>French</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="menuName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Menu Name (English)</label>
//             <input
//               type="text"
//               id="menuName"
//               name="menuName"
//               defaultValue={editingMenuName}
//               placeholder="e.g. Breakfast"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>

//           <div className="flex items-center">
//             <input id="showOnSite" name="showOnSite" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
//             <label htmlFor="showOnSite" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Show on Customer Site</label>
//           </div>

//           <div className="flex justify-start space-x-3 pt-4">
//             {/* <button
//               type="submit"
//               className="px-6 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
//             >
//               Save
//             </button> */}
//             <Button onClick={() => handleOpenDrawer('add')} className="bg-[#000080] hover:bg-[#000060]">
//               Save
//             </Button>
//             <button
//               type="button"
//               onClick={handleCloseDrawer}
//               className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Drawer>
//     </>
//   )}


import React, { useState, Fragment, useEffect } from 'react';
import { UtensilsCrossed, Pencil, Trash2, Search, X, ArrowUpDown, MoreHorizontal, Plus, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Swal from 'sweetalert2';

const Drawer = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Close drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Define table columns to match MenuManagement component
const columns = [
  {
    accessorKey: "item_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
        >
          Item Name
          <ArrowUpDown/>
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      const imagePath = item.imagePath || "./images/food.svg";
      
      return (
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={imagePath}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
            alt={item.item_name}
            onError={(e) => {
              e.target.src = "/images/food.svg";
            }}
          />
          <div className="min-w-0 max-w-[200px] flex-1">
            <div className="font-medium text-gray-800 truncate">{item.item_name}</div>
            <p className="text-sm text-gray-500 truncate">{item.description || "No description"}</p>
          </div>
        </div>
      );
    },
    width: "300px",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-600 whitespace-nowrap">AED {Number(row.getValue("price")).toFixed(2)}</div>
    ),
    width: "100px",
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("category_name")}</div>
    ),
    width: "120px",
  },
  {
    accessorKey: "menu_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent"
        >
          Menu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-600">{row.getValue("menu_name")}</div>
    ),
    width: "120px",
  },
  {
    accessorKey: "is_available",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent text-center"
        >
          Available
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isAvailable = row.getValue("is_available");
      return (
        <div className="text-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 accent-[#00006f]"
            checked={!!isAvailable}
            readOnly
          />
        </div>
      );
    },
    width: "100px",
  },
  {
    accessorKey: "show_on_customer_site",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 font-medium text-gray-700 hover:bg-transparent text-center"
        >
          Show on Site
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const showOnSite = row.getValue("show_on_customer_site");
      return (
        <div className="text-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 accent-[#00006f]"
            checked={!!showOnSite}
            readOnly
          />
        </div>
      );
    },
    width: "120px",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handleUpdate = () => {
        console.log("Update item:", row.original);
      };

      const handleDelete = () => {
        console.log("Delete item:", row.original);
      };

      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdate}
            className="h-8 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="h-8 px-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
      );
    },
    width: "180px",
  }
];

export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingMenuName, setEditingMenuName] = useState('');
  const [sorting, setSorting] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // Load data from API
  const loadData = async () => {
    try {
      const menusData = await window.api.getMenusWithItems();
      const cats = await window.api.getCategories();
      
      // Add image paths to menu items
      const menusWithImagePaths = await Promise.all(
        menusData.map(async (menu) => {
          const itemsWithPaths = await Promise.all(
            menu.items.map(async (item) => ({
              ...item,
              imagePath: item.image
                ? await window.api.getUploadsPath(item.image)
                : "/images/food.svg",
            }))
          );
          return { ...menu, items: itemsWithPaths };
        })
      );
      
      setMenus(menusWithImagePaths);
      setCategories(cats);
      
      if (menusWithImagePaths.length > 0 && !selectedCategory) {
        setSelectedCategory(menusWithImagePaths[0]);
      }
      
      // Set menu items for the selected category
      if (selectedCategory) {
        const activeMenu = menusWithImagePaths.find(m => m.id === selectedCategory.id);
        if (activeMenu) {
          setMenuItems(activeMenu.items);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load menu data",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const activeMenu = menus.find(m => m.id === selectedCategory.id);
      if (activeMenu) {
        // Filter items based on search term
        const filtered = activeMenu.items.filter(item => 
          item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setMenuItems(filtered);
      }
    }
  }, [selectedCategory, menus, searchTerm]);

  // Handle delete menu
  const handleDeleteMenu = async (menu) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this menu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await window.api.deleteMenu(menu.id);
        await loadData();
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1500 });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete menu",
        });
      }
    }
  };

  const handleOpenDrawer = (mode, menu = null) => {
    setDrawerMode(mode);
    setEditingMenuName(menu ? menu.name : '');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingMenuName('');
  };

  const handleSaveMenu = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const menuName = formData.get('menuName');
    const language = formData.get('language');
    const showOnSite = formData.get('showOnSite') === 'on';

    try {
      if (drawerMode === 'add') {
        await window.api.addMenu({
          name: menuName,
          language: language,
          show_on_site: showOnSite
        });
        Swal.fire({
          icon: "success",
          title: "Menu added",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await window.api.updateMenu(selectedCategory.id, {
          name: menuName,
          language: language,
          show_on_site: showOnSite
        });
        Swal.fire({
          icon: "success",
          title: "Menu updated",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      handleCloseDrawer();
      loadData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save menu",
      });
    }
  };

  const table = useReactTable({
    data: menuItems,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Menus</h1>
          </div>

          <div className="items-center justify-between block sm:flex">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="inline-flex gap-x-4 mb-4 sm:mb-0">
              <Button className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer bg-white border border-gray-300 rounded-lg hover:bg-gray-100  dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                Organize Menu Items
              </Button>

              <Button onClick={() => handleOpenDrawer('add')} className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white">
                Add Menu
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid p-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {menus.map((menu) => (
          <div
            key={menu.id}
            onClick={() => setSelectedCategory(menu)}
            className={`p-3 rounded-lg flex items-center space-x-4 cursor-pointer transition-all duration-200 border ${selectedCategory && selectedCategory.id === menu.id
              ? 'bg-[#000080] text-white border-[#000080] shadow-lg'
              : 'bg-white text-gray-700 border-gray-200 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
              }`}
          >
            <div className={`p-2 rounded-md ${selectedCategory && selectedCategory.id === menu.id ? 'bg-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <UtensilsCrossed className={`h-5 w-5 ${selectedCategory && selectedCategory.id === menu.id ? 'text-black' : 'text-gray-500 dark:text-gray-400'}`} />
            </div>
            <div>
              <p className="font-semibold">{menu.name}</p>
              <p className={`text-sm ${selectedCategory && selectedCategory.id === menu.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {menu.items ? menu.items.length : 0} item(s)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Category Actions Section */}
      {selectedCategory && (
        <div className="ps-5">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{selectedCategory.name}</h1>
            <button
              onClick={() => handleOpenDrawer('update', selectedCategory)}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Update
            </button>
            <button
              onClick={() => handleDeleteMenu(selectedCategory)}
              className="p-[7px] text-red-600 bg-red-100 rounded-md border-1 border-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              aria-label={`Delete ${selectedCategory.name} menu`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="p-5 w-full">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-[#F3F4F6] hover:bg-[#F3F4F6] dark:bg-gray-800">
                  {headerGroup.headers.map((header) => {
                    const columnDef = header.column.columnDef;
                    const width = columnDef.width || "auto";

                    return (
                      <TableHead
                        key={header.id}
                        className="py-1 whitespace-nowrap px-2"
                        style={{ width }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-t bg-white hover:bg-[#f0f1f4]"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const columnDef = cell.column.columnDef;
                      const width = columnDef.width || "auto";

                      return (
                        <TableCell
                          key={cell.id}
                          className="py-2 px-4"
                          style={{ width }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={drawerMode === 'add' ? 'ADD MENU' : 'UPDATE MENU'}
      >
        <form onSubmit={handleSaveMenu} className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {drawerMode === 'add'
              ? 'Enter the menu name below to create a new menu.'
              : `You are updating the ${editingMenuName} menu.`
            }
          </p>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Language</label>
            <select id="language" name="language" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div>
            <label htmlFor="menuName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Menu Name (English)</label>
            <input
              type="text"
              id="menuName"
              name="menuName"
              defaultValue={editingMenuName}
              placeholder="e.g. Breakfast"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center">
            <input id="showOnSite" name="showOnSite" type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="showOnSite" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Show on Customer Site</label>
          </div>

          <div className="flex justify-start space-x-3 pt-4">
            <Button type="submit" className="bg-[#000080] hover:bg-[#000060]">
              Save
            </Button>
            <button
              type="button"
              onClick={handleCloseDrawer}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Drawer>
    </>
  );
}