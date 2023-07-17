import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete/Autocomplete";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from "@mui/material/InputLabel/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from '@mui/material/Paper';
import phoneCode from "../../../../phone/phoneCode";
import { yupResolver } from '@hookform/resolvers/yup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { uploadStorage } from "../../../store/tools/toolThunk";
import { selectConfig } from "../../../store/config";

import '../../../../styles/home.css';

const container = {
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const ldTypeData = [
  {id: 0, name: '身份证'},
  {id: 1, name: '护照'},
  {id: 2, name: '驾照'},
  {id: 3, name: '居住证'}
]

/**
 * Form Validation Schema
 */
 const schema = yup.object().shape({
  // email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  // nationCode: yup.string().required('You must enter your nationCode'),
  // phone: yup.string().required('You must enter a phone'),
  firstName: yup.string().required('You must enter First Name'),
  middleName: yup.string().required('You must enter Middle Name'),
  lastName: yup.string().required('You must enter Last Name')
});

const defaultValues = {
  email: '',
  phoneCountry: '',
  phone: '',
  firstName: '',
  middleName: '',
  lastName: '',
  country: '',
  ldType: '',
  usSsn: ''
};

function KycModal() {
    const config = useSelector(selectConfig);
    let baseImgUrl = "";
    if (config.system.cdnUrl) {
        baseImgUrl = config.system.cdnUrl.substr(0, config.system.cdnUrl.length - 1);
    }

    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();
    const { isValid, errors } = formState;
    const [ tmpPhoneCode, setTmpPhoneCode ] = useState('');
    const [ countryCode, setTmpCountryCode ] = useState('');
    const [ ldType, setLdType ] = useState('');
    const [value, setValue] = useState(dayjs('2022-08-18T21:11:54'));

    const [ keyName, setKeyName ] = useState('');
    const [ inputVal, setInputVal ] = useState({
      idFrontUrl: '',
      idBackUrl: '',
      selfPhotoUrl: '',
      proofOfAddressUrl: ''
    })
    const uploadChange = async (file) => {
      const uploadRes = await dispatch(uploadStorage({
          file: file
      }));
      setInputVal({ ...inputVal, [keyName]: uploadRes.payload.url });
    };

    return (
        <div>
            {/*head*/}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="px-24 pb-24"
            >
                {/*1*/}
                <Box
                    className="w-full rounded-16 flex flex-col"
                    component={motion.div}
                    variants={item}
                >
                  <Paper
                      className="w-full min-h-full rounded-0 py-32 px-16"
                      style={{
                          padding: '0.2rem 1.6rem 0 0.6rem',
                          backgroundColor: 'transparent',
                          boxShadow: 'none'
                      }}
                  >
                      <div className="w-full">
                          <Typography className="mt-32 text-20 font-extrabold tracking-tight leading-tight flex items-center justify-content-start back-modal-title kyc-back-modal-title cursor-pointer">
                            <img className='back-modal-title-img' src="assets/images/logo/icon-back.png" alt="back icon" />
                            Back
                          </Typography>
                          <div className="flex items-baseline mt-2 font-medium text-14" style={{marginBottom: '2rem', marginTop: 0}}>
                              <Typography>Have you not conducted KYC yet?
                                <span className="ml-4 color-16c2a3">
                                  Go to KYC
                                </span>
                              </Typography>
                          </div>

                          <form
                              name="bindMailboxForm"
                              noValidate
                              className="flex flex-col justify-center w-full mt-8"
                              // onSubmit={handleSubmit(onSubmit)}
                          >
                            <Controller
                                  name="email"
                                  control={control}
                                  render={({ field }) => (
                                      <FormControl  variant="outlined" className="mb-24">
                                          <InputLabel
                                              style={{
                                                  color: !!errors.email && '#f44336'
                                              }}
                                          >Email*</InputLabel>
                                          <OutlinedInput
                                            {...field}
                                            label="Email"
                                            type="text"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            error={!!errors.email}
                                          />
                                          {!!errors.email &&
                                          <div
                                              style={{
                                                  fontSize: '1.2rem',
                                                  color: '#f44336',
                                                  fontWeight: 400,
                                                  lineHeight: 1.66,
                                                  textAlign: 'left',
                                                  marginTop: '3px',
                                                  marginRight: '14px',
                                                  marginBottom: 0,
                                                  marginLeft: '14px',
                                              }}
                                          >
                                              {errors?.email?.message}
                                          </div>
                                          }
                                      </FormControl>
                                  )}
                              />

                              <Controller
                                name="phoneCountry"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        // disablePortal
                                        className="mb-24"
                                        options={phoneCode.list}
                                        autoHighlight
                                        onInputChange={(event, newInputValue) => {
                                            setTmpPhoneCode(newInputValue.replace(/\+/g, ""));
                                        }}
                                        filterOptions={(options) => {
                                            const reg = new RegExp(tmpPhoneCode, 'i');
                                            const array = options.filter((item) => {
                                                return reg.test(item.phone_code) || reg.test(item.local_name)
                                            });
                                            return array;
                                        }}
                                        onChange={(res, option) => {
                                            control._formValues.phoneCountry = option.phone_code
                                        }}
                                        getOptionLabel={(option) => {return control._formValues.phoneCountry}}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`/assets/images/country/${option.country_code}.png`}
                                                    alt=""
                                                />
                                                {option.local_name} ({option.country_code}) +{option.phone_code}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="PhoneCountry"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'phoneCountry', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <FormControl  variant="outlined" className="mb-24">
                                        <InputLabel
                                            style={{
                                                color: !!errors.phone && '#f44336'
                                            }}
                                        >Phone*</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            label="PhoneNumber"
                                            type="number"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            error={!!errors.phone}
                                        />
                                        {!!errors.phone &&
                                        <div
                                            style={{
                                                fontSize: '1.2rem',
                                                color: '#f44336',
                                                fontWeight: 400,
                                                lineHeight: 1.66,
                                                textAlign: 'left',
                                                marginTop: '3px',
                                                marginRight: '14px',
                                                marginBottom: 0,
                                                marginLeft: '14px',
                                            }}
                                        >
                                            {errors?.phone?.message}
                                        </div>
                                        }
                                    </FormControl>
                                )}
                            />

                              <Controller
                                  name="firstName"
                                  control={control}
                                  render={({ field }) => (
                                      <TextField
                                          {...field}
                                          className="mb-24"
                                          label="First Name"
                                          type="number"
                                          error={!!errors.firstName}
                                          helperText={errors?.firstName?.message}
                                          variant="outlined"
                                          required
                                          fullWidth
                                      />
                                  )}
                              />

                              <Controller
                                  name="middleName"
                                  control={control}
                                  render={({ field }) => (
                                      <TextField
                                          {...field}
                                          className="mb-24"
                                          label="Middle Name"
                                          type="number"
                                          error={!!errors.middleName}
                                          helperText={errors?.middleName?.message}
                                          variant="outlined"
                                          required
                                          fullWidth
                                      />
                                  )}
                              />

                              <Controller
                                  name="lastName"
                                  control={control}
                                  render={({ field }) => (
                                      <TextField
                                          {...field}
                                          className="mb-24"
                                          label="Last Name"
                                          type="number"
                                          error={!!errors.lastName}
                                          helperText={errors?.lastName?.message}
                                          variant="outlined"
                                          required
                                          fullWidth
                                      />
                                  )}
                              />

                              <Controller
                                  name="birthDate"
                                  control={control}
                                  render={({ field }) => (
                                    <FormControl  variant="outlined" className="mb-24">
                                        <DesktopDatePicker
                                          label="BirthDate"
                                          inputFormat="yyyy-dd-mm"
                                          value={value}
                                          onChange={(newValue) => {
                                            setValue(newValue);
                                          }}
                                          renderInput={(params) => <TextField {...params} />}
                                        />
                                      </FormControl>
                                  )}
                              />

                              <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        // disablePortal
                                        className="mb-24"
                                        options={phoneCode.list}
                                        autoHighlight
                                        onInputChange={(event, newInputValue) => {
                                            setTmpCountryCode(newInputValue.replace(/\+/g, ""));
                                        }}
                                        filterOptions={(options) => {
                                            const reg = new RegExp(countryCode, 'i');
                                            const array = options.filter((item) => {
                                                return reg.test(item.phone_code) || reg.test(item.local_name)
                                            });
                                            return array;
                                        }}
                                        onChange={(res, option) => {
                                            control._formValues.country = option.phone_code
                                        }}
                                        getOptionLabel={(option) => {return control._formValues.country}}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`/assets/images/country/${option.country_code}.png`}
                                                    alt=""
                                                />
                                                {option.local_name} ({option.country_code}) +{option.phone_code}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Country"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'country', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />

                            <Controller
                                name="ldType"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        // disablePortal
                                        className="mb-24"
                                        options={ldTypeData}
                                        autoHighlight
                                        onInputChange={(event, newInputValue) => {
                                          setLdType(newInputValue.replace(/\+/g, ""));
                                        }}
                                        filterOptions={(options) => {
                                            const reg = new RegExp(ldType, 'i');
                                            const array = options.filter((item) => {
                                                return reg.test(item.name)
                                            });
                                            return array;
                                        }}
                                        onChange={(res, option) => {
                                            control._formValues.ldType = option.name
                                        }}
                                        getOptionLabel={(option) => {return control._formValues.ldType}}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                {option.name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="ldType"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'ldType', // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                              
                              <Controller
                                  name="idFrontUrl"
                                  control={control}
                                  render={({ field }) => (
                                    <Box className="mb-24">
                                        <Typography
                                            style={{
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                color: '#94A3B8',
                                                borderBottom: '1px solid #484d59',
                                                margin: '0 0 2rem 0',
                                                paddingBottom: '0.3rem'
                                            }}
                                            className="text-16"
                                        >
                                            IdFrontUrl
                                        </Typography>
                                        <div className="flex flex-wrap items-center justify-content-start">
                                        { inputVal.idFrontUrl && 
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.idFrontUrl} alt=""/>
                                          </div>
                                        }
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => {setKeyName('idFrontUrl')}}
                                              >
                                                <img style={{ display: 'block' }} src='assets/images/kyc/icon-upload.png' alt=""/>
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                              </Box>
                                            </div>
                                        </div>
                                        
                                    </Box>
                                  )}
                              />

                              <Controller
                                  name="idBackUrl"
                                  control={control}
                                  render={({ field }) => (
                                    <Box className="mb-24">
                                        <Typography
                                            style={{
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                color: '#94A3B8',
                                                borderBottom: '1px solid #484d59',
                                                margin: '0 0 2rem 0',
                                                paddingBottom: '0.3rem'
                                            }}
                                            className="text-16"
                                        >
                                            IdBackUrl
                                        </Typography>
                                        <div className="flex flex-wrap items-center justify-content-start">
                                        { inputVal.idBackUrl && 
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.idBackUrl} alt=""/>
                                          </div>
                                        }
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => {setKeyName('idBackUrl')}}
                                              >
                                                <img style={{ display: 'block' }} src='assets/images/kyc/icon-upload.png' alt=""/>
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                              </Box>
                                            </div>
                                        </div>
                                        
                                    </Box>
                                  )}
                              />

                                <Controller
                                  name="selfPhotoUrl"
                                  control={control}
                                  render={({ field }) => (
                                    <Box className="mb-24">
                                        <Typography
                                            style={{
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                color: '#94A3B8',
                                                borderBottom: '1px solid #484d59',
                                                margin: '0 0 2rem 0',
                                                paddingBottom: '0.3rem'
                                            }}
                                            className="text-16"
                                        >
                                            SelfPhotoUrl
                                        </Typography>
                                        <div className="flex flex-wrap items-center justify-content-start">
                                        { inputVal.selfPhotoUrl && 
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.selfPhotoUrl} alt=""/>
                                          </div>
                                        }
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => {setKeyName('selfPhotoUrl')}}
                                              >
                                                <img style={{ display: 'block' }} src='assets/images/kyc/icon-upload.png' alt=""/>
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                              </Box>
                                            </div>
                                        </div>
                                        
                                    </Box>
                                  )}
                              />

                              <Controller
                                  name="proofOfAddressUrl"
                                  control={control}
                                  render={({ field }) => (
                                    <Box className="mb-24">
                                        <Typography
                                            style={{
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                color: '#94A3B8',
                                                borderBottom: '1px solid #484d59',
                                                margin: '0 0 2rem 0',
                                                paddingBottom: '0.3rem'
                                            }}
                                            className="text-16"
                                        >
                                            ProofOfAddressUrl
                                        </Typography>
                                        <div className="flex flex-wrap items-center justify-content-start">
                                        { inputVal.proofOfAddressUrl && 
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <img style={{ width: "100%", height: '100%', display: 'block' }} src={baseImgUrl + inputVal.proofOfAddressUrl} alt=""/>
                                          </div>
                                        }
                                          <div className='kyc-file-box flex items-center justify-center'>
                                            <Box
                                                className="px-48 text-lg flex items-center justify-center cursor-pointer"
                                                color="secondary"
                                                variant="contained"
                                                sx={{ color: '#ffffff' }}
                                                style={{backgroundColor: 'transparent', borderRaduis: '8px !important', width: "100%", height: '100%', padding: 0 }}
                                                component="label"
                                                onClick={() => {setKeyName('proofOfAddressUrl')}}
                                              >
                                                <img style={{ display: 'block' }} src='assets/images/kyc/icon-upload.png' alt=""/>
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="button-file"
                                                    type="file"
                                                    onChange={(e) => { uploadChange(e.target.files[0]) }}
                                                />
                                              </Box>
                                            </div>
                                        </div>
                                        
                                    </Box>
                                  )}
                              />

                              <Controller
                                  name="usSsn"
                                  control={control}
                                  render={({ field }) => (
                                      <TextField
                                          {...field}
                                          className="mb-24"
                                          label="UsSsn"
                                          type="text"
                                          error={!!errors.usSsn}
                                          helperText={errors?.usSsn?.message}
                                          variant="outlined"
                                          required
                                          fullWidth
                                      />
                                  )}
                              />

                              <Button
                                  variant="contained"
                                  color="secondary"
                                  className=" w-full mt-24 button-reset"
                                  aria-label="Register"
                                  // disabled={!isValid}
                                  type="submit"
                                  size="large"
                                  style={{marginBottom: '2rem'}}
                              >
                                  Save
                              </Button>

                              <Button
                                  variant="contained"
                                  color="secondary"
                                  className=" w-full mt-24 button-reset"
                                  aria-label="Register"
                                  // disabled={!isValid}
                                  type="submit"
                                  size="large"
                              >
                                  Submit KYC
                              </Button>
                          </form>
                      </div>
                  </Paper>
                </Box>
            </motion.div>
        </div>
    )
}

export default KycModal;
