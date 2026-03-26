// import React, { useState ,useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Button, TextField, Typography,CircularProgress,FormControl, Select, MenuItem, InputLabel } from '@mui/material';
// import Navbar from '../components/Navbar';
// import './SetTargetForm.css'; // Import your CSS file for additional styling
// import { getTargetThunk, updateTargetThunk,createTargetThunk} from '../features/targetSlice';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import FortnightDropdown from '../components/FortnightDropdown';

// const SetTargetForm = () => {
//   const [gpTarget, setGpTarget] = useState('')
//   const [dpcTarget, setDpcTarget] = useState('');
//   const [bundleTmbTarget, setBundleTmbTarget] = useState('');
//   const [ppnTarget, setPpnTarget] = useState('');
//   const [tmbTarget, setTmbTarget] = useState('');
//   const [tyroTarget, setTyroTarget] = useState('');
//   const [gpGreenTarget,setGpGreenTarget] =useState('')
//   const [websiteBasTarget, setWebsiteBasTarget] = useState('');
//   const [deviceSecurityTarget, setDeviceSecurityTarget] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState('TRARALGON');
//   const [selectedFortnight, setSelectedFortnight] = useState();
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const dispatch = useDispatch();
//   const { target, loading, error } = useSelector((state) => state.targets);
// console.log({fromDate,toDate})
// const formatDate = (date) => {
//   // console.log(date);
//   const day = String(date.getUTCDate()).padStart(2, '0');
//   const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//   const year = String(date.getUTCFullYear()).slice(2); // Get last 2 digits of the year
//   return `${day}/${month}/${year}`;
// };
//   useEffect(() => {
// console.log({fromDate,toDate})
// const formattedFromDate = formatDate(new Date(fromDate));
// const formattedToDate = formatDate(new Date(toDate));
//     dispatch(getTargetThunk({ salelocation:selectedLocation, startDate:formattedFromDate, endDate: formattedToDate}));
//   }, [dispatch,selectedLocation, fromDate,toDate]);


//   useEffect(() => {
//     if (target ) {
//       console.log(target);
      
//     }
//   }, [target]);
//   useEffect(() => {
//     if (target) {
      
//       setDpcTarget(target?.dpc || '');
//       setGpTarget(target?.AcceGP_Handset_Sales||'')
//       setBundleTmbTarget(target?.bundel || '');
//       setPpnTarget(target?.ppn || '');
//       setTmbTarget(target?.tmb || '');
//       setTyroTarget(target?.tyro || '');
//       setWebsiteBasTarget(target?.websitebas || '');
//       setDeviceSecurityTarget(target?.devicesecurity || '');
//       setGpGreenTarget(target?.gpGreenTarget || '')
//     } else {
      
//       setDpcTarget('');
//       setGpTarget('')
//       setBundleTmbTarget('');
//       setPpnTarget('');
//       setTmbTarget('');
//       setTyroTarget('');
//       setWebsiteBasTarget('');
//       setDeviceSecurityTarget('');
//       setGpGreenTarget('')
//     }
//   }, [target, fromDate]);

// console.log(target,"target")

//   const handleUpdateTarget = async (event) => {
//     event.preventDefault();
  
//     const targetData = {
//       createdDate: fromDate,
//       salelocation: selectedLocation,
//       dpc: dpcTarget,
//       bundel: bundleTmbTarget,
//       ppn: ppnTarget,
//       tmb: tmbTarget,
//       tyro: tyroTarget,
//       websitebas: websiteBasTarget,
//       devicesecurity: deviceSecurityTarget,
//       AcceGP_Handset_Sales:gpTarget,
//       gpGreenTarget:gpGreenTarget
//     };
  
//    const formattedFromDate = formatDate(new Date(fromDate));
//   const formattedTargetCreatedDate = target ? formatDate(new Date(target.createdDate)) : null;

//   if (target && target._id && formattedTargetCreatedDate === formattedFromDate) {
//       // Update existing target
//       const result = await dispatch(updateTargetThunk({
//         targetId: target._id,
//         targetData,
//       }));
  
//       if (result.meta.requestStatus === 'fulfilled') {
//         toast.success('Target updated successfully!');
//       } else {
//         toast.error('Failed to update target. Please try again.');
//       }
//     } else {
//       // Create new target
//       const result = await dispatch(createTargetThunk(targetData));
  
//       if (result.meta.requestStatus === 'fulfilled') {
//         toast.success('Target created successfully!');
//       } else {
//         toast.error('Failed to create target. Please try again.');
//       }
//     }
//   };
//   return (
//     <>
//       <Navbar />
//       <ToastContainer />
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="90vh"
//         flexDirection="column"
//         padding="20px"
//       >
//        <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={2}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Set Targets
//           </Typography>
//           <FortnightDropdown
//             selectedFortnight={selectedFortnight}
//             setSelectedFortnight={setSelectedFortnight}
//             setFromDate={setFromDate}
//             setToDate={setToDate}
//           />
//         </Box>
       
//         {loading ? (
//           <CircularProgress />
//         ) : 
//         // error ? (
//         //   <Typography color="error">
//         //     {error.response?.status === 404
//         //       ? 'Target data not found. Please check the endpoint.'
//         //       : 'An error occurred. Please try again.'}
//         //   </Typography>
//         // ) :
        
//         (
//           <form className="form-container" onSubmit={handleUpdateTarget}>
            
//             <FormControl variant="outlined" fullWidth margin="normal">
//               <InputLabel>Select Location</InputLabel>
//               <Select
//                 value={selectedLocation}
//                 onChange={(e) => setSelectedLocation(e.target.value)}
//                 label="Select Location"
//               >
//                 <MenuItem value="all-store">All Stores</MenuItem>
//                 <MenuItem value="TRARALGON">TRARALGON</MenuItem>
//                 <MenuItem value="WARRAGUL">WARRAGUL</MenuItem>
//                 <MenuItem value="TORQUAY">TORQUAY</MenuItem>
//               </Select>
//             </FormControl>
           
//             <TextField
//               label="Device Protect to Hand/Tab U&P Target"
//               type="number"
//               value={dpcTarget}
//               onChange={(e) =>setDpcTarget(e.target.value) }
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//              <TextField
//               label="Accessory GP to Handset Sales Target"
//               type="number"
//               value={gpTarget}
//               onChange={(e) => setGpTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Bundle New Target"
//               type="number"
//               value={bundleTmbTarget}
//               onChange={(e) => setBundleTmbTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="PPN Target"
//               type="number"
//               value={ppnTarget}
//               onChange={(e) => setPpnTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="MBB Target"
//               type="number"
//               value={tmbTarget}
//               onChange={(e) => setTmbTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Tyro Target"
//               type="number"
//               value={tyroTarget}
//               onChange={(e) => setTyroTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Telstra Plus Target"
//               type="number"
//               value={websiteBasTarget}
//               onChange={(e) => setWebsiteBasTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//             {/* <TextField
//               label="Device Security Target"
//               type="number"
//               value={deviceSecurityTarget}
//               onChange={(e) => setDeviceSecurityTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             /> */}
//             <TextField
//               label="GP Target"
//               type="number"
//               value={gpGreenTarget}
//               onChange={(e) => setGpGreenTarget(e.target.value)}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//             />
//               <Button type="submit" variant="contained" color="primary">Submit</Button>
//           </form>
//         )}
      
//       </Box>
//     </>
//   );
// };

// export default SetTargetForm;


import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Paper,
  Grid,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../components/Navbar';
import './SetTargetForm.css';
import { getTargetThunk, updateTargetThunk, createTargetThunk } from '../features/targetSlice';
import {
  getProrataStaffThunk,
  createProrataStaffThunk,
  updateProrataStaffThunk,
  deleteProrataStaffThunk
} from '../features/prorataStaffSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FortnightDropdown from '../components/FortnightDropdown';
import { useSelector } from 'react-redux';
import { selectIsDemo } from '../features/authSlice';
import { getStaffByLocation, syncStaffFromExternal } from '../api/services';

const SetTargetForm = () => {
  const [gpTarget, setGpTarget] = useState('');
  const [dpcTarget, setDpcTarget] = useState('');
  const [bundleTmbTarget, setBundleTmbTarget] = useState('');
  const [ppnTarget, setPpnTarget] = useState('');
  const [tmbTarget, setTmbTarget] = useState('');
  const [tyroTarget, setTyroTarget] = useState('');
  const [sbNbnTarget, setSbNbnTarget] = useState('');
  const [websiteBasTarget, setWebsiteBasTarget] = useState('');
  const [deviceSecurityTarget, setDeviceSecurityTarget] = useState('');
  
  // New GP threshold tiers
  const [gpGreenTarget,setGpGreenTarget] = useState('12000');
  const [gpTier2Threshold, setGpTier2Threshold] = useState('14000');
  const [gpTier3Threshold, setGpTier3Threshold] = useState('16000');

  // Product bonus states
  const [selectedProduct, setSelectedProduct] = useState('');
  const [bonusValue, setBonusValue] = useState('');
  const [productBonuses, setProductBonuses] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState('TRARALGON');
  const [selectedFortnight, setSelectedFortnight] = useState();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const { target, loading, error } = useSelector((state) => state.targets);
  const { staffList, loading: prorataLoading } = useSelector((state) => state.prorataStaff);
  const isDemo = useSelector(selectIsDemo);

  // Pro-Rata Staff states
  const [availableStaff, setAvailableStaff] = useState([]);
  const [selectedStaffName, setSelectedStaffName] = useState('');
  const [editingStaffId, setEditingStaffId] = useState(null);

  // Pro-Rata Staff target states for current editing staff
  const [prorataTargets, setProrataTargets] = useState({
    AcceGP_Handset_Sales: '',
    dpc: '',
    ppn: '',
    bundel: '',
    tmb: '',
    tyro: '',
    sbNbn: '',
    websitebas: '',
    devicesecurity: '',
    gpGreenTarget: '12000',
    gpTier2Threshold: '14000',
    gpTier3Threshold: '16000',
  });
  const [prorataProductBonuses, setProrataProductBonuses] = useState([]);
  const [prorataSelectedProduct, setProrataSelectedProduct] = useState('');
  const [prorataBonusValue, setProrataBonusValue] = useState('');

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Available products for bonus selection
  const availableProducts = [
    'PPN',
    'SB PPN',
    'Internet NEW',
    'MBB',
    'Device Protection',
    'Belong PPN',
    'SB NBN',
    'Belong NBN',
    'Telstra Plus',
    'Device Security($10/m)',
    'Outright Mobile/Tablet Inc Prepaid',
    'U&P Mobile/Tablet',
    'Smart Watch',
    'Accessory GP'
  ];
  
  const formatDate = (date) => {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };
  
  useEffect(() => {
    if (fromDate && toDate) {
      const formattedFromDate = formatDate(new Date(fromDate));
      const formattedToDate = formatDate(new Date(toDate));
      dispatch(getTargetThunk({ 
        salelocation: selectedLocation, 
        startDate: formattedFromDate, 
        endDate: formattedToDate 
      }));
    }
  }, [dispatch, selectedLocation, fromDate, toDate]);
  
  useEffect(() => {
    if (target) {
      setDpcTarget(target?.dpc || '');
      setGpTarget(target?.AcceGP_Handset_Sales || '');
      setBundleTmbTarget(target?.bundel || '');
      setPpnTarget(target?.ppn || '');
      setTmbTarget(target?.tmb || '');
      setTyroTarget(target?.tyro || '');
      setSbNbnTarget(target?.sbNbn || '');
      setWebsiteBasTarget(target?.websitebas || '');
      setDeviceSecurityTarget(target?.devicesecurity || '');

      // Load GP tier thresholds if they exist
      setGpGreenTarget(target?.gpGreenTarget || '12000');
      setGpTier2Threshold(target?.gpTier2Threshold || '14000');
      setGpTier3Threshold(target?.gpTier3Threshold || '16000');

      // Load product bonuses if they exist
      setProductBonuses(target?.productBonuses || []);
    } else {
      setDpcTarget('');
      setGpTarget('');
      setBundleTmbTarget('');
      setPpnTarget('');
      setTmbTarget('');
      setTyroTarget('');
      setSbNbnTarget('');
      setWebsiteBasTarget('');
      setDeviceSecurityTarget('');

      // Reset to default values
      setGpGreenTarget('12000');
      setGpTier2Threshold('14000');
      setGpTier3Threshold('16000');

      // Reset product bonuses
      setProductBonuses([]);
    }
  }, [target, fromDate]);

  // Fetch available staff from database
  useEffect(() => {
    const fetchStaffNames = async () => {
      if (selectedLocation && selectedLocation !== 'all-store') {
        try {
          const response = await getStaffByLocation(selectedLocation);
          if (response && response.staff) {
            setAvailableStaff(response.staff.map(staff => staff.salesrep));
          }
        } catch (error) {
          console.error('Error fetching staff names:', error);
          setAvailableStaff([]);
        }
      } else {
        setAvailableStaff([]);
      }
    };
    fetchStaffNames();
  }, [selectedLocation]);

  // Fetch prorata staff for the selected location and date
  useEffect(() => {
    if (fromDate && toDate && selectedLocation && selectedLocation !== 'all-store') {
      const formattedFromDate = formatDate(new Date(fromDate));
      const formattedToDate = formatDate(new Date(toDate));
      dispatch(getProrataStaffThunk({
        salelocation: selectedLocation,
        startDate: formattedFromDate,
        endDate: formattedToDate
      }));
    }
  }, [dispatch, fromDate, toDate, selectedLocation]);

  // Handle adding a product bonus
  const handleAddProductBonus = () => {
    if (!selectedProduct || !bonusValue) {
      toast.error('Please select a product and enter a bonus value.');
      return;
    }

    if (isNaN(bonusValue) || Number(bonusValue) <= 0) {
      toast.error('Please enter a valid bonus amount.');
      return;
    }

    // Check if product already has a bonus
    const existingBonusIndex = productBonuses.findIndex(
      bonus => bonus.product === selectedProduct
    );

    if (existingBonusIndex !== -1) {
      // Update existing bonus by creating a new object
      const updatedBonuses = [...productBonuses];
      updatedBonuses[existingBonusIndex] = {
        ...updatedBonuses[existingBonusIndex],
        bonusValue: Number(bonusValue)
      };
      setProductBonuses(updatedBonuses);
      toast.success(`Updated bonus for ${selectedProduct}`);
    } else {
      // Add new bonus
      const newBonus = {
        product: selectedProduct,
        bonusValue: Number(bonusValue)
      };
      setProductBonuses([...productBonuses, newBonus]);
      toast.success(`Added bonus for ${selectedProduct}`);
    }

    // Reset form
    setSelectedProduct('');
    setBonusValue('');
  };

  // Handle removing a product bonus
  const handleRemoveProductBonus = (productToRemove) => {
    const updatedBonuses = productBonuses.filter(
      bonus => bonus.product !== productToRemove
    );
    setProductBonuses(updatedBonuses);
    toast.success(`Removed bonus for ${productToRemove}`);
  };

  // Validate the GP tier thresholds are in ascending order
  const validateTiers = () => {
    const tier1 = Number(gpGreenTarget);
    const tier2 = Number(gpTier2Threshold);
    const tier3 = Number(gpTier3Threshold);
    const newErrors = { ...errors };

    // Clear previous tier errors
    delete newErrors.gpGreenTarget;
    delete newErrors.gpTier2Threshold;
    delete newErrors.gpTier3Threshold;

    if (tier1 >= tier2) {
      newErrors.gpGreenTarget = 'Tier 1 must be less than Tier 2';
    }

    if (tier2 >= tier3) {
      newErrors.gpTier2Threshold = 'Tier 2 must be less than Tier 3';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdateTarget = async (event) => {
    event.preventDefault();
    
    if (isDemo) {
      toast.error('Demo users cannot modify targets.');
      return;
    }
    
    if (!validateTiers()) {
      toast.error('Please correct the GP tier thresholds.');
      return;
    }
    
    const targetData = {
      createdDate: fromDate,
      salelocation: selectedLocation,
      dpc: dpcTarget,
      bundel: bundleTmbTarget,
      ppn: ppnTarget,
      tmb: tmbTarget,
      tyro: tyroTarget,
      sbNbn: sbNbnTarget,
      websitebas: websiteBasTarget,
      devicesecurity: deviceSecurityTarget,
      AcceGP_Handset_Sales: gpTarget,

      // Add the GP tier thresholds
      gpGreenTarget: gpGreenTarget,
      gpTier2Threshold: gpTier2Threshold,
      gpTier3Threshold: gpTier3Threshold,

      // Add product bonuses
      productBonuses: productBonuses
    };
    
    const formattedFromDate = formatDate(new Date(fromDate));
    const formattedTargetCreatedDate = target ? formatDate(new Date(target.createdDate)) : null;
    
    if (target && target._id && formattedTargetCreatedDate === formattedFromDate) {
      // Update existing target
      const result = await dispatch(updateTargetThunk({
        targetId: target._id,
        targetData,
      }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Target updated successfully!');
      } else {
        toast.error('Failed to update target. Please try again.');
      }
    } else {
      // Create new target
      const result = await dispatch(createTargetThunk(targetData));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Target created successfully!');
      } else {
        toast.error('Failed to create target. Please try again.');
      }
    }
  };

  // Pro-Rata Staff Handlers
  const handleAddProrataStaff = async () => {
    if (!selectedStaffName) {
      toast.error('Please select a staff member to add');
      return;
    }

    if (isDemo) {
      toast.error('Demo users cannot add pro-rata staff');
      return;
    }

    // Check if staff already exists
    const existingStaff = staffList.find(
      staff => staff.salesrep === selectedStaffName
    );

    if (existingStaff) {
      toast.error('This staff member is already in the pro-rata list');
      return;
    }

    const prorataStaffData = {
      salesrep: selectedStaffName,
      salelocation: selectedLocation,
      createdDate: fromDate,
      ...prorataTargets,
      productBonuses: prorataProductBonuses,
    };

    const result = await dispatch(createProrataStaffThunk(prorataStaffData));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`${selectedStaffName} added to pro-rata staff successfully`);
      setSelectedStaffName('');
      resetProrataForm();
    } else {
      toast.error('Failed to add pro-rata staff');
    }
  };

  const handleUpdateProrataStaff = async (staffId) => {
    if (isDemo) {
      toast.error('Demo users cannot update pro-rata staff');
      return;
    }

    const prorataStaffData = {
      ...prorataTargets,
      productBonuses: prorataProductBonuses,
    };

    const result = await dispatch(updateProrataStaffThunk({
      staffId,
      prorataStaffData
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Pro-rata staff updated successfully');
      setEditingStaffId(null);
      resetProrataForm();
    } else {
      toast.error('Failed to update pro-rata staff');
    }
  };

  const handleDeleteProrataStaff = async (staffId, staffName) => {
    if (isDemo) {
      toast.error('Demo users cannot delete pro-rata staff');
      return;
    }

    const result = await dispatch(deleteProrataStaffThunk(staffId));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`${staffName} removed from pro-rata staff`);
    } else {
      toast.error('Failed to delete pro-rata staff');
    }
  };

  const handleEditProrataStaff = (staff) => {
    setEditingStaffId(staff._id);
    setProrataTargets({
      AcceGP_Handset_Sales: staff.AcceGP_Handset_Sales || '',
      dpc: staff.dpc || '',
      ppn: staff.ppn || '',
      bundel: staff.bundel || '',
      tmb: staff.tmb || '',
      tyro: staff.tyro || '',
      sbNbn: staff.sbNbn || '',
      websitebas: staff.websitebas || '',
      devicesecurity: staff.devicesecurity || '',
      gpGreenTarget: staff.gpGreenTarget || '12000',
      gpTier2Threshold: staff.gpTier2Threshold || '14000',
      gpTier3Threshold: staff.gpTier3Threshold || '16000',
    });
    setProrataProductBonuses(staff.productBonuses || []);
  };

  const resetProrataForm = () => {
    setProrataTargets({
      AcceGP_Handset_Sales: '',
      dpc: '',
      ppn: '',
      bundel: '',
      tmb: '',
      tyro: '',
      sbNbn: '',
      websitebas: '',
      devicesecurity: '',
      gpGreenTarget: '12000',
      gpTier2Threshold: '14000',
      gpTier3Threshold: '16000',
    });
    setProrataProductBonuses([]);
    setProrataSelectedProduct('');
    setProrataBonusValue('');
  };

  const handleAddProrataProductBonus = () => {
    if (!prorataSelectedProduct || !prorataBonusValue) {
      toast.error('Please select a product and enter a bonus value');
      return;
    }

    if (isNaN(prorataBonusValue) || Number(prorataBonusValue) <= 0) {
      toast.error('Please enter a valid bonus amount');
      return;
    }

    const existingIndex = prorataProductBonuses.findIndex(
      bonus => bonus.product === prorataSelectedProduct
    );

    if (existingIndex !== -1) {
      const updated = [...prorataProductBonuses];
      updated[existingIndex] = {
        ...updated[existingIndex],
        bonusValue: Number(prorataBonusValue)
      };
      setProrataProductBonuses(updated);
      toast.success(`Updated bonus for ${prorataSelectedProduct}`);
    } else {
      setProrataProductBonuses([
        ...prorataProductBonuses,
        { product: prorataSelectedProduct, bonusValue: Number(prorataBonusValue) }
      ]);
      toast.success(`Added bonus for ${prorataSelectedProduct}`);
    }

    setProrataSelectedProduct('');
    setProrataBonusValue('');
  };

  const handleRemoveProrataProductBonus = (product) => {
    setProrataProductBonuses(
      prorataProductBonuses.filter(bonus => bonus.product !== product)
    );
    toast.success(`Removed bonus for ${product}`);
  };

  // Sync staff from external API - ALL LOCATIONS
  const handleSyncStaff = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select a date range first');
      return;
    }

    if (isDemo) {
      toast.error('Demo users cannot sync staff');
      return;
    }

    try {
      const formattedFromDate = formatDate(new Date(fromDate));
      const formattedToDate = formatDate(new Date(toDate));

      toast.info('Syncing staff from ALL locations...');

      const response = await syncStaffFromExternal(formattedFromDate, formattedToDate);

      toast.success(response.message);

      // Show location summary
      if (response.locationSummary && response.locationSummary.length > 0) {
        const summary = response.locationSummary
          .map(loc => `${loc.location}: +${loc.added} new`)
          .join(', ');
        toast.info(summary, { autoClose: 8000 });
      }

      // Refresh staff list for current location
      if (selectedLocation && selectedLocation !== 'all-store') {
        const staffResponse = await getStaffByLocation(selectedLocation);
        if (staffResponse && staffResponse.staff) {
          setAvailableStaff(staffResponse.staff.map(staff => staff.salesrep));
        }
      }
    } catch (error) {
      console.error('Error syncing staff:', error);
      toast.error('Failed to sync staff from external API');
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
        flexDirection="column"
        padding="15px"
      >
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={2}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 0, mr: 2 }}>
            Target Management
          </Typography>
          <FortnightDropdown
            selectedFortnight={selectedFortnight}
            setSelectedFortnight={setSelectedFortnight}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </Box>

        {/* Tabs */}
        <Box sx={{ width: '100%', maxWidth: '900px' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            centered
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3
            }}
          >
            <Tab label="Store Targets" />
            <Tab label="Pro-Rata Staff" />
          </Tabs>
        </Box>
       
        {/* Tab Panel 0 - Store Targets */}
        {currentTab === 0 && (
          loading ? (
            <CircularProgress />
          ) : (
            <form className="form-container" onSubmit={handleUpdateTarget} style={{ width: '40%' }}>
            
            <FormControl variant="outlined" fullWidth margin="dense" size="small" sx={{ mb: 1 }}>
              <InputLabel>Select Location</InputLabel>
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                label="Select Location"
                size="small"
                disabled={isDemo}
              >
                <MenuItem value="all-store">All Stores</MenuItem>
                <MenuItem value="TRARALGON">TRARALGON</MenuItem>
                <MenuItem value="WARRAGUL">WARRAGUL</MenuItem>
                <MenuItem value="TORQUAY">TORQUAY</MenuItem>
              </Select>
            </FormControl>
           
            <TextField
              label="Device Protect to Hand/Tab U&P Target"
              type="number"
              value={dpcTarget}
              onChange={(e) =>setDpcTarget(e.target.value) }
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
             <TextField
              label="Accessory GP to Handset Sales Target"
              type="number"
              value={gpTarget}
              onChange={(e) => setGpTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            <TextField
              label="Internet NEW Target"
              type="number"
              value={bundleTmbTarget}
              onChange={(e) => setBundleTmbTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            <TextField
              label="PPN Target"
              type="number"
              value={ppnTarget}
              onChange={(e) => setPpnTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            <TextField
              label="MBB Target"
              type="number"
              value={tmbTarget}
              onChange={(e) => setTmbTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            <TextField
              label="SB NBN Target"
              type="number"
              value={sbNbnTarget}
              onChange={(e) => setSbNbnTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            <TextField
              label="Belong NBN Target"
              type="number"
              value={tyroTarget}
              onChange={(e) => setTyroTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            <TextField
              label="Telstra Plus Target"
              type="number"
              value={websiteBasTarget}
              onChange={(e) => setWebsiteBasTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              disabled={isDemo}
            />
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>GP Tier Thresholds</Typography>
            
            <TextField
              label="Tier 1 GP Threshold"
              type="number"
              value={gpGreenTarget}
              onChange={(e) => setGpGreenTarget(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.gpGreenTarget}
              helperText={errors.gpGreenTarget}
              disabled={isDemo}
            />
            <TextField
              label="Tier 2 GP Threshold"
              type="number"
              value={gpTier2Threshold}
              onChange={(e) => setGpTier2Threshold(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.gpTier2Threshold}
              helperText={errors.gpTier2Threshold}
              disabled={isDemo}
            />
            <TextField
              label="Tier 3 GP Threshold"
              type="number"
              value={gpTier3Threshold}
              onChange={(e) => setGpTier3Threshold(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              size="small"
              error={!!errors.gpTier3Threshold}
              helperText={errors.gpTier3Threshold}
              disabled={isDemo}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Product Bonus Values</Typography>

            {/* Product Selection and Bonus Input */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={5}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel>Select Product</InputLabel>
                  <Select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    label="Select Product"
                    disabled={isDemo}
                  >
                    {availableProducts.map((product) => (
                      <MenuItem key={product} value={product}>
                        {product}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Bonus Value ($)"
                  type="number"
                  value={bonusValue}
                  onChange={(e) => setBonusValue(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                  disabled={isDemo}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddProductBonus}
                  startIcon={<AddIcon />}
                  disabled={isDemo}
                  size="small"
                >
                  Add Bonus
                </Button>
              </Grid>
            </Grid>

            {/* Display Current Product Bonuses */}
            {productBonuses.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Current Product Bonuses:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {productBonuses.map((bonus, index) => (
                    <Chip
                      key={index}
                      label={`${bonus.product}: $${bonus.bonusValue}`}
                      onDelete={!isDemo ? () => handleRemoveProductBonus(bonus.product) : undefined}
                      deleteIcon={<DeleteIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" disabled={isDemo}>
                {isDemo ? 'Demo User - View Only' : 'Submit'}
              </Button>
            </Box>
          </form>
          )
        )}

        {/* Tab Panel 1 - Pro-Rata Staff */}
        {currentTab === 1 && (
          <Box sx={{ width: '80%' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon /> Pro-Rata Staff Management
            </Typography>

            {/* Location Selector for Pro-Rata Staff */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <FormControl variant="outlined" fullWidth size="small">
                <InputLabel>Select Location</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  label="Select Location"
                  disabled={isDemo}
                >
                  <MenuItem value="TRARALGON">TRARALGON</MenuItem>
                  <MenuItem value="WARRAGUL">WARRAGUL</MenuItem>
                  <MenuItem value="TORQUAY">TORQUAY</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {!selectedLocation || selectedLocation === 'all-store' ? (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
                <Typography variant="body1" color="text.secondary">
                  Please select a location above to manage Pro-Rata Staff.
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Add Pro-Rata Staff Form */}
                <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Add Pro-Rata Staff</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleSyncStaff}
                  disabled={isDemo}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Sync All Locations
                </Button>
              </Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel>Select Staff Member</InputLabel>
                    <Select
                      value={selectedStaffName}
                      onChange={(e) => setSelectedStaffName(e.target.value)}
                      label="Select Staff Member"
                      disabled={isDemo}
                    >
                      {availableStaff.length > 0 ? (
                        availableStaff.map((staffName, index) => (
                          <MenuItem key={index} value={staffName}>
                            {staffName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No staff available - Click "Sync Staff" to load
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProrataStaff}
                    startIcon={<AddIcon />}
                    disabled={isDemo || !selectedStaffName}
                    fullWidth
                  >
                    Add to Pro-Rata List
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Pro-Rata Staff List */}
            {prorataLoading ? (
              <CircularProgress />
            ) : staffList.length > 0 ? (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Pro-Rata Staff List ({staffList.length})
                </Typography>
                {staffList.map((staff) => (
                  <Accordion key={staff._id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                        <Typography variant="h6">{staff.salesrep}</Typography>
                        <Box>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProrataStaff(staff);
                            }}
                            disabled={isDemo}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProrataStaff(staff._id, staff.salesrep);
                            }}
                            disabled={isDemo}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ width: '100%' }}>
                        {editingStaffId === staff._id ? (
                          /* Edit Form */
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                              Edit Targets for {staff.salesrep}
                            </Typography>

                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <TextField
                                  label="U&P Target"
                                  type="number"
                                  value={prorataTargets.dpc}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, dpc: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="Accessory GP Target"
                                  type="number"
                                  value={prorataTargets.AcceGP_Handset_Sales}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, AcceGP_Handset_Sales: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="Bundle New Target"
                                  type="number"
                                  value={prorataTargets.bundel}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, bundel: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="PPN Target"
                                  type="number"
                                  value={prorataTargets.ppn}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, ppn: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="MBB Target"
                                  type="number"
                                  value={prorataTargets.tmb}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, tmb: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="SB NBN Target"
                                  type="number"
                                  value={prorataTargets.sbNbn}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, sbNbn: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="Belong NBN Target"
                                  type="number"
                                  value={prorataTargets.tyro}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, tyro: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="Telstra Plus Target"
                                  type="number"
                                  value={prorataTargets.websitebas}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, websitebas: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              GP Tier Thresholds
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <TextField
                                  label="Tier 1 GP Threshold"
                                  type="number"
                                  value={prorataTargets.gpGreenTarget}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, gpGreenTarget: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Tier 2 GP Threshold"
                                  type="number"
                                  value={prorataTargets.gpTier2Threshold}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, gpTier2Threshold: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Tier 3 GP Threshold"
                                  type="number"
                                  value={prorataTargets.gpTier3Threshold}
                                  onChange={(e) => setProrataTargets({ ...prorataTargets, gpTier3Threshold: e.target.value })}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              Product Bonuses
                            </Typography>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                              <Grid item xs={5}>
                                <FormControl variant="outlined" fullWidth size="small">
                                  <InputLabel>Select Product</InputLabel>
                                  <Select
                                    value={prorataSelectedProduct}
                                    onChange={(e) => setProrataSelectedProduct(e.target.value)}
                                    label="Select Product"
                                    disabled={isDemo}
                                  >
                                    {availableProducts.map((product) => (
                                      <MenuItem key={product} value={product}>
                                        {product}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Bonus Value ($)"
                                  type="number"
                                  value={prorataBonusValue}
                                  onChange={(e) => setProrataBonusValue(e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={isDemo}
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={handleAddProrataProductBonus}
                                  startIcon={<AddIcon />}
                                  disabled={isDemo}
                                  size="small"
                                  fullWidth
                                >
                                  Add
                                </Button>
                              </Grid>
                            </Grid>

                            {prorataProductBonuses.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>Current Bonuses:</Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                  {prorataProductBonuses.map((bonus, index) => (
                                    <Chip
                                      key={index}
                                      label={`${bonus.product}: $${bonus.bonusValue}`}
                                      onDelete={!isDemo ? () => handleRemoveProrataProductBonus(bonus.product) : undefined}
                                      deleteIcon={<DeleteIcon />}
                                      color="primary"
                                      variant="outlined"
                                      size="small"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}

                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUpdateProrataStaff(staff._id)}
                                disabled={isDemo}
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                  setEditingStaffId(null);
                                  resetProrataForm();
                                }}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          /* Display View */
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              Targets
                            </Typography>
                            <Grid container spacing={2}>
                              {staff.dpc && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>U&P:</strong> {staff.dpc}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.AcceGP_Handset_Sales && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>Accessory GP:</strong> {staff.AcceGP_Handset_Sales}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.bundel && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>Internet NEW:</strong> {staff.bundel}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.ppn && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>PPN:</strong> {staff.ppn}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.tmb && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>MBB:</strong> {staff.tmb}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.sbNbn && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>SB NBN:</strong> {staff.sbNbn}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.tyro && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>Belong NBN:</strong> {staff.tyro}
                                  </Typography>
                                </Grid>
                              )}
                              {staff.websitebas && (
                                <Grid item xs={6} sm={4}>
                                  <Typography variant="body2">
                                    <strong>Telstra Plus:</strong> {staff.websitebas}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              GP Tier Thresholds
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  <strong>Tier 1:</strong> ${staff.gpGreenTarget || '12000'}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  <strong>Tier 2:</strong> ${staff.gpTier2Threshold || '14000'}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  <strong>Tier 3:</strong> ${staff.gpTier3Threshold || '16000'}
                                </Typography>
                              </Grid>
                            </Grid>

                            {staff.productBonuses && staff.productBonuses.length > 0 && (
                              <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                  Product Bonuses
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                  {staff.productBonuses.map((bonus, index) => (
                                    <Chip
                                      key={index}
                                      label={`${bonus.product}: $${bonus.bonusValue}`}
                                      color="success"
                                      variant="outlined"
                                      size="small"
                                    />
                                  ))}
                                </Box>
                              </>
                            )}
                          </Box>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : (
                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
                  <Typography variant="body1" color="text.secondary">
                    No pro-rata staff added yet. Select a staff member above to get started.
                  </Typography>
                </Paper>
              )}
            </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SetTargetForm;