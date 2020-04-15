import styled from 'styled-components';
import { Button } from '@allenai/varnish/components';

export const LinkButton = styled(Button).attrs(() => ({ variant: 'primary' }))`
    ${({ theme }) => `
        &&& {
            &,
            &:hover,
            &:active {
                color: #fff;
                padding: ${theme.spacing.xxs} ${theme.spacing.md};
            }
        }
    `}
`;
