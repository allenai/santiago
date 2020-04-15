import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MaxLengthText } from '@allenai/varnish/components/MaxLengthText';

import { MetadataEntry } from '../magellan';
import { PaperTitle } from './PaperTitle';
import { PaperAbstract } from './PaperAbstract';
import { Gap } from './Gap';
import { LinkButton } from './LinkButton';

interface Props {
    meta: MetadataEntry;
    disableLink?: boolean;
}

export const MetadataSummary = ({ meta, disableLink }: Props) => {
    return (
        <>
            <PaperTitle>
                {!disableLink ? <Link to={`/meta/${meta.id}`}>{meta.title}</Link> : meta.title}
            </PaperTitle>
            <div>
                <strong>{meta.authors.join(', ')}</strong>
                {' • '}
                <strong>{meta.publish_time}</strong>
                {' • '}
                <strong>{meta.journal}</strong>
            </div>
            <PaperAbstract>
                <MaxLengthText maxLength={250}>{meta.abstract}</MaxLengthText>
            </PaperAbstract>
            {meta.paper_ids.length > 0 ? (
                <ButtonList position="above" size="md">
                    {meta.paper_ids.map(pid => (
                        <LinkButton key={pid} href={`https://semanticscholar.org/paper/${pid}`}>
                            View on Semantic Scholar
                        </LinkButton>
                    ))}
                </ButtonList>
            ) : null}
        </>
    );
};

const ButtonList = styled(Gap)`
    ${({ theme }) => `
        display: flex;

        ${LinkButton}:not(:last-child) {
            margin-right: ${theme.spacing.md};
        }
    `}
`;
