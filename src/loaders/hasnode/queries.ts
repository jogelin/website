import { gql, GraphQLClient } from 'graphql-request';
import type { PostsData, PostData } from './schemas';


const getClient = () => new GraphQLClient('https://gql.hashnode.com');

export const getPosts = async (myHashnodeURL:string) => {
  const client = getClient();
  let hasNextPage = true;
  let endCursor: string | null = null;
  const allEdges: any[] = [];

  while (hasNextPage) {
    const query = gql`
      query allPosts($after: String) {
        publication(host: "${myHashnodeURL}") {
          title
          posts(first: 20, after: $after) {
            pageInfo{
              hasNextPage
              endCursor
            }
            edges {
              node {
                author{
                  name
                  profilePicture
                }
                title
                subtitle
                brief
                slug
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
                publishedAt
                readTimeInMinutes
                content {
                  html
                }
              }
            }
          }
        }
      }
    `;

    const response: PostsData = await client.request<PostsData>(query, { after: endCursor });

    allEdges.push(...response.publication.posts.edges);
    hasNextPage = response.publication.posts.pageInfo.hasNextPage;
    endCursor = response.publication.posts.pageInfo.endCursor;
  }

  return {
    publication: {
      title: allEdges.length > 0 ? 'Hashnode' : '',
      posts: {
        pageInfo: {
          hasNextPage: false,
          endCursor: endCursor || '',
        },
        edges: allEdges,
      },
    },
  };
};

export const getPost = async (myHashnodeURL:string, slug: string) => {
  const client = getClient();

  const data = await client.request<PostData>(
    gql`
      query postDetails($slug: String!) {
        publication(host: "${myHashnodeURL}") {
          post(slug: $slug) {
            author{
              name
              profilePicture
            }
            publishedAt
            title
            subtitle
            readTimeInMinutes
            content{
              html
            }
            tags {
              name
              slug
            }
            coverImage {
              url
            }
          }
        }
      }
    `,
    { slug: slug },
  );

  return data.publication.post;
};