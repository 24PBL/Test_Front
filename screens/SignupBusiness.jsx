import React, { useState, useEffect } from 'react';
import { Alert, Text, View, TextInput, Button, Modal, ScrollView, TouchableOpacity, Image} from 'react-native';
import styled from 'styled-components';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


export default function SignupCommon({ navigation, route }) {
  const [inputValue, setInputValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0); // 타이머 (초 단위)
  const [isRequestDisabled, setIsRequestDisabled] = useState(false);
  const [CheckPW, setCheckPw] = useState("");
  const [PW, setPw] = useState("");
  const [PwError, setPwError] = useState("");
  const [HardPwError, setHardPwError] = useState("");
  const [Birth, setBirth] = useState("");
  const [BirthError, setBirthError] = useState("");
  const [PNumError, setPNumError] = useState("");
    const [PNum, setPNum] = useState("");

  const [NickName, setNickName] = useState("");
  const [Name, setName] = useState("");

   const [image, setImage] = useState(null); // 하나만 저장

  const {userType} = route.params; //이전 창에서 받은 유저유형

  const changeNickName = (text) => {
    setNickName(text)
  }

  const changeName = (text) => {
    setName(text)
  }

  const pickImage = async () => { //이미지 선택 함수
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };
  
  const removeImage = () => {
    setImage(null);
  };

  
  //이메일 유효성 검사
  const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isValidBirthdate(birthdate) {
    if (!/^\d{8}$/.test(birthdate)) {
        return false;
    }

    let year = parseInt(birthdate.substring(0, 4), 10);
    let month = parseInt(birthdate.substring(4, 6), 10);
    let day = parseInt(birthdate.substring(6, 8), 10);

    let date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
}

const BirthCheck = (text) => {
  // 숫자만 입력받도록 처리
  let cleanedText = text.replace(/[^0-9]/g, '');

  // 8자리까지만 허용
  if (cleanedText.length > 8) {
      cleanedText = cleanedText.slice(0, 8);
  }

  // YYYY-MM-DD 형식으로 변환
  let formattedText = cleanedText;
  if (cleanedText.length > 4) {
      formattedText = cleanedText.slice(0, 4) + '-' + cleanedText.slice(4);
  }
  if (cleanedText.length > 6) {
      formattedText = cleanedText.slice(0, 4) + '-' + cleanedText.slice(4, 6) + '-' + cleanedText.slice(6);
  }

  setBirth(formattedText);

  // 생년월일 유효성 검사
  if (!isValidBirthdate(cleanedText)) {
      setBirthError("올바르지 않은 형식입니다.");
  } else {
      setBirthError("");
  }
};

  // 비밀번호 유효성 검사
  const handlePWChange = (text) => {
    setPw(text);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(text)) {
      setHardPwError('비밀번호는 8자 이상 숫자, 특수문자를 포함해야 합니다.');
    } else {
      setHardPwError('');
    }
  };

  //비밀번호 이상 여부
  const getPasswordInputStyle = () => {
    if (PW == CheckPW) {
      return {color : "blue"}
  }
    return {};
};
  //비밀번호 확인
  useEffect(() => {
    if (PW && CheckPW) {
      if (PW === CheckPW) {
        setPwError("비밀번호가 확인되었습니다.");
      } else {
        setPwError("비밀번호가 일치하지 않습니다.");
      }
    } else {
      setPwError("");
    }
  }, [PW, CheckPW]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  
  // 이메일 인증 타이머머
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown); 
    } else if (timer === 0) {
      setIsRequestDisabled(false); // 타이머가 끝나면 버튼 활성화
    }
  }, [timer]);

  const handleInputChange = (text) => {
    setInputValue(text);
    setEmailError('');
  };

  const handleSubmit = async () => {
    if (!Regex.test(inputValue)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await axios.post('http://10.0.2.2:5000/auth/join/commercial/check-email', { email: inputValue });
      Alert.alert('인증 코드 전송', '인증 코드가 이메일로 전송되었습니다.');
      setTimer(180); // 3분(180초) 설정
      setIsRequestDisabled(true); // 요청 버튼 비활성화
    } catch (error) {
      console.error('인증 코드 요청 실패:', error);
      Alert.alert('오류', '인증 코드 전송에 실패했습니다.');
    }
  };

  const nextSign= () => {
    navigation.navigate('BusinessSignupScreen', { 
      email: inputValue,
      authCode : verificationCode,
      password : PW,
      nickname : NickName,
      name : Name,
      birth : Birth,
      phone : PNum,
      img : image })
  }

  const verifyCode = async () => {
    try {
      await axios.post('http://10.0.2.2:5000/auth/join/commercial/check-auth-code', {
        email: inputValue,
        authCode: verificationCode,
      });
        Alert.alert('인증 성공', '이메일 인증이 완료되었습니다.');
        setIsCodeVerified(true);
    } catch (error) {
      console.error('인증 코드 확인 실패:', error);
      Alert.alert('오류', '유효하지 않은 인증 코드입니다.');
      setIsCodeVerified(false);
    }
  };

  function isValidMobileNumber(phone) {
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(phone);
}

 const CheckPhone = (text) => {
    if (isValidMobileNumber(text) == false){
        setPNumError("올바르지 않은 형식입니다.")
    } else {
        setPNumError("")
        setPNum(text)
    }
 }
  return (
    <SafeAreaProvider>
    <SafeAreaView style={{backgroundColor:'white', flex:1}}>
    <ScrollView showsVerticalScrollIndicator={false}>
    <Container>
      <Text style={{fontSize : 30, fontWeight : 'bold', textAlign : 'center', marginRight:170, width:250}}>사업자 회원가입</Text>
      <Text></Text>
      <Label>이메일</Label>
      <TextAndTouch><SignInputBox placeholder="이메일" placeholderTextColor = "rgba(0,0,0,0.4)" value={inputValue} onChangeText={handleInputChange}></SignInputBox>
        <TouchbleBox onPress={handleSubmit} disabled={isRequestDisabled}>
          <Text style={{color:'#0091DA', fontSize:17}}>요청</Text>
        </TouchbleBox>
      </TextAndTouch>
      <ErrorText>{emailError}</ErrorText>
      <Label>인증번호</Label>
      <TextAndTouch>
                    <SignInputBox
                        placeholder="인증번호"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        value={verificationCode}
                        onChangeText={setVerificationCode}  // 입력된 값을 상태에 저장
                    />

                    <TouchbleBox onPress={verifyCode}>
                        <Text style={{ color: '#0091DA', fontSize: 17 }}>확인</Text>
                    </TouchbleBox>
      </TextAndTouch>
      {timer > 0 && <TimerText style={{}}>인증시간 : {formatTime(timer)}</TimerText>}


    {/*이메일 인증 후 추가*/}
      {isCodeVerified && (
  <>  
      <Separator/>
      <Label>비밀번호</Label>
      <SignInput placeholder='비밀번호' placeholderTextColor = "rgba(0,0,0,0.4)" onChangeText={handlePWChange}
        secureTextEntry={true}></SignInput>
      <Text style={{ color: "red" , marginLeft:50, marginTop:5}}>{HardPwError}</Text>
      <Label>비밀번호 확인</Label>
      <SignInput placeholder='비밀번호 확인' placeholderTextColor = "rgba(0,0,0,0.4)" onChangeText={setCheckPw}
        secureTextEntry={true}></SignInput>
      <Text style={[{color : "red", marginLeft:50, marginTop:5}, getPasswordInputStyle()]}>{PwError}</Text>
      <Label>닉네임</Label>
      <SignInput placeholder='닉네임' placeholderTextColor = "rgba(0,0,0,0.4)" onChangeText={changeNickName}></SignInput>
      <Separator/>
      <Label>이름</Label>
      <SignInput placeholder='이름' placeholderTextColor = "rgba(0,0,0,0.4)" onChangeText={changeName}></SignInput>
      <Separator/>
      <Label>생년월일</Label>
      <SignInput placeholder='YYYYMMDD' placeholderTextColor = "rgba(0,0,0,0.4)" onChangeText={BirthCheck}></SignInput>
      <Text style={{ color: "red" , marginLeft:50, marginTop:5}}>{BirthError}</Text>
      <Label>전화번호</Label>
      <SignInput placeholder='010-XXXX-XXXX' placeholderTextColor = "rgba(0,0,0,0.4)" onChangeText={CheckPhone}></SignInput>
      <Text style={{ color: "red" , marginLeft:50, marginTop:5}}>{PNumError}</Text>
      <View>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="camera-outline" size={35} color="#aaa" />
        </TouchableOpacity>
      
        {image && (
          <View>
            <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
            <TouchableOpacity onPress={removeImage}>
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <SignBox
        onPress={nextSign}
        disabled={!isCodeVerified} // 인증 여부에 따라 비활성화
        style={{backgroundColor: isCodeVerified ? '#0091DA' : '#ccc'}}>
        <SignText>확인</SignText>
      </SignBox>
    </>)}
    </Container>
    </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color : white;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
  margin-left : 50px;
`;


const ErrorText = styled.Text`
  color: red;
  margin-left : 50px;
  margin-top : 5px;
`;

export const TextAndTouch = styled.View`
    border-width : 1px;
    border-color : black;
    border-radius : 10px;
    flex-direction : row;
    width : 270px;
    height : 55px;
    justify-content : center;
    align-items : center;
    margin-left : 50px;
`

export const TouchbleBox = styled.TouchableOpacity`
    width : 50px;
    height : 40px;
    border-radius : 10px;
    justify-content : center;
    align-items : center;
    border-color : #0091DA;
    border-width : 1px;
`

export const SignInputBox = styled.TextInput`
    border-radius : 10px;
    width : 205px;
    height : 45px;
    padding-left : 10px;
    font-size : 16px;
`
export const SignBox = styled.TouchableOpacity`
    width: 270px;
    height: 45px;
    border-radius: 10px;
    background-color: #0091DA;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-left : 50px;
`;

export const SignText = styled.Text`
    color: white;
    font-weight: bold;
`;

const TimerText = styled.Text`
  color: red;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`

export const Separator = styled.View`
    margin: 5px 0;
`;

export const SignInput = styled.TextInput`
    border-width : 1px;
    border-color : black;
    border-radius : 10px;
    flex-direction : row;
    width : 270px;
    height : 55px;
    justify-content : center;
    align-items : center;
    margin-left : 50px;
    font-size : 16px;
    padding-left : 14px;
`