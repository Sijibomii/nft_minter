// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";
contract NFT_Minter is Initializable ,ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address tokenOwner;

  constructor (address owner) ERC721("Nft with pictures", "NFPI"){
    tokenOwner=owner;
  }

  function mint(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
