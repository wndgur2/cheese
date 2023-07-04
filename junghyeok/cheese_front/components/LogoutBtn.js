'use client'

import { signOut } from 'next-auth/react';

function LogoutBtn(){

    return (
        <button onClick={()=>{ signOut() }}>logout</button>
    );
}

export default LogoutBtn;