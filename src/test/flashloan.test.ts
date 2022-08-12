import { expect } from 'chai';
import { BigNumber } from 'ethers';
import './helpers/math/wadraymath';
import { makeSuite, TestEnv } from './helpers/make-suite';
import { DRE, timeLatest, setBlocktime, mine } from '../helpers/misc-utils';
import { ONE_YEAR, MAX_UINT, ZERO_ADDRESS, oneRay } from '../helpers/constants';
import { ghoReserveConfig, aaveMarketAddresses } from '../helpers/config';
import { calcCompoundedInterestV2 } from './helpers/math/calculations';
import { getTxCostAndTimestamp } from './helpers/helpers';

makeSuite('Flashloan Test', (testEnv: TestEnv) => {
  let ethers;

  before(() => {
    ethers = DRE.ethers;
  });

  it('User 1: Deposit WETH and Borrow GHO', async function () {
  });