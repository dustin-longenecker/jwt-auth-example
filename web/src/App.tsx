import React, { useEffect, useState } from "react";
import { setAccessToken } from "./accessToken";
import AppRoutes from "./AppRoutes";

interface Props {

}

export const App: React.FC<Props> = () => {
    const [loading, setLoading] = useState (true);

    useEffect(() => {
        fetch('http://localhost:4000/refresh_token',
        { 
            method: 'POST',
            credentials: 'include' 
        })
        .then(x => async (x: { json: () => any; }) => {
            const { accessToken } = await x.json();
            setAccessToken(accessToken);
            // console.log(accessToken);
            setLoading(false);
        });
    }, [])

    if (loading) {
        <div>Loading . . .</div>
    }
    return <AppRoutes />;
}