// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC20} from '@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol';
import '../../gho/GhoToken.sol';

import './interfaces/IERC3156FlashBorrower.sol';
import './interfaces/IERC3156FlashLender.sol';

// flashminter contract cannot use ERC20 so it will
// constructor feeds in erc20 gho
// remove iserc20
// token address === gho.address
// c
// rather than call _mint call external gho.mint() which can be defined in the cn
// token contract is NOT the same
// approve will need to approve gho
// burn call to gho

// deploy and add this contract as a facilitator to gho
// Once compile can add deploy script
// gho flash minter but needs to be after gho token so can get reference.

// tasks setup add-gho-as-entity. Copy paste and add flashminter as entity.
// gho-setup usually runs firt
// run test
// specific tests run setup and then the specific tests
//

/**
 * @author Aave
 * @dev Extension of {ERC20} that allows flash minting.
 */
contract FlashMinter is IERC3156FlashLender {
  bytes32 public constant CALLBACK_SUCCESS = keccak256('ERC3156FlashBorrower.onFlashLoan');
  uint256 public fee; //  1 == 0.01 %.
  GhoToken _ghoToken;

  /**
   * @param fee_ The percentage of the loan `amount` that needs to be repaid, in addition to `amount`.
   */
  constructor(
    string memory name,
    string memory symbol,
    uint256 fee_,
    address ghoTokenAddress
  ) {
    fee = fee_;
    _ghoToken = GhoToken(ghoTokenAddress);
  }

  /**
   * @dev The amount of currency available to be lent.
   * @param token The loan currency.
   * @return The amount of `token` that can be borrowed.
   */
  function maxFlashLoan(address token) external view override returns (uint256) {
    return type(uint256).max - _ghoToken.totalSupply();
  }

  /**
   * @dev The fee to be charged for a given loan.
   * @param token The loan currency. Must match the address of this contract.
   * @param amount The amount of tokens lent.
   * @return The amount of `token` to be charged for the loan, on top of the returned principal.
   */
  function flashFee(address token, uint256 amount) external view override returns (uint256) {
    require(token == address(this), 'FlashMinter: Unsupported currency');
    return _flashFee(token, amount);
  }

  /**
   * @dev Loan `amount` tokens to `receiver`, and takes it back plus a `flashFee` after the ERC3156 callback.
   * @param receiver The contract receiving the tokens, needs to implement the `onFlashLoan(address user, uint256 amount, uint256 fee, bytes calldata)` interface.
   * @param token The loan currency. Must match the address of this contract.
   * @param amount The amount of tokens lent.
   * @param data A data parameter to be passed on to the `receiver` for any custom use.
   */
  function flashLoan(
    IERC3156FlashBorrower receiver,
    address token,
    uint256 amount,
    bytes calldata data
  ) external override returns (bool) {
    require(token == address(this), 'FlashMinter: Unsupported currency');
    uint256 fee = _flashFee(token, amount);
    _ghoToken.mint(address(receiver), amount);
    require(
      receiver.onFlashLoan(msg.sender, token, amount, fee, data) == CALLBACK_SUCCESS,
      'FlashMinter: Callback failed'
    );
    // uint256 _allowance = allowance(address(receiver), address(this));
    // require(_allowance >= (amount + fee), 'FlashMinter: Repay not approved');
    // _approve(address(receiver), address(this), _allowance - (amount + fee));
    _ghoToken.burn(amount);
    //     _ghoToken.burn(address(receiver), amount + fee);

    return true;
  }

  /**
   * @dev The fee to be charged for a given loan. Internal function with no checks.
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @return The amount of `token` to be charged for the loan, on top of the returned principal.
   */
  function _flashFee(address token, uint256 amount) internal view returns (uint256) {
    return (amount * fee) / 10000;
  }
}
