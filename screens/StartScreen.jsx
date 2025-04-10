import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function StartScreen({ navigation }) {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }

      try {
        const response = await axios.get("http://10.0.2.2:5000/start", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const userId = response.data.decoded_user_id;

          const homeRes = await axios.get(`http://10.0.2.2:5000/home/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const userData = JSON.stringify(homeRes.data);
        
         await AsyncStorage.setItem('UserData', userData);

        if (homeRes.data.user_type == 1 || homeRes.data.user_type == 2){
            navigation.replace('Home'); // 홈으로 이동
        } //일단 관리자는 로그인 상태 처리x

        } 
      } catch (error) {
        console.error("토큰 확인 실패", error);
        navigation.replace('LoginScreen');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0091DA" />
    </View>
  );
}
