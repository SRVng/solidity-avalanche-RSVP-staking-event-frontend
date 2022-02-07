import { ethers } from 'ethers';
import React from 'react';
import { getContractWithSigner, transactionPopup } from './utils';

interface RSVPProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const RSVP = (props: RSVPProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    const [stakeAmount, setStakeAmount] = React.useState(0);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.value.length === 0) {
            setStakeAmount(0);
        } else {
            setStakeAmount(
                parseFloat(e.target.value)
            );
        }
    }

    const sendRSVP = async () => {
        try {
            let tx = await contractWithSigner.RSVP(ethers.BigNumber.from(stakeAmount));
            await tx.wait();
            transactionPopup(tx.hash, false);
        } catch(e: any) {
            transactionPopup(e.hash, true, e.data.message);
        }
    }

    const handleOnClick = () => {
        sendRSVP();
    }

    return (
        <div>
            <input type={'number'} value={stakeAmount} onChange={handleOnChange}/>
            <button onClick={handleOnClick}>RSVP</button>
        </div>
    )
};

export default RSVP;
