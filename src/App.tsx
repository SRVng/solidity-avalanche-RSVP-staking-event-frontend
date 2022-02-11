import { ethers } from 'ethers';
import React from 'react';
import BuyToken from './BuyToken';
import CheckIn from './CheckIn';
import ConnectMetamask from './ConnectMetamask';
import CreateEvent from './CreateEvent';
import EndEvent from './EndEvent';
import ForceEnd from './ForceEnd';
import OngoingEventList from './OngoingEventList';
import WithdrawReward from './WithdrawReward';
import RSVP from './RSVP';
import StakeDetails from './StakeDetails';
import { useRSVP, useToken } from './utils';

import styles from './css/App.module.css';
import fourButtonCSS from './css/FourButtonRSVP.module.css';

import Header from './Header';
import { Route, Routes } from 'react-router-dom';
import TokenBalance from './TokenBalance';

const App = () => {

    const [addressSigner, setAddressSigner] = React.useState({
        address: "",
        signer: ""
    });

    const [balance, setBalance] = React.useState('');

    return (
        <div className={styles.bg}>    
        <ConnectMetamask addressSigner={addressSigner} setAddressSigner={setAddressSigner}>
        <>
        <Routes>
            <Route path="/" element={<Header address={addressSigner.address} balance={balance}/>}>
                <Route path="home" element={<Homepage />} />
                <Route path="buy" element={<BuyToken {...useToken}/>} />
                <Route path="create" element={<CreateEvent {...useRSVP} />} />
                <Route path="rsvp" element={
                    <div>
                        <OngoingEventList homePage={false} {...useRSVP} />
                        <div className={styles.userDetails}>
                            <RSVP balance={balance} {...useRSVP} />
                            <StakeDetails {...useRSVP} />
                            <FourButton />
                        </div>
                    </div>
                }/>
                <Route path="*" element={<></>}/>
            </Route>
        </Routes>
        <TokenBalance setBalance={setBalance} {...useToken}/>
        </>
        </ConnectMetamask>
        </div>
    )
};

const Homepage = () => {

    return (
        <div className={styles.home}>
            <OngoingEventList homePage={true} {...useRSVP} />
        </div>
    )
}

const FourButton = () => {
    return (
        <div className={fourButtonCSS.container}>
            <div className={fourButtonCSS.firstLine}>
            <CheckIn {...useRSVP} />
            <WithdrawReward {...useRSVP} />
            </div>
            <div className={fourButtonCSS.secondLine}>
            <EndEvent {...useRSVP} />
            <ForceEnd {...useRSVP} />
            </div>
        </div>
    )
}

export default App;
