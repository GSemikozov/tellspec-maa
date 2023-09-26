import React from 'react';

import { LoginForm } from '@features/login-form';
import { LoginLayout } from '@widgets/login-layout';

import './login-page.css';

export const LoginPage: React.FunctionComponent = () => {
    return (
        <LoginLayout>
            <LoginForm />
        </LoginLayout>
    );
};
