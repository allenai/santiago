import * as React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { Header, Input, HeaderColumns, Layout, Content, BodyJumbo, BodyBig, HeaderTitle } from '@allenai/varnish/components';

import { trackPageView } from './ga';
import { CORD19Logo, Footer } from './components';

const App = () => {
    return (
        <>
            <GoogleAnalytics />
            <Layout bgcolor="white">
                <Header>
                    <HeaderColumns gridTemplateColumns="min-content auto min-content">
                        <SimpleLogo>
                            <CORD19Logo />
                        </SimpleLogo>
                        <HeaderTitleWithPadding>
                            CORD-19 Explorer
                        </HeaderTitleWithPadding>
                    </HeaderColumns>
                </Header>
                <Content>
                    <Copy>
                        <BodyJumbo>
                            <p>
                                The <a href="https://www.semanticscholar.org/cord19">CORD-19</a> dataset
                                has been fully incorporated into
                                {" "}<a href="https://www.semanticscholar.org">Semantic Scholar</a>.
                                Enter a query to search for papers, authors and more:
                            </p>
                        </BodyJumbo>
                        <form method="get" action="https://www.semanticscholar.org/search">
                            <Input.Search
                                name="q"
                                placeholder="Search Semantic Scholar…" />
                        </form>
                        <SpaceAbove>
                            <BodyBig>
                                If you'd like to explore the dataset, you can use
                                {" "}<a href="https://open.quiltdata.com/b/ai2-semanticscholar-cord-19" rel="noopener">
                                Quilt</a>.
                            </BodyBig>
                        </SpaceAbove>
                    </Copy>
                </Content>
                <Footer />
            </Layout>
        </>
    );
};

const GoogleAnalytics = () => {
    const history = useHistory();
    React.useEffect(
        () =>
            history.listen(loc => {
                const url = document.location.origin + loc.pathname + loc.search || '';
                trackPageView(document.title, url);
            }),
        [history]
    );
    return null;
};

const SimpleLogo = styled.div`
    border-radius: 4px;
    width: 50px;
    height: 50px;
    line-height: 1;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: linear-gradient(90deg, #1857b6 0%, #0f3875 94.27%);
    margin: ${({ theme }) => `${theme.spacing.md} 0`};
    overflow: hidden;

    svg {
        display: block;
    }
`;

const HeaderTitleWithPadding = styled(HeaderTitle)`
    padding: ${({ theme }) => theme.spacing.md} 0;
`;

// Restrict the copy width so it's not hard to read, but do so such that it breaks after
// "Semantic Scholar".
const Copy = styled.div`
    max-width: 82ch;
`;

const SpaceAbove = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export default App;
