import React, { useRef, useState, useEffect } from 'react';

import DropDown from '../DropDown/DropDown.tsx';
import { DropDownProps } from '../DropDown/DropDown.tsx';

import classes from './CurrencyInput.module.css';

interface CurrencyInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    dropdownProps: DropDownProps;
    style?: React.CSSProperties;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    label,
    value,
    onChange,
    dropdownProps,
    style,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                if (inputRef.current) {
                    inputRef.current.selectionStart =
                        inputRef.current.value.length;
                    inputRef.current.selectionEnd =
                        inputRef.current.value.length;
                }
            }, 0);
        }
    };

    useEffect(() => {
        if (value) {
            // Retrigger calculation with current value
            onChange(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default CurrencyInput;
