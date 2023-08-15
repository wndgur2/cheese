import { signOut } from 'next-auth/react';

function LogoutBtn(){

    return (
        <button onClick={()=>{ 
            signOut({callbackUrl: "/home"})
        }}>logout</button>
    );
}

export default LogoutBtn;