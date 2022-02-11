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

export const getContract = (contract: 'nft' | 'RSVP' | 'token' ) => {

    const provider = getProvider();
    
    const abiList = {
        nft: require('./abi/nftAbi.json'),
        RSVP: require('./abi/rsvpAbi.json'),
        token: require('./abi/tokenAbi.json'),
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

export const useRSVP = {
    RSVP: getContract("RSVP"),
    signer: getProvider().getSigner()
};

export const useToken = {
    token: getContract("token"),
    signer: getProvider().getSigner()
};

export interface CreateParams {
    name: string
    until: number
    wallet: string
}

export interface RSVPParams {
    name: string
    until: number
    amount: number
    wallet: string
}

export interface EndEventParams {
    name: string
    start: number
    until: number
    owner: string
    eventCreator: CreateParams
}

export const getSignature = async (
    action: CreateParams | RSVPParams | EndEventParams,
    ) => {

    const provider = getProvider();

    const rsvpContract = getContract("RSVP");

    const EIP712DomainType = [
        { name: 'name', type: 'string'},
        { name: 'version', type: 'string'},
        { name: 'chainId', type: 'uint256'},
        { name: 'verifyingContract', type: 'address'},
        { name: 'salt', type: 'address'}
    ]
    const EIP712Domain = {
        name: "RSVP Event", 
        version: "1",
        chainId: 43113,
        verifyingContract: rsvpContract.address,
        salt: "0x790b47Bebe7e135887BAA1c9841048dC6Ca348Ed"
    }

    const type = EIP712TypeMsg(action);

    var msgParams;

    switch (type!.primaryType) {
        case 'CreateData': {
            msgParams = JSON.stringify({
                types: {
                    EIP712Domain: EIP712DomainType,
                    CreateData: type!.TYPE
                },
                primaryType: type!.primaryType,
                domain: EIP712Domain,
                message: type!.MESSAGE
            })       
            break;
        }
        case 'RSVPData': {
            msgParams = JSON.stringify({
                types: {
                    EIP712Domain: EIP712DomainType,
                    RSVPData: type!.TYPE
                },
                primaryType: type!.primaryType,
                domain: EIP712Domain,
                message: type!.MESSAGE
            })
            break;
        }
        case 'EndEventData': {
            msgParams = JSON.stringify({
                types: {
                    EIP712Domain: EIP712DomainType,
                    EndEventData: type!.TYPE,
                    CreateData: type!.subType
                },
                primaryType: type!.primaryType,
                domain: EIP712Domain,
                message: type!.MESSAGE
            })
            break;
        }
    }

    const method = 'eth_signTypedData_v4';
    const params = [window.ethereum.selectedAddress, msgParams];

    return await provider.send(method, params);
}

const EIP712TypeMsg = (params: CreateParams | RSVPParams | EndEventParams) => {

    const CreateType = [
        { name: 'name', type: 'string'},
        { name: 'until', type: 'uint256'},
        { name: 'wallet', type: 'address'}
    ]
    const RSVPType = [
        { name: 'name', type: 'string'},
        { name: 'until', type: 'uint256'},
        { name: 'amount', type: 'uint256'},
        { name: 'wallet', type: 'address'}
    ]
    const EndEventType = [
        { name: 'name', type: 'string'},
        { name: 'start', type: 'uint256'},
        { name: 'until', type: 'uint256'},
        { name: 'owner', type: 'address'},
        { name: 'eventCreator', type: 'CreateData'}
    ]

    if (!("amount" in params) && !("eventCreator" in params)) {
        const CreateMessage = {
            name: params.name,
            until: params.until,
            wallet: window.ethereum.selectedAddress,
            content: "You will need to pay 0.1 AVAX as a collateral until event ended"
        }
        const primaryType = "CreateData";

        return {
            TYPE: CreateType,
            MESSAGE: CreateMessage,
            primaryType: primaryType
        }
    } else if ("amount" in params) {
        const RSVPMessage = {
            name: params.name,
            until: params.until,
            amount: params.amount,
            wallet: params.wallet,
        };
        const primaryType = "RSVPData";

        return {
            TYPE: RSVPType,
            MESSAGE: RSVPMessage,
            primaryType: primaryType
        }
    } else if ("eventCreator" in params) {
        const EndEventMessage = {
            name: params.name,
            start: params.start,
            until: params.until,
            owner: params.owner,
            eventCreator: params.eventCreator
        }
        const primaryType = "EndEventData";

        return {
            TYPE: EndEventType,
            MESSAGE: EndEventMessage,
            primaryType: primaryType,
            subType: CreateType
        }
    }
}