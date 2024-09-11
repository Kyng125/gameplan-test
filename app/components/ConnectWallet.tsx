"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { Web3Provider, JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers"; // Correct import for Web3Provider
import { useAccount, useConnect, useDisconnect, WagmiProvider } from "wagmi";
import { injected } from "wagmi/connectors"; // Correct import for the injected connector
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; // Adjust the path if necessary
import Modal from "./Modal";
import { wagmiConfig } from "./wagmiConfig"; // Import the configured Wagmi
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polygon } from "wagmi/chains";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Polygon NFT collection configuration
const NFT_CONTRACT_ADDRESS = "0xB098055b534e282b482144a677A63cA658063c6F"; // Contract address
const NFT_ABI: ethers.InterfaceAbi = [
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "uint256", name: "_token", type: "uint256" }],
    name: "tokenExist",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256"
      }
    ],
    name: "BatchMetadataUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256"
      }
    ],
    name: "MetadataUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32"
      }
    ],
    name: "RoleAdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleGranted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleRevoked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "UserPaid",
    type: "event"
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "OGMint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "OGWL_user_addresses",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "OG_user_addresses",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "Og_minted_address",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "PAUSER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "WL_user_addresses",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "amount_paid",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "base_url",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "has_paid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" }
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_OGAWLlimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_OGAWLprice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_OGlimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_OGprice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_Plimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_Pprice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_WLlimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "mint_WLprice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "noOfEntry",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "ogwl_minted_address",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "_user", type: "address" },
          { internalType: "uint256", name: "_amount", type: "uint256" }
        ],
        internalType: "struct DODOUBLEGZ.automint[]",
        name: "_users",
        type: "tuple[]"
      }
    ],
    name: "presaleMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "publicMint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "public_minted_address",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_no", type: "uint256" }],
    name: "resetNoOfEntry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "sequence",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "sequence_tokenId",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "string", name: "_uri", type: "string" }],
    name: "setBaseUrl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_og", type: "uint256" },
      { internalType: "uint256", name: "_wl", type: "uint256" },
      { internalType: "uint256", name: "_ogwl", type: "uint256" },
      { internalType: "uint256", name: "_public", type: "uint256" }
    ],
    name: "setMintLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_OGprice", type: "uint256" },
      { internalType: "uint256", name: "_WLprice", type: "uint256" },
      { internalType: "uint256", name: "_OGAWLprice", type: "uint256" },
      { internalType: "uint256", name: "_Pprice", type: "uint256" }
    ],
    name: "setMintPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_limit", type: "uint256" }],
    name: "setMintSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bool", name: "_og", type: "bool" },
      { internalType: "bool", name: "_wl", type: "bool" },
      { internalType: "bool", name: "_ogwl", type: "bool" },
      { internalType: "bool", name: "_public", type: "bool" }
    ],
    name: "setMintType",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_accounts", type: "address[]" }
    ],
    name: "setOGWlWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_accounts", type: "address[]" }
    ],
    name: "setOgWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_sequence", type: "uint256[]" }
    ],
    name: "setOldSequence",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_sequence", type: "uint256[]" }
    ],
    name: "setSequence",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "setTreasuryWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "_accounts", type: "address[]" }
    ],
    name: "setWlWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "supply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "treasuryMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "withdrawAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "wlAndOgMint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "wlMint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "wl_minted_address",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    stateMutability: "payable",
    type: "receive"
  }
]; // Full NFT contract ABI

const generateReferralCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};


const ConnectWallet = () => {
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address) {
      checkNFTOwnership(address);
    }
  }, [isConnected, address]);

  const handleConnectWallet = () => {
    console.log("Connect Wallet button clicked");
    setIsWalletModalVisible(true);
  };

  const handleWalletClick = async () => {
    setIsWalletModalVisible(false);
    try {
      await connect({ connector: injected() });
      if (isConnected && address) {
        const ownsNFT = await checkNFTOwnership(address);
        if (ownsNFT) {
          await saveWalletAddress(address);
          setIsSuccessful(true);
        } else {
          throw new Error("NFT ownership verification failed");
        }
      } else {
        throw new Error("Wallet connection failed");
      }
    } catch (error) {
      setIsSuccessful(false);
      setErrorMessage((error as Error).message);
    }

    setIsResultModalVisible(true);
  };

  useEffect(() => {
    if (isSuccessful) {
      setTimeout(() => {
        router.push("/quests");
      }, 3000);
    }
  }, [isSuccessful, router]);

  const handleCloseModal = () => {
    setIsWalletModalVisible(false);
    setIsResultModalVisible(false);
  };

  const toggleModal = () => {
    setIsWalletModalVisible(!isWalletModalVisible);
    setIsResultModalVisible(!isResultModalVisible);
  };

  const checkNFTOwnership = async (walletAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(window.ethereum); // Use JsonRpcProvider from ethers
      const signer = provider.getSigner() as unknown as ethers.Signer; // Ensure it's of type Signer
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer); // ContractRunner is satisfied by Signer
      const balance = await nftContract.balanceOf(walletAddress);
      console.log("NFT balance:", balance.toString());

      return balance.gt(0);
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
      return false;
    }
  };

  const saveWalletAddress = async (walletAddress: string) => {
    try {
      const userDocRef = doc(db, "users", walletAddress);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const referralCode = generateReferralCode();
        await setDoc(userDocRef, {
          walletAddress,
          totalPoints: 0,
          currentRank: 0,
          referrals: 0,
          questsCompleted: 0,
          nftsCollected: 0,
          referralCode,
          twitterConnected: false
        });
      } else {
        const userData = userDoc.data();
        await updateDoc(userDocRef, {
          walletAddress,
          totalPoints: userData?.totalPoints || 0,
          currentRank: userData?.currentRank || 0,
          referrals: userData?.referrals || 0,
          questsCompleted: userData?.questsCompleted || 0,
          nftsCollected: userData?.nftsCollected || 0,
          referralCode: userData?.referralCode || generateReferralCode(),
          twitterConnected: userData?.twitterConnected || false
        });
      }
    } catch (error) {
      console.error("Error saving wallet address:", error);
    }
  };

  return (
    <div className="text-customGold text-3xl mt-5 uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 max-w-60 tracking-wider">
      Begin Your Quest
      <button
        className="btn btn-glass rounded-box mt-20 bg-customGold text-black leading-4 hover:bg-customGold hover:text-white duration-300"
        onClick={handleConnectWallet}
      >
        CONNECT WALLET
      </button>
      {isWalletModalVisible && (
        <Modal
          className="text-customGold text-3xl uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 bg-opacity-60"
          content={
            <div className="flex flex-col items-center">
              <h2 className="text-2xl my-4 text-customGold">Select Wallet</h2>
              <div className="flex gap-10">
                <button
                  className="flex flex-col items-center text-white hover:bg-customGold hover:text-white duration-300 mb-2 rounded-box p-2 transition-transform transform hover:scale-110"
                  onClick={handleWalletClick}
                >
                  <div className="bg-base-300 p-10 rounded-box">
                    <Image
                      src="/metamasklogo.svg"
                      alt="MetaMask"
                      width={80}
                      height={80}
                      priority
                      className="transition-transform duration-300 transform hover:scale-110"
                    />
                  </div>
                  <div className="mt-2 text-xl">MetaMask</div>
                </button>
              </div>
            </div>
          }
          onClose={handleCloseModal}
        />
      )}
      {isWalletModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0"
          onClick={toggleModal}
        />
      )}
      {isResultModalVisible && (
        <Modal
          className="text-customGold text-3xl uppercase border border-customGold rounded-box p-6 flex flex-col text-center items-center bg-base-300 bg-opacity-60"
          content={
            <div className="flex flex-col items-center">
              {isSuccessful ? (
                <>
                  <h2 className="text-2xl mb-4 text-customGold">Success</h2>
                  <Image
                    src="/checkmark.svg"
                    alt="Success"
                    width={50}
                    height={50}
                    className="m-2"
                  />
                  <p className="text-xl normal-case mt-4">
                    Wallet connected and authenticated successfully!
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl mb-4 text-customGold">Failed</h2>
                  <Image
                    src="/cancel.svg"
                    alt="Failed"
                    width={50}
                    height={50}
                    className="m-2"
                  />
                  <p className="text-xl normal-case mt-4">{errorMessage}</p>
                </>
              )}
            </div>
          }
          onClose={handleCloseModal}
        />
      )}
      {isResultModalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0"
          onClick={toggleModal}
        />
      )}
    </div>
  );
};

// Wrap the component with WagmiProvider and QueryClientProvider using the configured client
export default function WrappedConnectWallet() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectWallet />
      </WagmiProvider>
    </QueryClientProvider>
  );
}