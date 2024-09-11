import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    blast: {
      url: process.env.BLAST_URL || "https://blast-mainnet.infura.io/v3/58d7834e373f4103a165a13c296b8e01",
      accounts: [process.env.PRIVATE_KEY || "040cbc35edc188c494118f3bd5d728da599172bc56d0ff9a88d3ac3d427888d9"]
    }
  }
};

export default config;