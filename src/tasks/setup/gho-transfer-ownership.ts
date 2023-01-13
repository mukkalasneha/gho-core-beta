import { task } from 'hardhat/config';
import { aaveMarketAddresses } from '../../helpers/config';
import { getNetwork } from '../../helpers/misc-utils';
import { getGhoToken } from '../../helpers/contract-getters';

task('gho-transfer-ownership', 'Transfer the Ownership of the GHO Contract')
  .addFlag('deploying', 'true or false contracts are being deployed')
  .setAction(async (params, hre) => {
    const network = getNetwork();
    const { shortExecutor } = aaveMarketAddresses[network];

    let gho;
    if (params.deploying) {
      gho = await hre.ethers.getContract('GhoToken');
    } else {
      const contracts = require('../../../contracts.json');
      gho = await getGhoToken(contracts.GhoToken);
    }

    const transferOwnershipTx = await gho.transferOwnership(shortExecutor);
    await transferOwnershipTx.wait();

    console.log(`GHO ownership transferred to:  ${shortExecutor}`);
  });
