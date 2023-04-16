import React, { useState, CSSProperties } from "react";
import { useActiveListings, useContract } from "@thirdweb-dev/react";
import Headers from "../components/Header";
import NftCard from "../components/NftCard";
import { marketplaceContractAddress } from "../addresses";
import BeatLoader from "react-spinners/BeatLoader";
import Button from "../components/Button";
import { useRouter } from "next/router";
import Head from "next/head";
import { zeroPad } from "ethers/lib/utils";
import NftCarousel from "../components/NftCarousel";
import Loading from "../components/Loading";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export default function Home() {
  const router = useRouter();
  const { contract } = useContract(marketplaceContractAddress, "marketplace");
  const { data, isLoading, error } = useActiveListings(contract);
  

  return (
    <>
      <Head>
        <title>Nitfee Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="List Your NFTs For Sale, Accept Bids, and Buy NFTs" />
        <meta
          name="keywords"
          content="Thirdweb, Marketplace, NFT Marketplace Tutorial, NFT Auction Tutorial, How To Make OpenSea"
        />
      </Head>
      <div className="">
        <Headers />
        {/* Explore Marketplace */}
        <div className="my-[120px] px-[75px]">
          <h1 className="text-[59px] font-semibold text-white text-center mb-12">
            Explore Marketplace
          </h1>
          {isLoading ? (
            <Loading isLoading={isLoading} />
          ) : (
            <div className="grid grid-cols-3 min-[1390px]:grid-cols-4 gap-6 ">
              {data &&
                data?.map((item) => (
                  <NftCard
                    key={item.id}
                    name={item.asset.name}
                    user={"@user"}
                    symbol={item.buyoutCurrencyValuePerToken.symbol}
                    price={item.buyoutCurrencyValuePerToken.displayValue}
                    image={item.asset.image}
                    onClick={() => router.push(`/listing/${item.id}`)}
                  />
                ))}
            </div>
          )}
          {!isLoading && (
            <div className="text-center mt-12">
              <Button className="rouded-button text-white text-lg font-medium">View More</Button>
            </div>
          )}
        </div>
        {/* Newly listed */}
        <div className="my-[120px] px-[75px]">
          <h1 className="text-[59px] font-semibold text-white text-center mb-12">Newly Listed</h1>
          {isLoading ? <Loading isLoading={isLoading} /> : <NftCarousel listing={data} />}
        </div>

        {/* Recently Sold */}
        <div className="my-[120px] px-[75px]">
          <h1 className="text-[59px] font-semibold text-white text-center mb-12">Recently Sold</h1>
          {isLoading ? <Loading isLoading={isLoading} /> : <NftCarousel listing={data} />}
        </div>
      </div>
    </>
  );
}
