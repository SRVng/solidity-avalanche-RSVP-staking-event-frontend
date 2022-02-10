import { ethers } from 'ethers';
import React from 'react';
import { getAddress, getContractWithSigner } from './utils';

interface StakeDetailsProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const StakeDetails = (props: StakeDetailsProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

    return (
        <div>
            <AllStake contractWithSigner={contractWithSigner} />
        </div>
    )
};

interface StakeProps {
    contractWithSigner: ethers.Contract
}

const AllStake = (props: StakeProps) => {

    const [userStake, updateUserStake] = React.useState({
        stakeAmount: '',
        stakeTime: ''
    });

    const [totalStake, updateTotalStake] = React.useState('0');

    const fetchStakeAmount = async () => {

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
        setInterval(() => {
            fetchStakeAmount();
        }, 15000)
        fetchStakeAmount();
    }, [])

    return (
        <div>
            <p>Your EVT Staked: {userStake.stakeAmount}</p>
            <p>Staked at: {userStake.stakeTime}</p>
            <p>Total EVT Staked: {totalStake}</p>
        </div>
    )
}

export default StakeDetails;