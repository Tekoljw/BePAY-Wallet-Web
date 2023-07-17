import {createAsyncThunk} from "@reduxjs/toolkit";
import React from "react";
import { showMessage } from 'app/store/fuse/messageSlice';

// action/thunk
// 上传文件
export const uploadStorage = createAsyncThunk(
    '/storage/upload',
    async (settings, { dispatch, getState }) => {
        const formData = new FormData();
        formData.append("file", settings.file);
        const uploadRes = await React.$api("storage.upload", formData);
        if (uploadRes.errno === 0) {
            return uploadRes.data
        }
        return false
    }
);
