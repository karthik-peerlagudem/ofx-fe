import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';

import DropDown from './DropDown';
import Flag from '../Flag/Flag';

describe('DropDown Component', () => {
    const mockProps = {
        selected: 'AUD',
        setSelected: jest.fn(),
        label: 'From',
        options: [
            { option: 'AUD', key: 'AU', icon: <Flag code={'AU'} /> },
            { option: 'USD', key: 'US', icon: <Flag code={'US'} /> },
        ],
        leftIcon: <Flag code={'AU'} />,
        style: { width: '200px' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with all props', () => {
        render(<DropDown {...mockProps} />);

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByText('AUD')).toBeInTheDocument();
        expect(screen.getByTestId('flag-AU')).toBeInTheDocument();
    });

    it('opens dropdown menu when clicked', () => {
        render(<DropDown {...mockProps} />);

        const dropdownButton = screen.getByRole('button');
        fireEvent.click(dropdownButton);

        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByTestId('flag-US')).toBeInTheDocument();
    });

    it('closes dropdown when option is selected', () => {
        const mockPropsUSD = {
            ...mockProps,
            setSelected: jest.fn(),
            selected: 'USD',
            leftIcon: <Flag code={'US'} />,
        };

        const { rerender } = render(<DropDown {...mockProps} />);

        // Open dropdown
        const dropdownButton = screen.getByRole('button');
        fireEvent.click(dropdownButton);

        // get the usd <li>
        const menuItems = screen.getAllByRole('listitem');
        const listItemUSD = menuItems.find((item) =>
            item.textContent.includes('USD')
        );

        const currencyButtonUSD = within(listItemUSD).getByRole('button');
        fireEvent.click(currencyButtonUSD);

        expect(mockProps.setSelected).toHaveBeenCalledWith('US');

        // re-rendering using the selected usd
        rerender(<DropDown {...mockPropsUSD} />);

        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
        expect(screen.queryByText('AUD')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
        render(
            <div>
                <div data-testid="outside">Outside</div>
                <DropDown {...mockProps} />
            </div>
        );

        // Open dropdown
        const dropdownButton = screen.getByRole('button');
        fireEvent.click(dropdownButton);

        // Click outside
        const outsideElement = screen.getByTestId('outside');
        fireEvent.mouseDown(outsideElement);

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
        expect(screen.queryByTestId('flag-US')).not.toBeInTheDocument();
    });
});
