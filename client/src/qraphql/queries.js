import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

export const COMPANY_QUERY = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }
`;

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export const JOBS_QUERY = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
      description
    }
  }
`;

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJobMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

// export async function createJob(input) {
//   const mutation = gql`
//     mutation CreateJobMutation($input: CreateJobInput!) {
//       job: createJob(input: $input) {
//         ...JobDetail
//       }
//       ${JOB_DETAIL_FRAGMENT}
//     }
//   `;
//   const variables = { input };
//   const context = {
//     headers: { Authorization: 'Bearer ' + getAccessToken() },
//   };
//   const {
//     data: { job },
//   } = await client.mutate({
//     mutation,
//     variables,
//     context,
//     update: (cache, { data: { job } }) => {
//       cache.writeQuery({
//         query: JOB_QUERY,
//         variables: { id: job.id },
//         data: { job },
//       });
//     },
//   });
//   return job;
// }

// export async function getCompany(id) {
//   const query = gql`
//     query CompanyQuery($id: ID!) {
//       company(id: $id) {
//         id
//         name
//         description
//         jobs {
//           id
//           title
//         }
//       }
//     }
//   `;
//   const variables = { id };
//   const {
//     data: { company },
//   } = await client.query({ query, variables });
//   return company;
// }

// export async function getJob(id) {
//   const variables = { id };
//   const {
//     data: { job },
//   } = await client.query({
//     query: JOB_QUERY,
//     variables,
//   });
//   return job;
// }

// export async function getJobs() {
//   const query = gql`
//     query JobsQuery {
//       jobs {
//         id
//         title
//         company {
//           id
//           name
//         }
//         description
//       }
//     }
//   `;
//   const {
//     data: { jobs },
//   } = await client.query({ query, fetchPolicy: 'network-only' });
//   return jobs;
// }
