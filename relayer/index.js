const { ethers } = require("ethers");
const { abi: BitcoinEscrowABI } = require("../artifacts/contracts/BitcoinEscrow.sol/BitcoinEscrow.json");
require("dotenv").config();

if (!process.env.ESCROW_ADDRESS) {
    throw new Error("ESCROW_ADDRESS is not defined in the environment variables.");
}

// 1. Setup Providers
const rskProvider = new ethers.JsonRpcProvider(process.env.RSK_TESTNET_RPC_URL);
const escrow = new ethers.Contract(
  process.env.ESCROW_ADDRESS,
  BitcoinEscrowABI,
  rskProvider
);

// 2. Poll for Lock events
const filter = {
    address: process.env.ESCROW_ADDRESS,
    topics: [ethers.id("FundsLocked(address,uint256)")]
};

async function pollEvents() {
    console.log("Polling for FundsLocked events...");
    const logs = await rskProvider.getLogs(filter);

    for (const log of logs) {
        const parsedLog = escrow.interface.parseLog(log);
        const buyer = parsedLog.args[0];
        const amount = parsedLog.args[1];
        console.log(`New escrow created by ${buyer} for ${amount}`);

        // 3. Check Bitcoin TX (mock for now)
        const bitcoinTxFound = await checkBitcoinTx(buyer);

        if (bitcoinTxFound) {
            const tx = await escrow.releaseFunds();
            await tx.wait();
            console.log(`Released funds! TX: ${tx.hash}`);
        }
    }
}

// Poll every 10 seconds
setInterval(pollEvents, 10000);

// Mock function for checking Bitcoin TX
async function checkBitcoinTx(buyer) {
    console.log(`Checking Bitcoin transaction for buyer: ${buyer}`);
    // Simulate Bitcoin TX check
    return true; // Replace with actual logic
}