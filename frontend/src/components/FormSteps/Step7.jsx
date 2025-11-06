import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Paper,
  Grid,
  Checkbox,
  Container,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon } from '@mui/icons-material';

const Step7 = ({ formData, updateFormData }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      timeframe: formData.timeframe || '',
      motivation: formData.motivation || '',
      fullTimeDedication: typeof formData.fullTimeDedication === 'boolean' ? formData.fullTimeDedication : false,
      educationGoal: formData.educationGoal || '',
      learningModel: formData.learningModel || '',
      trainingAdoption: formData.trainingAdoption || '',
      communicationStyle: formData.communicationStyle || '',
      classroomEnvironment: formData.classroomEnvironment || '',
      documents: {
        idProof: formData.documents?.idProof || null,
        addressProof: formData.documents?.addressProof || null,
        bankStatement: formData.documents?.bankStatement || null,
        experienceCertificate: formData.documents?.experienceCertificate || null,
        premisesPhoto: formData.documents?.premisesPhoto || null
      },
      termsAccepted: formData.termsAccepted || false
    },
    validationSchema: Yup.object({
      timeframe: Yup.string().required('Please select your expected timeframe'),
      motivation: Yup.string().required('Please select your primary motivation'),
      fullTimeDedication: Yup.boolean().required('Please specify if you can dedicate full time'),
      educationGoal: Yup.string().required('Please answer about education goals'),
      learningModel: Yup.string().required('Please specify your view on learning models'),
      trainingAdoption: Yup.string().required('Please specify training adoption'),
      communicationStyle: Yup.string().required('Please select communication style'),
      classroomEnvironment: Yup.string().required('Please select classroom environment'),
      documents: Yup.object({
        idProof: Yup.mixed().required('ID proof is required'),
        addressProof: Yup.mixed().required('Address proof is required'),
        bankStatement: Yup.mixed().required('Bank statement is required'),
        experienceCertificate: Yup.mixed().nullable(),
        premisesPhoto: Yup.mixed().nullable()
      }),
      termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms')
    }),
    onSubmit: () => {
      // App handles submit; keep for completeness
    }
  });

  // Sync formik values back to app-level state whenever they change
  useEffect(() => {
    updateFormData({
      timeframe: formik.values.timeframe,
      motivation: formik.values.motivation,
      fullTimeDedication: formik.values.fullTimeDedication,
      educationGoal: formik.values.educationGoal,
      learningModel: formik.values.learningModel,
      trainingAdoption: formik.values.trainingAdoption,
      communicationStyle: formik.values.communicationStyle,
      classroomEnvironment: formik.values.classroomEnvironment,
      documents: formik.values.documents,
      termsAccepted: formik.values.termsAccepted
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  const onDrop = (acceptedFiles, fieldName) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      formik.setFieldValue(`documents.${fieldName}`, file);
    }
  };

  const FileUploadField = ({ name, label }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      },
      maxFiles: 1,
      onDrop: (files) => onDrop(files, name)
    });

    const fileObj = formik.values.documents?.[name];

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {label} {formik.errors.documents?.[name] && (
            <span style={{ color: 'red' }}>*</span>
          )}
        </Typography>
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: isDragActive ? '#f5f5f5' : '#fff',
            cursor: 'pointer',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#666',
          }}
        >
          <input {...getInputProps()} />
          <UploadIcon sx={{ fontSize: 40, mb: 1, color: '#666' }} />
          {fileObj ? (
            <div>
              <p style={{ margin: 0 }}>{fileObj.name}</p>
              <p style={{ margin: 0 }}>(Click to change)</p>
            </div>
          ) : isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag & drop a file here, or click to select a file</p>
          )}
          <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>
            Supported formats: .jpg, .png, .pdf, .doc, .docx
          </p>
        </div>
        {formik.touched.documents?.[name] && formik.errors.documents?.[name] && (
          <Typography color="error" variant="caption" display="block">
            {formik.errors.documents[name]}
          </Typography>
        )}
      </Box>
    );
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
          Final Steps & Submission
        </Typography>

        <Box>
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom>
              Mindset & Alignment with Our Philosophy
            </Typography>

            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                What is your primary motivation for starting this venture?
              </FormLabel>
              <RadioGroup
                name="motivation"
                value={formik.values.motivation}
                onChange={(e) => formik.setFieldValue('motivation', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel
                  value="passion"
                  control={<Radio size="small" />}
                  label="Passion for education and teaching"
                />
                <FormControlLabel
                  value="business"
                  control={<Radio size="small" />}
                  label="Business opportunity"
                />
                <FormControlLabel
                  value="social"
                  control={<Radio size="small" />}
                  label="Social impact"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span>Other:</span>
                      <TextField
                        size="small"
                        variant="standard"
                        value={['income', 'passion', 'business', 'social'].includes(formik.values.motivation) ? '' : formik.values.motivation || ''}
                        onChange={(e) => formik.setFieldValue('motivation', e.target.value)}
                        sx={{ ml: 1, width: '200px' }}
                        placeholder="Please specify"
                      />
                    </Box>
                  }
                />
              </RadioGroup>
              {formik.touched.motivation && formik.errors.motivation && (
                <Typography color="error" variant="caption">{formik.errors.motivation}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Will you be able to dedicate your full time?
              </FormLabel>
              <RadioGroup
                row
                name="fullTimeDedication"
                value={formik.values.fullTimeDedication ? 'true' : 'false'}
                onChange={(e) => formik.setFieldValue('fullTimeDedication', e.target.value === 'true')}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio size="small" />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
              {formik.touched.fullTimeDedication && formik.errors.fullTimeDedication && (
                <Typography color="error" variant="caption">
                  {formik.errors.fullTimeDedication}
                </Typography>
              )}
            </FormControl>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Educational Philosophy
            </Typography>

            {/* A few radio groups (kept as in your original code) */}
            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Do you believe that education's goal is not just marks, but also character building and logical thinking?</FormLabel>
              <RadioGroup
                row
                name="educationGoal"
                value={formik.values.educationGoal}
                onChange={(e) => formik.setFieldValue('educationGoal', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {formik.touched.educationGoal && formik.errors.educationGoal && (
                <Typography color="error" variant="caption">{formik.errors.educationGoal}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Would you like to adopt a stress-free, concept-based learning model?</FormLabel>
              <RadioGroup
                row
                name="learningModel"
                value={formik.values.learningModel}
                onChange={(e) => formik.setFieldValue('learningModel', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {formik.touched.learningModel && formik.errors.learningModel && (
                <Typography color="error" variant="caption">{formik.errors.learningModel}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Is your teaching team ready to adopt new methodologies and participate in training programs?</FormLabel>
              <RadioGroup
                row
                name="trainingAdoption"
                value={formik.values.trainingAdoption}
                onChange={(e) => formik.setFieldValue('trainingAdoption', e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="na" control={<Radio />} label="Not applicable" />
              </RadioGroup>
              {formik.touched.trainingAdoption && formik.errors.trainingAdoption && (
                <Typography color="error" variant="caption">{formik.errors.trainingAdoption}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>What kind of classroom environment would you like to maintain?</FormLabel>
              <RadioGroup
                name="classroomEnvironment"
                value={formik.values.classroomEnvironment}
                onChange={(e) => formik.setFieldValue('classroomEnvironment', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel
                  value="friendly"
                  control={<Radio />}
                  label="Friendly & disciplined - Focus on positive reinforcement while maintaining structure"
                />
                <FormControlLabel
                  value="result"
                  control={<Radio />}
                  label="Result-pressure based - Emphasize academic performance and test results"
                />
              </RadioGroup>
              {formik.touched.classroomEnvironment && formik.errors.classroomEnvironment && (
                <Typography color="error" variant="caption">{formik.errors.classroomEnvironment}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal" size="small">
              <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>What kind of communication style would you prefer with students and parents?</FormLabel>
              <RadioGroup
                name="communicationStyle"
                value={formik.values.communicationStyle}
                onChange={(e) => formik.setFieldValue('communicationStyle', e.target.value)}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel
                  value="transparent"
                  control={<Radio />}
                  label="Transparent - Open and honest communication about progress and challenges"
                />
                <FormControlLabel
                  value="strict"
                  control={<Radio />}
                  label="Strict - Formal and structured communication"
                />
                <FormControlLabel
                  value="flexible"
                  control={<Radio />}
                  label="Flexible - Adapt communication style based on individual needs"
                />
              </RadioGroup>
              {formik.touched.communicationStyle && formik.errors.communicationStyle && (
                <Typography color="error" variant="caption">{formik.errors.communicationStyle}</Typography>
              )}
            </FormControl>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom>
              Required Documents
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Please upload the following documents. Supported formats: JPG, PNG, PDF, DOC, DOCX
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={6}>
                <FileUploadField
                  name="idProof"
                  label="ID Proof (Aadhar / PAN / Passport / Voter ID)"
                />
                <FileUploadField
                  name="addressProof"
                  label="Address Proof (Aadhar / Utility Bill / Bank Statement)"
                />
                <FileUploadField
                  name="bankStatement"
                  label="Bank Statement (Last 6 months)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUploadField
                  name="experienceCertificate"
                  label="Experience Certificate (if any)"
                />
                <FileUploadField
                  name="premisesPhoto"
                  label="Photograph of Proposed Premises (if available)"
                />
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> File size should not exceed 5MB per document. For multiple pages, please combine into a single PDF.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mb: 4, p: 3, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  required
                  name="termsAccepted"
                  checked={formik.values.termsAccepted || false}
                  onChange={(e) => formik.setFieldValue('termsAccepted', e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body1" sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.3
                }}>
                  I declare that the information provided in this application is true and accurate to the best of my knowledge.
                  I understand that any false information may result in the rejection of my application.
                </Typography>
              }
            />
            {formik.touched.termsAccepted && formik.errors.termsAccepted && (
              <Typography color="error" variant="caption" display="block">
                {formik.errors.termsAccepted}
              </Typography>
            )}
          </Box>

        </Box>
      </Paper>
    </Container>
  );
};

export default Step7;
