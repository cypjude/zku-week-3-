pragma circom 2.0.3;

include "circomlib/circuits/mimcsponge.circom";

template suiteVerify () {
    // user provies new card commitment
    // note, newCard can be any integer, as long as 
    // newCard % 13 resolves to the correct "base number" 
    // in the range [0, 13]
    // private
    signal input newCard;
    signal input newCardSuite;

    // outputs: card number hash
    // public
    signal output cardHash;
    signal output cardSuite;

    // hash the card twice
    component hash0 = MiMCSponge(2, 0, 1);
    hash0.ins[0] <== newCard;
    hash0.ins[1] <== newCardSuite;

    component hash1 = MiMCSponge(1, 0, 1);
    hash1.ins[0] <== hash0.outs[0];

    // output the card and the suite
    cardHash <== hash1.outs[0];
    cardSuite <== newCardSuite % 4;
}

component main = suiteVerify();