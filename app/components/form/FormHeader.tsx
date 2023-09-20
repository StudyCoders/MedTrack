import { Box, Text, Image } from "@gluestack-ui/themed";

interface FormHeaderProps {
  title: string;
}

export default function FormHeader({ title }: FormHeaderProps) {
  return (
    <Box>
      <Box alignItems="center">
        <Image source={require("../../assets/images/logo-md.png")} />
      </Box>
      <Box>
        <Text textAlign="center" fontSize={"$3xl"} fontWeight="bold">
          {title}
        </Text>
      </Box>
    </Box>
  );
}
