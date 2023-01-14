import { useRouteError, Link } from "react-router-dom";
import  images  from "./img/index";
import styles from "./ErrorPage.module.css"
import {IconButton} from "@mui/material";
import * as React from "react";
import Home from '@mui/icons-material/Home';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className={styles.error_page}>
            <div>
                <img src={images.error_404}  className={styles.error_image} alt="Nie znaleziono strony"/>
            </div>
            <div className={styles.text}> Internauto i internautko </div>
            <div className={styles.text}> Nic tu nie ma </div>
            <div  className={styles.icon}>
                <Link to="/">
                    <IconButton>
                        <Home fontSize="large"/>
                    </IconButton>
                </Link>
            </div>
        </div>
    );
}