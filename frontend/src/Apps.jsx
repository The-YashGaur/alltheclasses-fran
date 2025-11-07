import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Stepper, Step, StepLabel, Typography, Paper, Button, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import Step1 from './components/FormSteps/Step1';
import Step2 from './components/FormSteps/Step2';
import Step3 from './components/FormSteps/Step3';
import Step4 from './components/FormSteps/Step4';
import Step5 from './components/FormSteps/Step5';
import Step6 from './components/FormSteps/Step6';
import Step7 from './components/FormSteps/Step7';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6d00', // Orange color
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#333',
    },
  },
});

const steps = [
  'Purpose',
  'Instructions',
  'Basic Details',
  'Business Details',
  'Operations',
  'Marketing',
  'Mindset & Alignment'
];

function Apps() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleSubmit = async () => {
    if (activeStep !== steps.length - 1) return;
    
    console.log('🚀 Starting form submission...');
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // 1. Prepare form data
      const formDataToSend = new FormData();
      const { documents = {}, ...formDataWithoutDocs } = formData;
      
      // 2. Log form data for debugging (sensitive data redacted)
      console.group('📋 Form Submission Data');
      console.log('📄 Form Data (without files):', {
        ...formDataWithoutDocs,
        // Redact sensitive data in logs
        password: formDataWithoutDocs.password ? '***' : undefined,
        confirmPassword: formDataWithoutDocs.confirmPassword ? '***' : undefined
      });
      console.log('📎 Files to upload:', Object.keys(documents));
      console.groupEnd();
      
      // 3. Add JSON data
      formDataToSend.append('formData', JSON.stringify(formDataWithoutDocs));
      
      // 4. Add files if they exist
      if (documents && Object.keys(documents).length > 0) {
        console.group('📤 Adding files to FormData');
        for (const [key, file] of Object.entries(documents)) {
          if (file instanceof File) {
            console.log(`📄 Appending file: ${key} (${file.name}, ${file.size} bytes, ${file.type})`);
            formDataToSend.append(key, file);
          } else {
            console.warn(`⚠️ Skipping invalid file for ${key}:`, file);
          }
        }
        console.groupEnd();
      } else {
        console.log('ℹ️ No files to upload');
      }
      
  
      const apiBase = process.env.REACT_APP_API_URL || 'https://alltheclasses-fran.onrender.com';
      const apiUrl = `${apiBase.replace(/\/$/, '')}/api/applications`;
console.log(`📤 Sending request to: ${apiUrl}`);
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}_t=${timestamp}`;
      
      const response = await axios({
        method: 'post',
        url: urlWithTimestamp,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        withCredentials: false, // Disable withCredentials for now
        timeout: 120000, // 120 seconds
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`📤 Upload Progress: ${percentCompleted}%`);
        }
      });

      console.log('✅ Server response:', response.data);

      if (response.data && response.data.success) {
        console.log('🎉 Form submitted successfully!');
        setIsSubmitted(true);
        setSubmitStatus({
          success: true,
          message: 'Form submitted successfully!'
        });
      } else {
        throw new Error(response.data?.message || 'Server responded with an error');
      }
      
    } catch (error) {
      // Log detailed error information
      console.group('❌ Submission Error');
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
      } else {
        console.error('Error config:', error.config);
      }
      console.groupEnd();
      
      // Determine the most helpful error message to show
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.response) {
        // Server responded with an error status
        const { data, status } = error.response;
        errorMessage = data?.message || 
                      data?.error?.message || 
                      `Server error (${status}: ${error.response.statusText || 'Unknown error'})`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (!navigator.onLine) {
        errorMessage = 'You appear to be offline. Please check your internet connection.';
      }
      
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request ? 'Request was made but no response received' : undefined
      });
      
      setSubmitStatus({
        success: false,
        message: errorMessage
      });
      
      // Show error to user
      alert(`❌ Error: ${errorMessage}\n\nPlease check the browser console for more details.`);
    } finally {
      console.log('🏁 Form submission attempt completed');
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    const commonProps = {
      formData,
      updateFormData,
      handleChange: (e) => updateFormData({ [e.target.name]: e.target.checked })
    };

    switch (step) {
      case 0:
        return <Step1 {...commonProps} onNext={handleNext} />;
      case 1:
        return <Step2 {...commonProps} onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <Step3 {...commonProps} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step4 {...commonProps} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step5 {...commonProps} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step6 {...commonProps} onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Step7 {...commonProps} onBack={handleBack} />;
      default:
        return 'Unknown step';
    }
  };

  if (isSubmitted) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 6, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Thank You!
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Thank you for submitting the application for Alltheclasses Franchise.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our team will get back to you in 24-36 hours.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                setFormData({});
                setActiveStep(0);
                setIsSubmitted(false);
              }}
              sx={{ mt: 3 }}
            >
              Submit Another Application
            </Button>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Franchise Application Form
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Join us in shaping the future of education
            </Typography>
          </Box>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 2, mb: 4 }}>
            {getStepContent(activeStep)}
            
            {activeStep === steps.length - 1 && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </Box>
            )}
            
            {submitStatus.message && (
              <Box sx={{ mt: 2 }}>
                <Alert severity={submitStatus.success ? 'success' : 'error'}>
                  {submitStatus.message}
                </Alert>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default Apps;