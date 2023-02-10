// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;  
//This staker contract will hold the main pool for staking-loan 
//and will be soon proxy contract tp hold other ...
import "../lib/Interest.sol";
import "hardhat/console.sol";

contract Staker{
    //Using  DSMath and Interest packages for exponential interest calculation;
    uint256 Compound_interest;
    
    //addresses should be deployed contracts and client should interact via contract;
    mapping(address => uint256) public ContrctdepositTimestamps;
    
    //If deployer requested escrow with staker ability;bool will be set true 
    mapping(address=>bool) public InterestSet;  
    
    //escrowTx is escrow transaction with contract-arbiter-beneficiary;
    mapping(address=>mapping(address=>address)) public escrowTx;
    
    //balances is Depositor balances inside staker contract;
    mapping(address=>uint) public balances;
    
    //contractBalances is balances for each contract inside staker pool;
    mapping(address=>uint) public contractBalances;
    uint256 public claimFor3Month = 12 weeks; 
    
    //uint256 public claimFor6Month = block.timestamp + 24 weeks; 
    mapping(address=>uint256) public interestValue;
    
    //Stake event fires up in ethStake function when depositor stake ether; 
    event Stake(address indexed sender, uint256 amount); 
    
    //Received event fires up in receive function;
    event Received(address, uint); 

    //withDrawal function send eth to beneficiary-send the interest eth amount to depositor; 
    function withDrawal(address _depositor,address _arbiter)external OnlyArbiter(msg.sender,_arbiter){
        require(contractBalances[msg.sender]>0,"Contract Balance is 0!");
       
        uint balance=contractBalances[msg.sender];
        //Choose 2 options regarding if the depositor requested 3 month interest payment while their escrow contract 
        //resting in the blockchain;--->Eth will be locked in the staker contract...
        //if no interest request it will just send the amount to beneficiary...
        if(InterestSet[_depositor]){
             //calculate the interest ---send the amount to beneficiary ---send the interest amount to depositor
             require(block.timestamp>=ContrctdepositTimestamps[msg.sender]+claimFor3Month,"Claim time not reached yet!");
             
             uint256 compoundBalance=CalculateInterest(_depositor);
             contractBalances[msg.sender]=0;
            
            (bool success, )=payable(escrowTx[msg.sender][_arbiter]).call{value:balance}("");
            require(success,"Beneficiary base fee transaction failed!");
           
             uint interest_value=compoundBalance-balance;
             console.log("Interest value:",interest_value);
             (bool success_2, )=payable(_depositor).call{value:interest_value}("");
              require(success_2,"Deployer interest transaction failed!"); 
           
           
        }else{
           
            contractBalances[msg.sender]=0;
            (bool success, )=payable(escrowTx[msg.sender][_arbiter]).call{value:balance}("");
            require(success);
        }
    }
    
    function ethStake(address _depositor,address _arbiter,address _beneficiary,bool _isWithinterest)external payable returns(bool){
        require(msg.value>0,"You need to stake eth!");
         //deposit time recorded for future interest calculation;
         ContrctdepositTimestamps[msg.sender]=block.timestamp;
         //balances recorded for withdrawal;
         balances[_depositor]=msg.value;
         //escrow contract balances recored for withDrawal;
         contractBalances[msg.sender]=msg.value;
         //in the moment of withdrawal we will use this mapping to get the valid addreses to send the eth;
         setEscrowTxMapping(_arbiter,_beneficiary);
         //setting depositor true for interest gaining or false for no interest;
         setInterestMapping(_depositor,_isWithinterest);
         return true;
    }

    function CalculateInterest(address _depositor) public returns(uint256){
        Interest interestCalculator=new Interest();
        uint256 principal=contractBalances[msg.sender];
        
        uint256 rate=interestCalculator.yearlyRateToRay(0.3 ether);//0.3 ether roughly %30
        uint256 age=block.timestamp-ContrctdepositTimestamps[msg.sender];
         Compound_interest=interestCalculator.accrueInterest(principal,rate,age);
       
        interestValue[_depositor]=Compound_interest-principal;
        return Compound_interest;
    }
    
    

    //Setting interest map for staked eth...
    function setInterestMapping(address _address,bool _isWithinterest)internal {
        InterestSet[_address]=_isWithinterest;
     
    }
    
    //set the escrowTx mapping for arbiter and beneficiary
    function setEscrowTxMapping(address _arbiter,address _beneficiary)internal {
       escrowTx[msg.sender][_arbiter]=_beneficiary;
    }

    //verifies if the tx.origin is deployer--it may deprecate!
    modifier OnlyDeployer(address _address){
        require(ContrctdepositTimestamps[_address]!=0,"You'r not the deployer!");
        _;
    }
    //verifies if the msg.sender is contract--- and signer is arbiter...
    modifier OnlyArbiter(address _address,address _arbiter){
        require(escrowTx[_address][_arbiter]!=address(0),"You'r not the arbiter!");
        _;
    }
    //Check address if it has interest order on;
    function checkInterestMapping()external view OnlyDeployer(msg.sender) returns(bool){
        //console.log("Balance:",balances[msg.sender]);
        return InterestSet[msg.sender];
    }
    //Check address for its deposit time;
    function checkdepositTimestamps()external view returns(uint256){
        return ContrctdepositTimestamps[address(this)];
    }
    //Check address for interest amount so far;
    function checkInterestValue(address _depositor)public view returns(uint256){
        return interestValue[_depositor];
    }
     
     receive() external payable { 
        emit Received(msg.sender,msg.value);    
  }

}

