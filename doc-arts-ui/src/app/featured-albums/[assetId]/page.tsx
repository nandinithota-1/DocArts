"use client";

import {AssetsPage} from "@/app/components/assetsPage";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ assetId: string }>
}) {
    const id = (await params).assetId;

    return (
        <AssetsPage id={id}/>
    );
};


