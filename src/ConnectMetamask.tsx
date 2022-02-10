import { JsonRpcSigner } from '@ethersproject/providers';
import React from 'react';
import { getSigner, network } from './utils';

interface ConnectMetamaskProps {
  addressSigner: {
    address: string
    signer: string | JsonRpcSigner
  }
  setAddressSigner: Function
  children?: React.ReactChild
}

function ConnectMetamask(props: ConnectMetamaskProps) {

  const [chainId, setChainId] = React.useState(network.chainId)

  React.useEffect(() => {

    const load = async () => {
      const signer = await getSigner();
      props.setAddressSigner({address: await signer.getAddress(), signer: signer});
    }

    const checkChainId = async () => {
      const signer = await getSigner();
      const chainId = await signer.getChainId();

      console.log(chainId);
      setChainId(chainId);

      await window.ethereum.request({method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: "0xa869",
            chainName: network.name,
            nativeCurrency: {
              symbol: "AVAX"
            },
            rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://testnet.snowtrace.io"] 
          }
        ]
    });

    }

    load();
    checkChainId();
  }, []);

  window.ethereum.on('accountsChanged', () => {
    setTimeout(() => {
      window.location.reload();
    }, 3000)
  });

  if (props.addressSigner.address.length <= 1) {
    return (
      <div>
        <h2>Please connect your metamask</h2>
      </div>
    );
  }

  if (chainId !== network.chainId) {
    return (
      <div>
        <h2>Please change network to Avalanche Fuji Testnet</h2>
      </div>
    )
  }

  return (
    <div>
      <h2>Welcome! {props.addressSigner.address}</h2>
      {props.children}
    </div>
  );
}

export default ConnectMetamask;