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

const Rates = () => {
    const [fromCurrency, setFromCurrency] = useState('AU');
    const [toCurrency, setToCurrency] = useState('US');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
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
                    handleFromAmountChange(fromAmount, rate);
                }
            } catch (error) {
                setError(`${error}, please try again later`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFromAmountChange = (value, rate = 0) => {
        const formValue = Number(value);

        setFromAmount(formValue);
        if (formValue) {
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
        const toValue = Number(value);

        setToAmount(toValue);
        if (toValue) {
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

    // Demo progress bar moving :)
    useAnimationFrame(!loading, (deltaTime) => {
        setProgression((prevState) => {
            if (prevState > 0.998) {
                // fetchData();
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
