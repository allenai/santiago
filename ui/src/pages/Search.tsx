import * as React from 'react';
import styled from 'styled-components';
import { useHistory, RouteComponentProps } from 'react-router';
import { Tabs as VTabs, Input } from '@allenai/varnish/components';
import { List, Spin, Icon } from 'antd';

import * as magellan from '../magellan';
import { Container, PaperSummary, MetadataSummary } from '../components';

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
    }, [query.toQueryString()]); // eslint-disable-line react-hooks/exhaustive-deps

    const nf = new Intl.NumberFormat();
    return (
        <Container>
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
                {!paperSearchResults || !metaSearchResults ? (
                    <Spin indicator={<Icon type="loading" />} />
                ) : (
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
                )}
            </Results>
        </Container>
    );
};

const Results = styled.div`
    ${({ theme }) => `
        padding: ${theme.spacing.lg} 0 0;
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

export default Search;
