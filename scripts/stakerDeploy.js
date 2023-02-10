const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    //const[deployer,arbiter,beneficiary]=await ethers.getSigners();
  /*   console.log(`deployer:${deployer.address},
                 arbiter:${arbiter.address},
                 beneficiary:${beneficiary.address},
    `) */


  //console.log("Deploying with address:",deployer.address);

  //const weiAmount=(await deployer.getBalance()).toString();

  //console.log("Account balance:",ethers.utils.formatEther(weiAmount));

  const Staker=await ethers.getContractFactory("Staker");
  const staker=await Staker.deploy();
  await staker.deployed();
  console.log("Staker Deploy address:",staker.address)
//Staker contract was deployed on goerli testnet ==> 0x7852fa36e0a782C3ea0A3F99A797A64b3998299F
//Contract verified at 2:55 AM 1/31/2023
// link: https://goerli.etherscan.io/address/0x7852fa36e0a782C3ea0A3F99A797A64b3998299F#code
}
//gas used:1714726 of 1714726 local ----> escrow gas price 689693 of 689693
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});