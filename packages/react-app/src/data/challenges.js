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
    previewImage: "assets/bg.png",
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
      "🔐 Master Zero-Knowledge Proofs with Arbitrum Stylus! Build and deploy a smart contract that utilizes ZKPs for private age verification, enabling users to prove their age without revealing their birthdate. Spin up an Arbitrum Stylus Nitro dev node, design an intuitive age verification circuit, and integrate a React-powered frontend for seamless proof generation and verification. Deploy your contract to a public testnet and publish your app on Vercel, creating a user-friendly platform for secure and efficient age validation on the blockchain. 🚀 Dive in to explore the cutting edge of blockchain privacy with age verification!",
    previewImage: "assets/challenges/zkp.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-balance": {
    id: 6,
    branchName: "stylus-zkp-balance-checker",
    label: "🚩 Challenge 6: 💰 ZKP - Balance Checker",
    disabled: false,
    description:
      "🔐 Unlock the Power of Zero-Knowledge Proofs with Arbitrum Stylus! Create and deploy a smart contract that leverages ZKPs for private balance verification, allowing users to confirm their balance without disclosing the exact amount. Set up an Arbitrum Stylus Nitro dev node, design a sophisticated balance verification circuit, and integrate a sleek Next.js frontend for effortless proof generation and validation. Deploy your contract to a public testnet and launch your application on Vercel, establishing a user-friendly platform for secure and efficient balance checks on the blockchain. 🚀 Immerse yourself in the forefront of blockchain privacy with balance verification!",
    previewImage: "assets/challenges/zkp.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-password": {
    id: 7,
    branchName: "stylus-zkp-password-verifier",
    label: "🚩 Challenge 7: 🔑 ZKP - Password Verifier",
    disabled: false,
    description:
      "🔑 Unlock the potential of Zero-Knowledge Proofs with Arbitrum Stylus! Build and deploy a smart contract that uses ZKPs for private password verification, allowing users to prove they know a password without revealing the actual password. Set up an Arbitrum Stylus Nitro dev node, create a smart password verification circuit, and integrate a user-friendly Next.js frontend for easy proof generation and checking. Deploy your contract to a public testnet and launch your application on Vercel, providing a simple platform for secure and efficient password checks on the blockchain. 🚀 Dive into the exciting world of blockchain privacy with password verification!",
    previewImage: "assets/challenges/zkp.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-location": {
    id: 8,
    branchName: "stylus-zkp-location-verifier",
    label: "🚩 Challenge 8: 📍 ZKP - Location Verifier",
    disabled: false,
    description:
      "📍 Unlock the potential of Zero-Knowledge Proofs with Arbitrum Stylus! Build and deploy a smart contract that uses ZKPs for private location verification, allowing users to prove they are within a specific geographic region (like California) without revealing their exact coordinates. Set up an Arbitrum Stylus Nitro dev node, create a smart location verification circuit, and integrate a user-friendly Next.js frontend for easy proof generation and checking. Deploy your contract to a public testnet and launch your application on Vercel, providing a simple platform for secure and efficient location verification on the blockchain. 🚀 Dive into the exciting world of blockchain privacy with location-based verification!",
    previewImage: "assets/challenges/zkp.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zkp-model": {
    id: 9,
    branchName: "stylus-zkp-model-verifier",
    label: "🚩 Challenge 9: 📊 ZKP - Model Verifier",
    disabled: false,
    description:
      "🧠🤖📊 Unlock the power of Zero-Knowledge Proofs with Arbitrum Stylus! Build and deploy a smart contract that utilizes ZKPs for private model verification, enabling users to prove the accuracy of their model computations without disclosing sensitive parameters. Set up an Arbitrum Stylus Nitro dev node, create a robust model verification circuit, and integrate a user-friendly Next.js frontend for seamless proof generation and validation. Deploy your contract to a public testnet and launch your application on Vercel, offering a straightforward platform for secure and efficient model verification on the blockchain. 🚀 Immerse yourself in the innovative realm of blockchain privacy with model-based verification!",
    previewImage: "assets/challenges/zkp.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  },
  "zk-email-verifier": {
    id: 10,
    branchName: "stylus-zkp-email-verifier",
    label: "🚩 Challenge 10: 📧 ZKP - Email Domain Verifier",
    disabled: false,
    comingSoon: true,
    description: "🧠📧🔒 Dive into the world of Zero-Knowledge Proofs with Arbitrum Stylus! Build and deploy a smart contract that leverages ZKPs to privately verify email domain ownership, allowing users to prove their email belongs to a specific domain (e.g., 'gmail.com') without revealing the full email address. Set up an Arbitrum Stylus Nitro dev node, create an optimized email domain verification circuit using the ZK Email SDK, and integrate a Next.js frontend for effortless proof generation and validation. Deploy your contract to a public testnet and host your application on Vercel, delivering a secure, privacy-preserving email verification platform on the blockchain. 🚀 Explore cutting-edge blockchain privacy with this innovative email verification challenge!",
    previewImage: "assets/challenges/zkp.svg",
    dependencies: []
  }
};

const githubChallengesRepoBaseRawUrl = "https://raw.githubusercontent.com/abhi152003/speedrun_stylus";

export const getGithubChallengeReadmeUrl = challengeId =>
  `${githubChallengesRepoBaseRawUrl}/${challengeInfo[challengeId].branchName}/README.md`;