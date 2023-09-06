/* eslint-disable */
/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */
import type * as Types from './types'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

const defaultOptions = {} as const

export const AllOrganizationDocument = gql`
  query allOrganization {
    allOrganization {
      _id
      slug {
        current
      }
      title
      name
    }
  }
`

/**
 * __useAllOrganizationQuery__
 *
 * To run a query within a React component, call `useAllOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllOrganizationQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllOrganizationQuery(
  baseOptions?: Apollo.QueryHookOptions<Types.AllOrganizationQuery, Types.AllOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<Types.AllOrganizationQuery, Types.AllOrganizationQueryVariables>(
    AllOrganizationDocument,
    options
  )
}

export function useAllOrganizationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Types.AllOrganizationQuery, Types.AllOrganizationQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<Types.AllOrganizationQuery, Types.AllOrganizationQueryVariables>(
    AllOrganizationDocument,
    options
  )
}

export type AllOrganizationQueryHookResult = ReturnType<typeof useAllOrganizationQuery>
export type AllOrganizationLazyQueryHookResult = ReturnType<typeof useAllOrganizationLazyQuery>
export type AllOrganizationQueryResult = Apollo.QueryResult<
  Types.AllOrganizationQuery,
  Types.AllOrganizationQueryVariables
>
