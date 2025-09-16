import { createNativeStackNavigator } from "@react-navigation/native-stack";
import login from "../pages/logIn"
import Home from "../pages/home"

const Stack = createNativeStackNavigator();


export default function StackNavigator() {
  return(
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={login} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}