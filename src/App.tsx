import React from 'react';
import BuyToken from './BuyToken';
import ConnectMetamask from './ConnectMetamask';
import { getRsvpContract } from './utils';

const App = () => {

    const [addressSigner, setAddressSigner] = React.useState({
        address: "",
        signer: ""
    });

    const [contract, setContract] = React.useState(
        getRsvpContract()
    );

  return (
      <div>
          <ConnectMetamask addressSigner={addressSigner} setAddressSigner={setAddressSigner}>
            <BuyToken RSVP={contract} signer={addressSigner.signer} />
          </ConnectMetamask>
      </div>
  );
};

export default App;
