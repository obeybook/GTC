import { observable, action } from 'mobx';

class MyAccountStore {
  @observable profileYN = '';

  @observable nickname = '';

  @observable birth = '';

  @observable gender = '';

  @observable isAllValidationChecked = true;

  @observable timer;

  @observable disabled = true;

  @observable nicknameValidation = {
    status: true,
    message: '',
  };

  @observable birthValidation = {
    status: true,
    message: '',
  };

  @observable genderValidation = {
    status: true,
    message: '',
  };

  constructor(root) {
    this.root = root;
  }

  @action onChangeProfile = (() => {
    if (this.profileYN === 'Y') {
      this.profileYN = 'N';
    } else {
      this.profileYN = 'Y';
    }
    this.disabled = true;

    this.timer = setTimeout(() => {
      this.checkValidation();
    }, 300);
  });

  @action onChangeValue = ((e) => {
    this[e.target.name] = e.target.value;
    this.disabled = true;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.checkValidation();
    }, 300);
  });

  @action setDefaultValue = (() => {
    const { UserStore } = this.root;
    const { userData } = UserStore;

    if (userData) {
      this.profileYN = userData.profileYN;
      this.nickname = userData.username;
      this.birth = userData.birth;
      this.gender = userData.gender;
    }
  });

  @action checkValidation = (() => {
    const { userData } = this.root.UserStore;
    if (this.nickname.trim() === '') {
      this.nicknameValidation = {
        status: false,
        message: '공백 닉네임은 불가능합니다.',
      };
    } else {
      this.nicknameValidation = {
        status: true,
        message: '',
      };
    }

    if (!this.birth) {
      this.birthValidation = {
        status: false,
        message: '올바른 생년월일을 입력해주세요.',
      };
    } else {
      this.birthValidation = {
        status: true,
        message: '',
      };
    }

    if (!this.gender) {
      this.genderValidation = {
        status: false,
        message: '성별을 선택해주세요.',
      };
    } else {
      this.genderValidation = {
        status: true,
        message: '',
      };
    }

    this.disabled = this.nickname === userData.username
      && this.birth === userData.birth
      && this.gender === userData.gender
      && this.profileYN === userData.profileYN;

    this.isAllValidationChecked = this.nicknameValidation.status
    && this.birthValidation.status
    && this.genderValidation.status;
  });
}

export default MyAccountStore;
