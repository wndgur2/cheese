'use client'

import { signIn } from 'next-auth/react';

function LoginBtn(){

    return (
        <button onClick={()=>{ signIn() }}>소셜 로그인</button>
    );
}

export default LoginBtn;