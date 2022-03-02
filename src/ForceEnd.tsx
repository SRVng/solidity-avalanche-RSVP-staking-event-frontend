import { ethers } from 'ethers';
import React from 'react';
import { getAddress, getContractWithSigner, transactionPopup } from './utils';

interface ForceEndProps {
    RSVP: ethers.Contract | null
    signer: string | ethers.providers.JsonRpcSigner | null
}

const ForceEnd = (props: ForceEndProps) => {

    const contractWithSigner = (props.RSVP && props.signer) ? getContractWithSigner(props.RSVP, props.signer) : null;

    const ForceEnd = async () => {
        if (!contractWithSigner) {
            return
        }
        
        try {
            let tx = await contractWithSigner.Force_End(
                await getAddress()
            );
            transactionPopup(tx.hash, false, undefined, tx.wait);
        } catch(e:any) {
            transactionPopup(e.hash, true, e.data.message);
        }
    } 

  return (
      <div>
          <button onClick={ForceEnd}>Force End</button>
      </div>
  )
};

export default ForceEnd;
