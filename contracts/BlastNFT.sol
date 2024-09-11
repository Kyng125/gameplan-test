// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract _3DadzMysteryCard is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("_3DadzMysteryCard", "3DMC") {
        tokenCounter = 0;
    }

    function createNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter = tokenCounter + 1;
        return newItemId;
    }
}
