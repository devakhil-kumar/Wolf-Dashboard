// import React, { useState, useEffect } from "react";
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Tabs,
//   Tab,
//   Box,
//   TextField,
//   CircularProgress,
//   Checkbox,
//   Typography,
// } from "@mui/material";
// import Navbar from "../components/Navbar";
// // import ExcelExportComponent from '../components/ExportToExcel'; // Adjust the path as needed
// import EnhancedExportComponent from '../components/EnhancedExportComponent'
// import * as XLSX from 'xlsx';
// import { useDispatch, useSelector } from "react-redux";
// import { loadData, AllStore } from "../features/tableDataSlice";
// import {
//   createNpsThunk,
//   getAllNpsThunk,
//   updateNpsThunk,
// } from "../features/npsSlice";
// import {
//   getAllCommissionsThunk,
//   createCommissionThunk,
//   updateCommissionThunk,
// } from "../features/commissionSlice";
// import DateInputs from "../components/DateInputs";
// import CircularIndicator from "../components/CircularIndicator";
// import { getTargetThunk } from "../features/targetSlice";
// import { getKPITargetThunk } from "../features/kpiTargetSlice";
// import FortnightDropdown from "../components/FortnightDropdown";
// import {
//   calculateYearlyFortnights,
//   getLastFourFortnights,
//   getAnps,
// } from "../utils/formatDate";
// import { ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Dashboard() {
//   // State variables
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [selectedTab, setSelectedTab] = useState({
//     index: 1,
//     value: "Traralgon",
//   });

//   const [editingCell, setEditingCell] = useState(null); // To track the cell being edited
//   const [mutableData, setMutableData] = useState([]); // To hold a mutable copy of data
//   const [originalValues, setOriginalValue] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedFortnight, setSelectedFortnight] = useState(null);
//   const [hideColumns, setHideColumns] = useState(true);
//   const [noDataMessage, setNoDataMessage] = useState("");
//   const [KPITargets, setKPITargets] = useState({
//     KPITMB: null,
//     KPIPPN: null,
//     KPIBundle: null,
//     KPITWD: null,
//     KPIDPC: null,
//     KPIACCGP: null,
//     KPIMAIN: 65,
//     NPSVoltarget: 6,
//     NPSScoreTargetMin: 60,    // New field
//     NPSScoreTargetMax: 75,    // New field
//     GPCommissionPercentage: 7,
//     GPTier2Percentage: 5.5,
//     GPTier3Percentage: 7,
//     NPSMultiplierLow: 0.5,    // New field
//     NPSMultiplierMid: 1.0,    // New field
//     NPSMultiplierHigh: 1.5    // New field
//   });





//   // Redux hooks
//   const dispatch = useDispatch();
//   const { data, message, loading, error } = useSelector(
//     (state) => state.tableData
//   );
//   const {
//     target,
//     loading: targetLoading,
//     error: targetError,
//   } = useSelector((state) => state.targets);
//   console.log(target);
//   const { npsData, npsLoading, npsError } = useSelector((state) => state.nps);
//   const {
//     KPITarget,
//     loading: KPILoading,
//     error: KPIError,
//   } = useSelector((state) => state.KPITargets);
//   const {
//     commissions,
//     loading: commissionLoading,
//     error: commissionError,
//   } = useSelector((state) => state.commission);

// // Add auth state from Redux
// const { user, isCreateUserAllowed } = useSelector((state) => state.auth);
  
// // Determine access level
// const READ_ONLY_EMAILS = [
//   // 'gauravisonline@gmail.com',
//   'warragul@wolfstores.com.au',
//   'traralgon@wolfstores.com.au',
//   'torquay@wolfstores.com.au'
// ];

// const isReadOnly = user && READ_ONLY_EMAILS.includes(user.email);
// const hasFullAccess = !isReadOnly && isCreateUserAllowed; 


//   useEffect(() => {
//     if (KPITarget) {
//       setKPITargets({
//         KPITMB: KPITarget.KPITMB ?? null,
//         KPIPPN: KPITarget.KPIPPN ?? null,
//         KPIBundle: KPITarget.KPIBundle ?? null,
//         KPITWD: KPITarget.KPITWD ?? null,
//         KPIDPC: KPITarget.KPIDPC ?? null,
//         KPIACCGP: KPITarget.KPIACCGP ?? null,
//         KPIMAIN: KPITarget.KPIMAIN ?? 65,
//         NPSVoltarget: KPITarget.NPSVoltarget ?? 6,
//         NPSScoreTargetMin: KPITarget.NPSScoreTargetMin ?? 60,    // New field
//         NPSScoreTargetMax: KPITarget.NPSScoreTargetMax ?? 75,    // New field
//         GPCommissionPercentage: KPITarget.GPCommissionPercentage ?? 4,
//         GPTier2Percentage: KPITarget.GPTier2Percentage ?? 5.5,
//         GPTier3Percentage: KPITarget.GPTier3Percentage ?? 7,
//         NPSMultiplierLow: KPITarget.NPSMultiplierLow ?? 0.5,     // New field
//         NPSMultiplierMid: KPITarget.NPSMultiplierMid ?? 1.0,     // New field
//         NPSMultiplierHigh: KPITarget.NPSMultiplierHigh ?? 1.5    // New field
//       });
//     } else {
//       setKPITargets({
//         KPITMB: null,
//         KPIPPN: null,
//         KPIBundle: null,
//         KPITWD: null,
//         KPIDPC: null,
//         KPIACCGP: null,
//         KPIMAIN: 65,
//         NPSVoltarget: 6,
//         NPSScoreTargetMin: 60,    // New field
//         NPSScoreTargetMax: 75,    // New field
//         GPCommissionPercentage: 4,
//         GPTier2Percentage:  5.5,
//         GPTier3Percentage: 7,
//         NPSMultiplierLow: 0.5,    // New field
//         NPSMultiplierMid: 1.0,    // New field
//         NPSMultiplierHigh: 1.5    // New field
//       });
//     }
//   }, [KPITarget]);
//   // console.log(KPITarget, "hhh");

//   // Fetch targets when the selected tab changes
//   // useEffect(() => {

//   //   let salelocation = selectedTab.value;
//   //   if (selectedTab.value === 'All Stores') {
//   //     salelocation = 'all-store';
//   //   }
//   //   dispatch(getTargetThunk(salelocation));
//   // }, [dispatch, selectedTab.value]);

//   useEffect(() => {
//     if (message) {
//       toast.error(message, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   }, [message]);

//   // Helper function to check if a date is valid
//   function isValidDate(dateString) {
//     return !dateString.includes("NaN");
//   }
//   useEffect(() => {
//     // console.log({ fromDate, toDate });
//     let salelocation = selectedTab.value;
//     if (selectedTab.value === "All Stores") {
//       salelocation = "all-store";
//     }

//     const formattedFromDate = formatDate(new Date(fromDate));
//     const formattedToDate = formatDate(new Date(toDate));

//     // Check if the dates are valid before making the API call
//     if (isValidDate(formattedFromDate) && isValidDate(formattedToDate)) {
//       dispatch(
//         getTargetThunk({
//           salelocation,
//           startDate: formattedFromDate,
//           endDate: formattedToDate,
//         })
//       );
//       dispatch(
//         getKPITargetThunk({
//           salelocation,
//           startDate: formattedFromDate,
//           endDate: formattedToDate,
//         })
//       );
//     } else {
//       // console.log("Invalid date detected. Waiting for correct date.");
//     }
//   }, [dispatch, selectedTab, fromDate, toDate]);

//   // Initialize dates and fetch initial data
//   useEffect(() => {
//     const today = new Date();
//     const formattedFromDate = formatDate(new Date(fromDate));
//     const formattedToDate = formatDate(new Date(toDate));

//     // Check if the dates are valid before making the API call
//     if (isValidDate(formattedFromDate) && isValidDate(formattedToDate)) {
//       dispatch(
//         loadData({
//           salelocation: selectedTab.value,
//           startDate: formattedFromDate,
//           endDate: formattedToDate,
//         })
//       );
//     } else {
//       // console.log("Invalid date detected. Waiting for correct date.");
//     }
//   }, [dispatch]);

//   function parseDate(dateString) {
//     const [day, month, year] = dateString.split("/");
//     // Note: months are 0-indexed in JavaScript Date objects
//     return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
//   }

//   const formatDate = (date) => {
//     // console.log(date);
//     const day = String(date.getUTCDate()).padStart(2, "0");
//     const month = String(date.getUTCMonth() + 1).padStart(2, "0");
//     const year = String(date.getUTCFullYear()).slice(2); // Get last 2 digits of the year
//     return `${day}/${month}/${year}`;
//   };

//   const formatforDate = (date) => {
//     const day = String(date.getDate() + 1).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = String(date.getFullYear()); // Get full year
//     return `${year}-${month}-${day}`;
//   };

//   // useEffect(() => {
//   //   const startDate = fromDate.split('-').reverse().join('/');
//   //   const endDate = toDate.split('-').reverse().join('/');
//   //   fetchDataForTab(selectedTab.value, startDate, endDate);

//   //   // Set the no data message
//   //   if (data?.length === 0) {
//   //     setNoDataMessage(`No data found between ${fromDate} and ${toDate}`);
//   //   } else {
//   //     setNoDataMessage('');
//   //   }
//   // }, [fromDate, toDate]);
//   // Fetch data based on tab and date range

//   const fetchDataForTab = (tabValue, startDate, endDate) => {
//     if (tabValue === "All Stores") {
//       // console.log("pressed A");
//       dispatch(AllStore({ startDate, endDate }));
//     } else {
//       // console.log("pressed O");
//       dispatch(loadData({ salelocation: tabValue, startDate, endDate }));
//     }
//   };

//   // Group data by sale location

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     // console.log("pressed");
//     // setSelectedFortnight(null);
//     const selectedTabValue = tabs[newValue];
//     setSelectedTab({ index: newValue, value: selectedTabValue });

//     const formattedFromDate = formatDate(new Date(fromDate));
//     const formattedToDate = formatDate(new Date(toDate));

//     fetchDataForTab(selectedTabValue, formattedFromDate, formattedToDate);
//   };
//   // console.log(error, targetError);

//   // Fetch data based on current date range and tab
//   const fetchData = () => {
//     const startDate = fromDate.split("-").reverse().join("/");
//     const endDate = toDate.split("-").reverse().join("/");
//     fetchDataForTab(selectedTab.value, startDate, endDate);
//   };

//   useEffect(() => {
//     const startDate = fromDate.split("-").reverse().join("/");
//     const endDate = toDate.split("-").reverse().join("/");
//     dispatch(getAllNpsThunk({ startDate, endDate }));
//     dispatch(getAllCommissionsThunk({ startDate, endDate }));
//     console.log({ startDate, endDate });
//   }, [createNpsThunk, updateNpsThunk, dispatch, selectedFortnight]);

//   useEffect(() => {
//     fetchData();
//   }, [fromDate, toDate]);
//   useEffect(() => {
//     setMutableData(data?.map((item) => ({ ...item }))); // Create a mutable copy of data
//   }, [data]);

//   // if (loading) return <p>Loading...</p>;
//   // if (error) return <p>Error: {error}</p>;

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleDoubleClick = (rowIndex, columnId) => {
//     // Store the original value when starting to edit
//     const value = mutableData[rowIndex] ? mutableData[rowIndex][columnId] : "";
//     setOriginalValue(value);
//     setEditingCell({ rowIndex, columnId });
//   };

//   const handleInputChange = (event, rowIndex, columnId) => {
//     setMutableData((prevData) => {
//       const newData = [...prevData];
//       newData[rowIndex][columnId] = event.target.value;
//       return newData;
//     });
//   };

//   const forrmatDate = (date) => {
//     const d = new Date(date);
//     let month = "" + (d.getUTCMonth() + 1); // Use getUTCMonth
//     let day = "" + d.getUTCDate(); // Use getUTCDate
//     const year = d.getUTCFullYear(); // Use getUTCFullYear

//     if (month.length < 2) {
//       month = "0" + month;
//     }
//     if (day.length < 2) {
//       day = "0" + day;
//     }

//     return [year, month, day].join("-");
//   };
//   const currentDateS = forrmatDate(new Date());
//   let isUpdating = false;
//   const handleBlur = async (rowIndex, columnId) => {
//     if (
//       editingCell &&
//       editingCell.rowIndex === rowIndex &&
//       editingCell.columnId === columnId
//     ) {
//       if (isUpdating) {
//         return;
//       }
//       // Get the current value
//       const value = mutableData[rowIndex]
//         ? mutableData[rowIndex][columnId]
//         : "";
//       if (value === originalValues || value.trim() === "") {
//         setEditingCell(null);
//         return;
//       }

//       const newData = [...mutableData];
//       const originalValue = data[rowIndex][columnId];
//       const newValue = newData[rowIndex][columnId];

//       if (newValue !== originalValue) {
//         isUpdating = true;

//         newData[rowIndex][columnId] = newValue;
//         setMutableData(newData);
//         setEditingCell(null);

//         const rowData = newData[rowIndex];
//         const existingNpsEntry = npsData?.find(
//           (entry) =>
//             entry.salesrep === rowData.salesrep &&
//             entry.salelocation === selectedTab.value
//         );
//         // console.log(newData[rowIndex]);

//         // console.log({ existingNpsEntry });
//         const fieldName =
//           columnId === "column-1"
//             ? "NPSVol"
//             : columnId === "column-2"
//               ? "NPSScore"
//               : columnId === "column-3"
//                 ? "adv10_9"
//                 : columnId === "column-4"
//                   ? "pass8_7"
//                   : columnId === "column-5"
//                     ? "detr_less_6"
//                     : null;

//         const npsValue = {
//           salesrep: rowData.salesrep,
//           salelocation: selectedTab.value,
//           createdDate: forrmatDate(new Date()),
//           NPSVol:
//             columnId === "column-1"
//               ? parseFloat(newValue)
//               : existingNpsEntry?.NPSVol || 0,
//           NPSScore:
//             columnId === "column-2"
//               ? parseFloat(newValue)
//               : existingNpsEntry?.NPSScore || 0,
//           adv10_9:
//             columnId === "column-3"
//               ? parseFloat(newValue)
//               : existingNpsEntry?.adv10_9 || 0,
//           pass8_7:
//             columnId === "column-4"
//               ? parseFloat(newValue)
//               : existingNpsEntry?.pass8_7 || 0,
//           detr_less_6:
//             columnId === "column-5"
//               ? parseFloat(newValue)
//               : existingNpsEntry?.detr_less_6 || 0,
//           updatedBy: "Admin",
//           fieldsToBeUpdate: fieldName,
//         };

        
//         if (selectedFortnight !== null) {
//           try {
//             const createdAtFormatted = existingNpsEntry
//               ? forrmatDate(existingNpsEntry.createdDate)
//               : null;
//             const currentDate = formatDate(new Date());
//             const formattedFromDate = formatDate(new Date(fromDate));
//             const formattedToDate = formatDate(new Date(toDate));
//             let CfromDate = parseDate(formattedFromDate);
//             let CtoDate = parseDate(formattedToDate);
//             let Ccurrent = parseDate(currentDate);

//             if (Ccurrent >= CfromDate && Ccurrent <= CtoDate) {

//               if (existingNpsEntry
//                 //  && createdAtFormatted === currentDateS

//               ) {
//                 const createdDate = existingNpsEntry
//                   ? forrmatDate(new Date(existingNpsEntry.createdDate))
//                   : forrmatDate(new Date(fromDate));
//                 npsValue.createdDate = createdDate;
//                 console.log("updat kr rha hu");
//                 await dispatch(updateNpsThunk({ npsData: npsValue }));
//               } else {
//                 console.log("create kr rha hu");
//                 await dispatch(createNpsThunk(npsValue));
//               }

//               // Fetch the updated NPS data
//               await dispatch(
//                 getAllNpsThunk({
//                   startDate: formattedFromDate,
//                   endDate: formattedToDate,
//                 })
//               );
//             } else {
//               const createdDate = existingNpsEntry
//                 ? forrmatDate(new Date(existingNpsEntry.createdDate))
//                 : forrmatDate(new Date(fromDate));
//               npsValue.createdDate = createdDate;

//               if (existingNpsEntry) {
//                 console.log("update kr rha hu");
//                 await dispatch(updateNpsThunk({ npsData: npsValue }));
//               } else {
//                 console.log("create kr rha hu");
//                 await dispatch(createNpsThunk(npsValue));
//               }

//               // Fetch the updated NPS data
//               await dispatch(
//                 getAllNpsThunk({
//                   startDate: formattedFromDate,
//                   endDate: formattedToDate,
//                 })
//               );
//               // alert(
//               //   "2Current date is not within the Current fortnight range. You dont change previuos fortnight NPS ."
//               // );
//             }
//           } catch (error) {
//             console.error("Error updating or creating NPS data:", error);
//           } finally {
//             isUpdating = false;
//           }
//         } else {
//           // Show an alert if selectedFortnight is null
//           alert("Please select a fortnight to update or create data.");
//         }
//       }
//     }
//   };

//   const headerNames = [
//     selectedTab.value,
//     "NPS Vol",
//     "NPS Score",
//     "Adv 10-9",
//     "Pass 8-7",
//     "Detr <6",
//     // `Detr (${target?.detr || 'N/A'})`,
//     `PPN (${target?.ppn || "N/A"})`,
//     `Bundle New (${target?.bundel || "N/A"})`,
//     `TMB (${target?.tmb || "N/A"})`,
//     "Device Protection",
//     // `Tyro (${target?.tyro || "N/A"})`,
//     // `Website BAS (${target?.websitebas || "N/A"})`,
//     `Belong NBN(${target?.tyro || "N/A"})`,
//     `Telstra Plus (${target?.websitebas || "N/A"})`,
//     `Device Security($10/m) (${target?.devicesecurity || "N/A"})`,
//     "Outright Mobile/Tablet Inc Prepaid",
//     "DPC Mobile/Tablet",
    
//     "Smart Watch",
//     `Device Protect to Hand/Tab DPC (${target?.dpc || "N/A"}%)`,
//     `Accessory GP to Handset Sales(${target?.AcceGP_Handset_Sales || "N/A"})`,
//     `Telstra Plus`,
//     "Acc GP",
//     "Handset/Plan GP",
//    `Total GP (T1: ${target?.gpGreenTarget ? Math.floor(target.gpGreenTarget/1000) + "k" : "12k"}, 
//              T2: ${target?.gpTier2Threshold ? Math.floor(target.gpTier2Threshold/1000) + "k" : "14k"}, 
//              T3: ${target?.gpTier3Threshold ? Math.floor(target.gpTier3Threshold/1000) + "k" : "16k"})`,
//     // `Total GP(${target?.gpGreenTarget || "N/A"})`,
//     "Potential Commission",
//     "Commission 2.O",
//   ];

//   const columns = headerNames.map((header, index) => ({
//     id: `column-${index}`,
//     label: header,
//     minWidth: 120,
//     align: "center",
//     format: (value) => value,
//   }));
//   console.log("rtrt", columns)

//   const tabs = ["All Stores", "Traralgon", "Warragul", "Torquay"];

//   const rows = data?.map((item) => {
//     // console.log(item)
//     const rowData = {
//       "column-0":
//         item.salesrep === "" || item.salesrep === null
//           ? "unknown salesrep"
//           : item.salesrep,
//     };

//     // Find all matching NPS rows for the current salesrep
//     // console.log("hggwej", selectedTab.value);
//     const matchingNpsRows = npsData?.filter((npsItem) => {
//       if (selectedTab.value === "All Stores") {
//         return npsItem.salesrep === item.salesrep;
//       } else {
//         return (
//           npsItem.salesrep === item.salesrep &&
//           npsItem.salelocation === selectedTab.value
//         );
//       }
//     });
//     console.log(matchingNpsRows);
//     console.log(npsData);
//     const matchingCommissionRows = commissions?.filter((commissionItem) => {
//       if (selectedTab.value === "All Stores") {
//         return commissionItem.salesrep === item.salesrep;
//       } else {
//         return (
//           commissionItem.salesrep === item.salesrep &&
//           commissionItem.salelocation === selectedTab.value
//         );
//       }
//     });
//     console.log(matchingCommissionRows);
//     console.log(commissions);
//     if (matchingNpsRows?.length > 0) {
//       let aggregatedData = {
//         adv10_9: 0,
//         pass8_7: 0,
//         detr_less_6: 0,
//       };
//       matchingNpsRows.forEach((npsRow, index) => {
//         aggregatedData.adv10_9 += npsRow.adv10_9;
//         aggregatedData.pass8_7 += npsRow.pass8_7;
//         aggregatedData.detr_less_6 += npsRow.detr_less_6;
//         // console.log(`Salesrep: ${npsRow.salesrep}, Aggregated Data:`, aggregatedData);
//         // Calculate NPSVol
//         const NPSVol =
//           aggregatedData.adv10_9 +
//           aggregatedData.pass8_7 +
//           aggregatedData.detr_less_6;

//         // Calculate NPS Score
//         const NPSAdvPercentage =
//           NPSVol !== 0
//             ? ((aggregatedData.adv10_9 / NPSVol) * 100).toFixed(2)
//             : 0;
//         const NPSDetrPercentage =
//           NPSVol !== 0
//             ? ((aggregatedData.detr_less_6 / NPSVol) * 100).toFixed(2)
//             : 0;
//         const NPSScore = Math.round(NPSAdvPercentage - NPSDetrPercentage);
//         // console.log(`Final Aggregated Data for ${item.salesrep}:`, aggregatedData);
//         // console.log(NPSVol, `NPSScore: ${NPSScore}`);
//         // Add NPS data to corresponding columns
//         rowData["column-1"] = NPSVol;
//         rowData["column-2"] = NPSScore;
//         rowData["column-3"] = aggregatedData.adv10_9;
//         rowData["column-4"] = aggregatedData.pass8_7;
//         rowData["column-5"] = aggregatedData.detr_less_6;
//       });
//     } else {
//       // If no matching NPS rows are found, set default values or leave empty
//       rowData["column-1"] = "";
//       rowData["column-2"] = "";
//       rowData["column-3"] = "";
//       rowData["column-4"] = "";
//       rowData["column-5"] = "";
//     }
//     console.log(item)
//     const stayConnectedCount =
//       (item["Upgrade & Protect Plus (Stay Connected)"] || 0) +
//       (item["Stay Connected"] || 0);
//     const upgradeProtectCount = item.upgrade || 0;
//     const dpcCount = item.dcpcount || 1; // Assuming 1 to avoid division by zero

//     const column17Value =
//       Math.round((stayConnectedCount / dpcCount) * 100) + "%";

//     const dpcCount1 = item.dcpcount || 0;
//     const outrightCount = item.outriCount || 0; // Default to 0 if item.outriCount is undefined or null
//     const smartWatchCount = item.smartWatchCount || 0;

//     // const columnACCValue = (
//     //   item.accGP /
//     //   (dpcCount1 + outrightCount + smartWatchCount)
//     // ).toFixed(2);
//     const columnACCValue = (() => {
//       const calculatedValue =
//         item.accGP / (dpcCount1 + outrightCount + smartWatchCount);
//       return isFinite(calculatedValue) ? Math.round(calculatedValue) : "N/A";
//     })();

//     // Calculate KPI score
//     let kpiScore = 0;

//     // PPN KPI (20%)
//     console.log(item.pnncount >= (target?.ppn !== null ? target?.ppn : 0))
//     console.log(item.pnncount)
//     console.log(target?.ppn )
//     if (((item.pnncount || 0) + (item["mob-new"] || 0)) >= (target?.ppn !== null ? target?.ppn : 0)) {
//       kpiScore += KPITargets.KPIPPN !== null ? KPITargets.KPIPPN : 0;
//       console.log("ppn",kpiScore)
//     }


//     console.log(item.bundelnewcount >= (target?.bundel !== null ? target?.bundel : 0))
//     console.log(item.bundelnewcount)
//     console.log(target?.bundel )

//     // New Bundles KPI (25%)
//     if (item.bundelnewcount >= (target?.bundel !== null ? target?.bundel : 0)) {
//       kpiScore += KPITargets.KPIBundle !== null ? KPITargets.KPIBundle : 0;
//       console.log("bundlenew",kpiScore)
//     }
//     // TMB
//     console.log(item.tmbcount >= (target?.tmb !== null ? target?.tmb : 0))
//     console.log(item.tmbcount)
//     console.log(target?.tmb )
//     if (item.tmbcount >= (target?.tmb !== null ? target?.tmb : 0)) {
//       kpiScore += KPITargets.KPITMB !== null ? KPITargets.KPITMB : 0;
//       console.log("tmb",kpiScore)
//     }


//     console.log(item.tyro >= (target?.tyro !== null ? target?.tyro : 0)
//     &&
//     item["Telstra Plus"] >=
//     (target?.websitebas !== null ? target?.websitebas : 0))
//     console.log(item.tyro)
//     console.log(item["Telstra Plus"])
//     console.log(target?.tyro )
//     console.log(target?.websitebas  )
//     if (
//       item.tyro >= (target?.tyro !== null ? target?.tyro : 0)
//       &&
//       item["Telstra Plus"] >=
//       (target?.websitebas !== null ? target?.websitebas : 0)
//       //  &&
//       // item["Device Security (McAfee)"] >=
//       //   (target?.devicesecurity !== null ? target?.devicesecurity : 0)
//     ) {
//       kpiScore += KPITargets.KPITWD !== null ? KPITargets.KPITWD : 0;
//       console.log("TWD",kpiScore)  }

//     // Device Protection KPI (15%)
//     console.log((parseFloat(column17Value) >= (target?.dpc!== null ? target?.dpc : 0)))
//     console.log(parseFloat(column17Value))
//     console.log(target?.dpc )

//     if (parseFloat(column17Value) >= (target?.dpc !== null ? target?.dpc : 0)) {
//       kpiScore += KPITargets.KPIDPC !== null ? KPITargets.KPIDPC : 0;
//       console.log("KPIDPC",kpiScore)
//     }

//     // Accessory GP to Device KPI (25%)
//     console.log( parseFloat(columnACCValue) >=
//     (target?.AcceGP_Handset_Sales !== null ? target?.AcceGP_Handset_Sales : 0))
//     console.log(parseFloat(columnACCValue))
//     console.log(target?.AcceGP_Handset_Sales )
//     if (
//       parseFloat(columnACCValue) >=
//       (target?.AcceGP_Handset_Sales !== null ? target?.AcceGP_Handset_Sales : 0)
//     ) {
//       kpiScore += KPITargets.KPIACCGP !== null ? KPITargets.KPIACCGP : 0;
//       console.log("AcceGP_Handset_Sales",kpiScore)
//     }

//     // Calculate commission
//     console.log({ kpiScore });
    
   
// let commission;

// // First check if gross profit meets minimum threshold
// if (item.grossprofit < (target?.gpGreenTarget || 12000)) {
//   commission = "Not Eligible";
//   console.log(`Commission: Not Eligible | Reason: Gross Profit (${item.grossprofit}) < Minimum Threshold (${target?.gpGreenTarget || 12000})`);
// } 
// // Then check if KPI score meets minimum requirement
// else if (kpiScore >= KPITargets.KPIMAIN) {
//   // Determine commission percentage based on GP tier
//   let commissionPercentage;
  
//   // Tier 3 (highest)
//   if (item.grossprofit >= (target?.gpTier3Threshold || 16000)) {
//     commissionPercentage = KPITargets.GPTier3Percentage;
//   } 
//   // Tier 2 (middle)
//   else if (item.grossprofit >= (target?.gpTier2Threshold || 14000)) {
//     commissionPercentage = KPITargets.GPTier2Percentage;
//   }
//   // Tier 1 (lowest qualifying tier)
//   else {
//     commissionPercentage = KPITargets.GPCommissionPercentage;
//   }
  
//   // Calculate Gross Profit Commission
//   const grossProfitCommission = ((commissionPercentage ?? 7) / 100) * (item.grossprofit ?? 0);
//   console.log(
//     `Gross Profit Commission: $${grossProfitCommission.toFixed(2)} | ` +
//     `Calculated as: (${commissionPercentage ?? 7}% of Gross Profit: $${item.grossprofit ?? 0})`
//   );

//   // Apply KPI percentage
//   const kpiAdjustedCommission = (kpiScore / 100) * grossProfitCommission;
//   console.log(
//     `KPI Adjusted Commission: $${kpiAdjustedCommission.toFixed(2)} | ` +
//     `Calculated as: (${kpiScore}% of Gross Profit Commission: $${grossProfitCommission.toFixed(2)})`
//   );

//   // Apply NPS multiplier
//   const NPSVol = rowData["column-1"];
//   const NPSScore = rowData["column-2"];
  
//   let npsMultiplier = 1;

//   if (NPSVol >= KPITargets.NPSVoltarget && NPSScore >= KPITargets.NPSScoreTargetMax) {
//     // High volume and high score (≥ max target)
//     npsMultiplier = KPITargets.NPSMultiplierHigh;
//   } else if (
//     // NPSVol >= KPITargets.NPSVoltarget && 
//     NPSScore >= KPITargets.NPSScoreTargetMin && 
//     NPSScore < KPITargets.NPSScoreTargetMax
//   ) {
//     // High volume and medium score (between min and max)
//     npsMultiplier = KPITargets.NPSMultiplierMid;
//   } else if (
//     // NPSVol >= KPITargets.NPSVoltarget &&
//      NPSScore < KPITargets.NPSScoreTargetMin) {
//     // High volume but low score (below min)
//     npsMultiplier = KPITargets.NPSMultiplierLow;
//   } else if (NPSVol < KPITargets.NPSVoltarget) {
//     // Low volume (regardless of score)
//     npsMultiplier = KPITargets.NPSMultiplierLow;
//   }
  
//   // if (NPSVol >= KPITargets.NPSVoltarget && NPSScore >= KPITargets.NPSScoreTarget) {
//   //   // High volume and high score (75+)
//   //   npsMultiplier = KPITargets.NPSMultiplierTargetAchiever;
//   // } else if (NPSVol >= KPITargets.NPSVoltarget && NPSScore >= 60 && NPSScore < KPITargets.NPSScoreTarget) {
//   //   // High volume and medium score (60-74)
//   //   npsMultiplier = 1;
//   // } else if (NPSVol >= KPITargets.NPSVoltarget && NPSScore < 60) {
//   //   // High volume but low score (below 60)
//   //   npsMultiplier = KPITargets.NPSMultiplierNotAchievedTarget;
//   // } else if (NPSVol < KPITargets.NPSVoltarget) {
//   //   // Low volume (regardless of score)
//   //   npsMultiplier = KPITargets.NPSMultiplierNotAchievedTarget;
//   // }
  
//   commission = kpiAdjustedCommission * npsMultiplier;
//   commission = commission.toFixed(2);
// } else {
//   console.log(`Commission: Not Eligible | Reason: kpiScore (${kpiScore}) < KPIMAIN (${KPITargets.KPIMAIN})`);
//   commission = `Not Eligible`;
// }
//     const ownerCommission =
//       matchingCommissionRows?.[0]?.ownerCommission || "Not Set";
//     // Add other columns from the 'data' object as needed
//     rowData["column-6"] = (item.pnncount || 0) + (item["mob-new"] || 0);
//     rowData["column-7"] = item.bundelnewcount || 0;
//     rowData["column-8"] = item?.tmbcount|| 0;
//     // rowData["column-9"] = item.upgrade + item.dcpcount;
//     rowData["column-9"] = (item["Upgrade & Protect Plus (Stay Connected)"] || 0) +
//       (item["Stay Connected"] || 0);
//     rowData["column-10"] = item.tyro || 0;
//     // rowData["column-11"] = item["Website BAS"] || 0;
//     rowData["column-11"] = item["Telstra Plus"] || 0;
//     rowData["column-12"] = 0;
//     rowData["column-13"] = item.outriCount;
//     rowData["column-14"] = item.dcpcount;
//     rowData["column-15"] = item["Belong NBN"];
//     rowData["column-16"] = item.smartWatchCount;
//     rowData["column-17"] = column17Value;
//     rowData["column-18"] = columnACCValue;
//     rowData["column-19"] = item["Telstra Plus"];
//     rowData["column-20"] = Math.round(item.accGP);

//     const column21Value = item.grossprofit - item.accGP;
//     const column21flot = Math.round(column21Value);
//     rowData["column-21"] = column21flot;
//     rowData["column-22"] = Math.round(item.grossprofit);
//     rowData["column-23"] = commission;
//     rowData["column-24"] = ownerCommission;

//     return rowData;
//   });

//   const calculateTotals = () => {
//     let totalStayConnected = 0;
//     let totalUpgradeProtect = 0;
//     let totalDPC = 0;

//     // Calculate totals directly from data
//     data?.forEach((item) => {
//       totalStayConnected += isNaN(
//         item["Upgrade & Protect Plus (Stay Connected)"]
//       )
//         ? 0
//         : parseFloat(item["Upgrade & Protect Plus (Stay Connected)"]);
//       totalUpgradeProtect += isNaN(item.upgrade) ? 0 : parseFloat(item.upgrade);
//       totalDPC += isNaN(item.dcpcount) ? 0 : parseFloat(item.dcpcount);
//     });

//     // Filter NPS data based on selected tab
//     const filteredNpsData = npsData?.filter((npsItem) =>
//       selectedTab.value === "All Stores"
//         ? true
//         : npsItem.salelocation === selectedTab.value
//     );

//     const totalAdv10_9 =
//       filteredNpsData?.reduce((sum, item) => sum + item.adv10_9, 0) || 0;
//     const totalPass8_7 =
//       filteredNpsData?.reduce((sum, item) => sum + item.pass8_7, 0) || 0;
//     const totalDetr_less_6 =
//       filteredNpsData?.reduce((sum, item) => sum + item.detr_less_6, 0) || 0;

//     // Calculate total NPS Score
//     const totalNPSVol = totalAdv10_9 + totalPass8_7 + totalDetr_less_6;
//     const NPSAdvPercentage =
//       totalNPSVol !== 0 ? ((totalAdv10_9 / totalNPSVol) * 100).toFixed(2) : 0;
//     const NPSDetrPercentage =
//       totalNPSVol !== 0
//         ? ((totalDetr_less_6 / totalNPSVol) * 100).toFixed(2)
//         : 0;
//     const totalNPSScore = Math.round(NPSAdvPercentage - NPSDetrPercentage);
//     // console.log(NPSAdvPercentage);
//     // console.log(NPSDetrPercentage);
//     // console.log(totalNPSScore);


//       // Calculate average for column 18
//   let column18Avg = 0;
//   const column18 = columns.find((column) => column.id === "column-18");
//   if (column18 && rows && rows.length > 0) {
//     const column18Sum = rows.reduce((sum, row) => {
//       const value = row[column18.id];
//       const numValue =
//         typeof value === "string" && value.startsWith("$")
//           ? parseFloat(value.substring(1))
//           : parseFloat(value);
//       return sum + (isNaN(numValue) ? 0 : numValue);
//     }, 0);
//     column18Avg = column18Sum / rows.length;
//   }

//     const totals = columns.map((column, colIndex) => {
//       if (colIndex === 0) return "Total"; // Label for the first column
//       if (colIndex === 2) {
//         // console.log("Setting column 1 to totalNPSScore:", totalNPSScore);
//         return totalNPSScore;
//       }


//       // For column 18, return the average instead of the sum
//     if (column.id === "column-18") {
//       return Math.round(column18Avg);
//     }

//       const total =
//         rows &&
//         rows.reduce((sum, row) => {
//           const value = row[column.id];
//           // console.log(value,"hhhhhhhh")
//           // Remove dollar sign if present and parse the value
//           const numValue =
//             typeof value === "string" && value.startsWith("$")
//               ? parseFloat(value.substring(1))
//               : parseFloat(value);

//           return sum + (isNaN(numValue) ? 0 : numValue);
//         }, 0);

//       return Math.round(total); // Format the total to 2 decimal places
//     });

//     // Calculate Device Protection to Hand/Tab DPC (50%)
//     const deviceProtectToDPC =
//       totalDPC !== 0
//         ? Math.round((totalStayConnected / totalDPC) * 100) + "%"
//         : "0%";

//     // Assume column-17 is for Device Protection to Hand/Tab DPC
//     const column17Index = columns.findIndex(
//       (column) => column.id === "column-17"
//     );
//     if (column17Index !== -1) {
//       totals[column17Index] = deviceProtectToDPC;
//     }

//     return totals;
//   };
//   const totals = calculateTotals();

//   let isUpdatingCommission = false;

//   const handleCommissionBlur = async (rowIndex, columnId) => {
//     if (
//       editingCell &&
//       editingCell.rowIndex === rowIndex &&
//       editingCell.columnId === columnId
//     ) {
//       if (isUpdatingCommission) {
//         return;
//       }

//       const value = mutableData[rowIndex]
//         ? mutableData[rowIndex][columnId]
//         : "";
//       if (value === originalValues || value.trim() === "") {
//         setEditingCell(null);
//         return;
//       }

//       const newData = [...mutableData];
//       const originalValue = data[rowIndex][columnId];
//       const newValue = newData[rowIndex][columnId];

//       if (newValue !== originalValue) {
//         isUpdatingCommission = true;

//         newData[rowIndex][columnId] = newValue;
//         setMutableData(newData);
//         setEditingCell(null);

//         const rowData = newData[rowIndex];

//         const existingCommissionEntry = commissions?.find(
//           (entry) =>
//             entry.salesrep === rowData.salesrep &&
//             entry.salelocation === selectedTab.value
//         );

//         const commissionValue = {
//           salesrep: rowData.salesrep,
//           salelocation: selectedTab.value,
//           createdDate: forrmatDate(new Date()),
//           ownerCommission: parseFloat(newValue),
//           updatedBy: "Admin", // You might want to replace this with the actual user
//         };

//         if (selectedFortnight !== null) {
//           try {
//             const formattedFromDate = formatDate(new Date(fromDate));
//             const formattedToDate = formatDate(new Date(toDate));
//             const currentDate = formatDate(new Date());
//             let CfromDate = parseDate(formattedFromDate);
//             let CtoDate = parseDate(formattedToDate);
//             let Ccurrent = parseDate(currentDate);

//             if (Ccurrent >= CfromDate && Ccurrent <= CtoDate) {
//               const createdDate = existingCommissionEntry
//                 ? forrmatDate(new Date(existingCommissionEntry.createdDate))
//                 : forrmatDate(new Date(fromDate));
//               commissionValue.createdDate = createdDate;
//               if (existingCommissionEntry) {
//                 await dispatch(
//                   updateCommissionThunk({ commissionData: commissionValue })
//                 );
//               } else {
//                 await dispatch(createCommissionThunk(commissionValue));
//               }
//             } else {
//               const createdDate = existingCommissionEntry
//                 ? forrmatDate(new Date(existingCommissionEntry.createdDate))
//                 : forrmatDate(new Date(fromDate));
//               commissionValue.createdDate = createdDate;

//               if (existingCommissionEntry) {
//                 await dispatch(
//                   updateCommissionThunk({ commissionData: commissionValue })
//                 );
//               } else {
//                 await dispatch(createCommissionThunk(commissionValue));
//               }
//             }

//             // Fetch the updated commission data
//             await dispatch(
//               getAllCommissionsThunk({
//                 startDate: formattedFromDate,
//                 endDate: formattedToDate,
//               })
//             );
//           } catch (error) {
//             console.error("Error updating or creating commission data:", error);
//           } finally {
//             isUpdatingCommission = false;
//           }
//         } else {
//           alert("Please select a fortnight to update or create data.");
//         }
//       }
//     }
//   };

//   const headers = [
//     {
//       colSpan: hideColumns ? 3 : 6,
//       align: "left",
//       percentage: "",
//       visible: true,
//     },
//     { colSpan: 1, align: "center", kpi: "KPIPPN", visible: true },
//     { colSpan: 1, align: "center", kpi: "KPIBundle", visible: true },
//     { colSpan: 1, align: "center", kpi: "KPITMB", visible: true },
//     {
//       colSpan: hideColumns ? 0 : 1,
//       align: "center",
//       percentage: "",
//       visible: !hideColumns,
//     },
//     { colSpan: 2, align: "center", kpi: "KPITWD", visible: true },
//     // {
//     //   colSpan: hideColumns ? 0 : 1,
//     //   align: "center",
//     //   percentage: "",
//     //   visible: true,
//     // },
//     {
//       colSpan: hideColumns ? 1 : 4,
//       align: "center",
//       percentage: "",
//       visible: true,
//     },
//     { colSpan: 1, align: "center", kpi: "KPIDPC", visible: true },
//     { colSpan: 1, align: "center", kpi: "KPIACCGP", visible: true },
//     {
//       colSpan: hideColumns ? 3 : 5,
//       align: "left",
//       percentage: "",
//       visible: true,
//     },
//   ];






// // Add these styles at the component level
// const containerStyles = {
//   height: '100vh',

//   display: 'flex',
//   flexDirection: 'column',
//   overflow: 'hidden',
// };

// const navbarHeight = 30; // Assuming standard Material-UI AppBar height, adjust if different

// const paperStyles = {
//   width: '98%',
//   marginTop: `${navbarHeight }px`, // Account for navbar height plus some margin
//   marginLeft: '15px',
//   padding: '10px',
//   flex: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   minHeight: '200px', // Minimum height when data is less
//   height: `calc(100vh - ${navbarHeight + 20}px)`, // Subtract navbar and margins
// };

// // const tableContainerStyles = {
// //   flex: 1,
// //   overflow: 'auto', // Only table scrolls
// //   borderRadius: '0 0 8px 8px',
// //   border: '2px solid #e0e0e0',
 
// //   borderTop: 'none',
// // };

// const tableWrapperStyles = {
//   flex: rows && rows.length > 10 ? 1 : '0 1 auto', // Grow only when data exceeds minimum rows
//   position: 'relative',
//   overflow: 'hidden',
//   display: 'flex',
//   flexDirection: 'column',
// };

// const tableContainerStyles = {
//   overflow: 'auto',
//   borderRadius: '0 0 8px 8px',
//   border: '2px solid #e0e0e0',
//   borderTop: 'none',
//   flex: '1 1 auto',
// };

// const stickyFooterStyles = {
//   position: 'sticky',
//   bottom: 0,
//   backgroundColor: 'lightgrey',
//   zIndex: 1,
// };



//   return (
//     <div style={containerStyles}>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       <Navbar />
//       <Paper
//         // sx={{ width: "98%", marginTop: 5, marginLeft: "15px", padding: "10px" }}
//         sx={paperStyles}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             borderBottom: "2px solid #e0e0e0",
//             borderRadius: "8px 8px 0 0",
//             borderLeft: "2px solid #e0e0e0",
//             borderRight: "2px solid #e0e0e0",
//             backgroundColor: "#fafafa",
//             flexShrink: 0,
//           }}
//         >
//           <Tabs
//             value={selectedTab.index}
//             onChange={handleTabChange}
//             TabIndicatorProps={{
//               sx: {
//                 backgroundColor: "#54595f", // Set your desired color for the underline
//                 height: "3px", // You can also adjust the height/thickness of the underline
//               },
//             }}
//             textColor="primary"
//             variant="scrollable"
//             scrollButtons="auto"
//             aria-label="scrollable auto tabs example"
//             sx={{ minHeight: "48px" }}
//           >
//             {tabs.map((tab, index) => (
//               <Tab
//                 key={index}
//                 label={tab}
//                 sx={{
//                   minWidth: "120px",
//                   borderRadius: "8px 8px 0 0",
//                   borderLeft: "2px solid #e0e0e0",
//                   borderRight: "2px solid #e0e0e0",
//                   borderTop: "2px solid #e0e0e0",
//                   marginRight: "2px",
//                   paddingY: "25.5px",
//                   "&:hover": {
//                     backgroundColor: "#54595f", // Set your desired hover background color
//                     color: "#FFFFFF", // Set your desired hover text color
//                   },
//                   "&.Mui-selected": {
//                     borderLeft: "2px solid #54595f",
//                     borderRight: "2px solid #54595f",
//                     borderTop: "2px solid #54595f",
//                     backgroundColor: " #54595f",
//                     color: "#FFFFFF", // Keep the selected tab color as primary (or any other color)
//                   },
//                 }}
//               />
//             ))}
//           </Tabs>
//           <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
//             <Typography variant="body1" style={{ marginRight: "8px" }}>
//               Hide Optional Data
//             </Typography>
//             <Checkbox
//               checked={hideColumns}
//               onChange={(e) => setHideColumns(e.target.checked)}
//               color="primary"
//               sx={{
//                 color: "#54595f", // Color when unchecked
//                 "&.Mui-checked": {
//                   color: "#54595f", // Color when checked
//                 },
//                 "&:hover": {
//                   backgroundColor: "#54595f", // Set your desired hover background color
//                   color: "#FFFFFF", // Set your desired hover text color
//                 },
//               }}
//             />
//             <FortnightDropdown
//               selectedFortnight={selectedFortnight}
//               setSelectedFortnight={setSelectedFortnight}
//               setFromDate={setFromDate}
//               setToDate={setToDate}

//             />

//             <DateInputs
//               fromDate={fromDate}
//               toDate={toDate}
//               setFromDate={setFromDate}
//               setToDate={setToDate}
//               fetchData={fetchData}
//             />

// {/* <ExcelExportComponent 
//     data={rows} 
//     columns={columns} 
//     tabValue={selectedTab.value} 
//   /> */}
//   <EnhancedExportComponent 
//     data={rows} 
//     columns={columns} 
//     tabValue={selectedTab.value} 
//     fromDate={fromDate}  // Add this
//     toDate={toDate}      // Add this
//   />
//           </Box>
//         </Box>
//         {loading || targetLoading ? (
//           <Box sx={{ padding: "20px", textAlign: "center", color: "red" }}>
//             <CircularProgress sx={{ margin: "20px auto", display: "block" }} />
//           </Box>
//         ) : (
//           <>
//             <TableContainer
//               // sx={{
//               //   maxHeight: 600,
//               //   borderRadius: "0 0 8px 8px",
//               //   border: "2px solid #e0e0e0",
//               //   borderTop: "none",
//               // }}
//               sx={tableContainerStyles}
//             >
//               <Table stickyHeader aria-label="sticky table">
//                 <TableHead>
//                   <TableRow>
//                     {headers
//                       .filter((header) => header.visible)
//                       .map((header, index) => (
//                         <TableCell
//                           key={index}
//                           colSpan={header.colSpan}
//                           align={header.align}
//                           style={{ borderRight: "1px solid #e0e0e0" }}
//                         >
//                           {header.kpi && KPITargets && (
//                             <div>
//                               {KPITargets[header.kpi] != null
//                                 ? `${KPITargets[header.kpi]}%`
//                                 : "N/A"}
//                             </div>
//                           )}

//                           {header.kpi === "KPITWD" && "Compulsory KPI"}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                   <TableRow>
//                     {columns.map((column, index) => {
//                       // First check if it's column 12 (index 11) - if it is, always hide it
//                       if (index === 12 || index === 19) {
//                         return null;
//                       }

//                       // Then apply other visibility conditions
//                       return (!hideColumns || index > 5 || index < 3) &&
//                         (!hideColumns ||
//                           (index !== 9 &&
//                             // index !== 12 &&
//                             index !== 13 &&
//                             index !== 14 &&
//                             index !== 16 &&
//                             // index !== 19 &&
//                             index !== 20 &&
//                             index !== 21)) ? ( // Conditionally render columns
//                         <TableCell
//                           key={column.id}
//                           align={column.align}
//                           style={{
//                             minWidth: column.minWidth,
//                             fontWeight: "bold",
//                             backgroundColor: "#f5f5f5",
//                             border: "1px solid #e0e0e0",
//                           }}
//                         >
//                           {column.label}
//                         </TableCell>
//                       ) : null;
//                     })}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {rows &&
//                     rows
//                       .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                       )
//                       .map((row, rowIndex) =>
//                         !hideColumns || rowIndex !== rows.length ? ( // Conditionally render rows
//                           <TableRow
//                             hover
//                             role="checkbox"
//                             tabIndex={-1}
//                             key={rowIndex}
//                           >
//                             {columns.map((column, colIndex) => {
//                               const cellKey = `${rowIndex}-${column.id}`;
//                               const value = row[column.id];
//                               const isEditable =hasFullAccess &&
//                                 (colIndex >= 3 && colIndex <= 5) ||
//                                 colIndex === 24; // Make columns 2, 3, 4, 5 editable

//                               // First check if it's column 12 (index 11) - if it is, always hide it
//                               if (colIndex === 12 || colIndex === 19) {
//                                 return null;
//                               }

//                               return (!hideColumns ||
//                                 colIndex > 5 ||
//                                 colIndex < 3) &&
//                                 (!hideColumns ||
//                                   (colIndex !== 9 &&
//                                     // colIndex!== 12 &&
//                                     colIndex !== 13 &&
//                                     colIndex !== 14 &&
//                                     colIndex !== 16 &&
//                                     // colIndex !== 19 &&
//                                     colIndex !== 20 &&
//                                     colIndex !== 21)) ? (
//                                 <TableCell
//                                   key={cellKey}
//                                   align={column.align}
//                                   onClick={() =>
//                                     selectedTab.value !== "All Stores" &&
//                                     isEditable &&
//                                     handleDoubleClick(rowIndex, column.id)
//                                   }
//                                   // onBlur={() =>
//                                   //   selectedTab.value !== "All Stores" &&
//                                   //   isEditable &&
//                                   //   handleBlur(rowIndex, column.id)
//                                   // }
//                                   onBlur={() => {
//                                     if (
//                                       selectedTab.value !== "All Stores" &&
//                                       isEditable
//                                     ) {
//                                       if (colIndex === 24) {
//                                         handleCommissionBlur(
//                                           rowIndex,
//                                           column.id
//                                         );
//                                       } else {
//                                         handleBlur(rowIndex, column.id);
//                                       }
//                                     }
//                                   }}
//                                   style={{
//                                     border: "1px solid #e0e0e0",
//                                     cursor: isEditable ? "pointer" : "default",
//                                     textAlign: "center",
//                                   }}
//                                 >
//                                   {editingCell &&
//                                   editingCell.rowIndex === rowIndex &&
//                                   editingCell.columnId === column.id &&
//                                   hasFullAccess ? (
//                                   <TextField
//                                     value={
//                                       mutableData[rowIndex]
//                                         ? mutableData[rowIndex][column.id]
//                                         : ""
//                                     }
//                                     onChange={(event) =>
//                                       handleInputChange(
//                                         event,
//                                         rowIndex,
//                                         column.id
//                                       )
//                                     }
//                                     onBlur={() =>
//                                       handleBlur(rowIndex, column.id)
//                                     }
//                                     autoFocus
//                                   />
//                                 ) : column.id === "column-8" ||
//                                   column.id === "column-6" ||
//                                   column.id === "column-7" ||
//                                   column.id === "column-10" ||
//                                   column.id === "column-11" ||
//                                   column.id === "column-18" ||
//                                   column.id === "column-17" ||
//                                   column.id === "column-22" ? (
//                                   <Box
//                                     display="flex"
//                                     justifyContent="center"
//                                     alignItems="center"
//                                     width="100%"
//                                   >
//                                     <CircularIndicator
//                                       value={
//                                         (column.id === "column-18" || column.id === "column-22") && value !== "N/A"
//                                           ? Number(value) // Ensure value remains numeric
//                                           : value
//                                       }
//                                       displayValue={
//                                         (column.id === "column-18" || column.id === "column-22") && value !== "N/A"
//                                           ? `$${value}` // Format for display only
//                                           : value
//                                       }
//                                       target={
//                                         column.id === "column-6"
//                                           ? target?.ppn
//                                           : column.id === "column-10"
//                                             ? target?.tyro
//                                             : column.id === "column-11"
//                                               ? target?.websitebas
//                                               : column.id === "column-12"
//                                                 ? target?.devicesecurity
//                                                 : column.id === "column-18"
//                                                   ? target?.AcceGP_Handset_Sales
//                                                   : column.id === "column-17"
//                                                     ? target?.dpc
//                                                     : column.id === "column-22"
//                                                       ? target?.gpGreenTarget
//                                                       : column.id === "column-7"
//                                                         ? target?.bundel
//                                                         : target?.tmb
//                                       }
//                                       isDpcColumn={column.id === "column-17"}
//                                       isGPColumn={column.id === "column-22"}
//                                       tierThresholds={column.id === "column-22" ? {
//                                         tier1: target?.gpGreenTarget || 12000,
//                                         tier2: target?.gpTier2Threshold || 14000,
//                                         tier3: target?.gpTier3Threshold || 16000
//                                       } : null}
//                                       kpiTarget={KPITargets}
//                                     />
//                                   </Box>
//                                 ) : // Add dollar sign for the last three columns
//                                   column.id === "column-18" ||
//                                     column.id === "column-20" ||
//                                     column.id === "column-21" ||
//                                     column.id === "column-22" ||
//                                     (column.id === "column-23" &&
//                                       value !== "Not Set" &&
//                                       value !== "Not Eligible") ||
//                                     (column.id === "column-24" &&
//                                       value !== "Not Set" &&
//                                       value !== "Not Eligible") ? (
//                                     `$${value}`
//                                   ) : (
//                                     value
//                                   )}
                                  
//                                 </TableCell>
//                               ) : null;
//                             })}
//                           </TableRow>
//                         ) : null
//                       )}
//                   <TableRow sx={stickyFooterStyles}>
//                     {totals.map((total, index) => {
//                       // First check if it's column 12 (index 11) - if it is, always hide it
//                       if (index === 12 || index === 19) {
//                         return null;
//                       }
//                       return (!hideColumns || index > 5 || index < 3) &&
//                         (!hideColumns ||
//                           (index !== 9 &&
//                             index !== 12 &&
//                             index !== 13 &&
//                             index !== 14 &&
//                             index !== 16 &&
//                             // index !== 19 &&
//                             index !== 20 &&
//                             index !== 21)) ? ( // Conditionally render totals
//                         <TableCell
//                           key={index}
//                           align="center"
//                           style={{
//                             position: "sticky",
//                             bottom: 0,
//                             backgroundColor: "lightgrey",
//                             fontWeight: "bold",
//                             borderTop: "1px solid black",
//                           }}
//                         >
//                           {index === 18 ||
//                             index === 20 ||
//                             index === 21 ||
//                             index === 22 ||
//                             index === 23 ||
//                             index === 24
//                             ? `$${total}`
//                             : total}
//                         </TableCell>
//                       ) : null;
//                     })}
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[25, 50, 100]}
//               component="div"
//               count={rows && rows.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               sx={{ flexShrink: 0 }}
//             />
//           </>
//         )}
//       </Paper>
//       </div>
//   );
// }







import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tab,
  Box,
  TextField,
  CircularProgress,
  Checkbox,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
// import ExcelExportComponent from '../components/ExportToExcel'; // Adjust the path as needed
import EnhancedExportComponent from '../components/EnhancedExportComponent'
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from "react-redux";
import { loadData, AllStore } from "../features/tableDataSlice";
import {
  createNpsThunk,
  getAllNpsThunk,
  updateNpsThunk,
} from "../features/npsSlice";
import {
  getAllCommissionsThunk,
  createCommissionThunk,
  updateCommissionThunk,
} from "../features/commissionSlice";
import DateInputs from "../components/DateInputs";
import CircularIndicator from "../components/CircularIndicator";
import { getTargetThunk } from "../features/targetSlice";
import { getKPITargetThunk } from "../features/kpiTargetSlice";
import FortnightDropdown from "../components/FortnightDropdown";
import {
  calculateYearlyFortnights,
  getLastFourFortnights,
  getAnps,
} from "../utils/formatDate";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedTab, setSelectedTab] = useState({
    index: 1,
    value: "Traralgon",
  });

  const [editingCell, setEditingCell] = useState(null); // To track the cell being edited
  const [mutableData, setMutableData] = useState([]); // To hold a mutable copy of data
  const [originalValues, setOriginalValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedFortnight, setSelectedFortnight] = useState(null);
  const [hideColumns, setHideColumns] = useState(true);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [KPITargets, setKPITargets] = useState({
    KPITMB: null,
    KPIPPN: null,
    KPIBundle: null,
    KPITWD: null,
    KPIDPC: null,
    KPIACCGP: null,
    KPIMAIN: 65,
    NPSVoltarget: 6,
    NPSScoreTargetMin: 60,    // New field
    NPSScoreTargetMax: 75,    // New field
    GPCommissionPercentage: 7,
    GPTier2Percentage: 5.5,
    GPTier3Percentage: 7,
    NPSMultiplierLow: 0.5,    // New field
    NPSMultiplierMid: 1.0,    // New field
    NPSMultiplierHigh: 1.5    // New field
  });

  // Redux hooks
  const dispatch = useDispatch();
  const { data, message, loading, error } = useSelector(
    (state) => state.tableData
  );
  console.log(data)
  const {
    target,
    loading: targetLoading,
    error: targetError,
  } = useSelector((state) => state.targets);
  console.log(target);
  const { npsData, npsLoading, npsError } = useSelector((state) => state.nps);
  const {
    KPITarget,
    loading: KPILoading,
    error: KPIError,
  } = useSelector((state) => state.KPITargets);
  const {
    commissions,
    loading: commissionLoading,
    error: commissionError,
  } = useSelector((state) => state.commission);

// Add auth state from Redux
const { user, isCreateUserAllowed } = useSelector((state) => state.auth);
  
// Determine access level
const READ_ONLY_EMAILS = [
  // 'gauravisonline@gmail.com',
  'warragul@wolfstores.com.au',
  'traralgon@wolfstores.com.au',
  'torquay@wolfstores.com.au'
];
// Role-based access control
  const getUserRole = () => {
    if (!user) return null;
    return user.role; // Assuming role is stored in user object
  };

  const isManager = () => {
    const userRole = getUserRole();
    return userRole === 'manager' || userRole === 'admin';
  };

  const isStaff = () => {
    const userRole = getUserRole();
    return userRole === 'staff';
  };

  // Determine access level based on role and email
  const getAccessLevel = () => {
    if (!user) return 'no-access';
    
    // Check if user email is in read-only list
    if (READ_ONLY_EMAILS.includes(user.email)) {
      return 'read-only';
    }
    
    // Check role-based access
    if (isManager()) {
      return 'full-access';
    }
    
    if (isStaff()) {
      return 'read-only';
    }
    
    // Default to read-only if role is not recognized
    return 'read-only';
  };

  const accessLevel = getAccessLevel();
  const hasFullAccess = accessLevel === 'full-access';
  const isReadOnly = accessLevel === 'read-only';

  // Optional: Add visual indicators for access level
  const getAccessLevelDisplay = () => {
    switch (accessLevel) {
      case 'full-access':
        return 'Manager Access';
      case 'read-only':
        return 'Read Only Access';
      case 'no-access':
        return 'No Access';
      default:
        return 'Unknown Access';
    }
  };
// const isReadOnly = user && READ_ONLY_EMAILS.includes(user.email); 
// const hasFullAccess = !isReadOnly && isCreateUserAllowed; 

  useEffect(() => {
    if (KPITarget) {
      setKPITargets({
        KPITMB: KPITarget.KPITMB ?? null,
        KPIPPN: KPITarget.KPIPPN ?? null,
        KPIBundle: KPITarget.KPIBundle ?? null,
        KPITWD: KPITarget.KPITWD ?? null,
        KPIDPC: KPITarget.KPIDPC ?? null,
        KPIACCGP: KPITarget.KPIACCGP ?? null,
        KPIMAIN: KPITarget.KPIMAIN ?? 65,
        NPSVoltarget: KPITarget.NPSVoltarget ?? 6,
        NPSScoreTargetMin: KPITarget.NPSScoreTargetMin ?? 60,    // New field
        NPSScoreTargetMax: KPITarget.NPSScoreTargetMax ?? 75,    // New field
        GPCommissionPercentage: KPITarget.GPCommissionPercentage ?? 4,
        GPTier2Percentage: KPITarget.GPTier2Percentage ?? 5.5,
        GPTier3Percentage: KPITarget.GPTier3Percentage ?? 7,
        NPSMultiplierLow: KPITarget.NPSMultiplierLow ?? 0.5,     // New field
        NPSMultiplierMid: KPITarget.NPSMultiplierMid ?? 1.0,     // New field
        NPSMultiplierHigh: KPITarget.NPSMultiplierHigh ?? 1.5    // New field
      });
    } else {
      setKPITargets({
        KPITMB: null,
        KPIPPN: null,
        KPIBundle: null,
        KPITWD: null,
        KPIDPC: null,
        KPIACCGP: null,
        KPIMAIN: 65,
        NPSVoltarget: 6,
        NPSScoreTargetMin: 60,    // New field
        NPSScoreTargetMax: 75,    // New field
        GPCommissionPercentage: 4,
        GPTier2Percentage:  5.5,
        GPTier3Percentage: 7,
        NPSMultiplierLow: 0.5,    // New field
        NPSMultiplierMid: 1.0,    // New field
        NPSMultiplierHigh: 1.5    // New field
      });
    }
  }, [KPITarget]);

  useEffect(() => {
    if (message) {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [message]);

  // Helper function to check if a date is valid
  function isValidDate(dateString) {
    return !dateString.includes("NaN");
  }
  
  useEffect(() => {
    let salelocation = selectedTab.value;
    if (selectedTab.value === "All Stores") {
      salelocation = "all-store";
    }

    const formattedFromDate = formatDate(new Date(fromDate));
    const formattedToDate = formatDate(new Date(toDate));

    // Check if the dates are valid before making the API call
    if (isValidDate(formattedFromDate) && isValidDate(formattedToDate)) {
      dispatch(
        getTargetThunk({
          salelocation,
          startDate: formattedFromDate,
          endDate: formattedToDate,
        })
      );
      dispatch(
        getKPITargetThunk({
          salelocation,
          startDate: formattedFromDate,
          endDate: formattedToDate,
        })
      );
    }
  }, [dispatch, selectedTab, fromDate, toDate]);

  // Initialize dates and fetch initial data
  useEffect(() => {
    const today = new Date();
    const formattedFromDate = formatDate(new Date(fromDate));
    const formattedToDate = formatDate(new Date(toDate));

    // Check if the dates are valid before making the API call
    if (isValidDate(formattedFromDate) && isValidDate(formattedToDate)) {
      dispatch(
        loadData({
          salelocation: selectedTab.value,
          startDate: formattedFromDate,
          endDate: formattedToDate,
        })
      );
    }
  }, [dispatch]);

  function parseDate(dateString) {
    const [day, month, year] = dateString.split("/");
    // Note: months are 0-indexed in JavaScript Date objects
    return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const formatDate = (date) => {
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = String(date.getUTCFullYear()).slice(2); // Get last 2 digits of the year
    return `${day}/${month}/${year}`;
  };

  const formatforDate = (date) => {
    const day = String(date.getDate() + 1).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()); // Get full year
    return `${year}-${month}-${day}`;
  };

  // Fetch data based on tab and date range
  const fetchDataForTab = (tabValue, startDate, endDate) => {
    if (tabValue === "All Stores") {
      dispatch(AllStore({ startDate, endDate }));
    } else {
      dispatch(loadData({ salelocation: tabValue, startDate, endDate }));
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    const selectedTabValue = tabs[newValue];
    setSelectedTab({ index: newValue, value: selectedTabValue });

    const formattedFromDate = formatDate(new Date(fromDate));
    const formattedToDate = formatDate(new Date(toDate));

    fetchDataForTab(selectedTabValue, formattedFromDate, formattedToDate);
  };

  // Fetch data based on current date range and tab
  const fetchData = () => {
    const startDate = fromDate.split("-").reverse().join("/");
    const endDate = toDate.split("-").reverse().join("/");
    fetchDataForTab(selectedTab.value, startDate, endDate);
  };

  useEffect(() => {
    const startDate = fromDate.split("-").reverse().join("/");
    const endDate = toDate.split("-").reverse().join("/");
    dispatch(getAllNpsThunk({ startDate, endDate }));
    dispatch(getAllCommissionsThunk({ startDate, endDate }));
  }, [createNpsThunk, updateNpsThunk, dispatch, selectedFortnight]);

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);
  
  useEffect(() => {
    setMutableData(data?.map((item) => ({ ...item }))); // Create a mutable copy of data
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDoubleClick = (rowIndex, columnId) => {
    // Store the original value when starting to edit
    const value = mutableData[rowIndex] ? mutableData[rowIndex][columnId] : "";
    setOriginalValue(value);
    setEditingCell({ rowIndex, columnId });
  };

  const handleInputChange = (event, rowIndex, columnId) => {
    setMutableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnId] = event.target.value;
      return newData;
    });
  };

  const forrmatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getUTCMonth() + 1); // Use getUTCMonth
    let day = "" + d.getUTCDate(); // Use getUTCDate
    const year = d.getUTCFullYear(); // Use getUTCFullYear

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  };
  
  const currentDateS = forrmatDate(new Date());
  let isUpdating = false;
  
  const handleBlur = async (rowIndex, columnId) => {
    if (
      editingCell &&
      editingCell.rowIndex === rowIndex &&
      editingCell.columnId === columnId
    ) {
      if (isUpdating) {
        return;
      }
      // Get the current value
      const value = mutableData[rowIndex]
        ? mutableData[rowIndex][columnId]
        : "";
      if (value === originalValues || value.trim() === "") {
        setEditingCell(null);
        return;
      }

      const newData = [...mutableData];
      const originalValue = data[rowIndex][columnId];
      const newValue = newData[rowIndex][columnId];

      if (newValue !== originalValue) {
        isUpdating = true;

        newData[rowIndex][columnId] = newValue;
        setMutableData(newData);
        setEditingCell(null);

        const rowData = newData[rowIndex];
        const existingNpsEntry = npsData?.find(
          (entry) =>
            entry.salesrep === rowData.salesrep &&
            entry.salelocation === selectedTab.value
        );

        const fieldName =
          columnId === "column-1"
            ? "NPSVol"
            : columnId === "column-2"
              ? "NPSScore"
              : columnId === "column-3"
                ? "adv10_9"
                : columnId === "column-4"
                  ? "pass8_7"
                  : columnId === "column-5"
                    ? "detr_less_6"
                    : null;

        const npsValue = {
          salesrep: rowData.salesrep,
          salelocation: selectedTab.value,
          createdDate: forrmatDate(new Date()),
          NPSVol:
            columnId === "column-1"
              ? parseFloat(newValue)
              : existingNpsEntry?.NPSVol || 0,
          NPSScore:
            columnId === "column-2"
              ? parseFloat(newValue)
              : existingNpsEntry?.NPSScore || 0,
          adv10_9:
            columnId === "column-3"
              ? parseFloat(newValue)
              : existingNpsEntry?.adv10_9 || 0,
          pass8_7:
            columnId === "column-4"
              ? parseFloat(newValue)
              : existingNpsEntry?.pass8_7 || 0,
          detr_less_6:
            columnId === "column-5"
              ? parseFloat(newValue)
              : existingNpsEntry?.detr_less_6 || 0,
          updatedBy: "Admin",
          fieldsToBeUpdate: fieldName,
        };

        
        if (selectedFortnight !== null) {
          try {
            const createdAtFormatted = existingNpsEntry
              ? forrmatDate(existingNpsEntry.createdDate)
              : null;
            const currentDate = formatDate(new Date());
            const formattedFromDate = formatDate(new Date(fromDate));
            const formattedToDate = formatDate(new Date(toDate));
            let CfromDate = parseDate(formattedFromDate);
            let CtoDate = parseDate(formattedToDate);
            let Ccurrent = parseDate(currentDate);

            if (Ccurrent >= CfromDate && Ccurrent <= CtoDate) {
              if (existingNpsEntry) {
                const createdDate = existingNpsEntry
                  ? forrmatDate(new Date(existingNpsEntry.createdDate))
                  : forrmatDate(new Date(fromDate));
                npsValue.createdDate = createdDate;
                await dispatch(updateNpsThunk({ npsData: npsValue }));
              } else {
                await dispatch(createNpsThunk(npsValue));
              }

              // Fetch the updated NPS data
              await dispatch(
                getAllNpsThunk({
                  startDate: formattedFromDate,
                  endDate: formattedToDate,
                })
              );
            } else {
              const createdDate = existingNpsEntry
                ? forrmatDate(new Date(existingNpsEntry.createdDate))
                : forrmatDate(new Date(fromDate));
              npsValue.createdDate = createdDate;

              if (existingNpsEntry) {
                await dispatch(updateNpsThunk({ npsData: npsValue }));
              } else {
                await dispatch(createNpsThunk(npsValue));
              }

              // Fetch the updated NPS data
              await dispatch(
                getAllNpsThunk({
                  startDate: formattedFromDate,
                  endDate: formattedToDate,
                })
              );
            }
          } catch (error) {
            console.error("Error updating or creating NPS data:", error);
          } finally {
            isUpdating = false;
          }
        } else {
          // Show an alert if selectedFortnight is null
          alert("Please select a fortnight to update or create data.");
        }
      }
    }
  };

  // FIXED HEADER NAMES - Removed Tyro, Fixed Belong NBN target, Removed duplicate Telstra Plus
  const headerNames = [
    selectedTab.value,
    "NPS Vol",
    "NPS Score",
    "Adv 10-9",
    "Pass 8-7",
    "Detr <6",
    `PPN (${target?.ppn || "N/A"})`,
    `Bundle New (${target?.bundel || "N/A"})`,
    `TMB (${target?.tmb || "N/A"})`,
    "Device Protection",
    `Belong PPN `, 
    `Belong NBN (${target?.tyro || "N/A"})`, // FIXED: Use belongnbn target
    `Telstra Plus (${target?.websitebas || "N/A"})`,
    `Device Security($10/m) (${target?.devicesecurity || "N/A"})`,
    "Outright Mobile/Tablet Inc Prepaid",
    "DPC Mobile/Tablet",
    "Smart Watch",
    `Device Protect to Hand/Tab DPC (${target?.dpc || "N/A"}%)`,
    `Accessory GP to Handset Sales(${target?.AcceGP_Handset_Sales || "N/A"})`,
    "Acc GP", // Moved up - no longer duplicate
    "Handset/Plan GP",
   `Total GP (T1: ${target?.gpGreenTarget ? Math.floor(target.gpGreenTarget/1000) + "k" : "12k"}, 
             T2: ${target?.gpTier2Threshold ? Math.floor(target.gpTier2Threshold/1000) + "k" : "14k"}, 
             T3: ${target?.gpTier3Threshold ? Math.floor(target.gpTier3Threshold/1000) + "k" : "16k"})`,
    "Potential Commission",
    "Commission 2.O",
  ];

  const columns = headerNames.map((header, index) => ({
    id: `column-${index}`,
    label: header,
    minWidth: 120,
    align: "center",
    format: (value) => value,
  }));

  const tabs = ["All Stores", "Traralgon", "Warragul", "Torquay"];

  const rows = data?.map((item) => {
    const rowData = {
      "column-0":
        item.salesrep === "" || item.salesrep === null
          ? "unknown salesrep"
          : item.salesrep,
    };

    // Find all matching NPS rows for the current salesrep
    const matchingNpsRows = npsData?.filter((npsItem) => {
      if (selectedTab.value === "All Stores") {
        return npsItem.salesrep === item.salesrep;
      } else {
        return (
          npsItem.salesrep === item.salesrep &&
          npsItem.salelocation === selectedTab.value
        );
      }
    });
    
    const matchingCommissionRows = commissions?.filter((commissionItem) => {
      if (selectedTab.value === "All Stores") {
        return commissionItem.salesrep === item.salesrep;
      } else {
        return (
          commissionItem.salesrep === item.salesrep &&
          commissionItem.salelocation === selectedTab.value
        );
      }
    });
    
    if (matchingNpsRows?.length > 0) {
      let aggregatedData = {
        adv10_9: 0,
        pass8_7: 0,
        detr_less_6: 0,
      };
      matchingNpsRows.forEach((npsRow, index) => {
        aggregatedData.adv10_9 += npsRow.adv10_9;
        aggregatedData.pass8_7 += npsRow.pass8_7;
        aggregatedData.detr_less_6 += npsRow.detr_less_6;
        
        // Calculate NPSVol
        const NPSVol =
          aggregatedData.adv10_9 +
          aggregatedData.pass8_7 +
          aggregatedData.detr_less_6;

        // Calculate NPS Score
        const NPSAdvPercentage =
          NPSVol !== 0
            ? ((aggregatedData.adv10_9 / NPSVol) * 100).toFixed(2)
            : 0;
        const NPSDetrPercentage =
          NPSVol !== 0
            ? ((aggregatedData.detr_less_6 / NPSVol) * 100).toFixed(2)
            : 0;
        const NPSScore = Math.round(NPSAdvPercentage - NPSDetrPercentage);
        
        // Add NPS data to corresponding columns
        rowData["column-1"] = NPSVol;
        rowData["column-2"] = NPSScore;
        rowData["column-3"] = aggregatedData.adv10_9;
        rowData["column-4"] = aggregatedData.pass8_7;
        rowData["column-5"] = aggregatedData.detr_less_6;
      });
    } else {
      // If no matching NPS rows are found, set default values or leave empty
      rowData["column-1"] = "";
      rowData["column-2"] = "";
      rowData["column-3"] = "";
      rowData["column-4"] = "";
      rowData["column-5"] = "";
    }
    
    const stayConnectedCount =
      (item["Upgrade & Protect Plus (Stay Connected)"] || 0) +
      (item["Stay Connected"] || 0);
    const upgradeProtectCount = item.upgrade || 0;
    const dpcCount = item.dcpcount || 1; // Assuming 1 to avoid division by zero

    const column17Value =
      Math.round((stayConnectedCount / dpcCount) * 100) + "%";

    const dpcCount1 = item.dcpcount || 0;
    const outrightCount = item.outriCount || 0; // Default to 0 if item.outriCount is undefined or null
    const smartWatchCount = item.smartWatchCount || 0;

    const columnACCValue = (() => {
      const calculatedValue =
        item.accGP / (dpcCount1 + outrightCount + smartWatchCount);
      return isFinite(calculatedValue) ? Math.round(calculatedValue) : "N/A";
    })();

    // Calculate KPI score
    let kpiScore = 0;

    // PPN KPI
    if (((item.pnncount || 0) + (item["mob-new"] || 0)) >= (target?.ppn !== null ? target?.ppn : 0)) {
      kpiScore += KPITargets.KPIPPN !== null ? KPITargets.KPIPPN : 0;
      console.log(kpiScore,"kpiScore")
    }

    // New Bundles KPI
    if (item.bundelnewcount >= (target?.bundel !== null ? target?.bundel : 0)) {
      kpiScore += KPITargets.KPIBundle !== null ? KPITargets.KPIBundle : 0;
      console.log(kpiScore,"kpiScore")
    }
    
    // TMB KPI
    if (item["TMB-NEW (5)"] >= (target?.tmb !== null ? target?.tmb : 0)) {
      kpiScore += KPITargets.KPITMB !== null ? KPITargets.KPITMB : 0;
      console.log(kpiScore,"kpiScore")
    }

    // FIXED COMPULSORY KPI LOGIC - Use Belong NBN instead of Tyro
    if (
      item["Belong NBN"] >= (target?.tyro !== null ? target?.tyro : 0)
      &&
      item["Telstra Plus"] >= (target?.websitebas !== null ? target?.websitebas : 0)
    ) {
      kpiScore += KPITargets.KPITWD !== null ? KPITargets.KPITWD : 0;
      console.log(kpiScore,"kpiScore")
    }

    // Device Protection KPI
    if (parseFloat(column17Value) >= (target?.dpc !== null ? target?.dpc : 0)) {
      kpiScore += KPITargets.KPIDPC !== null ? KPITargets.KPIDPC : 0;
      console.log(kpiScore,"kpiScore")
    }

    // Accessory GP to Device KPI
    if (
      parseFloat(columnACCValue) >=
      (target?.AcceGP_Handset_Sales !== null ? target?.AcceGP_Handset_Sales : 0)
    ) {
      kpiScore += KPITargets.KPIACCGP !== null ? KPITargets.KPIACCGP : 0;
      console.log(kpiScore,"kpiScore")
    }
    console.log(kpiScore)
    // Calculate commission
//     let commission;

//     // First check if gross profit meets minimum threshold
//     if (item.grossprofit < (target?.gpGreenTarget || 12000)) {
//       commission = "Not Eligible";
//       console.log(`Commission: Not Eligible | Reason: Gross Profit (${item.grossprofit}) < Minimum Threshold (${target?.gpGreenTarget || 12000})`);
//     } 
  
//     // Then check if KPI score meets minimum requirement
//     else if (kpiScore >= KPITargets.KPIMAIN) {
//       // Determine commission percentage based on GP tier
//       let commissionPercentage;
      
//       // Tier 3 (highest)
//       if (item.grossprofit >= (target?.gpTier3Threshold || 16000)) {
//         commissionPercentage = KPITargets.GPTier3Percentage;
//       } 
//       // Tier 2 (middle)
//       else if (item.grossprofit >= (target?.gpTier2Threshold || 14000)) {
//         commissionPercentage = KPITargets.GPTier2Percentage;
//       }
//       // Tier 1 (lowest qualifying tier)
//       else {
//         commissionPercentage = KPITargets.GPCommissionPercentage;
//       }
      
//       // Calculate Gross Profit Commission
//       const grossProfitCommission = ((commissionPercentage ?? 7) / 100) * (item.grossprofit ?? 0);
// console.log("grossProfitCommission",grossProfitCommission)
// // console.log("kpiAdjustedCommission",kpiAdjustedCommission)
//       // Apply KPI percentage
//       const kpiAdjustedCommission = (kpiScore / 100) * grossProfitCommission;

//       // Apply NPS multiplier
//       const NPSVol = rowData["column-1"];
//       const NPSScore = rowData["column-2"];
      
//       let npsMultiplier = 1;

//       if (NPSVol >= KPITargets.NPSVoltarget && NPSScore >= KPITargets.NPSScoreTargetMax) {
//         // High volume and high score (≥ max target)
//         npsMultiplier = KPITargets.NPSMultiplierHigh;
//       } else if (
//         NPSScore >= KPITargets.NPSScoreTargetMin && 
//         NPSScore < KPITargets.NPSScoreTargetMax
//       ) {
//         // High volume and medium score (between min and max)
//         npsMultiplier = KPITargets.NPSMultiplierMid;
//       } else if (NPSScore < KPITargets.NPSScoreTargetMin) {
//         // High volume but low score (below min)
//         npsMultiplier = KPITargets.NPSMultiplierLow;
//       } else if (NPSVol < KPITargets.NPSVoltarget) {
//         // Low volume (regardless of score)
//         npsMultiplier = KPITargets.NPSMultiplierLow;
//       }
//       console.log("kpiAdjustedCommission",kpiAdjustedCommission)
//       console.log(npsMultiplier,"npsMultiplier")
//       commission = kpiAdjustedCommission * npsMultiplier;
//       commission = commission.toFixed(2);
//       console.log("commission",commission)
//     } else {
//       console.log("commission",commission)
//       commission = `Not Eligible`;
//     }
    

let commission;

// First check if gross profit meets minimum threshold
if (item.grossprofit < (target?.gpGreenTarget || 12000)) {
  commission = "Not Eligible";
  console.log(`Commission: Not Eligible | Reason: Gross Profit (${item.grossprofit}) < Minimum Threshold (${target?.gpGreenTarget || 12000})`);
} 
// Then check if KPI score meets minimum requirement
else if (kpiScore >= KPITargets.KPIMAIN) {
  // Determine commission percentage based on GP tier
  let commissionPercentage;
  
  // Tier 3 (highest)
  if (item.grossprofit >= (target?.gpTier3Threshold || 16000)) {
    commissionPercentage = KPITargets.GPTier3Percentage;
  } 
  // Tier 2 (middle)
  else if (item.grossprofit >= (target?.gpTier2Threshold || 14000)) {
    commissionPercentage = KPITargets.GPTier2Percentage;
  }
  // Tier 1 (lowest qualifying tier)
  else {
    commissionPercentage = KPITargets.GPCommissionPercentage;
  }
  
  // Calculate Gross Profit Commission
  const grossProfitCommission = ((commissionPercentage ?? 7) / 100) * (item.grossprofit ?? 0);
  console.log("grossProfitCommission", grossProfitCommission);

  // Apply KPI percentage
  const kpiAdjustedCommission = (kpiScore / 100) * grossProfitCommission;

  // Apply NPS multiplier
  const NPSVol = rowData["column-1"];
  const NPSScore = rowData["column-2"];
  
  let npsMultiplier = 1.0;

  if (NPSVol >= KPITargets.NPSVoltarget && NPSScore >= KPITargets.NPSScoreTargetMax) {
    // High volume (≥ 10 surveys) and high score (NPS ≥ 75)
    npsMultiplier = KPITargets.NPSMultiplierHigh; // 1.5x
  } else if (
    NPSVol >= KPITargets.NPSVoltarget &&
    NPSScore >= KPITargets.NPSScoreTargetMin && 
    NPSScore < KPITargets.NPSScoreTargetMax
  ) {
    // High volume (≥ 10 surveys) and medium score (e.g., 50 ≤ NPS < 75)
    npsMultiplier = KPITargets.NPSMultiplierMid; // 1.0x
  } else if (
    NPSVol < KPITargets.NPSVoltarget &&
    NPSScore >= KPITargets.NPSScoreTargetMax
  ) {
    // Low volume (< 10 surveys) but high score (NPS ≥ 75)
    npsMultiplier = KPITargets.NPSMultiplierMid; // 1.0x
  } else {
    // All other cases (e.g., high volume with NPS < min, or low volume with NPS < 75)
    npsMultiplier = KPITargets.NPSMultiplierLow; // 1.0x
  }

  console.log("kpiAdjustedCommission", kpiAdjustedCommission);
  console.log("npsMultiplier", npsMultiplier);
  commission = kpiAdjustedCommission * npsMultiplier;
  commission = commission.toFixed(2);
  console.log("commission", commission);
} else {
  console.log("commission", commission);
  commission = "Not Eligible";
}
    const ownerCommission =
      matchingCommissionRows?.[0]?.ownerCommission || "Not Set";
    
    // FIXED ROW DATA ASSIGNMENT - Proper column positioning without duplicates
    rowData["column-6"] = (item.pnncount || 0) + (item["mob-new"] || 0);
    rowData["column-7"] = item.bundelnewcount || 0;
    rowData["column-8"] = item["TMB-NEW (5)"]|| 0;
    rowData["column-9"] = (item["Upgrade & Protect Plus (Stay Connected)"] || 0) +
      (item["Stay Connected"] || 0);
       rowData["column-10"] = item["Belong PPN"] || 0;
    rowData["column-11"] = item["Belong NBN"] || 0; // Belong NBN (Compulsory KPI 1)
    rowData["column-12"] = item["Telstra Plus"] || 0; // Telstra Plus (Compulsory KPI 2)
    rowData["column-13"] = 0; // Device Security placeholder
    rowData["column-14"] = item.outriCount;
    rowData["column-15"] = item.dcpcount;
    rowData["column-16"] = item.smartWatchCount;
    rowData["column-17"] = column17Value; // DPC percentage
    rowData["column-18"] = columnACCValue; // Accessory GP
    rowData["column-19"] = Math.round(item.accGP); // Acc GP
    
    const column21Value = item.grossprofit - item.accGP;
    const column21flot = Math.round(column21Value);
    rowData["column-20"] = column21flot; // Handset/Plan GP
    rowData["column-21"] = Math.round(item.grossprofit); // Total GP
    rowData["column-22"] = commission; // Potential Commission
    rowData["column-23"] = ownerCommission; // Commission 2.0

    return rowData;
  });

  const calculateTotals = () => {
    let totalStayConnected = 0;
    let totalUpgradeProtect = 0;
    let totalDPC = 0;

    // Calculate totals directly from data
    data?.forEach((item) => {
      totalStayConnected += isNaN(
        item["Upgrade & Protect Plus (Stay Connected)"]
      )
        ? 0
        : parseFloat(item["Upgrade & Protect Plus (Stay Connected)"]);
      totalUpgradeProtect += isNaN(item.upgrade) ? 0 : parseFloat(item.upgrade);
      totalDPC += isNaN(item.dcpcount) ? 0 : parseFloat(item.dcpcount);
    });

    // Filter NPS data based on selected tab
    const filteredNpsData = npsData?.filter((npsItem) =>
      selectedTab.value === "All Stores"
        ? true
        : npsItem.salelocation === selectedTab.value
    );

    const totalAdv10_9 =
      filteredNpsData?.reduce((sum, item) => sum + item.adv10_9, 0) || 0;
    const totalPass8_7 =
      filteredNpsData?.reduce((sum, item) => sum + item.pass8_7, 0) || 0;
    const totalDetr_less_6 =
      filteredNpsData?.reduce((sum, item) => sum + item.detr_less_6, 0) || 0;

    // Calculate total NPS Score
    const totalNPSVol = totalAdv10_9 + totalPass8_7 + totalDetr_less_6;
    const NPSAdvPercentage =
      totalNPSVol !== 0 ? ((totalAdv10_9 / totalNPSVol) * 100).toFixed(2) : 0;
    const NPSDetrPercentage =
      totalNPSVol !== 0
        ? ((totalDetr_less_6 / totalNPSVol) * 100).toFixed(2)
        : 0;
    const totalNPSScore = Math.round(NPSAdvPercentage - NPSDetrPercentage);

    // Calculate average for column 17 (Accessory GP)
    let column17Avg = 0;
    const column17 = columns.find((column) => column.id === "column-18");
    if (column17 && rows && rows.length > 0) {
      const column17Sum = rows.reduce((sum, row) => {
        const value = row[column17.id];
        const numValue =
          typeof value === "string" && value.startsWith("$")
            ? parseFloat(value.substring(1))
            : parseFloat(value);
        return sum + (isNaN(numValue) ? 0 : numValue);
      }, 0);
      column17Avg = column17Sum / rows.length;
    }

    const totals = columns.map((column, colIndex) => {
      if (colIndex === 0) return "Total"; // Label for the first column
      if (colIndex === 2) {
        return totalNPSScore;
      }

      // For column 17 (Accessory GP), return the average instead of the sum
      if (column.id === "column-18") {
        return Math.round(column17Avg);
      }

      const total =
        rows &&
        rows.reduce((sum, row) => {
          const value = row[column.id];
          // Remove dollar sign if present and parse the value
          const numValue =
            typeof value === "string" && value.startsWith("$")
              ? parseFloat(value.substring(1))
              : parseFloat(value);

          return sum + (isNaN(numValue) ? 0 : numValue);
        }, 0);

      return Math.round(total);
    });

    // Calculate Device Protection to Hand/Tab DPC (50%)
    const deviceProtectToDPC =
      totalDPC !== 0
        ? Math.round((totalStayConnected / totalDPC) * 100) + "%"
        : "0%";

    // Assume column-16 is for Device Protection to Hand/Tab DPC
    const column16Index = columns.findIndex(
      (column) => column.id === "column-17"
    );
    if (column16Index !== -1) {
      totals[column16Index] = deviceProtectToDPC;
    }

    return totals;
  };
  const totals = calculateTotals();

  let isUpdatingCommission = false;

  const handleCommissionBlur = async (rowIndex, columnId) => {
    if (
      editingCell &&
      editingCell.rowIndex === rowIndex &&
      editingCell.columnId === columnId
    ) {
      if (isUpdatingCommission) {
        return;
      }

      const value = mutableData[rowIndex]
        ? mutableData[rowIndex][columnId]
        : "";
      if (value === originalValues || value.trim() === "") {
        setEditingCell(null);
        return;
      }

      const newData = [...mutableData];
      const originalValue = data[rowIndex][columnId];
      const newValue = newData[rowIndex][columnId];

      if (newValue !== originalValue) {
        isUpdatingCommission = true;

        newData[rowIndex][columnId] = newValue;
        setMutableData(newData);
        setEditingCell(null);

        const rowData = newData[rowIndex];

        const existingCommissionEntry = commissions?.find(
          (entry) =>
            entry.salesrep === rowData.salesrep &&
            entry.salelocation === selectedTab.value
        );

        const commissionValue = {
          salesrep: rowData.salesrep,
          salelocation: selectedTab.value,
          createdDate: forrmatDate(new Date()),
          ownerCommission: parseFloat(newValue),
          updatedBy: "Admin",
        };

        if (selectedFortnight !== null) {
          try {
            const formattedFromDate = formatDate(new Date(fromDate));
            const formattedToDate = formatDate(new Date(toDate));
            const currentDate = formatDate(new Date());
            let CfromDate = parseDate(formattedFromDate);
            let CtoDate = parseDate(formattedToDate);
            let Ccurrent = parseDate(currentDate);

            if (Ccurrent >= CfromDate && Ccurrent <= CtoDate) {
              const createdDate = existingCommissionEntry
                ? forrmatDate(new Date(existingCommissionEntry.createdDate))
                : forrmatDate(new Date(fromDate));
              commissionValue.createdDate = createdDate;
              if (existingCommissionEntry) {
                await dispatch(
                  updateCommissionThunk({ commissionData: commissionValue })
                );
              } else {
                await dispatch(createCommissionThunk(commissionValue));
              }
            } else {
              const createdDate = existingCommissionEntry
                ? forrmatDate(new Date(existingCommissionEntry.createdDate))
                : forrmatDate(new Date(fromDate));
              commissionValue.createdDate = createdDate;

              if (existingCommissionEntry) {
                await dispatch(
                  updateCommissionThunk({ commissionData: commissionValue })
                );
              } else {
                await dispatch(createCommissionThunk(commissionValue));
              }
            }

            // Fetch the updated commission data
            await dispatch(
              getAllCommissionsThunk({
                startDate: formattedFromDate,
                endDate: formattedToDate,
              })
            );
          } catch (error) {
            console.error("Error updating or creating commission data:", error);
          } finally {
            isUpdatingCommission = false;
          }
        } else {
          alert("Please select a fortnight to update or create data.");
        }
      }
    }
  };

  // FIXED HEADERS FOR KPI DISPLAY
  const headers = [
    {
      colSpan: hideColumns ? 3 : 6,
      align: "left",
      percentage: "",
      visible: true,
    },
    { colSpan: 1, align: "center", kpi: "KPIPPN", visible: true },
    { colSpan: 1, align: "center", kpi: "KPIBundle", visible: true },
    { colSpan: 1, align: "center", kpi: "KPITMB", visible: true },
    {
      colSpan: hideColumns ? 0 : 1,
      align: "center",
      percentage: "",
      visible: !hideColumns,
    },
    {
      colSpan: hideColumns ? 0 : 1,
      align: "center",
      percentage: "",
      visible: !hideColumns,
    },
    // Compulsory KPI spanning both Belong NBN and Telstra Plus
    { 
      colSpan: 2, 
      align: "center", 
      kpi: "KPITWD", 
      visible: true,
      label: "Compulsory KPI"
    },
    {
      colSpan: hideColumns ? 0 : 3,
      align: "center",
      percentage: "",
      visible: !hideColumns,
    },
    { colSpan: 1, align: "center", kpi: "KPIDPC", visible: true },
    { colSpan: 1, align: "center", kpi: "KPIACCGP", visible: true },
    {
      colSpan: hideColumns ? 3 : 5, // Adjusted for removed duplicate column
      align: "left",
      percentage: "",
      visible: true,
    },
  ];

  // Add these styles at the component level
  const containerStyles = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const navbarHeight = 30;

  const paperStyles = {
    width: '98%',
    marginTop: `${navbarHeight }px`,
    marginLeft: '15px',
    padding: '10px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
    height: `calc(100vh - ${navbarHeight + 20}px)`,
  };

  const tableWrapperStyles = {
    flex: rows && rows.length > 10 ? 1 : '0 1 auto',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const tableContainerStyles = {
    overflow: 'auto',
    borderRadius: '0 0 8px 8px',
    border: '2px solid #e0e0e0',
    borderTop: 'none',
    flex: '1 1 auto',
  };

  const stickyFooterStyles = {
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'lightgrey',
    zIndex: 1,
  };

  return (
    <div style={containerStyles}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Navbar />
      <Paper sx={paperStyles}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottom: "2px solid #e0e0e0",
            borderRadius: "8px 8px 0 0",
            borderLeft: "2px solid #e0e0e0",
            borderRight: "2px solid #e0e0e0",
            backgroundColor: "#fafafa",
            flexShrink: 0,
          }}
        >
          <Tabs
            value={selectedTab.index}
            onChange={handleTabChange}
            TabIndicatorProps={{
              sx: {
                backgroundColor: "#54595f",
                height: "3px",
              },
            }}
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{ minHeight: "48px" }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab}
                sx={{
                  minWidth: "120px",
                  borderRadius: "8px 8px 0 0",
                  borderLeft: "2px solid #e0e0e0",
                  borderRight: "2px solid #e0e0e0",
                  borderTop: "2px solid #e0e0e0",
                  marginRight: "2px",
                  paddingY: "25.5px",
                  "&:hover": {
                    backgroundColor: "#54595f",
                    color: "#FFFFFF",
                  },
                  "&.Mui-selected": {
                    borderLeft: "2px solid #54595f",
                    borderRight: "2px solid #54595f",
                    borderTop: "2px solid #54595f",
                    backgroundColor: " #54595f",
                    color: "#FFFFFF",
                  },
                }}
              />
            ))}
          </Tabs>
          <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography variant="body1" style={{ marginRight: "8px" }}>
              Hide Optional Data
            </Typography>
            <Checkbox
              checked={hideColumns}
              onChange={(e) => setHideColumns(e.target.checked)}
              color="primary"
              sx={{
                color: "#54595f",
                "&.Mui-checked": {
                  color: "#54595f",
                },
                "&:hover": {
                  backgroundColor: "#54595f",
                  color: "#FFFFFF",
                },
              }}
            />
            <FortnightDropdown
              selectedFortnight={selectedFortnight}
              setSelectedFortnight={setSelectedFortnight}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />

            <DateInputs
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              fetchData={fetchData}
            />

            <EnhancedExportComponent 
              data={rows} 
              columns={columns} 
              tabValue={selectedTab.value} 
              fromDate={fromDate}
              toDate={toDate}
            />
          </Box>
        </Box>
        {loading || targetLoading ? (
          <Box sx={{ padding: "20px", textAlign: "center", color: "red" }}>
            <CircularProgress sx={{ margin: "20px auto", display: "block" }} />
          </Box>
        ) : (
          <>
            <TableContainer sx={tableContainerStyles}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {headers
                      .filter((header) => header.visible)
                      .map((header, index) => (
                        <TableCell
                          key={index}
                          colSpan={header.colSpan}
                          align={header.align}
                          style={{ borderRight: "1px solid #e0e0e0" }}
                        >
                          {header.kpi && KPITargets && (
                            <div>
                              {KPITargets[header.kpi] != null
                                ? `${KPITargets[header.kpi]}%`
                                : "N/A"}
                            </div>
                          )}
                          {/* Show custom label or default text */}
                          {header.label && header.label}
                          {header.kpi === "KPITWD" && !header.label && "Compulsory KPI"}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    {columns.map((column, index) => {
                      // Hide Device Security (column 12) always
                      if (index === 13) {
                        return null;
                      }

                      // Apply visibility conditions
                      return (!hideColumns || index > 5 || index < 3) &&
                        (!hideColumns ||
                          (index !== 9 && // Hide Device Protection when hideColumns is true
                            index !== 10 &&
                            index !== 14 && // Hide Outright
                            index !== 15 && // Hide DPC Mobile/Tablet
                            index !== 16 &&
                            index !== 19 &&
                            index !== 20 )) ? ( // Hide Smart Watch
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows &&
                    rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, rowIndex) =>
                        !hideColumns || rowIndex !== rows.length ? (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={rowIndex}
                          >
                            {columns.map((column, colIndex) => {
                              const cellKey = `${rowIndex}-${column.id}`;
                              const value = row[column.id];
                              const isEditable = hasFullAccess &&
                                ((colIndex >= 3 && colIndex <= 5) ||
                                colIndex === 23); // Updated for new commission column position

                              // Hide Device Security (column 12) always
                              if (colIndex === 13) {
                                return null;
                              }

                              return (!hideColumns ||
                                colIndex > 5 ||
                                colIndex < 3) &&
                                (!hideColumns ||
                                  (colIndex !== 9 &&
                                    colIndex !== 10 &&
                                    colIndex !== 14 &&
                                    colIndex !== 15 &&
                                    colIndex !== 16 &&
                                    colIndex !== 19 &&
                                    colIndex !== 20)) ? (
                                <TableCell
                                  key={cellKey}
                                  align={column.align}
                                  onClick={() =>
                                    selectedTab.value !== "All Stores" &&
                                    isEditable &&
                                    handleDoubleClick(rowIndex, column.id)
                                  }
                                  onBlur={() => {
                                    if (
                                      selectedTab.value !== "All Stores" &&
                                      isEditable
                                    ) {
                                      if (colIndex === 23) { // Updated commission column
                                        handleCommissionBlur(
                                          rowIndex,
                                          column.id
                                        );
                                      } else {
                                        handleBlur(rowIndex, column.id);
                                      }
                                    }
                                  }}
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    cursor: isEditable ? "pointer" : "default",
                                    textAlign: "center",
                                  }}
                                >
                                  {editingCell &&
                                  editingCell.rowIndex === rowIndex &&
                                  editingCell.columnId === column.id &&
                                  hasFullAccess ? (
                                    <TextField
                                      value={
                                        mutableData[rowIndex]
                                          ? mutableData[rowIndex][column.id]
                                          : ""
                                      }
                                      onChange={(event) =>
                                        handleInputChange(
                                          event,
                                          rowIndex,
                                          column.id
                                        )
                                      }
                                      onBlur={() =>
                                        handleBlur(rowIndex, column.id)
                                      }
                                      autoFocus
                                    />
                                  ) : column.id === "column-8" ||
                                    column.id === "column-6" ||
                                    column.id === "column-7" ||
                                    column.id === "column-11" || // Belong NBN
                                    column.id === "column-12" || // Telstra Plus
                                    column.id === "column-17" || // DPC percentage  
                                    column.id === "column-18" || // Accessory GP
                                    column.id === "column-21" ? ( // Total GP
                                    <Box
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      width="100%"
                                    >
                                      <CircularIndicator
                                        value={
                                          (column.id === "column-18" || column.id === "column-21") && value !== "N/A"
                                            ? Number(value)
                                            : value
                                        }
                                        displayValue={
                                          (column.id === "column-18" || column.id === "column-21") && value !== "N/A"
                                            ? `$${value}`
                                            : value
                                        }
                                        target={
                                          column.id === "column-6"
                                            ? target?.ppn
                                            : column.id === "column-7"
                                              ? target?.bundel
                                              : column.id === "column-8"
                                                ? target?.tmb
                                                : column.id === "column-11" // Belong NBN
                                                  ? target?.tyro
                                                  : column.id === "column-12" // Telstra Plus
                                                    ? target?.websitebas
                                                    : column.id === "column-17"
                                                      ? target?.dpc
                                                      : column.id === "column-18"
                                                        ? target?.AcceGP_Handset_Sales
                                                        : column.id === "column-21"
                                                          ? target?.gpGreenTarget
                                                          : null
                                        }
                                        isDpcColumn={column.id === "column-17"}
                                        isGPColumn={column.id === "column-21"}
                                        tierThresholds={column.id === "column-21" ? {
                                          tier1: target?.gpGreenTarget || 12000,
                                          tier2: target?.gpTier2Threshold || 14000,
                                          tier3: target?.gpTier3Threshold || 16000
                                        } : null}
                                        kpiTarget={KPITargets}
                                      />
                                    </Box>
                                  ) : // FIXED DOLLAR FORMATTING for repositioned columns
                                    column.id === "column-18" || // Accessory GP
                                    column.id === "column-19" || // Acc GP  
                                    column.id === "column-20" || // Handset/Plan GP
                                    column.id === "column-21" || // Total GP
                                    (column.id === "column-22" && // Potential Commission
                                      value !== "Not Set" &&
                                      value !== "Not Eligible") ||
                                    (column.id === "column-23" && // Commission 2.0
                                      value !== "Not Set" &&
                                      value !== "Not Eligible") ? (
                                      `$${value}`
                                    ) : (
                                      value
                                    )}
                                </TableCell>
                              ) : null;
                            })}
                          </TableRow>
                        ) : null
                      )}
                  <TableRow sx={stickyFooterStyles}>
                    {totals.map((total, index) => {
                      // Hide Device Security (column 12) always
                      if (index === 13) {
                        return null;
                      }
                      return (!hideColumns || index > 5 || index < 3) &&
                        (!hideColumns ||
                          (index !== 9 &&
                            index !== 10 &&
                            index !== 14 &&
                            index !== 15 &&
                            index !== 16 &&
                            index !== 19 &&
                            index !== 20 )) ? (
                        <TableCell
                          key={index}
                          align="center"
                          style={{
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "lightgrey",
                            fontWeight: "bold",
                            borderTop: "1px solid black",
                          }}
                        >
                          {/* FIXED TOTALS DOLLAR FORMATTING for repositioned columns */}
                          {index === 18 || // Accessory GP
                            index === 19 || // Acc GP
                            index === 20 || // Handset/Plan GP  
                            index === 21 || // Total GP
                            index === 22 || // Potential Commission
                            index === 23    // Commission 2.0
                            ? `$${total}`
                            : total}
                        </TableCell>
                      ) : null;
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={rows && rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ flexShrink: 0 }}
            />
          </>
        )}
      </Paper>
    </div>
  );
}