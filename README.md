# Bitcoin Rootstock Escrow Multisig

This project implements a Bitcoin escrow smart contract on the Rootstock blockchain. It allows a buyer and seller to lock funds in escrow, release funds upon successful transaction completion, and resolve disputes within a specified window.

## Features

- **Escrow Contract**: Securely locks funds between a buyer and seller.
- **Dispute Resolution**: Allows disputes to be initiated within a 7-day window.
- **Bitcoin Transaction Hash**: Supports linking Bitcoin transaction hashes to the escrow.
- **Hardhat Ignition**: Simplifies deployment and management of the contract.

## Project Structure

```
.env
.gitignore
hardhat.config.js
package.json
README.md
contracts/
  BitcoinEscrow.sol
ignition/
  modules/
    BitcoinEscrow.js
  deployments/
    chain-31/
test/
  BitcoinEscrow.js
scripts/
  deployBitcoinEscrow.js
```

## Prerequisites

- Node.js and npm installed.
- Hardhat installed globally or locally in the project.
- Rootstock-compatible wallet and network configuration.

## Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/Smartdevs17/bitcoin-rootstock-escrow-multisig.git
   cd bitcoin-rootstock-escrow-multisig
   ```

2. Install dependencies:
   ```shell
   npm install
   ```

3. Configure environment variables in `.env` (e.g., private keys, network URLs).

## Deployment

To deploy the `BitcoinEscrow` contract, use the provided deployment script:

```shell
npx hardhat run scripts/deployBitcoinEscrow.js --network <network-name>
```

Alternatively, use Hardhat Ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/BitcoinEscrow.js --network rootstock
```

## Testing

Run the test suite to ensure the contract behaves as expected:

```shell
npx hardhat test
```

## Usage

1. Deploy the contract using the deployment script or Ignition.
2. Interact with the contract using Hardhat tasks, scripts, or a frontend application.
3. Monitor events such as `FundsLocked`, `FundsReleased`, and `DisputeInitiated`.

## License

This project is licensed under the MIT License.