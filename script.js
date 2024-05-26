document
  .getElementById("fileInput")
  .addEventListener("change", handleFile, false);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    const headers = jsonData[0]; // First row as headers
    console.log("Headers:", headers);

    jsonData.shift(); // Remove headers from data rows
    console.log("Data Rows:", jsonData);

    // Map relevant headers to columns
    const columns = [
      { title: "Title", field: "Title", editor: "input" },
      { title: "Brand", field: "Brand", editor: "input" },
      { title: "Number of Items", field: "Number of Items", editor: "input" },
      { title: "FBA Fees", field: "FBA Fees:", editor: "input" },
      { title: "Buy Box", field: "Buy Box: Current", editor: "input" },
      { title: "COG", field: "COG", editor: "input" },
    ];
    // Filter data to only include relevant columns
    const filteredData = jsonData.map((row) => {
      return {
        Title: row[2],
        Brand: row[13],
        "Number of Items": row[6],
        "FBA Fees:": row[8],
        "Buy Box: Current": row[10],
        COG: row[11],
      };
    });

    console.log("Filtered Data:", filteredData);

    new Tabulator("#table", {
      data: filteredData,
      columns: columns,

      layout: "fitColumns",
      pagination: "local",
      paginationSize: 50,
      movableColumns: true,
      resizableRows: true,
      height: "80vh",

      // cellEdited: function (cell) {
      //   console.log("Cell Edited: ", cell.getField(), cell.getValue());
      // },
    });
  };

  reader.readAsArrayBuffer(file);
}
