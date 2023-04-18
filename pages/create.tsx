import {
  useContract,
  useNetworkMismatch,
  useActiveChain,
  useSwitchChain,
  useMetamask,
  useAddress,
} from "@thirdweb-dev/react";
import {
  ChainId,
  getNativeTokenByChainId,
  NATIVE_TOKEN_ADDRESS,
  TransactionResult,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { marketplaceContractAddress } from "../addresses";
import styles from "../styles/Home.module.css";
import { ConfluxEspace } from "@thirdweb-dev/chains";
import { useEffect, useState } from "react";
import Button from "../components/Button";

// useActiveChain, useSwitchChain, useChainId

const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  const [active, setActive] = useState("directListing");
  const networkMismatch = useNetworkMismatch();
  // const [{ data, error, loading }, switchNetwork] = useNetwork();
  const connectWithMetamask = useMetamask();
  // Connect to our marketplace contract via the useContract hook
  const { contract: marketplace } = useContract(marketplaceContractAddress, "marketplace");

  const switchChain = useSwitchChain();
  const address = useAddress();
  // This function gets called when the form is submitted.
  const chain = useActiveChain();

  async function handleCreateListing(e: any) {
    try {
      if (chain?.name !== "Conflux eSpace") {
        switchChain(ConfluxEspace.chainId);
      }

      // Prevent page from refreshing
      e.preventDefault();

      // Store the result of either the direct listing creation or the auction listing creation
      let transactionResult: undefined | TransactionResult = undefined;

      // De-construct data from form submission
      const { listingType, contractAddress, tokenId, price } = e.target.elements;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          price.value,
        );
      }

      // For Auction Listings:
      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          contractAddress.value,
          tokenId.value,
          price.value,
        );
      }

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(contractAddress: string, tokenId: string, price: string) {
    try {
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(contractAddress: string, tokenId: string, price: string) {
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="px-4 pt-[80px] lg:pt-[150px] flex justify-center mb-6">
      {/* Form Section */}
      <div className="flex flex-col justify-center gap-10 items-center w-full lg:w-[50%]">
        <h1 className="conflux-text text-center text-3xl lg:text-5xl lg:mb-10 ">Sell your NFT to the Nitfee Market</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <Button
            type={active === "directListing" ? "square" : "transparent"}
            onClick={() => setActive("directListing")}
          >
            Direct Listing
          </Button>
          <Button
            onClick={() => setActive("auctionList")}
            type={active === "auctionList" ? "square" : "transparent"}
          >
            Auction Listing
          </Button>
        </div>
        {/* Toggle between direct listing and auction listing */}
        {/* <div>
          <input
            type="radio"
            name="listingType"
            id="directListing"
            value="directListing"
            defaultChecked
            // className={styles.listingType}
          />
          <label htmlFor="directListing" className={styles.listingTypeLabel}>
            Direct Listing
          </label>
          <input
            type="radio"
            name="listingType"
            id="auctionListing"
            value="auctionListing"
            // className={styles.listingType}
          />
          <label htmlFor="auctionListing">Auction Listing</label>
        </div> */}

        {/* NFT Contract Address Field */}
        <input
          type="text"
          name="contractAddress"
          placeholder="NFT Contract Address"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
        />

        {/* NFT Token ID Field */}
        <input
          type="text"
          name="tokenId"
          placeholder="NFT Token ID"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
        />

        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
        />
        {/* Sale Price For Listing Field */}
        {active === "directListing" && (
          <input
            type="text"
            name="price"
            placeholder="Sale Price"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
          />
        )}

        {active === "auctionList" && (
          <input
            type="text"
            name="Buyout Price Per Token"
            placeholder="Buyout Price Per Token (How much people would have to bid to instantly buy the asset)"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
          />
        )}
        {/* // the minimum bid that will be accepted for the token */}
        {active === "auctionList" && (
          <input
            type="text"
            name="Reserve Price Per Token"
            placeholder="Reserve Price Per Token (The minimum bid that will be accepted for the token)"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
          />
        )}
        {active === "auctionList" && (
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            className="w-full p-4 rounded border border-[#696969] bg-transparent outline-none"
          />
        )}
        <Button>List NFT</Button>
      </div>
    </div>
  );
};

export default Create;
