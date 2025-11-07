import banner from '../src/assets/Banner.jpg';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Alert,
  Typography,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Link as MuiLink
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { orange } from '@mui/material/colors';

// Import steps
import Step1 from './components/FormSteps/Step1';
import Step2 from './components/FormSteps/Step2';
import Step3 from './components/FormSteps/Step3';
import Step4 from './components/FormSteps/Step4';
import Step5 from './components/FormSteps/Step5';
import Step6 from './components/FormSteps/Step6';
import Step7 from './components/FormSteps/Step7';

// Theme
const theme = createTheme({
  palette: {
    primary: { main: orange[500] },
    secondary: { main: '#f5f5f5' },
    background: { default: '#ffffff' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: orange[700],
      marginBottom: '1.5rem'
    }
  }
});

const steps = [
  'Purpose',
  'Instructions',
  'Basic Details',
  'Business Details',
  'Operations & Team',
  'Branding & Marketing',
  'Final Step'
];

// Helper to set nested value by dot path
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const last = keys.pop();
  let cur = obj;
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(cur, k) || typeof cur[k] !== 'object' || cur[k] === null) {
      cur[k] = {};
    }
    cur = cur[k];
  }
  cur[last] = value;
};

// Append formData helper (recursive) — produces bracketed keys expected by backend
const appendFormData = (fd, data, parentKey = '') => {
  if (data === undefined || data === null) return;
  if (data instanceof File) {
    // parentKey must be present for file fields
    fd.append(parentKey, data, data.name);
    return;
  }
  if (data instanceof Date) {
    fd.append(parentKey, data.toISOString());
    return;
  }
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
        appendFormData(fd, item, key);
      });
    } else {
      Object.keys(data).forEach((k) => {
        const value = data[k];
        const key = parentKey ? `${parentKey}[${k}]` : k;
        appendFormData(fd, value, key);
      });
    }
    return;
  }
  // primitive (string/number/boolean)
  // parentKey must be non-empty; if empty, this means top-level primitive — append using 'formData' to be safe
  if (!parentKey) {
    fd.append('formData', String(data));
  } else {
    fd.append(parentKey, String(data));
  }
};

function App() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isSmall = useMediaQuery('(max-width:900px)');
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  // navbar state
  const [anchorEl, setAnchorEl] = useState(null);

  // show/hide navbar on scroll
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      // if scrolled down more than 40px and currentY > last => hide
      if (currentY > lastScrollY.current && currentY > 40) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [formData, setFormData] = useState({
    purposeAcknowledged: false,
    instructionsAcknowledged: false,
    fullName: '',
    email: '',
    mobileNumber: '',
    age: '',
    gender: '',
    currentAddress: '',
    permanentAddress: '',
    highestQualification: '',
    currentOccupation: '',
    maritalStatus: '',
    familyMembers: '',
    familyInEducation: { isInEducation: false, details: '' },
    proposedPremises: {},
    competition: { nearbySchools: '', coachingInstitutes: '', brandedInstitute: { exists: false, name: '' } },
    targetClasses: [],
    teachingTeam: {},
    managementType: '',
    investmentRange: '',
    needsLoan: false,
    loanAmount: '',
    feeStructure: {},
    hasTeachingTeam: false,
    teacherCount: '',
    teachersCertified: false,
    teachersExperienced: false,
    weekdayOpen: '09:00',
    weekdayClose: '18:00',
    weekendOperations: 'yes',
    marketing: { hasBudget: false, budget: '', hasNetwork: false, networkDetails: '' },
    additionalMarketingNotes: '',
    documents: {
      idProof: null,
      addressProof: null,
      bankStatement: null,
      experienceCertificate: null,
      premisesPhoto: null
    },
    termsAccepted: false,
    timeframe: '',
    motivation: '',
    fullTimeDedication: false,
    educationGoal: '',
    learningModel: '',
    trainingAdoption: '',
    communicationStyle: '',
    classroomEnvironment: ''
  });

  // Robust universal change handler
  const handleChange = useCallback((eOrObj) => {
    const evt = eOrObj && eOrObj.target ? eOrObj.target : null;
    if (!evt) {
      console.warn('handleChange called without target', eOrObj);
      return;
    }

    const { name, value, type, checked, files } = evt;
    if (!name) return;

    // Files -> treat name as document key
    if (files) {
      const file = files[0] || null;
      setFormData((prev) => ({ ...(prev || {}), documents: { ...(prev.documents || {}), [name]: file } }));
      return;
    }

    const effectiveValue = type === 'checkbox' ? (typeof checked === 'boolean' ? checked : value) : value;

    // Ensure targetClasses remains an array
    if (name === 'targetClasses') {
      let newVal = effectiveValue;
      // If handler passes the array explicitly, use it; otherwise coerce string to array
      if (!Array.isArray(newVal)) {
        if (typeof newVal === 'string' && newVal.trim() !== '') newVal = [newVal];
        else newVal = Array.isArray(formData.targetClasses) ? formData.targetClasses : [];
      }
      setFormData((prev) => ({ ...(prev || {}), [name]: newVal }));
      return;
    }

    // Dotted names -> nested
    if (name.includes('.')) {
      setFormData((prev) => {
        const copy = JSON.parse(JSON.stringify(prev || {}));
        setNestedValue(copy, name, effectiveValue);
        return copy;
      });
      return;
    }

    // If object-like value (merge)
    if (typeof effectiveValue === 'object' && effectiveValue !== null && !Array.isArray(effectiveValue) && !(effectiveValue instanceof File)) {
      setFormData((prev) => ({ ...(prev || {}), [name]: { ...(prev[name] || {}), ...effectiveValue } }));
      return;
    }

    // default
    setFormData((prev) => ({ ...(prev || {}), [name]: effectiveValue }));
  }, [formData]);

  // Allow whole-object updates from steps (Step6/7)
  const updateFormData = useCallback((values) => {
    setFormData((prev) => ({ ...(prev || {}), ...(values || {}) }));
  }, []);

  const handleNext = () => {
    // Small validation gating for early steps
    if (activeStep === 0 && !formData.purposeAcknowledged) return;
    if (activeStep === 1 && !formData.instructionsAcknowledged) return;
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // Build FormData with bracket keys for nested objects and file fields
      const fd = new FormData();
      // Append full formData as 'formData' JSON for convenience on backend too
      fd.append('formData', JSON.stringify({
        ...formData,
        // Replace File objects in documents with placeholders — actual files appended separately below
        documents: Object.keys(formData.documents || {}).reduce((acc, k) => {
          const v = formData.documents[k];
          if (v instanceof File) acc[k] = null;
          else acc[k] = v;
          return acc;
        }, {})
      }));

      // Append individual primitive / nested fields (optional; backend accepts formData)
      // Also append each file under documents[<key>]
      Object.keys(formData.documents || {}).forEach((key) => {
        const val = formData.documents[key];
        if (val instanceof File) {
          fd.append(`documents[${key}]`, val, val.name);
        } else if (val && typeof val === 'object' && val.url) {
          // existing uploaded file metadata (send as JSON string so backend can merge)
          fd.append(`documents[${key}]`, JSON.stringify(val));
        } else if (typeof val === 'string') {
          fd.append(`documents[${key}]`, val);
        }
      });

      const response = await fetch('https://alltheclasses-fran.onrender.com/', {
        method: 'POST',
        body: fd
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.message || `Server returned ${response.status}`);

      setSubmitStatus({ success: true, message: 'Form submitted successfully!' });
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ success: false, message: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonProps = {
    formData,
    handleChange,
    onNext: handleNext,
    onBack: handleBack,
    updateFormData
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return <Step1 {...commonProps} />;
      case 1: return <Step2 {...commonProps} />;
      case 2: return <Step3 {...commonProps} />;
      case 3: return <Step4 {...commonProps} />;
      case 4: return <Step5 {...commonProps} />;
      case 5: return <Step6 {...commonProps} />;
      case 6: return <Step7 {...commonProps} />;
      default: return 'Unknown step';
    }
  };

  // NAVBAR handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Example nav links
  const navLinks = [
    { label: 'About', href: '#' },
    { label: 'ROI', href: '#' },
    { label: 'Investment', href: '#' },
    { label: 'Contact', href: '#' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* NAVBAR */}
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          // semi-opaque/opaque background
          backgroundColor: 'rgba(255,255,255,0.95)',
          color: 'text.primary',
          // hide when showNavbar is false (translateY)
          transform: showNavbar ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform 300ms ease, background-color 200ms ease',
          // give it a subtle blur (optional)
          backdropFilter: 'saturate(120%) blur(6px)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: { xs: 2, sm: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: { xs: 1, sm: 2 } }}>
            <Avatar
              src="/logo.png"
              alt="All The Classes Logo"
              sx={{
                width: { xs: 64, sm: 72 },   // make logo a bit bigger
                height: { xs: 64, sm: 72 },
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            />
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 800, color: 'primary.main' }} // "All The Classes" in orange 500
              >
                All The Classes
              </Typography>
            </Box>
          </Box>

          {/* Desktop links */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  component={MuiLink}
                  href={link.href}
                  underline="none"
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          ) : (
            // Mobile menu
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen} aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {navLinks.map((link) => (
              <MenuItem key={link.label} onClick={handleMenuClose} component="a" href={link.href}>
                {link.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 2, md: 4 } }}>
        <Box
          sx={{
            backgroundColor: 'white',
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: { xs: 1, sm: 3 },
            mb: 4,
            // ensure the box fits on smaller devices with comfortable horizontal padding
            px: { xs: 2, sm: 3, md: 6 }
          }}
        >
            {/* 🖼️ Image Banner Above the Title - responsive heights and lazy loading */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src={banner}
                alt="Franchise Application Banner"
                loading="lazy"
                sx={{
                  width: '100%',
                  maxWidth: 1100,
                  height: { xs: 140, sm: 180, md: 250 },
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: 2
                }}
              />
            </Box>

            {/* 🧾 Page Title */}
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                mb: { xs: 2, sm: 4 }
              }}
            >
              Franchise Application Form
            </Typography>

          {/* Stepper wrapper - allow horizontal scroll on narrow screens */}
          <Box sx={{
            mb: 4,
            // keep stepper within a horizontally scrollable container on small devices
            overflowX: 'auto',
            px: { xs: 1, sm: 0 },
            '&::-webkit-scrollbar': { height: 8 },
          }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel={!isSmall}
              sx={{
                minWidth: 320,
                maxWidth: '100%',
                '& .MuiStepLabel-label': {
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.7rem', sm: '0.85rem' }
                },
                // reduce icon & label sizes on small screens
                '& .MuiStepIcon-root': {
                  fontSize: { xs: 18, sm: 24 }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {getStepContent(activeStep)}

            {submitStatus.message && (
              <Alert
                severity={submitStatus.success ? 'success' : 'error'}
                sx={{ mt: 3, textAlign: 'center' }}
                onClose={() => setSubmitStatus({ success: false, message: '' })}
              >
                {submitStatus.message}
              </Alert>
            )}

            {/* Fixed bottom action bar (hide after successful submission) */}
          {!submitStatus.success && (
            <Box
              sx={{
                position: { xs: 'fixed', sm: 'fixed' },
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderTop: '1px solid #e0e0e0',
                p: { xs: 1, sm: 2 },
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: { xs: 1, sm: 0 },
                zIndex: 1400,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ width: { xs: '100%', sm: '30%' }, pr: { sm: 1 } }}>
                <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} fullWidth={isMobile}>
                  Back
                </Button>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: '70%' }, display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    fullWidth={isMobile}
                    sx={{ minWidth: { sm: 200 } }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    size="large"
                    disabled={(activeStep === 0 && !formData.purposeAcknowledged) || (activeStep === 1 && !formData.instructionsAcknowledged)}
                    fullWidth={isMobile}
                    sx={{
                      minWidth: { sm: 200 },
                      ml: { sm: 2 }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          )}

            {/* spacer to prevent content being hidden by fixed bar */}
            <Box sx={{ height: { xs: 120, sm: 90 } }} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
