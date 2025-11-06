import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  FormControlLabel,
  Checkbox,
  Paper,
  Container
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const Step2 = ({ formData, handleChange, onNext, onBack }) => {
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
          Instructions
        </Typography>
        
        <List sx={{ mb: 3, '& .MuiListItem-root': { alignItems: 'flex-start' } }}>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36, pt: { xs: '8px', sm: 0 } }}>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Fill out the form honestly and completely." 
              secondary="Provide accurate information to help us understand your background and goals."
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36, pt: { xs: '8px', sm: 0 } }}>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Prepare supporting documents" 
              secondary="Have digital copies of your ID proof, address proof, and other relevant documents ready to upload."
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36, pt: { xs: '8px', sm: 0 } }}>
              <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Review process" 
              secondary="Our team will review your application and contact you within 3-5 working days."
            />
          </ListItem>
        </List>
        
        <Box sx={{ mt: 3, pl: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                id="instructionsAcknowledged"
                checked={formData.instructionsAcknowledged || false}
                onChange={handleChange}
                name="instructionsAcknowledged"
                color="primary"
                required
                inputProps={{
                  'aria-label': 'I have read and understood the instructions',
                  'aria-required': 'true'
                }}
              />
            }
            label="I have read and understood the instructions"
          />
        </Box>
        
      </Paper>
    </Container>
  );
};

export default Step2;
