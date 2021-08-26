import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { SparkNFT } from "../artifacts/typechain/SparkNFT";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import helper from "./helper";

use(solidity);

describe("SparkNFT", function () {
  let sparkNFT: SparkNFT;
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    const SparkNFTFactory = await ethers.getContractFactory("SparkNFT");
    sparkNFT = (await SparkNFTFactory.deploy()) as SparkNFT;
    sparkNFT = (await sparkNFT.deployed()).connect(owner);
  });

  it("Should return the new greeting once it's changed", async () => {
    expect(await sparkNFT.name()).to.equal("SparkNFT");
    expect(await sparkNFT.symbol()).to.equal("SparkNFT");
  });

  context('publish()', async () => {
    it('should publish an issue and emit event successfully', async () => {
      const event = await helper.publish(sparkNFT)

      expect(event.args.issue_id).to.eq(BigNumber.from(1));
      expect(event.args.publisher).to.hexEqual(owner.address);
      // TODO: make this rootNFTId validation match the contract.
      // expect(event.args.rootNFTId).to.eq(BigNumber.from(0));

      // Issue data
      expect(event.args.issueData.name).to.eq("TestIssue");
      expect(event.args.issueData.issue_id).to.eq(BigNumber.from(1));
      expect(event.args.issueData.total_amount).to.eq(BigNumber.from(1));
      expect(event.args.issueData.shill_times).to.eq(BigNumber.from(10));
      expect(event.args.issueData.royalty_fee).to.eq(30);
      expect(event.args.issueData.ipfs_hash).to.eq('IPFSHASH');
      expect(event.args.issueData.first_sell_price).to.eq(BigNumber.from(100))
    });
  });

  context('acceptShill()', async () => {
    it('should mint a NFT from an issue', async (): Promise<void> => {
      const other = accounts[1];
      const first_sell_price = BigNumber.from(100);

      const publish_event = await helper.publish(sparkNFT, first_sell_price)
      const root_nft_id = publish_event.args.rootNFTId;
      expect(await sparkNFT.isEditionExist(root_nft_id)).to.eq(true);

      const mint_event = await helper.accept_shill(sparkNFT, other, root_nft_id)

      expect(mint_event.args.father_id).to.eq(root_nft_id);
      expect(mint_event.args.NFT_id).not.to.eq(root_nft_id);
      expect(mint_event.args.owner).to.eq(other.address)
    });
  });

  context('determinePriceAndApprove()', async () => {
    it('should determine a price and approve', async () => {
      const owner = accounts[1];
      const receiver = accounts[2];
      const mint_event = await helper.accept_shill(sparkNFT, owner);
      const nft_id = mint_event.args.NFT_id;
      const transfer_price = BigNumber.from(100);
      await sparkNFT
        .connect(owner)
        .determinePriceAndApprove(nft_id, transfer_price, receiver.address);

      const event = (await sparkNFT.queryFilter(sparkNFT.filters.DeterminePriceAndApprove()))[0];
      expect(event.args.transfer_price).to.eq(transfer_price);
      expect(event.args.to).to.eq(receiver.address);
    });
  });

  context('safeTransferFrom()', async () => {
    it('should transfer an NFT from one to another', async () => {
      const mint_event = await helper.accept_shill(sparkNFT, accounts[1]);
      const owner = accounts[1];
      const receiver = accounts[2];
      const nft_id = mint_event.args.NFT_id;
      const price = BigNumber.from(100);

      await sparkNFT.connect(owner).determinePriceAndApprove(nft_id, price, receiver.address);

      await sparkNFT.connect(owner)["safeTransferFrom(address,address,uint256)"](
        owner.address,
        receiver.address,
        nft_id,
        { value: price }
      );

      const transfer_event = (await sparkNFT.queryFilter(sparkNFT.filters.TransferWithPrice(
        owner.address,
        receiver.address,
        nft_id
      )))[0];

      expect(transfer_event.args.from).to.eq(owner.address);
      expect(transfer_event.args.to).to.eq(receiver.address);
      expect(transfer_event.args.NFT_id).to.eq(nft_id);
      expect(transfer_event.args.transfer_price).to.eq(BigNumber.from(0))
    });
  });
});