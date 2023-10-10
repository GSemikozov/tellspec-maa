import React from 'react';

import { RangeItem } from '@entities/reports/components/range-item';
import { PDFCover } from '@entities/reports/components/pdf-cover';
import { PDFHeader } from '@entities/reports/components/pdf-header';
import { PDFFooter } from '@entities/reports/components/pdf-footer';

import type { Milk } from '@entities/milk';

import './pdf-template.css';
import { ReportInfo } from '@widgets/reports-widget/report-info';

type PDFTemplateProps = {
    milk: Milk;
};

export const PDFTemplate: React.FC<PDFTemplateProps> = ({ milk }) => {
    const report = milk.reports[0] || {};
    const { milk_id, last_modified_at } = milk;

    const analyseData = report?.data?.analyseData?.result;
    const proteinValue =
        analyseData?.find(item => item.name === 'Protein (True Protein)')?.value || 0;
    const fatValue = analyseData?.find(item => item.name === 'Fat')?.value || 0;
    // const carbValue = analyseData?.find(item => item.name === 'Total Carbs')?.value || 0;
    const energyValue = analyseData?.find(item => item.name === 'Energy')?.value || 0;

    return (
        <div id={'pdf-container-milk'} className={'pdf-milk-container'}>
            <PDFCover milkID={milk_id} reportDate={last_modified_at} />
            <div className={'pdf-milk-page'}>
                <PDFHeader />
                <div className={'pdf-milk-macroHeader'}>Report Info</div>
                <ReportInfo milkInfo={[milk]} />
                <PDFFooter page={2} />
            </div>
            {analyseData && (
                <>
                    <div className={'pdf-milk-page'}>
                        <PDFHeader />
                        <div className={'pdf-milk-macroHeader'}>Energy</div>
                        <RangeItem
                            generalRange={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                            normalRangeWidth={50}
                            value={energyValue}
                            unit={'kcal/dl'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {energyValue} kcal/dl
                            </div>
                            <div className={'pdf-milk-details'}>
                                This is a measure of the energy content of the milk. The major
                                contributors are fats, carbohydrates and proteins. It is estimated
                                that a breastfeeding woman should be consuming a minimum of an extra
                                500 calories per day above her normal baseline.
                            </div>
                        </div>

                        <div className={'pdf-milk-macroHeader'}>Protein</div>
                        <RangeItem
                            generalRange={[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2]}
                            normalRangeWidth={37}
                            value={proteinValue}
                            unit={'g/dl'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {proteinValue} g/dl
                            </div>
                            <div className={'pdf-milk-details'}>
                                It is estimated that protein is responsible for 8-10% of a babys
                                energy requirements. Proteins are important for immune and
                                neurological funtion and the building blocks for tissues, muscles
                                and bones.
                            </div>
                        </div>
                        <PDFFooter page={3} />
                    </div>

                    <div className={'pdf-milk-page'}>
                        <PDFHeader />
                        <div className={'pdf-milk-macroHeader'}>Fat</div>
                        <RangeItem
                            generalRange={[0, 1, 2, 3, 4, 5, 6, 7]}
                            normalRangeWidth={37.5}
                            value={fatValue}
                            unit={'g/dl'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {fatValue} g/dl
                            </div>
                            <div className={'pdf-milk-details'}>
                                The amount of fat in milk is contributes to your baby’s growth. It
                                is essential for the metabolism of vitamins important for
                                neurodevelopment and is the main source of calories.
                            </div>
                        </div>

                        {/* <div className={'pdf-milk-macroHeader'}>Carbohydrates</div>
                        <RangeItem
                            generalRange={[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}
                            normalRangeWidth={36.8}
                            value={carbValue}
                            unit={'g/dl'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>Your result: {carbValue} g/dl</div>
                            <div className={'pdf-milk-details'}>
                                Lactose is the main sugar in breast milk. It helps decrease the amount of
                                unhealthy bacteria in the stomach. It also helps with the absorption of key
                                nutrients and minerals.
                            </div>
                        </div> */}
                        <PDFFooter page={4} />
                    </div>
                </>
            )}
        </div>
    );
};
