import React from 'react';

import Header from './Header/Header.tsx';
import Menu from './Menu/Menu.tsx';

import './MainLayout.css';

interface MainLayoutProps {
    title: string;
    children: React.ReactNode;
}

const MainLayout = (props: MainLayoutProps) => {
    return (
        <div id="container">
            <Menu />
            <div id="main">
                <Header title={props.title} />
                <div id="content">{props.children}</div>
            </div>
        </div>
    );
};

export default MainLayout;
