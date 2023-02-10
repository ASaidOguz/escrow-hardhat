import { approve } from "./App";
import { Utils } from "alchemy-sdk";
export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  escrowContract,
  signer
}) {
  const handleApprove= async () => {
    escrowContract.on('Approved', () => {
      document.getElementById(escrowContract.address).className =
        'complete';
      document.getElementById(escrowContract.address).innerText =
        "✓ It's been approved!";
    });

    await approve(escrowContract, signer);
  }
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div>Contract Address</div>
          <div>{escrowContract.address.slice(0,5)}...{escrowContract.address.slice(-5)}</div>
        </li>
        <li>
          <div> Arbiter </div>
          <div> {arbiter.slice(0,5)}...{arbiter.slice(-5)} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary.slice(0,5)}...{beneficiary.slice(-5)} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {Utils.formatEther(value)} <strong>ETH</strong> </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
