import React from 'react';
import { 
  Box, 
  Typography, 
  FormControlLabel, 
  Checkbox,
  Paper,
  Container,
  Grid
} from '@mui/material';

const Step1 = ({ formData, handleChange, onNext }) => {
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
          Purpose of This Form
        </Typography>
        
        <Typography variant="body1" paragraph>
          This form has been created to assess the preliminary eligibility and seriousness of interested franchise applicants. 
          It helps us decide whether the applicant is suitable for the next steps — presentation, business discussion, 
          and legal process.
        </Typography>
        
        <Box sx={{ mt: 4, pl: 2 }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  id="purposeAcknowledged"
                  checked={formData.purposeAcknowledged || false}
                  onChange={handleChange}
                  name="purposeAcknowledged"
                  color="primary"
                  required
                  inputProps={{
                    'aria-label': 'I understand and acknowledge the purpose of this form',
                    'aria-required': 'true'
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      width: '100%'
                    }
                  }}
                />
              }
              label="I understand and acknowledge the purpose of this form"
            />
          </Grid>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Please check the box above to proceed to the next step.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Step1;
