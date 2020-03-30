import * as React from 'react';
import styled from 'styled-components';
import { useHistory, RouteComponentProps } from 'react-router';
import { Tabs as VTabs, Input, BodyBig } from '@allenai/varnish/components';
import { List, Icon, Popover } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';

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
                    <p>
                        The <strong>CORD-19 explorer</strong> is a full-text search engine for the{' '}
                        <a href="https://pages.semanticscholar.org/coronavirus-research">
                            COVID-19 Open Research Dataset
                        </a>
                        . Our hope is that it helps people explore the dataset and identify
                        potential research efforts.
                    </p>
                    <p>
                        If you have ideas for for how to improve the tool, or would like to
                        contribute to the research effort, don't hesitate to join the{' '}
                        <a href="https://discourse.cord-19.semanticscholar.org/">discussion</a>.
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
                    <p>
                        The query capabilities of the explorer are quite simple. If you're trying to
                        do a more comprehensive search, we'd suggest trying the tools below:
                    </p>
                    <SearchEngineList>
                        <li>
                            <a href="https://www.covidsearch.io/" rel="noopener">
                                Covidex
                            </a>
                            <br />A CORD-19 Search Engine using NLP and IR Components by the{' '}
                            <a href="https://uwaterloo.ca/">University of Waterloo</a> and{' '}
                            <a href="https://www.nyu.edu/">NYU</a>
                        </li>
                        <li>
                            <a href="http://cslab241.cs.aueb.gr:5000/" rel="noopener">
                                AUEB NLP Group Covid-19 Search Engine
                            </a>
                            <br />
                            An Experimental Document and Snippet Retrieval Search Engine for CORD-19
                            by the{' '}
                            <a href="http://nlp.cs.aueb.gr/" rel="noopener">
                                AUEB's NLP Group
                            </a>
                        </li>
                        <li>
                            <a href="https://covidsearch.sinequa.com/" rel="nopener">
                                Covid Search
                            </a>
                            <br />A CORD-19 Search engine from{' '}
                            <a href="https://www.sinequa.com/" rel="noopener">
                                Sinequa
                            </a>
                        </li>
                        <li>
                            <a href="https://cord19.vespa.ai/" rel="noopener">
                                CORD-19 Search
                            </a>
                            <br />A CORD-19 Search Engine powered by{' '}
                            <a href="https://vespa.ai/" rel="noopener">
                                Vespa
                            </a>
                        </li>
                        <li>
                            <a href="https://covid19search.azurewebsites.net/" rel="noopener">
                                Covid-19 Search
                            </a>
                            <br />A CORD-19 Search Engine powered by{' '}
                            <a
                                href="https://azure.microsoft.com/en-us/services/search/"
                                rel="noopener">
                                Azure Cognitive Search
                            </a>
                        </li>
                        <li>
                            <a href="https://www.sketchengine.eu/covid19/" rel="noopener">
                                Covid 19 Corpus
                            </a>
                            <br />
                            The CORD-19 dataset loaded into the{' '}
                            <a href="https://www.sketchengine.eu/" rel="noopener">
                                Sketch Engine
                            </a>
                        </li>
                        <li>
                            <a href="http://covidsearch.korea.ac.kr/" rel="noopener">
                                covidsearch
                            </a>
                            <br />
                            Real-time question answering on 31K COVID-19 related articles by the{' '}
                            <a href="https://dmis.korea.ac.kr/" rel="noopener">
                                DMIS Lab
                            </a>
                            {' '}of Korea University
                        </li>
                    </SearchEngineList>
                    If you have a tool that you'd like listed here,{' '}
                    <a href="https://discourse.cord-19.semanticscholar.org/" rel="noopener">
                        let us know.
                    </a>
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
        margin: 0;
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
