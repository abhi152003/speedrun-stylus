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
  "zero-knowledge-proofs": {
    id: 5,
    branchName: "stylus-zkp",
    label: "🚩 Challenge 5: 📺 ZKP-Based Contract Interactions",
    disabled: false,
    description:
      "🔐 Master Zero-Knowledge Proofs with Arbitrum Stylus! Build and deploy smart contracts that utilize ZKPs for private verification, enabling age validation, balance checks, and password authentication. Spin up an Arbitrum Stylus Nitro dev node, design intuitive circuits, and integrate a React-powered frontend for seamless proof generation and verification. Deploy your contracts to a public testnet and publish your app on Vercel, creating a user-friendly platform for secure and efficient blockchain interactions. 🚀 Dive in to explore the cutting edge of blockchain privacy!",
    previewImage: "assets/challenges/zkp.svg",
    // dependencies: ["simple-counter-example", "simple-nft-example", "vending-machine", "multisig-wallet"],
    dependencies: [],
  }
};

const githubChallengesRepoBaseRawUrl = "https://raw.githubusercontent.com/abhi152003/speedrun-rust";

export const getGithubChallengeReadmeUrl = challengeId =>
  `${githubChallengesRepoBaseRawUrl}/${challengeInfo[challengeId].branchName}/README.md`;