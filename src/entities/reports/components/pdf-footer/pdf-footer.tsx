import React from 'react';

import './pdf-footer.css';

type PDFFooterProps = {
    page: number;
};

export const PDFFooter: React.FC<PDFFooterProps> = ({ page }) => {
    return (
        <div className='pdf-milk-footer'>
            <div className='pdf-milk-footerPage'>Page {page}</div>
        </div>
    );
};
