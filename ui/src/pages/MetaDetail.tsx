import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Code, Container, Gap, MetadataSummary, LoadingIndicator } from '../components';
import * as magellan from '../magellan';

interface MetadataEntryIdRouteParams {
    id: string;
}

const MetaDetail = (props: RouteComponentProps) => {
    const params = props.match.params as MetadataEntryIdRouteParams;
    const [meta, setMeta] = React.useState<magellan.MetadataEntry | undefined>();
    React.useEffect(() => {
        magellan.getMetaById(params.id).then(setMeta);
    }, [params.id]);

    return (
        <Container>
            {!meta ? (
                <LoadingIndicator />
            ) : (
                <>
                    <Gap position="below" size="xl">
                        <MetadataSummary meta={meta} disableLink />
                    </Gap>
                    <Code>
                        <pre>{JSON.stringify(meta, null, 2)}</pre>
                    </Code>
                </>
            )}
        </Container>
    );
};

export default MetaDetail;
