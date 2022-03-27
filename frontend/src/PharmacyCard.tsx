import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import images from "./img/index";
import {createTheme, ThemeProvider} from "@mui/material";

interface Pharmacy {
    name: string,
    address: string,
    phone: string,
}
export type {Pharmacy};

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

export function PharmacyCard(props: Pharmacy) {
    return (
        <ThemeProvider theme={theme}>
            <Card sx={{ maxWidth: 400 , boxShadow: 10, margin: "auto auto"}}>
                <CardMedia
                    component="img"
                    image={name_to_img[props.name]}
                    title={"Aktualnie dyżur pełni " + props.name}
                    alt={"Aktualnie dyżurująca apteka w Strzelinie to " + props.name}
                />
                <CardContent>
                    <Typography variant="body2" color="red">
                        <h1>Dyżur w Strzelinie pełni /  Дежурить аптека </h1>
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
