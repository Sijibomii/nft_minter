const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftMinter", function () {
  it("Should return an NFT given a token URI", async function () {
    const nft = await ethers.getContractFactory("NFT_Minter")
    const nft_minter = await nft.deploy()
    await nft_minter.deployed()
    const token= await nft_minter.createNFT("https://www.location.com")
    console.log(token)
  });
});
