local config = import '../skiff.json';

function(
    apiImage, proxyImage, cause, sha, env='staging', branch='', repo='',
    buildId=''
)
    local topLevelDomain = '.apps.allenai.org';
    local hosts =
        if env == 'prod' then
            [ 'cord-19.apps.allenai.org', config.appName + topLevelDomain ]
        else
            [ config.appName + '.' + env + topLevelDomain ];

    local replicas = (
        if env == 'prod' then
            2
        else
            1
    );

    local namespaceName = config.appName;
    local fullyQualifiedName = config.appName + '-' + env;

    local namespaceLabels = {
        app: config.appName,
        contact: config.contact,
        team: config.team
    };

    local labels = namespaceLabels + {
        env: env
    };

    local antiAffinityLabels = {
        onlyOneOfPerNode: config.appName + '-' + env
    };
    local podLabels = labels + antiAffinityLabels;

    local annotations = {
        "apps.allenai.org/sha": sha,
        "apps.allenai.org/branch": branch,
        "apps.allenai.org/repo": repo,
        "apps.allenai.org/build": buildId
    };

    local proxyPort = 80;
    local apiPort = 8000;

    local proxyHealthCheck = {
        port: proxyPort,
        scheme: 'HTTP'
    };

    local apiHealthCheck = {
        port: apiPort,
        scheme: 'HTTP'
    };

    local namespace = {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
            name: namespaceName,
            labels: namespaceLabels
        }
    };

    local ingress = {
        apiVersion: 'extensions/v1beta1',
        kind: 'Ingress',
        metadata: {
            name: fullyQualifiedName,
            namespace: namespaceName,
            labels: labels,
            annotations: annotations + {
                'certmanager.k8s.io/cluster-issuer': 'letsencrypt-prod',
                'kubernetes.io/ingress.class': 'nginx',
                'nginx.ingress.kubernetes.io/ssl-redirect': 'true'
            }
        },
        spec: {
            tls: [
                {
                    secretName: fullyQualifiedName + '-tls',
                    hosts: hosts
                }
            ],
            rules: [
                {
                    host: host,
                    http: {
                        paths: [
                            {
                                backend: {
                                    serviceName: fullyQualifiedName,
                                    servicePort: proxyPort
                                }
                            }
                        ]
                    }
                } for host in hosts
            ]
        }
    };

    local deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            labels: labels,
            name: fullyQualifiedName,
            namespace: namespaceName,
            annotations: annotations + {
                'kubernetes.io/change-cause': cause
            }
        },
        spec: {
            revisionHistoryLimit: 3,
            replicas: replicas,
            selector: {
                matchLabels: labels
            },
            template: {
                metadata: {
                    name: fullyQualifiedName,
                    namespace: namespaceName,
                    labels: podLabels,
                    annotations: annotations
                },
                spec: {
                    affinity: {
                        podAntiAffinity: {
                            requiredDuringSchedulingIgnoredDuringExecution: [
                                {
                                   labelSelector: {
                                        matchExpressions: [
                                            {
                                                    key: labelName,
                                                    operator: "In",
                                                    values: [ antiAffinityLabels[labelName], ],
                                            } for labelName in std.objectFields(antiAffinityLabels)
                                       ],
                                    },
                                    topologyKey: "kubernetes.io/hostname"
                                },
                            ]
                        },
                    },
                    volumes: [
                        {
                            name: fullyQualifiedName + '-es-creds',
                            secret: {
                                secretName: fullyQualifiedName + '-es-creds'
                            }
                        },
                        {
                            name: fullyQualifiedName + '-es-config',
                            configMap: {
                                name: fullyQualifiedName + '-es-config'
                            }
                        }
                    ],
                    containers: [
                        {
                            name: fullyQualifiedName + '-api',
                            image: apiImage,
                            args: [ 'app/start.py', '--prod' ],
                            readinessProbe: {
                                httpGet: apiHealthCheck + {
                                    path: '/?check=readiness_probe'
                                },
                                periodSeconds: 10,
                                failureThreshold: 3
                            },
                            livenessProbe: {
                                httpGet: apiHealthCheck + {
                                    path: '/?check=liveness_probe'
                                },
                                periodSeconds: 10,
                                failureThreshold: 9,
                                initialDelaySeconds: 30
                            },
                            resources: {
                                requests: {
                                    cpu: '0.3',
                                    memory: '500Mi'
                                },
                                limits: {
                                    memory: '1Gi'
                                }
                            },
                            volumeMounts: [
                                {
                                    name: fullyQualifiedName + '-es-creds',
                                    mountPath: '/secrets',
                                    readOnly: true
                                },
                                {
                                    name: fullyQualifiedName + '-es-config',
                                    mountPath: '/config',
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            name: fullyQualifiedName + '-proxy',
                            image: proxyImage,
                            readinessProbe: {
                                httpGet: proxyHealthCheck + {
                                    path: '/?check=rdy'
                                }
                            },
                            livenessProbe: {
                                failureThreshold: 6,
                                httpGet: proxyHealthCheck + {
                                    path: '/?check=live'
                                }
                            },
                            resources: {
                                requests: {
                                   cpu: '0.2',
                                   memory: '500Mi'
                                }
                            }
                        }
                    ]
                }
            }
        }
    };

    local service = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            name: fullyQualifiedName,
            namespace: namespaceName,
            labels: labels,
            annotations: annotations
        },
        spec: {
            selector: labels,
            ports: [
                {
                    port: proxyPort,
                    name: 'http'
                }
            ]
        }
    };

    [
        namespace,
        ingress,
        deployment,
        service
    ]
