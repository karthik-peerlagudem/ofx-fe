const API_URL = 'https://rates.staging.api.paytron.com/rate/public';

export const fetchLiveRate = async (fromCurrency, toCurrency) => {
    try {
        const queryParams = new URLSearchParams({
            sellCurrency: fromCurrency,
            buyCurrency: toCurrency,
        }).toString();

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
        };

        const response = await fetch(`${API_URL}?${queryParams}`, options);

        if (!response.ok) {
            throw new Error('Error in fetching live rate');
        }

        const data = await response.json();
        return data.retailRate;
    } catch (error) {
        throw new Error('Error in fetching live rate');
    }
};
