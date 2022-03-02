import { ethers, FixedNumber } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup, getAddress, getSignature } from './utils';

interface EndEventProps {
    RSVP: ethers.Contract | null
    signer: string | ethers.providers.JsonRpcSigner | null
}

const EndEvent = (props: EndEventProps) => {

    const contractWithSigner = (props.RSVP && props.signer) ? getContractWithSigner(props.RSVP, props.signer) : null;

    const requestSignature = async () => {

        if (!contractWithSigner) {
            return
        }

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

        if (!contractWithSigner) {
            return
        }

        let address = await getAddress();

        try {
            let tx = await contractWithSigner.RSVP_End(address, sig, EndEventData);
            transactionPopup(tx.hash, false, undefined, tx.wait);
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
