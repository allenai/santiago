import * as React from 'react';

import { ExternalLink, Body } from '@allenai/varnish/components';

export default class About extends React.PureComponent {
    render() {
        // TODO: Varnish should provide a component that makes writing multiline
        // text content easier. The necessity of the empty string prefix is
        // confusing and tedious.
        return (
            <React.Fragment>
                <h1>Ahoy!</h1>
                <Body>
                    <p>
                        This is a fresh application derived from the{' '}
                        <ExternalLink href="https://github.com/allenai/skiff-template">
                            Skiff Template
                        </ExternalLink>
                        . Skiff provides a{' '}
                        <ExternalLink href="https://www.python.org/">Python</ExternalLink> based API
                        and a UI constructed with{' '}
                        <ExternalLink href="https://www.typescriptlang.org/">
                            TypeScript
                        </ExternalLink>
                        , <ExternalLink href="https://reactjs.org/">ReactJS</ExternalLink>, and{' '}
                        <ExternalLink href="https://github.com/allenai/varnish">
                            Varnish
                        </ExternalLink>{' '}
                        (using <ExternalLink href="https://ant.design/">Ant Design</ExternalLink>).
                    </p>
                    <p>
                        It's deployed to a Google managed Kubernetes cluster and provides DNS, log
                        aggregation, TLS and other capabilties out of the box, thanks to the{' '}
                        <ExternalLink href="https://github.com/allenai/skiff">Skiff</ExternalLink>{' '}
                        project.
                    </p>
                    <p>
                        If you have any questions, concerns or feedback please don't hesitate to
                        reach out. You can open a{' '}
                        <ExternalLink href="https://github.com/allenai/skiff-template/issues/new">
                            Github Issue
                        </ExternalLink>{' '}
                        or contact us at{' '}
                        <ExternalLink href="mailto:reviz@allenai.org">
                            reviz@allenai.org
                        </ExternalLink>
                        .
                    </p>
                    <p>Smooth sailing!</p>
                </Body>
            </React.Fragment>
        );
    }
}
