import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import images from "./img/index";
import {Box, createTheme, IconButton, ThemeProvider} from "@mui/material";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import {Link, useParams} from "react-router-dom";
import parse from 'date-fns/parse'
import sub from 'date-fns/sub'
import add from 'date-fns/add'
import isTomorrow from "date-fns/isTomorrow";
import isYesterday from "date-fns/isYesterday";
import isToday from "date-fns/isToday";
import isPast from 'date-fns/isPast'

interface PharmacyCardProps {
    name: string,
    address: string,
    phone: string,
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
    let months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    let day = today.getDate();
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

    return `${prefix}${some_date.getDate()} ${months[some_date.getMonth()]} ${some_date.getFullYear()}`;
}

function parse_date(date: string | undefined): Date {
    if (date === undefined) {
        return new Date();
    }
    return parse(date, "y-MM-dd", new Date());
}

function format_link_to_date(date: Date): string {
    return `/date/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

function is_this_years_date(link_to_date: string) {
    return link_to_date.includes("2023");
}

function NextArrow() {
    return (
        <IconButton aria-label="Później" size='small' >
            <div id="day">Później</div>
            <ChevronRight/>
        </IconButton>
    );
}

function PreviousArrow() {
    return (
        <IconButton aria-label="Wcześniej" size='small'>
            <ChevronLeft/>
            <div id="day">Wcześniej</div>
        </IconButton>
    );
}

function Next({link}: {link: string}) {
    if (is_this_years_date(link)) {
        return (
            <div>
                <Link to={link}>
                    <NextArrow/>
                </Link>
            </div>
        );
    }
    else {
        return (
            <div className="disabled" >
                <NextArrow/>
            </div>
        )
    }
}

function Previous({link}: {link: string}) {
    if (is_this_years_date(link)) {
        return (
            <div>
                <Link to={link}>
                    <PreviousArrow/>
                </Link>
            </div>
        );
    }
    else {
        return (
            <div className="disabled" >
                <PreviousArrow/>
            </div>
        )
    }
}

function Today({date}: {date: Date}) {
    if (isToday(date)) {
        return <></>
    }
    return (
        <Link to="/">
            <IconButton aria-label="Dzisiaj" size="small">
                <div id="day">Dzisiaj</div>
            </IconButton>
        </Link>
    )
}

function HeaderString({date}:  {date: Date}) {
    let message = "";
    const suffix = "dyżur w Strzelinie"

    if (isYesterday(date)) {
        message = `Wczoraj ${suffix} pełniła: `;
    }
    else if (isToday(date)) {
        message = `Dzisiaj ${suffix} pełni: `;
    }
    else if (isTomorrow(date)) {
        message = `Jutro ${suffix} pełni: `;
    }
    else if(isPast(date)) {
        message = `Tego dnia ${suffix} pełniła: `;
    }
    else {
        message = `Tego dnia ${suffix} będzie pełnić: `;
    }


    return (
        <h1> {message} </h1>
    )
}

export function PharmacyCard(props: PharmacyCardProps) {
    let { date } = useParams();
    const date_parsed = parse_date(date)

    const previous = format_link_to_date(sub(date_parsed, {days: 1}));
    const next = format_link_to_date(add(date_parsed, {days: 1}));

    return (
        <ThemeProvider theme={theme}>
            <Card sx={{maxWidth: 400, boxShadow: 10, margin: "auto auto"}}>
                <CardHeader subheader={generate_date_string(date_parsed)}
                />
                <CardMedia
                    component="img"
                    image={name_to_img[props.name]}
                    title={"Aktualnie dyżur pełni " + props.name}
                    alt={"Aktualnie dyżurująca apteka w Strzelinie to " + props.name}
                />
                <CardContent>
                    <Typography component={'span'} variant="body2" color="red">
                        <HeaderString date={date_parsed} />
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
                <Box sx={{ display: 'flex', justifyContent: "space-between", pl: 1, pb: 1 }}>
                    <Previous link={previous} />
                    <Today date={date_parsed}/>
                    <Next link={next}/>
                </Box>
            </Card>
        </ThemeProvider>
    );
}
