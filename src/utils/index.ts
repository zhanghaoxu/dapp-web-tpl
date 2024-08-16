import { login } from '@/services/api';
import { makeNonce, produceMessage } from './EipTools';
import MyWallet from './wallet';

const getMessage = async (account: string, statement: string = '') => {
  const nonce = await makeNonce();
  const message = await produceMessage(
    window.location.origin,
    account,
    statement,
    window.location.href,
    1,
    nonce,
    1
  );
  return { nonce, message };
};

const getSignature = async (message: string) => {
  try {
    const signer: any = MyWallet.getSigner();
    const signature = await signer.signMessage(message);
    return Promise.resolve(signature);
  } catch (e) {
    return Promise.reject(e);
  }
};

const loginStatement = '';
export const loginHandler = async (account: string) => {
  try {
    const { message, nonce } = await getMessage(account, loginStatement);
    const signer: any = MyWallet.getSigner();
    const signature = await getSignature(message);
    const { data, error } = await login({
      domain: window.location.origin,
      userAddress: account,
      statement: loginStatement,
      signature,
      uri: window.location.href,
      version: 1,
      chainId: 1,
      nonce: nonce?.value,
      issuedAt: nonce?.issuedAt,
    });
    if (data && data.token) {
      const { token } = data;
      return Promise.resolve(token);
    } else {
      return Promise.reject(error);
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
