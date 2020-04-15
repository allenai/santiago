import React from 'react';
import { Link } from 'react-router-dom';

import { Gap } from './Gap';
import { MetadataEntry } from '../magellan';

interface Props {
    meta: MetadataEntry;
    hidePapers?: boolean;
}

export const MetadataDetails = ({ meta, hidePapers }: Props) => {
    // TODO: Clean up the index so this isn't necessary in the client.
    const nonEmptyPaperIds = !hidePapers ? meta.paper_ids.filter(pid => pid !== '') : [];
    return (
        <>
            <Gap position="below" size="md">
                <strong>CORD UID:</strong>
                <br />
                {meta.cord_uid}
            </Gap>
            {meta.doi ? (
                <>
                    <Gap position="below" size="md">
                        <strong>DOI:</strong>
                        <br />
                        <a href={`https://doi.org/${meta.doi}`} rel="noopener">
                            {meta.doi}
                        </a>
                    </Gap>
                </>
            ) : null}
            {meta.url ? (
                <Gap position="below" size="md">
                    <strong>URL:</strong>
                    <br />
                    <a href={meta.url} rel="noopener">
                        {meta.url}
                    </a>
                </Gap>
            ) : null}
            {nonEmptyPaperIds.length > 0 ? (
                <Gap position="below" size="md">
                    <strong>Papers:</strong>
                    <br />
                    {nonEmptyPaperIds.map(pid => (
                        <div key={pid}>
                            <Link to={`/paper/${pid}`}>{pid}</Link>
                        </div>
                    ))}
                </Gap>
            ) : null}
            {meta.pubmed_id ? (
                <Gap position="below" size="md">
                    <strong>PubMed:</strong>
                    <br />
                    <a
                        href={`https://www.ncbi.nlm.nih.gov/pubmed/${meta.pubmed_id}`}
                        rel="noopener">
                        https://www.ncbi.nlm.nih.gov/pubmed/{meta.pubmed_id}
                    </a>
                </Gap>
            ) : null}
            {meta.msft_academic_paper_id ? (
                <Gap position="below" size="md">
                    <strong>MSFT Academic Search:</strong>
                    <br />
                    <a
                        href={`https://academic.microsoft.com/paper/${meta.msft_academic_paper_id}`}
                        rel="noopener">
                        https://academic.microsoft.com/paper/{meta.msft_academic_paper_id}
                    </a>
                </Gap>
            ) : null}
            {meta.license ? (
                <Gap position="below" size="md">
                    <strong>License:</strong>
                    <br />
                    {meta.license}
                </Gap>
            ) : null}
            {meta.full_text_file ? (
                <Gap position="below" size="md">
                    <strong>Full Text File:</strong>
                    <br />
                    {meta.full_text_file}
                </Gap>
            ) : null}
            <Gap position="below" size="md">
                <strong>Source:</strong>
                <br />
                {meta.source_x}
            </Gap>
        </>
    );
};
