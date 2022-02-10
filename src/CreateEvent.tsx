import React from 'react';
import { BigNumber, ethers } from 'ethers'
import { getContractWithSigner, transactionPopup } from './utils';
import styles from './css/CreateEvent.module.css';

interface CreateEventProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
};

const CreateEvent = (props: CreateEventProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    return (
        <div>
            <CreateEventWithInput contractWithSigner={contractWithSigner} />
        </div>
    )
};

interface CreateEventInput {
    name: string
    timeEnd: BigNumber
    stake: BigNumber
}

const CreateEventWithInput = (props: {contractWithSigner: ethers.Contract}) => {

    const [inputState, updateInputState] = React.useState<CreateEventInput>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const value = 
            target.type === 'text' ? target.value :
            target.type === 'datetime-local' ? BigNumber.from(
                Math.floor(new Date(target.value).getTime() / 1000)) :
            BigNumber.from(target.value)
        const name = target.name;

        updateInputState({ ...inputState!, [name]: value})
    };

    const createEvent = async () => {
        try {
            let tx = await props.contractWithSigner.RSVP_Create(
                inputState!.name,
                inputState!.timeEnd,
                inputState!.stake,
                {value: ethers.utils.parseEther('0.1')});
            await tx.wait();
            transactionPopup(tx.hash, false);
        } catch(e: any) {
            transactionPopup(e.hash, true, e.data.message);
        }
    }

    return (
        <div className={styles.container}>
        <form>
            <label className={styles.nameInput}>
                <p>Event's name:</p>
                <input
                    name='name'
                    type='text'
                    onChange={handleInputChange} />
            </label>
            <br />
            <label className={styles.endInput}>
                <p>Ending time:</p>
                <input
                    name='timeEnd'
                    type='datetime-local'
                    onChange={handleInputChange} />
            </label>
            <br />
            <label className={styles.stakeInput}>
                <p>EVT Amount to stake:</p>
                <input
                    name='stake'
                    type='number'
                    onChange={handleInputChange} />
            </label>
        </form>
        <button onClick={createEvent}>Create</button>
        </div>
    )
}

export default CreateEvent;
