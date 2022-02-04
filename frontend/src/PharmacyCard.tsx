import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import images from "./img/index";

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
    "Apteka Centrum Zdrowia": images.centrum_zdrowia
}

export function PharmacyCard(props: Pharmacy) {
    return (
        <Card sx={{ maxWidth: 400 , boxShadow: 20, margin: "auto auto"}}>
            <CardMedia
                component="img"
                image={name_to_img[props.name]}
            />
            <CardContent>
                <Typography variant="body2" color="red">
                    Dyżur
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
    );
}
