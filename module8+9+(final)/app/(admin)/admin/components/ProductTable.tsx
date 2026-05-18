/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { products } from "@/app/(user)/user/data/product";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", { header: "Product Name" }),
  columnHelper.accessor("price", { 
    header: "Price", 
    cell: (info) => <span className="font-bold text-blue-600">${info.getValue()}</span> 
  }),
  columnHelper.accessor("rating", { 
    header: "Stock Rating",
    cell: (info) => <span className="text-yellow-500 font-medium">⭐ {info.getValue()}</span>
  }),
  columnHelper.accessor("id", {
    header: "Status",
    cell: () => <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">In Stock</span>
  }),
];

export default function ProductTable() {
  const [sorting, setSorting] = useState<any>([]);

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  className="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-4 text-sm text-slate-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}