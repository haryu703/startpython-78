import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  it("mint one token", async function () {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();

    const owner = await myToken.owner();

    expect(await myToken.name()).to.equal("MyToken");

    const mintTx = await myToken.safeMint(owner);

    // wait until the transaction is mined
    await mintTx.wait();

    expect(await myToken.balanceOf(owner)).to.equal(1);
  });
});
