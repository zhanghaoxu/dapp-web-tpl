import { ethers } from 'ethers';
interface Nonce {
  value: string;
  issuedAt: Date;
  notBefore: Date | null;
  expirationTime: Date | null;
}
/**
 * Produce the EIP4361 Message for Wallet to Sign
 *
 * @param {string} domain - The domain making the request
 * @param {string} address - The address that should sign the request.
 * @param {string} statement - A statement for the user to agree to.
 * @param {string} uri - The URI making the request.
 * @param {number} version - The version making the request.
 * @param {Nonce} nonce - The nonce for this request.
 * @param {number|null} [chainId=null] - The chain ID for this request.
 * @param {string|null} [requestId=null] - The request ID associated with this request.
 * @param {string[]} [resources=[]] - An array of URIs for resources associated with the request.
 * @returns {string} - The message that the client should ask the wallet to sign with `personal_sign`.
 */
export function produceMessage(
  domain: string,
  address: string,
  statement: string,
  uri: string,
  version: number,
  nonce: Nonce,
  chainId?: number,
  requestId?: string,
  resources = [],
) {
  let message = `${statement}

URI: ${uri}
Version: ${version}
Nonce: ${nonce.value}
Issued At: ${nonce.issuedAt.toISOString()}`;

  if (nonce.expirationTime) {
    message += `\nExpiration Time: ${nonce.expirationTime.toISOString()}`;
  }
  if (nonce.notBefore) {
    message += `\nNot Before: ${nonce.notBefore.toISOString()}`;
  }
  if (chainId) {
    message += `\nChain ID: ${chainId}`;
  }
  if (requestId) {
    message += `\nRequest ID: ${requestId}`;
  }
  if (resources && resources.length) {
    message += '\nResources:';
    resources.forEach((resource) => {
      message += `\n- ${resource}`;
    });
  }
  return Promise.resolve(message);
}

/**
 * Create a new nonce.
 *
 * @param {number|null} [expirationTTLSeconds] - Number of seconds the nonce should be valid for.
 * @param {Data|null} [notBefore] - The date, before which, the request should not be valid.
 * @returns {Nonce} - The requested nonce.
 */
export function makeNonce(expirationTTLSeconds = null, notBefore = null) {
  const issuedAt = new Date();
  let expirationTime = null;
  if (expirationTTLSeconds) {
    expirationTime = new Date(issuedAt.getTime());
    expirationTime.setUTCSeconds(
      expirationTime.getUTCSeconds() + expirationTTLSeconds,
    );
  }
  const value = ethers.utils.hexlify(ethers.utils.randomBytes(16));
  return Promise.resolve({
    value,
    issuedAt,
    expirationTime,
    notBefore,
  });
}
