const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  

    const[deployer,arbiter,beneficiary]=await ethers.getSigners();
  console.log(`deployer:${deployer.address},
               arbiter:${arbiter.address},
               beneficiary:${beneficiary.address},
  `)  
  //console.log("Deploying with address:",deployer.address);
  const stakerAddress="0x5fbdb2315678afecb367f032d93f642f64180aa3"
  //const weiAmount=(await deployer.getBalance()).toString();
  const address="0x49d214291B14373292A66c4dfa4d8E25A99f9a88"
  //console.log("Account balance:",ethers.utils.formatEther(weiAmount));
  const value= ethers.utils.parseEther("50")
  const Escrow=await ethers.getContractFactory("Escrow");
  const escrow=await Escrow.deploy(arbiter.address,beneficiary.address,true,stakerAddress,{value});
  await escrow.deployed();
  console.log("Escrow Deploy address:",escrow.address)
 //Escrow contract deployed on 0x0a2a587F198DE25a9BFA6aDb2E1485eB180f094C


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});