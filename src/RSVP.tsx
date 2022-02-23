import { ethers, FixedNumber } from 'ethers';
import React from 'react';
import { getContractWithSigner, getSignature, transactionPopup } from './utils';
import styles from './css/RSVP.module.css';

interface RSVPProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
    balance: string
}

const RSVP = (props: RSVPProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    const [stakeAmount, setStakeAmount] = React.useState(0);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.value.length === 0) {
            setStakeAmount(0);
        } else {
            setStakeAmount(
                parseInt(e.target.value)
            );
        }
    }

    const maxButton = () => {
        setStakeAmount(parseInt(props.balance));
    }

    const requestSignature = async () => {

        const eventDetails = await contractWithSigner.ongoing_event();

        const RSVPData = {
            name: eventDetails[0],
            until: parseInt(FixedNumber.from(eventDetails[2])._value),
            amount: stakeAmount,
            wallet: window.ethereum.selectedAddress
        };

        const sig = await getSignature(RSVPData);

        return {sig, RSVPData};
    }

    const sendRSVP = async ({sig, RSVPData}: any) => {

        try {
            let tx = await contractWithSigner.RSVP(
                ethers.BigNumber.from(stakeAmount),
                sig,
                RSVPData
                );
            transactionPopup(tx.hash, false, undefined, tx.wait);
        } catch(e: any) {
            console.error(e)
            transactionPopup(e.hash, true, e.data.message);
        }
    }

    const handleOnClick = async () => {
        sendRSVP(await requestSignature());
    }

    return (
        <div className={styles.container}>
            <p>Staking</p>
            <input type={'number'} value={stakeAmount} onChange={handleOnChange}/>
            <button className={styles.maxButton} onClick={maxButton}>Max</button>
            <button className={styles.rsvpButton} onClick={handleOnClick}>RSVP</button>
        </div>
    )
};

export default RSVP;
