export const classname = (block: string) => {
    return (element: string = '', mods: (string | undefined)[] | Record<string, boolean> = {}) => {
        if (typeof element === 'undefined') {
            return block;
        }

        let elementClassName = block;

        if (element.length > 0) {
            elementClassName = block + '__' + element;
        }

        if (Array.isArray(mods)) {
            return mods.reduce((carry, mix) => {
                if (mix) {
                    carry += ' ' + mix;
                }

                return carry;
            }, elementClassName);
        }

        const classNamesMods = Object.entries(mods).reduce((carry, [mod, enabled]) => {
            if (enabled) {
                carry += elementClassName + '_' + mod + ' ';
            }

            return carry;
        }, '');

        if (classNamesMods === '') {
            return elementClassName;
        }

        return elementClassName + ' ' + classNamesMods.trim();
    };
};
