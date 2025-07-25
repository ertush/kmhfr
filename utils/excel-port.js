import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (headers, rows, fileName) => {
  // Extract header names
  const headerNames = headers.map((header) => header.column.columnDef.header);

  // Extract row data
  const rowData = rows.map((row) =>
    row.getVisibleCells().map((cell) => cell.getValue()),
  );

  // Combine headers and rows into a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([headerNames, ...rowData]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
