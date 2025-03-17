interface RateResponse {
    retailRate: number;
    [key: string]: any;
}

interface FetchOptions {
    method: string;
    headers: {
        accept: string;
        'content-type': string;
    };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL: string = 'https://rates.staging.api.paytron.com/rate/public';

export const fetchLiveRate = async (
    fromCurrency: string,
    toCurrency: string
): Promise<number> => {
    try {
        const queryParams = new URLSearchParams({
            sellCurrency: fromCurrency,
            buyCurrency: toCurrency,
        }).toString();

        const options: FetchOptions = {
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

        const data: RateResponse = await response.json();

        // to show the sync between api call and progress bar
        await delay(2000);

        return data.retailRate;
    } catch (error) {
        throw new Error('Error in fetching live rate');
    }
};
