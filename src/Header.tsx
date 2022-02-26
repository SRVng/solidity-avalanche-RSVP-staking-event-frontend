import React, { ReactChild } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './css/Header.module.css';
import metamaskLogo from './img/MetaMask_Fox.png';
import homeLogo from './img/home.png';
import { getProvider, getSigner } from './utils';
import { message } from 'react-message-popup';
import { HiMenuAlt4 } from 'react-icons/hi';
import { MdMenuOpen } from 'react-icons/md';

const Header = (props: {address: string, balance: string, setAddressSigner: Function, width: number}) => {

    const navigate = useNavigate();

    const responsive = props.width <= 1039;

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
      <div className={styles.container}>
          <ShowAddress address={props.address} setAddressSigner={props.setAddressSigner}/>
          <ShowBalance balance={props.balance}/>
          <Navbar />
          <MobileNavBar responsive={responsive}/>
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

const ActiveNavLink = (props: {to: string, children: ReactChild, responsive?: boolean, onClick?: any}) => {

    const navBarCss = (isActive: boolean, responsive?: boolean) => {
        if (responsive) {
            return {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: isActive ? 'pink' : 'white',
                textDecoration: 'none',
                padding: '10px 0px',
            }
        }
        return {
            fontFamily: 'monospace',
            fontSize: '25px',
            color: isActive ? 'red' : ''
        };
    }

    return (
    <NavLink 
        to={props.to} 
        style={({ isActive }) => {return props.responsive ? navBarCss(isActive, props.responsive) : navBarCss(isActive)}}
        onClick={props.onClick ? props.onClick : null}>
        {props.children}
    </NavLink>);
}

const MobileNavBar = (props: {responsive: boolean}) => {

    const [open, setOpen] = React.useState(false);

    const menuStyle = {
        size: 30,
        style: {
            padding: '15px 10px'
        }
    }

    const handleClick = () => {
        setOpen(!open);
    }

    const closeMenu = () => {
        setOpen(false);
    }

    
    const activeNavLinkProps = {
        responsive: props.responsive,
        onClick: closeMenu
    }

    return (
        <div className={styles.mobileNavBarCon}>
            <div style={{width: '1rem'}} onClick={handleClick}>
            {
                open ? <MdMenuOpen  {...menuStyle}/>  : <HiMenuAlt4 {...menuStyle}/>
            }
            </div>
            <nav className={styles.mobileNavBar}>
                <div className={styles.mobileNavLink}>
                    <div className={open ? styles.mobileMenuActive : styles.mobileMenu}>
                        <ActiveNavLink to="/home" {...activeNavLinkProps}>Home</ActiveNavLink> &nbsp;
                        <ActiveNavLink to="/buy" {...activeNavLinkProps}>Buy</ActiveNavLink> &nbsp;
                        <ActiveNavLink to="/create" {...activeNavLinkProps}>Create</ActiveNavLink> &nbsp;
                        <ActiveNavLink to="/rsvp" {...activeNavLinkProps}>RSVP</ActiveNavLink>
                    </div>
                </div>
            </nav> 
        </div>
    );
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
