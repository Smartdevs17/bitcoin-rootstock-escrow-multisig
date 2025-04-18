require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC = process.env.SEPOLIA_RPC;
const RSK_TESTNET_RPC_URL = process.env.RSK_TESTNET_RPC_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const RSK_TESTNET_API_KEY = process.env.RSK_TESTNET_API_KEY; // Add your RSK Testnet API key here

if (!RSK_TESTNET_RPC_URL) {
  throw new Error("The RPC URL for the testnet is not configured.");
}

if (!WALLET_PRIVATE_KEY) {
  throw new Error("Private key is not configured.");
}

if (!RSK_TESTNET_API_KEY) {
  throw new Error("RSK Testnet API key is not configured.");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    rootstock: {
      url: RSK_TESTNET_RPC_URL,
      chainId: 31,
      gasPrice: 90000000,
      accounts: [WALLET_PRIVATE_KEY],
    },
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      rskTestnet: RSK_TESTNET_API_KEY, // Use the same name as the custom chain
      rskTestnet: RSK_TESTNET_API_KEY, // Use the same name as the custom chain
    },
    customChains: [
      {
        network: "rskTestnet",
        chainId: 31,
        urls: {
          apiURL: "https://rootstock-testnet.blockscout.com/api/",
          browserURL: "https://rootstock-testnet.blockscout.com/",
        }
      },
      {
        network: "rskMainnet",
        chainId: 30,
        urls: {
          apiURL: "https://rootstock.blockscout.com/api/",
          browserURL: "https://rootstock.blockscout.com/",
        }
      },
    ]
  },
  sourcify: {
    enabled: false
  }
};