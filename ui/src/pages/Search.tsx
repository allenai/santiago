import * as React from 'react';
import styled from 'styled-components';
import { useHistory, RouteComponentProps } from 'react-router';
import { Tabs as VTabs, Input, BodyBig } from '@allenai/varnish/components';
import { List } from 'antd';

import * as magellan from '../magellan';
import { Container, PaperSummary, MetadataSummary, LoadingIndicator } from '../components';

function hasQuery(query: magellan.Query): boolean {
    return query.q.trim() !== "";
}

const Search = (props: RouteComponentProps) => {
    const history = useHistory();
    const query = magellan.Query.fromLocation(props.location);
    const [paperSearchResults, setPaperSearchResults] = React.useState<
        magellan.SearchResults<magellan.Paper> | undefined
    >();
    const [metaSearchResults, setMetaSearchResults] = React.useState<
        magellan.SearchResults<magellan.MetadataEntry> | undefined
    >();
    React.useEffect(() => {
        setPaperSearchResults(undefined);
        setMetaSearchResults(undefined);
        if (hasQuery(query)) {
            Promise.all([magellan.searchForPapers(query), magellan.searchForMetadata(query)]).then(
                ([paperResp, metaResp]) => {
                    if (paperResp.query.equals(query)) {
                        setPaperSearchResults(paperResp);
                    }
                    if (metaResp.query.equals(query)) {
                        setMetaSearchResults(metaResp);
                    }
                }
            );
        }
    }, [query.toQueryString()]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasResults = paperSearchResults || metaSearchResults;
    const isLoading = hasQuery(query) && !hasResults;

    const nf = new Intl.NumberFormat();
    return (
        <Container>
            {!isLoading && !hasResults ? (
                <IntroText as="div">
                    <p>
                        The <strong>CORD-19 explorer</strong> is a full-text search engine for
                        the <a href="https://pages.semanticscholar.org/coronavirus-research">COVID-19 Open Research Dataset</a>.
                        Our hope is that it helps people explore the dataset and identify
                        potential research efforts.
                    </p>
                    <p>
                        If you have ideas for contributing to the explorer, dataset or research
                        efforts feel free to discuss them <a href="https://discourse.cord-19.semanticscholar.org/">here</a>.
                    </p>
                </IntroText>
            ) : null}
            <Input.Search
                name="q"
                placeholder="Enter a search query"
                defaultValue={query.q}
                onSearch={q => {
                    const newQuery = new magellan.Query(q);
                    history.push(`${props.location.pathname}?${newQuery.toQueryString()}`);
                }}
            />
            <Results>
                {isLoading ? <LoadingIndicator /> : null}
                {hasResults ? (
                    <Tabs>
                        {paperSearchResults ? (
                            <Tabs.TabPane
                                key="papers"
                                tab={`Papers (${nf.format(paperSearchResults.total_results)})`}>
                                <List
                                    size="large"
                                    itemLayout="vertical"
                                    dataSource={paperSearchResults.items}
                                    renderItem={paper => (
                                        <Item>
                                            <PaperSummary paper={paper} />
                                        </Item>
                                    )}
                                />
                            </Tabs.TabPane>
                        ) : null}
                        {metaSearchResults ? (
                            <Tabs.TabPane
                                key="meta"
                                tab={`Metadata (${nf.format(metaSearchResults.total_results)})`}>
                                <List
                                    size="large"
                                    itemLayout="vertical"
                                    dataSource={metaSearchResults.items}
                                    renderItem={meta => (
                                        <Item>
                                            <MetadataSummary meta={meta} />
                                        </Item>
                                    )}
                                />
                            </Tabs.TabPane>
                        ) : null}
                    </Tabs>
                ) : null}
            </Results>
        </Container>
    );
};

const Results = styled.div`
    ${({ theme }) => `
        padding: ${theme.spacing.md} 0 0;
    `}
`;

const Item = styled(List.Item)`
    ${({ theme }) => `
        && {
            padding: ${theme.spacing.lg} ${theme.spacing.md};
        }
    `}
`;

const Tabs = styled(VTabs)`
    .ant-tabs-bar {
        margin: 0;
    }
`;

const IntroText = styled(BodyBig)`
    ${({ theme }) => `
        padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.lg};
        max-width: 70ch;

        p:last-child {
            margin: 0;
        }
    `}
`;

export default Search;
