// 'use client'
// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import damService from "@/app/services/damService";
// import damBlobService from "@/app/services/damBlobService";
// import SearchIcon from '@mui/icons-material/Search';
// import { Button } from "@mui/material";
//
// export type localStorageAccessToken = {
//     token: string;
//     expiresIn: string;
//     expiresInDateTime: number;
// };
//
// export default function Home() {
//     const TOTAL_IMAGES = 24;
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [authUrl, setAuthUrl] = useState<string>("");
//     const [expiresIn, setExpiresIn] = useState<number | null>(null);
//     const [code, setCode] = useState("");
//     const [assets, setAssets] = useState<any[]>([]);
//     const [imageUrls, setImageUrls] = useState<string[]>([]);
//     const [loading, setLoading] = useState(false);
//     const containerRef = useRef<HTMLDivElement>(null);
//
//     const generateAuthUrl = () => {
//         const authUrl = new URL(process.env.NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT! + process.env.NEXT_PUBLIC_MEDIAVALET_CONNECT!);
//         authUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_MEDIAVALET_CLIENT_ID!);
//         authUrl.searchParams.append('redirect_uri', process.env.NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI!);
//         authUrl.searchParams.append('response_type', 'code');
//         authUrl.searchParams.append('scope', 'openid api');
//         return authUrl.toString();
//     };
//
//     useEffect(() => {
//         setAuthUrl(generateAuthUrl());
//
//         const accessToken = localStorage.getItem("access_token");
//         if (accessToken) {
//             const accessTokenObject: localStorageAccessToken = JSON.parse(accessToken);
//             if (new Date() < new Date(accessTokenObject.expiresInDateTime)) {
//                 setIsAuthenticated(true);
//                 return;
//             }
//         }
//
//         setIsAuthenticated(false);
//         const urlParams = new URLSearchParams(window.location.search);
//         const code = urlParams.get("code");
//
//         if (code) {
//             exchangeCodeForToken(code);
//         }
//     }, []);
//
//     useEffect(() => {
//         if (!isAuthenticated && authUrl && !code) {
//             window.location.replace(authUrl);
//         }
//     }, [isAuthenticated, authUrl, code]);
//
//     const exchangeCodeForToken = async (code: string) => {
//         const tokenEndpoint = process.env.NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT! + process.env.NEXT_PUBLIC_MEDIAVALET_TOKEN!;
//         setCode(code);
//         try {
//             const response = await axios.post(tokenEndpoint, new URLSearchParams({
//                 grant_type: "authorization_code",
//                 code,
//                 client_id: process.env.NEXT_PUBLIC_MEDIAVALET_CLIENT_ID!,
//                 client_secret: process.env.NEXT_PUBLIC_MEDIAVALET_CLIENT_SECRET!,
//                 redirect_uri: process.env.NEXT_PUBLIC_MEDIAVALET_REDIRECT_URI!,
//             }));
//
//             const data = response.data;
//
//             if (data.access_token) {
//                 const accessTokenObject: localStorageAccessToken = {
//                     token: data.access_token,
//                     expiresIn: data.expires_in,
//                     expiresInDateTime: new Date().setSeconds(new Date().getSeconds() + (data.expires_in - 60)),
//                 };
//                 localStorage.setItem("access_token", JSON.stringify(accessTokenObject));
//                 setIsAuthenticated(true);
//                 setExpiresIn(data.expires_in);
//                 window.location.replace("/"); // Redirect to homepage or dashboard after successful authentication
//             }
//         } catch (error) {
//             console.error("Error exchanging code for token:", error);
//         }
//     };
//
//     useEffect(() => {
//         if (expiresIn) {
//             const refreshTime = (expiresIn - 600) * 1000; // Refresh 10 minutes before expiration
//             const intervalId = window.setInterval(() => {
//                 localStorage.removeItem("access_token");
//                 setIsAuthenticated(false);
//             }, refreshTime);
//
//             return () => clearInterval(intervalId); // Clean up the interval on unmount
//         }
//     }, [expiresIn]);
//
//     const handleImageClick = (asset: any) => {
//         if (asset.categories && asset.categories.length > 0) {
//             const folderId = asset.categories[0]; // Assuming the first category ID is the folder ID
//             window.location.href = `/featured-albums/${folderId}`;
//         } else {
//             console.warn("No folder ID available for this asset.");
//         }
//     };
//
//     const fetchImageData = async () => {
//         if (loading) return; // Prevent fetching if already in progress
//         setLoading(true);
//         let assetArray = assets;
//
//         try {
//             if (assetArray.length === 0) {
//                 const response = await damService.get("/assets?includeSoftDeleted=false");
//                 assetArray = response.data.payload.assets;
//             }
//
//             // Limit the total number of assets to 30
//             assetArray = shuffleArray(assetArray).slice(0, TOTAL_IMAGES);
//
//             // Get URLs for a subset of 30 images
//             const images = assetArray.map((asset: any) => asset.media.small);
//             setAssets(assetArray);
//
//             const imageBlobPromises = images.map(async (image: any) => {
//                 const blobResponse = await damBlobService.get(image, { responseType: "blob" });
//                 return URL.createObjectURL(blobResponse.data);
//             });
//
//             const imageUrlsResolved = await Promise.all(imageBlobPromises);
//             setImageUrls(imageUrlsResolved);
//         } catch (error) {
//             console.error("Error fetching image data:", error);
//         } finally {
//             setLoading(false);
//             console.log("Assets loaded:", assets.length);
//
//
//         }
//     };
//
//     // Helper function to shuffle an array using Fisher-Yates algorithm
//     const shuffleArray = (array: any[]) => {
//         for (let i = array.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [array[i], array[j]] = [array[j], array[i]];
//         }
//         return array;
//     };
//
//     useEffect(() => {
//         const handleScroll = () => {
//             if (containerRef.current) {
//                 const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//                 if (scrollHeight - scrollTop <= clientHeight * 3 && !loading) {
//                     fetchImageData(); // Load more images when the user scrolls near the bottom
//                 }
//             }
//         };
//
//         if (containerRef.current) {
//             containerRef.current.addEventListener("scroll", handleScroll);
//         }
//
//         return () => {
//             if (containerRef.current) {
//                 containerRef.current.removeEventListener("scroll", handleScroll);
//             }
//         };
//     }, [loading]);
//
//     return (
//
//         <div
//             style={{
//                 height: "100vh", // Full screen height
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden", // Prevent scrolling on the container
//             }}
//             ref={containerRef}
//         >
//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Adjust columns based on screen size
//                     gridAutoRows: "250px", // Set fixed height for all rows
//                     gap: "1px", // Small gap between images
//                     height: "100%", // Ensure grid fills the screen height
//                     overflow: "hidden", // Prevent overflow of grid
//                 }}
//             >
//                 {imageUrls.length > 0 ? (
//                     imageUrls.map((imageUrl, index) => (
//                         <img
//                             key={index}
//                             src={imageUrl}
//                             alt={`Image ${index}`}
//                             style={{
//                                 width: "100%", // Ensure images fill the width of their grid cells
//                                 height: "100%", // Ensure images fill the height of their grid cells
//                                 objectFit: "cover", // Ensures images fill the space without stretching, and may crop
//                             }}
//                         />
//                     ))
//                 ) : (
//                     <div
//                         style={{
//                             padding: "10px",
//                             width: "100vw",
//                             textAlign: "center",
//                             paddingTop: "25vh",
//                         }}
//                     >
//                         <h1>Welcome to UTD DocArts Project!{<br />} Please click the button below to start ⬇️</h1>
//                         <Button
//                             style={{
//                                 marginTop: "10px",
//                             }}
//                             variant={"contained"}
//                             onClick={fetchImageData}
//                             disabled={loading} // Disable the button while loading
//                         >
//                             Fetch Images
//                         </Button>
//                         {loading && (
//                             <p>{imageUrls.length === 0 ? "Loading images..." : "Loading more images..."}</p>
//                         )}
//                     </div>
//                 )}
//             </div>
//             <Button
//                 style={{
//                     background: "white",
//                     position: "absolute",
//                     bottom: "25px",
//                     right: "25px",
//                     color: "black",
//                 }}
//                 startIcon={<SearchIcon />}
//                 onClick={() => {
//                     window.location.assign("/featured-albums");
//                 }}
//                 variant={"contained"}
//             >
//                 Explore More
//             </Button>
//         </div>
//     );
// }
'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import damService from "@/app/services/damService";
import damBlobService from "@/app/services/damBlobService";
import SearchIcon from '@mui/icons-material/Search';
import { Button } from "@mui/material";

export type localStorageAccessToken = {
    token: string;
    expiresIn: string;
    expiresInDateTime: number;
};

export default function Home() {
    const TOTAL_IMAGES = 24;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUrl, setAuthUrl] = useState<string>("");
    const [expiresIn, setExpiresIn] = useState<number | null>(null);
    const [code, setCode] = useState("");
    const [assets, setAssets] = useState<any[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            const accessTokenObject: localStorageAccessToken = JSON.parse(accessToken);
            if (new Date() < new Date(accessTokenObject.expiresInDateTime)) {
                setIsAuthenticated(true);
                return;
            }
        }

        setIsAuthenticated(false);
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            exchangeCodeForToken(code);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated && authUrl && !code) {
            window.location.replace(authUrl);
        }
    }, [isAuthenticated, authUrl, code]);

    const exchangeCodeForToken = async (code: string) => {
        const tokenEndpoint = process.env.NEXT_PUBLIC_MEDIAVALET_AUTH_ENDPOINT! + process.env.NEXT_PUBLIC_MEDIAVALET_TOKEN!;
        setCode(code);
        try {
            const response = await axios.post(tokenEndpoint, new URLSearchParams({
                grant_type: "authorization_code",
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
                    expiresInDateTime: new Date().setSeconds(new Date().getSeconds() + (data.expires_in - 60)),
                };
                localStorage.setItem("access_token", JSON.stringify(accessTokenObject));
                setIsAuthenticated(true);
                setExpiresIn(data.expires_in);
                window.location.replace("/"); // Redirect to homepage or dashboard after successful authentication
            }
        } catch (error) {
            console.error("Error exchanging code for token:", error);
        }
    };

    useEffect(() => {
        if (expiresIn) {
            const refreshTime = (expiresIn - 600) * 1000; // Refresh 10 minutes before expiration
            const intervalId = window.setInterval(() => {
                localStorage.removeItem("access_token");
                setIsAuthenticated(false);
            }, refreshTime);

            return () => clearInterval(intervalId); // Clean up the interval on unmount
        }
    }, [expiresIn]);

    const fetchImageData = async () => {
        if (loading || imageUrls.length > 0) return; // Prevent fetching if already in progress or images are already loaded
        setLoading(true);

        let assetArray = assets;

        try {
            if (assetArray.length === 0) {
                const response = await damService.get("/assets?includeSoftDeleted=false");
                assetArray = response.data.payload.assets;
            }

            // Limit the total number of assets to 30
            assetArray = shuffleArray(assetArray).slice(0, TOTAL_IMAGES);

            // Get URLs for a subset of 30 images
            const images = assetArray.map((asset: any) => asset.media.small);
            setAssets(assetArray);

            const imageBlobPromises = images.map(async (image: any) => {
                const blobResponse = await damBlobService.get(image, { responseType: "blob" });
                return URL.createObjectURL(blobResponse.data);
            });

            const imageUrlsResolved = await Promise.all(imageBlobPromises);
            setImageUrls(imageUrlsResolved);
        } catch (error) {
            console.error("Error fetching image data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle image click
    const handleImageClick = (asset: any) => {
        if (asset.categories && asset.categories.length > 0) {
            const folderId = asset.categories[0]; // Assuming the first category ID is the folder ID
            const imageUrl = asset.media.large; // Assuming you want to display the 'large' image
            // Navigate to the featured-albums page and pass the folderId and imageUrl
            window.location.href = `/featured-albums/${folderId}?imageUrl=${encodeURIComponent(imageUrl)}`;
            //window.location.href = `/featured-albums/${folderId}`;
        } else {
            console.warn("No folder ID available for this asset.");
        }
    };

    // Helper function to shuffle an array using Fisher-Yates algorithm
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
                if (scrollHeight - scrollTop <= clientHeight * 3 && !loading) {
                    fetchImageData(); // Load more images when the user scrolls near the bottom
                }
            }
        };

        if (containerRef.current) {
            containerRef.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading]);

    return (
        <div
            style={{
                height: "100vh", // Full screen height
                display: "flex",
                flexDirection: "column",
                overflow: "hidden", // Prevent scrolling on the container
                backgroundColor: "#152238", // Set background to black

            }}
            ref={containerRef}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Dynamic columns
                    gridAutoRows: "300px", // Consistent row height for all images
                    gap: "10px", // Gap between images for clean spacing
                    padding: "10px", // Add some padding around the grid
                    backgroundColor: "#152238", // Light background for better contrast
                    height: "100vh",
                    overflowY: "auto", // Enable scrolling for the grid
                }}
            >
                {imageUrls.length > 0 ? (
                    imageUrls.map((imageUrl, index) => (
                        <div
                            key={index}
                            style={{
                                width: "100%",
                                height: "100%",
                                overflow: "hidden", // Prevent content overflow
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={`Image ${index}`}
                                style={{
                                    width: "100%", // Fill the grid cell width
                                    height: "100%", // Fill the grid cell height
                                    objectFit: "cover", // Ensure the image covers its grid cell
                                    borderRadius: "5px", // Optional: add rounded corners
                                    cursor: "pointer", // Indicate clickability
                                }}
                                onClick={() => handleImageClick(assets[index])} // Navigate on click
                            />
                        </div>
                    ))
                ) : (
                    <div
                        style={{
                            padding: "10px",
                            width: "100vw",
                            textAlign: "center",
                            paddingTop: "25vh",
                        }}
                    >
                        <h1 style={{ color: "white" }}>
                            Welcome to UTD DocArts Project!<br /> Please click the button below to start ⬇️
                        </h1>
                        <Button
                            style={{
                                marginTop: "10px",
                                background: "#577C9A",
                                color: "white",
                                boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.4)", // Corrected syntax
                            }}
                            variant={"contained"}
                            onClick={fetchImageData}
                            disabled={loading} // Disable the button while loading
                        >
                            Fetch Images
                        </Button>
                        {loading && (
                            <p>{imageUrls.length === 0 ? "Loading images..." : "Loading more images..."}</p>
                        )}
                    </div>
                )}
            </div>

            <Button
                style={{
                    background: "#577C9A",
                    position: "absolute",
                    bottom: "25px",
                    right: "25px",
                    color: "white",
                    boxShadow: "15px 15px 15px rgba(0, 0, 0, 0.4)", // Corrected syntax
                }}
                startIcon={<SearchIcon />}
                onClick={() => {
                    window.location.assign("/featured-albums");
                }}
                variant={"contained"}
            >
                Explore More
            </Button>
        </div>
    );
}
