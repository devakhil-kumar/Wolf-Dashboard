



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
  Paper,
  Grid,
  InputLabel,
  Divider
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FortnightDropdown from '../components/FortnightDropdown';
import Navbar from '../components/Navbar';
import { getKPITargetThunk, updateKPITargetThunk, createKPITargetThunk } from '../features/kpiTargetSlice';
import { getTargetThunk } from '../features/targetSlice';
import { useSelector } from 'react-redux';
import { selectIsDemo } from '../features/authSlice';

const TargetKPI = () => {
  const defaultFormData = {
    KPITMB: '',
    KPIPPN: '',
    KPIBundle: '',
    KPISBNBN: '',
    KPITWD: '',
    KPIDPC: '',
    KPIACCGP: '',
    KPIMAIN: '',
    NPSVoltarget: '6',
    NPSScoreTargetMin: '60',    // Changed from NPSScoreTargetMin to NPSScoreTargetMin
    NPSScoreTargetMax: '75',
    GPCommissionPercentage: '4',
    GPTier2Percentage: '5.5',
    GPTier3Percentage: '7',
    NPSMultiplierLow: '0.5',      // New: For score below target OR volume below target
    NPSMultiplierMid: '1.0',      // New: For score at/above target but volume below target
    NPSMultiplierHigh: '1.5'      // New: For both score and volume at/above targets
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [selectedLocation, setSelectedLocation] = useState('TRARALGON');
  const [selectedFortnight, setSelectedFortnight] = useState();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errors, setErrors] = useState({});
  const [totalError, setTotalError] = useState(false);
  const [tierThresholds, setTierThresholds] = useState({
    tier1: '12000',
    tier2: '14000',
    tier3: '16000'
  });

  const dispatch = useDispatch();
  const { KPITarget, loading, error } = useSelector((state) => state.KPITargets);
  const { target } = useSelector((state) => state.targets);
  const isDemo = useSelector(selectIsDemo);

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

      dispatch(getKPITargetThunk({
        salelocation: selectedLocation,
        startDate: formattedFromDate,
        endDate: formattedToDate
      }));

      dispatch(getTargetThunk({
        salelocation: selectedLocation,
        startDate: formattedFromDate,
        endDate: formattedToDate
      }));
    }
  }, [dispatch, selectedLocation, fromDate, toDate]);

  useEffect(() => {
    if (target) {
      setTierThresholds({
        tier1: target.gpGreenTarget || '12000',
        tier2: target.gpTier2Threshold || '14000',
        tier3: target.gpTier3Threshold || '16000'
      });
    }
  }, [target]);

  useEffect(() => {
    if (KPITarget) {
      setFormData({
        KPITMB: KPITarget?.KPITMB || '',
        KPIPPN: KPITarget?.KPIPPN || '',
        KPIBundle: KPITarget?.KPIBundle || '',
        KPISBNBN: KPITarget?.KPISBNBN || '',
        KPITWD: KPITarget?.KPITWD || '',
        KPIDPC: KPITarget?.KPIDPC || '',
        KPIACCGP: KPITarget?.KPIACCGP || '',
        KPIMAIN: KPITarget?.KPIMAIN || '',
        NPSVoltarget: KPITarget?.NPSVoltarget || '6',
        NPSScoreTargetMin: KPITarget?.NPSScoreTargetMin || '60',
        NPSScoreTargetMax: KPITarget?.NPSScoreTargetMax || '75',
        GPCommissionPercentage: KPITarget?.GPCommissionPercentage || '4',
        GPTier2Percentage: KPITarget?.GPTier2Percentage || '5.5',
        GPTier3Percentage: KPITarget?.GPTier3Percentage || '7',
        NPSMultiplierLow: KPITarget?.NPSMultiplierLow || '0.5',
        NPSMultiplierMid: KPITarget?.NPSMultiplierMid || '1.0',
        NPSMultiplierHigh: KPITarget?.NPSMultiplierHigh || '1.5'
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [KPITarget]);

  const validateAndUpdateField = (field, value, min, max) => {
    const numValue = Number(value);
    let newErrors = { ...errors };
    delete newErrors[field];

    // if (isNaN(numValue) || numValue < min || numValue > max) {
    //   newErrors[field] = `Value must be between ${min} and ${max}`;
    // }

    // Validate NPS score min/max relationship
    if (field === 'NPSScoreTargetMin' || field === 'NPSScoreTargetMax') {
      const minScore = field === 'NPSScoreTargetMin' ? numValue : Number(formData.NPSScoreTargetMin);
      const maxScore = field === 'NPSScoreTargetMax' ? numValue : Number(formData.NPSScoreTargetMax);
      if (minScore >= maxScore) {
        newErrors[field] = field === 'NPSScoreTargetMin' 
          ? `Min must be less than Max (${maxScore})`
          : `Max must be greater than Min (${minScore})`;
      }
    }

    if (['GPCommissionPercentage', 'GPTier2Percentage', 'GPTier3Percentage'].includes(field)) {
      const tier1Value = field === 'GPCommissionPercentage' ? numValue : Number(formData.GPCommissionPercentage);
      const tier2Value = field === 'GPTier2Percentage' ? numValue : Number(formData.GPTier2Percentage);
      const tier3Value = field === 'GPTier3Percentage' ? numValue : Number(formData.GPTier3Percentage);

      if (field === 'GPCommissionPercentage' && tier1Value >= tier2Value) {
        newErrors[field] = `Tier 1 % must be less than Tier 2 % (${tier2Value})`;
      } else if (field === 'GPTier2Percentage') {
        if (tier2Value <= tier1Value) {
          newErrors[field] = `Tier 2 % must be greater than Tier 1 % (${tier1Value})`;
        } else if (tier2Value >= tier3Value) {
          newErrors[field] = `Tier 2 % must be less than Tier 3 % (${tier3Value})`;
        }
      } else if (field === 'GPTier3Percentage' && tier3Value <= tier2Value) {
        newErrors[field] = `Tier 3 % must be greater than Tier 2 % (${tier2Value})`;
      }
    }

    if (['KPIPPN', 'KPIBundle', 'KPITMB', 'KPISBNBN', 'KPITWD', 'KPIDPC', 'KPIACCGP'].includes(field)) {
      const newFormData = { ...formData, [field]: value };
      const total = ['KPIPPN', 'KPIBundle', 'KPITMB', 'KPISBNBN', 'KPITWD', 'KPIDPC', 'KPIACCGP']
        .reduce((sum, f) => sum + Number(newFormData[f]), 0);
      setTotalError(total > 100);
    }

    setErrors(newErrors);
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const isFormValid = () => {
    return !totalError && Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isDemo) {
      toast.error('Demo users cannot modify KPI targets.');
      return;
    }
    if (!isFormValid()) {
      toast.error('Please correct the errors before submitting.');
      return;
    }
    const targetData = {
      createdDate: fromDate,
      salelocation: selectedLocation,
      ...formData,
      updatedBy: 'Current User',
    };

    const formattedFromDate = formatDate(new Date(fromDate));
    const formattedKPICreatedDate = KPITarget ? formatDate(new Date(KPITarget.createdDate)) : null;

    if (KPITarget && KPITarget._id && formattedKPICreatedDate === formattedFromDate) {
      const result = await dispatch(updateKPITargetThunk({
        targetId: KPITarget._id,
        targetData,
      }));
      result.meta.requestStatus === 'fulfilled' 
        ? toast.success('KPI target updated successfully!')
        : toast.error('Failed to update KPI target. Please try again.');
    } else {
      const result = await dispatch(createKPITargetThunk(targetData));
      result.meta.requestStatus === 'fulfilled'
        ? toast.success('KPI target created successfully!')
        : toast.error('Failed to create KPI target. Please try again.');
    }
  };

  const renderTextField = (label, field, min, max) => (
    <TextField
      label={label}
      type="number"
      value={formData[field]}
      onChange={(e) => validateAndUpdateField(field, e.target.value, min, max)}
      variant="outlined"
      fullWidth
      margin="dense"
      size="small"
      error={!!errors[field]}
      helperText={errors[field]}
      disabled={isDemo}
    />
  );

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="75vh"
        flexDirection="column"
        padding="15px"
      >
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={1}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 0, mr: 2 }}>
            Set KPI Targets
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
          <form onSubmit={handleSubmit} style={{ width: '75%' }}>
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

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 1.5, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>KPI Targets</Typography>
                  {renderTextField("PPN % Target", "KPIPPN", 0, 100)}
                  {renderTextField("Bundle % Target", "KPIBundle", 0, 100)}
                  {renderTextField("TMB % Target", "KPITMB", 0, 100)}
                  {renderTextField("SB NBN % Target", "KPISBNBN", 0, 100)}
                  {renderTextField("TWD % Target", "KPITWD", 0, 100)}
                  {renderTextField("DPC % Target", "KPIDPC", 0, 100)}
                  {renderTextField("Accessory GP % Target", "KPIACCGP", 0, 100)}
                  {totalError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      Total of KPI targets cannot exceed 100%
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 1.5, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>Commission Based Fields</Typography>
                  {renderTextField("Main % Target to get commission", "KPIMAIN", 0, 100)}
                  {renderTextField("NPS Vol Target", "NPSVoltarget", 0, 100)}
                  {renderTextField("NPS Score Min Target", "NPSScoreTargetMin", 0, 100)}
                  {renderTextField("NPS Score Max Target", "NPSScoreTargetMax", 0, 100)}

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>NPS Multiplier Percentages</Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '70%', pt: 1 }}>
                      {`If Score < ${formData.NPSScoreTargetMin} :`}
                    </Typography>
                    <TextField
                      label="Multiplier %"
                      type="number"
                      value={formData.NPSMultiplierLow}
                      onChange={(e) => validateAndUpdateField('NPSMultiplierLow', e.target.value, 0.1, 2.0)}
                      variant="outlined"
                      size="small"
                      sx={{ width: '30%' }}
                      error={!!errors.NPSMultiplierLow}
                      helperText={errors.NPSMultiplierLow}
                      disabled={isDemo}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', mb: 1 }}>
          <Typography variant="body2" sx={{ width: '70%', pt: 1 }}>
            {`If Score ≥ ${formData.NPSScoreTargetMin} AND < ${formData.NPSScoreTargetMax} :`}
          </Typography>
          <TextField
            label="Multiplier %"
            type="number"
            value={formData.NPSMultiplierMid}
            onChange={(e) => validateAndUpdateField('NPSMultiplierMid', e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: '30%' }}
            error={!!errors.NPSMultiplierMid}
            helperText={errors.NPSMultiplierMid}
            disabled={isDemo}
          />
        </Box>

                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '70%', pt: 1 }}>
                      {`If Score ≥ ${formData.NPSScoreTargetMax} AND Volume ≥ ${formData.NPSVoltarget}:`}
                    </Typography>
                    <TextField
                      label="Multiplier %"
                      type="number"
                      value={formData.NPSMultiplierHigh}
                      onChange={(e) => validateAndUpdateField('NPSMultiplierHigh', e.target.value )}
                      variant="outlined"
                      size="small"
                      sx={{ width: '30%' }}
                      error={!!errors.NPSMultiplierHigh}
                      helperText={errors.NPSMultiplierHigh}
                      disabled={isDemo}
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>GP Commission Percentages</Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '50%', pt: 1 }}>
                      Tier 1 (≥ ${tierThresholds.tier1}):
                    </Typography>
                    <TextField
                      label="Tier 1 %"
                      type="number"
                      value={formData.GPCommissionPercentage}
                      onChange={(e) => validateAndUpdateField('GPCommissionPercentage', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ width: '50%' }}
                      error={!!errors.GPCommissionPercentage}
                      helperText={errors.GPCommissionPercentage}
                      disabled={isDemo}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '50%', pt: 1 }}>
                      Tier 2 (≥ ${tierThresholds.tier2}):
                    </Typography>
                    <TextField
                      label="Tier 2 %"
                      type="number"
                      value={formData.GPTier2Percentage}
                      onChange={(e) => validateAndUpdateField('GPTier2Percentage', e.target.value, 0, 20)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ width: '50%' }}
                      error={!!errors.GPTier2Percentage}
                      helperText={errors.GPTier2Percentage}
                      disabled={isDemo}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: '50%', pt: 1 }}>
                      Tier 3 (≥ ${tierThresholds.tier3}):
                    </Typography>
                    <TextField
                      label="Tier 3 %"
                      type="number"
                      value={formData.GPTier3Percentage}
                      onChange={(e) => validateAndUpdateField('GPTier3Percentage', e.target.value, 0, 20)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ width: '50%' }}
                      error={!!errors.GPTier3Percentage}
                      helperText={errors.GPTier3Percentage}
                      disabled={isDemo}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box mt={6} display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary" disabled={!isFormValid() || isDemo}>
                {isDemo ? 'Demo User - View Only' : 'Submit'}
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </>
  );
};

export default TargetKPI;