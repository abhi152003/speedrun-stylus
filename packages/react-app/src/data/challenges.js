export const challengeInfo = {
  "simple-counter-example": {
    id: 0,
    branchName: "counter",
    label: "🚩 Challenge 0: 🎟 Simple Counter Example",
    disabled: false,
    description:
      "🎫 Create a simple Counter to learn the basics of 🏗 scaffold-eth with RUST. You'll use 👷‍♀️ Stylus Nitro Devnode to compile and deploy your smart contracts. Then, you'll use a template React app filled with essential Ethereum components and hooks. Finally, you'll deploy your Counter Contract to a public network to share with friends! 🚀",
    previewImage: "/assets/challenges/stakingToken.svg",
    dependencies: [],
  },
  "simple-nft-example": {
    id: 1,
    branchName: "nft",
    label: "🚩 Challenge 1: 🖼️ Simple NFT Example",
    disabled: false,
    description:
      "Dive into creating an NFT project to master the essentials of 🛠 scaffold-eth with RUST. Use 💻 Stylus Nitro Devnode to design, compile, and deploy smart contracts that bring NFTs to life. Pair your work with a dynamic React app featuring all the tools 🧩 you need to interact with Ethereum. Wrap it up by deploying your NFT contract to a public network, where users can mint 🎟, verify 🔍, and manage their NFTs effortlessly! 🌐",
    previewImage: "/assets/challenges/simpleNFT.svg",
    dependencies: [],
  },
  "token-vendor": {
    id: 2,
    branchName: "challenge-2-token-vendor",
    label: "🚩 Challenge 2: 🏵 Token Vendor",
    icon: "/assets/key_icon.svg",
    disabled: false,
    description:
      '🤖 Smart contracts are kind of like "always on" vending machines that anyone can access. Let\'s make a decentralized, digital currency (an ERC20 token). Then, let\'s build an unstoppable vending machine that will buy and sell the currency. We\'ll learn about the "approve" pattern for ERC20s and how contract to contract interactions work.',
    previewImage: "/assets/challenges/tokenVendor.svg",
    dependencies: [],
  },
  "dice-game": {
    id: 3,
    branchName: "challenge-3-dice-game",
    label: "🚩 Challenge 3: 🎲 Dice Game",
    disabled: false,
    description:
      "🎰 Randomness is tricky on a public deterministic blockchain. The block hash is the result proof-of-work (for now) and some builders use this as a weak form of randomness.  In this challenge you will take advantage of a Dice Game contract by predicting the randomness in order to only roll winning dice!",
    previewImage: "/assets/challenges/diceGame.svg",
    dependencies: ["simple-counter-example", "simple-nft-example", "token-vendor"],
  },
  "minimum-viable-exchange": {
    id: 4,
    branchName: "challenge-4-dex",
    label: "🚩 Challenge 4: ⚖️ Build a DEX",
    disabled: false,
    description:
      "💵 Build an exchange that swaps ETH to tokens and tokens to ETH. 💰 This is possible because the smart contract holds reserves of both assets and has a price function based on the ratio of the reserves. Liquidity providers are issued a token that represents their share of the reserves and fees...",
    previewImage: "assets/challenges/dex.svg",
    dependencies: ["simple-counter-example", "simple-nft-example", "token-vendor", "dice-game"],
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
      "The BuidlGuidl is a curated group of Ethereum builders creating products, prototypes, and tutorials to enrich the web3 ecosystem. A place to show off your builds and meet other builders. Start crafting your Web3 portfolio by submitting your DEX, Multisig or SVG NFT build.",
    previewImage: "assets/bg.png",
    dependencies: [
      "simple-counter-example",
      "simple-nft-example",
      "token-vendor",
      "dice-game",
      "minimum-viable-exchange",
    ],
    externalLink: {
      link: "https://buidlguidl.com/",
      claim: "Join the 🏰️ BuidlGuidl",
    },
  },
  "state-channels": {
    id: 5,
    branchName: "challenge-5-state-channels",
    label: "🚩 Challenge 5: 📺 A State Channel Application",
    disabled: false,
    description:
      "🛣️ The Ethereum blockchain has great decentralization & security properties but these properties come at a price: transaction throughput is low, and transactions can be expensive. This makes many traditional web applications infeasible on a blockchain... or does it?  State channels look to solve these problems by allowing participants to securely transact off-chain while keeping interaction with Ethereum Mainnet at a minimum.",
    previewImage: "assets/challenges/state.svg",
    dependencies: ["simple-counter-example", "simple-nft-example", "token-vendor", "dice-game"],
  },
  "learn-multisig": {
    id: 6,
    branchName: "challenge-3-multi-sig",
    label: "👛 Multisig Wallet Challenge",
    disabled: false,
    description:
      '👩‍👩‍👧‍👧 Using a smart contract as a wallet we can secure assets by requiring multiple accounts to "vote" on transactions. The contract will keep track of transactions in an array of structs and owners will confirm or reject each one. Any transaction with enough confirmations can "execute".',
    previewImage: "assets/challenges/multiSig.svg",
    // Challenge locked until the builder completed these challenges
    dependencies: ["simple-counter-example", "simple-nft-example", "token-vendor", "dice-game"],
    // Once the dependencies are completed, lock the challenge until
    // This will make the challenge to link to the externalLink, instead of the challenge detail view.
    externalLink: {
      link: "https://t.me/+zKllN8OlGuxmYzFh",
      claim: "Join the 👛 Multisig Build cohort",
    },
  },
  "nft-cohort": {
    id: 7,
    branchName: "challenge-5-svg-nft-cohort",
    label: "🎁 SVG NFT 🎫 Challenge",
    disabled: false,
    description:
      "🎨 Create a dynamic SVG NFT using a smart contract. Your contract will generate on-chain SVG images and allow users to mint their unique NFTs. ✨ Customize your SVG graphics and metadata directly within the smart contract. 🚀 Share the minting URL once your project is live!",
    previewImage: "assets/challenges/dynamicSvgNFT.svg",
    // Challenge locked until the builder completed these challenges
    dependencies: ["simple-counter-example", "simple-nft-example", "token-vendor", "dice-game"],
    // Once the dependencies are completed, lock the challenge until
    // This will make the challenge to link to the externalLink, instead of the challenge detail view.
    externalLink: {
      link: "https://t.me/+mUeITJ5u7Ig0ZWJh",
      claim: "Join the 🎁 SVG NFT 🎫 Building Cohort",
    },
  },
};

const githubChallengesRepoBaseRawUrl = "https://raw.githubusercontent.com/abhi152003/speedrun-rust";

export const getGithubChallengeReadmeUrl = challengeId =>
  `${githubChallengesRepoBaseRawUrl}/${challengeInfo[challengeId].branchName}/README.md`;