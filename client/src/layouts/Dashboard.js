
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
  Tooltip,
} from "@mui/material";
import Navbar from "../components/Navbar";
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
    KPISBNBN: null,
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
  // console.log(data)
  const {
    target,
    loading: targetLoading,
    error: targetError,
  } = useSelector((state) => state.targets);
  // console.log(target);
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
        KPISBNBN: KPITarget.KPISBNBN ?? null,
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
        KPISBNBN: null,
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
     `SB PPN `,
    `Bundle New (${target?.bundel || "N/A"})`,
    `TMB (${target?.tmb || "N/A"})`,
    "Device Protection",
    `Belong PPN `,
     `SB NBN (${target?.sbNbn || "N/A"})`, 
    `Belong NBN (${target?.tyro || "N/A"})`, // FIXED: Use belongnbn target
     // New column for SB NBN
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
    "Commission",
    "Potential Commission",
    "Product Incentive",
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
      // console.log(kpiScore,"kpiScore")
    }

    // New Bundles KPI
    if (item.bundelnewcount >= (target?.bundel !== null ? target?.bundel : 0)) {
      kpiScore += KPITargets.KPIBundle !== null ? KPITargets.KPIBundle : 0;
      // console.log(kpiScore,"kpiScore")
    }
    
    // TMB KPI
    if (item["TMB-NEW (5)"] >= (target?.tmb !== null ? target?.tmb : 0)) {
      kpiScore += KPITargets.KPITMB !== null ? KPITargets.KPITMB : 0;
      // console.log(kpiScore,"kpiScore")
    }

    // SB NBN KPI
    if (item["SB NBN"] >= (target?.sbNbn !== null ? target?.sbNbn : 0)) {
      kpiScore += KPITargets.KPISBNBN !== null ? KPITargets.KPISBNBN : 0;
      // console.log(kpiScore,"kpiScore")
    }

    // FIXED COMPULSORY KPI LOGIC - Use Belong NBN instead of Tyro
    if (
      item["Belong NBN"] >= (target?.tyro !== null ? target?.tyro : 0)
      &&
      item["Telstra Plus"] >= (target?.websitebas !== null ? target?.websitebas : 0)
    ) {
      kpiScore += KPITargets.KPITWD !== null ? KPITargets.KPITWD : 0;
      // console.log(kpiScore,"kpiScore")
    }

    // Device Protection KPI
    if (parseFloat(column17Value) >= (target?.dpc !== null ? target?.dpc : 0)) {
      kpiScore += KPITargets.KPIDPC !== null ? KPITargets.KPIDPC : 0;
      // console.log(kpiScore,"kpiScore")
    }

    // Accessory GP to Device KPI
    if (
      parseFloat(columnACCValue) >=
      (target?.AcceGP_Handset_Sales !== null ? target?.AcceGP_Handset_Sales : 0)
    ) {
      kpiScore += KPITargets.KPIACCGP !== null ? KPITargets.KPIACCGP : 0;
      // console.log(kpiScore,"kpiScore")
    }
    // console.log(kpiScore)
    

let commission;

// First check if gross profit meets minimum threshold
if (item.grossprofit < (target?.gpGreenTarget || 12000)) {
  commission = "Not Eligible";
  // console.log(`Commission: Not Eligible | Reason: Gross Profit (${item.grossprofit}) < Minimum Threshold (${target?.gpGreenTarget || 12000})`);
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
  // console.log("grossProfitCommission", grossProfitCommission);

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

  // console.log("kpiAdjustedCommission", kpiAdjustedCommission);
  // console.log("npsMultiplier", npsMultiplier);
  commission = kpiAdjustedCommission * npsMultiplier;
  commission = commission.toFixed(2);
  // console.log("commission", commission);
} else {
  // console.log("commission", commission);
  commission = "Not Eligible";
}

// Calculate Potential Commission based on current sales pace and forecasting
let potentialCommission;
const currentGP = item.grossprofit || 0;
const maxNPSMultiplier = KPITargets.NPSMultiplierHigh; // e.g. 1.5x

// Calculate sales pace based on selected date range
const selectedFromDate = new Date(fromDate);
const selectedToDate = new Date(toDate);
const currentDate = new Date();

// Check if we're looking at current month or previous months
const isCurrentMonth = selectedFromDate.getFullYear() === currentDate.getFullYear() &&
                      selectedFromDate.getMonth() === currentDate.getMonth();

if (!isCurrentMonth) {
  // For previous months, don't show potential commission since the month is complete
  potentialCommission = "Month Complete";
  console.log("Previous month selected - showing actual results only");
} else {
  // Current month - calculate potential commission based on pace
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysPassed = Math.max(1, Math.ceil((currentDate - startOfMonth) / (1000 * 60 * 60 * 24)));
  const totalDaysInMonth = endOfMonth.getDate();

  // Forecast full month GP based on current pace
  const forecastedMonthlyGP = (currentGP / daysPassed) * totalDaysInMonth;

  console.log(
    `Current Month: ${selectedFromDate.toLocaleDateString()}, Current GP: ${currentGP}, Days passed: ${daysPassed}/${totalDaysInMonth}, Forecasted GP: ${forecastedMonthlyGP}`
  );

  // Case 1: GP is below minimum requirement → No forecast
  if (
    currentGP < (target?.gpGreenTarget || 12000) &&
    forecastedMonthlyGP < (target?.gpGreenTarget || 12000)
  ) {
    potentialCommission = "Reach Min GP First";
    console.log("Minimum GP not reached. KPI Score:", kpiScore);

  // Case 2: Forecast GP qualifies for commission tiers
  } else {
    let commissionPercentage;
    if (forecastedMonthlyGP >= (target?.gpTier3Threshold || 16000)) {
      commissionPercentage = KPITargets.GPTier3Percentage; // Tier 3
    } else if (forecastedMonthlyGP >= (target?.gpTier2Threshold || 14000)) {
      commissionPercentage = KPITargets.GPTier2Percentage; // Tier 2
    } else {
      commissionPercentage = KPITargets.GPCommissionPercentage; // Tier 1
    }

    // Calculate potential commission (ignoring KPI score, only tier + NPS multiplier)
    const grossProfitCommission = ((commissionPercentage ?? 7) / 100) * forecastedMonthlyGP;
    potentialCommission = (grossProfitCommission * maxNPSMultiplier).toFixed(2);

    console.log(
      `Forecasted tier commission: ${commissionPercentage}%, GP Commission: ${grossProfitCommission}, Final with NPS: ${potentialCommission}`
    );
  }
}


// Calculate Product Incentive based on product sales and bonus values
let productIncentive = 0;
let productIncentiveBreakdown = [];

if (target?.productBonuses && target.productBonuses.length > 0) {
  target.productBonuses.forEach(bonus => {
    let productSales = 0;
    let productName = bonus.product;

    // Map product names to item properties
    switch (productName) {
      case 'PPN':
        productSales = (item.pnncount || 0) + (item["mob-new"] || 0);
        break;
      case 'SB PPN':
        productSales = item["SB PPN"] || 0;
        break;
      case 'Bundle New':
        productSales = item.bundelnewcount || 0;
        break;
      case 'TMB':
        productSales = item["TMB-NEW (5)"] || 0;
        break;
      case 'Device Protection':
        productSales = (item["Upgrade & Protect Plus (Stay Connected)"] || 0) + (item["Stay Connected"] || 0);
        break;
      case 'Belong PPN':
        productSales = item["Belong PPN"] || 0;
        break;
      case 'SB NBN':
        productSales = item["SB NBN"] || 0;
        break;
      case 'Belong NBN':
        productSales = item["Belong NBN"] || 0;
        break;
      case 'Telstra Plus':
        productSales = item["Telstra Plus"] || 0;
        break;
      case 'Device Security($10/m)':
        productSales = 0; // Hidden column, usually 0
        break;
      case 'Outright Mobile/Tablet Inc Prepaid':
        productSales = item.outriCount || 0;
        break;
      case 'DPC Mobile/Tablet':
        productSales = item.dcpcount || 0;
        break;
      case 'Smart Watch':
        productSales = item.smartWatchCount || 0;
        break;
      case 'Accessory GP':
        productSales = Math.round(item.accGP) || 0;
        break;
      default:
        productSales = 0;
    }

    const incentiveAmount = productSales * bonus.bonusValue;
    if (incentiveAmount > 0) {
      productIncentive += incentiveAmount;
      productIncentiveBreakdown.push({
        product: productName,
        sales: productSales,
        bonusValue: bonus.bonusValue,
        incentive: incentiveAmount
      });
    }
  });
}

console.log('Product Incentive Breakdown:', productIncentiveBreakdown);
    
    // FIXED ROW DATA ASSIGNMENT - Proper column positioning without duplicates
    rowData["column-6"] = (item.pnncount || 0) + (item["mob-new"] || 0);
    rowData["column-7"] = item["SB PPN"]|| 0;
    rowData["column-8"] = item.bundelnewcount || 0;
    rowData["column-9"] = item["TMB-NEW (5)"]|| 0;
    rowData["column-10"] = (item["Upgrade & Protect Plus (Stay Connected)"] || 0) +
      (item["Stay Connected"] || 0);
    rowData["column-11"] = item["Belong PPN"] || 0;
   rowData["column-12"] = item["SB NBN"] || 0; 
    rowData["column-13"] = item["Belong NBN"] || 0; // Belong NBN (Compulsory KPI 1)
    
    rowData["column-14"] = item["Telstra Plus"] || 0; // Telstra Plus (Compulsory KPI 2)
    rowData["column-15"] = 0; // Device Security placeholderhidden
    rowData["column-16"] = item.outriCount;
    rowData["column-17"] = item.dcpcount;
    rowData["column-18"] = item.smartWatchCount;
    rowData["column-19"] = column17Value; // DPC percentage
    rowData["column-20"] = columnACCValue; // Accessory GP
    rowData["column-21"] = Math.round(item.accGP); // Acc GP

    const column22Value = item.grossprofit - item.accGP;
    const column22flot = Math.round(column22Value);
    rowData["column-22"] = column22flot; // Handset/Plan GP
    rowData["column-23"] = Math.round(item.grossprofit); // Total GP
    rowData["column-24"] = commission; // Commission
    rowData["column-25"] = potentialCommission; // Potential Commission
    rowData["column-26"] = productIncentive; // Product Incentive
    rowData["column-26-breakdown"] = productIncentiveBreakdown; // For tooltip

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
    const column17 = columns.find((column) => column.id === "column-20");
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

      // For column 20 (Accessory GP), return the average instead of the sum
      if (column.id === "column-20") {
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
      (column) => column.id === "column-19" 
    );
    if (column16Index !== -1) {
      totals[column16Index] = deviceProtectToDPC;
    }

    return totals;
  };
  const totals = calculateTotals();


  // FIXED HEADERS FOR KPI DISPLAY
  const headers = [
    {
      colSpan: hideColumns ? 3 : 6,
      align: "left",
      percentage: "",
      visible: true,
    },
    { colSpan: hideColumns ? 1 : 2, align: "center", kpi: "KPIPPN", visible: true },

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

    // SB NBN KPI
    { colSpan: 1, align: "center", kpi: "KPISBNBN", visible: true },
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


  const tableContainerStyles = {
    overflow: 'auto',
    borderRadius: '0 0 8px 8px',
    border: '2px solid var(--color-border)',
    borderTop: 'none',
    flex: '1 1 auto',
  };

  const stickyFooterStyles = {
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'var(--color-background)',
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
            borderBottom: "2px solid var(--color-border)",
            borderRadius: "8px 8px 0 0",
            borderLeft: "2px solid var(--color-border)",
            borderRight: "2px solid var(--color-border)",
            backgroundColor: "var(--color-surface)", 
            flexShrink: 0,
          }}
        >
          <Tabs
            value={selectedTab.index}
            onChange={handleTabChange}
            TabIndicatorProps={{
              sx: {
                  backgroundColor: "var(--color-secondary)",
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
                  borderLeft: "2px solid var(--color-primary)",
                  borderRight: "2px solid var(--color-primary)",
                  borderTop: "2px solid var(--color-primary)",
                  
                  paddingY: "25.5px",
                  marginRight: "2px",                   
        
          paddingX: "24px",
          fontWeight: "bold",
          fontSize: "14px",
          letterSpacing: "0.5px",
          backgroundColor: "var(--color-primary)", // Professional dark blue-gray
          color: "var(--color-surface)", // White text on dark tabs

                  "&:hover": {
                     backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-surface)",
                  },
                  "&.Mui-selected": {
                    borderLeft: "2px solid var(--color-secondary)",
                    borderRight: "2px solid var(--color-secondary)",
                    borderTop: "2px solid var(--color-secondary)",
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-surface)",
                     backgroundColor: "var(--color-secondary)", // Orange selected tab background
      
            
           
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
                color: "var(--color-primary)",
                "&.Mui-checked": {
                  color: "var(--color-secondary)",
                },
                "&:hover": {
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-surface)",
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
                          style={{ borderRight: "1px solid var(--color-border)" }}
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
                      if (index === 15) {
                        return null;
                      }

                      // Apply visibility conditions
                      return (!hideColumns || index > 5 || index < 3) &&
                        (!hideColumns ||
                          ( index !== 7 &&
                            index !== 10 && // Hide Device Protection when hideColumns is true
                              index !== 11 &&
                          
                            index !== 16 && // Hide Outright
                            index !== 17 && // Hide DPC Mobile/Tablet
                            index !== 18 &&
                            index !== 21 &&
                            index !== 22 )) ? ( // Hide Smart Watch
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            fontWeight: "bold",
                            color: "var(--navbar-text)",
                            backgroundColor: "var(--color-primary)",
                            border: "1px solid var(--navbar-hover)",
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
                                (colIndex >= 3 && colIndex <= 5);

                              // Hide Device Security (column 12) always
                              if (colIndex === 15) {
                                return null;
                              }

                              return (!hideColumns ||
                                colIndex > 5 ||
                                colIndex < 3) &&
                                (!hideColumns ||
                                  (colIndex !== 7 &&
                                    colIndex !== 10 &&
                                    colIndex !== 11 &&
                                    colIndex !== 16 &&
                                    colIndex !== 17 &&
                                    colIndex !== 18 &&
                                    colIndex !== 21 &&
                                    colIndex !== 22)) ? (
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
                                      handleBlur(rowIndex, column.id);
                                    }
                                  }}
                                  style={{
                                    border: "1px solid var(--color-border)",
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
                                     column.id === "column-9" ||
                                    column.id === "column-12" || // Belong NBN
                                    column.id === "column-13" || // Telstra Plus
                                    column.id === "column-14" ||
                                    column.id === "column-19" || // DPC percentage  
                                    column.id === "column-20" || // Accessory GP
                                    column.id === "column-23" ? ( // Total GP
                                    <Box
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      width="100%"
                                    >
                                      <CircularIndicator
                                        value={
                                          (column.id === "column-20" || column.id === "column-23") && value !== "N/A"
                                            ? Number(value)
                                            : value
                                        }
                                        displayValue={
                                          (column.id === "column-20" || column.id === "column-23") && value !== "N/A"
                                            ? `$${value}`
                                            : value
                                        }
                                        target={
                                          column.id === "column-6"
                                            ? target?.ppn
                                            : column.id === "column-7"
                                            ? target?.ppn
                                            : column.id === "column-8"
                                              ? target?.bundel
                                              : column.id === "column-9"
                                                ? target?.tmb
                                                : column.id === "column-12" // SB NBN
                                                  ? target?.sbNbn
                                                  : column.id === "column-13" // Belong NBN
                                                  ? target?.tyro
                                                  : column.id === "column-14" // Telstra Plus
                                                    ? target?.websitebas
                                                    : column.id === "column-19"
                                                      ? target?.dpc
                                                      : column.id === "column-20"
                                                        ? target?.AcceGP_Handset_Sales
                                                        : column.id === "column-23"
                                                          ? target?.gpGreenTarget
                                                          : null
                                        }
                                        isDpcColumn={column.id === "column-19"}
                                        isGPColumn={column.id === "column-23"}
                                        tierThresholds={column.id === "column-23" ? {
                                          tier1: target?.gpGreenTarget || 12000,
                                          tier2: target?.gpTier2Threshold || 14000,
                                          tier3: target?.gpTier3Threshold || 16000
                                        } : null}
                                        kpiTarget={KPITargets}
                                        isPPNCombined={column.id === "column-6" || column.id === "column-7"}
                                        ppnCombinedData={
                                          (column.id === "column-6" || column.id === "column-7") ? {
                                            column6Value: row["column-6"],
                                            column7Value: row["column-7"]
                                          } : null
                                        }
                                      />
                                    </Box>
                                  ) : column.id === "column-26" ? ( // Product Incentive - with tooltip
                                      <Tooltip
                                        title={
                                          row["column-26-breakdown"] && row["column-26-breakdown"].length > 0 ? (
                                            <div>
                                              <strong>Product Incentive Breakdown:</strong>
                                              {row["column-26-breakdown"].map((item, idx) => (
                                                <div key={idx} style={{ marginTop: '4px' }}>
                                                  {item.product}: {item.sales} × ${item.bonusValue} = ${item.incentive.toFixed(2)}
                                                </div>
                                              ))}
                                              <div style={{ marginTop: '8px', borderTop: '1px solid #ccc', paddingTop: '4px' }}>
                                                <strong>Total: ${value}</strong>
                                              </div>
                                            </div>
                                          ) : "No product bonuses configured"
                                        }
                                        arrow
                                        placement="top"
                                      >
                                        <span style={{ cursor: 'help' }}>${value}</span>
                                      </Tooltip>
                                    ) : // FIXED DOLLAR FORMATTING for repositioned columns
                                    // column.id === "column-18" || // Accessory GP
                                    column.id === "column-20" || // Acc GP
                                    column.id === "column-21" || // Handset/Plan GP
                                    column.id === "column-22" || // Total GP
                                    (column.id === "column-24" && // Commission
                                      value !== "Not Set" &&
                                      value !== "Not Eligible") ||
                                    (column.id === "column-25" && // Potential Commission
                                      value !== "Reach Min GP First" &&
                                      value !== "KPI Requirements Not Met" &&
                                      value !== "Month Complete") ? ( // No tooltip for potential commission
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
                      if (index === 15) {
                        return null;
                      }
                      return (!hideColumns || index > 5 || index < 3) &&  
                        (!hideColumns ||
                          (index !== 7 &&
                            index !== 10 &&
                            index !== 11 &&
                            index !== 16 &&
                            index !== 17 &&
                            index !== 18 &&
                            index !== 21 &&
                            index !== 22 )) ? (
                        <TableCell
                          key={index}
                          align="center"
                          style={{
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "var(--color-primary)",
                            fontWeight: "bold",
                            color: "var(--color-surface)",
                            borderTop: "1px solid var(--color-primary)",
                          }}
                        >
                          {/* FIXED TOTALS DOLLAR FORMATTING for repositioned columns */}
                          {index === 20 || // Accessory GP
                            index === 21 || // Acc GP
                            index === 22 || // Handset/Plan GP
                            index === 23 || // Total GP
                            index === 24 || // Commission
                            index === 25 || // Potential Commission
                            index === 26   // Product Incentive
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