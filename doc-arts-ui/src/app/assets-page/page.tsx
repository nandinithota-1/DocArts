"use client";

import React, { useEffect, useState, FC } from "react";
import DamService from "@/app/services/damService";
import { Box, Button, Grid, Skeleton } from "@mui/material";

// Define the type for searchParams
interface SearchParams {
    id: string;
}

// Define the type for each asset
interface Asset {
    id: string;
    name: string;
    media: {
        small: string;
    };
}

// Define the expected structure of the API response
interface AssetsResponse {
    data: {
        payload: {
            assets: Asset[];
        };
    };
}

interface AssetsPageProps {
    searchParams: SearchParams;
}

const AssetsPage: FC<AssetsPageProps> = ({ searchParams }) => {
    const { id } = searchParams;
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await DamService.get<AssetsResponse>(`categories/${id}/assets`);
                setAssets(response.data.payload.assets);
            } catch (error) {
                console.error("Error fetching assets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [id]);

    const buttonStyle: React.CSSProperties = {
        backgroundColor: "white",
        color: "black",
        marginBottom: "20px",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer"
    };

    const imgStyle: React.CSSProperties = {
        width: "100%",
        height: "250px",
        objectFit: "cover",
        borderRadius: "5px"
    };

    return (
        <div style={{ padding: "20px", background: "black", color: "white" }}>
            <Button
                onClick={() => window.location.assign("/featured-albums")}
                style={buttonStyle}
            >
                Back to Featured Albums
            </Button>
            {loading ? (
                <Grid container spacing={0}>
                    {Array.from({ length: 6 }).map((_, index) => (
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
                                    src={asset.media.small}
                                    alt={asset.name}
                                    style={imgStyle}
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
