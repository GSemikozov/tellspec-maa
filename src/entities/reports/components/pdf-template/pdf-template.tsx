import React from 'react';

import { RangeItem } from '@entities/reports/components/range-item';
import { PDFCover } from '@entities/reports/components/pdf-cover';
import { PDFHeader } from '@entities/reports/components/pdf-header';
import { PDFFooter } from '@entities/reports/components/pdf-footer';
import { ReportInfo } from '@widgets/reports-widget/report-info';
import { MockData } from '@widgets/test-results/mock-data';

import type { Milk } from '@entities/milk';
import type { IDonor } from '@entities/donors';
import type { IFreezer } from '@entities/groups';

import './pdf-template.css';

type PDFTemplateProps = {
    milk: Milk;
    donor?: IDonor;
    freezer?: IFreezer;
};

export const PDFTemplate: React.FC<PDFTemplateProps> = ({ milk, donor, freezer }) => {
    const report = milk.reports[0] || {};
    const { milk_id, last_modified_at } = milk;

    const analyseData = report?.data?.analyseData?.result;
    const proteinValue =
        analyseData?.find(item => item.name === 'Protein (True Protein)')?.value || 0;
    const fatValue = analyseData?.find(item => item.name === 'Fat')?.value || 0;
    // const carbValue = analyseData?.find(item => item.name === 'Total Carbs')?.value || 0;
    const energyValue = analyseData?.find(item => item.name === 'Energy')?.value || 0;
    const fattyAcidValue = MockData.data;

    return (
        <div id={'pdf-container-milk'} className={'pdf-milk-container'}>
            <PDFCover milkID={milk_id} reportDate={last_modified_at} />
            <div className={'pdf-milk-page'}>
                <PDFHeader />
                <div className={'pdf-milk-macroHeader'}>Report Info</div>
                <ReportInfo milkInfo={[milk]} donor={donor} freezer={freezer} />
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
                        <PDFFooter page={3} />
                    </div>

                    <div className={'pdf-milk-page'}>
                        <PDFHeader />

                        <div className={'pdf-milk-macroHeader'}>Linoleic Acid</div>
                        <RangeItem
                            generalRange={[
                                231, 308, 385, 462, 539, 616, 693, 770, 847, 924, 1001, 1078, 1155,
                                1232, 1309, 1386, 1463, 1540, 1617, 1694,
                            ]}
                            normalRangeWidth={1155}
                            value={fattyAcidValue[0].value}
                            unit={'mg/kg/d'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {fattyAcidValue[0].name} mg/kg/d
                            </div>
                            <div className={'pdf-milk-details'}>
                                Lactose is the main sugar in breast milk. It helps decrease the
                                amount of unhealthy bacteria in the stomach. It also helps with the
                                absorption of key nutrients and minerals.
                            </div>
                        </div>

                        <div className={'pdf-milk-macroHeader'}>⍺-Linoleic Acid</div>
                        <RangeItem
                            generalRange={[50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105]}
                            normalRangeWidth={45}
                            value={fattyAcidValue[1].value}
                            unit={'mg/kg/d'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {fattyAcidValue[1].name} mg/kg/d
                            </div>
                            <div className={'pdf-milk-details'}>
                                Lactose is the main sugar in breast milk. It helps decrease the
                                amount of unhealthy bacteria in the stomach. It also helps with the
                                absorption of key nutrients and minerals.
                            </div>
                        </div>
                        <div className={'pdf-milk-macroHeader'}>DHA</div>
                        <RangeItem
                            generalRange={[20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 75]}
                            normalRangeWidth={35}
                            value={fattyAcidValue[2].value}
                            unit={'mg/kg/d'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {fattyAcidValue[2].name} mg/kg/d
                            </div>
                            <div className={'pdf-milk-details'}>
                                Lactose is the main sugar in breast milk. It helps decrease the
                                amount of unhealthy bacteria in the stomach. It also helps with the
                                absorption of key nutrients and minerals.
                            </div>
                        </div>
                    </div>

                    <div className={'pdf-milk-page'}>
                        <PDFHeader />
                        <div className={'pdf-milk-macroHeader'}>ARA</div>
                        <RangeItem
                            generalRange={[20, 30, 40, 50, 60, 70, 80, 90, 100, 110]}
                            normalRangeWidth={70}
                            value={fattyAcidValue[3].value}
                            unit={'mg/kg/d'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {fattyAcidValue[3].name} mg/kg/d{' '}
                            </div>
                            <div className={'pdf-milk-details'}>
                                Lactose is the main sugar in breast milk. It helps decrease the
                                amount of unhealthy bacteria in the stomach. It also helps with the
                                absorption of key nutrients and minerals.
                            </div>
                        </div>

                        <div className={'pdf-milk-macroHeader'}>EPA</div>
                        <RangeItem
                            generalRange={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]}
                            normalRangeWidth={20}
                            value={fattyAcidValue[4].value}
                            unit={'mg/kg/d'}
                        />
                        <div className={'resultContainer'}>
                            <div className={'pdf-milk-yourResult'}>
                                Your result: {fattyAcidValue[4].name} mg/kg/d
                            </div>
                            <div className={'pdf-milk-details'}>
                                Lactose is the main sugar in breast milk. It helps decrease the
                                amount of unhealthy bacteria in the stomach. It also helps with the
                                absorption of key nutrients and minerals.
                            </div>
                        </div>

                        <PDFFooter page={4} />
                    </div>
                </>
            )}
        </div>
    );
};
