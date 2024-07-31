import { createSlice } from '@reduxjs/toolkit';
import history from '@history';

// state
const initialState = {
    properties: {}
};

const userPropertiesSlice = createSlice({
    name: 'userProperties',
    initialState,
    reducers: {
        updateUserSettingProperties: (state, action) => {
            let res = action.payload;
            if (JSON.stringify(res) !== '{}' && JSON.stringify(res) !== JSON.stringify(state.properties)) {
                state.properties = res;
            }
        },

    },
    extraReducers: {
        // [doLogin.fulfilled]: (state, action) => action.payload,
    }
});

export const { updateUserSettingProperties } = userPropertiesSlice.actions;

export const selectUserProperties = ({ userProperties }) => userProperties;

export default userPropertiesSlice.reducer;
