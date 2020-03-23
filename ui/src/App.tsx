import * as React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';
import {
    Header,
    HeaderColumns,
    Layout,
    Content,
    Footer,
    HeaderTitle
} from '@allenai/varnish/components';

import Search from './pages/Search';

export default class App extends React.PureComponent<RouteComponentProps> {
    render() {
        return (
            <BrowserRouter>
                <Route path="/">
                    <Layout bgcolor="white">
                        <Header>
                            <HeaderColumns gridTemplateColumns="min-content auto min-content">
                                <SimpleLogo>
                                    <span role="img" aria-label="CORD-19 Explorer">
                                        🦠
                                    </span>
                                </SimpleLogo>
                                <HeaderTitleWithPadding>
                                    Santiago: CORD-19 Explorer
                                </HeaderTitleWithPadding>
                            </HeaderColumns>
                        </Header>
                        <Content>
                            <Route path="/" component={Search} />
                        </Content>
                        <Footer />
                    </Layout>
                </Route>
            </BrowserRouter>
        );
    }
}

const SimpleLogo = styled.div`
    border-radius: 25px;
    width: 50px;
    height: 50px;
    line-height: 1;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: ${({ theme }) => theme.color.G2};
    margin: ${({ theme }) => `${theme.spacing.md} 0`};
`;

const HeaderTitleWithPadding = styled(HeaderTitle)`
    padding: ${({ theme }) => theme.spacing.md} 0;
`;
