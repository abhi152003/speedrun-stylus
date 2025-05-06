// Types to import from both schema/db and client
export enum ReviewAction {
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
  SUBMITTED = "SUBMITTED",
}

export enum UserRole {
  USER = "USER",
  BUILDER = "BUILDER",
  ADMIN = "ADMIN",
}

export enum ChallengeId {
  SIMPLE_COUNTER_EXAMPLE = "simple-counter-example",
  SIMPLE_NFT_EXAMPLE = "simple-nft-example",
  VENDING_MACHINE = "vending-machine",
  MULTISIG_WALLET = "multisig-wallet",
  UNISWAP_V2_STYLUS = "uniswap-v2-stylus",
  BUIDL_GUIDL = "buidl-guidl",
  ZKP_AGE = "zkp-age",
  ZKP_BALANCE = "zkp-balance",
  ZKP_PASSWORD = "zkp-password",
  ZKP_LOCATION = "zkp-location",
  ZKP_MODEL = "zkp-model",
  ZKP_PUBLIC_DOC_VERIFIER = "zkp-public-doc-verifier",
}

export enum BatchStatus {
  CLOSED = "closed",
  OPEN = "open",
}

export enum BatchUserStatus {
  GRADUATE = "graduate",
  CANDIDATE = "candidate",
}
