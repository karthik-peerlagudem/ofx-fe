import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Rates from './Pages/Rates/Rates.tsx';
import MainLayout from './Layouts/MainLayout.tsx';

import './App.css';

const App: React.FC = () => {
    return (
        <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <Routes>
                <Route
                    path="/rates"
                    element={
                        <MainLayout title="Rates">
                            <Rates />
                        </MainLayout>
                    }
                />
                <Route
                    path="/"
                    element={
                        <MainLayout title="Rates">
                            <Rates />
                        </MainLayout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
