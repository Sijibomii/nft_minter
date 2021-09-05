
const hre = require("hardhat");

async function main() {
  
  // We get the contract to deploy
  const nftMinter = await hre.ethers.getContractFactory("NFT_Minter");
  const nft = await nftMinter.deploy();

  await nft.deployed();

  console.log("nft minter deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
