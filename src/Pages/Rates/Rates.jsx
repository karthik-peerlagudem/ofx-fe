import { useState } from 'react';
import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';
import Flag from '../../Components/Flag/Flag';
import CurrencyInput from '../../Components/CurrencyInput';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';

let countries = CountryData.CountryCodes;

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');

    const [exchangeRate, setExchangeRate] = useState(0.7456);
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!loading) {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setLoading(false);
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                fetchData();
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.heading}>Currency Conversion</div>

                <div className={classes.rowWrapper}>
                    <div>
                        <CurrencyInput
                            label="From"
                            value={fromAmount}
                            onChange={setFromAmount}
                            dropdownProps={{
                                leftIcon: <Flag code={fromCurrency} />,
                                selected: countryToCurrency[fromCurrency],
                                options: countries.map(({ code }) => ({
                                    option: countryToCurrency[code],
                                    key: code,
                                    icon: <Flag key={code} code={code} />,
                                })),
                                setSelected: (key) => {
                                    setFromCurrency(key);
                                },
                            }}
                            style={{ marginRight: '20px' }}
                        />
                    </div>

                    <div className={classes.exchangeWrapper}>
                        <div className={classes.transferIcon}>
                            <Transfer />
                        </div>
                    </div>

                    <div>
                        <CurrencyInput
                            label="To"
                            value={toAmount}
                            onChange={setToAmount}
                            dropdownProps={{
                                leftIcon: <Flag code={toCurrency} />,
                                selected: countryToCurrency[toCurrency],
                                options: countries.map(({ code }) => ({
                                    option: countryToCurrency[code],
                                    key: code,
                                    icon: <Flag key={code} code={code} />,
                                })),
                                setSelected: (key) => {
                                    setToCurrency(key);
                                },
                            }}
                            style={{ marginRight: '20px' }}
                        />
                    </div>
                </div>
                <div className={classes.rate}>{exchangeRate}</div>

                <ProgressBar
                    progress={progression}
                    animationClass={loading ? classes.slow : ''}
                    style={{ marginTop: '20px' }}
                />

                {loading && (
                    <div className={classes.loaderWrapper}>
                        <Loader width={'25px'} height={'25px'} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rates;
