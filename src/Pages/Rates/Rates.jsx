import { useState, useEffect } from 'react';

import ProgressBar from '../../Components/ProgressBar';
import Loader from '../../Components/Loader';
import Flag from '../../Components/Flag/Flag';
import CurrencyInput from '../../Components/CurrencyInput';

import { useAnimationFrame } from '../../Hooks/useAnimationFrame';
import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import { calculateBidirectionalConversion } from '../../Libs/util.js';
import { fetchLiveRate } from '../../Services/liveRateService.js';

let countries = CountryData.CountryCodes;
const isDevelopment = process.env.NODE_ENV === 'development';

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('IN');
    const [fromAmount, setFromAmount] = useState('1');
    const [toAmount, setToAmount] = useState('0');
    const [convertedAmounts, setConvertedAmounts] = useState({
        trueAmount: 0,
        markedUpAmount: 0,
    });

    const [error, setError] = useState(null);

    const [exchangeRate, setExchangeRate] = useState(0.75);
    const [progression, setProgression] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!loading) {
            setLoading(true);

            try {
                const rate = await fetchLiveRate(
                    countryToCurrency[fromCurrency],
                    countryToCurrency[toCurrency]
                );
                if (rate) {
                    setError(null);
                    setExchangeRate(rate);
                    handleFromAmountChange(fromAmount.toString(), rate);
                }
            } catch (error) {
                setError(`${error}, please try again later`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFromAmountChange = (value, rate = 0) => {
        if (value && value.endsWith('.')) {
            setFromAmount(value);
            return;
        }

        const formValue = parseFloat(value);

        setFromAmount(formValue);

        if (!isNaN(formValue)) {
            const amounts = calculateBidirectionalConversion(
                formValue,
                rate ? rate : exchangeRate,
                true
            );

            setConvertedAmounts(amounts);
            setToAmount(amounts.markedUpAmount.toFixed(2));
        } else {
            setConvertedAmounts({ trueAmount: 0, markedUpAmount: 0 });
            setToAmount('');
        }
    };

    const handleToAmountChange = (value) => {
        const toValue = value.endsWith('.')
            ? parseFloat(value + '0')
            : parseFloat(value);

        setToAmount(toValue);
        if (!isNaN(toValue)) {
            const amounts = calculateBidirectionalConversion(
                toValue,
                exchangeRate,
                false
            );
            setConvertedAmounts(amounts);
            setFromAmount(amounts.markedUpAmount.toFixed(2));
        } else {
            setConvertedAmounts({ trueAmount: 0, markedUpAmount: 0 });
            setFromAmount('');
        }
    };

    const recurringApiCallOnly = async () => {
        if (!loading) {
            try {
                const rate = await fetchLiveRate(
                    countryToCurrency[fromCurrency],
                    countryToCurrency[toCurrency]
                );
                if (rate) {
                    setExchangeRate(rate);
                }
            } catch (error) {
                console.error('Background rate refresh failed:', error);
            }
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                // repeated call only dev, to avoid the spam in prod
                if (isDevelopment) {
                    recurringApiCallOnly();
                }
                return 0;
            }
            return (prevState + deltaTime * 0.0001) % 1;
        });
    });

    // Initial fetch on component mount
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromCurrency, toCurrency]);

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.heading}>Currency Conversion</div>

                <div className={classes.rowWrapper}>
                    <div>
                        <CurrencyInput
                            label="From"
                            value={fromAmount.toString()}
                            onChange={handleFromAmountChange}
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
                            value={toAmount.toString()}
                            onChange={handleToAmountChange}
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

                {error ? (
                    <>
                        <div className={classes.errorContainer}>
                            <span className={classes.errorMessage}>
                                {error}
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={classes.rate}>
                            Exchange Rate: {exchangeRate}
                        </div>
                        <div className={classes.conversionResults}>
                            <span>
                                Market Rate:{' '}
                                {convertedAmounts.trueAmount.toFixed(2)}
                            </span>
                            <span>
                                OFX Rate:{' '}
                                {convertedAmounts.markedUpAmount.toFixed(2)}
                            </span>
                        </div>

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
                    </>
                )}
            </div>
        </div>
    );
};

export default Rates;
