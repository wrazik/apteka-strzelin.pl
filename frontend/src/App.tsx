import React, {useEffect, useState} from 'react';
import './App.css';
import {PropagateLoader} from "react-spinners";
import {Pharmacy, PharmacyCard} from "./PharmacyCard";
import { css } from "@emotion/react";

import axiosBase from "axios";

export const axios = axiosBase.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 5000,
});

function App() {
    const [data, setData] = useState<Pharmacy>({name: "", address: "", phone: ""});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Can be a string as well. Need to ensure each key-value pair ends with ;
    const override = css`
        display: grid;
        align-items: center;
        place-items: center;
        height: 100vh;
    `;

    useEffect(() => {
        const fetch_pharmacy = async()  => {
            const pharmacy = await axios.get<Pharmacy>('/pharmacy');
            setData(pharmacy.data);
            setIsLoading(false);
        };
        fetch_pharmacy();
    }, []);

    return (
        <div id="pharmacy">
            {isLoading ? (
                <PropagateLoader color="#e73c7e" size={20} css={override}/>
            ) : (
                <PharmacyCard name={data.name} address={data.address} phone={data.phone} />
            )}
        </div>
    );
}

export default App;