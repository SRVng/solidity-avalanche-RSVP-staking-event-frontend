import { JsonRpcSigner } from '@ethersproject/providers';
import React from 'react';
import { getSigner, network } from './utils';
import styles from './css/ConnectMetamask.module.css';

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
      <div className={styles.fetchMetamask}>
        <h2>Please connect your Metamask</h2>
      </div>
    );
  }

  if (chainId !== network.chainId) {

    const addNetwork = async () => {
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

    return (
      <div className={styles.fetchMetamask}>
        <h2>Please change network to Avalanche Fuji Testnet</h2>
        <p>Old Metamask version may not support automatic add chain but you can do this manually</p>
        <button className={styles.addButton} onClick={addNetwork}>Add Network</button>
        <div className={styles.manualAdd}>
          <p>Name: Avalanche Fuji Testnet</p>
          <p>Chain ID: 43113</p>
          <p>Native Currency: AVAX</p>
          <p>RPC Url: https://api.avax-test.network/ext/bc/C/rpc</p>
          <p>Explorer: https://testnet.snowtrace.io</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {props.children}
    </div>
  );
}

export default ConnectMetamask;
