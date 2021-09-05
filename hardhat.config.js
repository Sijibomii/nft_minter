require("@nomiclabs/hardhat-waffle");
require('dotenv').config()
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
const key = process.env.private_key;
const projectId= process.env.projectId;
module.exports = {
  networks:{
    hardhat:{
      chainId: 1337
    },
    rinkeby:{
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts: [key]
    },
    ropsten:{
      url: `https://ropsten.infura.io/v3/${projectId}`,
      accounts: [key]
    }
  },
  solidity: "0.8.4",
};
