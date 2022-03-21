// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract randomMultiDice {

  mapping(address => int) membersVoteCount;
  uint256 memberCallCount = 0;
  uint256 maxMembers;
  
  bytes32 hash;

  contructor(address[] members){
    for(uint i = 0; i < members.length; i++){
      members[i] = 0;
    }
    maxMembers = members.length;
  }

  function roll(uint256 randomNumber)
    external
    returns(bytes32)
  {
    require(membersVoteCount[msg.sender] == 0);
    require(randomNumber > 100000, "not random enough");
    membersVoteCount[msg.sender]++;
    bytes32 block = block.hash;
    hash = abi.encodePacked(hash, randomNumber);
    if(memberCallCount == maxMembers){
      return keccak256(abi.encodePacked(hash, block));
    }
  }
}
