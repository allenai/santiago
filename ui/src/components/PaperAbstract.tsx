import styled from 'styled-components';

export const PaperAbstract = styled.div`
    ${({ theme }) => `
        max-width: 80ch;
        margin: ${theme.spacing.xs} 0 0;
    `}
`;
