import { ethers } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup } from './utils';

interface WithdrawRewardProps {
    RSVP: ethers.Contract | null
    signer: string | ethers.providers.JsonRpcSigner | null
}

const WithdrawReward = (props: WithdrawRewardProps) => {

    const contractWithSigner = (props.RSVP && props.signer) ? getContractWithSigner(props.RSVP, props.signer) : null;

    const withdrawReward = async () => {

        if (!contractWithSigner) {
            return
        }

        try {
            let tx = await contractWithSigner.withdraw_reward();
            transactionPopup(tx.hash, false, undefined, tx.wait);
        } catch(e:any) {
            transactionPopup(e.hash, true, e.data.message);
        }
    } 

  return (
      <div>
          <button onClick={withdrawReward}>Withdraw Reward</button>
      </div>
  )
};

export default WithdrawReward;
