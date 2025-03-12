import React, { useRef } from 'react';

import PropTypes from 'prop-types';

import DropDown from '../DropDown';

import classes from './CurrencyInput.module.css';

const CurrencyInput = ({ label, value, onChange, dropdownProps, style }) => {
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        // If input is empty or backspace was pressed and input is now empty
        if (inputValue === '') {
            onChange('');
            return;
        }
        onChange(inputValue);
    };

    const moveCursorToEnd = () => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.selectionStart =
                    inputRef.current.selectionEnd =
                        inputRef.current.value.length;
            }, 0);
        }
    };
    return (
        <div className={classes.container} style={style}>
            <label className={classes.label}>{label}</label>
            <div className={classes.inputWrapper}>
                <div className={classes.dropdown}>
                    <DropDown {...dropdownProps} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={value}
                    onChange={handleInputChange}
                    className={classes.input}
                    placeholder="0"
                    onInput={moveCursorToEnd}
                    onFocus={moveCursorToEnd}
                />
            </div>
        </div>
    );
};

CurrencyInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    dropdownProps: PropTypes.object,
    style: PropTypes.object,
};

export default CurrencyInput;
