import React from 'react';
import styled from 'styled-components';
import { Footer as VFooter, Body, ExternalLink, Content } from '@allenai/varnish/components';

export const Footer = () => (
    <VFooter>
        <Content>
            <TextLeft>
                <Body>
                    <ExternalLink href="https://allenai.org">
                        © The Allen Institute for Artificial Intelligence
                    </ExternalLink>{' '}
                    - All Rights Reserved |{' '}
                    <ExternalLink
                        href="https://allenai.org/privacy-policy.html">
                        Privacy Policy
                    </ExternalLink>{' '}
                    |{' '}
                    <ExternalLink
                        href="https://allenai.org/terms.html">
                        Terms of Use
                    </ExternalLink><br />
                    The <a href="https://pages.semanticscholar.org/coronavirus-research" rel="noopener">CORD-19</a>
                    {' '}dataset is subject to the
                    {' '}<a href="https://ai2-semanticscholar-cord-19.s3-us-west-2.amazonaws.com/2020-03-13/COVID.DATA.LIC.AGMT.pdf">
                        Dataset License
                    </a>
                </Body>
            </TextLeft>
        </Content>
    </VFooter>
);

const TextLeft = styled.div`
    text-align: left;
`;
