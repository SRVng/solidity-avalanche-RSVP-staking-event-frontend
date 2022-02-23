import React, { ReactChild } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './css/Header.module.css';
import metamaskLogo from './img/MetaMask_Fox.png';
import homeLogo from './img/home.png';
import { getProvider, getSigner } from './utils';
import { message } from 'react-message-popup';

const Header = (props: {address: string, balance: string, setAddressSigner: Function}) => {

    const navigate = useNavigate();

    React.useEffect(() => {
        navigate("/home")
    }, [])
    
    React.useEffect(() => {

        const checkExistConnect = async () => {
          try {
            const address = await getProvider().getSigner().getAddress();
            const signer = await getSigner();
            props.setAddressSigner({address: address, signer: signer})
          } catch { 
            message.warning('Please connect metamask', 3000); 
          }
        }
    
        checkExistConnect();
      }, []);

  return (
      <div>
          <ShowAddress address={props.address} setAddressSigner={props.setAddressSigner}/>
          <ShowBalance balance={props.balance}/>
          <Navbar />
          <Outlet />
      </div>
  );
};

const Navbar = () => {

    const homeImage = <img src={homeLogo} width={40} height={40} alt=""/>

    return (
        <div style={{ display: "grid"}}>
        <nav className={styles.navbar}>
            <div className={styles.navLink}>
                <div className={styles.homemenu}>
                    <ActiveNavLink to="/home">{homeImage}</ActiveNavLink> &nbsp;
                </div>
                <div className={styles.menu}>
                    <ActiveNavLink to="/buy">Buy</ActiveNavLink> &nbsp;
                    <ActiveNavLink to="/create">Create</ActiveNavLink> &nbsp;
                    <ActiveNavLink to="/rsvp">RSVP</ActiveNavLink>
                </div>
            </div>
        </nav>
        </div>
    );
}

const ActiveNavLink = (props: {to: string, children: ReactChild}) => {

    const navBarCss = (isActive: boolean) => {
        return {
            fontFamily: 'monospace',
            fontSize: '25px',
            color: isActive ? 'red' : ''
        };
    }

    return (
    <NavLink to={props.to} style={({ isActive }) => {return navBarCss(isActive)}}>
        {props.children}
    </NavLink>);
}

const ShowAddress = (props: {address: string, setAddressSigner: Function}) => {

    const metamaskImage = <img src={metamaskLogo} alt="" width={20} height={20}/>

    const load = async () => {
        const signer = await getSigner();
        props.setAddressSigner({address: await signer.getAddress(), signer: signer});
    }

    return (
        <div className={props.address ? styles.address : styles.noAddress}>
            {
                props.address ? (
                    <p>
                        {props.address.slice(0,5) + '....' + props.address.slice(-4)} 
                        {metamaskImage}
                    </p>
                ) : (
                    <p onClick={load}>
                        {metamaskImage} Connect
                    </p>
                )
            }
        </div>
    )
}

const ShowBalance = (props: {balance: string}) => {
    return (
        <div className={styles.balance}>
            <p>
                {
                    'EVT Balance: ' + (props.balance ? props.balance.slice(0,6) : '...')
                }
            </p>
        </div>
    )
}

export default Header;
