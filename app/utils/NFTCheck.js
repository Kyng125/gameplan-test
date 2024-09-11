import { useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const NFTCheck = ({ setNftOwned }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const checkNFT = useCallback(async () => {
    if (!publicKey) return;

    const ownedNFTs = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: new PublicKey("Tokenkeg...") }
    );

    // Check if specific NFT is owned
    const nftOwned = ownedNFTs.value.some((account) => {
      const parsedAccount = account.account.data.parsed.info;
      return parsedAccount.mint === "YOUR_NFT_MINT_ADDRESS";
    });

    setNftOwned(nftOwned);
  }, [connection, publicKey, setNftOwned]);

  useEffect(() => {
    checkNFT();
  }, [publicKey, checkNFT]);

  return null;
};

export default NFTCheck;
