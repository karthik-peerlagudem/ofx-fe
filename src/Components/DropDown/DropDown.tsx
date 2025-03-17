import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';

import classes from './DropDown.module.css';

interface Option {
    option: string;
    key: string;
    icon: React.ReactNode;
}

export interface DropDownProps {
    selected: string;
    setSelected: (value: string) => void;
    label?: string;
    options: Option[];
    leftIcon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const DropDown: React.FC<DropDownProps> = (props) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = props.options.filter(({ option }) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        }
    };

    const handleSelect = (key: string) => {
        props.setSelected(key);
        setOpen(false);
        setSearchTerm('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex((prev) => {
                    const nextIndex =
                        prev < filteredOptions.length - 1 ? prev + 1 : prev;
                    ensureOptionVisible(nextIndex);
                    return nextIndex;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => {
                    if (prev <= 0) {
                        // Move focus to input when at the top
                        searchInputRef.current?.focus();
                        ensureOptionVisible(-1);
                        return -1;
                    }
                    const nextIndex = prev - 1;
                    ensureOptionVisible(nextIndex);
                    return nextIndex;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (
                    focusedIndex >= 0 &&
                    focusedIndex < filteredOptions.length
                ) {
                    handleSelect(filteredOptions[focusedIndex].key);
                }
                break;
            case 'Escape':
                setOpen(false);
                setSearchTerm('');
                setFocusedIndex(-1);
                break;
        }
    };

    const ensureOptionVisible = (index: number) => {
        const menuItem = document.querySelector(`[data-index="${index}"]`);
        if (menuItem) {
            menuItem.scrollIntoView({ block: 'nearest' });
        }
    };

    return (
        <div
            ref={dropdownRef}
            className={`${classes.container} ${props.className}`}
            style={props.style}
        >
            {props.label && <span>{props.label}</span>}
            <button onClick={handleOpen} className={classes.dropdown}>
                {props.leftIcon}
                <span className={classes.dropdownText}>{props.selected}</span>

                <div className={classes.dropdownToggle}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.2 5.3894H7.8C6.2536 5.3894 5 6.64301 5 8.1894V16.5894C5 18.1358 6.2536 19.3894 7.8 19.3894H16.2C17.7464 19.3894 19 18.1358 19 16.5894V8.1894C19 6.64301 17.7464 5.3894 16.2 5.3894Z"
                            stroke="#E5E5E5"
                            strokeWidth="1.03427"
                        />

                        <path
                            className={`${classes.toggleArrow} ${
                                open ? classes.toggled : ''
                            }`}
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.20711 11.3894C8.76165 11.3894 8.53857 11.928 8.85355 12.243L11.6464 15.0359C11.8417 15.2311 12.1583 15.2311 12.3536 15.0358L15.1464 12.243C15.4614 11.928 15.2383 11.3894 14.7929 11.3894H9.20711Z"
                            fill="#6D7587"
                        />
                    </svg>
                </div>
            </button>
            {open && (
                <ul className={classes.menu}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={classes.searchInput}
                        placeholder="Search currency..."
                        data-index={'-1'}
                    />
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(({ option, key, icon }, index) => (
                            <li
                                key={key}
                                className={`${classes['menu-item']} ${
                                    index === focusedIndex
                                        ? classes.focused
                                        : ''
                                }`}
                                data-index={index}
                                // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
                                role="option"
                                aria-selected={index === focusedIndex}
                            >
                                <button
                                    className={classes.button}
                                    onClick={() => handleSelect(key)}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                >
                                    {icon}
                                    {option}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className={classes['no-results']}>
                            No currency found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default DropDown;
