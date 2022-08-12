// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.10;

import {IERC20} from '../../../aave-core/dependencies/openzeppelin/contracts/IERC20.sol';
import {SafeERC20} from '../../dependencies/openzeppelin/contracts/SafeERC20.sol';
import {IFlashLoanReceiver} from '../../interfaces/IFlashLoanReceiver.sol';
import {ILendingPoolAddressesProviderV8} from '../../interfaces/ILendingPoolAddressesProviderV8.sol';
import {ILendingPoolV8} from '../../interfaces/ILendingPoolV8.sol';

abstract contract FlashLoanReceiverBase is IFlashLoanReceiver {
  using SafeERC20 for IERC20;

  ILendingPoolAddressesProviderV8 public immutable override ADDRESSES_PROVIDER;
  ILendingPoolV8 public immutable override LENDING_POOL;

  constructor(ILendingPoolAddressesProviderV8 provider) {
    ADDRESSES_PROVIDER = provider;
    LENDING_POOL = ILendingPoolV8(provider.getLendingPool());
  }
}
