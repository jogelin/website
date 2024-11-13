import { gql, GraphQLClient } from 'graphql-request';
import type { PostsData, PostData } from './schemas';


const getClient = () => new GraphQLClient('https://gql.hashnode.com');

export const getPosts = async (myHashnodeURL:string) => {
  const client = getClient();

  const allPosts = await client.request<PostsData>(
    gql`
      query allPosts {
        publication(host: "${myHashnodeURL}") {
          title
          posts(first: 20) {
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
              }
            }
          }
        }
      }
    `,
  );

  return allPosts;
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