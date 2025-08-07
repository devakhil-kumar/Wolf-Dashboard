import xml2js from "xml2js"
import axios from "axios";
import Customer from "../models/customer.js";


function parseAndTransformData(item) {
  const data = {};

  // Map XML fields to MongoDB schema fields
  const fieldMapping = {
    customerid: 'customerId',
    coname: 'companyName',
    name: 'firstName',
    surname: 'lastName',
    shattention: 'shippingAttention',
    shname: 'shippingName',
    shadd: 'shippingAddress',
    shadd1: 'shippingAddress1',
    shadd2: 'shippingAddress2',
    shsub: 'shippingSuburb',
    shpcode: 'shippingPostcode',
    shstate: 'shippingState',
    branchcode: 'branchCode',
    salelocation: 'saleLocation',
    saledate_rep_: 'saleDate',
    salesrep: 'salesRep',
    internalref: 'internalRef',
    promotype: 'promoType',
    invoice: 'invoiceNumber',
    mob: 'mobileNumber',
    imei: 'imei',
    orderref: 'orderRef',
    connectref: 'connectRef',
    accbarcode: 'accBarcode',
    accdesc: 'accDesc',
    amt_rec: 'amtRec',
    purchprice: 'purchasePrice',
    saleprice: 'salePrice',
    discount: 'discount',
    plancat: 'planCat',
    plantype: 'planType',
    carrier: 'carrier',
    contractends_rep_: 'contractEndDate',
    contractperiod: 'contractPeriod',
    phonetype: 'phoneType',
    notes: 'notes',
    code: 'code',
    stockgst: 'stockGst',
    salestax: 'salesTax',
    lastupdated: 'lastUpdated',
    category: 'category',
    mastercategory: 'masterCategory',
    refundinvoice: 'refundInvoice',
    refundrefcode: 'refundRefCode',
    rebate: 'rebate',
    rebaterecamt: 'rebateRecAmt',
    rebatedate: 'rebateDate',
    commission: 'commission',
    commrecamt: 'commRecAmt',
    commdate: 'commDate',
    bonus1: 'bonus1',
    bonusrecamt1: 'bonusRecAmt1',
    bonus1receivedate: 'bonus1ReceivedDate',
    bonus2: 'bonus2',
    bonusrecamt2: 'bonusRecAmt2',
    bonus2receivedate: 'bonus2ReceivedDate',
    repcommamt: 'repCommAmt',
    reppayamt: 'repPayAmt',
    paiddate: 'paidDate',
    adddeddesc1: 'addedDesc1',
    adddedamt1: 'addedAmt1',
    adddeddate1exp: 'addedDate1Exp',
    adddedrecamt1: 'addedRecAmt1',
    adddeddate1: 'addedDate1',
    adddeddesc2: 'addedDesc2',
    adddedamt2: 'addedAmt2',
    adddeddate2exp: 'addedDate2Exp',
    adddedrecamt2: 'addedRecAmt2',
    adddeddate2: 'addedDate2',
    adddeddesc3: 'addedDesc3',
    adddedamt3: 'addedAmt3',
    adddeddate3exp: 'addedDate3Exp',
    adddedrecamt3: 'addedRecAmt3',
    adddeddate3: 'addedDate3',
    activedate: 'activationDate',
    reconciliationnotes: 'reconciliationNotes',
    productcommpercentage: 'productCommPercentage'
  };

  // Iterate through the field mapping
  for (const [xmlField, dbField] of Object.entries(fieldMapping)) {
    if (item[xmlField]) {
      if (dbField.endsWith('Date')) {
        data[dbField] = new Date(item[xmlField][0]);
      } else if (typeof Customer.schema.paths[dbField].instance === 'Number') {
        data[dbField] = parseFloat(item[xmlField][0]);
      } else {
        data[dbField] = item[xmlField][0];
      }
    } else {
      data[dbField] = undefined; 
    }
  }

  return data;
}

function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0].replace(/-/g, '/');
}

// Function to get today's date in the format YYYY/MM/DD
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0].replace(/-/g, '/');
}

export async function fetchAndStoreData() {
  try {
    const yesterdayDate = getYesterdayDate();
    const todayDate = getTodayDate();
    const endpoint = `https://api.clickpos.net/param/ReportQuery/ReportData?Guid=5AF49267-8C88-4C2C-8D69-7AB9B493F340&RptID=5019&RptType=1&Param1=${yesterdayDate}&Param2=${todayDate}`;
    const response = await axios.get("https://api.clickpos.net/param/ReportQuery/ReportData?Guid=5AF49267-8C88-4C2C-8D69-7AB9B493F340&RptID=5019&RptType=1&Param1=2024/06/01&Param2=2024/06/10");
    const xml = response.data;

    const result = await xml2js.parseStringPromise(xml, { mergeAttrs: true });
  
    const dataToStore = result.ClickPOSDataFeed.ClickPOSData.map(item=>{
        const data = {};
        for (const key in Customer.schema.paths) {
          if (Customer.schema.paths.hasOwnProperty(key) && key !== '_id' && key !== '__v') { // Ignore Mongoose specific fields
            const xmlField = item[key.toLowerCase()];
            if (xmlField) {
              const value = xmlField[0];
      
              // Convert to appropriate types if necessary
              if (Customer.schema.paths[key].instance === 'Date') {
                data[key] = new Date(value);
              } else if (Customer.schema.paths[key].instance === 'Number') {
                const numValue = parseFloat(value);
                data[key] = isNaN(numValue) ? null : numValue; // Set to null if value is NaN
              } else {
                data[key] = value;
              }
            } else {
              data[key] = undefined; // Handle missing fields
            }
          }
        }
      
        return data;
      }
    );

   const res= await Customer.insertMany(dataToStore);
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
}

