import { config as dotEnvConfig } from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import { IUniswapV2, IERC20, CErc20Interface, ComptrollerInterface } from "./typechain";
import { parseUnits, formatEther } from "ethers/lib/utils";

const routerV3 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const routerV2 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const CUSDT = "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9";
const CUSDC = "0x39AA39c021dfbaE8faC545936693aC917d5E7563";
const CETH = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5";
const Unitroller = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";

task("accounts", "Prints the list of accounts", async (taskArgs, bre) => {
  const accounts = await bre.ethers.getSigners();

  for (const account of accounts) {
    let address = await account.getAddress();
    console.log(
      address,
      (await bre.ethers.provider.getBalance(address)).toString()
    );
  }
});

task("approve", "token approve to swap")
  .setAction(
    async ({ }, { ethers, run }) => {
      const signer = (await ethers.getSigners())[0];

      const usdt = await ethers.getContractAt("IERC20", USDT, signer) as IERC20;
      const usdc = await ethers.getContractAt("IERC20", USDC, signer) as IERC20;

      let receipt = await usdt.approve(routerV2, ethers.constants.MaxUint256);
      console.log(await receipt.wait())
      receipt = await usdc.approve(routerV2, ethers.constants.MaxUint256);
      console.log(await receipt.wait())
    }
  );
task("comp", "compound")
  .setAction(
    async ({ }, { ethers, run }) => {
      const signer = (await ethers.getSigners())[0];

      const usdt = await ethers.getContractAt("IERC20", USDT, signer) as IERC20;
      const usdc = await ethers.getContractAt("IERC20", USDC, signer) as IERC20;

      let receipt = await usdt.approve(CUSDT, ethers.constants.MaxUint256);
      console.log(await receipt.wait())
      receipt = await usdc.approve(CUSDC, ethers.constants.MaxUint256);
      console.log(await receipt.wait())

      const cUSDT = await ethers.getContractAt("CErc20Interface", CUSDT, signer) as CErc20Interface;
      const cUSDC = await ethers.getContractAt("CErc20Interface", CUSDC, signer) as CErc20Interface;

      receipt = await cUSDT.mint(await usdt.balanceOf(signer.address));
      console.log(await receipt.wait())
      receipt = await cUSDC.mint(await usdt.balanceOf(signer.address));
      console.log(await receipt.wait())

      const unitroller = await ethers.getContractAt("ComptrollerInterface", Unitroller, signer) as ComptrollerInterface;
      receipt = await unitroller.enterMarkets([CUSDC, CUSDT, CETH]);
      console.log(await receipt.wait())

      const cETH = await ethers.getContractAt("CErc20Interface", CETH, signer) as CErc20Interface;
      // receipt = await cETH.borrow()
    }
  );

task("swapusdt", "swap usdt for eth")
  .setAction(
    async ({ }, { ethers, run }) => {
      const signer = (await ethers.getSigners())[0];

      const router = await ethers.getContractAt("IUniswapV2", routerV2, signer) as IUniswapV2;
      const usdt = await ethers.getContractAt("IERC20", USDT, signer) as IERC20;
      const path = [USDT, weth];
      let receipt = await router.swapExactTokensForETH(await usdt.balanceOf(signer.address), 0, path, signer.address, '99999999999');
      console.log(await receipt.wait());
    }
  );

task("swapusdc", "swap usdc for eth")
  .setAction(
    async ({ }, { ethers, run }) => {
      const signer = (await ethers.getSigners())[0];

      const router = await ethers.getContractAt("IUniswapV2", routerV2, signer) as IUniswapV2;
      const usdc = await ethers.getContractAt("IERC20", USDC, signer) as IERC20;
      const path = [USDC, weth];
      let receipt = await router.swapExactTokensForETH(await usdc.balanceOf(signer.address), 0, path, signer.address, '99999999999');
      console.log(await receipt.wait());
    }
  );

task("swapusdc", "swap usdc for eth")
  .setAction(
    async ({ }, { ethers, run }) => {
      const signer = (await ethers.getSigners())[0];

      const router = await ethers.getContractAt("IUniswapV2", routerV2, signer) as IUniswapV2;
      const usdc = await ethers.getContractAt("IERC20", USDC, signer) as IERC20;
      const path = [USDC, weth];
      let receipt = await router.swapExactTokensForETH(await usdc.balanceOf(signer.address), 0, path, signer.address, '99999999999');
      console.log(await receipt.wait());
    }
  );

dotEnvConfig();
// tslint:disable-next-line:no-var-requires
const argv = require('yargs/yargs')()
  .env('')
  .options({
    hardhatChainId: {
      type: "number",
      default: 31337
    },
    ganacheRpc: {
      type: "string",
      default: 'http://127.0.0.1:8545'
    },
    mainnetRPC: {
      type: "string",
      default: "https://eth-mainnet.g.alchemy.com/v2/6GLznpJ4P8ol0Pf3uQFCO_Ooq6D7Zj3j"
    },
    fairRPC: {
      type: "string",
      default: "https://rpc.etherfair.org"
    },
    maticRpcUrl: {
      type: "string",
      default: ''
    },
    mumbaiRpcUrl: {
      type: "string",
      default: 'https://matic-mumbai.chainstacklabs.com'
    },
    ethRpcUrl: {
      type: "string",
      default: ''
    },
    ftmRpcUrl: {
      type: "string",
      default: ''
    },
    meterTestRpcUrl: {
      type: "string",
      default: 'https://rpctest.meter.io'
    },
    meterMainRpcUrl: {
      type: "string",
      default: 'https://rpc.meter.io'
    },
    networkScanKey: {
      type: "string",
      default: ''
    },
    privateKey: {
      type: "string",
      default: "b55c9fcc2c60993e5c539f37ffd27d2058e7f77014823b461323db5eba817518" // random account
    },
    maticForkBlock: {
      type: "number",
    },
    mumbaiForkBlock: {
      type: "number",
    },
    ftmForkBlock: {
      type: "number",
    },
  }).argv;


export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: !!argv.hardhatChainId ? argv.hardhatChainId : undefined,
      timeout: 99999 * 2,
      gas: argv.hardhatChainId === 137 ? 19_000_000 :
        argv.hardhatChainId === 80001 ? 19_000_000 :
          undefined,
      forking: !!argv.hardhatChainId && argv.hardhatChainId !== 31337 ? {
        url:
          argv.hardhatChainId === 137 ? argv.maticRpcUrl :
            argv.hardhatChainId === 250 ? argv.ftmRpcUrl :
              argv.hardhatChainId === 80001 ? argv.mumbaiRpcUrl :
                undefined,
        blockNumber:
          argv.hardhatChainId === 137 ? argv.maticForkBlock !== 0 ? argv.maticForkBlock : undefined :
            argv.hardhatChainId === 250 ? argv.ftmForkBlock !== 0 ? argv.ftmForkBlock : undefined :
              argv.hardhatChainId === 80001 ? argv.mumbaiForkBlock !== 0 ? argv.mumbaiForkBlock : undefined :
                undefined
      } : undefined,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        accountsBalance: "100000000000000000000000000000"
      },
    },
    mainnet: {
      url: argv.mainnetRPC,
      timeout: 99999,
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY],
    },
    fair: {
      url: argv.fairRPC,
      timeout: 99999,
      chainId: 513100,
      accounts: [process.env.PRIVATE_KEY],
    },
    matic: {
      url: argv.maticRpcUrl,
      timeout: 99999,
      chainId: 137,
      // gas: 19_000_000,
      // gasPrice: 100_000_000_000,
      gasMultiplier: 1.3,
      accounts: [argv.privateKey],
    },
    mumbai: {
      url: argv.mumbaiRpcUrl,
      chainId: 80001,
      timeout: 99999,
      // gasPrice: 100_000_000_000,
      accounts: [argv.privateKey],
    },
    ftm: {
      url: argv.ftmRpcUrl,
      chainId: 250,
      timeout: 99999,
      accounts: [argv.privateKey],
    },
    ganache: {
      url: argv.ganacheRpc,
      chainId: 1337,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: argv.networkScanKey
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        }
      },
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 9999999999
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: false,
    currency: 'USD',
    gasPrice: 21
  },
  typechain: {
    outDir: "typechain",
  },
};
