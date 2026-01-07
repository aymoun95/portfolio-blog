import { Container, Heading, Text } from "@react-email/components";

interface EmailTemplateProps {
  name: string;
  message: string;
}

export default function EmailTemplate({ name, message }: EmailTemplateProps) {
  return (
    <Container>
      <Heading>Hello, {name}!</Heading>
      <Text>{message}</Text>
    </Container>
  );
}
