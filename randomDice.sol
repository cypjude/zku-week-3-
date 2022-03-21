// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract randomDice {
  function roll(uint256 randomNumber)
    external
    returns(bytes32)
  {
    require(randomNumber > 100000, "not random enough");
    bytes32 block = block.hash;
    return keccak256(abi.encodePacked(block, randomNumber));
  }
}
