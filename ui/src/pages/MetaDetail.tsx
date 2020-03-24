import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Tabs } from '@allenai/varnish/components'
import { Icon } from 'antd';

import { Code, Container, Gap, MetadataSummary, LoadingIndicator } from '../components';
import * as magellan from '../magellan';

interface MetadataEntryIdRouteParams {
    id: string;
}

const MetaDetail = (props: RouteComponentProps) => {
    const params = props.match.params as MetadataEntryIdRouteParams;
    const [meta, setMeta] = React.useState<magellan.MetadataEntry | undefined>();
    React.useEffect(() => {
        magellan.getMetaById(params.id).then(setMeta);
    }, [params.id]);

    const nonEmptyPaperIds = !meta ? [] : meta.paper_ids.filter(pid => pid !== "");

    return (
        <Container>
            {!meta ? (
                <LoadingIndicator />
            ) : (
                <>
                    <Gap position="below" size="lg">
                        <MetadataSummary meta={meta} disableLink />
                    </Gap>
                    <Tabs>
                        <Tabs.TabPane tab="Details" key="details">
                            {meta.doi ? (
                                <>
                                    <Gap position="below" size="md">
                                        <strong>DOI:</strong><br />{meta.doi}
                                    </Gap>
                                    <Gap position="below" size="md">
                                        <strong>Semantic Scholar URL (this might not work):</strong><br />
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
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="JSON" key="json">
                            <Gap position="below" size="md">
                                <TextRight>
                                    <a href={`/api/meta/${meta.id}`} download={`${meta.id}.json`}>
                                        <Icon type="download" />{" "}
                                        Download JSON
                                    </a>
                                </TextRight>
                            </Gap>
                            <Code><pre>{JSON.stringify(meta, null, 2)}</pre></Code>
                        </Tabs.TabPane>
                    </Tabs>
                </>
            )}
        </Container>
    );
};

const TextRight = styled.div`
    text-align: right;
`;

export default MetaDetail;
