import * as Color from 'color';
import fontUtils from './wixStylesFontUtils';
import {isJsonLike, parseJson} from './utils';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const defaultPlugins = {
    join: (color1, strength1, color2, strength2) => {

        color1 = new Color(color1);
        color2 = new Color(color2);

        //todo: use strength
        //let color1strength = args[1];
        //let color2strength = args[3];

        const r = ((color1.red() / 255 + color2.red() / 255) * 255);
        const g = ((color1.green() / 255 + color2.green() / 255) * 255);
        const b = ((color1.blue() / 255 + color2.blue() / 255) * 255);
        const a = ((color1.alpha() + color2.alpha()) / 2);

        return new Color({r, g, b}).alpha(a).rgb().string();
    },
    color: (colorValue, tpaParams: ITPAParams) => {
        if (tpaParams.colors[colorValue]) {
            return tpaParams.colors[colorValue];
        }
        try {
            if (hexColorRegex.test(colorValue)) {
                return colorValue;
            }
            return new Color(colorValue).rgb().string();
        } catch (e) {
            throw 'unparsable color ' + colorValue;
        }
    },
    font: (font, tpaParams: ITPAParams) => {
        let fontValue;
        if (typeof font === 'object') {
            fontValue = font;
        } else if (isJsonLike(font)) {
            const {theme, ...overrides} = parseJson(font);
            fontValue = Object.assign({}, tpaParams.fonts[theme], overrides);
        } else if (tpaParams.fonts[font]) {
            fontValue = tpaParams.fonts[font];
        }
        else {
            return font;
        }
        let fontCssValue = fontUtils.toFontCssValue(fontValue);
        if (fontCssValue[fontCssValue.length - 1] === ';') {
            fontCssValue = fontCssValue.split(';')[0];
        } else {
            //todo: else never reached
        }
        return fontCssValue;

    },
    opacity: (color, opacity) => {
        return (new Color(color)).fade(1 - opacity).rgb().string();
    },
    withoutOpacity: (color) => {
        return (new Color(color)).alpha(1).rgb().string();
    },
    string: (value) => {
        return value;
    },
    darken: (colorVal, darkenValue) => {
        return (new Color(colorVal)).darken(darkenValue).rgb().string();
    },
    number: (value) => {
        return +value;
    },
    unit: (value, unit) => {
        return `${value}${unit}`;
    }
};