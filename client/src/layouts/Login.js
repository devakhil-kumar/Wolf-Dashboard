// src/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../features/authSlice';
import bgImage from '../asset/alphametriclogin.png';

// Image URL
// const bgImage = "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg";

// Styled components
const FullScreenBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
  backdropFilter: 'blur(5px)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { token, status, error: loginError } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   // Set static email and password if not already set
  //   if (!localStorage.getItem("email")) {
  //     localStorage.setItem("email", "example@example.com");
  //   }
  //   if (!localStorage.getItem("password")) {
  //     localStorage.setItem("password", "password123");
  //   }
  // }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async () => {
    try {
      const resultAction = await dispatch(loginUser({  email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };
  // const handleLogin = () => {
  //   const storedEmail = localStorage.getItem("email");
  //   const storedPassword = localStorage.getItem("password");

  //   if (email === storedEmail && password === storedPassword) {
  //     navigate("/dashboard");
  //   } else {
  //     setError("Invalid email or password. Please try again.");
  //   }
  // };

  return (
    <FullScreenBox>
      <StyledPaper elevation={3}>
        <Box mb={2}>
          <Typography variant="h4" component="h1">
            Sign In
          </Typography>
          <Typography variant="subtitle1">
            Enter your email and password to sign in
          </Typography>
        </Box>
        <StyledBox component="form" role="form">
          <StyledBox>
            <TextField 
              type="email" 
              placeholder="Email" 
              size="large" 
              variant="outlined" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </StyledBox>
          <StyledBox>
            <TextField 
              type="password" 
              placeholder="Password" 
              size="large" 
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </StyledBox>
          <Box display="flex" alignItems="center">
            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
            <Typography
              variant="button"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;Remember me
            </Typography>
          </Box>
          {error && (
            <StyledBox>
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            </StyledBox>
          )}
          <StyledBox mt={4}>
            <Button color="primary" variant="contained" size="large" fullWidth onClick={handleLogin}>
              Sign In
            </Button>
          </StyledBox>
          {/* <StyledBox mt={3} textAlign="center">
            <Typography variant="button" color="textSecondary">
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: '#1976d2', fontWeight: 'medium' }}>
                Sign up
              </Link>
            </Typography>
          </StyledBox> */}
        </StyledBox>
      </StyledPaper>
    </FullScreenBox>
  );
}

export default Login;
