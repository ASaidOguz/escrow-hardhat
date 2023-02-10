// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "hardhat/console.sol";
import "./Staker.sol";
contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;
	address  payable public stakerAddress;
    uint256 depositValue;
	bool public isApproved;
	
    Staker public staker;

    event Approved(uint);

	constructor(address _arbiter, address _beneficiary,bool _withInterest,address payable _staker) payable {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
		depositValue=msg.value;
        stakerAddress=_staker;

		staker=Staker(_staker);
		
        (bool success)=staker.ethStake{value:msg.value}(depositor,arbiter,beneficiary,_withInterest);
		require(success,"Failed to sent!");
	}
    //check if the escrow contract is approved!
    function getInfo()external view returns(bool){
		return isApproved;
	}
	function approve() external {
		require(msg.sender == arbiter,"You're not authorized to approve!!");
		isApproved = true;
		staker=Staker(stakerAddress);
		staker.withDrawal(depositor,arbiter);
		emit Approved(depositValue);
		
	}

	
}
