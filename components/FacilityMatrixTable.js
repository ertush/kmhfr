// components/FacilityMatrixTable.js
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useFacilityMatrixData } from "../hooks/useFacilityMatrixData";
import { transformFacilityData } from "../utils/transformFacilityData";
import { useState, useMemo, useEffect } from "react";

export function FacilityMatrixTable({ countyId }) {
  const { data, loading, error } = useFacilityMatrixData(countyId);
  const [columns, setColumns] = useState([]);

  // Transform the raw API data into a flat structure
  const flatData = useMemo(() => {
    if (!data) return [];
    return transformFacilityData(data);
  }, [data]);

  // Generate columns based on the data
  useEffect(() => {
    if (flatData.length > 0) {
      // Start with fixed columns
      const baseColumns = [
        {
          header: "Level",
          accessorKey: "level",
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          header: "Regulatory Body",
          accessorKey: "regulatoryBody",
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          header: "Facility Type",
          accessorKey: "facilityType",
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
      ];

      // Find all unique metric keys from the data
      const metricKeys = new Set();
      flatData.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (
            ![
              "id",
              "level",
              "regulatoryBody",
              "facilityType",
              "county",
            ].includes(key)
          ) {
            metricKeys.add(key);
          }
        });
      });

      // Add dynamic columns for each metric
      const metricColumns = Array.from(metricKeys).map((metric) => ({
        header: metric,
        accessorKey: metric,
        cell: (info) => info.getValue() || "-",
        footer: (props) => props.column.id,
      }));

      setColumns([...baseColumns, ...metricColumns]);
    }
  }, [flatData]);

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading data: {error}</div>;
  if (!data) return <div className="p-4">No data available</div>;

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <select
          className="px-2 py-1 border rounded"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
