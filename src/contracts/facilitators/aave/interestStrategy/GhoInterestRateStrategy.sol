// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.10;

import {IERC20} from '@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol';
import {WadRayMath} from '@aave/core-v3/contracts/protocol/libraries/math/WadRayMath.sol';
import {PercentageMath} from '@aave/core-v3/contracts/protocol/libraries/math/PercentageMath.sol';
import {DataTypes} from '@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol';
import {IReserveInterestRateStrategy} from '@aave/core-v3/contracts/interfaces/IReserveInterestRateStrategy.sol';
import {IPoolAddressesProvider} from '@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol';
import {Errors} from '@aave/core-v3/contracts/protocol/libraries/helpers/Errors.sol';

/**
 * @title GhoInterestRateStrategy contract
 * @author Aave
 * @notice Implements the calculation of the interest rates depending on the reserve state
 * @dev The variable rate is held constant until a new strategy is implemented and set
 **/
contract GhoInterestRateStrategy is IReserveInterestRateStrategy {
  // Base variable borrow rate
  uint256 internal immutable _baseVariableBorrowRate;

  /**
   * @dev Constructor.
   * @param baseVariableBorrowRate The base variable borrow rate
   */
  constructor(uint256 baseVariableBorrowRate) {
    _baseVariableBorrowRate = baseVariableBorrowRate;
  }

  /// @inheritdoc IReserveInterestRateStrategy
  function getBaseVariableBorrowRate() external view override returns (uint256) {
    return _baseVariableBorrowRate;
  }

  /// @inheritdoc IReserveInterestRateStrategy
  function getMaxVariableBorrowRate() external view override returns (uint256) {
    return _baseVariableBorrowRate;
  }

  /// @inheritdoc IReserveInterestRateStrategy
  function calculateInterestRates(DataTypes.CalculateInterestRatesParams calldata params)
    external
    view
    override
    returns (
      uint256,
      uint256,
      uint256
    )
  {
    return (1e25, 1e25, _baseVariableBorrowRate);
  }
}
