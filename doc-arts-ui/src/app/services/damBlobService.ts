import axios from 'axios';

// Create a custom Axios instance
const dam = axios.create({
    timeout: 5000,
});

// Add a request interceptor
dam.interceptors.request.use(
    (config) => {
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
dam.interceptors.response.use(
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
export default dam;
