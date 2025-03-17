import './Header.css';
import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <div className={`header-wrap`}>
                <h1 className="header-title">{props.title}</h1>
            </div>
            <div className="header-shadow" />
        </header>
    );
};

export default Header;
