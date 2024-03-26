import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import phoneCode from "../../../../phone/phoneCode";
import {getUrlParam} from "../../../util/tools/function";
import { yupResolver } from '@hookform/resolvers/yup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

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

/**
 * Form Validation Schema
 */
 const schema = yup.object().shape({
  // email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  // nationCode: yup.string().required('You must enter your nationCode'),
  // phone: yup.string().required('You must enter a phone'),
  smsCode: yup.string().required('You must enter a Code'),
  password: yup
      .string()
      .required('Please enter your password.')
      .min(6, 'Password is too short - should be 6 chars minimum.')
    // .min(6,t("signUp_8"))
      .max(16, 'Password is too long - should be 16 chars maximum.'),
});

const defaultValues = {
  nationCode: '',
  phone: '',
  email: '',
  smsCode: '',
  password: '',
};

function BindMailbox() {

    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const dispatch = useDispatch();
    const { isValid, errors } = formState;
    const ranges = ['Email', 'Phone'];
    const [ tmpPhoneCode, setTmpPhoneCode ] = useState('');
    const [tabValue, setTabValue] = useState(0);

    const [time,setTime] = useState(null);
    const timeRef = useRef();
    //倒计时
    useEffect(()=>{
        if(time && time !== 0)
            timeRef.current = setTimeout(() => {
                setTime(time => time - 1)
            },1000);

        return () => {
            clearTimeout(timeRef.current)
        }
    },[time]);

    async function sendCode() {
      let sendRes = {};
      if (tabValue === 1) {
          const data = {
              codeType: 1,
              nationCode: control._formValues.nationCode,
              phone: control._formValues.phone,
          };
          sendRes = await dispatch(sendSms(data));
      } else {
          const data = {
              codeType: 1,
              email: control._formValues.email,
          };
          sendRes = await dispatch(sendEmail(data));
      }

      if (sendRes?.payload) {
          setTime(60)
      }
  }

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
                          <Typography className="mt-32 text-20 font-extrabold tracking-tight leading-tight flex items-center justify-content-start back-modal-title cursor-pointer">
                            <img className='back-modal-title-img' src="wallet/assets/images/logo/icon-back.png" alt="back icon" />
                            Back
                          </Typography>
                          <div className="flex items-baseline mt-2 font-medium text-14" style={{marginBottom: '2rem', marginTop: 0}}>
                              <Typography>Has the account not been bound yet?
                                <span className="ml-4 color-16c2a3">
                                    Go to Bind
                                </span>
                              </Typography>
                          </div>

                          <Tabs
                              component={motion.div}
                              value={tabValue}
                              onChange={(ev, value) => setTabValue(value)}
                              indicatorColor="secondary"
                              textColor="inherit"
                              variant="scrollable"
                              scrollButtons={false}
                              className="min-h-32"
                              style={{padding: '0 0', margin: '1.5rem 0 2.4rem', borderColor: 'transparent', backgroundColor: '#181f2b', width: '144px', borderRadius: '20px', height: '3.2rem'}}
                              classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                              TabIndicatorProps={{
                                  children: (
                                      <Box
                                          sx={{ bgcolor: 'text.disabled' }}
                                          className="w-full h-full rounded-full opacity-20"
                                      />
                                  ),
                              }}
                              sx={{
                                  borderBottom: '1px solid #374252',
                                  padding: '1rem 1.2rem'
                              }}
                          >
                              {Object.entries(ranges).map(([key, label]) => (
                                  <Tab
                                      className="text-14 font-semibold min-h-32 min-w-72 px-8"
                                      disableRipple
                                      key={key}
                                      label={label}
                                      sx={{
                                          color: '#FFFFFF', height: '3.2rem'
                                      }}
                                  />
                              ))}
                          </Tabs>

                          <form
                              name="bindMailboxForm"
                              noValidate
                              className="flex flex-col justify-center w-full mt-8"
                              // onSubmit={handleSubmit(onSubmit)}
                          >
                              {tabValue === 1 && <>
                                  <Controller
                                      name="nationCode"
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
                                                  // control._formValues.nationCode = option.phone_code
                                              }}
                                              // getOptionLabel={(option) => {return control._formValues.nationCode}}
                                              renderOption={(props, option) => (
                                                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                      <img
                                                          loading="lazy"
                                                          width="20"
                                                          src={`/wallet/assets/images/country/${option.country_code}.png`}
                                                          alt=""
                                                      />
                                                      {option.local_name} ({option.country_code}) +{option.phone_code}
                                                  </Box>
                                              )}
                                              renderInput={(params) => (
                                                  <TextField
                                                      {...params}
                                                      label="nationCode"
                                                      inputProps={{
                                                          ...params.inputProps,
                                                          autoComplete: 'nationCode', // disable autocomplete and autofill
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
                                                  label="Phone"
                                                  type="number"
                                                  variant="outlined"
                                                  required
                                                  fullWidth
                                                  error={!!errors.phone}
                                                  endAdornment={
                                                      <InputAdornment position="end">
                                                          {time <=0 && <IconButton
                                                              aria-label="toggle password visibility"
                                                              onClick={sendCode}
                                                              // onMouseDown={handleMouseDownPassword}
                                                              edge="end"
                                                              sx={{
                                                                  fontSize: '1.4rem',
                                                                  borderRadius: '5px'
                                                              }}
                                                          >
                                                              Send
                                                          </IconButton>}

                                                          {time > 0 &&
                                                          <div>
                                                              {time} s
                                                          </div>
                                                          }
                                                      </InputAdornment>
                                                  }
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
                              </>}

                              {tabValue === 0 && <Controller
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
                                              endAdornment={
                                                  <InputAdornment position="end">
                                                      {time <=0 && <IconButton
                                                          aria-label="toggle password visibility"
                                                          onClick={sendCode}
                                                          // onMouseDown={handleMouseDownPassword}
                                                          edge="end"
                                                          sx={{
                                                              fontSize: '1.4rem',
                                                              borderRadius: '5px'
                                                          }}
                                                      >
                                                          Send
                                                      </IconButton>}

                                                      {time > 0 &&
                                                      <div>
                                                          {time} s
                                                      </div>
                                                      }
                                                  </InputAdornment>
                                              }
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
                              />}


                              <Controller
                                  name="smsCode"
                                  control={control}
                                  render={({ field }) => (
                                      <TextField
                                          {...field}
                                          className="mb-24"
                                          label="Code"
                                          type="number"
                                          error={!!errors.smsCode}
                                          helperText={errors?.smsCode?.message}
                                          variant="outlined"
                                          required
                                          fullWidth
                                      />
                                  )}
                              />

                              <Controller
                                  name="password"
                                  control={control}
                                  render={({ field }) => (
                                      <TextField
                                          {...field}
                                          className="mb-24"
                                          label="Password"
                                          type="password"
                                          error={!!errors.password}
                                          helperText={errors?.password?.message}
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
                                  disabled={!isValid}
                                  type="submit"
                                  size="large"
                              >
                                  Bind {tabValue === 0 ? 'Email' : 'Phone'}
                              </Button>
                          </form>
                      </div>
                  </Paper>
                </Box>
            </motion.div>
        </div>
    )
}

export default BindMailbox;
