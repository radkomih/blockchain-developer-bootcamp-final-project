// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import './StatusEnum.sol';
import './ItemStruct.sol';

import "@openzeppelin/contracts/access/Ownable.sol";

contract GambleSaleListing is Ownable {
    uint public constant COLLATERAL_MULTIPLIER = 1;
    uint public immutable ENTRY_AMOUNT;

    Item public item;
    string public location; // address1, address2, zip, state, city, country
    string public carrier;
    uint public price;
    uint public maxSlots;
    uint public collateralBalance;
    
    // all positions should be filled until prior entrance deadline, otherwise 
    // contract gets terminated and manager(owner) covers the fees, since it is his fault campaign is not atractive enough
    uint public maxDaysForEntrance;
    
    // once a winner is picked, there is a timeframe to ship the product, otherwise contract gets terminated and manager(owner) covers the fees
    uint public maxDaysForShipping;

    // once the product is shipped there is a timeframe to deliver it, otherwise contract gets terminated and manager(owner) covers the fees
    uint public maxDaysForDelivery;

    // once the product is delivered with a proof, there is a timeframe for the winner to approve it, otherwise contract gets terminated and the winner covers the fees
    uint public maxDaysForApproval;

    Status public status;

    address[] public participants;
    address public winner;

    mapping (address => bool) public currentEntries;

    modifier onlyIfSlotsFilled() {
        require(participants.length == maxSlots);
        _;
    }

    constructor(address _manager, 
                string memory _productIPFSId,
                string memory _productHash,
                string memory _location,
                string memory _carrier,
                uint _price,
                uint _maxSlots) payable {
        
        require(msg.value == COLLATERAL_MULTIPLIER * _price * 10 ** decimals());
        
        _transferOwnership(_manager);

        item = Item({ productIPFSId: _productIPFSId, productHash: _productHash });
        location = _location;
        carrier = _carrier;
        maxSlots = _maxSlots;
        price = _price;
        collateralBalance = msg.value / COLLATERAL_MULTIPLIER;
        ENTRY_AMOUNT = (price * 10 ** decimals() / maxSlots);
    }
  
    function enter() public payable {
        require(participants.length < maxSlots);
        require(msg.value == ENTRY_AMOUNT);

        if (currentEntries[msg.sender] == false) {
            currentEntries[msg.sender] = true;
            participants.push(msg.sender);
        } else {
            revert();
        }
    }
    
    function pickWinner() public onlyOwner onlyIfSlotsFilled {
        uint index = _random() % participants.length;
        winner = participants[index];
    }

    // function releaseFunds() public {
    //     winner.transfer(address(this).balance);
    //     participants = new address[](0);
    // }

    // TODO
    // use trully random number from off-chain
    function _random() private view returns (uint256) {
        return uint(keccak256(abi.encode(block.timestamp, block.difficulty, owner(), participants)));
    }

    function getEntryAmount() public view returns (uint) {
        return ENTRY_AMOUNT;
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }
    
    function getStats() public view returns (uint, address, address[] memory, uint, uint) {
        // TODO
        return (
            address(this).balance,
            owner(),
            participants,
            // winner,
            maxSlots,
            collateralBalance
            // maxDaysForEntrance,
            // maxDaysForShipping,
            // maxDaysForDelivery,
            // maxDaysForApproval
        );
    }

    function decimals() private pure returns (uint) {
        return 18;
    } 
}