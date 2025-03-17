import React, { useState, useEffect, useRef } from 'react';
import { useAnimationFrame } from '../../Hooks/useAnimationFrame.tsx';

import ProgressBar from '../../Components/ProgressBar/ProgressBar.tsx';
import Loader from '../../Components/Loader/Loader.tsx';
import Flag from '../../Components/Flag/Flag.tsx';
import CurrencyInput from '../../Components/CurrencyInput/CurrencyInput.tsx';

import { ReactComponent as Transfer } from '../../Icons/Transfer.svg';

import classes from './Rates.module.css';

import CountryData from '../../Libs/Countries.json';
import countryToCurrency from '../../Libs/CountryCurrency.json';
import { calculateBidirectionalConversion } from '../../Libs/util.ts';
import { fetchLiveRate } from '../../Services/liveRateService.ts';

let countries = CountryData.CountryCodes;
const isDevelopment = process.env.NODE_ENV === 'development';

interface ConversionAmounts {
    trueAmount: number;
    markedUpAmount: number;
}

export default function Rates() {
    const [fromCurrency, setFromCurrency] = useState<string>('AU');
    const [toCurrency, setToCurrency] = useState<string>('IN');
    const [fromAmount, setFromAmount] = useState<string | number>('1');
    const [toAmount, setToAmount] = useState<string | number>('0');
    const [convertedAmounts, setConvertedAmounts] = useState<ConversionAmounts>(
        {
            trueAmount: 0,
            markedUpAmount: 0,
        }
    );

    const [error, setError] = useState<string | null>(null);

    const [exchangeRate, setExchangeRate] = useState<number>(0.75);
    const [progression, setProgression] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isProgressPaused, setIsProgressPaused] = useState<boolean>(false);

    const hasRecurringApiCalled = useRef(false);
    const hasFetchDataApiCalled = useRef(false);

    const fetchData = async (): Promise<void> => {
        if (!loading) {
            setLoading(true);
            // pause the progress bar
            setIsProgressPaused(true);

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
                // resume the progress bar
                setIsProgressPaused(false);
            }
        }
    };

    const handleFromAmountChange = (value: string, rate: number = 0): void => {
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

    const handleToAmountChange = (value: string): void => {
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

    const recurringApiCallOnly = async (): Promise<void> => {
        if (!loading) {
            setLoading(true);
            try {
                setIsProgressPaused(true);
                const rate = await fetchLiveRate(
                    countryToCurrency[fromCurrency],
                    countryToCurrency[toCurrency]
                );
                if (rate) {
                    setExchangeRate(rate);
                }
                return;
            } catch (error) {
                console.error('Background API call failed');
            } finally {
                setLoading(false);
                setIsProgressPaused(false);
            }
        }
    };

    // Demo progress bar moving :)
    useAnimationFrame(!loading && !isProgressPaused, (deltaTime) => {
        setProgression((prevState) => {
            const newProgress = prevState + deltaTime * 0.0001;

            if (newProgress >= 1) {
                // Make API call
                // Only call if not already in progress
                if (isDevelopment) {
                    if (!hasRecurringApiCalled.current) {
                        hasRecurringApiCalled.current = true;
                        recurringApiCallOnly().finally(() => {
                            hasRecurringApiCalled.current = false;
                        });
                    }
                }
                // Reset progress
                return 0;
            }

            return newProgress;
        });
    });

    // Initial fetch on component mount
    useEffect(() => {
        if (!hasFetchDataApiCalled.current) {
            hasFetchDataApiCalled.current = true;
            fetchData().finally(() => {
                hasFetchDataApiCalled.current = false;
            });
        }
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
                    </>
                )}
                {loading && (
                    <div className={classes.loaderWrapper}>
                        <Loader width={'25px'} height={'25px'} />
                    </div>
                )}
            </div>
        </div>
    );
}
