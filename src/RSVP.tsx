import { ethers, FixedNumber } from 'ethers';
import React from 'react';
import { getContractWithSigner, getSignature, transactionPopup } from './utils';
import styles from './css/RSVP.module.css';

interface RSVPProps {
    RSVP: ethers.Contract | null
    signer: string | ethers.providers.JsonRpcSigner | null
    balance: string
}

const RSVP = (props: RSVPProps) => {

    const contractWithSigner = (props.RSVP && props.signer) ? getContractWithSigner(props.RSVP, props.signer) : null;

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

        if (!contractWithSigner) {
            return null
        }

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

        if (!contractWithSigner) {
            return 
        }

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
        if (window.ethereum === undefined) {
            return null
        }
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
