import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Tabs } from '@allenai/varnish/components';
import { Icon } from 'antd';

import { Code, Container, Gap, PaperSummary, LoadingIndicator, MetadataDetails } from '../components';
import * as magellan from '../magellan';

interface PaperIdRouteParams {
    id: string;
}

interface State {
    paper?: magellan.Paper;
    meta?: magellan.PaperMetaSearchResults;
}

const PaperDetail = (props: RouteComponentProps) => {
    const params = props.match.params as PaperIdRouteParams;
    const [ { paper, meta }, setState ] =
        React.useState<State>({ paper: undefined, meta: undefined });
    React.useEffect(() => {
        Promise.all([ magellan.getPaperById(params.id), magellan.getPaperMeta(params.id) ])
               .then(([ paper, meta ]) => setState({ paper, meta }));
    }, [params.id]);

    return (
        <Container>
            {!paper ? (
                <LoadingIndicator />
            ) : (
                <>
                    <Gap position="below" size="xl">
                        <PaperSummary paper={paper} disableLink />
                    </Gap>
                    <Tabs defaultActiveKey="meta">
                        {meta ? (
                            <Tabs.TabPane tab="Metadata" key="meta">
                                <Gap position="below" size="md">
                                    <Info>
                                        <strong>{meta.total_results} matching metadata {meta.total_results === 1 ? 'entry' : 'entries'}</strong>
                                    </Info>
                                </Gap>
                                {meta.items.map(meta => (
                                    <Gap position="below" size="xl" key={meta.id}>
                                        <Gap position="below" size="md">
                                            <strong>Metadata:</strong><br />
                                            <Link to={`/meta/${meta.id}`}>{meta.id}</Link>
                                        </Gap>
                                        <MetadataDetails meta={meta} hidePapers />
                                    </Gap>
                                ))}
                            </Tabs.TabPane>
                        ) : null}
                        <Tabs.TabPane tab="JSON" key="json">
                            <Gap position="below" size="md">
                                <TextRight>
                                    <a href={`/api/paper/${paper.paper_id}`} download={`${paper.paper_id}.json`}>
                                        <Icon type="download" />{" "}
                                        Download JSON
                                    </a>
                                </TextRight>
                            </Gap>
                            <Code><pre>{JSON.stringify(paper, null, 2)}</pre></Code>
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

const Info = styled.div`
    ${({ theme }) => `
        background: ${theme.palette.background.info};
        border: 1px solid ${theme.palette.border.info};
        color: ${theme.palette.text.info};
        padding: ${theme.spacing.sm};
        font-size: ${theme.typography.bodySmall.fontSize};
        border-radius: 4px;
    `}
`;

export default PaperDetail;
