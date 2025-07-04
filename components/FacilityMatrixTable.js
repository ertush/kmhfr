import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  Button,
  Popover,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Typography,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export function FacilityMatrixTable({ data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterExpandedGroups, setFilterExpandedGroups] = useState({});

  // Helper to determine nesting depth from data structure
  // analyzes the structure of the 'counts' data to determine
  const getDataDepth = () => {
    if (!data?.results?.counts) return 0;
    const sampleCounty = Object.values(data.results.counts)[0] || {};

    // Handle different data structures:
    if (
      data.columns_tree?.length === 1 &&
      !sampleCounty[data.columns_tree[0]]
    ) {
      return 1; // Flat structure (single layer)
    }

    let maxDepth = 0;
    const checkDepth = (obj, depth = 1) => {
      if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;
      maxDepth = Math.max(maxDepth, depth);
      Object.values(obj).forEach((val) => checkDepth(val, depth + 1));
    };
    checkDepth(sampleCounty);
    return maxDepth;
  };

  // Build column hierarchy based on the JSON structure
  // dynamically creates the column definitions for react-table,
  const buildColumnHierarchy = () => {
    if (!data?.results?.counts) return [];

    const depth = getDataDepth();
    const columns = [
      {
        id: "name",
        header: data.base_comparison?.toUpperCase() || "COUNTY",
        accessorKey: "name",
        size: 150,
        cell: ({ getValue }) => (
          <div className="font-medium text-gray-900 text-left">
            {getValue()}
          </div>
        ),
      },
    ];

    // Handle flat structure (1 layer)
    if (depth === 1) {
      // Determine column keys either from data.totals.columns (if available)
      // or by extracting unique keys from the first county's data.
      const columnKeys = data.totals?.columns
        ? data.totals.columns.map((col) => col.key)
        : Object.values(data.results.counts).flatMap((countyData) =>
            Object.keys(countyData).filter((k) => k !== "total"),
          );

      const uniqueKeys = [...new Set(columnKeys)];

      // Filter out any keys that match the base_comparison to avoid duplicate county columns
      const filteredKeys = uniqueKeys.filter((key) => {
        const baseComparisonLower = data.base_comparison?.toLowerCase();
        const keyLower = key.toLowerCase();
        return keyLower !== baseComparisonLower && keyLower !== 'county';
      });

      // Sort keys alphabetically for consistent column order
      filteredKeys.sort().forEach((key) => {
        columns.push({
          id: key,
          header: key.replace(/_/g, " ").toUpperCase(),
          accessorKey: key,
          size: 100,
          cell: ({ getValue }) => (
            <div className="text-center">
              {getValue() !== undefined && getValue() !== null
                ? getValue().toLocaleString()
                : "0"}
            </div>
          ),
        });
      });
    }
    // Handle nested structures
    else {
      const buildNestedColumns = (currentData, prefix = "") => {
        const levelColumns = [];
        const keys = Object.keys(currentData).sort(); // Sort keys for consistent order

        keys.forEach((key) => {
          const value = currentData[key];
          const isLeaf =
            typeof value !== "object" || value === null || Array.isArray(value);
          const fullKey = prefix ? `${prefix}_${key}` : key; // Create unique accessor key for flattened data

          if (key === 'county' || key === 'COUNTY' || key.toLowerCase() === 'county') {
            if (!isLeaf) {
              // Unwrap county object - process its contents directly without creating a "COUNTY" header
              const unwrappedColumns = buildNestedColumns(value, prefix);
              levelColumns.push(...unwrappedColumns);
            }
            return;
          }

          if (isLeaf) {
            levelColumns.push({
              id: fullKey,
              header: key.replace(/_/g, " ").toUpperCase(),
              accessorKey: fullKey,
              size: 100,
              cell: ({ getValue }) => (
                <div className="text-center">
                  {getValue() !== undefined && getValue() !== null
                    ? getValue().toLocaleString()
                    : "0"}
                </div>
              ),
            });
          } else {
            levelColumns.push({
              id: fullKey,
              header: key.replace(/_/g, " ").toUpperCase(),
              columns: buildNestedColumns(value, fullKey),
            });
          }
        });

        return levelColumns;
      };

      const sampleCounty = Object.values(data.results.counts)[0] || {};
      columns.push(...buildNestedColumns(sampleCounty));
    }

    return columns;
  };

  // Memoize columns
  const columns = useMemo(buildColumnHierarchy, [data]);

  // Flatten data for table rows
  // Transforms nested 'counts' data to a flat structure for react-table.
  const tableData = useMemo(() => {
    if (!data?.results?.row_comparison || !data?.results?.counts) return [];

    return data.results.row_comparison.map((row) => {
      const countyName = row.name;
      const countyCounts = data.results.counts[countyName] || {};
      const flatRow = { id: row.id, name: countyName };

      // Recursive function to flatten nested structure into a single object
      const flatten = (obj, prefix = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const newKey = prefix ? `${prefix}_${key}` : key;
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            flatten(value, newKey);
          } else {
            flatRow[newKey] = value;
          }
        });
      };

      flatten(countyCounts);
      return flatRow;
    });
  }, [data]);

  // Initialize react-table instance
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
      sorting: [{ id: "name", desc: false }],
    },
  });

  const renderHeaderRows = () => {
    const headerGroups = table.getHeaderGroups();
    if (headerGroups.length === 0) return null;

    // Helper function to check if a header is a county-related column
    const isCountyColumn = (header) => {
      const headerId = header.id?.toLowerCase() || '';
      const headerText = header.column.columnDef.header?.toLowerCase() || '';
      
      const countyVariations = [
        'county', 'subcounty', 'sub-county', 'sub_county', 'ward', 'name'
      ];
      
      return countyVariations.some(variation => 
        headerId.includes(variation) || headerText.includes(variation)
      );
    };

    return headerGroups.map((headerGroup, groupIndex) => (
      <tr key={headerGroup.id}>
        {/* Only render the "name" (COUNTY) header in the first row */}
        {groupIndex === 0 && (
          <th
            key="name-header"
            colSpan={1}
            rowSpan={headerGroups.length}
            className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border border-gray-300 bg-blue-50 sticky left-0 z-0"
            style={{ minWidth: 150 }}
          >
            {data.base_comparison?.toUpperCase() || "COUNTY"}
          </th>
        )}
        {/* Render all other headers, excluding county-related columns */}
        {headerGroup.headers
          .filter((header) => !isCountyColumn(header))
          .map((header) => {
            const isLeaf = !header.column.columns;
            const headerContent = (
              <div className="flex items-center justify-center gap-1">
                {flexRender(header.column.columnDef.header, header.getContext())}
                {isLeaf && (
                  <span className="text-gray-500">
                    {{
                      asc: "↑",
                      desc: "↓",
                    }[header.column.getIsSorted()] ?? null}
                  </span>
                )}
              </div>
            );
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                rowSpan={isLeaf ? headerGroups.length - groupIndex : 1}
                className={`px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300
                             ${isLeaf ? "bg-blue-100 cursor-pointer hover:bg-blue-200" : "bg-blue-50"}
                             ${groupIndex % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}
                            `}
                style={{ minWidth: header.getSize() }}
                onClick={
                  isLeaf ? header.column.getToggleSortingHandler() : undefined
                }
              >
                {headerContent}
              </th>
            );
          })}
      </tr>
    ));
  };
  
  // Popover and column visibility logic
  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  // Toggles the visibility of a specific column
  const toggleColumnVisibility = (columnId) => {
    table.getColumn(columnId)?.toggleVisibility();
  };

  // Resets all columns to visible and clears filters
  const resetAllColumns = () => {
    table.getAllColumns().forEach((column) => {
      if (column.id !== "name") column.toggleVisibility(true);
    });
    setColumnFilters([]);
  };

  // Recursive function to render the column filter tree in the popover
  // creates a nested list of checkboxes for column visibility control.
  const renderFilterTree = (cols) =>
    cols.map((col) => {
      // If the column has nested columns, render it as an expandable group
      if (col.columns) {
        return (
          <Box key={col.id} sx={{ mb: 1 }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer", py: 0.5 }}
              onClick={() =>
                setFilterExpandedGroups((prev) => ({
                  ...prev,
                  [col.id]: !prev[col.id],
                }))
              }
            >
              <IconButton size="small">
                {/* Show ExpandLessIcon (up arrow) when expanded, ExpandMoreIcon (down arrow) when collapsed */}
                {filterExpandedGroups[col.id] !== false ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {col.header}
              </Typography>
            </Box>
            <Collapse in={filterExpandedGroups[col.id] !== false}>
              <Box sx={{ pl: 3, borderLeft: "2px solid #e0e0e0", ml: 1 }}>
                {renderFilterTree(col.columns)}{" "}
                {/* Recursively render nested columns */}
              </Box>
            </Collapse>
          </Box>
        );
      }
      // If it's a leaf column, render a checkbox for its visibility
      return (
        <Box key={col.id} sx={{ py: 0.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={table.getColumn(col.id)?.getIsVisible() ?? true}
                onChange={() => toggleColumnVisibility(col.id)}
                size="small"
              />
            }
            label={col.header}
            sx={{ margin: 0 }}
          />
        </Box>
      );
    });

  const open = Boolean(anchorEl);
  const id = open ? "column-filter-popover" : undefined;

  // Display a message if no data is available
  if (tableData.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 text-lg">No facility data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 max-h-min rounded font-inter">
      {/* Header section with filter button */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button
              variant="outlined"
              size="medium"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Filter Columns
            </Button>
          </div>
        </div>
      </div>

      {/* Column Filter Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div
          className="p-4"
          style={{ width: "320px", maxHeight: "70vh", overflow: "auto" }}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-gray-700">
              Column Visibility
            </h4>
            <Button
              size="small"
              onClick={resetAllColumns}
              className="text-red-600 hover:bg-red-50"
              variant="text"
            >
              Reset All
            </Button>
          </div>
          <Divider sx={{ mb: 2 }} />
          <FormGroup>
            {/* County column is always visible and disabled in the filter */}
            <Box sx={{ py: 0.5 }}>
              <FormControlLabel
                control={<Checkbox checked={true} disabled size="small" />}
                label="COUNTY"
                sx={{ margin: 0, fontWeight: "bold" }}
              />
            </Box>
            {/* Render the rest of the columns in a tree structure */}
            {renderFilterTree(columns.slice(1))}
          </FormGroup>
        </div>
      </Popover>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              {renderHeaderRows()} {/* Render the dynamic header rows */}
            </thead>
            <tbody>
              {/* Render table rows */}
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-3 py-4 whitespace-nowrap text-sm text-gray-800 text-center border border-gray-200 ${
                        // sticky positioning and background for the 'name' column cells
                        cell.column.id === "name"
                          ? "sticky left-0 z-0 bg-white font-medium"
                          : ""
                      }`}
                      style={{ minWidth: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              « First
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹ Previous
            </button>
            <span className="px-2 text-gray-700">
              Page{" "}
              <strong className="font-semibold">
                {table.getState().pagination.pageIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold">{table.getPageCount()}</strong>
            </span>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next ›
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last »
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span>Show:</span>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 15, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FacilityMatrixTable;