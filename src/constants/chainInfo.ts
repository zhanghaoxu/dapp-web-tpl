const chainRpcListMap: any = {
  eth: [
    'https://cloudflare-eth.com',
    'https://eth-rpc.gateway.pokt.network',
    'https://api.mycryptoapi.com/eth',
    'https://rpc.flashbots.net/',
    'https://rpc.ankr.com/eth',
    'https://mainnet.infura.io/v3/63037b66a70a4510be9fb5f1e51fb539',
    'https://mainnet.infura.io/v3/c239d055268941b1bb763b90082b2f9a',
    'https://mainnet.infura.io/v3/0b6495b05b9840e9af0d5361960d6af6',
  ],
  bsc: [
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/',
    'https://bsc-dataseed2.defibit.io/',
    'https://bsc-dataseed3.defibit.io/',
    'https://bsc-dataseed4.defibit.io/',
    'https://bsc-dataseed2.ninicoin.io/',
    'https://bsc-dataseed3.ninicoin.io/',
    'https://bsc-dataseed4.ninicoin.io/',
    'https://bsc-dataseed1.binance.org/',
    'https://bsc-dataseed2.binance.org/',
    'https://bsc-dataseed3.binance.org/',
    'https://bsc-dataseed4.binance.org/',
  ],
};

function randomRpc(name: string) {
  const items = chainRpcListMap[name];
  if (!items) throw new Error('未添加对应区块链的RPC列表！');
  return items[Math.floor(Math.random() * items.length)];
}

export const chainInfoIDMap = {
  '0x38': {
    chainId: '0x38', // A 0x-prefixed hexadecimal string
    chainName: 'Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB', // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: randomRpc('bsc'),
    blockExplorerUrls: ['https://bscscan.com'],
  },
  '0x61': {
    chainId: '0x61', // A 0x-prefixed hexadecimal string
    chainName: 'Smart Chain - Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB', // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
};

const chainInfoMap: any = {
  bsc: {
    online: chainInfoIDMap['0x38'],
    test: chainInfoIDMap['0x61'],
  },
};

const chainInfoENVMap: any = {
  local: {
    bsc: { ...chainInfoMap.bsc.test, contractAddress: '' },
    eth: { ...chainInfoMap.eth.test, contractAddress: '' },
  },
  prod: {
    bsc: { ...chainInfoMap.bsc.test, contractAddress: '' },
    eth: { ...chainInfoMap.eth.test, contractAddress: '' },
  },
};

const APP_ENV: any = process.env.APP_ENV;

export default chainInfoENVMap[APP_ENV];
