/**
 * This file is meant for shared display components that you use throughout
 * your application.
 *
 * Components with a lot of logic, or those that are particularly complicated
 * should probably be put in their own file. This file is meant for the
 * re-usable, simple things used in a lot of different spots in your UI.
 */
import * as React from 'react';
import styled from 'styled-components';
import { BodyJumbo, BodySmall, Icon } from '@allenai/varnish/components';

import { Answer } from '../api';

export const LightPaper = styled.div`
    max-width: max-content;
    background: ${({ theme }) => theme.palette.background.info};
    padding: ${({ theme }) => theme.spacing.md};
    border: ${({ theme }) => `solid 1px ${theme.palette.border.info}`};
    border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
`;

export const AnswerInfo: React.SFC<{ answer: Answer }> = ({ answer }) => (
    <LightPaper>
        <p>Our system answered:</p>
        <TwoColumnGrid>
            <BodyJumbo>“{answer.answer}”</BodyJumbo>
            <BodySmall>({answer.score} % confidence)</BodySmall>
        </TwoColumnGrid>
    </LightPaper>
);

export const Loading = styled(Icon).attrs({
    type: 'loading'
})`
    font-size: ${({ theme }) => theme.typography.bodyJumbo.fontSize};
`;

export const Warning = styled(Icon).attrs({
    type: 'warning'
})`
    font-size: ${({ theme }) => theme.typography.bodyJumbo.fontSize};
`;

export const Error: React.SFC<{ message: string }> = ({ message }) => (
    <ErrorGrid>
        <Warning />
        {message}
    </ErrorGrid>
);

const TwoColumnGrid = styled.div`
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: ${({ theme }) => `${theme.spacing.xs}`};
    align-items: center;
`;

const ErrorGrid = styled(TwoColumnGrid)`
    color: ${({ theme }) => theme.palette.text.error.hex};
`;
