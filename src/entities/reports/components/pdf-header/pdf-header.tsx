import React from 'react';
import { useSelector } from 'react-redux';

import { getUser } from '@entities/user/model/user.selectors';
// eslint-disable-next-line import/order
import PreemieLogo from '/public/img/logo-pdf.png';

import './pdf-header.css';
// eslint-disable-next-line import/order
import { format } from 'date-fns';

export const PDFHeader: React.FC = () => {
    const user = useSelector(getUser);
    const formattedDate = format(new Date(), 'MMMM do yyyy');

    return (
        <div className={'pdf-milk-header'}>
            <img src={PreemieLogo} className={'pdf-milk-headerImg'} />
            <div className={'pdf-milk-headerContainer'}>
                <span className={'pdf-milk-headerContainerResults'}>
                    HUMAN MILK ANALYSIS RESULTS
                </span>
               
                <span>Prepared for: {user ? `${user.last_name}, ${user.first_name}` : ''}</span>
                <span>{formattedDate}</span>
            </div>
        </div>
    );
};
