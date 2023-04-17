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
import Contact from "../components/Contact";
import Image from "next/image";
import starIcon from "../public/images/star.svg";
import circleIcon from "../public/images/circle.svg";
import NftSteps from "../components/NftStep";
import NftStep from "../components/NftStep";
import { CATEGORIES, NFT_STEPS } from "../constants";

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
        {/* Nft Steps */}
        <div className="my-[120px] px-[75px]">
          <div className="flex flex-col justify-center items-center w-full gap-3">
            <p className="text-gradient-secondary text-xl font-normal uppercase flex gap-2">
              TO BE CREATOR <Image src={starIcon} alt="marketplan" />
            </p>
            <h5 className="text-[32px] font-bold flex gap-3">
              Create and Sell Your NFTs <Image src={circleIcon} alt="Create and Sell Your NFTs" />
            </h5>
          </div>
          <div className="flex justify-center items-end gap-10 mt-12 h-[438px]">
            {NFT_STEPS?.map((step) => (
              <NftStep
                key={step.step}
                title={step.title}
                description={step.description}
                step={step.step}
              />
            ))}
          </div>
        </div>
        {/* Explore Marketplace */}
        <div className="px-6 my-[120px] md:px-[75px] min-h-[600px]">
          <h1 className="text-[59px] font-semibold text-white text-center mb-12">
            Explore Marketplace
          </h1>
          <div className="flex justify-center gap-5 mb-12">
            {CATEGORIES?.map((category, i) => (
              <Button key={category} type="rounded" className="">
                {category}
              </Button>
            ))}
          </div>
          {isLoading ? (
            <Loading isLoading={isLoading} />
          ) : (
            <div className="flex w-full overflow-x-scroll md:overflow-auto md:grid grid-cols-3 min-[1390px]:grid-cols-4 gap-6 ">
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
              <Button type="rounded">View More</Button>
            </div>
          )}
        </div>
        {/* Newly listed */}
        <div className="my-[120px] px-[75px] min-h-[500px]">
          <h1 className="text-[59px] font-semibold text-white text-center mb-12">Newly Listed</h1>
          {isLoading ? <Loading isLoading={isLoading} /> : <NftCarousel listing={data} />}
        </div>

        {/* Recently sold */}
        <div className="my-[120px] px-[75px] min-h-[500px]">
          <h1 className="text-[59px] font-semibold text-white text-center mb-12">Recently Sold</h1>
          {isLoading ? <Loading isLoading={isLoading} /> : <NftCarousel listing={data} />}
        </div>
        {/* Contact us */}
        {/* <div className="my-[120px] px-[75px]">
          <Contact />
        </div> */}
      </div>
    </>
  );
}
