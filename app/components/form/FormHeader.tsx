import { Image, Center, Heading } from "@gluestack-ui/themed";

interface FormHeaderProps {
  title: string;
  titleSize?: any;
}

export default function FormHeader({ title, titleSize = "3xl" }: FormHeaderProps) {
  return (
    <Center>
      <Image source={require("../../assets/images/logo-md.png")} size="xl" alt="QuickShare Logo" />
      <Heading size={titleSize}>{title}</Heading>
    </Center>
  );
}
