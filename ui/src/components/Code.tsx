import styled from 'styled-components';

export const Code = styled.code`
    ${({ theme }) => `
        display: block;
        border-radius: 4px;
        background: ${theme.color.A10};
        border: 1px solid ${theme.color.B10};
        color: ${theme.color.T4};
        padding: ${theme.spacing.md};
        white-space: wrap;
        pre {
            margin: 0;
        }
    `}
`;
