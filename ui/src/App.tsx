import * as React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import {
    Header,
    HeaderColumns,
    Layout,
    Content,
    Footer,
    HeaderTitle
} from '@allenai/varnish/components';

import Search from './pages/Search';
import PaperDetail from './pages/PaperDetail';
import MetaDetail from './pages/MetaDetail';
import { trackPageView } from './ga';
import { CORD19Logo } from './components';

const App = () => {
    return (
        <BrowserRouter>
            <Route path="/">
                <GoogleAnalytics />
                <Layout bgcolor="white">
                    <Header>
                        <HeaderColumns gridTemplateColumns="min-content auto min-content">
                            <TitleLink to="/">
                                <SimpleLogo>
                                    <CORD19Logo />
                                </SimpleLogo>
                            </TitleLink>
                            <HeaderTitleWithPadding>
                                <TitleLink to="/">CORD-19 Explorer</TitleLink>
                            </HeaderTitleWithPadding>
                        </HeaderColumns>
                    </Header>
                    <Content>
                        <Route path="/" component={Search} exact />
                        <Route path="/paper/:id" component={PaperDetail} exact />
                        <Route path="/meta/:id" component={MetaDetail} exact />
                    </Content>
                    <Footer />
                </Layout>
            </Route>
        </BrowserRouter>
    );
};

const GoogleAnalytics = () => {
    const history = useHistory();
    React.useEffect(
        () =>
            history.listen(loc => {
                let url = document.location.origin + loc.pathname;
                if (loc.search) {
                    url += '?' + loc.search;
                }
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
    background: linear-gradient(90deg, #1857B6 0%, #0F3875 94.27%);
    margin: ${({ theme }) => `${theme.spacing.md} 0`};
    overflow: hidden;

    svg {
        display: block;
    }
`;



const HeaderTitleWithPadding = styled(HeaderTitle)`
    padding: ${({ theme }) => theme.spacing.md} 0;
`;

const TitleLink = styled(Link)`
    ${({ theme }) => `
        && {
            &,
            &:hover {
                color: ${theme.palette.text.primary};
                text-decoration: none;
            }
        }
    `}
`;

export default App;
