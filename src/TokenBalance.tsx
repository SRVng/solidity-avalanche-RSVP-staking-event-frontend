import { ethers } from 'ethers'
import React from 'react'
import { getContractWithSigner, getProvider, transactionPopup } from './utils'

interface TokenBalanceProps {
    token: ethers.Contract,
    signer: string | ethers.providers.JsonRpcSigner
    setBalance: Function
    addressSigner: {
        address: string
        signer: string | ethers.providers.JsonRpcSigner
    }
}

const TokenBalance = (props: TokenBalanceProps) => {

    const contractWithSigner = getContractWithSigner(props.token, props.signer);
    // const address = getProvider().getSigner().getAddress();
    
    const fetchBalance = async () => {
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