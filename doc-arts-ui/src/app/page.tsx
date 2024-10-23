'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export type localStorageAccessToken = {
    token: string
    expiresIn: string,
    expiresInDateTime: number
}

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUrl, setAuthUrl] = useState<string>("");
    const [expiresIn, setExpiresIn] = useState<number | null>(null); // To track token expiration time
    const [code, setCode] = useState("")

    const generateAuthUrl = () => {
        const authUrl = new URL(process.env.NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT! + process.env.NEXT_PUBLIC_MEDIAVALET_CONNECT!);
        authUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_MEDIAVALET_CLIENT_ID!);
        authUrl.searchParams.append('redirect_uri', process.env.NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI!);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', 'openid api');
        return authUrl.toString();
    };

    useEffect(() => {
        setAuthUrl(generateAuthUrl());

        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            const accessTokenObject: localStorageAccessToken = JSON.parse(accessToken);
            if(new Date() < new Date(accessTokenObject.expiresInDateTime)){
                setIsAuthenticated(true);
                return;
            }

        }

        setIsAuthenticated(false);
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            exchangeCodeForToken(code);
        }
    }, []);

    // Automatically redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated && authUrl && !code) {
            window.location.replace(authUrl);  // Redirect the user immediately to the login page
        }
    }, [isAuthenticated, authUrl, code]);

    const exchangeCodeForToken = async (code: string) => {
        const tokenEndpoint = process.env.NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT! + process.env.NEXT_PUBLIC_MEDIAVALET_TOKEN!;
        setCode(code)
        try {
            const response = await axios.post(tokenEndpoint, new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: process.env.NEXT_PUBLIC_MEDIAVALET_CLIENT_ID!,
                client_secret: process.env.NEXT_PUBLIC_MEDIAVALET_CLIENT_SECRET!,
                redirect_uri: process.env.NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI!,
            }));

            const data = response.data;

            if (data.access_token) {
                const accessTokenObject: localStorageAccessToken = {
                    token: data.access_token,
                    expiresIn: data.expires_in,
                    expiresInDateTime: new Date().setSeconds(new Date().getSeconds() + (data.expires_in - 60))
                }
                localStorage.setItem('access_token', JSON.stringify(accessTokenObject));
                setIsAuthenticated(true);
                setExpiresIn(data.expires_in);
                window.location.replace('/'); // Redirect to homepage or dashboard after successful authentication
            }
        } catch (error) {
            console.error('Error exchanging code for token:', error);
        }
    };

    useEffect(() => {
        if (expiresIn) {
            const refreshTime = (expiresIn - 600) * 1000; // Refresh 10 minutes before expiration
            const intervalId = window.setInterval(() => {
                localStorage.removeItem('access_token');
                setIsAuthenticated(false);
            }, refreshTime);

            return () => clearInterval(intervalId); // Clean up the interval on unmount
        }
    }, [expiresIn]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h1>Welcome to MediaValet Integration</h1>
            {!isAuthenticated ? (
                <p>Redirecting to login...</p>
            ) : (
                <div>
                    <h3 style={{ marginTop: '10px' }}>You are authenticated!</h3>
                </div>
            )}
        </div>
    );
}
