import * as React from 'react';
import styled from 'styled-components';
import { useHistory, RouteComponentProps } from 'react-router';
import { Tabs as VTabs, Input, BodyBig } from '@allenai/varnish/components';
import { List, Icon, Popover } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { moreFeaturedToolsLink, featuredTools } from '../featured';

import * as magellan from '../magellan';
import { Container, Error, PaperSummary, MetadataSummary, LoadingIndicator } from '../components';

function hasQuery(query: magellan.Query): boolean {
    return query.q.trim() !== '';
}

function mkPaginationConfig(
    response: magellan.SearchResults<any>,
    onChange: (q: magellan.Query) => void
): PaginationProps {
    const current = Math.floor(response.query.o / response.query.sz) + 1;
    return {
        total: response.total_results,
        pageSize: response.query.sz,
        current,
        showSizeChanger: true,
        onChange: (page: number, pageSize?: number) => {
            const size = pageSize || magellan.Query.defaults.PAGE_SIZE;
            const newOffset = (page - 1) * size;
            const newQuery = new magellan.Query(response.query.q, newOffset, size);
            onChange(newQuery);
        },
        onShowSizeChange: (page: number, pageSize: number) => {
            const newOffset = (page - 1) * pageSize;
            const newQuery = new magellan.Query(response.query.q, newOffset, pageSize);
            onChange(newQuery);
        }
    };
}

const Search = (props: RouteComponentProps) => {
    const history = useHistory();
    const routeToQuery = (q: magellan.Query) =>
        history.push(`${props.location.pathname}?${q.toQueryString()}`);

    const query = magellan.Query.fromLocation(props.location);
    const [paperSearchResults, setPaperSearchResults] = React.useState<
        magellan.SearchResults<magellan.Paper> | undefined
    >();
    const [metaSearchResults, setMetaSearchResults] = React.useState<
        magellan.SearchResults<magellan.MetadataEntry> | undefined
    >();
    const [hasError, setHasError] = React.useState(false);
    React.useEffect(() => {
        setPaperSearchResults(undefined);
        setMetaSearchResults(undefined);
        setHasError(false);
        if (hasQuery(query)) {
            Promise.all([magellan.searchForPapers(query), magellan.searchForMetadata(query)])
                .then(([paperResp, metaResp]) => {
                    if (paperResp.query.equals(query)) {
                        setPaperSearchResults(paperResp);
                    }
                    if (metaResp.query.equals(query)) {
                        setMetaSearchResults(metaResp);
                    }
                })
                .catch(err => {
                    console.error(`Error issuing search query:`, err);
                    setHasError(true);
                });
        }
    }, [query.toQueryString()]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasResults = paperSearchResults || metaSearchResults;
    const isLoading = hasQuery(query) && !hasResults && !hasError;

    const nf = new Intl.NumberFormat();

    const queryHelp = (
        <>
            You can use query operators like AND, NOT, and more.
            <br />
            For more information see{' '}
            <a
                href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html"
                rel="noopener">
                this documentation.
            </a>
        </>
    );

    const showHomePageContent = !isLoading && !hasResults;

    return (
        <Container>
            {showHomePageContent ? (
                <IntroText as="div">
                    <h2>Explore the Dataset</h2>
                    <p>
                        The <strong>CORD-19 Explorer</strong> is a full-text search engine for the{' '}
                        <a href="https://pages.semanticscholar.org/coronavirus-research">
                            COVID-19 Open Research Dataset
                        </a>
                        . Our hope is that it helps people explore the dataset and identify
                        potential research efforts.
                    </p>
                    <p>
                        <strong>Enter a search query to get started:</strong>
                    </p>
                </IntroText>
            ) : null}
            <SearchRow>
                <Input.Search
                    name="q"
                    placeholder="Enter a search query"
                    defaultValue={query.q}
                    onSearch={q => {
                        const newQuery = new magellan.Query(q);
                        routeToQuery(newQuery);
                    }}
                />
                <Popover content={queryHelp} title="Supported Queries">
                    <BodyBig>
                        <Icon type="question-circle" />
                    </BodyBig>
                </Popover>
            </SearchRow>
            <Results>
                {hasError ? <Error /> : null}
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
                                    pagination={mkPaginationConfig(
                                        paperSearchResults,
                                        routeToQuery
                                    )}
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
                                    pagination={mkPaginationConfig(metaSearchResults, routeToQuery)}
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
            {showHomePageContent ? (
                <IntroText as="div">
                    <h3>Featured Tools</h3>
                    <p>
                        The query capabilities of the Explorer are quite simple. If you're trying to
                        do a more comprehensive search, we'd suggest trying the tools below.
                    </p>
                    <p>
                        <strong>
                            There's also have a comprehensive, user-editable list of tools{' '}
                            <a href={moreFeaturedToolsLink} rel="noopener">
                                here.
                            </a>
                        </strong>
                    </p>
                    <SearchEngineList>
                        {featuredTools.map(({ url, title, description }) => (
                            <li key={url}>
                                <a href={url} rel="noopener">
                                    {title}
                                </a>
                                <br />
                                {description}
                            </li>
                        ))}
                    </SearchEngineList>
                    <p>
                        <strong>
                            See a list of additional tools, and add new ones ones{' '}
                            <a href={moreFeaturedToolsLink} rel="noopener">
                                here
                            </a>
                            .
                        </strong>
                    </p>
                </IntroText>
            ) : null}
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

const SearchRow = styled.div`
    display: grid;
    grid-template-columns: 1fr min-content;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const SearchEngineList = styled.ul`
    ${({ theme }) => `
        margin: 0 0 ${theme.spacing.lg};
        padding: 0 0 0 ${theme.spacing.xl};
        list-style-type: disc;

        li {
            margin: ${theme.spacing.md} 0;
        }

        li a:first-child {
            font-weight: bold;
        }

    `}
`;

export default Search;
