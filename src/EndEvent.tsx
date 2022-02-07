import { ethers } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup, getAddress } from './utils';

interface EndEventProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const EndEvent = (props: EndEventProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    const endEventButton = async () => {
        let address = getAddress();
        try {
            let tx = await contractWithSigner.RSVP_End(address);
            await tx.wait();
            transactionPopup(tx.hash, false);
        } catch(e: any) {
            transactionPopup(e.hash, true, e.data.message);
        }
    }

  return (
      <div>
          <button onClick={endEventButton}>End</button>
      </div>
  )
};

export default EndEvent;
