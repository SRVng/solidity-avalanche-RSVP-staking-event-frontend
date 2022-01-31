import { ethers } from "ethers";

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

export const getRsvpContract = () => {

    const provider = getProvider();

    const abi = require("./abi.json");
    const CONTRACT_ADDRESS = abi.CONTRACT_ADDRESS;
    const CONTRACT_ABI = abi.CONTRACT_ABI;

    const RSVP = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    return RSVP
}

export const getSigner = async () => {

    const provider = getProvider();

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    return signer
}