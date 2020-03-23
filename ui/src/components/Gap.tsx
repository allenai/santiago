import styled from 'styled-components';
import { DefaultVarnishTheme } from '@allenai/varnish/theme/DefaultVarnishTheme';

type Position = 'above' | 'below' | 'left' | 'right';

function getMarginPropertyName(position: Position) {
    switch (position) {
        case 'above':
            return 'margin-top';
        case 'below':
            return 'margin-bottom';
        case 'left':
            return 'margin-left';
        case 'right':
            return 'margin-right';
    }
}

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xl2' | 'xl3' | 'xl4' | 'xl5';

function getMarginValue(size: Size, theme: typeof DefaultVarnishTheme) {
    return theme.spacing[size];
}

/**
 * It's not valid to wrap everything in a `<p />` tag, so this component provides a mechanism
 * for creating visual whitespace via a `<div />`.
 */
export const Gap = styled.div<{ position: Position; size?: Size }>`
    ${({ theme, position, size }) => `
        ${getMarginPropertyName(position)}: ${getMarginValue(size || 'lg', theme)};
    `}
`;
