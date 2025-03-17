interface ConversionResult {
    trueAmount: number;
    markedUpAmount: number;
}

export const OFX_MARKUP_PERCENTAGE = 0.05;

export const calculateBidirectionalConversion = (
    amount: number,
    exchangeRate: number,
    isFromAmount: boolean
): ConversionResult => {
    if (!amount) return { trueAmount: 0, markedUpAmount: 0 };

    if (isFromAmount) {
        return calculateConversion(amount, exchangeRate);
    } else {
        // For reverse conversion, divide by exchange rate
        const reverseRate = 1 / exchangeRate;
        const amounts = calculateConversion(amount, reverseRate);
        return {
            trueAmount: amounts.trueAmount,
            markedUpAmount: amounts.markedUpAmount,
        };
    }
};

const calculateConversion = (
    amount: number,
    rate: number,
    markup: number = OFX_MARKUP_PERCENTAGE
): ConversionResult => {
    if (!amount || !rate) return { trueAmount: 0, markedUpAmount: 0 };
    const markupAdjustment = rate * (markup / 100);
    const adjustedRate = rate - markupAdjustment;

    return {
        trueAmount: amount * rate,
        markedUpAmount: amount * adjustedRate,
    };
};
