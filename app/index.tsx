import { Redirect } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function Principal() {
    return (
        <AuthProvider>
           <Layout />
        </AuthProvider>
    );
}

export function Layout() {
    const { authState } = useAuth();
    console.log(authState?.authenticated, authState?.token)
    return authState?.authenticated ? (
        <Redirect href="profile" />
    ):(
        <Redirect href="login" />
    )
}