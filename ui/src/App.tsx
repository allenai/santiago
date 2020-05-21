import * as React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { Header, HeaderColumns, Layout, Content, BodyJumbo, BodyBig, HeaderTitle } from '@allenai/varnish/components';

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
                                You can <a href="https://www.semanticscholar.org/search?q=COVID+19">search</a>
                                {" "}for COVID related papers, authors and more there.
                            </p>
                        </BodyJumbo>
                        <BodyBig>
                            If you'd like to explore the dataset, visit the
                            {" "}<a href="https://open.quiltdata.com/b/ai2-semanticscholar-cord-19" rel="noopener">
                                dataset on Quilt</a>.
                        </BodyBig>
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

export default App;
