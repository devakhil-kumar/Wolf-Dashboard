import React from 'react';
import { Modal, Typography, Button } from '@material-ui/core';

const CommissionModal = ({ open, handleClose, grossProfit, kpiScore, commission, npsMultiplier }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ padding: '20px', backgroundColor: 'white', margin: '10% auto', width: '50%' }}>
        <Typography variant="h5">Commission Calculation Breakdown</Typography>
        
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          <strong>1. Gross Profit Commission:</strong> <br />
          Formula: (GPCommissionPercentage / 100) × Gross Profit <br />
          Example: (7 / 100) × {grossProfit} = {(7 / 100) * grossProfit}
        </Typography>

        <Typography variant="body1" style={{ marginTop: '20px' }}>
          <strong>2. KPI-Adjusted Commission:</strong> <br />
          Formula: (KPI Score / 100) × Gross Profit Commission <br />
          Example: ({kpiScore} / 100) × {(7 / 100) * grossProfit} = {(kpiScore / 100) * (7 / 100) * grossProfit}
        </Typography>

        <Typography variant="body1" style={{ marginTop: '20px' }}>
          <strong>3. NPS Multiplier:</strong> <br />
          Final Commission = KPI-Adjusted Commission × NPS Multiplier <br />
          Example: {(kpiScore / 100) * (7 / 100) * grossProfit} × {npsMultiplier} = {commission}
        </Typography>

        <Button onClick={handleClose} style={{ marginTop: '20px' }} variant="contained" color="primary">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default CommissionModal;
