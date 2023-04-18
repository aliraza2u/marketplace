import {
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useContract,
  useCancelListing,
  Web3Button,
  useMakeOffer,
  useMakeBid,
  useValidDirectListings,
  useValidEnglishAuctions,
  useOffers,
  useBidBuffer,
  useMinimumNextBid,
  useAuctionWinner,
  useWinningBid,
} from "@thirdweb-dev/react";
import { ChainId, ListingType, Marketplace, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

  //hook to call the makeOffer function in direct listing
  const { mutateAsync: makeOffer, isLoading: makeOfferLoading } = useMakeOffer(contract);

  //hook to call the makeBid function in auction listing
  const { mutateAsync: makeBid, isLoading: makeBidLoading } = useMakeBid(contract);

  //get all direct listing offers
  const { data: offers } = useOffers(contract, listingId);
  console.log(offers, "offerss");

  //what percentage higher the next bid must be than the current highest bid, or the starting price if there are no bids.
  const { data: bidBuffer, isLoading: bidBufferLoading } = useBidBuffer(contract, listingId);
  console.log(bidBuffer?.toString(), "bidBuffer");

  // minimum value a bid must be to be valid in an auction listing
  const { data: minNextBid, isLoading: minNextBidLoading } = useMinimumNextBid(contract, listingId);
  console.log(minNextBid, "minNextBid");

  //get the auction winner
  const { data: auctionWinnerr, isLoading: auctionWinnerLoading } = useAuctionWinner(
    contract,
    listingId,
  );
  const { data: winningBid } = useWinningBid(contract, listingId);
  console.log(winningBid, "winningBid");

  console.log(listing, "listingData");
  async function createBidOrOffer() {
    try {
      if (listing?.type == 0) {
        await makeOffer({
          listingId: listingId, // ID of the listing to make an offer on
          pricePerToken: bidAmount, // Price per token to offer (in the listing's currency)
          quantity: 1, // Number of NFTs you want to buy (used for ERC1155 NFTs)
        });
      } else {
        // If the listing type is an auction listing, then we can create a bid.
        await makeBid({
          listingId: listingId, // ID of the listing to bid on. Must be an auction.
          bid: bidAmount, // Uses the currencyContractAddress of the listing.
        });
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
  function dhm(ms: number) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);
    if (days > 0) return days + " days " + hours + ":" + minutes + ":" + sec;
    else return hours + ":" + minutes + ":" + sec;
  }

  let msTillEnd = 166660000;
  // if (listing?.secondsUntilEnd)
  //   msTillEnd = new Date(+listing?.secondsUntilEnd?.toString() * 1000) - new Date().getTime() || 0;
  // else {
  //   //endTimeInEpochSeconds
  //   msTillEnd=
  //     new Date(+listing?.endTimeInEpochSeconds?.toString() * 1000) - new Date().getTime() || 0;
  // }

  // console.log("secondstillend", dhm(msTillEnd));
  if (loadingListing) {
    return <div className={styles.loadingOrError}>Loading...</div>;
  }

  if (!listing) {
    return <div className={styles.loadingOrError}>Listing not found</div>;
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
          <div className="flex justify-between w-full">
            <h1 className="font-extrabold text-[48px] leading-[58px] tracking-wide mb-4">
              {listing.asset.name}
            </h1>
            {msTillEnd > 0 ? (
              <p className="pt-3">Closing in {dhm(msTillEnd)}</p>
            ) : (
              <p className="text-red-400 pt-3 ">Listing Inactive</p>
            )}
          </div>
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
                  {listing.asset.id || "N/A"}
                </span>
              </p>
            </div>
            <div className="mt-2">
              <p>
                <b className="font-extrabold text-xl leading-6 capitalize tracking-wide mr-3">
                  Listing Type:
                </b>
                <span className="text-[#878788] font-normal text-xl ">
                  {listing.type == 0 ? "Fixed Price" : "Auction"}
                </span>
              </p>
            </div>
          </div>

          {
            <div className="flex gap-5 items-center w-full">
              <button
                style={{ borderStyle: "none" }}
                className="uppercase font-bold text-base text-white gap-2 px-6 py-3 rounded-xl walletConnectButton  text-center !flex !items-center !justify-center flex-1 "
                onClick={buyNft}
                disabled={msTillEnd < 0}
              >
                {msTillEnd < 0 ? (
                  " (Listing Inactive)"
                ) : (
                  <span>
                    BUY IT NOW ( {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                    {listing.buyoutCurrencyValuePerToken.symbol})
                  </span>
                )}
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
                  value={bidAmount}
                  disabled={msTillEnd < 0}
                />
                <button
                  className={`${styles.mainButton} ml-2`}
                  onClick={createBidOrOffer}
                  disabled={msTillEnd < 0}
                  style={{
                    borderStyle: "none",
                    background: "transparent",
                    width: "fit-content",
                  }}
                >
                  {listing.type == 0 ? "Make Offer" : "Bid Now"}
                </button>
              </div>
            </div>
          }
          <div className="h-6 flex justify-end w-full">
            {listing.type == 1 &&
              minNextBid &&
              +bidAmount < +minNextBid?.displayValue.toString() && (
                <p className="text-right w-full mt-2 pr-3">
                  Minimum next bid: {minNextBid?.displayValue.toString()}
                </p>
              )}
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
      {listing.type == 0 && (
        <div className="max-w-[90vw] w-full mt-36">
          <h2 className="font-bold leading-[68px] text-[56px] tracking-wide text-center mb-12">
            Offers
          </h2>
          <Table assetDetails={listing} />
        </div>
      )}
    </div>
  );
};

export default ListingPage;
