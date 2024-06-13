import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import {
    resetPass
} from '../../store/user/userThunk';
import { useTranslation } from "react-i18next";
import { showMessage } from 'app/store/fuse/messageSlice';



const defaultValues = {
    oldPassword: '',
    password: '',
    passwordConfirm: '',
};

function ResetPin() {
    const { t } = useTranslation('mainPage');
    /**
 * Form Validation Schema
 */
    const schema = yup.object().shape({
        oldPassword: yup
            .string()
            .required('Please enter your old password.')
            .min(6, t("signUp_8")),
        // .min(6, 'Password is too short - should be 6 chars minimum.'),
        password: yup
            .string()
            .required('Please enter your new password.')
            .max(16, 'Password is too long - should be 16 chars maximum.')
            // .min(6, 'Password is too short - should be 6 chars minimum.'),
            .min(6, t("signUp_8")),
        passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    });
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    const dispatch = useDispatch();

    async function onSubmit() {
        await dispatch(resetPass(control._formValues));
    }

    return (
        <div
            className="flex flex-col flex-auto items-center sm:justify-center min-w-0"
        >
            <Paper
                className="w-full tongYongChuang flex justify-content-center"
                style={{
                    background: "#1e293b"
                }}
            >
                <div className="w-full  mx-auto sm:mx-0">
                    <div className="flex items-baseline mt-2 font-medium">
                        <Typography>Reset your PIN Code</Typography>
                    </div>

                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full mt-32"
                    // onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
                            name="oldPassword"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label="Old PIN Code"
                                    type="password"
                                    error={!!errors.oldPassword}
                                    helperText={errors?.oldPassword?.message}
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
                                    label="New PIN Code"
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors?.password?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="passwordConfirm"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label="New PIN Code(Confirm)"
                                    type="password"
                                    error={!!errors.passwordConfirm}
                                    helperText={errors?.passwordConfirm?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />

                        <div className="flex flex-col sm:flex-row items-center">
                            {t('re_tied_email_3')}
                            <a href='/home' className="text-md font-medium">
                                {t('re_tied_email_4')}
                            </a>
                        </div>

                        <Button
                            variant="contained"
                            color="secondary"
                            className=" w-full mt-24"
                            aria-label="Register"
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            type="submit"
                            size="large"
                        >
                            Reset your PIN Code
                        </Button>
                    </form>
                </div>
            </Paper>
        </div>
    );
}

export default ResetPin;
