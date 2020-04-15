import React from 'react';
import { Link } from 'react-router-dom';
import { MaxLengthText } from '@allenai/varnish/components/MaxLengthText';

import { Paper } from '../magellan';
import { PaperTitle } from './PaperTitle';
import { PaperAbstract } from './PaperAbstract';
import { LinkButton } from './LinkButton';
import { Gap } from './Gap';
import { config } from '../config';

interface Props {
    paper: Paper;
    disableLink?: boolean;
}

export const PaperSummary = ({ paper, disableLink }: Props) => {
    const abstractText = paper.abstract ? paper.abstract.map(a => a.text).join(' ') : '';
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
            {config.ENABLE_S2_LINKS ? (
                <Gap position="above" size="md">
                    <LinkButton href={`https://semanticscholar.org/paper/${paper.paper_id}`}>
                        View on Semantic Scholar
                    </LinkButton>
                </Gap>
            ) : null}
        </>
    );
};
