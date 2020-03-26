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
    const nonEmptyPaperIds = !hidePapers ? meta.paper_ids.filter(pid => pid !== "") : [];
    return (
        <>
            {meta.doi ? (
                <>
                    <Gap position="below" size="md">
                        <strong>DOI:</strong><br />
                        <a href={`https://doi.org/${meta.doi}`} rel="noopener">
                            {meta.doi}
                        </a>
                    </Gap>
                    <Gap position="below" size="md">
                        <strong>Paper Link (this might not work):</strong><br />
                        <a href={`https://api.semanticscholar.org/${meta.doi}`}>
                            https://api.semanticscholar.org/{meta.doi}
                        </a>
                    </Gap>
                </>
            ) : null}
            {nonEmptyPaperIds.length > 0 ? (
                <Gap position="below" size="md">
                    <strong>Papers:</strong><br />
                    {nonEmptyPaperIds.map(pid => (
                        <div key={pid}>
                            <Link to={`/paper/${pid}`}>
                                {pid}
                            </Link>
                        </div>
                    ))}
                </Gap>
            ) : null}
            {meta.pubmed_id ? (
                <Gap position="below" size="md">
                    <strong>PubMed:</strong><br />
                    <a href={`https://www.ncbi.nlm.nih.gov/pubmed/${meta.pubmed_id}`} rel="noopener">
                        https://www.ncbi.nlm.nih.gov/pubmed/{meta.pubmed_id}
                    </a>
                </Gap>
            ) : null}
            {meta.msft_academic_paper_id ? (
                <Gap position="below" size="md">
                    <strong>MSFT Academic Search:</strong><br />
                    <a href={`https://academic.microsoft.com/paper/${meta.msft_academic_paper_id}`} rel="noopener">
                        https://academic.microsoft.com/paper/{meta.msft_academic_paper_id}
                    </a>
                </Gap>
            ) : null}
            {meta.license ? (
                <Gap position="below" size="md">
                    <strong>License:</strong><br />
                    {meta.license}
                </Gap>
            ) : null}
            {meta.collection ? (
                <Gap position="below" size="md">
                    <strong>Collection (dataset directory):</strong><br />
                    {meta.collection}
                </Gap>
            ) : null}
        </>
    );
}

