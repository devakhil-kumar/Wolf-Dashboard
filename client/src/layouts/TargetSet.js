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
//               label="Device Protect to Hand/Tab DPC Target"
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
//               label="TMB Target"
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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import './SetTargetForm.css';
import { getTargetThunk, updateTargetThunk, createTargetThunk } from '../features/targetSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FortnightDropdown from '../components/FortnightDropdown';
import { useSelector } from 'react-redux';
import { selectIsDemo } from '../features/authSlice';

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
  const isDemo = useSelector(selectIsDemo);

  // Available products for bonus selection
  const availableProducts = [
    'PPN',
    'SB PPN',
    'Bundle New',
    'TMB',
    'Device Protection',
    'Belong PPN',
    'SB NBN',
    'Belong NBN',
    'Telstra Plus',
    'Device Security($10/m)',
    'Outright Mobile/Tablet Inc Prepaid',
    'DPC Mobile/Tablet',
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
       <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={1}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 0, mr: 2 }}>
            Set Targets
          </Typography>
          <FortnightDropdown
            selectedFortnight={selectedFortnight}
            setSelectedFortnight={setSelectedFortnight}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </Box>
       
        {loading ? (
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
              label="Device Protect to Hand/Tab DPC Target"
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
              label="Bundle New Target"
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
              label="TMB Target"
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
        )}
      </Box>
    </>
  );
};

export default SetTargetForm;