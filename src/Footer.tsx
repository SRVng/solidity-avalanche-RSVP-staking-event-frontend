import React from 'react'
import styles from './css/Footer.module.css';

const Footer = () => {

    const [date, setDate] = React.useState({
        unix: (Date.now() / 1000).toFixed(0),
        dateTime: new Date().toLocaleString()
    });
    const [isMount, setIsMount] = React.useState(true);

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
        <div className={styles.container}>
            <div className={styles.footer}>
                <p className={styles.footer}>Saravut Nakglom@2022</p>
            </div>
            <div className={styles.clock}>
                <p>{date.dateTime}</p>
            </div>
        </div>
    )
}

export default Footer