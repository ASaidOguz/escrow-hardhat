require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
const defaultNetwork = "localhost";
module.exports = {
  solidity: "0.8.17",
  defaultNetwork,
  
  paths: {
    artifacts: "./app/src/artifacts",
  }
};
