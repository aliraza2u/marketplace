import React, { useState, CSSProperties } from "react";
import { useActiveListings, useContract } from "@thirdweb-dev/react";
import Headers from "../components/Header";
import NftCard from "../components/NftCard";
import { marketplaceContractAddress } from "../addresses";
import BeatLoader from "react-spinners/BeatLoader";
import Button from "../components/Button";
import { useRouter } from "next/router";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export default function Home() {
  const router = useRouter();
  const { contract } = useContract(marketplaceContractAddress, "marketplace");
  const { data, isLoading, error } = useActiveListings(contract);

  return (
    <div className="">
      <Headers />
      {/* Explore Marketplace */}
      <div className="my-[90px] px-[75px]">
        <h1 className="text-[59px] font-semibold text-white text-center mb-12">
          Explore Marketplace
        </h1>
        {isLoading && (
          <div className="flex justify-center w-full">
            <BeatLoader
              color={"#ffffff32"}
              loading={isLoading}
              cssOverride={override}
              size={30}
              speedMultiplier={1}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        <div className="grid grid-cols-3 min-[1390px]:grid-cols-4 gap-6 ">
          {data &&
            data?.map((item) => (
              <NftCard
                key={item.id}
                name={item.asset.name}
                user={'@zinksu'}
                symbol={item.buyoutCurrencyValuePerToken.symbol}
                price={item.buyoutCurrencyValuePerToken.displayValue}
                image={item.asset.image}
                onClick={() => router.push(`/listing/${item.id}`)}
              />
            ))}
        </div>
        {!isLoading && (
          <div className="text-center">
            <Button className="rouded-button text-white text-lg font-medium">View More</Button>
          </div>
        )}
      </div>
      {/* Newly listed */}
      <div className="">

      </div>
    </div>
  );
}
