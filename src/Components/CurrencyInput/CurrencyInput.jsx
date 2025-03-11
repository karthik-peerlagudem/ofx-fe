import React from 'react';

import DropDown from '../DropDown';

import classes from './CurrencyInput.module.css';

const CurrencyInput = ({ label, value, onChange, dropdownProps, style }) => {
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '') {
            onChange('');
            return;
        }
        onChange(Number(inputValue));
    };
    return (
        <div className={classes.container} style={style}>
            <label className={classes.label}>{label}</label>
            <div className={classes.inputWrapper}>
                <div className={classes.dropdown}>
                    <DropDown {...dropdownProps} />
                </div>
                <input
                    type="number"
                    inputMode="decimal"
                    value={value}
                    onChange={handleInputChange}
                    className={classes.input}
                    placeholder="0"
                />
            </div>
        </div>
    );
};

export default CurrencyInput;
