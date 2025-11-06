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

const targetClasses = [
  'Class 6-8',
  'Class 9-10',
  'Class 11-12 (Science)',
  'Class 11-12 (Commerce)',
  'JEE',
  'NEET',
  'Foundation / Olympiad'
];

const investmentRanges = [
  '₹5-7 lakhs',
  '₹7-10 lakhs',
  '₹10-15 lakhs',
  'Above ₹15 lakhs'
];

const Step4 = ({ formData, handleChange }) => {
  // Handle nested field changes
  const handleNestedChange = (field, value) => {
    const [parent, child] = field.split('.');
    handleChange({
      target: {
        name: parent,
        value: {
          ...(formData[parent] || {}),
          [child]: value
        }
      }
    });
  };

  // Handle teaching team changes
  const handleTeachingTeamChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    handleChange({
      target: {
        name: 'teachingTeam',
        value: {
          ...(formData.teachingTeam || {}),
          [name]: type === 'checkbox' ? checked : value
        }
      }
    });
  };

  // Handle target class selection
  const handleTargetClassChange = (className) => {
    const currentClasses = [...(formData.targetClasses || [])];
    const index = currentClasses.indexOf(className);
    
    if (index === -1) {
      currentClasses.push(className);
    } else {
      currentClasses.splice(index, 1);
    }
    
    handleChange({
      target: {
        name: 'targetClasses',
        value: currentClasses
      }
    });
  };

  // Handle branded institute checkbox
  const handleBrandedInstituteChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name === 'exists') {
      handleNestedChange('competition.brandedInstitute', {
        exists: checked,
        name: checked ? (formData.competition?.brandedInstitute?.name || '') : ''
      });
    } else if (name === 'name') {
      handleNestedChange('competition.brandedInstitute', {
        ...(formData.competition?.brandedInstitute || { exists: false }),
        name: value
      });
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary">
          Business Details
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={4}>
            {/* Floor Type Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Premises Details
              </Typography>
              <Box sx={{ pl: 2 }}>
                <FormControl fullWidth margin="normal" sx={{ maxWidth: 400 }}>
                  <InputLabel id="floor-type-label">Floor Type *</InputLabel>
                  <Select
                    labelId="floor-type-label"
                    id="proposedPremises.floor"
                    name="proposedPremises.floor"
                    value={formData.proposedPremises?.floor || ''}
                    onChange={(e) => handleNestedChange('proposedPremises.floor', e.target.value)}
                    label="Floor Type"
                    required
                  >
                    <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                    <MenuItem value="First Floor">First Floor</MenuItem>
                    <MenuItem value="Second Floor">Second Floor</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
            
                {formData.proposedPremises?.floor === 'Other' && (
                  <TextField
                    fullWidth
                    id="proposedPremises.otherDetails"
                    name="proposedPremises.otherDetails"
                    label="Please specify floor type"
                    value={formData.proposedPremises?.otherDetails || ''}
                    onChange={(e) => handleNestedChange('proposedPremises.otherDetails', e.target.value)}
                    margin="normal"
                    sx={{ maxWidth: 400, mt: 2 }}
                  />
                )}
              </Box>
            </Grid>
            
            {/* Competition Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Nearby Competition
              </Typography>
              <Box sx={{ pl: 2 }}>
                <TextField
                  fullWidth
                  label="Number of schools within 2-3 km radius"
                  type="number"
                  value={formData.competition?.nearbySchools || ''}
                  onChange={(e) => handleNestedChange('competition.nearbySchools', e.target.value)}
                  margin="normal"
                  sx={{ maxWidth: 400, mb: 3 }}
                />
                
                <TextField
                  fullWidth
                  label="Number of coaching institutes nearby"
                  type="number"
                  value={formData.competition?.coachingInstitutes || ''}
                  onChange={(e) => handleNestedChange('competition.coachingInstitutes', e.target.value)}
                  margin="normal"
                  sx={{ maxWidth: 400, mb: 3 }}
                />
            
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.competition?.brandedInstitute?.exists || false}
                      onChange={handleBrandedInstituteChange}
                      name="exists"
                      color="primary"
                    />
                  }
                  label="Is there any well-known or branded institute nearby?"
                  sx={{ display: 'block', mb: 2 }}
                />
                
                {formData.competition?.brandedInstitute?.exists && (
                  <TextField
                    fullWidth
                    name="name"
                    label="If yes, mention the name"
                    value={formData.competition.brandedInstitute.name || ''}
                    onChange={handleBrandedInstituteChange}
                    margin="normal"
                    sx={{ maxWidth: 400, mb: 3 }}
                  />
                )}
              </Box>
            </Grid>
          
            {/* Target Classes Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Target Classes (Select all that apply)
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Grid container spacing={1}>
                  {targetClasses.map((className) => (
                    <Grid item xs={12} sm={6} md={4} key={className}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={(formData.targetClasses || []).includes(className)}
                            onChange={() => handleTargetClassChange(className)}
                            name={className}
                            color="primary"
                          />
                        }
                        label={className}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {(formData.targetClasses || []).includes('Other') && (
                  <TextField
                    fullWidth
                    name="otherTargetClass"
                    label="Please specify other target class"
                    value={formData.otherTargetClass || ''}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ maxWidth: 400, mt: 2 }}
                  />
                )}
              </Box>
            </Grid>
          
            {/* Teaching Team Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Teaching Team
              </Typography>
              <Box sx={{ pl: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.teachingTeam?.hasTeam || false}
                      onChange={handleTeachingTeamChange}
                      name="hasTeam"
                      color="primary"
                    />
                  }
                  label="Do you already have a teaching team available?"
                  sx={{ display: 'block', mb: 2 }}
                />
                
                {formData.teachingTeam?.hasTeam && (
                  <Box sx={{ pl: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      name="teamSize"
                      label="How many teachers?"
                      type="number"
                      value={formData.teachingTeam?.teamSize || ''}
                      onChange={handleTeachingTeamChange}
                      margin="normal"
                      sx={{ maxWidth: 400, mb: 3 }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.teachingTeam?.openToTraining || false}
                          onChange={handleTeachingTeamChange}
                          name="openToTraining"
                          color="primary"
                        />
                      }
                      label="Is your team open to training programs and new methodologies?"
                      sx={{ display: 'block', mb: 2 }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
        
            {/* Management Type Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Management
              </Typography>
              <Box sx={{ pl: 2 }}>
                <TextField
                  fullWidth
                  select
                  name="managementType"
                  label="Will you actively run the classes yourself or appoint a management team?"
                  value={formData.managementType || ''}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ maxWidth: 600 }}
                >
                  <MenuItem value="">Select an option</MenuItem>
                  <MenuItem value="self">I will manage myself</MenuItem>
                  <MenuItem value="team">I will appoint a management team</MenuItem>
                  <MenuItem value="both">Combination of both</MenuItem>
                </TextField>
              </Box>
            </Grid>
        
            {/* Investment Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Investment Details
              </Typography>
              <Box sx={{ pl: 2 }}>
                <TextField
                  fullWidth
                  select
                  name="investmentRange"
                  label="Initial Investment Range"
                  value={formData.investmentRange || ''}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ maxWidth: 400, mb: 3 }}
                >
                  <MenuItem value="">Select investment range</MenuItem>
                  {investmentRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </TextField>
        
                {formData.investmentRange === 'Above ₹15 lakhs' && (
                  <TextField
                    fullWidth
                    name="customInvestment"
                    label="Please specify the amount"
                    value={formData.customInvestment || ''}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ maxWidth: 400, mb: 3 }}
                  />
                )}
        
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.needsLoan || false}
                      onChange={(e) => handleChange({ target: { name: 'needsLoan', value: e.target.checked } })}
                      name="needsLoan"
                      color="primary"
                    />
                  }
                  label="Do you need financial assistance/loan?"
                  sx={{ display: 'block', mb: 2 }}
                />
        
                {formData.needsLoan && (
                  <TextField
                    fullWidth
                    name="loanAmount"
                    label="Approximate loan amount required (₹)"
                    type="number"
                    value={formData.loanAmount || ''}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ maxWidth: 400, mb: 3 }}
                  />
                )}
              </Box>
            </Grid>
          
            {/* Fee Structure Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Average Fee Structure of Nearby Institutes (per month)
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      name="feeStructure.class6to8"
                      label="Class 6-8 (₹)"
                      type="number"
                      value={formData.feeStructure?.class6to8 || ''}
                      onChange={(e) => handleNestedChange('feeStructure.class6to8', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      name="feeStructure.class9to10"
                      label="Class 9-10 (₹)"
                      type="number"
                      value={formData.feeStructure?.class9to10 || ''}
                      onChange={(e) => handleNestedChange('feeStructure.class9to10', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      name="feeStructure.class11to12"
                      label="Class 11-12 (₹)"
                      type="number"
                      value={formData.feeStructure?.class11to12 || ''}
                      onChange={(e) => handleNestedChange('feeStructure.class11to12', e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      name="feeStructure.entranceTest"
                      label="Entrance Test (₹/year)"
                      type="number"
                      value={formData.feeStructure?.entranceTest || ''}
                      onChange={(e) => handleNestedChange('feeStructure.entranceTest', e.target.value)}
                      margin="normal"
                    />
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

export default Step4;
