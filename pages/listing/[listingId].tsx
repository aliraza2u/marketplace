import {
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useContract,
  useCancelListing,
  Web3Button,
} from "@thirdweb-dev/react";
import { ChainId, ListingType, Marketplace, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { marketplaceContractAddress } from "../../addresses";
import Table from "../../components/Table/Table";
import styles from "../../styles/Home.module.css";

const ListingPage: NextPage = () => {
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  const { listingId } = router.query as { listingId: string };

  // Hooks to detect user is on the right network and switch them if they are not
  const networkMismatch = useNetworkMismatch();
  // const [, switchNetwork] = useNetwork();

  // Initialize the marketplace contract
  const { contract } = useContract(marketplaceContractAddress, "marketplace");

  // const { contract } = useContract(marketplaceContractAddress, "marketplace");
  console.log(contract, "contract");

  const { mutateAsync: cancelListing, isLoading, error } = useCancelListing(contract);

  // Fetch the listing from the marketplace contract
  const { data: listing, isLoading: loadingListing } = useListing(contract, listingId);

  // Store the bid amount the user entered into the bidding textbox
  const [bidAmount, setBidAmount] = useState<string>("");

  if (loadingListing) {
    return <div className={styles.loadingOrError}>Loading...</div>;
  }

  if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>;
  }

  console.log(listing, "listing");
  async function createBidOrOffer() {
    try {
      // Ensure user is on the correct network
      // if (networkMismatch) {
      //   switchNetwork && switchNetwork(ChainId.Goerli);
      //   return;
      // }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await contract?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          NATIVE_TOKENS[ChainId.Goerli].wrapped.address, // Wrapped Ether address on Goerli
          bidAmount, // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        await contract?.auction.makeBid(listingId, bidAmount);
      }

      alert(`${listing?.type === ListingType.Auction ? "Bid" : "Offer"} created successfully!`);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function buyNft() {
    try {
      // Ensure user is on the correct network
      // if (networkMismatch) {
      //   switchNetwork && switchNetwork(ChainId.Goerli);
      //   return;
      // }

      // Simple one-liner for buying the NFT
      await contract?.buyoutListing(listingId, 1);
      alert("NFT bought successfully!");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div className={styles.container}>
      <h2 className="font-extrabold text-[64px] leading-[77px] tracking-wide mt-[190px] mb-[100px]">
        Item details
      </h2>

      <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className="w-[552px] h-auto max-w-full"
            width="552"
            height="552"
          />
        </div>

        <div className={styles.rightListing}>
          <h1 className="font-extrabold text-[48px] leading-[58px] tracking-wide mb-4">
            {listing.asset.name?.toString().split("#")[0]}
          </h1>
          <div className="flex mb-10">
            <p className="text-[#B2B2B2] font-medium text-xl leading-6 tracking-wide mr-5">
              Current Price:
            </p>
            <p className="font-extrabold text-[22px] leading-7 tracking-wide text-gradient">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
          </div>
          <div className="w-full max-w-[618px] h-auto min-h-[100px] bg-[#16192A] border-2 border-[#2E3150] rounded-xl pt-12 pb-8  px-10 mb-10">
            <p className="text-[#878788] font-medium text-xl leading-9 tracking-wide capitalize mb-7">
              {listing?.asset?.description}
            </p>
            <div className="flex items-center">
              <Image
                src="/images/dummy_person.png"
                alt="person-img"
                width={64}
                height={64}
                className="mr-4"
              />
              <div>
                <p className="font-medium text-xl leading-6 mb-2">
                  @
                  {listing.sellerAddress?.slice(0, 6) +
                    "..." +
                    listing.sellerAddress?.slice(36, 40)}
                </p>
                <p className="font-medium text-[15px] leading-[16px] text-[#878788]">Owner</p>
              </div>
            </div>
            <div className="mt-7">
              <p>
                <b className="font-extrabold text-xl leading-6 capitalize tracking-wide mr-3">
                  Token ID:
                </b>
                <span className="text-[#878788] font-normal text-xl ">
                  {listing.asset.name?.toString().split("#")[1] || "N/A"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-center w-full">
            <button
              style={{ borderStyle: "none" }}
              className="uppercase font-bold text-base text-white gap-2 px-6 py-3 rounded-xl walletConnectButton  text-center !flex !items-center !justify-center flex-1 "
              onClick={buyNft}
            >
              BUY IT NOW
            </button>
            <p style={{ color: "grey" }}>|</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                type="text"
                name="bidAmount"
                className={styles.textInput}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Amount"
                style={{ marginTop: 0, marginLeft: 0, width: 128 }}
              />
              <button
                className={`${styles.mainButton} ml-2`}
                onClick={createBidOrOffer}
                style={{
                  borderStyle: "none",
                  background: "transparent",
                  width: "fit-content",
                }}
              >
                Make Offer
              </button>
            </div>
          </div>
          {/* Starting the Cancel operation from here */}
          {/* <div>
            <Web3Button
              contractAddress={marketplaceContractAddress}
              action={() =>
                cancelListing({
                  id: listingId,
                  type: ListingType.Direct, // Direct (0) or Auction (1)
                })
              }
            >
              Cancel Listing
            </Web3Button>
          </div> */}
          {/* Ending the cancle operation here */}
        </div>
      </div>
      <div className="max-w-[90vw] w-full mt-36">
        <h2 className="font-bold leading-[68px] text-[56px] tracking-wide text-center mb-12">
          Related NFTs
        </h2>
        <Table assetDetails={listing} />
      </div>
    </div>
  );
};

export default ListingPage;
