import React from 'react';
import { 
  Box, 
  TextField, 
  Grid, 
  MenuItem, 
  Typography, 
  FormControlLabel, 
  Checkbox,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const Step3 = ({ formData, handleChange }) => {
  // Handle nested form data changes
  const handleNestedChange = (field, value) => {
    handleChange({
      target: {
        name: 'familyInEducation',
        value: {
          ...formData.familyInEducation,
          [field]: value
        }
      }
    });
  };

  return (
    <Container component="main" maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          color="primary"
          sx={{ 
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Basic Details
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                value={formData.fullName || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                inputProps={{
                  'aria-required': 'true',
                  'aria-label': 'Full Name'
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Age"
                type="number"
                value={formData.age || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                inputProps={{
                  'aria-required': 'true',
                  'aria-label': 'Age',
                  min: 18,
                  max: 100
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" size="small" required>
                <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="preferNotToSay">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="mobileNumber"
                label="Mobile Number"
                value={formData.mobileNumber || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="currentAddress"
                label="Current Address"
                multiline
                rows={3}
                value={formData.currentAddress || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permanentAddress === formData.currentAddress}
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: 'permanentAddress',
                          value: e.target.checked ? formData.currentAddress : ''
                        }
                      });
                    }}
                  />
                }
                label="Same as current address"
              />
            </Grid>
            
            {formData.permanentAddress !== formData.currentAddress && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="permanentAddress"
                  label="Permanent Address"
                  multiline
                  rows={3}
                  value={formData.permanentAddress || ''}
                  onChange={handleChange}
                  margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                  required
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="highestQualification"
                label="Highest Qualification"
                value={formData.highestQualification || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="currentOccupation"
                label="Current Occupation"
                value={formData.currentOccupation || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" size="small" required>
                <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Marital Status</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formData.maritalStatus || ''}
                  onChange={handleChange}
                  label="Marital Status"
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="divorced">Divorced</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                  <MenuItem value="separated">Separated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="familyMembers"
                label="Number of Family Members"
                type="number"
                value={formData.familyMembers || ''}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '100%'
                  }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.familyInEducation?.isInEducation || false}
                    onChange={(e) => handleNestedChange('isInEducation', e.target.checked)}
                  />
                }
                label="Any family member in education field?"
              />
              
              {formData.familyInEducation?.isInEducation && (
                <TextField
                  fullWidth
                  name="familyInEducationDetails"
                  label="Please provide details"
                  multiline
                  rows={2}
                  value={formData.familyInEducation?.details || ''}
                  onChange={(e) => handleNestedChange('details', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      width: '100%'
                    },
                    mt: 1
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Step3;
