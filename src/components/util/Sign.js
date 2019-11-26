import React from 'react';
import { observer } from 'mobx-react';
import {
  Modal, ModalHeader, ModalBody, FormText, Input,
} from 'reactstrap';
import * as Proptypes from 'prop-types';
import styled from 'styled-components';
import useStores from '../../stores/useStores';

const Form = styled.form`
  position: absolute;
  z-index: 1;
  background: #FFFFFF;
  max-width: 100%;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  transition: visibility 0s, opacity 0.5s, height 5s linear;
`;

const FormInput = styled.input`
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
`;

const FormSelect = styled(Input)`
  outline: 0 !important;
  background: #f2f2f2 !important;
  width: 100% !important;
  border: 0 !important;
  margin: 0 0 15px !important;
  height : auto !important;
  padding: 15px !important;
  box-sizing: border-box !important;
  font-size: 14px !important;
  
  &:focus {
    outline: 0 !important;
`;

const FormInputWithText = styled(FormInput)`
  margin : 0;
`;

const FormButton = styled.button`
  text-transform: uppercase;
  outline: 0;
  background: #DC3545;;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
`;

const Deform = styled.div`
  & button:hover, & button:active, & button:focus {
    background-color: #c70000;
    outline : 0;
  }
`;

const Message = styled.p`
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
`;

const MessageInner = styled.a`
  color: #DC3545 !important;
  text-decoration: none;
  cursor: pointer;
`;

const RegisterForm = styled(Form)`
  &.disable {
    height : 0px;
    visibility: hidden;
    opacity: 0;
  }
  &.enable {
    opacity: 1;
    visibility: visible;
  }
`;

const LoginForm = styled(Form)`
  &.disable {
    height : 0px;
    visibility: hidden;
    opacity: 0;
  }
  &.enable {
    opacity: 1;
    visibility: visible;
  }
`;

const ModalBodyNoPadding = styled(ModalBody)`
  padding : 0 !important;
  background-color : white !important
  height : 400px;
`;

const ModalHeaderBack = styled(ModalHeader)`
  background-color : white !important;
  border-bottom: 4px solid #DC3545 !important;
`;

const FormTextLeft = styled(FormText)`
  float : left;
  text-align : left;
  margin : 0 0 15px;
`;

const ModalNoScroll = styled(Modal)`
`;

const Sign = () => {
  const { UtilStore, UserStore } = useStores();
  return (
    <ModalNoScroll isOpen={UtilStore.signToggle} toggle={UtilStore.toggleSign}>
      <ModalHeaderBack toggle={UtilStore.toggleSign}><b>{UtilStore.signDisplay ? '로그인' : '회원가입'}</b></ModalHeaderBack>
      <ModalBodyNoPadding>
        <div>
          <Deform>
            <RegisterForm className={UtilStore.signDisplay ? 'disable' : 'enable'}>
              <FormInput type="text" onChange={UserStore.onRegisterChangeValue} name="email" placeholder="이메일" />
              <FormInput type="password" onChange={UserStore.onRegisterChangeValue} name="password" placeholder="비밀번호" />
              <FormInputWithText type="password" placeholder="비밀번호 확인" />
              <FormTextLeft>
                8~16자 영문 대 소문자, 숫자, 특수문자(필수)를 사용하세요.
              </FormTextLeft>
              <FormInputWithText type="text" onChange={UserStore.onRegisterChangeValue} name="name" placeholder="이름" />
              <FormTextLeft>
                실명을 입력해주세요.
              </FormTextLeft>
              <FormInputWithText type="text" onChange={UserStore.onRegisterChangeValue} name="nickname" placeholder="닉네임" />
              <FormTextLeft>
                GTC에서 보여질 닉네임을 적어주세요.
              </FormTextLeft>
              <FormInputWithText type="text" onChange={UserStore.onRegisterChangeValue} name="tel" placeholder="전화번호" maxLength="11" />
              <FormTextLeft>
                GTC는 한 전화번호 명의로 하나의 계정만 생성할 수 있습니다. <br />
                -를 빼고 입력해주세요. ex) 01012345678
              </FormTextLeft>
              <FormInputWithText type="date" onChange={UserStore.onRegisterChangeValue} name="birth" />
              <FormTextLeft>
                생년월일을 입력해주세요.
              </FormTextLeft>
              <FormSelect type="select" onChange={UserStore.onRegisterChangeValue} name="gender">
                <option value="">성별 선택</option>
                <option value="MALE">남자</option>
                <option value="FEMALE">여자</option>
              </FormSelect>
              <FormInputWithText type="text" onChange={UserStore.onRegisterChangeValue} name="gtNickname" placeholder="그로우토피아 닉네임" />
              <FormTextLeft>
                가장 많이 사용하는 그로우토피아 닉네임을 적어주세요.
                <br /> 거래 중 해당 닉네임으로 인증이 안될시 거래에 문제가 생길 수 있습니다.
              </FormTextLeft>
              <FormButton type="button" onClick={UserStore.register}>가입</FormButton>
              <Message>계정이 있으신가요? &nbsp;
                <MessageInner onClick={UtilStore.changeSign}>
                  로그인
                </MessageInner>
              </Message>
            </RegisterForm>
            <LoginForm className={UtilStore.signDisplay ? 'enable' : 'disable'}>
              <FormInput type="text" name="email" onChange={UserStore.onLoginChangeValue} placeholder="이메일" />
              <FormInput type="password" name="password" onChange={UserStore.onLoginChangeValue} placeholder="비밀번호" />
              <FormButton type="button" onClick={UserStore.login}>로그인</FormButton>
              <Message>
                계정이 없으신가요? &nbsp;
                <MessageInner onClick={UtilStore.changeSign}>
                계정 생성
                </MessageInner>
              </Message>
            </LoginForm>
          </Deform>
        </div>
      </ModalBodyNoPadding>
    </ModalNoScroll>
  );
};

Sign.propTypes = {
  UtilStore: Proptypes.shape({
    alertToggle: Proptypes.bool,
    text: Proptypes.string,
    signDisplay: Proptypes.bool,
    toggleSign: Proptypes.func,
    signToggle: Proptypes.bool,
    changeSign: Proptypes.func,
  }),
  UserStore: Proptypes.shape({
    onRegisterChangeValue: Proptypes.func,
    onLoginChangeValue: Proptypes.func,
    login: Proptypes.func,
  }),
};

Sign.defaultProps = {
  UtilStore: null,
  UserStore: null,
};

export default observer(Sign);