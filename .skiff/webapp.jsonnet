/**
 * This is a template that's compiled down to a definition of the
 * infrastructural resources required for running your application.
 *
 * For more information on the JSONNET language, see:
 * https://jsonnet.org/learning/getting_started.html
 */

// This file is generated once at template creation time and unlikely to change
// from that point forward.
local config = import '../skiff.json';

function(
    apiImage, proxyImage, cause, sha, env='staging', branch='', repo='',
    buildId=''
)
    // We only allow registration of hostnames attached to '*.apps.allenai.org'
    // at this point. If you need a custom domain, contact us: reviz@allenai.org.
    local topLevelDomain = '.apps.allenai.org';
    local hosts = [
        if env == 'prod' then
            config.appName + topLevelDomain
        else
            config.appName + '.' + env + topLevelDomain
    ];

    // In production we run two versions of your application, as to ensure that
    // if one instance goes down or is busy, end users can still use the application.
    // In all other environments we run a single instance to save money.
    local replicas = (
        if env == 'prod' then
            2
        else
            1
    );

    // Each app gets it's own namespace.
    local namespaceName = config.appName;

    // Since we deploy resources for different environments in the same namespace,
    // we need to give things a fully qualified name that includes the environment
    // as to avoid unintentional collission / redefinition.
    local fullyQualifiedName = config.appName + '-' + env;

    // Every resource is tagged with the same set of labels. These labels serve the
    // following purposes:
    //  - They make it easier to query the resources, i.e.
    //      kubectl get pod -l app=my-app,env=staging
    //  - The service definition uses them to find the pods it directs traffic to.
    local namespaceLabels = {
        app: config.appName,
        contact: config.contact,
        team: config.team
    };

    local labels = namespaceLabels + {
        env: env
    };

    // By default multiple instances of your application could get scheduled
    // to the same node. This means if that node goes down your application
    // does too. We use the label below to avoid that.
    local antiAffinityLabels = {
        onlyOneOfPerNode: config.appName + '-' + env
    };
    local podLabels = labels + antiAffinityLabels;

    // Annotations carry additional information about your deployment that
    // we use for auditing, debugging and administrative purposes
    local annotations = {
        "apps.allenai.org/sha": sha,
        "apps.allenai.org/branch": branch,
        "apps.allenai.org/repo": repo,
        "apps.allenai.org/build": buildId
    };

    // The port the NGINX proxy is bound to.
    local proxyPort = 80;

    // The port the API (Python Flask application) is bound to.
    local apiPort = 8000;

    // This is used to verify that the proxy (and thereby the UI portion of the
    // application) is healthy. If this fails the application won't receive traffic,
    // and may be restarted.
    local proxyHealthCheck = {
        port: proxyPort,
        scheme: 'HTTP'
    };

    // This is used to verify that the API is funtional. We simply check for
    // whether the socket is open and available.
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
            template: {
                metadata: {
                    name: fullyQualifiedName,
                    namespace: namespaceName,
                    labels: podLabels,
                    annotations: annotations
                },
                spec: {
                    # This block tells the cluster that we'd like to make sure
                    # each instance of your application is on a different node. This
                    # way if a node goes down, your application doesn't:
                    # See: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-isolation-restriction
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
                    containers: [
                        {
                            name: fullyQualifiedName + '-api',
                            image: apiImage,
                            args: [ 'app/start.py', '--prod' ],
                            # The "probes" below allow Kubernetes to determine
                            # if your application is working properly.
                            #
                            # The readiness probe is used to determine if
                            # an instance of your application can accept live
                            # requests. The configuration below tells Kubernetes
                            # to stop sending live requests to your application
                            # if it returns 3 non 2XX responses over 30 seconds.
                            # When this happens the application instance will
                            # be taken out of rotation and given time to "catch-up".
                            # Once it returns a single 2XX, Kubernetes will put
                            # it back in rotation.
                            #
                            # The liveness probe is used to determine if an
                            # instance needs to be restarted. The configuration
                            # below tells Kubernetes to restart the application
                            # if it's unhealthy for 90 seconds. You can increase
                            # the `failureThreshold` if your API is slow.
                            #
                            # The route that's used by these probes should not
                            # depend on any external services, it should purely
                            # assess the health of your local application.
                            #
                            # Lastly, the `initialDelaySeconds` instructs
                            # Kubernetes to wait 30 seconds before starting the
                            # liveness probe. This is to give your application
                            # time to start. If your application needs more time
                            # you should increase this value and give things
                            # a little headroom, things are always a little slower
                            # in the cloud :).
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
                                    memory: '2Gi'
                                },
                                limits: {
                                    # If your software tries to use more than the amount of RAM specified below, it'll be killed
                                    # and auto restarted. This prevents programs from disrupting workloads on the some node.
                                    # You can increase this value if necessary.
                                    memory: '4Gi'
                                }
                            },
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
