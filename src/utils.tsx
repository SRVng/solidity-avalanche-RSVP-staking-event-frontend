import { ethers } from "ethers";
import { message } from "react-message-popup";

export const network = {
    name: "Avalanche Fuji",
    chainId: 43113
}

export const getProvider = (setNetwork?: {name: string, chainId: number}) => {

    if (setNetwork !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, setNetwork);

        return provider
    } else {

        // https://github.com/ethers-io/ethers.js/issues/866
        
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        provider.on("network", (n, o) => {
            if (o) {
                window.location.reload()
            }
        })

        return provider
    }
}

export const getContract = (contract: 'nft' | 'rsvp' | 'token') => {

    const provider = getProvider();
    
    const abiList = {
        nft: require('./abi/nftAbi.json'),
        rsvp: require('./abi/rsvpAbi.json'),
        token: require('./abi/tokenAbi.json')
    };

    const abi = abiList[contract];
    const CONTRACT_ADDRESS = abi.CONTRACT_ADDRESS;
    const CONTRACT_ABI = abi.CONTRACT_ABI;

    const CONTRACT = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    return CONTRACT
}

export const getSigner = async () => {

    const provider = getProvider();

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    return signer
}

export const getContractWithSigner = (
    contract: ethers.Contract,
    signer: string | ethers.providers.JsonRpcSigner
) => {
    return contract.connect(signer)
}

export const getAddress = async () => {
    const provider = await getProvider();
    return await (await provider.getSigner()).getAddress();
}

export const transactionPopup = (
    hash: string,
    error: boolean, 
    errorMsg?: string) => {
    if (!error) {
        message.loading('Sending transaction', 4000).then(() => {
            setTimeout(() => {
                message.success("Hash: " + hash, 4000)
            }, 4000);
        });
    } else if (errorMsg) {
        message.error(errorMsg, 4000);
    } else {
        message.error('Error occured', 4000);
    }
}