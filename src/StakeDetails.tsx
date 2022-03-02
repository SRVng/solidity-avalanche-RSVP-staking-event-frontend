import { ethers } from 'ethers';
import React from 'react';
import { getAddress, getContractWithSigner } from './utils';
import styles from './css/StakeDetails.module.css';

interface StakeDetailsProps {
    RSVP: ethers.Contract | null
    address: string
    signer: string | ethers.providers.JsonRpcSigner | null
}

const StakeDetails = (props: StakeDetailsProps) => {

    const contractWithSigner = (props.RSVP && props.signer) ? getContractWithSigner(props.RSVP, props.signer) : null;

    return (
        <div>
            <AllStake contractWithSigner={contractWithSigner} address={props.address}/>
        </div>
    )
};

interface StakeProps {
    contractWithSigner: ethers.Contract | null
    address: string
}

const AllStake = (props: StakeProps) => {

    const [userStake, updateUserStake] = React.useState({
        stakeAmount: '',
        stakeTime: ''
    });

    const [isMount, setIsMount] = React.useState(true);

    const [totalStake, updateTotalStake] = React.useState('0');

    const fetchStakeAmount = async () => {

        if (!props.contractWithSigner) {
            return
        }

        let tx = await props.contractWithSigner.total_stake();
        updateTotalStake(tx[1].toString());

        let address = await getAddress();

        let whitelistCheck = await props.contractWithSigner.Whitelist_Check(address);

        if (!whitelistCheck[0]) {
            updateUserStake({
                stakeAmount: '',
                stakeTime: ''
            });
            return;
        }

        tx = await props.contractWithSigner.Stake_Check(address);
        updateUserStake({
            stakeAmount: tx[1].toString(),
            stakeTime: new Date(tx[2].toNumber() * 1000).toLocaleString()
        });
    }

    React.useEffect(() => {

        setIsMount(true);

        if (isMount && props.address) {
            setInterval(() => {
                fetchStakeAmount();
            }, 15000)
            fetchStakeAmount();
        }

        return () => {
            setIsMount(false);
        }
    }, [])

    return (
        <div className={styles.container}>
            <p className={styles.topic}>Your staking details</p>
        <div className={styles.detailContainer}>
            <p>Your EVT Staked: {userStake.stakeAmount === '' ? 0 : userStake.stakeAmount}</p>
            <p>Staked at: {userStake.stakeTime === '' ? '-' : userStake.stakeTime}</p>
            <p>Total EVT Staked: {totalStake}</p>
        </div>
        </div>
    )
}

export default StakeDetails;
