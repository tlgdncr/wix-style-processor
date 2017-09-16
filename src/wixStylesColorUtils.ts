import {forEach} from './utils';

export const wixStylesColorUtils = {
    getFullColorStyles({colorStyles, siteColors}: { siteColors: [{ reference, value }], colorStyles: Object }) {
        let returnValue: any = {};
        // Fix color styles due to '.' to '-' conversion
        let fixedColorStyles: any = {};

        for (let key in colorStyles) {
            fixedColorStyles[key.replace(/\./g, '-')] = colorStyles[key].value;
        }

        // Helper functions
        // Basic definitions
        returnValue['white'] = '#FFFFFF';
        returnValue['black'] = '#000000';
        // Basic template colors
        forEach(siteColors, ({reference, value}) => {
            returnValue[reference] = value;
        });

        returnValue = Object.assign(returnValue, fixedColorStyles);
        // Fix for a bug in a very specific template
        returnValue['background'] = (fixedColorStyles.background || {}).value || (returnValue['color-1'] === '#FFFFFF') && (returnValue['color-2'] === '#F4EFE1') ? returnValue['color-2'] : returnValue['color-1'];
        return returnValue;
    }
};
