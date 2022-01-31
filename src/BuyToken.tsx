import React from 'react';
import { ethers } from 'ethers';

interface SwapProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
}

const BuyToken = (props: SwapProps) => {

    const RSVP = props.RSVP;
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
        const contractWithSigner = RSVP.connect(signer);
        let tx = await contractWithSigner.swap({value: ethers.utils.parseEther(AVAX)});
        await tx.wait();
        console.log(tx.hash);
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
          <button onClick={swap}>Buy</button>
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
