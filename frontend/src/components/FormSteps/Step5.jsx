import React from 'react';
import { 
  Box, 
  TextField, 
  Grid, 
  Typography, 
  FormControlLabel, 
  Checkbox, 
  Paper,
  Container,
  MenuItem,
  FormGroup,
  Divider
} from '@mui/material';

const Step5 = ({ formData, handleChange }) => {
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
          Operations
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          {/* Teaching Team Section */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Teaching Team Details
              </Typography>
              <Box sx={{ pl: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.hasTeachingTeam || false}
                      onChange={handleChange}
                      name="hasTeachingTeam"
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'medium',
                      fontSize: { xs: '0.95rem', sm: '1rem' }
                    }}>
                      Do you have a teaching team ready?
                    </Typography>
                  }
                  sx={{ display: 'block', mb: 2 }}
                />
                
                {formData.hasTeachingTeam && (
                  <Box sx={{ pl: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Number of teachers"
                      type="number"
                      name="teacherCount"
                      value={formData.teacherCount || ''}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          width: '100%',
                          maxWidth: '400px'
                        },
                        mb: 3
                      }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Teacher Qualifications
                    </Typography>
                    <FormGroup row sx={{ mb: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.teachersCertified || false}
                            onChange={handleChange}
                            name="teachersCertified"
                            color="primary"
                          />
                        }
                        label="Certified Teachers"
                        sx={{ mr: 3 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.teachersExperienced || false}
                            onChange={handleChange}
                            name="teachersExperienced"
                            color="primary"
                          />
                        }
                        label="Experienced Teachers"
                      />
                    </FormGroup>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Management Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Center Management
              </Typography>
              <Box sx={{ pl: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Who will manage the center?"
                  name="managementType"
                  value={formData.managementType || ''}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ maxWidth: 600, mb: 3 }}
                >
                  <MenuItem value="">Select management type</MenuItem>
                  <MenuItem value="self">I will manage the center myself</MenuItem>
                  <MenuItem value="hired">I will hire a dedicated manager</MenuItem>
                  <MenuItem value="both">Combination of self and hired management</MenuItem>
                </TextField>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Management Support Required
                </Typography>
                <FormGroup row sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.needsTraining || false}
                        onChange={handleChange}
                        name="needsTraining"
                        color="primary"
                      />
                    }
                    label="Management Training"
                    sx={{ mr: 3 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.needsMarketingSupport || false}
                        onChange={handleChange}
                        name="needsMarketingSupport"
                        color="primary"
                      />
                    }
                    label="Marketing Support"
                  />
                </FormGroup>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Operational Hours */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Operational Hours
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Weekday Opening Time"
                      type="time"
                      name="weekdayOpen"
                      value={formData.weekdayOpen || '09:00'}
                      onChange={handleChange}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Weekday Closing Time"
                      type="time"
                      name="weekdayClose"
                      value={formData.weekdayClose || '18:00'}
                      onChange={handleChange}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Weekend Operations"
                      name="weekendOperations"
                      value={formData.weekendOperations || 'yes'}
                      onChange={handleChange}
                      margin="normal"
                    >
                      <MenuItem value="yes">Open on Weekends</MenuItem>
                      <MenuItem value="saturday">Open on Saturday Only</MenuItem>
                      <MenuItem value="no">Closed on Weekends</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid> 
        </Box> 
      </Paper>
    </Container>
  );
};

export default Step5;
