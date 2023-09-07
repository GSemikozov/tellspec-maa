export const classname = (block: string) => {
    return (element: string = '', mods: Record<string, boolean> = {}) => {
        if (element === '') {
            return block;
        }

        const elementClassName = block + '__' + element;

        const classNamesMods = Object.entries(mods).reduce((carry, [mod, enabled]) => {
            if (enabled) {
                carry += elementClassName + '_' + mod + ' ';
            }

            return carry;
        }, '');

        if (classNamesMods === '') {
            return elementClassName;
        }

        return elementClassName + ' ' + classNamesMods;
    };
};
