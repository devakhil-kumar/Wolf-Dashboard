// import React, { useState } from 'react';
// import { AppBar, Toolbar, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '../features/authSlice';
// import logo from '../asset/wolf.png';

// function Navbar() {
//   const dispatch = useDispatch();
//   const [open, setOpen] = useState(false);
//   const { isCreateUserAllowed } = useSelector((state) => state.auth);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setOpen(false); // Close the dialog after logout
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <AppBar position="static" sx={{ backgroundColor: '#54595f',
//      }}> 
//         <Toolbar sx={{ justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex' }}>
//             <Button component={Link} to="/dashboard" color="inherit" sx={{
//           backgroundColor: '#54595f', // Change to any color you like
//           color: 'white',           // Text color
//           '&:hover': {
//             backgroundColor: 'black', // Hover color
//           },
        
//         }}>DASHBOARD</Button>
//             <Button component={Link} to="/settarget" color="inherit" disabled={!isCreateUserAllowed}sx={{
//           backgroundColor: '#54595f', // Change to any color you like
//           color: 'white',           // Text color
//           '&:hover': {
//             backgroundColor: 'black', // Hover color
//           },
        
//         }}>SETTARGET</Button>
//             <Button component={Link} to="/setkpi" color="inherit" disabled={!isCreateUserAllowed}sx={{
//           backgroundColor: '#54595f', // Change to any color you like
//           color: 'white',           // Text color
//           '&:hover': {
//             backgroundColor: 'black', // Hover color
//           },
        
//         }}>SET KPI %</Button>
//             <Button component={Link} to="/signup" color="inherit" disabled={!isCreateUserAllowed}sx={{
//           backgroundColor: '#54595f', // Change to any color you like
//           color: 'white',           // Text color
//           '&:hover': {
//             backgroundColor: 'black', // Hover color
//           },
        
//         }}>CREATE USER</Button>
//           </Box>

//           {/* Add logo here */}
//           <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
//             <img src={logo} alt="Logo" style={{ height: '90px' }} />
//           </Box>


//           <Button color="inherit" onClick={handleClickOpen}sx={{
//           backgroundColor: '#54595f', // Change to any color you like
//           color: 'white',           // Text color
//           '&:hover': {
//             backgroundColor: 'black', // Hover color
//           },
        
//         }}>LOGOUT</Button>
//         </Toolbar>
//       </AppBar>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//       >
//         <DialogTitle>Confirm Logout</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to logout?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             No
//           </Button>
//           <Button onClick={handleLogout} color="primary" autoFocus>
//             Yes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

// export default Navbar;



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '../features/authSlice';
// import logo from '../asset/alphametricw.png';

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const { isCreateUserAllowed } = useSelector((state) => state.auth);

//   // Brand colors from the provided palette
//   const colors = {
//     black: '#000000',
//     burgundy: '#4c0a25',
//     orange: '#f2552c',
//     darkTeal: '#01363c',
//     brightTeal: '#14f0c8'
//   };

//   const menuItems = [
//     { name: 'DASHBOARD', path: '/dashboard', enabled: true },
//     { name: 'SET TARGET', path: '/settarget', enabled: isCreateUserAllowed },
//     { name: 'SET KPI%', path: '/setkpi', enabled: isCreateUserAllowed },
//     { name: 'CREATE USER', path: '/signup', enabled: isCreateUserAllowed }
//   ];

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setShowLogoutDialog(false);
//   };

//   const LogoutDialog = () => (
//     showLogoutDialog && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//           <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
//           <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
//           <div className="flex gap-3 justify-end">
//             <button
//               onClick={() => setShowLogoutDialog(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               No
//             </button>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//             >
//               Yes
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );

//   return (
//     <>
//       <nav 
//         className="w-full px-4 py-3 shadow-lg"
//         style={{ backgroundColor: colors.black }}
//       >
//         <div className="max-w-9xl mx-auto flex items-center justify-between">
//           {/* Desktop Menu Items - Left Side */}
//           <div className="hidden md:flex items-center space-x-1">
//             {menuItems.map((item, index) => (
//               <React.Fragment key={item.name}>
//                 {item.enabled ? (
//                   <Link
//                     to={item.path}
//                     className={`px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-opacity-80 cursor-pointer hover:text-opacity-90`}
//                     style={{ 
//                       backgroundColor: 'transparent',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.backgroundColor = colors.burgundy;
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.backgroundColor = 'transparent';
//                     }}
//                   >
//                     {item.name}
//                   </Link>
//                 ) : (
//                   <span
//                     className="px-4 py-2 text-white font-medium opacity-50 cursor-not-allowed"
//                   >
//                     {item.name}
//                   </span>
//                 )}
//                 {index < menuItems.length - 1 && (
//                   <span className="text-gray-400 text-sm">|</span>
//                 )}
//               </React.Fragment>
//             ))}
//           </div>

//           {/* Mobile Menu Button - Left Side on Mobile */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-colors relative w-8 h-8 flex flex-col justify-center items-center"
//             >
//               {isMobileMenuOpen ? (
//                 <div className="relative w-6 h-6 flex items-center justify-center">
//                   <span className="text-white text-xl leading-none">×</span>
//                 </div>
//               ) : (
//                 <div className="flex flex-col space-y-1">
//                   <div className="w-5 h-0.5 bg-white"></div>
//                   <div className="w-5 h-0.5 bg-white"></div>
//                   <div className="w-5 h-0.5 bg-white"></div>
//                 </div>
//               )}
//             </button>
//           </div>

//           {/* Logo - Center */}
//           <div className="absolute left-1/2 transform -translate-x-1/2">
//             <img src={logo} alt="Alpha Metric Logo" className="h-12 md:h-16" />
//           </div>

//           {/* Desktop Logout Button - Right Side */}
//           <div className="hidden md:flex items-center ml-auto">
//             <button
//               onClick={() => setShowLogoutDialog(true)}
//               className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-all duration-200"
//             >
//               <span className="text-lg">⎋</span>
//               <span>LOGOUT</span>
//             </button>
//           </div>

//           {/* Mobile Logout Button - Right Side on Mobile */}
//           <div className="md:hidden flex items-center ml-auto">
//             <button
//               onClick={() => setShowLogoutDialog(true)}
//               className="flex items-center space-x-2 px-2 py-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-all duration-200"
//             >
//               <span className="text-lg">⎋</span>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu Dropdown */}
//         {isMobileMenuOpen && (
//           <div 
//             className="md:hidden mt-3 py-2 border-t border-gray-700"
//           >
//             <div className="flex flex-col space-y-2">
//               {menuItems.map((item) => (
//                 item.enabled ? (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     className="text-left px-4 py-3 text-white font-medium transition-all duration-200 hover:bg-opacity-20 hover:bg-white cursor-pointer"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                 ) : (
//                   <span
//                     key={item.name}
//                     className="text-left px-4 py-3 text-white font-medium opacity-50 cursor-not-allowed"
//                   >
//                     {item.name}
//                   </span>
//                 )
//               ))}
              
//               {/* Mobile Logout Button */}
//               <button
//                 onClick={() => {
//                   setShowLogoutDialog(true);
//                   setIsMobileMenuOpen(false);
//                 }}
//                 className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-opacity-20 hover:bg-white transition-all duration-200"
//               >
//                 <span className="text-lg">⎋</span>
//                 <span>LOGOUT</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Logout Confirmation Dialog */}
//       <LogoutDialog />
//     </>
//   );
// };

// export default Navbar;










import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/authSlice';
import logo from '../asset/alphametricw.png';
import sidelogo from '../asset/sidealpha.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const { isCreateUserAllowed } = useSelector((state) => state.auth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navbar stays dark, content is light
  const colors = {
    primary: '#000000',          // Pure black navbar
    primaryLight: '#1A1A1A',     // Dark gray for hover states
    secondary: '#FF6B35',        // Orange accent for navbar
    secondaryDark: '#E55A2B',    // Darker orange for active states
    accent: '#FF6B35',           // Orange accent
    background: '#F8F9FA',       // Light background for content
    surface: '#FFFFFF',          // White surface for dialogs
    text: '#FFFFFF',             // White text on navbar
    textMuted: '#CCCCCC',        // Light muted text on navbar
    border: '#333333',           // Dark border for navbar elements
    error: '#FF4444',            // Red for errors
    warning: '#FF8800',          // Orange for warnings
    success: '#00C851'           // Green for success
  };

  const menuItems = [
    { name: 'DASHBOARD', path: '/dashboard', enabled: true },
    { name: 'SET TARGET', path: '/settarget', enabled: isCreateUserAllowed },
    { name: 'SET KPI%', path: '/setkpi', enabled: isCreateUserAllowed },
    { name: 'CREATE USER', path: '/signup', enabled: isCreateUserAllowed }
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    setShowLogoutDialog(false);
  };

  const LogoutDialog = () => (
    showLogoutDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="rounded-lg p-6 max-w-sm mx-4" style={{ backgroundColor: colors.surface, border: `1px solid #E9ECEF` }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2C3E50' }}>Confirm Logout</h3>
          <p className="mb-6" style={{ color: '#7F8C8D' }}>Are you sure you want to logout?</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="px-4 py-2 transition-colors rounded"
              style={{ 
                color: '#7F8C8D',
                backgroundColor: colors.surface,
                border: `1px solid #E9ECEF`
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#2C3E50';
                e.target.style.backgroundColor = '#F1F2F6';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#7F8C8D';
                e.target.style.backgroundColor = colors.surface;
              }}
            >
              No
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white rounded transition-colors"
              style={{ backgroundColor: colors.error }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.error + 'E6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.error}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      <nav 
        className="w-full px-4 md:px-0 py-3 shadow-lg relative md:overflow-hidden items-center"
        style={{ backgroundColor: colors.primary, height: isDesktop ? '70px' : 'auto' }}
      >
        <div className="max-w-9xl mx-auto flex items-center justify-between md:h-full"> 
          {/* Desktop Menu Items - Left Side */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.name}>
                {item.enabled ? (
                  <Link
                    to={item.path}
                    className={`px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-opacity-80 cursor-pointer hover:text-opacity-90`}
                    style={{ 
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.primaryLight;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span
                    className="px-4 py-2 text-white font-medium opacity-50 cursor-not-allowed"
                  >
                    {item.name}
                  </span>
                )}
                {index < menuItems.length - 1 && (
                  <span className="text-gray-400 text-sm">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Button - Left Side on Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-colors relative w-8 h-8 flex flex-col justify-center items-center"
            >
              {isMobileMenuOpen ? (
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span className="text-white text-xl leading-none">×</span>
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                </div>
              )}
            </button>
          </div>

          {/* Logo - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src={logo} alt="Alpha Metric Logo" className="h-12 md:h-16" />
          </div>

          {/* Desktop Right Side - Logout + Wolf */}
          <div className="hidden md:flex items-center ml-auto space-x-4">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-all duration-200"
            >
              <span className="text-lg">⎋</span>
              <span>LOGOUT</span>
            </button>
            
            {/* Wolf Image - Desktop */}
            <div className="relative">
              <div className="w-28 h-28 flex items-center justify-center opacity-80">
                <img 
                  src={sidelogo} 
                  alt="Wolf" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile Logout Button - Right Side on Mobile */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center space-x-2 px-2 py-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-all duration-200"
            >
              <span className="text-lg">⎋</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden mt-3 py-2 border-t border-gray-700"
          >
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                item.enabled ? (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-left px-4 py-3 text-white font-medium transition-all duration-200 hover:bg-opacity-20 hover:bg-white cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span
                    key={item.name}
                    className="text-left px-4 py-3 text-white font-medium opacity-50 cursor-not-allowed"
                  >
                    {item.name}
                  </span>
                )
              ))}
              
              {/* Mobile Logout Button */}
              <button
                onClick={() => {
                  setShowLogoutDialog(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-opacity-20 hover:bg-white transition-all duration-200"
              >
                <span className="text-lg">⎋</span>
                <span>LOGOUT</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog />
    </>
  );
};

export default Navbar;







// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser } from '../features/authSlice';
// import logo from '../asset/alphametricw.png';
// import sidelogo from '../asset/sidealpha.png';

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const { isCreateUserAllowed } = useSelector((state) => state.auth);

//   // Brand colors from the provided palette
//   const colors = {
//     black: '#000000',
//     burgundy: '#4c0a25',
//     orange: '#f2552c',
//     darkTeal: '#01363c',
//     brightTeal: '#14f0c8'
//   };

//   const menuItems = [
//     { name: 'DASHBOARD', path: '/dashboard', enabled: true },
//     { name: 'SET TARGET', path: '/settarget', enabled: isCreateUserAllowed },
//     { name: 'SET KPI%', path: '/setkpi', enabled: isCreateUserAllowed },
//     { name: 'CREATE USER', path: '/signup', enabled: isCreateUserAllowed }
//   ];

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setShowLogoutDialog(false);
//   };

//   const LogoutDialog = () => (
//     showLogoutDialog && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
//           <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
//           <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
//           <div className="flex gap-3 justify-end">
//             <button
//               onClick={() => setShowLogoutDialog(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               No
//             </button>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//             >
//               Yes
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );

//   return (
//     <>
//       <nav 
//         className="w-full px-4 md:px-0 py-3 shadow-lg relative md:overflow-hidden  items-center"
//          style={{ backgroundColor: colors.black, height: window.innerWidth >= 768 ? '70px' : 'auto' }}
//       >
//         <div className="max-w-9xl mx-auto flex items-center justify-between md:h-full "> 
//           {/* Desktop Menu Items - Left Side */}
//           <div className="hidden md:flex items-center space-x-1">
//             {menuItems.map((item, index) => (
//               <React.Fragment key={item.name}>
//                 {item.enabled ? (
//                   <Link
//                     to={item.path}
//                     className={`px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-opacity-80 cursor-pointer hover:text-opacity-90`}
//                     style={{ 
//                       backgroundColor: 'transparent',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.backgroundColor = colors.burgundy;
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.backgroundColor = 'transparent';
//                     }}
//                   >
//                     {item.name}
//                   </Link>
//                 ) : (
//                   <span
//                     className="px-4 py-2 text-white font-medium opacity-50 cursor-not-allowed"
//                   >
//                     {item.name}
//                   </span>
//                 )}
//                 {index < menuItems.length - 1 && (
//                   <span className="text-gray-400 text-sm">|</span>
//                 )}
//               </React.Fragment>
//             ))}
//           </div>

//           {/* Mobile Menu Button - Left Side on Mobile */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-colors relative w-8 h-8 flex flex-col justify-center items-center"
//             >
//               {isMobileMenuOpen ? (
//                 <div className="relative w-6 h-6 flex items-center justify-center">
//                   <span className="text-white text-xl leading-none">×</span>
//                 </div>
//               ) : (
//                 <div className="flex flex-col space-y-1">
//                   <div className="w-5 h-0.5 bg-white"></div>
//                   <div className="w-5 h-0.5 bg-white"></div>
//                   <div className="w-5 h-0.5 bg-white"></div>
//                 </div>
//               )}
//             </button>
//           </div>

//           {/* Logo - Center */}
//           <div className="absolute left-1/2 transform -translate-x-1/2">
//             <img src={logo} alt="Alpha Metric Logo" className="h-12 md:h-16" />
//           </div>

//           {/* Desktop Right Side - Logout + Wolf */}
//           <div className="hidden md:flex items-center ml-auto space-x-4">
//             <button
//               onClick={() => setShowLogoutDialog(true)}
//               className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-all duration-200"
//             >
//               <span className="text-lg">⎋</span>
//               <span>LOGOUT</span>
//             </button>
            
//             {/* Wolf Image - Desktop */}
//             <div className="relative">
//               <div className="w-28 h-28 flex items-center justify-center opacity-80">
//                 <img 
//                   src={sidelogo} 
//                   alt="Wolf" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Mobile Logout Button - Right Side on Mobile */}
//           <div className="md:hidden flex items-center ml-auto">
//             <button
//               onClick={() => setShowLogoutDialog(true)}
//               className="flex items-center space-x-2 px-2 py-2 text-white hover:bg-opacity-20 hover:bg-white rounded transition-all duration-200"
//             >
//               <span className="text-lg">⎋</span>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu Dropdown */}
//         {isMobileMenuOpen && (
//           <div 
//             className="md:hidden mt-3 py-2 border-t border-gray-700"
//           >
//             <div className="flex flex-col space-y-2">
//               {menuItems.map((item) => (
//                 item.enabled ? (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     className="text-left px-4 py-3 text-white font-medium transition-all duration-200 hover:bg-opacity-20 hover:bg-white cursor-pointer"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                 ) : (
//                   <span
//                     key={item.name}
//                     className="text-left px-4 py-3 text-white font-medium opacity-50 cursor-not-allowed"
//                   >
//                     {item.name}
//                   </span>
//                 )
//               ))}
              
//               {/* Mobile Logout Button */}
//               <button
//                 onClick={() => {
//                   setShowLogoutDialog(true);
//                   setIsMobileMenuOpen(false);
//                 }}
//                 className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-opacity-20 hover:bg-white transition-all duration-200"
//               >
//                 <span className="text-lg">⎋</span>
//                 <span>LOGOUT</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Logout Confirmation Dialog */}
//       <LogoutDialog />
//     </>
//   );
// };

// export default Navbar;