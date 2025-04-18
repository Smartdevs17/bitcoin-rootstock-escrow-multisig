// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SMALL_AMOUNT_ETH = 100_000_000_000_000n; // 0.0001 ETH in wei
module.exports = buildModule("BitcoinEscrowModule", (m) => {
    const sellerAddress = m.getParameter("sellerAddress", "0x1234567890abcdef1234567890abcdef12345678");
    const escrowAmount = m.getParameter("escrowAmount", SMALL_AMOUNT_ETH);

    const bitcoinEscrow = m.contract("BitcoinEscrow", [sellerAddress], {
        value: escrowAmount,
    });

  return { bitcoinEscrow };
});