export const getScaleValues = (min: number, max: number, value: number, division: number) => {
    const addToLengthPercent = 0.3;
    const start = Math.min(min, value);
    const end = Math.max(max, value);
    const arrayLength = Math.ceil(((end - start) * (1 + addToLengthPercent)) / division);
    return new Array(arrayLength).fill('').map((_, i) => start + i * division);
};

export const getNodeIndexInArray = (array: number[], value: number, divisionValue: number) => {
    const start = array[0];
    return [
        Math.floor((value - start) / divisionValue),
        Math.ceil((value - start) / divisionValue),
    ];
};

// Layout
export const getMiddlePointOfNode = (node: Element) => node.getBoundingClientRect().width / 2;

export const getNodeOffsetLeft = (node: Element) => node.getBoundingClientRect().left;

export const getDistanceBetweenTwoNodes = (node1: Element, node2: Element) => {
    return getNodeOffsetLeft(node2) - getNodeOffsetLeft(node1);
};
