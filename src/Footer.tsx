import React from 'react'
import { useLocation } from 'react-router-dom';
import styles from './css/Footer.module.css';

const Footer = (props: {width: number}) => {

    const [date, setDate] = React.useState({
        unix: (Date.now() / 1000).toFixed(0),
        dateTime: new Date().toLocaleString()
    });
    const [isMount, setIsMount] = React.useState(true);

    const responsive = props.width < 1181;
    const location = useLocation();
    const isRsvp = location.pathname === '/rsvp' && responsive;

    React.useEffect(() => {
        setIsMount(true);
        if (isMount) {
            setInterval(() => {
                setDate({
                    unix: (Date.now() / 1000).toFixed(0),
                    dateTime: new Date().toLocaleString()
                })
            }, 1000)
        }
        return (() => {setIsMount(false)})

    }, [])

    return (
        <div className={isRsvp ? styles.containeralt : styles.container}>
            <div className={styles.footer}>
                <p>Saravut Nakglom@2022</p>
            </div>
            <div className={styles.clock}>
                <p>{date.dateTime}</p>
            </div>
        </div>
    )
}

export default Footer