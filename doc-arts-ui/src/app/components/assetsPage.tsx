'use client';
import React, { useEffect, useState } from "react";
import DamService from "@/app/services/damService";
import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

interface Asset {
    id: string;
    name?: string; // Optional asset name
    media: {
        small: string;
        large: string;
    };
    keywords?: string[]; // Keywords to filter the assets
}

export const AssetsPage = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
    const [albumName, setAlbumName] = useState<string>(""); // State for album name
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => {
        setModalOpen(false);
        setCurrentImage("");
    };

    // Fetch album name and assets
    useEffect(() => {
        const fetchAlbumDetails = async (): Promise<void> => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null); // Reset error state before fetching

                // Fetch album details
                const albumResponse = await DamService.get<any>(`categories/${id}`);
                const album = albumResponse?.data?.payload || {};
                setAlbumName(album.name || "Unknown Album"); // Set album name

                // Fetch assets
                const assetsResponse = await DamService.get<any>(`categories/${id}/assets`);
                const fetchedAssets = assetsResponse?.data?.payload?.assets || [];
                setAssets(fetchedAssets);
                setFilteredAssets(fetchedAssets); // Initially show all assets
            } catch (err) {
                console.error("Error fetching album or assets:", err);
                setError("Failed to load album details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [id]);

    // Filter assets dynamically based on the search term
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm?.toLowerCase() || "";

        if (!lowerCaseSearchTerm) {
            setFilteredAssets(assets); // Show all assets if no search term
        } else {
            const filtered = assets.filter((asset) =>
                asset.name?.toLowerCase().includes(lowerCaseSearchTerm) || // Match in asset name
                asset.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerCaseSearchTerm)) // Match in keywords
            );
            setFilteredAssets(filtered);
        }
    }, [searchTerm, assets]);

    return (
        <div style={{ padding: "20px", backgroundColor: "#152238", color: "white" }}>
            <Button
                onClick={() => window.location.assign("/featured-albums")}
                style={{
                    backgroundColor: "#577C9A",
                    color: "white",
                    marginBottom: "20px",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Back to Featured Albums
            </Button>

            {/* Album Name */}
            <Typography
                variant="h4"
                style={{
                    marginBottom: "20px",
                    marginTop: "0px",
                    textAlign: "center",
                    color: "white",
                    // fontWeight: "bold",
                    fontSize: "2rem", // Larger font size for emphasis
                    letterSpacing: "1px", // Adds slight spacing between letters
                    // textTransform: "uppercase", // Makes the text appear in uppercase for style
                    lineHeight: "1", // Ensures proper spacing between lines if album name is long
                }}
            >
                {albumName}
            </Typography>

            <div style={{ marginBottom: "20px" }}>
                <TextField
                    variant="outlined"
                    placeholder="Search assets"
                    value={searchTerm || ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginRight: "10px", backgroundColor: "white", borderRadius: "5px", width: "100%" }}
                />
            </div>

            {loading ? (
                <Grid container style={{ justifyContent: "center" }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            height={"250px"}
                            width={"400px"}
                            sx={{ backgroundColor: "dimgray", margin: "1px" }}
                        />
                    ))}
                </Grid>
            ) : error ? (
                <Typography style={{ color: "red", textAlign: "center" }}>{error}</Typography>
            ) : filteredAssets.length > 0 ? (
                <Grid container spacing={0} style={{ margin: 0 }}>
                    {filteredAssets.map((asset) => (
                        <Grid item xs={12} sm={4} key={asset.id} style={{ padding: 0 }}>
                            <div
                                onClick={() => {
                                    handleOpen();
                                    setCurrentImage(asset.media.large);
                                }}
                            >
                                <img
                                    src={asset.media.large}
                                    alt={asset.name || "Asset"}
                                    style={{
                                        width: "100%",
                                        height: "250px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                    }}
                                />
                            </div>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography style={{ textAlign: "center", color: "white" }}>
                    No assets found.
                </Typography>
            )}

            <Modal
                keepMounted
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        boxShadow: 24,
                    }}
                >
                    <img
                        src={currentImage}
                        alt={"Large Image"}
                        style={{
                            width: "100%",
                            height: "80vh",
                            objectFit: "cover",
                            borderRadius: "5px",
                        }}
                    />
                </Box>
            </Modal>
        </div>
    );
};

// 'use client';
//
// import React, { useEffect, useState } from "react";
// import DamService from "@/app/services/damService";
// import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
// import Modal from '@mui/material/Modal';
//
// interface Asset {
//     id: string;
//     name?: string; // Optional asset name
//     media: {
//         small: string;
//         large: string;
//     };
//     keywords?: string[]; // Keywords to filter the assets
// }
//
// export const AssetsPage = ({ id }: { id: string }) => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [assets, setAssets] = useState<Asset[]>([]);
//     const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [modalOpen, setModalOpen] = useState(false);
//     const [currentImage, setCurrentImage] = useState<string>("");
//     const [error, setError] = useState<string | null>(null);
//
//     const handleOpen = () => setModalOpen(true);
//     const handleClose = () => {
//         setModalOpen(false);
//         setCurrentImage("");
//     };
//
//     // Fetch assets from the API
//     useEffect(() => {
//         const fetchAssets = async (): Promise<void> => {
//             if (!id) return;
//             try {
//                 setLoading(true);
//                 setError(null); // Reset error state before fetching
//
//                 const response = await DamService.get<any>(`categories/${id}/assets`);
//                 console.log("API Response:", response); // Debugging API response
//
//                 const fetchedAssets = response?.data?.payload?.assets || [];
//                 console.log("Fetched Assets:", fetchedAssets); // Debug fetched assets
//                 setAssets(fetchedAssets);
//                 setFilteredAssets(fetchedAssets); // Initially show all assets
//             } catch (err) {
//                 console.error("Error fetching assets:", err);
//                 setError("Failed to load assets. Please try again later.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchAssets();
//     }, [id]);
//
//     // Filter assets dynamically based on the search term
//     useEffect(() => {
//         const lowerCaseSearchTerm = searchTerm?.toLowerCase() || "";
//
//         if (!lowerCaseSearchTerm) {
//             setFilteredAssets(assets); // Show all assets if no search term
//         } else {
//             const filtered = assets.filter((asset) =>
//                 asset.name?.toLowerCase().includes(lowerCaseSearchTerm) || // Match in asset name
//                 asset.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerCaseSearchTerm)) // Match in keywords
//             );
//             setFilteredAssets(filtered);
//         }
//     }, [searchTerm, assets]);
//
//     return (
//         <div style={{ padding: "20px", backgroundColor: "#152238", color: "white" }}>
//             <Button
//                 onClick={() => window.location.assign("/featured-albums")}
//                 style={{
//                     backgroundColor: "#577C9A",
//                     color: "white",
//                     marginBottom: "20px",
//                     padding: "10px 20px",
//                     borderRadius: "5px",
//                     border: "none",
//                     cursor: "pointer"
//                 }}
//             >
//                 Back to Featured Albums
//             </Button>
//
//             <div style={{ marginBottom: "20px" }}>
//                 <TextField
//                     variant="outlined"
//                     placeholder="Search assets"
//                     value={searchTerm || ""}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ marginRight: "10px", backgroundColor: "white", borderRadius: "5px", width: "100%" }}
//                 />
//             </div>
//
//             {loading ? (
//                 <Grid container style={{ justifyContent: "center" }}>
//                     {Array.from({ length: 5 }).map((_, index) => (
//                         <Skeleton
//                             key={index}
//                             variant="rectangular"
//                             height={"250px"}
//                             width={"400px"}
//                             sx={{ backgroundColor: "dimgray", margin: "1px" }}
//                         />
//                     ))}
//                 </Grid>
//             ) : error ? (
//                 <Typography style={{ color: "red", textAlign: "center" }}>{error}</Typography>
//             ) : filteredAssets.length > 0 ? (
//                 <Grid container spacing={0} style={{ margin: 0 }}>
//                     {filteredAssets.map((asset) => (
//                         <Grid item xs={12} sm={4} key={asset.id} style={{ padding: 0 }}>
//                             <div
//                                 onClick={() => {
//                                     handleOpen();
//                                     setCurrentImage(asset.media.large);
//                                 }}
//                             >
//                                 <img
//                                     src={asset.media.large}
//                                     alt={asset.name || "Asset"}
//                                     style={{
//                                         width: "100%",
//                                         height: "250px",
//                                         objectFit: "cover",
//                                         borderRadius: "5px",
//                                     }}
//                                 />
//                             </div>
//                         </Grid>
//                     ))}
//                 </Grid>
//             ) : (
//                 <Typography style={{ textAlign: "center", color: "white" }}>
//                     No assets found.
//                 </Typography>
//             )}
//
//             <Modal
//                 keepMounted
//                 open={modalOpen}
//                 onClose={handleClose}
//                 aria-labelledby="keep-mounted-modal-title"
//                 aria-describedby="keep-mounted-modal-description"
//             >
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         boxShadow: 24
//                     }}
//                 >
//                     <img
//                         src={currentImage}
//                         alt={"Large Image"}
//                         style={{
//                             width: "100%",
//                             height: "80vh",
//                             objectFit: "cover",
//                             borderRadius: "5px"
//                         }}
//                     />
//                 </Box>
//             </Modal>
//         </div>
//     );
// };

// 'use client';
//
// import React, { useEffect, useState } from "react";
// import DamService from "@/app/services/damService";
// import { Box, Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
// import Modal from '@mui/material/Modal';
//
// interface Asset {
//     id: string;
//     name?: string; // Make name optional to handle missing names
//     media: {
//         small: string;
//         large: string;
//     };
// }
//
// export const AssetsPage = ({ id }: { id: string }) => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [assets, setAssets] = useState<Asset[]>([]);
//     const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [modalOpen, setModalOpen] = useState(false);
//     const [currentImage, setCurrentImage] = useState<string>("");
//     const [error, setError] = useState<string | null>(null);
//
//     const handleOpen = () => setModalOpen(true);
//     const handleClose = () => {
//         setModalOpen(false);
//         setCurrentImage("");
//     };
//
//     // Fetch assets from the API
//     useEffect(() => {
//         const fetchAssets = async (): Promise<void> => {
//             if (!id) return;
//             try {
//                 setLoading(true);
//                 setError(null); // Reset error state before fetching
//
//                 const response = await DamService.get<any>(`categories/${id}/assets`);
//                 console.log("API Response:", response); // Debugging API response
//
//                 const fetchedAssets = response?.data?.payload?.assets || [];
//                 console.log("Fetched Assets:", fetchedAssets); // Debug fetched assets
//                 setAssets(fetchedAssets);
//                 setFilteredAssets(fetchedAssets); // Initially show all assets
//             } catch (err) {
//                 console.error("Error fetching assets:", err);
//                 setError("Failed to load assets. Please try again later.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchAssets();
//     }, [id]);
//
//     // Filter assets dynamically based on the search term
//     useEffect(() => {
//         const lowerCaseSearchTerm = searchTerm?.toLowerCase() || ""; // Safely handle undefined searchTerm
//         if (!lowerCaseSearchTerm) {
//             setFilteredAssets(assets); // Show all assets when search term is empty
//         } else {
//             const filtered = assets.filter(
//                 (asset) =>
//                     asset.name?.toLowerCase().includes(lowerCaseSearchTerm) // Safely handle undefined asset.name
//             );
//             setFilteredAssets(filtered);
//         }
//     }, [searchTerm, assets]);
//
//     return (
//         <div style={{ padding: "20px", backgroundColor: "#152238", color: "white" }}>
//             <Button
//                 onClick={() => window.location.assign("/featured-albums")}
//                 style={{
//                     backgroundColor: "#577C9A",
//                     color: "white",
//                     marginBottom: "20px",
//                     padding: "10px 20px",
//                     borderRadius: "5px",
//                     border: "none",
//                     cursor: "pointer"
//                 }}
//             >
//                 Back to Featured Albums
//             </Button>
//
//             <div style={{ marginBottom: "20px" }}>
//                 <TextField
//                     variant="outlined"
//                     placeholder="Search assets"
//                     value={searchTerm || ""}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ marginRight: "10px", backgroundColor: "white", borderRadius: "5px", width: "100%" }}
//                 />
//             </div>
//
//             {loading ? (
//                 <Grid container style={{ justifyContent: "center" }}>
//                     {Array.from({ length: 5 }).map((_, index) => (
//                         <Skeleton
//                             key={index}
//                             variant="rectangular"
//                             height={"250px"}
//                             width={"400px"}
//                             sx={{ backgroundColor: "dimgray", margin: "1px" }}
//                         />
//                     ))}
//                 </Grid>
//             ) : error ? (
//                 <Typography style={{ color: "red", textAlign: "center" }}>{error}</Typography>
//             ) : filteredAssets.length > 0 ? (
//                 <Grid container spacing={0} style={{ margin: 0 }}>
//                     {filteredAssets.map((asset) => (
//                         <Grid item xs={12} sm={4} key={asset.id} style={{ padding: 0 }}>
//                             <div
//                                 onClick={() => {
//                                     handleOpen();
//                                     setCurrentImage(asset.media.large);
//                                 }}
//                             >
//                                 <img
//                                     src={asset.media.large}
//                                     alt={asset.name || "Asset"}
//                                     style={{
//                                         width: "100%",
//                                         height: "250px",
//                                         objectFit: "cover",
//                                         borderRadius: "5px"
//                                     }}
//                                 />
//                             </div>
//                         </Grid>
//                     ))}
//                 </Grid>
//
//             ) : (
//                 <Typography style={{ textAlign: "center", color: "white" }}>
//                     No assets found.
//                 </Typography>
//             )}
//
//             <Modal
//                 keepMounted
//                 open={modalOpen}
//                 onClose={handleClose}
//                 aria-labelledby="keep-mounted-modal-title"
//                 aria-describedby="keep-mounted-modal-description"
//             >
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         boxShadow: 24
//                     }}
//                 >
//                     <img
//                         src={currentImage}
//                         alt={"Large Image"}
//                         style={{
//                             width: "100%",
//                             height: "80vh",
//                             objectFit: "cover",
//                             borderRadius: "5px"
//                         }}
//                     />
//                 </Box>
//             </Modal>
//         </div>
//     );
// };
//
//
// 'use client';
//
// import React, { useEffect, useState, FC } from "react";
// import DamService from "@/app/services/damService";
// import {Box, Button, Grid, Skeleton, Typography} from "@mui/material";
// import Modal from '@mui/material/Modal';
//
// interface Asset {
//     id: string;
//     name: string;
//     media: {
//         small: string;
//         large: string;
//     };
// }
//
// interface AssetsResponse {
//     data?: {
//         payload?: {
//             assets?: Asset[];
//         };
//     };
// }
//
// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     boxShadow: 24,
// };
//
// export const AssetsPage = ({id}: {id: string}) => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [assets, setAssets] = useState<Asset[]>([]);
//
//     const [modalOpen, setModalOpen] = React.useState(false);
//     const handleOpen = () => setModalOpen(true);
//     const handleClose = () => {
//         setModalOpen(false);
//         setCurrentImage("")
//     };
//
//     const [currentImage, setCurrentImage] = useState<string>()
//
//     useEffect(() => {
//         const fetchAssets = async (): Promise<void> => {
//             if (!id) return;
//             try {
//                 setLoading(true);
//                 const response = await DamService.get<AssetsResponse>(`categories/${id}/assets`);
//
//                 const fetchedAssets = (response.data as AssetsResponse["data"])?.payload?.assets || [];
//                 setAssets(fetchedAssets);
//             } catch (error) {
//                 console.error("Error fetching assets:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchAssets();
//     }, [id]);
//
//     const buttonStyle: React.CSSProperties = {
//         backgroundColor: "#577C9A",
//         color: "white",
//         marginBottom: "20px",
//         padding: "10px 20px",
//         borderRadius: "5px",
//         border: "none",
//         cursor: "pointer"
//     };
//
//     const imgStyle: React.CSSProperties = {
//         width: "100%",
//         height: "250px",
//         objectFit: "cover",
//         borderRadius: "5px"
//     };
//     const imglargeStyle: React.CSSProperties = {
//         width: "100%",
//         height: "80vh",
//         objectFit: "cover",
//         borderRadius: "5px"
//     };
//     return (
//         <div style={{ padding: "20px", backgroundColor: "#152238", color: "white" }}>
//             <Button
//                 onClick={() => window.location.assign("/featured-albums")}
//                 style={buttonStyle}
//             >
//                 Back to Featured Albums
//             </Button>
//             {loading ? (
//                 <Grid container style={{justifyContent: "center"}}>
//                     {Array.from({ length: 5 }).map((_, index) => (
//                         <Skeleton variant="rectangular" height={"250px"} width={"400px"} sx={{ backgroundColor: "dimgray", margin: '1px' }} />
//                     ))}
//                 </Grid>
//             ) : (
//                 <Grid container spacing={0} style={{ margin: 0 }}>
//                     {assets.map((asset) => (
//                         <Grid item xs={12} sm={4} key={asset.id} style={{ padding: 0 }}>
//                             <div onClick={() => {
//                                 handleOpen();
//                                 setCurrentImage(asset.media.large)
//                             }}>
//                                 <img
//                                     src={asset.media.large}
//                                     alt={asset.name}
//                                     style={imgStyle}
//                                 />
//                                 <h4 style={{ color: "white" }}>{asset.name}</h4>
//                             </div>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}
//             <Modal
//                 keepMounted
//                 open={modalOpen}
//                 onClose={handleClose}
//                 aria-labelledby="keep-mounted-modal-title"
//                 aria-describedby="keep-mounted-modal-description"
//             >
//                 <Box sx={style}>
//                     <img
//                         src={currentImage}
//                         alt={"Large Image"}
//                         style={imglargeStyle}
//                     />
//                 </Box>
//             </Modal>
//         </div>
//     )
// }