
# Next.js Project with MediaValet Integration

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install all the dependencies:

```bash
npm install
```

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How the Login Works

The application uses a login mechanism integrated with the MediaValet API. When users first access the application, the system checks for an existing `access_token` stored in the `localStorage`. If the token is missing or expired, the user is redirected to MediaValet's authentication endpoint to log in.

### Key Login Steps:
1. **Authorization URL Generation**: The URL is dynamically generated using the `client_id`, `redirect_uri`, and necessary OAuth parameters.
2. **Token Exchange**: After logging in, MediaValet redirects the user back with an authorization code. This code is exchanged for an `access_token` using the `damService`.
3. **Access Token Storage**: The received token is securely stored in `localStorage` and is used in subsequent API requests for authentication.

The login logic is handled within the `Home` component using React's `useEffect` to initiate the process automatically if the user is not authenticated.

## damService and damBlobService

The project uses two Axios instances to communicate with the MediaValet API: `damService` and `damBlobService`.

### damService

The `damService` is a custom Axios instance that acts as middleware for all standard API calls (e.g., `GET`, `POST`, `PATCH`, `PUT`, `DELETE`). It automatically attaches required headers such as:

- **Authorization**: Includes the Bearer token from `localStorage` (`Bearer ACCESS_TOKEN`).
- **Ocp-Apim-Subscription-Key**: This is a key used for API access and is configured via environment variables.
- **x-mv-api-version**: Specifies the MediaValet API version, set to `1.1`.
- **Accept**: Set to `application/json` for JSON responses.

Usage of `damService` is straightforward:

```ts
import dam from './damService';

// Making a GET request
const fetchAssets = async () => {
    const response = await dam.get('/assets');
    return response.data;
};

// Making a POST request
const createAsset = async (assetData) => {
    const response = await dam.post('/assets', assetData);
    return response.data;
};
```

### damBlobService

The `damBlobService` is similar to `damService` but is used for handling binary data (Blobs), such as file downloads. It is configured with `responseType: 'blob'` to ensure that Axios processes responses as binary data.

This is typically used for downloading media files or other assets:

```ts
import damBlob from './damBlobService';

// Making a request to download a file as a Blob
const downloadFile = async (fileId) => {
    const response = await damBlob.get(`/assets/${fileId}/download`);
    const blob = response.data;

    // Create a link to download the blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filename.ext');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
```

## Environment Variables Setup

To configure the application for your specific MediaValet environment, you need to update the `.env.local` file with the following variables:

```
NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT=<MediaValet OAuth2 Authorization URL>
NEXT_PUBLIC_MEDIAVALET_TOKEN=<MediaValet Token Endpoint>
NEXT_PUBLIC_MEDIAVALET_CLIENT_ID=<Your MediaValet Client ID>
NEXT_PUBLIC_MEDIAVALET_CLIENT_SECRET=<Your MediaValet Client Secret>
NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI=<Your Redirect URI after successful login>
NEXT_PUBLIC_MEDIAVALET_SUBSCRIPTION_KEY=<Your MediaValet Subscription Key>
NEXT_PUBLIC_MEDIAVALET_CONNECT=<MediaValet OAuth2 Connect Path>
NEXT_PUBLIC_MEDIAVALET_BASE_URL=<MediaValet API Base URL>
```

### Key Variables:
- **NEXT_PUBLIC_MEDIAVALET_CLIENT_ID**: The client ID assigned to your MediaValet application.
- **NEXT_PUBLIC_MEDIAVALET_CLIENT_SECRET**: The secret associated with your MediaValet application.
- **NEXT_PUBLIC_MEDIAVALET_SUBSCRIPTION_KEY**: This is the key provided by MediaValet for accessing their API.
- **NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT**: The OAuth2 authorization endpoint provided by MediaValet.
- **NEXT_PUBLIC_MEDIAVALET_TOKEN**: The token endpoint for exchanging the authorization code for an access token.
- **NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI**: The URI where the user is redirected after login. Make sure this matches the value configured in your MediaValet app settings.

Example `.env.local` file:

```
NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT=https://example.mediavalet.com/oauth2/authorize
NEXT_PUBLIC_MEDIAVALET_TOKEN=https://example.mediavalet.com/oauth2/token
NEXT_PUBLIC_MEDIAVALET_CLIENT_ID=your-client-id
NEXT_PUBLIC_MEDIAVALET_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_MEDIAVALET_SUBSCRIPTION_KEY=your-subscription-key
NEXT_PUBLIC_MEDIAVALET_CONNECT=/connect/authorize
NEXT_PUBLIC_MEDIAVALET_BASE_URL=https://api.mediavalet.com
```
