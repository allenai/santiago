import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Code, Container, Gap, PaperSummary, LoadingIndicator } from '../components';
import * as magellan from '../magellan';

interface PaperIdRouteParams {
    id: string;
}

const PaperDetail = (props: RouteComponentProps) => {
    const params = props.match.params as PaperIdRouteParams;
    const [paper, setPaper] = React.useState<magellan.Paper | undefined>();
    React.useEffect(() => {
        magellan.getPaperById(params.id).then(setPaper);
    }, [params.id]);

    return (
        <Container>
            {!paper ? (
                <LoadingIndicator />
            ) : (
                <>
                    <Gap position="below" size="xl">
                        <PaperSummary paper={paper} disableLink />
                    </Gap>
                    <Code>
                        <pre>{JSON.stringify(paper, null, 2)}</pre>
                    </Code>
                </>
            )}
        </Container>
    );
};

export default PaperDetail;
