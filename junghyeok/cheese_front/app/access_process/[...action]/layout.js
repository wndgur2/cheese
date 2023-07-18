import Container from '@/components/Container';

export default function HomeLayout({ children }) {

  return (
      <Container paddingTop="50px">
          {children}
      </Container>
  )
}