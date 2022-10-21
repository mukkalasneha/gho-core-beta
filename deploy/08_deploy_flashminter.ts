import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { aaveMarketAddresses } from '../src/helpers/config';

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  console.log();
  console.log(`~~~~~~~   Deploying Contract FlashMinter   ~~~~~~~`);

  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const gho = await hre.ethers.getContract('GhoToken');

  const flashMinter = await deploy('FlashMinter', {
    from: deployer,
    args: ['a', 'b', 0, gho.address],
  });
  console.log(`FlashMinter Address:  ${flashMinter.address}`);

  return true;
};

func.id = 'FlashMinter';
func.tags = ['FlashMinter', 'full_gho_deploy'];

export default func;
