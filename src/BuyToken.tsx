import React from 'react';
import { ethers } from 'ethers';
import { getContractWithSigner, transactionPopup } from './utils';
import styles from './css/BuyToken.module.css';

interface SwapProps {
    token: ethers.Contract| null
    signer: string | ethers.providers.JsonRpcSigner | null
}

const BuyToken = (props: SwapProps) => {

    const [state, setState] = React.useState({
        token: 'EVT',
        amount: '1'
    });
    

    const handleEVT = (e: string) => {
        setState({token: 'EVT', amount: e})
    };

    const AVAX = tryConvert(state.amount);

    const swap = async () => {
        if (props.token !== null && props.signer !== null) {
        const contractWithSigner = getContractWithSigner(props.token, props.signer);
        try {
            let tx = await contractWithSigner.swap({value: ethers.utils.parseEther(AVAX)});
            transactionPopup(tx.hash, false, undefined, tx.wait);
        } catch(e: any) {
            console.error(e);
            transactionPopup(e.hash, true, e.data.message);
        }
        }
    }

  return (
      <div className={styles.container}>
          <div>
              <SwapInput
                token='EVT'
                amount={state.amount}
                setAmount={handleEVT}
                changable={true} />
              <SwapInput
                token='AVAX'
                amount={AVAX}
                setAmount={null}
                changable={false} />
          </div>
          <br/>
          <div className={styles.btncontainer}>
            <button className={styles.buybtn} onClick={swap}>Buy</button>
            &nbsp;
            <BuyOnPangolin tokenAddress='0x790b47bebe7e135887baa1c9841048dc6ca348ed' />
          </div>
      </div>
  );
};

interface SwapInputProps {
    token: string
    amount: string
    setAmount: Function | null
    changable: boolean
}

const SwapInput = (props: SwapInputProps) => {

    if (props.changable) {
        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            props.setAmount!(e.target.value)
        }
        return (
            <div className={styles.field}>
            <fieldset>
                <legend>Enter {props.token} amount</legend>
                <input value={props.amount} onChange={handleOnChange} />
            </fieldset>
            </div>
        ) 
    }

    return (
        <div className={styles.field}>
            <fieldset>
                <legend>{props.token}</legend>
                <input value={props.amount} readOnly={true}/>
            </fieldset>
        </div>
    )
}

interface BuyOnPangolinProps {
    tokenAddress: string
}

const BuyOnPangolin = (props: BuyOnPangolinProps) => {
    const pangolinLink = "https://app.pangolin.exchange/#/swap?outputCurrency="
    return (
        <div>
            <a href={pangolinLink + props.tokenAddress} target="_blank" rel="noreferrer">
                <button className={styles.pangolinbtn}>
                    Buy on Pangolin
                </button>
            </a>
        </div>
    )
}

const tryConvert = (
    amount: string
) => {

    const input = parseFloat(amount);

    if (Number.isNaN(input)) {
        return '';
    }

    return (input * 0.01).toFixed(2).toString()
}

export default BuyToken;
