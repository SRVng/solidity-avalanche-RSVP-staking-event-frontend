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
import Footer from './Footer';

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
            <Route path="/" element={
            <>
                <Header address={addressSigner.address} setAddressSigner={setAddressSigner} balance={balance}/>
                <Footer />
            </>
            }>
                <Route path="home" element={<Homepage address={addressSigner.address} />} />
                <Route path="buy" element={<BuyToken {...useToken}/>} />
                <Route path="create" element={<CreateEvent {...useRSVP} />} />
                <Route path="rsvp" element={
                    <div>
                        <OngoingEventList homePage={false} address={addressSigner.address} {...useRSVP} />
                        <div className={styles.userDetails}>
                            <RSVP balance={balance} {...useRSVP} />
                            <StakeDetails address={addressSigner.address} {...useRSVP} />
                            <FourButton />
                        </div>
                    </div>
                }/>
                <Route path="*" element={<></>}/>
            </Route>
        </Routes>
        <TokenBalance setBalance={setBalance} addressSigner={addressSigner} {...useToken}/>
        </>
        </ConnectMetamask>
        </div>
    )
};

const Homepage = (props: {address: string}) => {

    return (
        <div className={styles.home}>
            <OngoingEventList address={props.address} homePage={true} {...useRSVP} />
        </div>
    )
}

const FourButton = () => {
    return (
        <div className={fourButtonCSS.container}>
            <p>Interaction</p>
            <div className={fourButtonCSS.buttonContainer}>
            <div className={fourButtonCSS.firstLine}>
            <CheckIn {...useRSVP} />
            <WithdrawReward {...useRSVP} />
            </div>
            <div className={fourButtonCSS.secondLine}>
            <EndEvent {...useRSVP} />
            <ForceEnd {...useRSVP} />
            </div>
            </div>
        </div>
    )
}

export default App;
