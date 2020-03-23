import React from 'react';
import styled from 'styled-components';
import { Spin, Icon } from 'antd';

export const LoadingIndicator = () => (
    <Wrapper>
        <Spin indicator={<Icon type="loading" />} />
    </Wrapper>
);

const Wrapper = styled.div`
    ${({ theme }) => `
        padding: 0 ${theme.spacing.md};
    `}
`;
