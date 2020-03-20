/**
 * This is the top-level component that defines your UI application.
 *
 * This is an appropriate spot for application wide components and configuration,
 * stuff like application chrome (headers, footers, navigation, etc), routing
 * (what urls go where), etc.
 *
 * @see https://github.com/reactjs/react-router-tutorial/tree/master/lessons
 */

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
    InternalLink,
    HeaderTitle,
    TopMenu,
    TopMenuItem
} from '@allenai/varnish/components';

import Home from './pages/Home';
import About from './pages/About';
import { AppRoute } from './AppRoute';

/**
 * An array capturing the available routes in your application. You can
 * add or remove routes here.
 */
const ROUTES: AppRoute[] = [
    {
        path: '/',
        label: 'Home',
        component: Home
    },
    {
        path: '/about',
        label: 'About',
        component: About
    }
];

export default class App extends React.PureComponent<RouteComponentProps> {
    render() {
        return (
            <BrowserRouter>
                <Route path="/">
                    <Layout bgcolor="white">
                        <Header>
                            <HeaderColumns gridTemplateColumns="min-content auto min-content">
                                <SimpleLogo>
                                    <span role="img" aria-label="Skiff Logo">
                                        {['⛵️', '⚓️', '🐠', '🛶'][Math.floor(Math.random() * 4)]}
                                    </span>
                                </SimpleLogo>
                                <HeaderTitleWithPadding>Skiff</HeaderTitleWithPadding>
                                <TopMenu defaultSelectedKeys={[this.props.location.pathname]}>
                                    {ROUTES.map(({ path, label }) => (
                                        <TopMenuItem key={path}>
                                            <TabLink to={path}>{label}</TabLink>
                                        </TopMenuItem>
                                    ))}
                                </TopMenu>
                            </HeaderColumns>
                        </Header>
                        <Content>
                            {ROUTES.map(({ path, component }) => (
                                <Route key={path} path={path} exact component={component} />
                            ))}
                        </Content>
                        <Footer />
                    </Layout>
                </Route>
            </BrowserRouter>
        );
    }
}

// TODO: This should likely be applied to back to Varnish. The default
// font size for the menu seems a tad small.
const TabLink = styled(InternalLink)`
    font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

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
    background: ${({ theme }) => theme.color.B2};
    margin: ${({ theme }) => `${theme.spacing.md} 0`};
`;

const HeaderTitleWithPadding = styled(HeaderTitle)`
    padding: ${({ theme }) => theme.spacing.md} 0;
`;
