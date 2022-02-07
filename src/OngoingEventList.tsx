import React from 'react';
import { ethers } from 'ethers';
import { getContractWithSigner } from './utils';

interface OngoingEventListProps {
    RSVP: ethers.Contract
    signer: string | ethers.providers.JsonRpcSigner
};

const OngoingEventList = (props: OngoingEventListProps) => {

    const contractWithSigner = getContractWithSigner(props.RSVP, props.signer);

  return (
      <div>
          <FetchEvent contractWithSigner={contractWithSigner} />
      </div>
  )
};

interface FetchEventProps {
    contractWithSigner: ethers.Contract
}

const FetchEvent = (props: FetchEventProps) => {

    const [eventDetails, updateEventDetails] = React.useState({
        name: '',
        startFrom: '',
        until: '',
        creator: '',
        checkIn: '',
        untilUNIX: ''
    });

    React.useEffect(() => {
        const fetchEvent = async () => {
            let tx = await props.contractWithSigner.ongoing_event();
            let checkInperiodTX = ethers.FixedNumber.from(await props.contractWithSigner.checked_in_period())._value;

            if (new Date(tx.start_from.toNumber() * 1000).getTime() === 0) {
                updateEventDetails({
                    name: tx.event_name,
                    startFrom: '',
                    until: '',
                    creator: '',
                    checkIn: '',
                    untilUNIX: ''
                });
                
                return;
            }

            updateEventDetails({
                name: tx.event_name,
                startFrom: new Date(tx.start_from.toNumber() * 1000).toLocaleString(),
                until: new Date(tx.until.toNumber() * 1000).toLocaleString(),
                creator: tx.creator,
                checkIn: new Date((tx.until.toNumber() + parseInt(checkInperiodTX)) * 1000).toLocaleString(),
                untilUNIX: tx.until.toString()
            });
        }

        setInterval(() => {
            fetchEvent();
        }, 15000)

        fetchEvent();
    }, [])

    if (eventDetails.startFrom === '') {
        return (
        <>
            <p>No event</p>
        </>
        )
    }

    return (
        <>
            <ul>
                <li>Event: {eventDetails.name}</li>
                <li>Starting from: {eventDetails.startFrom}</li>
                <li>Ending: {eventDetails.until}</li>
                <li>Countdown: {
                    <Countdown until={eventDetails.untilUNIX}/>
                    }</li>
                <li>Checkin period: From {eventDetails.until} To {eventDetails.checkIn}</li>
                <li>Event's Creator: {eventDetails.creator}</li>
            </ul>
        </>
    )
}

const Countdown = (props: {until: string}) => {

    const [countdown, setCountdown] = React.useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const getTimeLeft = (sec: number) => {
        let seconds = Math.floor(sec % 60);
        let minutes = Math.floor((sec / 60) % 60);
        let hours = Math.floor((sec / 60 / 60));

        if (hours <= 0 && minutes <= 0 && seconds <= 0) {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return {
            hours, minutes, seconds
        }
    }

    React.useEffect(() => {

        if (!Number.isNaN(parseInt(props.until))) {
            setInterval(() => {
                const now = (Date.now() / 1000).toFixed(0);
            
                const timeLeft = parseInt(props.until) - parseInt(now);
    
                const calculatedTimeleft =  getTimeLeft(timeLeft);
    
                setCountdown(calculatedTimeleft);
            }, 1000);   
        }

    }, [props.until])

    return (
        <>{countdown.hours}:{countdown.minutes}:{countdown.seconds}</>
    )
}

export default OngoingEventList;
