"use client";
import { SignUp as ClerkSignUp } from '@clerk/nextjs';

const SignUpPage = () => {
    return (
        <div className='w-[400px] mx-auto pt-5'>
            <ClerkSignUp />
        </div>
    );
};

export default SignUpPage;
