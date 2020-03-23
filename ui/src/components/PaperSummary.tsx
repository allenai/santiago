import React from 'react';
import { Link } from 'react-router-dom';
import { MaxLengthText } from '@allenai/varnish/components/MaxLengthText';

import { Paper } from '../magellan';
import { PaperTitle } from './PaperTitle';
import { PaperAbstract } from './PaperAbstract';

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
            <PaperTitle>
                {!disableLink ? (
                    <Link to={`/paper/${paper.paper_id}`}>{titleText}</Link>
                ) : (
                    titleText
                )}
            </PaperTitle>
            <div>
                <strong>{authorNames}</strong>
            </div>
            <PaperAbstract>
                {abstractText === '' ? (
                    'No Abstract'
                ) : (
                    <MaxLengthText maxLength={250}>{abstractText}</MaxLengthText>
                )}
            </PaperAbstract>
        </>
    );
};
