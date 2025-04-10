import { Text, Alert, View} from 'react-native';
import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';






export default function LoginScreen({ navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState("1");

    // 회원가입 화면으로 이동하는 함수
    const goToSignupScreens = () => {
        navigation.navigate("Signup");
    };

    const goTofindID = () => {
        navigation.navigate("KindFindID");
    };
    const goTofindPW = () => {
        navigation.navigate("KindFindPW");
    };



    // 로그인 요청을 처리하는 함수
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("입력 오류", "아이디와 비밀번호를 입력하십시오.");
            return;
        }
    
        try {
          
            const loginRes = await axios.post("http://10.0.2.2:5000/auth/login", {
                kind: userType,
                email,
                password,
            });
    
            const token = loginRes.data.token;
            await AsyncStorage.setItem('jwtToken', token);
    
           
            const startRes = await axios.get("http://10.0.2.2:5000/start", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
    
            const userId = startRes.data.decoded_user_id;
    
           
            const homeRes = await axios.get(`http://10.0.2.2:5000/home/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
    
            const userData = JSON.stringify(homeRes.data);
            
             await AsyncStorage.setItem('UserData', userData);
    
            if (homeRes.data.user_type == 1 || homeRes.data.user_type == 2){
            navigation.navigate('Home');
            }
    
        } catch (error) {
            console.error("로그인 실패:", error);
            Alert.alert("로그인 실패", "이메일이나 비밀번호가 올바르지 않습니다.");
        }
    };
    
    



    return (
        <Back>
            <Container>
                <LoginTitle>로그인</LoginTitle>
                <Separator/>
                <Separator/>
                <Separator/>
                <View style={{borderWidth:1, borderRadius:10, borderColor:'gray'}}>
                <Picker
                    selectedValue={userType}
                    onValueChange={(itemValue) => setUserType(itemValue)}
                    style={{ height: 60, width: 270}}
                    >
                <Picker.Item label="개인 회원" value="1" />
                <Picker.Item label="사업자 회원" value="2" />
                <Picker.Item label="관리자" value="3" />
                </Picker>
                </View>
                <Separator />
                <Label>이메일</Label>
                <InputBox 
                    placeholder="아이디(이메일)" 
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    value={email} 
                    onChangeText={setEmail} // 이메일 상태 업데이트
                />
                <Separator />
                <Label>비밀번호</Label>
                <InputBox 
                    placeholder="비밀번호" 
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    secureTextEntry // 비밀번호 숨기기
                    value={password} 
                    onChangeText={setPassword} // 비밀번호 상태 업데이트
                />
                <Separator />
                <LoginBox onPress={handleLogin}><LoginText>로그인</LoginText></LoginBox>
                <Separator/>
                <Find>
                <FindId onPress={goTofindID}>
                    <Text style={{ fontSize: 13, fontWeight:'bold', color:'#727272' }}>아이디 찾기</Text>
                </FindId>
                <FindPW onPress={goTofindPW}>
                    <Text style={{ fontSize: 13, fontWeight:'bold', color:'#727272' }}>비밀번호 찾기</Text>
                </FindPW>
                </Find>
                <SignBox onPress={goToSignupScreens}><Text style={{ fontWeight: 'bold', color: '#0091da', fontSize:17 }}>회원가입</Text></SignBox>
            </Container>
        </Back>
    );
}

export const LoginTitle = styled.Text`
    font-size: 30px;
    margin-bottom: 10px;
    font-weight: bold;
`;

export const Back = styled.View`
    flex: 1;
    background-color: white;
`;

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    width: 280px;
    align-items: left;
    padding: 10px;
    margin: 0 auto;
`;

export const InputBox = styled.TextInput`
    border-color: black;
    border-width: 1px;
    border-radius: 10px;
    width: 260px;
    height: 55px;
    padding-left: 10px;
    fontSize : 17px;
`;

export const Label = styled.Text`
    margin-bottom: 10px;
    margin-top: 10px;
    font-weight : bold;
    color : #727272;
`;

export const FindId = styled.TouchableOpacity`
    margin-top: 5px;
    align-self: flex-end;
`;

export const FindPW = styled.TouchableOpacity`
    margin-top: 5px;
    align-self: flex-end;
`;

export const Separator = styled.View`
    margin: 5px 0;
`;

export const LoginBox = styled.TouchableOpacity`
    width: 260px;
    height: 45px;
    border-radius: 10px;
    background-color: #0091DA;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`;

export const LoginText = styled.Text`
    color: white;
    font-weight: bold;
    font-size : 17px;
`;

export const SignBox = styled.TouchableOpacity`
    width: 260px;
    height: 45px;
    border-radius: 10px;
    background-color: #FFFFFF;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    border-width: 1px;
    border-color : #0091da;
`;

export const Find = styled.View`
  flex-direction : row;
  align-items : center;
  justify-content : space-between;
  padding-left : 50px;
  padding-right : 50px;
`