export const OFX_MARKUP_PERCENTAGE = 0.05;

export const calculateBidirectionalConversion = (
    amount,
    exchangeRate,
    isFromAmount
) => {
    if (!amount) return { trueAmount: 0, markedUpAmount: 0 };

    if (isFromAmount) {
        return calculateConversion(Number(amount), exchangeRate);
    } else {
        // For reverse conversion, divide by exchange rate
        const reverseRate = 1 / exchangeRate;
        const amounts = calculateConversion(Number(amount), reverseRate);
        return {
            trueAmount: amounts.trueAmount,
            markedUpAmount: amounts.markedUpAmount,
        };
    }
};

const calculateConversion = (amount, rate, markup = OFX_MARKUP_PERCENTAGE) => {
    if (!amount || !rate) return { trueAmount: 0, markedUpAmount: 0 };
    const markupAdjustment = rate * (markup / 100);
    const adjustedRate = rate - markupAdjustment;

    return {
        trueAmount: amount * rate,
        markedUpAmount: amount * adjustedRate,
    };
};
