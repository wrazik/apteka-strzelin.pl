import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import images from "./img/index";
import {createTheme, ThemeProvider} from "@mui/material";

interface PharmacyCardProps {
    name: string,
    address: string,
    phone: string,
    date: Date
}

export type {PharmacyCardProps};

const name_to_img: Record<string, string> = {
    "Apteka Pod Paprocią": images.pod_paprocia,
    "Inter Apteka": images.inter_apteka,
    "Apteka Nova": images.nova,
    "Apteka Kalina": images.kalina,
    "Apteka Pod Złotym Lwem": images.pod_zlotym_lwem,
    "Apteka Centrum Zdrowia": images.centrum_zdrowia,
    "Apteka Pod Złotym Strzelcem": images.pod_zlotym_strzelcem,
}

const theme = createTheme({
    typography: {
        "fontFamily": "Vertigo",
        "fontWeightBold": "bold"
    }
})

function generate_date_string(some_date: Date): string {
    let prefix = "";
    let days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    let day = today.getDate();
    const locale = "pl-PL";
    if (year === some_date.getFullYear() &&
        month === some_date.getMonth() + 1) {
        const day_diff = day - some_date.getDate();
        if (day_diff === 0) {
            prefix = "Dzisiaj, ";
        } else if (day_diff === -1) {
            prefix = "Jutro, ";
        } else if (day_diff === -2) {
            prefix = "Pojutrze, ";
        } else if (day_diff === 1) {
            prefix = "Wczoraj, ";
        } else if (day_diff === 2) {
            prefix = "Przedwczoraj, ";
        }
        prefix = `${days[some_date.getDay()]}, `;
    }

    return `${prefix}${some_date.getDate()} ${some_date.toLocaleString(locale, {month: "long"})} ${some_date.getFullYear()}`;
}

export function PharmacyCard(props: PharmacyCardProps) {
    return (
        <ThemeProvider theme={theme}>
            <Card sx={{maxWidth: 400, boxShadow: 10, margin: "auto auto"}}>
                <CardHeader subheader={generate_date_string(props.date)}
                />
                <CardMedia
                    component="img"
                    image={name_to_img[props.name]}
                    title={"Aktualnie dyżur pełni " + props.name}
                    alt={"Aktualnie dyżurująca apteka w Strzelinie to " + props.name}
                />
                <CardContent>
                    <Typography component={'span'} variant="body2" color="red">
                        <h1>Dyżur w Strzelinie pełni </h1>
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.phone}
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}
