import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Zgubiłeś się?</h1>
            <p>Ta strona nie istnieje</p>
            <Link to="/"> Wróć do strony głównej </Link>
        </div>
    );
}