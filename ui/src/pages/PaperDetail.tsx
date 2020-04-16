import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Tabs } from '@allenai/varnish/components';
import { Icon } from 'antd';
import ReactJson from 'react-json-view';

import {
    Container,
    Error,
    Gap,
    PaperSummary,
    LinkButton,
    LoadingIndicator,
    MetadataDetails
} from '../components';
import * as magellan from '../magellan';
import { config } from '../config';

interface PaperIdRouteParams {
    id: string;
}

interface State {
    paper?: magellan.Paper;
    meta?: magellan.PaperMetaSearchResults;
}

const PaperDetail = (props: RouteComponentProps) => {
    const params = props.match.params as PaperIdRouteParams;
    const [{ paper, meta }, setState] = React.useState<State>({
        paper: undefined,
        meta: undefined
    });
    const [hasError, setHasError] = React.useState(false);
    React.useEffect(() => {
        setHasError(false);
        Promise.all([magellan.getPaperById(params.id), magellan.getPaperMeta(params.id)])
            .then(([paper, meta]) => setState({ paper, meta }))
            .catch(err => {
                console.error('Error fetching paper by id:', err);
                setHasError(true);
            });
    }, [params.id]);
    const isLoading = !paper;
    return (
        <Container>
            {hasError ? <Error /> : null}
            {isLoading && !hasError ? <LoadingIndicator /> : null}
            {paper ? (
                <>
                    <Gap position="below" size="xl">
                        <PaperSummary paper={paper} disableLink />
                    </Gap>
                    <Tabs defaultActiveKey="meta">
                        {meta ? (
                            <Tabs.TabPane tab="Metadata" key="meta">
                                {meta.items.map(meta => (
                                    <Gap position="below" size="xl" key={meta.id}>
                                        {!config.ENABLE_S2_LINKS && meta.doi ? (
                                            <Gap position="below" size="md">
                                                <LinkButton
                                                    href={`/api/r/${meta.doi}`}>
                                                    View Paper
                                                </LinkButton>
                                            </Gap>
                                        ) : null}
                                        <Gap position="below" size="md">
                                            <strong>Metadata:</strong>
                                            <br />
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
                                    <a href={`/api/paper/${paper.paper_id}?download`}>
                                        <Icon type="download" /> Download JSON
                                    </a>
                                </TextRight>
                            </Gap>
                            <ReactJson name={false} src={paper} />
                        </Tabs.TabPane>
                    </Tabs>
                </>
            ) : null}
        </Container>
    );
};

const TextRight = styled.div`
    text-align: right;
`;

export default PaperDetail;
