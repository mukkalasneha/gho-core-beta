import { expect } from 'chai';
import { BigNumber } from 'ethers';
import './helpers/math/wadraymath';
import { makeSuite, TestEnv } from './helpers/make-suite';
import { DRE, timeLatest, setBlocktime, mine } from '../helpers/misc-utils';
import { ONE_YEAR, MAX_UINT, ZERO_ADDRESS, oneRay } from '../helpers/constants';
import { ghoReserveConfig, aaveMarketAddresses } from '../helpers/config';
import { calcCompoundedInterestV2 } from './helpers/math/calculations';
import { getTxCostAndTimestamp } from './helpers/helpers';
import { MockFlashLoanReceiver__factory } from '../../types';

makeSuite('Flashloan Test', (testEnv: TestEnv) => {
  let ethers;

  let mockFlashLoanReceiver;

  before(async () => {
    ethers = DRE.ethers;
    const { users } = testEnv;

    const mockFlashLoanReceiverFactory = new MockFlashLoanReceiver__factory(users[0].signer);

    mockFlashLoanReceiver = await mockFlashLoanReceiverFactory.deploy(
      aaveMarketAddresses.addressesProvider
    );

    await mockFlashLoanReceiver.deployed();
  });

  it('Fund flashloan receiver to repay premium', async function () {
    const { users, pool, weth, gho } = testEnv;

    const collateralAmount = ethers.utils.parseUnits('1000.0', 18);
    const borrowAmount = ethers.utils.parseUnits('1000.0', 18);

    await weth.connect(users[0].signer).approve(pool.address, collateralAmount);
    await pool
      .connect(users[0].signer)
      .deposit(weth.address, collateralAmount, users[0].address, 0);

    await pool.connect(users[0].signer).borrow(gho.address, borrowAmount, 2, 0, users[0].address);

    await gho.connect(users[0].signer).transfer(mockFlashLoanReceiver.address, borrowAmount);

    expect(await gho.balanceOf(mockFlashLoanReceiver.address)).to.be.equal(borrowAmount);
  });

  it('Flashloan GHO', async function () {
    const { users, pool, gho } = testEnv;

    const borrowAmount = ethers.utils.parseUnits('1000.0', 18);

    console.log(mockFlashLoanReceiver.address);

    const tx = await pool
      .connect(users[0].signer)
      .flashLoan(
        mockFlashLoanReceiver.address,
        [gho.address],
        [borrowAmount],
        [0],
        users[0].address,
        [0],
        0
      );
  });
});
