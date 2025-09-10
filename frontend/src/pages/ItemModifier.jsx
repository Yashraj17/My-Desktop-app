import React, { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '../components/ui/badge';

// Define table columns
const columns = [
    {
        accessorKey: "item_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Item Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-600">
                {row.getValue("item_name")}
            </div>

        ),
        width: "300px",
    },
    {
        accessorKey: "modifier_group_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Modifier Group
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium text-gray-600">
                {row.getValue("modifier_group_name")}
            </div>
        ),
        width: "300px",
    },
    {
        accessorKey: "is_required",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Is Required
            </Button>
        ),
        cell: ({ row }) => {
            const options = row.getValue("is_required");
            return options ? (
                <Badge className={'bg-red-600 text-white hover:bg-emerald-100 mr-2'}>
                    Required
                </Badge>
            ) : (
                <Badge className={'bg-gray-400 text-white hover:bg-emerald-100 mr-2'}>
                    Optional
                </Badge>
            );
        },
    },
    {
        accessorKey: "allow_multiple_selection",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="p-0 font-medium cursor-pointer text-gray-700 hover:bg-transparent"
            >
                Allow Multiple Selection
            </Button>
        ),
        cell: ({ row }) => {
            const options = row.getValue("allow_multiple_selection");
            console.log("hello this is row data", options);
            return options ? (
                <Badge className={'bg-green-600 text-white hover:bg-emerald-100 mr-2'}>
                    Yes
                </Badge>
            ) : (
                <Badge className={'bg-gray-400 text-white hover:bg-emerald-100 mr-2'}>
                    No
                </Badge>
            );
        },
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
                        onClick={() => handleUpdate(row.original)}
                        className="h-8 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(row.original.id)}
                        className="h-8 px-2 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            );
        },
        width: "200px",
    },
];

export function ItemModifiers() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(""); // 🔹 search state
    const [modifierGroups, setModifierGroups] = useState([]);

    const loadModifiers = async () => {
        try {
            const data = await window.api.getModifiers();
            console.log("hello this is item modifier", data)
            setModifierGroups(data);
        } catch (error) {
            console.error("Error loading modifiers:", error);
        }
    };

    const table = useReactTable({
        data: modifierGroups,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // 🔹 enables filtering
        state: {
            sorting,
            globalFilter, // 🔹 search applied here
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        loadModifiers();
    }, []);

    return (
        <>
            <div className="p-5 bg-white block sm:flex items-center justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <div className="mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Item Modifiers
                        </h1>
                    </div>

                    <div className="items-center justify-between block sm:flex">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                                {/* 🔹 Search input wired to globalFilter */}
                                <Input
                                    type="text"
                                    value={globalFilter ?? ""}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search your category here"
                                />
                            </div>
                        </div>
                        <div className="inline-flex gap-x-4 mb-4 sm:mb-0">

                            <Button className="bg-[#000080] cursor-pointer hover:bg-[#000060] dark:text-white">
                                Add Item Modifier
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* /// table */}
            <div className="w-full">
                <div className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-[#F3F4F6] hover:bg-[#F3F4F6] dark:bg-gray-800"
                                >
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
                                        className="border-t hover:bg-[#f0f1f4] bg-white"
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
        </>
    );
}