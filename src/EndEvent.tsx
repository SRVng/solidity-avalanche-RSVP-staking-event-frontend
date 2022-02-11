import { ethers, FixedNumber } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup, getAddress, getSignature } from './utils';

interface EndEventProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const EndEvent = (props: EndEventProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    const requestSignature = async () => {

        const eventDetails = await contractWithSigner.ongoing_event();

        const CreateData = {
            name: eventDetails[0],
            until: parseInt(FixedNumber.from(eventDetails[2])._value),
            wallet: window.ethereum.selectedAddress
        };

        const EndEventData = {
            name: eventDetails[0],
            start: parseInt(FixedNumber.from(eventDetails[1])._value),
            until: parseInt(FixedNumber.from(eventDetails[2])._value),
            owner: window.ethereum.selectedAddress,
            eventCreator: CreateData
        };

        const sig = await getSignature(EndEventData);

        return {sig, EndEventData};
    }

    const endEventButton = async ({sig, EndEventData}: any) => {
        let address = await getAddress();

        try {
            let tx = await contractWithSigner.RSVP_End(address, sig, EndEventData);
            await tx.wait();
            transactionPopup(tx.hash, false);
        } catch(e: any) {
            console.error(e);
            transactionPopup(e.hash, true, e.data.message);
        }
    }

  return (
      <div>
          <button onClick={async () => {endEventButton(await requestSignature())}}>End</button>
      </div>
  )
};

export default EndEvent;
