export const challengeInfo = {
  "simple-counter-example": {
    id: 0,
    branchName: "counter",
    label: "🚩 Challenge 0: 🎟 Simple Counter Example",
    disabled: false,
    description:
      "🎫 Create a simple Counter to learn the basics of 🏗 scaffold-eth with RUST. You'll use 👷‍♀️ Stylus Nitro Devnode to compile and deploy your smart contracts. Then, you'll use a template React app filled with essential components and hooks. Finally, you'll deploy your Counter Contract to a public network to share with friends! 🚀",
    previewImage: "/assets/challenges/counter.svg",
    dependencies: [],
  },
  "simple-nft-example": {
    id: 1,
    branchName: "nft",
    label: "🚩 Challenge 1: 🖼️ Simple NFT Example",
    disabled: false,
    description:
      "Dive into creating an NFT project to master the essentials of 🛠 scaffold-eth with RUST. Use 💻 Stylus Nitro Devnode to design, compile, and deploy smart contracts that bring NFTs to life. Pair your work with a dynamic React app featuring all the tools 🧩. Wrap it up by deploying your NFT contract to a public network, where users can mint 🎟, verify 🔍, and manage their NFTs effortlessly! 🌐",
    previewImage: "/assets/challenges/simpleNFT.svg",
    dependencies: [],
  },
  "vending-machine": {
    id: 2,
    branchName: "vending-machine",
    label: "🚩 Challenge 2: 🏵 Vending Machine",
    icon: "/assets/key_icon.svg",
    disabled: false,
    description:
      "🤖 Vending machines meet blockchain! Let’s create a decentralized cupcake dispenser powered by a smart contract. Users can claim cupcakes (digital rewards) at intervals and track their balances on-chain. Learn how time-based access and contract-to-user interactions work seamlessly with Rust and Stylus. 🍰 Sweet, unstoppable, and fun!",
    previewImage: "/assets/challenges/tokenVendor.svg",
    dependencies: [],
  },
  "multisig-wallet": {
    id: 3,
    branchName: "multi-sig",
    label: "🚩 Challenge 3: 🎲 Multisig Wallet",
    disabled: false,
    description: `👩‍👩‍👧‍👧 A multi-signature smart contract secures assets by requiring multiple owners to confirm transactions before execution. Transactions are tracked in an array of TxStruct objects, and owners can submit, confirm, or revoke confirmations. A transaction is executed once it reaches the required number of confirmations, ensuring that no single owner can act alone, providing enhanced security for the assets.`,
    previewImage: "/assets/challenges/multiSig.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine"],
    dependencies: [],
  },
  "uniswap-v2-stylus": {
    id: 4,
    branchName: "stylus-uniswap",
    label: "🚩 Challenge 4: ⚖️ Uniswap-V2",
    disabled: false,
    description:
      "🔄 Uniswap V2! Build a Uniswap V2-style liquidity pool interface with smart contracts for token pair initialization, liquidity management, and token swaps. Utilize Arbitrum Stylus Nitro to deploy contracts, handle liquidity operations like minting and burning, and facilitate seamless token transfers with allowance management. Create an intuitive Next.js frontend to interact with the pool. Deploy your app to Vercel to provide users with a robust and accessible DeFi experience! 🚀",
    previewImage: "assets/challenges/dex.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "buidl-guidl": {
    id: 9999,
    branchName: "",
    label: "Eligible to join 🏰️ BuidlGuidl",
    icon: "/assets/vault_icon.svg",
    // Not a challenge, just a checkpoint in the Challenge timeline.
    checkpoint: true,
    disabled: false,
    description:
      "The Arbitrum Stylus Collective is a hub for innovative builders leveraging Stylus to push the boundaries of Web3. A space to showcase your Rust and Solidity creations, connect with fellow developers, and grow the ecosystem.",
    previewImage: "assets/bg.svg",
    dependencies: [],
    externalLink: {
      link: "https://buidlguidl.com/",
      claim: "Join the 🏰️ BuidlGuidl",
    },
  },
  "zkp-age": {
    id: 5,
    branchName: "stylus-zkp-age-verifier",
    label: "🚩 Challenge 5: 👶 ZKP - Age Verifier",
    disabled: false,
    description:
      "Build a privacy-preserving age verification system using Zero-Knowledge Proofs! Prove users are above a certain age (e.g., 18+) without revealing their exact birthdate or identity. Leverage ZK circuits to validate age data and integrate it into a slick Next.js frontend. Deploy on Arbitrum Stylus Nitro for lightning-fast proofs and privacy at scale. Wrap it up with a Vercel deployment for smooth, trustless age-gating in any app or platform!👶🛡️",
    previewImage: "assets/challenges/age.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-balance": {
    id: 6,
    branchName: "stylus-zkp-balance-checker",
    label: "🚩 Challenge 6: 💰 ZKP - Balance Checker",
    disabled: false,
    description:
      "🔐 Design a secure system that proves a user has a minimum token balance—without exposing the exact amount! Using ZKPs, generate proofs that validate wallet holdings above a threshold. Pair your smart contract logic on Arbitrum Stylus with a clean frontend that lets users verify balances privately. Great for token-gated access, whitelists, or DeFi participation. Ship it via Vercel for instant, privacy-first access. 🧮🔍",
    previewImage: "assets/challenges/balance.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-password": {
    id: 7,
    branchName: "stylus-zkp-password-verifier",
    label: "🚩 Challenge 7: 🔑 ZKP - Password Verifier",
    disabled: false,
    description:
      "🔑No more password sharing! Build a password verifier that confirms knowledge of a password without revealing it. Use ZK-SNARKs to create proof-of-knowledge circuits, deploy them on Arbitrum Stylus, and build a secure frontend to generate and verify proofs. Perfect for login systems, secret validation, or private voting. Launch on Vercel to deliver fast, trustless password validation. 🧠🔒🔑",
    previewImage: "assets/challenges/location.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-location": {
    id: 8,
    branchName: "stylus-zkp-location-verifier",
    label: "🚩 Challenge 8: 📍 ZKP - Location Verifier",
    disabled: false,
    description:
      "📍 Prove you’re in the right place—without revealing your location! Use Zero-Knowledge Proofs to create a location-based verifier app. Generate proofs that confirm geographic conditions (e.g., within a city or country) while keeping coordinates private. Deploy smart contracts on Arbitrum Stylus and build a map-friendly frontend with location privacy baked in. Perfect for geo-restricted content, voting, or access control. 🌍🛰️",
    previewImage: "assets/challenges/model.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-model": {
    id: 9,
    branchName: "stylus-zkp-model-verifier",
    label: "🚩 Challenge 9: 📊 ZKP - Model Verifier",
    disabled: false,
    description:
      "Prove your AI model meets required benchmarks or is built a certain way—without revealing the model itself! Use ZKPs to validate model accuracy, structure, or source on-chain. Deploy verification contracts via Arbitrum Stylus, build a frontend for model creators and consumers, and use Vercel for streamlined app delivery. Ideal for AI marketplaces, provable research, or secure collaboration. 🧠🧾",
    previewImage: "assets/challenges/model.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zk-email-verifier": {
    id: 10,
    branchName: "stylus-zkp-email-verifier",
    label: "🚩 Challenge 10: 📧 ZKP - Email Domain Verifier",
    disabled: false,
    comingSoon: true,
    description: "Build an app that verifies users own an email with a specific domain—without revealing the full address. Use ZKPs to prove domain membership (e.g., @university.edu) while keeping the full identity private. Arbitrum Stylus handles smart contract verification, and a frontend built with Next.js enables easy interactions. Deploy on Vercel for domain-gated access with bulletproof privacy. ✅📬",
    previewImage: "assets/challenges/email.svg",
    dependencies: []
  }
};

const githubChallengesRepoBaseRawUrl = "https://raw.githubusercontent.com/abhi152003/speedrun_stylus";

export const getGithubChallengeReadmeUrl = challengeId =>
  `${githubChallengesRepoBaseRawUrl}/${challengeInfo[challengeId].branchName}/README.md`;