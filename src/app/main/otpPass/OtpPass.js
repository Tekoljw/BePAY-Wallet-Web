import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import '../../../styles/home.css';

export default function OtpPass({googleTextKey,setGoogleCode, resizeLayout}) {
    const pinLength = 6
    const KEYCODE = Object.freeze({
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        END: 35,
        HOME: 36,
        SPACE: 32,
        BACK_SPACE: 8,
    });
    const [value, setValue] = React.useState("");
    // 用来存放6个input的引用
    const inputsRef = React.useRef([]);
    // 当前聚焦的input的下标
    const curFocusIndexRef = React.useRef(0);

    // 校验value是否有效，仅仅存在数字才有效
    const isInputValueValid = React.useCallback((value) => {
        return /^\d+$/.test(value);
    }, []);
    const [isdisable, setisdisable] = useState(true)
    // 聚焦指定下标的input
    const focusInput = React.useCallback((i) => {
        const inputs = inputsRef.current;
        if (i >= inputs.length) return;
        const input = inputs[i];
        if (!input) return;
        input.focus();
        curFocusIndexRef.current = i;
    }, []);

    // 聚焦后一个input
    const focusNextInput = React.useCallback(() => {
        const curFoncusIndex = curFocusIndexRef.current;
        const nextIndex =
            curFoncusIndex + 1 >= pinLength ? pinLength - 1 : curFoncusIndex + 1;
        focusInput(nextIndex);
    }, [focusInput]);

    // 聚焦前一个input
    const focusPrevInput = React.useCallback(() => {
        const curFoncusIndex = curFocusIndexRef.current;
        let prevIndex;
        if (curFoncusIndex === pinLength - 1 && value.length === pinLength) {
            prevIndex = pinLength - 1;
        } else {
            prevIndex = curFoncusIndex - 1 <= 0 ? 0 : curFoncusIndex - 1;
        }
        focusInput(prevIndex);
    }, [focusInput, value]);

    // 处理删除按钮
    const handleOnDelete = React.useCallback(() => {
        const curIndex = curFocusIndexRef.current;
        if (curIndex === 0) {
            if (!value) return;
            setValue("");
            setGoogleCode('');
        } else if (curIndex === pinLength - 1 && value.length === pinLength) {
            setValue(value.slice(0, curIndex));
            setGoogleCode(value.slice(0, curIndex));
        } else {
            setValue(value.slice(0, value.length - 1));
            setGoogleCode(value.slice(0, value.length - 1));
        }
        focusPrevInput();
    }, [focusPrevInput, value]);

    const handleOnKeyDown = React.useCallback(
        (e) => {
            switch (e.keyCode) {
                case KEYCODE.LEFT_ARROW:
                case KEYCODE.RIGHT_ARROW:
                case KEYCODE.HOME:
                case KEYCODE.END:
                case KEYCODE.SPACE:
                    e.preventDefault();
                    break;
                // 当点击删除按钮
                case KEYCODE.BACK_SPACE:
                    handleOnDelete();
                    break;
                default:
                    break;
            }
        },
        [handleOnDelete]
    );
    // 点击input时，重新聚焦当前的input，弹出键盘
    const handleClick = React.useCallback(() => {
        focusInput(curFocusIndexRef.current);
    }, [focusInput]);

    const handleChange = React.useCallback(
        (e) => {
            const val = e.target.value || "";
            if (!isInputValueValid(val)) return;
            if (val.length === 1) {
                focusNextInput();
                setValue(`${value}${val}`);
                setGoogleCode(`${value}${val}`);
            }
        },
        [focusNextInput, isInputValueValid, value]
    );

    const handlePaste = React.useCallback(
        (e) => {
            // 一定要清除默认行为
            e.preventDefault();
            const val = e.clipboardData.getData("text/plain").slice(0, pinLength);
            if (!isInputValueValid(val)) return;
            const len = val.length;
            const index = len === pinLength ? pinLength - 1 : len;
            // 如果之前存在输入，这里直接覆盖，也可以实现不覆盖的，也很简单
            setValue(val);
            setGoogleCode(val);
            focusInput(index);
        },
        [focusInput, isInputValueValid]
    );

    const handleWindowResize = ()=> {
        if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
            resizeLayout()
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize())
    }, [value])

    return (
        <div className="optpass">
            {Array.from({ length: pinLength }).map((_, index) => {
                const focus = index === curFocusIndexRef.current;
                return (
                    <input
                        // disabled={!googleTextKey}
                        // autoFocus 
                        key={index}
                        ref={(ref) => (inputsRef.current[index] = ref)}
                        // className={clsx('pinInput', focus && 'focus')}
                        className={clsx('pinInput','focus')}
                        maxLength={1}
                        type="number"
                        pattern="\d*"
                        autoComplete="false"
                        value={value[index] || ""}
                        onClick={handleClick}
                        onChange={handleChange}
                        onPaste={handlePaste}
                        onKeyDown={handleOnKeyDown}
                    />
                );
            })}
        </div>
    );
}
