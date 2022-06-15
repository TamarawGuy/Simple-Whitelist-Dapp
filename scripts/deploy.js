const { ethers } = require("hardhat");

async function main() {
  const Whitelist = await ethers.getContractFactory("Whitelist");
  const whitelist = await Whitelist.deploy();
  await whitelist.deployed();
  console.log(`Whitelist contract deployed to: ${whitelist.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
