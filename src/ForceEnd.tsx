import { ethers } from 'ethers';
import React from 'react';
import { getAddress, getContractWithSigner, transactionPopup } from './utils';

interface ForceEndProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const ForceEnd = (props: ForceEndProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    const ForceEnd = async () => {
        
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
