import * as React from 'react';
import styled from 'styled-components';
import { useHistory, RouteComponentProps } from 'react-router';
import { Input } from '@allenai/varnish/components';
import { List, Spin, Icon } from 'antd';

import * as magellan from '../magellan';
import { Container, PaperSummary } from '../components';

const Search = (props: RouteComponentProps) => {
    const history = useHistory();
    const query = magellan.Query.fromLocation(props.location);

    const [results, setResults] = React.useState<
        magellan.SearchResults<magellan.Paper> | undefined
    >();
    React.useEffect(() => {
        setResults(undefined);
        magellan.searchForPapers(query).then(resp => {
            if (resp.query.equals(query)) {
                setResults(resp);
            }
        });
    }, [query.toQueryString()]); // eslint-disable-line react-hooks/exhaustive-deps

    const nf = new Intl.NumberFormat('en-US', { minimumSignificantDigits: 2 });
    return (
        <Container>
            <Input.Search
                name="q"
                placeholder="Search for papers"
                defaultValue={query.q}
                onSearch={q => {
                    const newQuery = new magellan.Query(q);
                    history.push(`${props.location.pathname}?${newQuery.toQueryString()}`);
                }}
            />
            <Results>
                {results ? (
                    <>
                        <Meta>
                            Found {nf.format(results.total_results)} results in{' '}
                            {nf.format(results.took_ms / 1000)}s
                        </Meta>
                        <List
                            size="large"
                            itemLayout="vertical"
                            dataSource={results.items}
                            renderItem={paper => (
                                <Item>
                                    <PaperSummary paper={paper} />
                                </Item>
                            )}
                        />
                    </>
                ) : (
                    <Spin indicator={<Icon type="loading" />} />
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

            &:first-child {
                border-top: 1px solid ${theme.palette.border.main};
            }
        }
    `}
`;

const Meta = styled.div`
    ${({ theme }) => `
        margin: 0 0 ${theme.spacing.xs};
        padding: 0 ${theme.spacing.md};
        color: ${theme.palette.text.secondary}
        font-weight: bold;
    `}
`;

export default Search;
