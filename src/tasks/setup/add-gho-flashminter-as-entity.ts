import { task } from 'hardhat/config';
import { aaveMarketAddresses } from '../../helpers/config';
import { ghoEntityConfig } from '../../helpers/config';
import { IGhoToken } from '../../../types';

import { getGhoToken, getGhoFlashMinter } from '../../helpers/contract-getters';
import { DRE } from '../../helpers/misc-utils';

task('add-gho-flashminter-as-entity', 'Adds FlashMinter as a gho entity').setAction(
  async (params, hre) => {
    await hre.run('set-DRE');
    const { ethers } = DRE;
    const [deployer] = await hre.ethers.getSigners();

    let gho;
    let ghoFlashMinter;

    if (params.deploying) {
      gho = await ethers.getContract('GhoToken');
      ghoFlashMinter = await ethers.getContract('GhoFlashMinter');
    } else {
      const contracts = require('../../../contracts.json');

      gho = await getGhoToken(contracts.GhoToken);
      ghoFlashMinter = await getGhoFlashMinter(contracts.GhoFlashMinter);
    }

    gho.connect(deployer);

    const aaveEntity: IGhoToken.FacilitatorStruct = {
      label: ghoEntityConfig.label,
      bucketCapacity: ghoEntityConfig.flashMinterCapacity,
      bucketLevel: 0,
    };

    const addEntityTx = await gho.addFacilitator(ghoFlashMinter.address, aaveEntity);
    const addEntityTxReceipt = await addEntityTx.wait();

    let error = false;
    if (addEntityTxReceipt && addEntityTxReceipt.events) {
      const newEntityEvents = addEntityTxReceipt.events.filter(
        (e) => e.event === 'FacilitatorAdded'
      );
      if (newEntityEvents.length > 0) {
        console.log(
          `Address added as a facilitator: ${JSON.stringify(newEntityEvents[0].args[0])}`
        );
      } else {
        error = true;
      }
    } else {
      error = true;
    }
    if (error) {
      console.log(`ERROR: Aave not added as GHO entity`);
    }
  }
);
