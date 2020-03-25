import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
import { BodyBig, BodyJumbo } from '@allenai/varnish/components'

export const Error = () => (
    <ErrorMsg>
        <BodyJumbo>
            <Icon type="exclamation-circle" />
        </BodyJumbo>
        <BodyBig>
            Sorry, something went wrong.
        </BodyBig>
    </ErrorMsg>
);

const ErrorMsg = styled.div`
    ${({ theme }) => `
        display: grid;
        grid-template-columns: min-content 1fr;
        gap: ${theme.spacing.sm};
        background: ${theme.palette.background.error};
        border: 1px solid ${theme.palette.border.error};
        border-radius: 4px;
        color: ${theme.palette.text.error};
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        align-items: center;
    `}
`;
