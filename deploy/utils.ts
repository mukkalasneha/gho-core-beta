import { hexlify, keccak256, RLP } from 'ethers/lib/utils';
import { aaveMarketAddresses } from '../src/helpers/config';
import hre from 'hardhat';

// aToken nonce = 0
// stableDebtToken nonce = 1
// variableDebtToken nonce = 2

const configurator = aaveMarketAddresses.lendingPoolConfigurator;

export async function getUndeployedATokenProxyAddress(): Promise<string> {
  const nonce = await hre.ethers.provider.getTransactionCount(configurator);
  return computeContractAddress(configurator, nonce);
}

export async function getUndeployedVariableDebtTokenProxyAddress(): Promise<string> {
  const nonce = (await hre.ethers.provider.getTransactionCount(configurator)) + 2;
  return computeContractAddress(configurator, nonce);
}

function computeContractAddress(deployerAddress: string, nonce: number): string {
  const hexNonce = hexlify(nonce);
  return '0x' + keccak256(RLP.encode([deployerAddress, hexNonce])).substr(26);
}
