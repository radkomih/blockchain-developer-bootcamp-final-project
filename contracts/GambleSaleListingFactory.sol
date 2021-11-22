// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import './GambleSaleListing.sol';

/// @title A factory contract for deployment of multiple lucky-sale listings
/// @author Radosvet Mihtarski
/// @notice A user can use this contract to publish new lucky-sale listing 
/// @dev All function calls are currently implemented
contract GambleSaleListingFactory {
    GambleSaleListing[] private deployed;

    event PublishNewListing(GambleSaleListing);

    function publish(string memory _productIPFSId, string memory _productHash, string memory _location, string memory _carrier, uint _price, uint _maxSlots) public payable {

        GambleSaleListing newGambleSaleListing = 
            (new GambleSaleListing){ value: msg.value }(msg.sender, _productIPFSId, _productHash, _location, _carrier, _price, _maxSlots);

        deployed.push(newGambleSaleListing);

        emit PublishNewListing(newGambleSaleListing);
    }

    function fetch() public view returns(GambleSaleListing[] memory) {
        return deployed;
    }
}