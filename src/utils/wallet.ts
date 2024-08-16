import { Contract, ContractInterface, ethers, Signer } from 'ethers';

import { chainInfoIDMap } from '@/constants/chainInfo';

import {
  JsonRpcProvider,
  Web3Provider,
  BaseProvider,
} from '@ethersproject/providers';

export interface ChainInfo {
  /**
   * 链ID的十六进制字符串。如：ETH -> "0x1"
   */
  chainId?: string;
  /**
   * 链 RPC 地址
   */
  rpc?: string;
}

export interface CallbackParams {
  type: 'accountsChanged' | 'chainChanged';
  value: string;
}

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}
type CallbackFunctionType = (arg0: CallbackParams) => void;

class MyWallet {
  readonly chainInfo: ChainInfo;
  /**
   * 合约地址
   */
  readonly contractAddress: string;
  readonly abi: ContractInterface;

  static isConnect: boolean;
  static listener: CallbackFunctionType | undefined;

  constructor(
    chainInfo: ChainInfo,
    contractAddress: string,
    abi: ContractInterface
  ) {
    this.chainInfo = chainInfo;
    this.contractAddress = contractAddress;
    this.abi = abi;
  }

  // 获取一个只读合约实例
  useReadContract(): Contract {
    let provider: BaseProvider | JsonRpcProvider;
    provider = new ethers.providers.JsonRpcProvider(this.chainInfo.rpc);
    return new ethers.Contract(this.contractAddress, this.abi, provider);
  }

  // 获取一个读写合约实例
  useWriteContract(): Contract {
    const signer = MyWallet.getSigner();
    return new ethers.Contract(this.contractAddress, this.abi, signer);
  }

  static getSigner() {
    if (isWalletInstalled()) {
      if (!MyWallet.isConnect) {
        this.connect();
        return;
      }

      const provider: Web3Provider = new ethers.providers.Web3Provider(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.ethereum
      );
      const signer: Signer = provider.getSigner();
      return signer;
    } else {
      console.warn('window.ethereum is undefined');
    }
  }

  static async connect(silent = false, switchChainId?: string) {
    if (isWalletInstalled()) {
      if (silent) {
        const isConnected = localStorage.getItem('isConnected');
        if (!isConnected) {
          console.warn("Can't silent connect wallet");
          return;
        }
      }
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        // 当前链 id 不等于 目前的链 id 执行切换
        if (switchChainId && chainId !== switchChainId) {
          this.switchChain(switchChainId);
        }

        MyWallet.isConnect = true;

        localStorage.setItem('isConnected', 'true');

        return Promise.resolve({
          account: accounts[0],
          chainId,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      console.warn('window.ethereum is undefined');
    }
  }

  // 切换链的静态方法
  static async switchChain(chainId: string, callback?: () => void) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      callback?.();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (error.code === 4902) {
        if (isValidKey(chainId, chainInfoIDMap)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainInfoIDMap[chainId]],
          });
          callback?.();
        }
      }
    }
  }

  static switchChainCheck(chainId: string, callback: (() => void) | undefined) {
    try {
      MyWallet.switchChain(chainId, callback);
    } catch (error) {
      console.log(error);
    }
  }

  static async getNetwork() {
    if (isWalletInstalled()) {
      const provider: Web3Provider = new ethers.providers.Web3Provider(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.ethereum
      );
      const network = await provider.getNetwork();
      return network;
    } else {
      throw new Error('window.ethereum is undefined');
    }
  }
}

export function isWalletInstalled() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window.ethereum);
}

// 判断 MetaMask 的环境
export function isMetaMask() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
}

// 判断 TokenPocket 环境
export function isTokenPocket() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window.ethereum && window.ethereum.isTokenPocket);
}
// 判断 ImToken 环境
export function isImToken() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window.ethereum && window.ethereum.isImToken);
}

export default MyWallet;
