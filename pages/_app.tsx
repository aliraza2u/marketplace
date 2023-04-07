import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ConfluxEspace } from "@thirdweb-dev/chains";
import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";

// This is the chainId your dApp will work on.
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={ConfluxEspace}>
      <Head>
        <title>Nitfee Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       
        <meta
          name="keywords"
          content="Thirdweb, Marketplace, NFT Marketplace Tutorial, NFT Auction Tutorial, How To Make OpenSea"
        />
      </Head>
      <Header />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;

