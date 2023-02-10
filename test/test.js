const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Staker-Escrow Contract Testing', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  let staker 
  const deposit = ethers.utils.parseEther('50');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);
    const withInterest=true;
    //initialize staker contract and deploy it!
    const Staker=await ethers.getContractFactory('Staker');
     staker=await Staker.deploy();
    await staker.deployed();
    //initialize escrow contract and deploy it!
    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      withInterest,
      staker.address,
      {
        value: deposit,
      }
    );
    await contract.deployed();
    //let's fund the staker contract so we can send the interest amount
    //in the interest calculation for 50 ether it's roughly 3,57 ether for 3 month
    const amount = ethers.utils.parseEther('5');
    await depositor.sendTransaction({
      to: staker.address,
      value: amount,
    });
   
  });

  it('should be funded initially the staker contract via escrow', async function () {
    let balance = await ethers.provider.getBalance(staker.address);
    expect(balance).to.be.above(deposit);
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });
  describe('after approval from address cant approve again', () => {
    it('should revert', async () => {
      const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log("Time stamp:",timestamp)
      const weeks_12=timestamp+7257900; 
      await ethers.provider.send("evm_mine", [weeks_12]);
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      await expect(contract.connect(arbiter).approve()).to.be.reverted;
    });
  });
  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary and interest amount to depositor', async () => {
      const beforeDeposit=await ethers.provider.getBalance(depositor.getAddress());
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      
      
      const interest_value=ethers.utils.parseEther('3.57');
      //get time stamp and do fast forward for local blockchain...
      const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
      console.log("Time stamp:",timestamp)
      const weeks_12=timestamp+7257900; 
      await ethers.provider.send("evm_mine", [weeks_12]);
      //approve the contract as arbiter...
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();

      const afterDeposit=await ethers.provider.getBalance(depositor.getAddress());
      console.log("Before deposit:",ethers.utils.formatEther(beforeDeposit))
      console.log("After deposit:",ethers.utils.formatEther(afterDeposit));
      console.log("Interest value after approval:",ethers.utils.formatEther(afterDeposit.sub(beforeDeposit)));
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(afterDeposit.sub(beforeDeposit)).to.be.above(interest_value);
      expect(after.sub(before)).to.eq(deposit);
    });
  });
});
