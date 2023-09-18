import React from 'react';

import { LoginLayout } from '@widgets/login-layout';
import { ForgetPasswordForm } from '@features/forget-password-form';

export const ForgetPasswordPage: React.FunctionComponent = () => {
    return (
        <LoginLayout>
            <ForgetPasswordForm />
        </LoginLayout>
    );
};
