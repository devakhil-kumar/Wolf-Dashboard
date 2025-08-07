

export async function aggregateSalesDataByStaff(data, location) {
  const aggregatedData = [];

  // Define the mapping for product type keys
  const productTypeMapping = {
    "PPN (6)": "pnncount",
    "TMB (5)": "tmbcount",
    "Outright Mobile / Tablet inc Prepaid": "outriCount",
    "Bundle New (2)": "bundelnewcount",
    "Upgrade & Protect": "upgrade",
    "DPC Mobile / Tablet": "dcpcount",
    "Handset/Plan GP": "gpvalue",
    "Smart watch": "smartWatchCount",
    "Accessory GP total":"accGP",
    "Tyro Plan":"tyro",
    "Gross Profit":"grossprofit",
 
   
  };

  // Get all product types
  const allProductTypes = getAllProductTypes(data);
  // console.log(allProductTypes);

  // Sort the data by StoreName in ascending order
  data.sort((a, b) => a.StoreName.localeCompare(b.StoreName));

  // Filter data by location if not "all"
  const filteredData =
    location === "all"
      ? data
      : data.filter((store) => store.StoreName === location);

  filteredData.forEach((store) => {
    const storeName = store.StoreName;

    const staffAggregations = {};

    store.SalesDataaggregation.forEach((sale) => {
      console.log("sale",sale)
      const key = sale.SalesStaffName;
            // Check if we already have an aggregation for this staff member
      if (!staffAggregations[key]) {
        staffAggregations[key] = {
          salesrep: sale.SalesStaffName,
          SaleValue: 0,
          SaleCount: 0,
          salelocation: storeName,
        };
       
        // Initialize salesRecord with all product types and count as 0
        allProductTypes.forEach((productType) => {
          const mappedType = productTypeMapping[productType] || productType;
          staffAggregations[key][mappedType] = 0;
        });
      }
      staffAggregations[key].SaleCount += sale.SaleCount;
      staffAggregations[key].SaleValue += sale.SaleValue;
      const mappedType =
        productTypeMapping[sale.ProductType] || sale.ProductType;
        if (mappedType === "gpvalue" ||mappedType === "accGP"||mappedType ===  "grossprofit") {
          staffAggregations[key][mappedType] += sale.SaleValue;
        } else {
          staffAggregations[key][mappedType] += sale.SaleCount;
        }
    });

    // Add the staff aggregations for this store to the final result array
    Object.values(staffAggregations).forEach((aggregation) => {
      aggregatedData.push(aggregation);
    });
  });
  // aggregatedData.forEach((staff) => {
  //   if (staff["Telstra Plus"] !== undefined) {
  //     staff["Telstra Plus"] = staff["Telstra Plus"] / 2;
  //   }
  // });
// console.log(aggregatedData)
  return aggregatedData;
}

// Function to get all unique product types
function getAllProductTypes(data) {
  const productTypes = new Set();

  data.forEach((store) => {
    store.SalesDataaggregation.forEach((sale) => {
      productTypes.add(sale.ProductType);
    });
  });

  return Array.from(productTypes);
}
