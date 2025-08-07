

import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

const CircularIndicator = ({ value, displayValue, target, isDpcColumn, isGPColumn, tierThresholds, kpiTarget }) => {
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
      color = '#1b5e20'; // Dark green
      backgroundColor = 'rgba(27, 94, 32, 0.2)';
    } else if (isTier2) {
      // Tier 2
      color = '#2e7d32'; // Medium green
      backgroundColor = 'rgba(46, 125, 50, 0.2)';
    } else if (isTier1) {
      // Tier 1
      color = '#4caf50'; // Light green
      backgroundColor = 'rgba(76, 175, 80, 0.2)';
    } else {
      // Below all tiers
      color = 'red';
      backgroundColor = 'rgba(255, 0, 0, 0.2)';
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
              backgroundColor: '#4caf50', 
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
              backgroundColor: '#2e7d32', 
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
              backgroundColor: '#1b5e20', 
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
  } else if (isDpcColumn) {
    // Handle DPC column (percentage values)
    color = numericValue < numericTarget ? 'red' : 'green';
    backgroundColor = numericValue < numericTarget ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 128, 0, 0.2)';
    tooltipContent = `Target: ${target}%`;
  } else {
    // Handle all other columns
    color = numericValue < numericTarget ? 'red' : 'green';
    backgroundColor = numericValue < numericTarget ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 128, 0, 0.2)';
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