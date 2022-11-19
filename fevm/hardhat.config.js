require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "wallaby",
  networks: {
    wallaby: {
      url: "https://wallaby.node.glif.io/rpc/v0",
      accounts: [PRIVATE_KEY],
    },
    granache: {
      url: "http://127.0.0.1:8545",
      accounts: ["7345e2d4b9121fe5152a07996ef141cbe39a885ee3c7f16da418ff83ee1aa895"],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};