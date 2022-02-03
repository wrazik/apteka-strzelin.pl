import React from 'react';

interface Pharmacy {
    name: String,
    address: String,
    phone: String,
}

export type { Pharmacy };

export function PharmacyCard(props: Pharmacy) {
    return (
        <div className="current-pharmacy">
            <div className="welcome-msg"> Dyżur pełni: </div>
            <div className="pharmacy-name"> {props.name} </div>
            <div className="pharmacy-address"> {props.address} </div>
            <div className="pharmacy-phone"> {props.phone} </div>
        </div>
    );
}