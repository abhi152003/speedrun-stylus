const challengeMapping = {
  "simple-counter-example": {
    id: 0,
    autograding: true,
  },
  "simple-nft-example": {
    id: 1,
    autograding: true,
  },
  "vending-machine": {
    id: 2,
    autograding: true,
  },
  "multisig-wallet": {
    id: 3,
    autograding: true,
  },
  "uniswap-v2-stylus": {
    id: 4,
    autograding: true,
  },
  "zero-knowledge-proofs": {
    id: 5,
    autograding: true,
  },
  "learn-multisig": {
    id: 6,
    autograding: false,
  },
  "nft-cohort": {
    id: 7,
    autograding: false,
  },
};

function getChallengeIndexFromChallengeId(challengeId) {
  return challengeMapping[challengeId]?.id;
}

function isAutogradingEnabledForChallenge(challengeId) {
  return challengeMapping[challengeId]?.autograding;
}

module.exports = {
  getChallengeIndexFromChallengeId,
  isAutogradingEnabledForChallenge,
};