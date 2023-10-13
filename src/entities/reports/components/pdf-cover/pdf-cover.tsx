import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import { getUser } from '@entities/user/model/user.selectors';
import PreemieLogo from '../../../../../public/img/MAA-logo.png'
import coverImage from './images/pdf-cover.jpeg';

import './pdf-cover.css';

type PDFCover = {
    milkID: string;
    reportDate: string;
};

export const PDFCover: React.FC<PDFCover> = props => {
    const user = useSelector(getUser);
    const date = new Date(props.reportDate);
    const formattedDate = format(date, 'MMMM do yyyy');

    return (
        <div className={'pdf-milk-cover'} style={{ background: `url(${coverImage})` }}>
            <div className={'pdf-milk-imgContainer'}>
                <img src={PreemieLogo} alt='Logo' />
            </div>
            <div className={'pdf-milk-coverHeaderContainer'}>
                <div className={'pdf-milk-headerResults'}>HUMAN MILK ANALYSIS RESULTS</div>
                <div className={'pdf-milk-headerResults'}>Milk ID: {props.milkID}</div>
                <div className={'pdf-milk-headerResults'}>Report Date: {formattedDate}</div>
                <div className={'pdf-milk-headerDoctor'}>
                    Prepared for: {user ? `${user.last_name}, ${user.first_name}` : ''}
                </div>
            </div>
            <div className={'pdf-milk-url'}>PreemieSensor.com</div>
        </div>
    );
};
