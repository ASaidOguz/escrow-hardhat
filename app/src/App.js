import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Archive from './Archive';
import deploy from './deploy';
import Escrow from './Escrow';
import Login from './login/Login';
import PushNotify from './PushNotify';
import server from './server';
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  try {
    const approveTxn = await escrowContract.connect(signer).approve();
    console.log("approveTXn:",approveTxn)
    await approveTxn.wait();
    sendApprove(escrowContract.address);
    
  } catch (revertReason) {
    console.log(revertReason.reason)
    PushNotify('error','EVM REVERT',revertReason.reason,5000)
    //alert(revertReason.reason)
  }
}

async function sendApprove(contract_address){
  const {
    data
  } = await server.post(`updateapprove`, {
    address: contract_address
    
  },{withCredentials:true});
  console.log("Message:",data)
}


function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const[loginState,setLoginstate]=useState(null)
  
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);
 console.log("Login state:",loginState)
  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.BigNumber.from((document.getElementById('wei').value* 10 ** 18).toString());
    
    try {
      const escrowContract = await deploy(signer, arbiter, beneficiary, value);
      console.log("Contract chain name:",escrowContract.provider._network.name)
      console.log("Contract obj:",escrowContract)
      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: value.toString(),
        escrowContract,
        signer
      };
      
      setEscrows([...escrows, escrow]);
      const {
        data
      } = await server.post(`send`, {
        chain:escrowContract.provider._network.name,
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: value.toString(),
        isApproved:false
      },{withCredentials:true});
      console.log("Message:",data)
    } catch (revertReason) {
      console.log(revertReason.reason)
      PushNotify("error",'EVM EXCEPTION',revertReason.reason)
    } 
  }
  return (
    <div className='App'>{!loginState&&<Login
    loginState={loginState}
    setLoginstate={setLoginstate}
    />}
    {loginState&&<div className='float-container'>
      
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="wei" />
        </label>
        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Cached Contracts </h1>
        
        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
        
       
      </div>
      <div className='archived-contracts'>
      <h1> Archived Contracts </h1>
      <div id='container'>
        <Archive/>
        </div>
        </div>
      </div>}
      <footer>Made with ❤ by ASaidOguz</footer>
      </div>
      
    
  );
}

export default App;
