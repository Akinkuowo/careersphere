"use client";
import { SignIn as ClerkSignIn } from '@clerk/nextjs';

const SignUpPage = () => {
    return (
        <div className='w-[400px] mx-auto pt-5'>
            <ClerkSignIn />
        </div>
    );
};

export default SignUpPage;
