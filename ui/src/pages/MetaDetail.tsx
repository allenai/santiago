import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Spin, Icon } from 'antd';

import { Code, Container, Gap, MetadataSummary } from '../components';
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
                <Spin indicator={<Icon type="loading" />} />
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
