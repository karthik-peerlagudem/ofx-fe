import React, { useRef, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import DropDown from '../DropDown';

import classes from './CurrencyInput.module.css';

const CurrencyInput = ({ label, value, onChange, dropdownProps, style }) => {
    const inputRef = useRef(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const numberPattern = /^\d*\.?\d*$/;

        if (inputValue === '') {
            setError('');
            onChange('0');
            return;
        }

        if (!numberPattern.test(inputValue)) {
            setError('Please enter numbers only');
            onChange('0');
            return;
        }

        setError('');
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

    useEffect(() => {
        if (value) {
            // Retrigger calculation with current value
            onChange(value);
        }
    }, [dropdownProps.selected]);

    return (
        <div className={classes.container} style={style}>
            <label className={classes.label}>{label}</label>
            <div className={classes.inputWrapper}>
                <div className={classes.dropdown}>
                    <DropDown
                        {...dropdownProps}
                        setSelected={(key) => {
                            dropdownProps.setSelected(key);
                        }}
                    />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="0"
                    value={value}
                    onChange={handleInputChange}
                    className={classes.input}
                    onInput={moveCursorToEnd}
                    onFocus={moveCursorToEnd}
                />
            </div>
            {error && (
                <div>
                    {' '}
                    <span className={classes.errorMessage}>{error}</span>
                </div>
            )}
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
