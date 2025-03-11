import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyInput from './CurrencyInput';
import Flag from '../Flag/Flag';

describe('CurrencyInput', () => {
    const mockProps = {
        label: 'From',
        value: '',
        onChange: jest.fn(),
        dropdownProps: {
            leftIcon: <Flag code={'AU'} />,
            selected: 'USD',
            options: [
                { option: 'USD', key: 'US', icon: <Flag code={'US'} /> },
                { option: 'AUD', key: 'AU', icon: <Flag code={'AU'} /> },
            ],
            setSelected: jest.fn(),
        },
        style: { marginRight: '20px' },
    };

    it('renders with label and input', () => {
        render(<CurrencyInput {...mockProps} />);

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    });

    it('handles input change correctly', () => {
        render(<CurrencyInput {...mockProps} />);

        const input = screen.getByPlaceholderText('0');
        fireEvent.change(input, { target: { value: '123' } });

        expect(mockProps.onChange).toHaveBeenCalledWith(123);
    });
});
