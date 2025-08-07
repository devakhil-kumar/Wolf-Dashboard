import Customer from "../models/customer.js";
import { handleGet, handleGetAll } from "../utils/crudHelpers/Get.js";
import { handleGroupByAggregate } from "../utils/crudHelpers/groupByAggregate.js";
import { buildAggregationOperations, changeFormatDateForFetchingData, formatDate } from "../utils/index.js";
import { aggregateSalesDataByStaff} from "../utils/modifyApiData.js";




export const getAll=async (req,res)=>{
  const { salelocation, startDate, endDate } = req.query;
  try {
    const headers = {
      'Content-Type': 'application/json',
      'token': '5AF49267-8C88-4C2C-8D69-7AB9B493F340'
    };
    const startdate = changeFormatDateForFetchingData(startDate);
    const enddate = changeFormatDateForFetchingData(endDate);
      // Fetch data from example.com
      const datares = await fetch(`https://tcpsvr121.clickpos.net/ctime/ctimeapi/Sales/SaleDatafusion?startdate=${startdate}&enddate=${enddate}`, {headers});
      
      // Check if the request was successful
      if (!datares.ok) {
        // console.log(`https://tcpsvr121.clickpos.net/ctime/ctimeapi/Sales/SaleDatafusion?startdate=${startdate}&enddate=${enddate}`)
        throw new Error('Failed to fetch data from example.com');
      }
      
     // Parse the JSON response
     const alldata = await datares.json();
       // Check if alldata is an array
    if (!Array.isArray(alldata)) {
      throw new Error('Expected an array but received a different structure');
    }
    

     const aggregatedData= await aggregateSalesDataByStaff(alldata,'all')
     const filteredData = aggregatedData.filter(item => item.salesrep && item.salesrep.trim() !== "");
     // Merge rows by salesrep
    const mergedData = filteredData.reduce((acc, current) => {
      const existingItem = acc.find(item => item.salesrep === current.salesrep);
      // console.log(existingItem)
      if (existingItem) {
        // Merge logic: sum numeric fields, concatenate strings, etc.
        existingItem.SaleValue += current.SaleValue;
        existingItem.SaleCount += current.SaleCount;
        existingItem.accGP += current.accGP;
        existingItem['Belong NBN'] += current['Belong NBN'];
        existingItem.bundelnewcount += current.bundelnewcount;
        existingItem.dcpcount += current.dcpcount;
        existingItem.grossprofit += current.grossprofit;
        existingItem.gpvalue += current.gpvalue;
        existingItem.outriCount += current.outriCount;
        existingItem.pnncount += current.pnncount;
        existingItem.smartWatchCount += current.smartWatchCount;
        existingItem['Stay Connected'] += current['Stay Connected'];
        existingItem['Telstra Plus'] += current['Telstra Plus'];
        existingItem.tmbcount += current.tmbcount;
        existingItem.tyro += current.tyro;
        existingItem.upgrade += current.upgrade;
        existingItem['Upgrade & Protect Plus (Stay Connected)'] += current['Upgrade & Protect Plus (Stay Connected)'];
        // Add more fields to merge as needed
      } else {
        acc.push({ ...current });
      }
      return acc;
    }, []);


  const missingSalesRepsCount = aggregatedData.filter(item => !item.salesrep).length;
     // Add message about missing names to the response
     const message = missingSalesRepsCount === 0
      ? null
      : missingSalesRepsCount === 1
        ? 'One row missing staff person name.'
        : `${missingSalesRepsCount} rows missing staff person name.`;
        
     const response = {
       data: mergedData,
     
       message: message
     };

    return res.status(200).json( response);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" });

  }
}




export const getCustomer = async (req, res) => {
  try {
    const result = await handleGet(Customer, { _id: req.params.id });
    return res.status(200).json({ customer: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getSalesRepByStore = async (req, res) => {
  const { salelocation, startDate, endDate } = req.query;

  if (!salelocation) {
    return res.status(400).json({ message: "Please provide a salelocation" });
  }

  let dateFilter = {};

  if (startDate && endDate) {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    dateFilter = {
      saledate_rep_: { $gte: formattedStartDate, $lte: formattedEndDate },
    };
  }

  try {
    const filter = {
      salelocation: { $regex: new RegExp(salelocation.toLowerCase(), "i") },
      ...dateFilter,
    };

    const salesreps = await Customer.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$salesrep",
        },
      },
      {
        $project: {
          _id: 0,
          salesrep: "$_id",
        },
      },
    ]);

    res.status(200).json(salesreps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBySearchQuery = async (req, res) => {
  try {
    const query = req.query;

    const searchCriteria = {};

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        searchCriteria[key] = query[key];
      }
    }

    const result = await handleGet(Customer, searchCriteria);
    return res.status(200).json({ customer: result });
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getByGroupByAggregate = async (req, res) => {
  try {
    const { groupBy, aggregateFields, page = 1, limit = 15 } = req.query;

    if (!groupBy) {
      return res
        .status(400)
        .json({ message: "groupBy query parameter is required" });
    }

    const groupId = groupBy
      .split(",")
      .reduce((acc, field) => ({ ...acc, [field]: `$${field}` }), {});
    const aggregationOperations = buildAggregationOperations(
      aggregateFields ? aggregateFields.split(",") : []
    );
    aggregationOperations.count = { $sum: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pipeline = [
      { $group: { _id: groupId, ...aggregationOperations } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ];

    const result = await handleGroupByAggregate(
      Customer,
      pipeline,
      groupId,
      aggregationOperations
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTmbByQuery = async (req, res) => {
  const { field, value, startDate, endDate } = req.query;
  let dateFilter = {};

  if (!field || !value) {
    return res
      .status(400)
      .json({ message: "Please provide both field and value" });
  }

  if (startDate && endDate) {
    dateFilter = { saledate_rep_: { $gte: startDate, $lte: endDate } };
  }

  try {
    const filter = {
      [field]: value,
      ...dateFilter,
    };

    const counts = await Customer.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: {
            salesrep: "$salesrep",
            salelocation: "$salelocation",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          salesrep: "$_id.salesrep",
          salelocation: "$_id.salelocation",
          count: 1,
        },
      },
    ]);

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getDataByStore = async (req, res)=>{
try {
  const { salelocation, startDate, endDate } = req.query;
  if(!salelocation || !startDate || !endDate){
    return res.status(200).json( []);
  }
  if(salelocation.includes("NaN") || startDate.includes("NaN") || endDate.includes("NaN")){
    return res.status(200).json( []);
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'token': '5AF49267-8C88-4C2C-8D69-7AB9B493F340'
  };
  const startdate = changeFormatDateForFetchingData(startDate);
  const enddate = changeFormatDateForFetchingData(endDate);
  
    
    const datares = await fetch(`https://tcpsvr121.clickpos.net/ctime/ctimeapi/Sales/SaleDatafusion?startdate=${startdate}&enddate=${enddate}`, {headers});
    
    // Check if the request was successful
    if (!datares.ok) {
      throw new Error('Failed to fetch data from example.com');
    }
    // Parse the JSON response
    const alldata = await datares.json();
    // console.log("wefadf",alldata)
  const aggregatedData= await aggregateSalesDataByStaff(alldata,salelocation)

    // console.log(aggregatedData)
  const filteredResponse = aggregatedData.filter(item => item.salesrep && item.salesrep.trim() !== "");

  const missingSalesRepsCount = aggregatedData.filter(item => !item.salesrep).length;
  const message = missingSalesRepsCount === 0
      ? null
      : missingSalesRepsCount === 1
        ? 'One row missing staff person name.'
        : `${missingSalesRepsCount} rows missing staff person name.`;
       
  const response = {
    data: filteredResponse,
  
    message: message
  };

    return res.status(200).json( response);
} catch (error) {
  console.log(error)
  res.status(500).json({ message: error.message });
}
}

