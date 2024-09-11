const hre = require("hardhat");

async function main() {
  const _3DadzMysteryCard = await hre.ethers.getContractFactory("_3DadzMysteryCard");
  const blastNFT = await _3DadzMysteryCard.deploy();

  await blastNFT.deployed();

  console.log("_3DadzMysteryCard deployed to:", blastNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
