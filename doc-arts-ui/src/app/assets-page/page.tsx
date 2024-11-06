"use client";

import React, { useEffect, useState } from "react";
import DamService from "@/app/services/damService";
import { Box, Button, Grid, Skeleton } from "@mui/material";

// Access the search parameters from the props
const AssetsPage = ({ searchParams }) => {
    const { id } = searchParams; // Accessing search params directly
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<any[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!id) return; // Ensure id is available before making the API call

            try {
                setLoading(true);
                const response = await DamService.get(`categories/${id}/assets`);
                setAssets(response.data.payload.assets);
            } catch (error) {
                console.error("Error fetching assets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [id]);

    return (
        <div style={{ padding: "20px", background: "black", color: "white" }}>
            <Button
                onClick={() => window.location.assign("/featured-albums")}
                style={{
                    backgroundColor: "white", // White background
                    color: "black",            // Black text color
                    marginBottom: "20px",
                    padding: "10px 20px",     // Add some padding for a better look
                    borderRadius: "5px",       // Add some border radius for rounded corners
                    border: "none",            // Remove any default border
                    cursor: "pointer"          // Change cursor to pointer for better UX
                }}
            >
                Back to Featured Albums
            </Button>
            {loading ? (
                <Grid container spacing={0}>
                    {Array(6).fill(null).map((_, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Skeleton variant="rectangular" height={200} sx={{ background: "dimgray" }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={0} style={{ margin: 0 }}>
                    {assets.map((asset) => (
                        <Grid item xs={12} sm={4} key={asset.id} style={{ padding: 0 }}>
                            <Box>
                                <img
                                    src={asset.media.small} // Adjust according to the actual asset structure
                                    alt={asset.name}
                                    style={{
                                        width: "100%",
                                        height: "250px", // Set a fixed height
                                        objectFit: "cover", // Ensure the image covers the box without distortion
                                        borderRadius: "5px",
                                    }}
                                />
                                <h4 style={{ color: "white" }}>{asset.name}</h4>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default AssetsPage;
