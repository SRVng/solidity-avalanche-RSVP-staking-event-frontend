import { ethers } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup } from './utils';

interface CheckInProps {
    RSVP: ethers.Contract | null
    signer: string | ethers.providers.JsonRpcSigner | null
}

const CheckIn = (props: CheckInProps) => {

    const contractWithSigner = (props.RSVP && props.signer) ? getContractWithSigner(props.RSVP, props.signer) : null;

    const checkInButton = async () => {
      if (!contractWithSigner) {
        return
      }
      try {
        let tx = await contractWithSigner.Check_in();
        transactionPopup(tx.hash, false, undefined, tx.wait);
      } catch(e: any) {
        transactionPopup(e.hash, true, e.data.message)
      }
    }

  return (
    <div>
      <button onClick={checkInButton}>Check In</button>
    </div>
  )
};

export default CheckIn;
