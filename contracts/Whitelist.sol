//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    uint256 public maxWhitelistedAddresses;
    uint256 public numberOfWhitelistedAddresses;
    mapping(address => bool) public whitelistedAddresses;

    constructor(uint256 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(
            !whitelistedAddresses[msg.sender],
            "This address is already in whitelist"
        );
        require(
            numberOfWhitelistedAddresses < maxWhitelistedAddresses,
            "Limit of whitelisted addresses reached!"
        );

        whitelistedAddresses[msg.sender] = true;
        numberOfWhitelistedAddresses += 1;
    }
}
