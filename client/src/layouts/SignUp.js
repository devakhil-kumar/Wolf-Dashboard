// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Card from '@mui/material/Card';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import { styled } from '@mui/material/styles';
// import Navbar from '../components/Navbar';
// import { useDispatch, useSelector } from 'react-redux';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';

// import { createAdminThunk, getAllAdminsThunk, deleteAdminThunk } from '../features/adminSlice'; // Ensure the correct import path

// const CoverLayout = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'center',
//   // alignItems: 'center',
//   minHeight: '80vh',
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
//   padding: theme.spacing(3),
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(3),
//   maxWidth: 500,
//   width: '100%',
//   textAlign: 'center',
//   backdropFilter: 'blur(5px)',
//   backgroundColor: 'rgba(255, 255, 255, 0.8)',
// }));

// const StyledForm = styled(Box)(({ theme }) => ({
//   width: '100%',
//   '& > *': {
//     marginBottom: theme.spacing(3),
//   },
// }));

// const StyledTable = styled(Box)(({ theme }) => ({
//   width: '100%',
//   overflowX: 'auto',
//   '& table': {
//     width: '100%',
//     borderCollapse: 'collapse',
//     '& th, td': {
//       borderBottom: '1px solid #ddd',
//       padding: theme.spacing(1),
//     },
//   },
// }));

// const SignUp = () => {
//   const dispatch = useDispatch();
//   const { isCreateUserAllowed } = useSelector((state) => state.auth);
//   const { admins, loading, error } = useSelector((state) => state.admin);
//   console.log(admins)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'staff'  // Default role
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [open, setOpen] = useState(false);
 
//   useEffect(() => {
//     dispatch(getAllAdminsThunk());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name) errors.name = 'Name is required';
//     if (!formData.email) errors.email = 'Email is required';
//     if (!formData.password) errors.password = 'Password is required';
//     if (!formData.role) errors.role = 'Role is required';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         await dispatch(createAdminThunk(formData)).unwrap();
//         setOpen(true);
//         setFormData({ name: '', email: '', password: '' }); // Clear form on success
//         dispatch(getAllAdminsThunk()); // Refresh the user list
//       } catch (error) {
//         console.error('Failed to create admin:', error);
//       }
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDelete = async (userId) => {
//     await dispatch(deleteAdminThunk(userId));
//     dispatch(getAllAdminsThunk());
//   };

//   return (
//     <>
//       <Navbar />
//       <CoverLayout>
//         <StyledCard elevation={3}>
//           <Box display="flex" flexDirection="column" alignItems="center">
//             <Typography variant="h5" fontWeight="medium" gutterBottom>
//               CREATE USER
//             </Typography>
//             <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//               <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
//                 User created successfully!
//               </Alert>
//             </Snackbar>
//             <StyledForm component="form" role="form" onSubmit={handleSubmit}>
//               <TextField
//                 name="name"
//                 label="Name"
//                 fullWidth
//                 variant="outlined"
//                 value={formData.name}
//                 onChange={handleChange}
//                 error={!!formErrors.name}
//                 helperText={formErrors.name}
//                 sx={{ marginBottom: 2 }}
//               />
//               <TextField
//                 name="email"
//                 type="email"
//                 label="Email"
//                 fullWidth
//                 variant="outlined"
//                 value={formData.email}
//                 onChange={handleChange}
//                 error={!!formErrors.email}
//                 helperText={formErrors.email}
//                 sx={{ marginBottom: 2 }}
//               />
//               <TextField
//                 name="password"
//                 type="password"
//                 label="Password"
//                 fullWidth
//                 variant="outlined"
//                 value={formData.password}
//                 onChange={handleChange}
//                 error={!!formErrors.password}
//                 helperText={formErrors.password}
//                 sx={{ marginBottom: 2 }}
//               />
//               <FormControl fullWidth sx={{ marginBottom: 2 }}>
//   <InputLabel id="role-label">Role</InputLabel>
//   <Select
//     labelId="role-label"
//     name="role"
//     value={formData.role}
//     label="Role"
//     onChange={handleChange}
//     error={!!formErrors.role}
//   >
//   <MenuItem value="staff">Staff</MenuItem>
//     <MenuItem value="manager">Manager</MenuItem>
   
//   </Select>
// </FormControl>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 type="submit"
               
//                 disabled={loading}
//               >
//                 {loading ? 'Signing up...' : 'Sign Up'}
//               </Button>
//               {error && (
//                 <Typography variant="body2" color="error" align="center" gutterBottom>
//                   {error.message}
//                 </Typography>
//               )}
//             </StyledForm>
//           </Box>
//         </StyledCard>
//         <Box width="50%" bgcolor="grey.300" height="100%" />
//         <StyledTable>
//           <Typography variant="h6" gutterBottom>
//             Users List
//           </Typography>
//           {admins?.length === 0 ? (
//             <Typography>No users found.</Typography>
//           ) : (
//             <table tyle={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>
//                   <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>#</th>
//                   <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Name</th>
//                   <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Email</th>
//                    <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Role</th>
//                   <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Created Date</th>
//                   <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {admins?.map((user, index) => (
//                   <tr key={user._id}>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}> {user.name}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{user.email}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{user?.role}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
//                     <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }} >
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => handleDelete(user._id)}
//                         // disabled={user.email === 'gauravisonline@gmail.com'}
//                         disabled={['warragul@wolfstores.com.au', 'torquay@wolfstores.com.au', 'gauravisonline@gmail.com', 'traralgon@wolfstores.com.au','shae@wolfstores.com.au'].includes(user.email)}
//                       >
//                         Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </StyledTable>
//       </CoverLayout>
//     </>
//   );
// };

// export default SignUp;





// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Card,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Grid,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText
// } from '@mui/material';
// import {
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Person as PersonIcon,
//   AdminPanelSettings as AdminIcon,
//   Warning as WarningIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import Navbar from '../components/Navbar';
// import { useDispatch, useSelector } from 'react-redux';
// import { createAdminThunk, getAllAdminsThunk, deleteAdminThunk } from '../features/adminSlice';

// const MainContainer = styled(Container)(({ theme }) => ({
//   paddingTop: theme.spacing(3),
//   paddingBottom: theme.spacing(3),
//   minHeight: '90vh',
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(3),
//   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//   color: 'white',
//   marginBottom: theme.spacing(3),
// }));

// const FormCard = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   boxShadow: theme.shadows[4],
// }));

// const TableCard = styled(Paper)(({ theme }) => ({
//   marginTop: theme.spacing(2),
//   overflow: 'hidden',
//   boxShadow: theme.shadows[3],
// }));

// const RoleChip = styled(Chip)(({ role, theme }) => ({
//   backgroundColor: role === 'manager' ? theme.palette.primary.main : theme.palette.secondary.main,
//   color: 'white',
//   fontWeight: 'bold',
// }));

// const ActionButton = styled(IconButton)(({ theme }) => ({
//   '&:hover': {
//     backgroundColor: theme.palette.error.light,
//     color: 'white',
//   },
// }));

// const SignUp = () => {
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   // Get current user info from auth state
//   const { user, isCreateUserAllowed } = useSelector((state) => state.auth);
//   const { admins, loading, error } = useSelector((state) => state.admin);
  
//   // Check if current user is manager
//   const isManager = admins?.role === 'manager';
//   console.log(admins)
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'staff'
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [open, setOpen] = useState(false);
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });
  
//   useEffect(() => {
//     dispatch(getAllAdminsThunk());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = 'Name is required';
//     if (!formData.email.trim()) errors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
//     if (!formData.password) errors.password = 'Password is required';
//     else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
//     if (!formData.role) errors.role = 'Role is required';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isManager) return;
    
//     if (validateForm()) {
//       try {
//         await dispatch(createAdminThunk(formData)).unwrap();
//         setOpen(true);
//         setFormData({ name: '', email: '', password: '', role: 'staff' });
//         dispatch(getAllAdminsThunk());
//       } catch (error) {
//         console.error('Failed to create admin:', error);
//       }
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDeleteClick = (userId, userName) => {
//     if (!isManager) return;
//     setDeleteDialog({ open: true, userId, userName });
//   };

//   const handleDeleteConfirm = async () => {
//     if (deleteDialog.userId) {
//       await dispatch(deleteAdminThunk(deleteDialog.userId));
//       dispatch(getAllAdminsThunk());
//     }
//     setDeleteDialog({ open: false, userId: null, userName: '' });
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialog({ open: false, userId: null, userName: '' });
//   };

//   const protectedEmails = [
//     'warragul@wolfstores.com.au',
//     'torquay@wolfstores.com.au',
//     'gauravisonline@gmail.com',
//     'traralgon@wolfstores.com.au',
//     'shae@wolfstores.com.au'
//   ];

//   const canDelete = (userEmail) => {
//     return isManager && !protectedEmails.includes(userEmail);
//   };

//   return (
//     <>
//       <Navbar />
//       <MainContainer maxWidth="xl">
//         {/* Header Section */}
//         <StyledCard>
//           <Box display="flex" alignItems="center" gap={2}>
//             <AdminIcon fontSize="large" />
//             <Box>
//               <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
//                 User Management
//               </Typography>
//               <Typography variant="body1" sx={{ opacity: 0.9 }}>
//                 {isManager ? 'Manage system users and their roles' : 'View system users'}
//               </Typography>
//             </Box>
//           </Box>
//         </StyledCard>

//         <Grid container spacing={3}>
//           {/* Create User Form */}
//           {isManager ? (
//             <Grid item xs={12} md={5}>
//               <FormCard>
//                 <Box display="flex" alignItems="center" gap={1} mb={3}>
//                   <AddIcon color="primary" />
//                   <Typography variant="h6" fontWeight="medium">
//                     Create New User
//                   </Typography>
//                 </Box>
                
//                 <Box component="form" onSubmit={handleSubmit}>
//                   <TextField
//                     name="name"
//                     label="Full Name"
//                     fullWidth
//                     variant="outlined"
//                     value={formData.name}
//                     onChange={handleChange}
//                     error={!!formErrors.name}
//                     helperText={formErrors.name}
//                     sx={{ mb: 2 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
                  
//                   <TextField
//                     name="email"
//                     type="email"
//                     label="Email Address"
//                     fullWidth
//                     variant="outlined"
//                     value={formData.email}
//                     onChange={handleChange}
//                     error={!!formErrors.email}
//                     helperText={formErrors.email}
//                     sx={{ mb: 2 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
                  
//                   <TextField
//                     name="password"
//                     type="password"
//                     label="Password"
//                     fullWidth
//                     variant="outlined"
//                     value={formData.password}
//                     onChange={handleChange}
//                     error={!!formErrors.password}
//                     helperText={formErrors.password}
//                     sx={{ mb: 2 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
                  
//                   <FormControl fullWidth sx={{ mb: 3 }}>
//                     <InputLabel id="role-label">Role</InputLabel>
//                     <Select
//                       labelId="role-label"
//                       name="role"
//                       value={formData.role}
//                       label="Role"
//                       onChange={handleChange}
//                       error={!!formErrors.role}
//                       size={isMobile ? "small" : "medium"}
//                     >
//                       <MenuItem value="staff">
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <PersonIcon fontSize="small" />
//                           Staff
//                         </Box>
//                       </MenuItem>
//                       <MenuItem value="manager">
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <AdminIcon fontSize="small" />
//                           Manager
//                         </Box>
//                       </MenuItem>
//                     </Select>
//                   </FormControl>

//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     type="submit"
//                     disabled={loading}
//                     size={isMobile ? "medium" : "large"}
//                     startIcon={<AddIcon />}
//                   >
//                     {loading ? 'Creating User...' : 'Create User'}
//                   </Button>
                  
//                   {error && (
//                     <Alert severity="error" sx={{ mt: 2 }}>
//                       {error.message}
//                     </Alert>
//                   )}
//                 </Box>
//               </FormCard>
//             </Grid>
//           ) : (
//             <Grid item xs={12}>
//               <Alert severity="info" icon={<WarningIcon />}>
//                 <Typography variant="body1">
//                   You need manager privileges to create or modify users.
//                 </Typography>
//               </Alert>
//             </Grid>
//           )}

//           {/* Users List */}
//           <Grid item xs={12} md={isManager ? 7 : 12}>
//             <Card sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
//                 <PersonIcon />
//                 Users List ({admins?.length || 0})
//               </Typography>
              
//               {admins?.length === 0 ? (
//                 <Box textAlign="center" py={4}>
//                   <Typography variant="body1" color="textSecondary">
//                     No users found.
//                   </Typography>
//                 </Box>
//               ) : (
//                 <TableCard>
//                   <TableContainer sx={{ maxHeight: isMobile ? 400 : 600 }}>
//                     <Table stickyHeader>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell align="center">#</TableCell>
//                           <TableCell>Name</TableCell>
//                           {!isMobile && <TableCell>Email</TableCell>}
//                           <TableCell align="center">Role</TableCell>
//                           {!isMobile && <TableCell align="center">Created</TableCell>}
//                           {isManager && <TableCell align="center">Actions</TableCell>}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {admins?.map((user, index) => (
//                           <TableRow 
//                             key={user._id} 
//                             hover
//                             sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
//                           >
//                             <TableCell align="center">
//                               <Typography variant="body2" fontWeight="medium">
//                                 {index + 1}
//                               </Typography>
//                             </TableCell>
//                             <TableCell>
//                               <Box>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {user.name}
//                                 </Typography>
//                                 {isMobile && (
//                                   <Typography variant="caption" color="textSecondary">
//                                     {user.email}
//                                   </Typography>
//                                 )}
//                               </Box>
//                             </TableCell>
//                             {!isMobile && (
//                               <TableCell>
//                                 <Typography variant="body2">
//                                   {user.email}
//                                 </Typography>
//                               </TableCell>
//                             )}
//                             <TableCell align="center">
//                               <RoleChip 
//                                 role={user.role}
//                                 label={user.role}
//                                 size="small"
//                                 icon={user.role === 'manager' ? <AdminIcon /> : <PersonIcon />}
//                               />
//                             </TableCell>
//                             {!isMobile && (
//                               <TableCell align="center">
//                                 <Typography variant="body2">
//                                   {new Date(user.createdAt).toLocaleDateString()}
//                                 </Typography>
//                               </TableCell>
//                             )}
//                             {isManager && (
//                               <TableCell align="center">
//                                 <Tooltip title={canDelete(user.email) ? "Delete User" : "Cannot delete protected user"}>
//                                   <span>
//                                     <ActionButton
//                                       onClick={() => handleDeleteClick(user._id, user.name)}
//                                       disabled={!canDelete(user.email)}
//                                       size="small"
//                                     >
//                                       <DeleteIcon fontSize="small" />
//                                     </ActionButton>
//                                   </span>
//                                 </Tooltip>
//                               </TableCell>
//                             )}
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </TableCard>
//               )}
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Success Snackbar */}
//         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//           <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
//             User created successfully!
//           </Alert>
//         </Snackbar>

//         {/* Delete Confirmation Dialog */}
//         <Dialog
//           open={deleteDialog.open}
//           onClose={handleDeleteCancel}
//           aria-labelledby="delete-dialog-title"
//         >
//           <DialogTitle id="delete-dialog-title">
//             Confirm Delete User
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete user "{deleteDialog.userName}"? 
//               This action cannot be undone.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDeleteCancel} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleDeleteConfirm} color="error" variant="contained">
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </MainContainer>
//     </>
//   );
// };

// export default SignUp;












// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Card,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Snackbar,
//   Alert,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Grid,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText
// } from '@mui/material';
// // Using text/emoji alternatives instead of @mui/icons-material
// import { styled } from '@mui/material/styles';
// import Navbar from '../components/Navbar';
// import { useDispatch, useSelector } from 'react-redux';
// import { createAdminThunk, getAllAdminsThunk, deleteAdminThunk } from '../features/adminSlice';
// import { selectUser, selectIsManager, selectIsCreateUserAllowed } from '../features/authSlice';

// const MainContainer = styled(Container)(({ theme }) => ({
//   paddingTop: theme.spacing(3),
//   paddingBottom: theme.spacing(3),
//   minHeight: '90vh',
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(3),
//   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//   color: 'white',
//   marginBottom: theme.spacing(3),
// }));

// const FormCard = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   boxShadow: theme.shadows[4],
// }));

// const TableCard = styled(Paper)(({ theme }) => ({
//   marginTop: theme.spacing(2),
//   overflow: 'hidden',
//   boxShadow: theme.shadows[3],
// }));

// const RoleChip = styled(Chip)(({ role, theme }) => ({
//   backgroundColor: role === 'manager' ? theme.palette.primary.main : theme.palette.secondary.main,
//   color: 'white',
//   fontWeight: 'bold',
// }));

// const ActionButton = styled(IconButton)(({ theme }) => ({
//   '&:hover': {
//     backgroundColor: theme.palette.error.light,
//     color: 'white',
//   },
// }));

// const SignUp = () => {
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   // Get current user info from auth state using selectors
//   const user = useSelector(selectUser);
//   const isManager = useSelector(selectIsManager);
//   const isCreateUserAllowed = useSelector(selectIsCreateUserAllowed);
//   const { admins, loading, error } = useSelector((state) => state.admin);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'staff'
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [open, setOpen] = useState(false);
//   const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });
  
//   useEffect(() => {
//     dispatch(getAllAdminsThunk());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = 'Name is required';
//     if (!formData.email.trim()) errors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
//     if (!formData.password) errors.password = 'Password is required';
//     else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
//     if (!formData.role) errors.role = 'Role is required';

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isManager) return;
    
//     if (validateForm()) {
//       try {
//         await dispatch(createAdminThunk(formData)).unwrap();
//         setOpen(true);
//         setFormData({ name: '', email: '', password: '', role: 'staff' });
//         dispatch(getAllAdminsThunk());
//       } catch (error) {
//         console.error('Failed to create admin:', error);
//       }
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDeleteClick = (userId, userName) => {
//     if (!isManager) return;
//     setDeleteDialog({ open: true, userId, userName });
//   };

//   const handleDeleteConfirm = async () => {
//     if (deleteDialog.userId) {
//       await dispatch(deleteAdminThunk(deleteDialog.userId));
//       dispatch(getAllAdminsThunk());
//     }
//     setDeleteDialog({ open: false, userId: null, userName: '' });
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialog({ open: false, userId: null, userName: '' });
//   };

//   const protectedEmails = [
//     'warragul@wolfstores.com.au',
//     'torquay@wolfstores.com.au',
//     'gauravisonline@gmail.com',
//     'traralgon@wolfstores.com.au',
//     'shae@wolfstores.com.au'
//   ];

//   const canDelete = (userEmail) => {
//     return isManager && !protectedEmails.includes(userEmail);
//   };

//   return (
//     <>
//       <Navbar />
//       <MainContainer maxWidth="xl">
//         {/* Header Section */}
//         <StyledCard>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Box 
//               sx={{ 
//                 fontSize: '2.5rem', 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               👥
//             </Box>
//             <Box>
//               <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
//                 User Management
//               </Typography>
//               <Typography variant="body1" sx={{ opacity: 0.9 }}>
//                 {isManager ? 'Manage system users and their roles' : 'View system users'}
//               </Typography>
//             </Box>
//           </Box>
//         </StyledCard>

//         <Grid container spacing={3}>
//           {/* Create User Form */}
//           {isManager ? (
//             <Grid item xs={12} md={5}>
//               <FormCard>
//                 <Box display="flex" alignItems="center" gap={1} mb={3}>
//                   <Box sx={{ fontSize: '1.5rem' }}>➕</Box>
//                   <Typography variant="h6" fontWeight="medium">
//                     Create New User
//                   </Typography>
//                 </Box>
                
//                 <Box component="form" onSubmit={handleSubmit}>
//                   <TextField
//                     name="name"
//                     label="Full Name"
//                     fullWidth
//                     variant="outlined"
//                     value={formData.name}
//                     onChange={handleChange}
//                     error={!!formErrors.name}
//                     helperText={formErrors.name}
//                     sx={{ mb: 2 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
                  
//                   <TextField
//                     name="email"
//                     type="email"
//                     label="Email Address"
//                     fullWidth
//                     variant="outlined"
//                     value={formData.email}
//                     onChange={handleChange}
//                     error={!!formErrors.email}
//                     helperText={formErrors.email}
//                     sx={{ mb: 2 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
                  
//                   <TextField
//                     name="password"
//                     type="password"
//                     label="Password"
//                     fullWidth
//                     variant="outlined"
//                     value={formData.password}
//                     onChange={handleChange}
//                     error={!!formErrors.password}
//                     helperText={formErrors.password}
//                     sx={{ mb: 2 }}
//                     size={isMobile ? "small" : "medium"}
//                   />
                  
//                   <FormControl fullWidth sx={{ mb: 3 }}>
//                     <InputLabel id="role-label">Role</InputLabel>
//                     <Select
//                       labelId="role-label"
//                       name="role"
//                       value={formData.role}
//                       label="Role"
//                       onChange={handleChange}
//                       error={!!formErrors.role}
//                       size={isMobile ? "small" : "medium"}
//                     >
//                       <MenuItem value="staff">
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <span>👤</span>
//                           Staff
//                         </Box>
//                       </MenuItem>
//                       <MenuItem value="manager">
//                         <Box display="flex" alignItems="center" gap={1}>
//                           <span>👑</span>
//                           Manager
//                         </Box>
//                       </MenuItem>
//                     </Select>
//                   </FormControl>

//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     type="submit"
//                     disabled={loading}
//                     size={isMobile ? "medium" : "large"}
//                   >
//                     {loading ? 'Creating User...' : '➕ Create User'}
//                   </Button>
                  
//                   {error && (
//                     <Alert severity="error" sx={{ mt: 2 }}>
//                       {error.message}
//                     </Alert>
//                   )}
//                 </Box>
//               </FormCard>
//             </Grid>
//           ) : (
//             <Grid item xs={12}>
//               <Alert severity="info">
//                 <Typography variant="body1">
//                   ⚠️ You need manager privileges to create or modify users.
//                 </Typography>
//               </Alert>
//             </Grid>
//           )}

//           {/* Users List */}
//           <Grid item xs={12} md={isManager ? 7 : 12}>
//             <Card sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
//                 <span style={{ fontSize: '1.2rem' }}>👥</span>
//                 Users List ({admins?.length || 0})
//               </Typography>
              
//               {admins?.length === 0 ? (
//                 <Box textAlign="center" py={4}>
//                   <Typography variant="body1" color="textSecondary">
//                     No users found.
//                   </Typography>
//                 </Box>
//               ) : (
//                 <TableCard>
//                   <TableContainer sx={{ maxHeight: isMobile ? 400 : 600 }}>
//                     <Table stickyHeader>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell align="center">#</TableCell>
//                           <TableCell>Name</TableCell>
//                           {!isMobile && <TableCell>Email</TableCell>}
//                           <TableCell align="center">Role</TableCell>
//                           {!isMobile && <TableCell align="center">Created</TableCell>}
//                           {isManager && <TableCell align="center">Actions</TableCell>}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {admins?.map((user, index) => (
//                           <TableRow 
//                             key={user._id} 
//                             hover
//                             sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
//                           >
//                             <TableCell align="center">
//                               <Typography variant="body2" fontWeight="medium">
//                                 {index + 1}
//                               </Typography>
//                             </TableCell>
//                             <TableCell>
//                               <Box>
//                                 <Typography variant="body2" fontWeight="medium">
//                                   {user.name}
//                                 </Typography>
//                                 {isMobile && (
//                                   <Typography variant="caption" color="textSecondary">
//                                     {user.email}
//                                   </Typography>
//                                 )}
//                               </Box>
//                             </TableCell>
//                             {!isMobile && (
//                               <TableCell>
//                                 <Typography variant="body2">
//                                   {user.email}
//                                 </Typography>
//                               </TableCell>
//                             )}
//                             <TableCell align="center">
//                               <RoleChip 
//                                 role={user.role}
//                                 label={`${user.role === 'manager' ? '👑' : '👤'} ${user.role}`}
//                                 size="small"
//                               />
//                             </TableCell>
//                             {!isMobile && (
//                               <TableCell align="center">
//                                 <Typography variant="body2">
//                                   {new Date(user.createdAt).toLocaleDateString()}
//                                 </Typography>
//                               </TableCell>
//                             )}
//                             {isManager && (
//                               <TableCell align="center">
//                                 <Tooltip title={canDelete(user.email) ? "Delete User" : "Cannot delete protected user"}>
//                                   <span>
//                                     <ActionButton
//                                       onClick={() => handleDeleteClick(user._id, user.name)}
//                                       disabled={!canDelete(user.email)}
//                                       size="small"
//                                     >
//                                       <span style={{ fontSize: '1rem' }}>🗑️</span>
//                                     </ActionButton>
//                                   </span>
//                                 </Tooltip>
//                               </TableCell>
//                             )}
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </TableCard>
//               )}
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Success Snackbar */}
//         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//           <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
//             User created successfully!
//           </Alert>
//         </Snackbar>

//         {/* Delete Confirmation Dialog */}
//         <Dialog
//           open={deleteDialog.open}
//           onClose={handleDeleteCancel}
//           aria-labelledby="delete-dialog-title"
//         >
//           <DialogTitle id="delete-dialog-title">
//             Confirm Delete User
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete user "{deleteDialog.userName}"? 
//               This action cannot be undone.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDeleteCancel} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleDeleteConfirm} color="error" variant="contained">
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </MainContainer>
//     </>
//   );
// };

// export default SignUp;











import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
// Using text/emoji alternatives instead of @mui/icons-material
import { styled } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { createAdminThunk, getAllAdminsThunk, deleteAdminThunk } from '../features/adminSlice';
import { selectIsAdmin, selectIsManager, selectIsDemo } from '../features/authSlice';
import { toast } from 'react-toastify';

const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '90vh',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: "#54595f",
  // 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
}));

const FormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[4],
}));

const TableCard = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
}));

const RoleChip = styled(Chip)(({ role, theme }) => ({
  backgroundColor: 
    role === 'admin' ? theme.palette.error.main : 
    role === 'manager' ? theme.palette.primary.main : 
    role === 'demo' ? theme.palette.info.main :
    theme.palette.secondary.main,
  color: 'white',
  fontWeight: 'bold',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.error.light,
    color: 'white',
  },
}));

const SignUp = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get current user info from auth state using selectors
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  const isDemo = useSelector(selectIsDemo);
  const { admins, loading, error } = useSelector((state) => state.admin);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '', userRole: '' });
  
  useEffect(() => {
    dispatch(getAllAdminsThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.role) errors.role = 'Role is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin && !isManager) return;
    if (isDemo) {
      toast.error('Demo users cannot create users.');
      return;
    }
    
    if (validateForm()) {
      try {
        await dispatch(createAdminThunk(formData)).unwrap();
        setOpen(true);
        setFormData({ name: '', email: '', password: '', role: 'staff' });
        dispatch(getAllAdminsThunk());
      } catch (error) {
        console.error('Failed to create admin:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = (userId, userName, userRole) => {
    if (!canDeleteUser(userRole)) return;
    if (isDemo) {
      toast.error('Demo users cannot delete users.');
      return;
    }
    setDeleteDialog({ open: true, userId, userName, userRole });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.userId) {
      dispatch(deleteAdminThunk(deleteDialog.userId));
      dispatch(getAllAdminsThunk());
    }
    setDeleteDialog({ open: false, userId: null, userName: '', userRole: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, userId: null, userName: '', userRole: '' });
  };

  const protectedEmails = [
    'warragul@wolfstores.com.au',
    'torquay@wolfstores.com.au',
    'gauravisonline@gmail.com',
    'traralgon@wolfstores.com.au',
    'shae@wolfstores.com.au'
  ];

  // Check if current user can delete the target user
  const canDeleteUser = (targetUserRole) => {
    if (isAdmin) {
      return true; // Admin can delete any user
    } else if (isManager) {
      return targetUserRole !== 'manager' && targetUserRole !== 'admin'; // Manager can only delete staff
    }
    return false; // Staff can't delete anyone
  };

 

  const canDelete = (userEmail, userRole) => {
    return !protectedEmails.includes(userEmail) && canDeleteUser(userRole);
  };

  // Get available roles for creation based on current user's role
  const getAvailableRoles = () => {
    if (isAdmin) {
      return [
        { value: 'staff', label: 'Staff', icon: '👤' },
        { value: 'manager', label: 'Manager', icon: '👑' },
        { value: 'admin', label: 'Admin', icon: '🔐' },
        { value: 'demo', label: 'Demo', icon: '🔍' }
      ];
    } else if (isManager) {
      return [
        { value: 'staff', label: 'Staff', icon: '👤' },
        { value: 'demo', label: 'Demo', icon: '🔍' }
      ];
    }
    return [];
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '🔐';
      case 'manager': return '👑';
      case 'staff': return '👤';
      case 'demo': return '🔍';
      default: return '👤';
    }
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      <Navbar />
      <MainContainer maxWidth="xl">
        {/* Header Section */}
        <StyledCard>
          <Box display="flex" alignItems="center" gap={2}>
            <Box 
              sx={{ 
                fontSize: '2.5rem', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              👥
            </Box>
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                User Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {isDemo ? 'Demo access - view only' :
                 isAdmin ? 'Full system administration - manage all users and roles' : 
                 isManager ? 'Manage staff users' : 
                 'View system users'}
              </Typography>
            </Box>
          </Box>
        </StyledCard>

        <Grid container spacing={3}>
          {/* Create User Form */}
          {(isAdmin || isManager) && !isDemo ? (
            <Grid item xs={12} md={5}>
              <FormCard>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <Box sx={{ fontSize: '1.5rem' }}>➕</Box>
                  <Typography variant="h6" fontWeight="medium">
                    Create New User
                  </Typography>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    sx={{ mb: 2 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  
                  <TextField
                    name="email"
                    type="email"
                    label="Email Address"
                    fullWidth
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={{ mb: 2 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  
                  <TextField
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    sx={{ mb: 2 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={formData.role}
                      label="Role"
                      onChange={handleChange}
                      error={!!formErrors.role}
                      size={isMobile ? "small" : "medium"}
                    >
                      {getAvailableRoles().map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>{role.icon}</span>
                            {role.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {!isAdmin && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                        As a Manager, you can only create Staff users
                      </Typography>
                    )}
                  </FormControl>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      backgroundColor: '#54595f',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#3e4145',
                      },
                      '&:disabled': {
                        backgroundColor: '#a0a5ab',
                        color: 'white',
                      }
                    }}
                  >
                    {loading ? 'Creating User...' : ' Create User'}
                  </Button>
                  
                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error.message}
                    </Alert>
                  )}
                </Box>
              </FormCard>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body1">
                  {isDemo ? '⚠️ Demo users have view-only access.' : '⚠️ You need Admin or Manager privileges to create users.'}
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Users List */}
          <Grid item xs={12} md={(isAdmin || isManager) && !isDemo ? 7 : 12}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <span style={{ fontSize: '1.2rem' }}>👥</span>
                Users List ({admins?.length || 0})
              </Typography>
              
              {admins?.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="textSecondary">
                    No users found.
                  </Typography>
                </Box>
              ) : (
                <TableCard>
                  <TableContainer sx={{ maxHeight: isMobile ? 400 : 600 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">#</TableCell>
                          <TableCell>Name</TableCell>
                          {!isMobile && <TableCell>Email</TableCell>}
                          <TableCell align="center">Role</TableCell>
                          {!isMobile && <TableCell align="center">Created</TableCell>}
                          {(isAdmin || isManager) && !isDemo && <TableCell align="center">Actions</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {admins?.map((user, index) => (
                          <TableRow 
                            key={user._id} 
                            hover
                            sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                          >
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="medium">
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {user.name}
                                </Typography>
                                {isMobile && (
                                  <Typography variant="caption" color="textSecondary">
                                    {user.email}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            {!isMobile && (
                              <TableCell>
                                <Typography variant="body2">
                                  {user.email}
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell align="center">
                              <RoleChip 
                                role={user.role}
                                label={`${getRoleIcon(user.role)} ${getRoleDisplayName(user.role)}`}
                                size="small"
                              />
                            </TableCell>
                            {!isMobile && (
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                            )}
                            {(isAdmin || isManager) && !isDemo && (
                              <TableCell align="center">
                                <Tooltip title={
                                  canDelete(user.email, user.role) ? "Delete User" : 
                                  protectedEmails.includes(user.email) ? "Cannot delete protected user" :
                                  !canDeleteUser(user.role) ? `You cannot delete ${getRoleDisplayName(user.role)} users` :
                                  "Action not allowed"
                                }>
                                  <span>
                                    <ActionButton
                                      onClick={() => handleDeleteClick(user._id, user.name, user.role)}
                                      disabled={!canDelete(user.email, user.role)}
                                      size="small"
                                    >
                                      <span style={{ fontSize: '1rem' }}>🗑️</span>
                                    </ActionButton>
                                  </span>
                                </Tooltip>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableCard>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            User created successfully!
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete User
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {getRoleDisplayName(deleteDialog.userRole)} "{deleteDialog.userName}"? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MainContainer>
    </>
  );
};

export default SignUp;