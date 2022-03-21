// SPDX-License-Identifier: GPL-3.0

interface Verifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[6] memory input
    ) external view returns (bool);
}

pragma solidity ^0.8.0;

contract move {

    mapping(address => uint[6]) public playerLocations;

    address verifierAddress;
    constructor(address verifier){
        verifierAddress = verifier;
    }

    function movePlayer(
            address player,
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[6] memory input
        ) public returns (bool) 
    {
        require(Verifier(verifierAddress).verifyProof(a, b, c, input));
        playerLocations[player] = input;
        return true;
    }
}