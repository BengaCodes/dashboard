import {
  useMutation,
  type MutationFunction,
  type UseMutationOptions
} from '@tanstack/react-query'

type MutationProps<TData = unknown, TVariables = void> = {
  mutationFn: MutationFunction<TData, TVariables>
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
}

const useMutationQuery = <TData = unknown, TVariables = void>({
  mutationFn,
  options
}: MutationProps<TData, TVariables>) => {
  const mutation = useMutation({
    mutationFn,
    ...options
  })

  return { mutation }
}

export default useMutationQuery
