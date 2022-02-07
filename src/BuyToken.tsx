import React from 'react';
import { ethers } from 'ethers';
import { transactionPopup } from './utils';

interface SwapProps {
    token: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const BuyToken = (props: SwapProps) => {

    const evt = props.token;
    const signer = props.signer;

    const [state, setState] = React.useState({
        token: 'EVT',
        amount: '1'
    });
    

    const handleEVT = (e: string) => {
        setState({token: 'EVT', amount: e})
    };

    const AVAX = tryConvert(state.amount);

    const swap = async () => {
        const contractWithSigner = evt.connect(signer);
        try {
            let tx = await contractWithSigner.swap({value: ethers.utils.parseEther(AVAX)});
            await tx.wait();
            transactionPopup(tx.hash, false);
        } catch(e: any) {
            transactionPopup(e.hash, true, e.data.message)
        }
    }

  return (
      <div>
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
          <button onClick={swap}>Buy</button>
          <BuyOnPangolin tokenAddress='0x790b47bebe7e135887baa1c9841048dc6ca348ed' />
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
            <fieldset>
                <legend>Enter {props.token} amount</legend>
                <input value={props.amount} onChange={handleOnChange} />
            </fieldset>
        ) 
    }

    return (
        <div>
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
                <button>
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
