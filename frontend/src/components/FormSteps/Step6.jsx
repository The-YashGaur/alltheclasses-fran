import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  Container,
  Button
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Step6 = ({ onNext, onBack, formData = {}, updateFormData }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      marketing: {
        hasBudget: !!formData.marketing?.hasBudget,
        budget: formData.marketing?.budget ?? '',
        hasNetwork: !!formData.marketing?.hasNetwork,
        networkDetails: formData.marketing?.networkDetails ?? ''
      },
      additionalMarketingNotes: formData.additionalMarketingNotes ?? ''
    },
    validationSchema: Yup.object({
      marketing: Yup.object().shape({
        hasBudget: Yup.boolean(),
        budget: Yup.number().when('hasBudget', {
          is: true,
          then: (schema) =>
            schema
              .required('Budget amount is required')
              .typeError('Must be a number')
              .positive('Must be a positive number'),
          otherwise: (schema) => schema.nullable()
        }),
        hasNetwork: Yup.boolean(),
        networkDetails: Yup.string().when('hasNetwork', {
          is: true,
          then: (schema) => schema.required('Please provide details about your network'),
          otherwise: (schema) => schema.nullable()
        })
      })
    }),
    onSubmit: (values) => {
      // Normalize values before sending up
      const normalized = {
        marketing: {
          hasBudget: !!values.marketing.hasBudget,
          budget: values.marketing.budget === '' ? undefined : Number(values.marketing.budget),
          hasNetwork: !!values.marketing.hasNetwork,
          networkDetails: values.marketing.networkDetails || ''
        },
        additionalMarketingNotes: values.additionalMarketingNotes || ''
      };
      updateFormData(normalized);
      // Advance step (parent will decide whether it's final submit)
      if (typeof onNext === 'function') onNext();
    }
  });

  // Keep parent updated live (optional but helpful)
  useEffect(() => {
    updateFormData({
      marketing: {
        hasBudget: !!formik.values.marketing.hasBudget,
        budget: formik.values.marketing.budget === '' ? undefined : Number(formik.values.marketing.budget),
        hasNetwork: !!formik.values.marketing.hasNetwork,
        networkDetails: formik.values.marketing.networkDetails || ''
      },
      additionalMarketingNotes: formik.values.additionalMarketingNotes || ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  return (
    <Container component="main" maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mt: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 4 }}>
          Branding & Marketing Readiness
        </Typography>

        <Box>
          {/* Marketing Budget */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Marketing & Promotion
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.marketing.hasBudget}
                  onChange={(e) => formik.setFieldValue('marketing.hasBudget', e.target.checked)}
                  name="hasBudget"
                  color="primary"
                />
              }
              label="Will you be able to allocate a budget for local marketing/promotions?"
            />

            {formik.values.marketing.hasBudget && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  id="marketing.budget"
                  name="marketing.budget"
                  label="Approximate monthly budget (₹)"
                  type="number"
                  value={formik.values.marketing.budget ?? ''}
                  onChange={(e) => formik.setFieldValue('marketing.budget', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.marketing?.budget && formik.errors.marketing?.budget)}
                  helperText={formik.touched.marketing?.budget ? formik.errors.marketing?.budget : ''}
                />
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.marketing.hasNetwork}
                  onChange={(e) => formik.setFieldValue('marketing.hasNetwork', e.target.checked)}
                  name="hasNetwork"
                  color="primary"
                />
              }
              label="Do you already have any local network (schools/parent groups)?"
            />

            {formik.values.marketing.hasNetwork && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  id="marketing.networkDetails"
                  name="marketing.networkDetails"
                  label="Please provide details about your network"
                  value={formik.values.marketing.networkDetails ?? ''}
                  onChange={(e) => formik.setFieldValue('marketing.networkDetails', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={!!(formik.touched.marketing?.networkDetails && formik.errors.marketing?.networkDetails)}
                  helperText={formik.touched.marketing?.networkDetails ? formik.errors.marketing?.networkDetails : ''}
                  multiline
                  rows={3}
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Additional Marketing Notes
            </Typography>
            <TextField
              fullWidth
              id="additionalMarketingNotes"
              name="additionalMarketingNotes"
              label="Any other marketing strategies or ideas you have in mind?"
              multiline
              rows={4}
              value={formik.values.additionalMarketingNotes ?? ''}
              onChange={(e) => formik.setFieldValue('additionalMarketingNotes', e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => typeof onBack === 'function' && onBack()}>
              Back
            </Button>

            <Button variant="contained" onClick={() => formik.submitForm()}>
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Step6;
