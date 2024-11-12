'use client';

import React, { useEffect, useState, FC } from "react";
import DamService from "@/app/services/damService";
import {Box, Button, Grid, Skeleton, Typography} from "@mui/material";
import Modal from '@mui/material/Modal';

interface Asset {
    id: string;
    name: string;
    media: {
        small: string;
        large: string;
    };
}

interface AssetsResponse {
    data?: {
        payload?: {
            assets?: Asset[];
        };
    };
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
};

export const AssetsPage = ({id}: {id: string}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [assets, setAssets] = useState<Asset[]>([]);

    const [modalOpen, setModalOpen] = React.useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => {
        setModalOpen(false);
        setCurrentImage("")
    };

    const [currentImage, setCurrentImage] = useState<string>()

    useEffect(() => {
        const fetchAssets = async (): Promise<void> => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await DamService.get<AssetsResponse>(`categories/${id}/assets`);

                const fetchedAssets = (response.data as AssetsResponse["data"])?.payload?.assets || [];
                setAssets(fetchedAssets);
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
    const imglargeStyle: React.CSSProperties = {
        width: "100%",
        height: "80vh",
        objectFit: "cover",
        borderRadius: "5px"
    };
    return (
        <div style={{ padding: "20px", backgroundColor: "black", color: "white" }}>
            <Button
                onClick={() => window.location.assign("/featured-albums")}
                style={buttonStyle}
            >
                Back to Featured Albums
            </Button>
            {loading ? (
                <Grid container style={{justifyContent: "center"}}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton variant="rectangular" height={"250px"} width={"400px"} sx={{ backgroundColor: "dimgray", margin: '1px' }} />
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={0} style={{ margin: 0 }}>
                    {assets.map((asset) => (
                        <Grid item xs={12} sm={4} key={asset.id} style={{ padding: 0 }}>
                            <div onClick={() => {
                                handleOpen();
                                setCurrentImage(asset.media.large)
                            }}>
                                <img
                                    src={asset.media.large}
                                    alt={asset.name}
                                    style={imgStyle}
                                />
                                <h4 style={{ color: "white" }}>{asset.name}</h4>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Modal
                keepMounted
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <img
                        src={currentImage}
                        alt={"Large Image"}
                        style={imglargeStyle}
                    />
                </Box>
            </Modal>
        </div>
    )
}