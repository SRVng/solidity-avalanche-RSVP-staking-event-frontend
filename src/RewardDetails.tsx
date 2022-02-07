import { ethers } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup } from './utils';

interface RewardDetailsProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const WithdrawReward = (props: RewardDetailsProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    const withdrawReward = async () => {
        try {
            let tx = await contractWithSigner.withdraw_reward();
            await tx.wait();
            transactionPopup(tx.hash, false);
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
