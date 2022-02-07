import { ethers } from 'ethers';
import React from 'react';
import BuyToken from './BuyToken';
import CheckIn from './CheckIn';
import ConnectMetamask from './ConnectMetamask';
import CreateEvent from './CreateEvent';
import EndEvent from './EndEvent';
import ForceEnd from './ForceEnd';
import OngoingEventList from './OngoingEventList';
import RewardDetails from './RewardDetails';
import RSVP from './RSVP';
import StakeDetails from './StakeDetails';
import { getContract } from './utils';

const App = () => {

    const [addressSigner, setAddressSigner] = React.useState({
        address: "",
        signer: ""
    });

    const [contract, setContract] = React.useState({
        nft: getContract('nft'),
        rsvp: getContract('rsvp'),
        token: getContract('token')
    });

  return (
      <div>
          <DateTime />
          <ConnectMetamask addressSigner={addressSigner} setAddressSigner={setAddressSigner}>
              <ContractOrder RSVP={contract.rsvp} token={contract.token} signer={addressSigner.signer}/>
          </ConnectMetamask>
      </div>
  );
};

const DateTime = () => {

    const [date, setDate] = React.useState({
        unix: (Date.now() / 1000).toFixed(0),
        dateTime: new Date().toLocaleString()
    });

    React.useEffect(() => {
        setInterval(() => {
            setDate({
                unix: (Date.now() / 1000).toFixed(0),
                dateTime: new Date().toLocaleString()
            })
        }, 1000)
    }, [])

    return (
        <div>
            {date.dateTime}
            <br />
            {date.unix}
        </div>
    )
}

interface ContractOrderProps {
    RSVP: ethers.Contract
    token: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const ContractOrder = (props: ContractOrderProps) => {
    const useRSVP = {
        RSVP: props.RSVP,
        signer: props.signer
    };
    const useToken = {
        token: props.token,
        signer: props.signer
    }

    return (
        <div>
            <BuyToken {...useToken} />
            <CreateEvent {...useRSVP} />
            <OngoingEventList {...useRSVP} />
            <CheckIn {...useRSVP} />
            <EndEvent {...useRSVP} />
            <StakeDetails {...useRSVP} />
            <RSVP {...useRSVP} />
            <RewardDetails {...useRSVP} />
            <ForceEnd {...useRSVP} />
        </div>
    )
}

export default App;
