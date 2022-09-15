// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.17;

interface ComptrollerInterface {
    function enterMarkets(address[] calldata cTokens)
        external
        returns (uint[] memory);
}
