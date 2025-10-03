import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "../context/AuthContext";
import login from "../pages/logIn";
import Home from "../pages/home";
import BulletinPage from "../pages/BulletinPage";
import AttendancePage from "../pages/AttendancePage";
import SchedulePage from "../pages/SchedulePage";
import AnnouncementsPage from "../pages/AnnouncementsPage";
import BillsPage from "../pages/BillsPage";
import StudentDetailsPage from "../pages/StudentDetailsPage";
import EnrollmentPage from "../pages/EnrollmentPage";
import SendAnnouncementsPage from "../pages/SendAnnouncementsPage";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <AuthProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Bulletin" 
          component={BulletinPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Attendance" 
          component={AttendancePage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Schedule" 
          component={SchedulePage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Announcements" 
          component={AnnouncementsPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Bills" 
          component={BillsPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="StudentDetails" 
          component={StudentDetailsPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Enrollment" 
          component={EnrollmentPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SendAnnouncements" 
          component={SendAnnouncementsPage} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </AuthProvider>
  );
}