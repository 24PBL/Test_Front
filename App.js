import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// 화면 컴포넌트들
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FindID from './screens/FindID';
import FindPW1 from './screens/FindPW1';
import FindPW2 from './screens/FindPW2';
import SignupCommon from './screens/SignupCommon';
import SignupBusiness from './screens/SignupBusiness';
import BusinessSignupScreen from './screens/BusinessSignupScreen';
import SuccessID from './screens/SuccessID';
import KindFindID from './screens/KindFindID';
import KindFindPW from './screens/KindFindPW';
import HomeScreen from './screens/Home';
import StartScreen from './screens/StartScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="StartScreen" component={StartScreen} option={{headershown : false}}/>
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FindID" component={FindID} options={{ headerShown:false}} />
      <Stack.Screen name="KindFindID" component={KindFindID} options={{ headerShown: false }} />
      <Stack.Screen name="KindFindPW" component={KindFindPW} options={{ headerShown: false }} />
      <Stack.Screen name="BusinessSignupScreen" component={BusinessSignupScreen} options={{headerShown:false}}/>
      <Stack.Screen name="FindPW2" component={FindPW2} options={{ headerShown:false}} />
        <Stack.Screen name="FindPW1" component={FindPW1} options={{ headerShown:false}} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown:false}} />
        <Stack.Screen name="SignupCommon" component={SignupCommon} options={{ headerShown:false}} />
        <Stack.Screen name="SignupBusiness" component={SignupBusiness} options={{ headerShown:false}} />        
        <Stack.Screen name="SuccessID" component={SuccessID} options={{ headerShown:false}} />


        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
