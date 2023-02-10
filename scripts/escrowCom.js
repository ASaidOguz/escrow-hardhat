const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  

  const[deployer,arbiter,beneficiary,random_Signer]=await ethers.getSigners();
  console.log(`
  deployer:${deployer.address},
  arbiter:${arbiter.address},
  beneficiary:${beneficiary.address},
  random signer:${random_Signer.address}
  `);
  //console.log("Deploying with address:",deployer.address);
  const stakerAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const escrowAddress="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  //const weiAmount=(await deployer.getBalance()).toString();
  
  //console.log("Account balance:",ethers.utils.formatEther(weiAmount));
  //const value=await ethers.utils.parseEther("50")
 const stakerBalance=await ethers.provider.getBalance(stakerAddress);
 const escrowBalance=await ethers.provider.getBalance(escrowAddress);
 const value= ethers.utils.parseEther("50")
 console.log("Staker Balance:",ethers.utils.formatEther(stakerBalance));
 console.log("Escrow Balance",ethers.utils.formatEther(escrowBalance));
 
const escrow=await ethers.getContractAt("Escrow",escrowAddress);
const staker=await ethers.getContractAt("Staker",stakerAddress);
//const timestamp=await staker.checkdepositTimestamps(deployer.address);
const weeks_12=1675435042+7257900; 
//console.log(timestamp)
await ethers.provider.send("evm_mine", [weeks_12]);

await escrow.connect(arbiter).approve();

//const timestamp=await staker.checkdepositTimestamps(escrowAddress);
//console.log("Time stamp for deployer:",timestamp)
const beneficiaryBalance=await ethers.provider.getBalance(beneficiary.address);
console.log("Beneficiary balance:",ethers.utils.formatEther(beneficiaryBalance));
const stakerBlncFinal=await ethers.provider.getBalance(stakerAddress);
console.log("Staker final balance:",ethers.utils.formatEther(stakerBlncFinal));


//console.log("Interest value:",ethers.utils.formatEther(interest_value));

const deployersBalance=await ethers.provider.getBalance(deployer.address);
console.log("Deployer's final balance:",ethers.utils.formatEther(deployersBalance))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});