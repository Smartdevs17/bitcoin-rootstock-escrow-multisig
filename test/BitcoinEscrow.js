const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("BitcoinEscrow", function () {
  async function deployEscrowFixture() {
    const [owner, buyer, seller] = await ethers.getSigners();
    const amount = ethers.parseEther("1"); // 1 ETH/RBTC escrow
    const disputeWindow = 7 * 24 * 60 * 60; // 7 days in seconds

    const BitcoinEscrow = await ethers.getContractFactory("BitcoinEscrow");
    const escrow = await BitcoinEscrow.connect(buyer).deploy(
      seller.address, 
      { value: amount }
    );

    return { escrow, owner, buyer, seller, amount, disputeWindow };
  }

  describe("Deployment", function () {
    it("Should set the correct buyer, seller, and amount", async function () {
      const { escrow, buyer, seller, amount } = await loadFixture(deployEscrowFixture);
      
      expect(await escrow.buyer()).to.equal(buyer.address);
      expect(await escrow.seller()).to.equal(seller.address);
      expect(await escrow.amount()).to.equal(amount);
    });

    it("Should initialize with funds locked", async function () {
      const { escrow, amount } = await loadFixture(deployEscrowFixture);
      expect(await ethers.provider.getBalance(escrow.target)).to.equal(amount);
    });
  });

  describe("Bitcoin TX Hash", function () {
    it("Should allow buyer or seller to set Bitcoin TX hash", async function () {
      const { escrow, buyer, seller } = await loadFixture(deployEscrowFixture);
      const txHash = ethers.zeroPadValue("0x1234abcd", 32);

      await expect(escrow.connect(buyer).setBitcoinTxHash(txHash))
        .not.to.be.reverted;
      expect(await escrow.bitcoinTxHash()).to.equal(txHash);

      const newTxHash = ethers.zeroPadValue("0x1234bcdf", 32);
      await escrow.connect(seller).setBitcoinTxHash(newTxHash);
      expect(await escrow.bitcoinTxHash()).to.equal(newTxHash);
    });

    it("Should reject unauthorized parties", async function () {
      const { escrow, owner } = await loadFixture(deployEscrowFixture);
        const txHash = ethers.zeroPadValue("0x1234abcd", 32);
      await expect(escrow.connect(owner).setBitcoinTxHash(txHash))
        .to.be.revertedWith("Unauthorized");
    });
  });

  describe("Funds Release", function () {
    it("Should release funds to seller (owner only)", async function () {
        const { escrow, seller, amount } = await loadFixture(deployEscrowFixture);
        
        // Get initial balance
        const initialBalance = await ethers.provider.getBalance(seller.address);
        
        // Execute and capture transaction
        const tx = await escrow.releaseFunds();
        
        // Check balance change
        const finalBalance = await ethers.provider.getBalance(seller.address);
        expect(finalBalance - initialBalance).to.equal(amount);
        
        // Check event
        await expect(tx)
          .to.emit(escrow, "FundsReleased")
          .withArgs(seller.address);
      });

    it("Should prevent double-spending", async function () {
      const { escrow } = await loadFixture(deployEscrowFixture);
      await escrow.releaseFunds();
      await expect(escrow.releaseFunds()).to.be.revertedWith("Funds already released");
    });
  });

  describe("Dispute Resolution", function () {
    it("Should allow buyer/seller to initiate dispute within window", async function () {
      const { escrow, buyer, seller, disputeWindow } = await loadFixture(deployEscrowFixture);
      
      await expect(escrow.connect(buyer).initiateDispute())
        .to.emit(escrow, "DisputeInitiated").withArgs(buyer.address);

      // Fast-forward to just before deadline
      await time.increase(disputeWindow - 60); 
      await expect(escrow.connect(seller).initiateDispute()).not.to.be.reverted;
    });

    it("Should reject disputes after deadline", async function () {
      const { escrow, buyer, disputeWindow } = await loadFixture(deployEscrowFixture);
      await time.increase(disputeWindow + 1);
      await expect(escrow.connect(buyer).initiateDispute())
        .to.be.revertedWith("Dispute window closed");
    });
  });
});