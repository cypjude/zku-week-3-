// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./circom/verifier.sol";

contract cardGame {

  // define a card as a proof
  struct cardProof {
    uint256[2] _a;
    uint256[2][2] _b;
    uint256[2] _c;
    uint256[9] _input;
  }
  
  // this is like a modular card-deck. We push a new card onto it everytime
  // somone adds a card to the deck
  mapping(cardProof => bool) spades;
  mapping(cardProof => bool) clubs;
  mapping(cardProof => bool) hearts;
  mapping(cardProof => bool) diamonds;

  cardProof prevCard;

  // here, we take the new card and old card, and verify that they are of the same suite
  // test
  function verifyNewCompare(
    uint256[2] memory _a,
    uint256[2][2] memory _b,
    uint256[2] memory _c,
    uint256[9] memory _input
  ) external returns (bool) {
    cardProof newProof;
    newProof._a = _a;
    newProof._b = _b;
    newProof._c = _c;
    newProof._input = _input;

    bool bothSpades = (spades[Verifier.verify(_a, _b, _c, _input)] == true) && (spades[Verifier.verify(prevCard._a, prevCard._b, prevCard._c, prevCard._input)] == true);
    bool bothClubs = (clubs[Verifier.verify(_a, _b, _c, _input)] == true) && (clubs[Verifier.verify(prevCard._a, prevCard._b, prevCard._c, prevCard._input)] == true);
    bool bothHearts = (hearts[Verifier.verify(_a, _b, _c, _input)] == true) && (hearts[Verifier.verify(prevCard._a, prevCard._b, prevCard._c, prevCard._input)] == true);
    bool bothDiamonds = (diamonds[Verifier.verify(_a, _b, _c, _input)] == true) && (diamonds[Verifier.verify(prevCard._a, prevCard._b, prevCard._c, prevCard._input)] == true);
    bool isMatch = bothSpades || bothClubs || bothHearts || bothDiamonds;
    return isMatch;
  }
}
