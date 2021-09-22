# SparkLink Smart Contract

## Brief introduction

SparkLink Smart Contract is an Ethereum smart contract.

Authors can publish their virtual products (such as a book) on the blockchain and generate a `root NFT`.

Others can buy a child `NFT3` from any existing father `NFT2`, holder of `NFT2` will get income.

At the same time, holders of `NFT2`'s father `NFT3` will extract the amount corresponding to the proportion of royalties from the profit of the child `NFT2`.

SparkLink Smart Contract can support these features:

- Authors can create virtual products (such as a book) with attributes (such as: royalty percent, maximum number of child NFTs).
- Accept shill from an existing NFT and will get an child NFT.
- Claim the profit generated by the NFT you own.

For design details, please see [API document](doc/SparkLink_API.md).

## Getting Started

To install required node.js modules:

```bash
npm ci
```

To compile the solidity source code

```bash
make build
```

To run unit test:

```bash
make test
```

To deploy the smart contract on Ethereum rinkeby testnet:

```bash
make rinkeby
```

Note:

- This project is powered by [hardhat](https://hardhat.org/).
  You can change your network configuration in `hardhat.config.ts` file.
- Before you deploy a smart contract or interact with a smart contract,
  you need to set up your wallet private key and [`infura`](https://infura.io/) key in `config.json`.

  `config.json` is a template, which contains dummy configurations.

  Please handle your private key carefully. In this project,
  `config.json` has already been added into `.gitignore`, as foolproof.

## Deployed Contract Address

| Contract               | Address                |
| ---------------------- | ---------------------- |
| [Mainnet][mainnet]     | N/A                    |
| [Ropsten][ropsten]     | [0xE0d6ac05][e0d6ac05] |
| [BSC][bscscan]         | N/A                    |
| [BSC-testnet][bsctest] | [0x5C05A8B8][5c05a8b8] |
| [Matic][matic]         | N/A                    |
| [Matic-mumbai][mumbai] | [0xeC6e8df4][ec6e8df4] |

[mainnet]: https://etherscan.io
[ropsten]: https://ropsten.etherscan.io
[bscscan]: https://bscscan.com
[bsctest]: https://testnet.bscscan.com
[matic]: https://matic.network
[mumbai]: https://explorer-mumbai.maticvigil.com
[e0d6ac05]: https://ropsten.etherscan.io/address/0xE0d6ac05893313710FaBd347BfbabdB28824767c
[5c05a8b8]: https://testnet.bscscan.com/address/0x5C05A8B8dfFfA55B5AD2D37E888A06a685E2f467
[ec6e8df4]: https://explorer-mumbai.maticvigil.com/address/0xeC6e8df429d2CE211040341117fd47795a774Ce1

## Contribute

Any contribution is welcomed to make it better.

Had you any questions, please do not hesitate to create an [issue](https://github.com/andy-at-mask/AirPod/issues).

## License

[MIT LICENSE](LICENSE)
