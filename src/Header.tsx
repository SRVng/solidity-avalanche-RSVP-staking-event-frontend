import React, { ReactChild } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './css/Header.module.css';
import metamaskLogo from './img/MetaMask_Fox.png';
import homeLogo from './img/home.png';

const Header = (props: {address: string}) => {

    const navigate = useNavigate();

    React.useEffect(() => {
        navigate("/home")
    }, [])

  return (
      <div>
          <ShowAddress address={props.address}/>
          <DateTime />
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

const DateTime = () => {

    const [date, setDate] = React.useState({
        unix: (Date.now() / 1000).toFixed(0),
        dateTime: new Date().toLocaleString()
    });

    React.useEffect(() => {
        setInterval(() => {
            setDate({
                unix: (Date.now() / 1000).toFixed(0),
                dateTime: new Date().toLocaleString()
            })
        }, 1000)
    }, [])

    return (
        <div className={styles.clock}>
            <p>{date.dateTime}</p>
        </div>
    )
}

const ShowAddress = (props: {address: string}) => {

    const metamaskImage = <img src={metamaskLogo} alt="" width={20} height={20}/>

    return (
        <div className={styles.address}>
            <p>
                {props.address.slice(0,5) + '....' + props.address.slice(-4)} 
                {metamaskImage}
            </p>
        </div>
    )
}

export default Header;
