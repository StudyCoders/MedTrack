import { GluestackUIProvider, Text, Box, config, Button, ButtonText } from "@gluestack-ui/themed"
import { Link } from "expo-router";

export default function Principal() {
    return (
        <GluestackUIProvider config={config.theme}>
            <Box flex={1} justifyContent="center" alignItems="center">
                <Text color="$primary900">Olá, mundo! Este é um teste!</Text>
                <Link href="(tabs)" asChild>
                    <Button>
                        <ButtonText>Visualizar Tabs</ButtonText>
                    </Button>
                </Link>
            </Box>
        </GluestackUIProvider>
    )
}