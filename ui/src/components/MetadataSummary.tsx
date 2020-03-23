import React from 'react';
import { Link } from 'react-router-dom';
import { MaxLengthText } from '@allenai/varnish/components/MaxLengthText';

import { MetadataEntry } from '../magellan';
import { PaperTitle } from './PaperTitle';
import { PaperAbstract } from './PaperAbstract';

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
        </>
    );
};
