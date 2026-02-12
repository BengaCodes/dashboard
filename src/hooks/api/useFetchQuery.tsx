import { useQuery, type QueryOptions } from '@tanstack/react-query'

type QueryProps<T> = {
  key: string[]
  queryFn: () => Promise<T>
  options?: QueryOptions
}

const useFetchQuery = <T,>({ key, queryFn, options }: QueryProps<T>) => {
  const { data, error, isLoading } = useQuery({
    queryKey: key,
    queryFn: queryFn,
    ...options
  })

  return { data, error, isLoading }
}

export default useFetchQuery
