import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MaxLengthText } from '@allenai/varnish/components/MaxLengthText';

import { Paper } from '../magellan';

interface Props {
    paper: Paper;
    disableLink?: boolean;
}

export const PaperSummary = ({ paper, disableLink }: Props) => {
    const abstractText = paper.abstract.map(a => a.text).join(' ');
    const authorNames = paper.metadata.authors
        .map(a => [a.first, a.middle.join(' '), a.last].join(' '))
        .join(', ');
    const titleText = paper.metadata.title === '' ? 'Unknown Title' : paper.metadata.title;
    return (
        <>
            <Title>
                {!disableLink ? (
                    <Link to={`/paper/${paper.paper_id}`}>{titleText}</Link>
                ) : (
                    titleText
                )}
            </Title>
            <div>{authorNames}</div>
            <Abstract>
                {abstractText === '' ? (
                    'No Abstract'
                ) : (
                    <MaxLengthText maxLength={250}>{abstractText}</MaxLengthText>
                )}
            </Abstract>
        </>
    );
};

const Title = styled.h4`
    margin: 0;
`;

const Abstract = styled.div`
    ${({ theme }) => `
        max-width: 80ch;
        margin: ${theme.spacing.xs} 0 0;
    `}
`;
