import { ethers } from 'ethers'
import React from 'react'
import { getContractWithSigner, getProvider, transactionPopup } from './utils'

interface TokenBalanceProps {
    token: ethers.Contract | null,
    signer: string | ethers.providers.JsonRpcSigner | null
    setBalance: Function
    addressSigner: {
        address: string
        signer: string | ethers.providers.JsonRpcSigner | null
    }
}

const TokenBalance = (props: TokenBalanceProps) => {

    const contractWithSigner = (props.token && props.signer) ?  getContractWithSigner(props.token, props.signer) : null;
    // const address = getProvider().getSigner().getAddress();
    
    const fetchBalance = async () => {
        if (!contractWithSigner) {
            return
        }
        let tx = await contractWithSigner.balanceOf(props.addressSigner.address);
        let balance = ethers.utils.formatEther(tx);
        props.setBalance(balance);
    }

    React.useEffect(() => {
        if (props.addressSigner.address) {
            setInterval(() => {
                fetchBalance();
            }, 15000);
    
            fetchBalance();
        }
    })

    return (<></>);
}

export default TokenBalance