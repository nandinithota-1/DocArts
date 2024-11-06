"use client";
import React, { useEffect, useState } from "react";
import DamService from "@/app/services/damService";
import { Box, Button, IconButton, Skeleton } from "@mui/material";
import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
import ArrowCircleRightSharpIcon from "@mui/icons-material/ArrowCircleRightSharp";
import damBlobService from "@/app/services/damBlobService";

interface FolderObject {
    authorName: string;
    subFolders: {
        folderId: string;
        folderName: string;
        assets: any[];
        firstImage: string;
    }[];
}

const handleSubfolderClick = (subFolder) => {
    // Assuming the assets page is named 'assets-page.tsx'
    window.location.href = `/assets-page?id=${subFolder.folderId}`; // Change subFolder.id to subFolder.folderId
};

export default function FeaturedAlbums() {
    const [loading, setLoading] = useState(true);
    const [folders, setFolders] = useState<FolderObject[]>([]);
    const [startIndices, setStartIndices] = useState<number[]>([]);
    const pageSize = 4;

    const handlePrev = (index: number) => {
        setStartIndices((prevIndices) => {
            const updatedIndices = [...prevIndices];
            updatedIndices[index] = Math.max(0, updatedIndices[index] - pageSize);
            return updatedIndices;
        });
    };

    const handleNext = (index: number, folder: FolderObject) => {
        setStartIndices((prevIndices) => {
            const updatedIndices = [...prevIndices];
            updatedIndices[index] = Math.min(folder.subFolders.length - pageSize, updatedIndices[index] + pageSize);
            return updatedIndices;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const resp = await DamService.get("folders/db5f8d55-361f-47bd-9e8d-5dac38189fcb/subfolders");
                const folderData = await Promise.all(
                    resp.data.payload.map(async (folder: any) => {
                        const response = await DamService.get(`folders/${folder.id}/subfolders`);
                        const subFolders = await Promise.all(
                            response.data.payload.map(async (subFolder: any) => {
                                const assetsResp = await DamService.get(`categories/${subFolder.id}/assets`);
                                const image = assetsResp.data.payload.assets[0].media.small;
                                const blobResponse = await damBlobService.get(image, { responseType: "blob" });
                                const firstImage = URL.createObjectURL(blobResponse.data);
                                return {
                                    folderId: subFolder.id,
                                    folderName: subFolder.name,
                                    assets: assetsResp.data.payload.assets,
                                    firstImage: firstImage,
                                };
                            })
                        );
                        return { authorName: folder.name, subFolders };
                    })
                );

                setFolders(folderData);
                setStartIndices(new Array(folderData.length).fill(0));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ height: "200vh", width: "100vw", padding: "20px", background: "black", color: "white" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ color: "white" }}>Featured Albums</h1>
                    <h2 style={{ color: "white" }}>Select one of the following folders to view images.</h2>
                </div>
                <Button
                    style={{ background: "white", color: "black", height: "40px" }}
                    onClick={() => window.location.assign("/")}
                >
                    Back to art wall
                </Button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                {loading ? (
                    <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Skeleton width="10%" height="30px" sx={{ background: "dimgray" }} />
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px",
                                overflowX: "auto",
                                width: "100vw",
                                whiteSpace: "nowrap",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconButton disabled>
                                <ArrowCircleLeftSharpIcon style={{ color: "white" }} />
                            </IconButton>
                            {Array(4)
                                .fill(null)
                                .map((_, index) => (
                                    <Box key={index} sx={{ width: "300px", padding: "20px", border: "white 2px solid", borderRadius: "10px" }}>
                                        <Skeleton variant="rectangular" height={250} sx={{ background: "dimgray", borderRadius: "10px" }} />
                                        <Box sx={{ pt: 0.5 }}>
                                            <Skeleton width="80%" sx={{ background: "dimgray" }} />
                                            <Skeleton width="60%" sx={{ background: "dimgray" }} />
                                        </Box>
                                    </Box>
                                ))}
                            <IconButton disabled>
                                <ArrowCircleRightSharpIcon style={{ color: "white" }} />
                            </IconButton>
                        </div>
                    </div>
                ) : (
                    <div>
                        {folders.map((folder, folderIndex) => {
                            if (folder.subFolders.length > 0) {
                                const startIndex = startIndices[folderIndex];
                                const endIndex = startIndex + pageSize;

                                return (
                                    <div
                                        key={folder.authorName}
                                        style={{
                                            marginTop: "30px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h2 style={{ color: "white" }}>{folder.authorName}</h2>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                marginTop: "10px",
                                                overflowX: "auto",
                                                width: "100vw",
                                                whiteSpace: "nowrap",
                                                alignItems: "center",
                                            }}
                                        >
                                            <IconButton onClick={() => handlePrev(folderIndex)} disabled={startIndex === 0}>
                                                <ArrowCircleLeftSharpIcon style={{ color: "white" }} />
                                            </IconButton>

                                            {folder.subFolders.slice(startIndex, endIndex).map((subFolder) => (
                                                <div
                                                    key={subFolder.folderId}
                                                    onClick={() => handleSubfolderClick(subFolder)} // Add the click handler here
                                                    style={{
                                                        width: "300px",
                                                        padding: "20px",
                                                        border: "white 2px solid",
                                                        borderRadius: "10px",
                                                        flex: "0 0 auto",
                                                        cursor: "pointer", // Change cursor to pointer for better UX
                                                    }}
                                                >
                                                    <img
                                                        src={subFolder.firstImage}
                                                        alt={subFolder.folderName}
                                                        height={250}
                                                        width={250}
                                                        style={{
                                                            objectFit: "cover",
                                                            objectPosition: "top left",
                                                            borderRadius: "5px",
                                                        }}
                                                    />
                                                    <Box sx={{ pt: 0.5 }}>
                                                        <h4 style={{ color: "white" }}>{subFolder.folderName}</h4>
                                                        <h5 style={{ color: "white" }}>{subFolder.assets.length} images</h5>
                                                    </Box>
                                                </div>
                                            ))}

                                            <IconButton onClick={() => handleNext(folderIndex, folder)} disabled={endIndex >= folder.subFolders.length}>
                                                <ArrowCircleRightSharpIcon style={{ color: "white" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
// "use client";
// import React, { useEffect, useState } from "react";
// import DamService from "@/app/services/damService";
// import { Box, Button, IconButton, Skeleton } from "@mui/material";
// import ArrowCircleLeftSharpIcon from "@mui/icons-material/ArrowCircleLeftSharp";
// import ArrowCircleRightSharpIcon from "@mui/icons-material/ArrowCircleRightSharp";
// import damBlobService from "@/app/services/damBlobService";
//
// interface FolderObject {
//     authorName: string;
//     subFolders: {
//         folderId: string;
//         folderName: string;
//         assets: any[];
//         firstImage: string;
//     }[];
// }
//
// export default function FeaturedAlbums() {
//     const [loading, setLoading] = useState(true);
//     const [folders, setFolders] = useState<FolderObject[]>([]);
//     const [startIndices, setStartIndices] = useState<number[]>([]);
//     const pageSize = 4;
//
//     const handlePrev = (index: number) => {
//         setStartIndices((prevIndices) => {
//             const updatedIndices = [...prevIndices];
//             updatedIndices[index] = Math.max(0, updatedIndices[index] - pageSize);
//             return updatedIndices;
//         });
//     };
//
//     const handleNext = (index: number, folder: FolderObject) => {
//         setStartIndices((prevIndices) => {
//             const updatedIndices = [...prevIndices];
//             updatedIndices[index] = Math.min(folder.subFolders.length - pageSize, updatedIndices[index] + pageSize);
//             return updatedIndices;
//         });
//     };
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const resp = await DamService.get("folders/db5f8d55-361f-47bd-9e8d-5dac38189fcb/subfolders");
//                 const folderData = await Promise.all(
//                     resp.data.payload.map(async (folder: any) => {
//                         const response = await DamService.get(`folders/${folder.id}/subfolders`);
//                         const subFolders = await Promise.all(
//                             response.data.payload.map(async (subFolder: any) => {
//                                 const assetsResp = await DamService.get(`categories/${subFolder.id}/assets`);
//                                 const image = assetsResp.data.payload.assets[0].media.small;
//                                 const blobResponse = await damBlobService.get(image, { responseType: "blob" });
//                                 const firstImage = URL.createObjectURL(blobResponse.data);
//                                 return {
//                                     folderId: subFolder.id,
//                                     folderName: subFolder.name,
//                                     assets: assetsResp.data.payload.assets,
//                                     firstImage: firstImage,
//                                 };
//                             })
//                         );
//                         return { authorName: folder.name, subFolders };
//                     })
//                 );
//
//                 setFolders(folderData);
//                 setStartIndices(new Array(folderData.length).fill(0));
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     return (
//         <div style={{ height: "200vh", width: "100vw", padding: "20px", background: "black", color: "white" }}>
//             <div style={{ display: "flex", alignItems: "center" }}>
//                 <div style={{ flex: 1 }}>
//                     <h1 style={{ color: "white" }}>Featured Albums</h1>
//                     <h2 style={{ color: "white" }}>Select one of the following folders to view images.</h2>
//                 </div>
//                 <Button
//                     style={{ background: "white", color: "black", height: "40px" }}
//                     onClick={() => window.location.assign("/")}
//                 >
//                     Back to art wall
//                 </Button>
//             </div>
//
//             <div style={{ display: "flex", gap: "10px" }}>
//                 {loading ? (
//                     <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center" }}>
//                         <Skeleton width="10%" height="30px" sx={{ background: "dimgray" }} />
//                         <div
//                             style={{
//                                 display: "flex",
//                                 gap: "10px",
//                                 marginTop: "10px",
//                                 overflowX: "auto",
//                                 width: "100vw",
//                                 whiteSpace: "nowrap",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                         >
//                             <IconButton disabled>
//                                 <ArrowCircleLeftSharpIcon style={{ color: "white" }} />
//                             </IconButton>
//                             {Array(4)
//                                 .fill(null)
//                                 .map((_, index) => (
//                                     <Box key={index} sx={{ width: "300px", padding: "20px", border: "white 2px solid", borderRadius: "10px" }}>
//                                         <Skeleton variant="rectangular" height={250} sx={{ background: "dimgray", borderRadius: "10px" }} />
//                                         <Box sx={{ pt: 0.5 }}>
//                                             <Skeleton width="80%" sx={{ background: "dimgray" }} />
//                                             <Skeleton width="60%" sx={{ background: "dimgray" }} />
//                                         </Box>
//                                     </Box>
//                                 ))}
//                             <IconButton disabled>
//                                 <ArrowCircleRightSharpIcon style={{ color: "white" }} />
//                             </IconButton>
//                         </div>
//                     </div>
//                 ) : (
//                     <div>
//                         {folders.map((folder, folderIndex) => {
//                             if (folder.subFolders.length > 0) {
//                                 const startIndex = startIndices[folderIndex];
//                                 const endIndex = startIndex + pageSize;
//
//                                 return (
//                                     <div
//                                         key={folder.authorName}
//                                         style={{
//                                             marginTop: "30px",
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             alignItems: "center",
//                                         }}
//                                     >
//                                         <h2 style={{ color: "white" }}>{folder.authorName}</h2>
//                                         <div
//                                             style={{
//                                                 display: "flex",
//                                                 gap: "10px",
//                                                 marginTop: "10px",
//                                                 overflowX: "auto",
//                                                 width: "100vw",
//                                                 whiteSpace: "nowrap",
//                                                 alignItems: "center",
//                                             }}
//                                         >
//                                             <IconButton onClick={() => handlePrev(folderIndex)} disabled={startIndex === 0}>
//                                                 <ArrowCircleLeftSharpIcon style={{ color: "white" }} />
//                                             </IconButton>
//
//                                             {folder.subFolders.slice(startIndex, endIndex).map((subFolder) => (
//                                                 <div
//                                                     key={subFolder.folderId}
//                                                     style={{
//                                                         width: "300px",
//                                                         padding: "20px",
//                                                         border: "white 2px solid",
//                                                         borderRadius: "10px",
//                                                         flex: "0 0 auto",
//                                                     }}
//                                                 >
//                                                     <img
//                                                         src={subFolder.firstImage}
//                                                         alt={subFolder.folderName}
//                                                         height={250}
//                                                         width={250}
//                                                         style={{
//                                                             objectFit: "cover",
//                                                             objectPosition: "top left",
//                                                             borderRadius: "5px",
//                                                         }}
//                                                     />
//                                                     <Box sx={{ pt: 0.5 }}>
//                                                         <h4 style={{ color: "white" }}>{subFolder.folderName}</h4>
//                                                         <h5 style={{ color: "white" }}>{subFolder.assets.length} images</h5>
//                                                     </Box>
//                                                 </div>
//                                             ))}
//
//                                             <IconButton onClick={() => handleNext(folderIndex, folder)} disabled={endIndex >= folder.subFolders.length}>
//                                                 <ArrowCircleRightSharpIcon style={{ color: "white" }} />
//                                             </IconButton>
//                                         </div>
//                                     </div>
//                                 );
//                             }
//                             return null;
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
