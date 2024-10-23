import axios from "axios";

// Create a custom Axios instance
const damService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_MEDIAVALET_BASE_URL, // Set the base URL
    timeout: 5000, // Optional timeout for requests
    headers: {
        'Content-Type': 'application/json',
        'x-mv-api-version': '1.1', // Default MediaValet API version
        'Accept': 'application/json', // Default accept header for JSON
    },
});

// Add a request interceptor
damService.interceptors.request.use(
    (config) => {
        // Attach the token (if available) to the Authorization header
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else{
            window.location.assign('http://localhost:3000')
        }

        // Add the Ocp-Apim-Subscription-Key to the headers
        const subscriptionKey = process.env.NEXT_PUBLIC_MEDIAVALET_SUBSCRIPTION_KEY;
        if (subscriptionKey) {
            config.headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
        }

        console.log('Request made with headers:', config.headers);
        return config;
    },
    (error) => {
        // Handle request errors
        console.error('Error in request:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
damService.interceptors.response.use(
    (response) => {
        console.log('Response received:', response);
        return response;
    },
    (error) => {
        // Handle response errors (e.g., token expiration, network issues)
        if (error.response?.status === 401) {
            console.error('Unauthorized! Token might be expired.');
            // Redirect to login or refresh the token
            window.location.assign('http://localhost:3000')
        } else {
            console.error('Error in response:', error);
        }
        return Promise.reject(error);
    }
);

// Export the custom instance for use in your app
export default damService;
