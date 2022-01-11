import React from 'react';
import { Link } from 'react-router-dom';
import { useMeQuery } from './generated/graphql';

interface Props {

}

export const Header: React.FC<Props> = () => {
    const { data, loading } = useMeQuery();
    console.log(data);

    let body: any = null;

    if(loading) {
        body = null;
    } else if(data && data.me) {
        body = <div>You are logged in as: { data.me.email }</div>;
    } else {
        body = <div>You are not logged in.</div>
    }
    return (
    <header>
        <div>
            <Link to='/'>Home</Link>
        </div>
        <div>
            <Link to='/register'>Register</Link>
        </div>
        <div>
            <Link to='/login'>Login</Link>
        </div>
        <div>
            <Link to='/bye'>Logout </Link>
        </div>
        {body}
    </header>
    );
}