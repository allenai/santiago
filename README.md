# Santiago: A UI for Exploring the CORD-19 Dataset

A UI for exploring the [CORD-19](https://pages.semanticscholar.org/coronavirus-research) dataset
via an Elasticsearch index populated via [Magellan](https://github.com/allenai/magellan).

The intent of this tool is to make the dataset easier to explore, as to help spark new research
efforts. We're also happy to extend the tool to include additional capabilities, please don't
hesitate to share your ideas or propose changes.

## Prerequisites

* [Docker](https://www.docker.com/)
* [Magellan](https://github.com/allenai/magellan)

## Getting Started

1. First run the following command to start things up:

   ```
   docker-compose up --build
   ```

   This will start 4 services. A python API, a UI that's written in TypeScript and built from
   the scaffolding of `create-react-app`, a reverse proxy (NGINX) and a local Elasticsearch
   cluster.

2. Then use [Magellan](https://github.com/allenai/magellan) to load the CORD-19 dataset into
   Elasticsearch. You'll want to download the dataset first, then run:

   ```
   conda activate magellan
   python -m magellan init
   python -m magellan load data
   ```

3. Open [http://localhost:8080](http://localhost:8080) and start making changes. You can issue
   queries while the index is populated, just don't be surprised if things feel a little sluggish.

## Contributions

We welcome and encourage contributions. Please don't hesitate to submit a pull request.

## Getting Help

Don't hesitate to ask questions or propose ideas in the [CORD-19 Discourse](https://discourse.cord-19.semanticscholar.org/).

You can also submit bugs or feature proposals [here](https://github.com/allenai/santiago/issues).
