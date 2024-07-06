import { Button, Group } from "@mantine/core";
import {useQuery} from "@tanstack/react-query";

export default function IndexPage() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  return (

    <Group mt={50} justify="center">
      <Button size="xl">Welcome to Mantine!</Button>
    </Group>
  );
}
