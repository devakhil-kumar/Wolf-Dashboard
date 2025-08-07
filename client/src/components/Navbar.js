import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/authSlice';
import logo from '../asset/wolf.png';

function Navbar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { isCreateUserAllowed } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpen(false); // Close the dialog after logout
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#54595f',
     }}> 
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Button component={Link} to="/dashboard" color="inherit" sx={{
          backgroundColor: '#54595f', // Change to any color you like
          color: 'white',           // Text color
          '&:hover': {
            backgroundColor: 'black', // Hover color
          },
        
        }}>DASHBOARD</Button>
            <Button component={Link} to="/settarget" color="inherit" disabled={!isCreateUserAllowed}sx={{
          backgroundColor: '#54595f', // Change to any color you like
          color: 'white',           // Text color
          '&:hover': {
            backgroundColor: 'black', // Hover color
          },
        
        }}>SETTARGET</Button>
            <Button component={Link} to="/setkpi" color="inherit" disabled={!isCreateUserAllowed}sx={{
          backgroundColor: '#54595f', // Change to any color you like
          color: 'white',           // Text color
          '&:hover': {
            backgroundColor: 'black', // Hover color
          },
        
        }}>SET KPI %</Button>
            <Button component={Link} to="/signup" color="inherit" disabled={!isCreateUserAllowed}sx={{
          backgroundColor: '#54595f', // Change to any color you like
          color: 'white',           // Text color
          '&:hover': {
            backgroundColor: 'black', // Hover color
          },
        
        }}>CREATE USER</Button>
          </Box>

          {/* Add logo here */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: '90px' }} />
          </Box>


          <Button color="inherit" onClick={handleClickOpen}sx={{
          backgroundColor: '#54595f', // Change to any color you like
          color: 'white',           // Text color
          '&:hover': {
            backgroundColor: 'black', // Hover color
          },
        
        }}>LOGOUT</Button>
        </Toolbar>
      </AppBar>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;
