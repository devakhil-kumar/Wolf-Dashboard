

import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

const CircularIndicator = ({ value, displayValue, target, isDpcColumn, isGPColumn, tierThresholds, kpiTarget, isPPNCombined, ppnCombinedData, isBundleNew, bundleNewData }) => {
  // Light Theme Colors for Content
  const themeColors = {
    primary: '#2C3E50',       // Professional dark blue-gray
    primaryLight: '#34495E',  // Lighter version
    success: '#27AE60',       // Professional green
    successLight: '#2ECC71',  // Light green for tiers
    successDark: '#229954',   // Dark green for high tiers
    warning: '#F39C12',       // Professional orange
    warningLight: '#F8C471',  // Light orange
    error: '#E74C3C',   
     error2: '#9c3a25ff',        // Professional red
    errorLight: '#F1948A',    // Light red
    background: '#F8F9FA',    // Light background
    surface: '#FFFFFF',       // White surface
    text: '#2C3E50',          // Dark text
    textMuted: '#7F8C8D',     // Muted text
    border: '#E9ECEF'         // Light border
  };

  // Parse values to numbers
  const numericValue = parseFloat(value) || 0;
  const numericTarget = parseFloat(target) || 0;
  
  // Format helper function for tooltips
  const formatToK = (val) => {
    if (!val) return "N/A";
    return Math.floor(val/1000) + "k";
  };
  
  // Get commission percentages from kpiTarget or use defaults
  const tier1Percentage = kpiTarget?.GPCommissionPercentage || 4;
  const tier2Percentage = kpiTarget?.GPTier2Percentage || 5.5;
  const tier3Percentage = kpiTarget?.GPTier3Percentage || 7;
  
  // Determine color and background based on conditions
  let color, backgroundColor, tooltipContent;
  
  if (isGPColumn && tierThresholds) {
    // Handle GP total column with tier-based coloring
    const tier1 = parseFloat(tierThresholds.tier1) || 12000;
    const tier2 = parseFloat(tierThresholds.tier2) || 14000;
    const tier3 = parseFloat(tierThresholds.tier3) || 16000;
    
    // Determine which tier the current value falls into
    const isTier1 = numericValue >= tier1 && numericValue < tier2;
    const isTier2 = numericValue >= tier2 && numericValue < tier3;
    const isTier3 = numericValue >= tier3;
    
    if (isTier3) {
      // Tier 3 (highest)
      color = themeColors.successDark;
      backgroundColor = themeColors.successDark + '20';
    } else if (isTier2) {
      // Tier 2
      color = themeColors.success;
      backgroundColor = themeColors.success + '20';
    } else if (isTier1) {
      // Tier 1
      color = themeColors.successLight;
      backgroundColor = themeColors.successLight + '20';
    } else {
      // Below all tiers
      color = themeColors.error;
      backgroundColor = themeColors.errorLight + '20';
    }
    
    // Custom tooltip for GP column showing all tiers with color indicators
    tooltipContent = (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="body2" sx={{ 
          fontWeight: isTier1 ? 'bold' : 'normal',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              backgroundColor: themeColors.successLight, 
              borderRadius: '50%',
              border: isTier1 ? '2px solid black' : 'none'
            }} 
          />
          Tier 1 (≥ {formatToK(tier1)}): {tier1Percentage}%
        </Typography>
        
        <Typography variant="body2" sx={{ 
          fontWeight: isTier2 ? 'bold' : 'normal',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              backgroundColor: themeColors.success, 
              borderRadius: '50%',
              border: isTier2 ? '2px solid black' : 'none'
            }} 
          />
          Tier 2 (≥ {formatToK(tier2)}): {tier2Percentage}%
        </Typography>
        
        <Typography variant="body2" sx={{ 
          fontWeight: isTier3 ? 'bold' : 'normal',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              backgroundColor: themeColors.successDark, 
              borderRadius: '50%',
              border: isTier3 ? '2px solid black' : 'none'
            }} 
          />
          Tier 3 (≥ {formatToK(tier3)}): {tier3Percentage}%
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          Current: {displayValue || value}
        </Typography>
      </Box>
    );
  } else if (isPPNCombined && ppnCombinedData) {
    // Handle combined PPN columns (6 and 7) showing total achievement
    const col6Value = parseFloat(ppnCombinedData.column6Value) || 0;
    const col7Value = parseFloat(ppnCombinedData.column7Value) || 0;
    const combinedTotal = col6Value ;
    
    color = combinedTotal >= numericTarget ? themeColors.success : themeColors.error;
    backgroundColor = combinedTotal >= numericTarget ? themeColors.success + '20' : themeColors.errorLight + '30';
    
    tooltipContent = (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          PPN Target Achievement
        </Typography>
        <Typography variant="body2">
          Consumer: {col6Value-col7Value}
        </Typography>
        <Typography variant="body2">
          Business (SB PPN): {col7Value}
        </Typography>
        <Typography variant="body2" sx={{
          borderTop: '1px solid #ddd',
          pt: 0.5,
          mt: 0.5,
          fontWeight: 'bold'
        }}>
          Total: {combinedTotal}
        </Typography>
        <Typography variant="body2" sx={{
          // color: combinedTotal >= numericTarget ? themeColors.success : themeColors.error2,
          fontWeight: 'bold'
        }}>
          Target: {target} ({combinedTotal >= numericTarget ? '✓ Achieved' : '✗ Not Achieved'})
        </Typography>
      </Box>
    );
  } else if (isBundleNew && bundleNewData) {
    // Handle Bundle New showing split between consumer and business
    const bundleNewTotal = parseFloat(bundleNewData.bundleNewTotal) || 0;
    const sbNbnValue = parseFloat(bundleNewData.sbNbnValue) || 0;
    const consumerValue = bundleNewTotal - sbNbnValue;

    color = bundleNewTotal >= numericTarget ? themeColors.success : themeColors.error;
    backgroundColor = bundleNewTotal >= numericTarget ? themeColors.success + '20' : themeColors.errorLight + '30';

    tooltipContent = (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Bundle New Target Achievement
        </Typography>
        <Typography variant="body2">
          Consumer: {consumerValue}
        </Typography>
        <Typography variant="body2">
          Business (SB NBN): {sbNbnValue}
        </Typography>
        <Typography variant="body2" sx={{
          borderTop: '1px solid #ddd',
          pt: 0.5,
          mt: 0.5,
          fontWeight: 'bold'
        }}>
          Total: {bundleNewTotal}
        </Typography>
        <Typography variant="body2" sx={{
          fontWeight: 'bold'
        }}>
          Target: {target} ({bundleNewTotal >= numericTarget ? '✓ Achieved' : '✗ Not Achieved'})
        </Typography>
      </Box>
    );
  } else if (isDpcColumn) {
    // Handle DPC column (percentage values)
    color = numericValue < numericTarget ? themeColors.error : themeColors.success;
    backgroundColor = numericValue < numericTarget ? themeColors.errorLight + '30' : themeColors.success + '20';
    tooltipContent = `Target: ${target}%`;
  } else {
    // Handle all other columns
    color = numericValue < numericTarget ? themeColors.error : themeColors.success;
    backgroundColor = numericValue < numericTarget ? themeColors.errorLight + '30' : themeColors.success + '20';
    tooltipContent = `Target: ${target}`;
  }
  
  return (
    <Tooltip title={tooltipContent} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor,
          color: color,
          fontWeight: 'bold',
          padding: '8px',
          minWidth: 80,
        }}
      >
        {displayValue || value}
      </Box>
    </Tooltip>
  );
};

export default CircularIndicator;