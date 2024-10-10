import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const initState = {
  uno: '',
  name: '',
  userId: '',
  password: '',
  password2: '',
  nickname: '',
  avatar: '',
  profilePic: '',
  gender: '',
  roles: [], //권한 목록
  token: '', //접근 토큰(JWT)
};

export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });

  const isLogin = computed(() => !!state.value.userId);

  // state.value.user.id 존재하면 그 값은 truthy이므로,
  // ---> !!state.value.user.id true를 반환
  // 만약 state.value.user.id null, undefined, ''(빈 문자열)과 같이 falsy한 값이라면,
  // --->!!state.value.user.id false를 반환
  // 따라서 computed 함수는 사용자가 로그인 상태인지 (id 있는지) 여부를 계산하여
  // isLogin이라는 계산된 속성에 할당

  const uno = computed(() => state.value.uno);
  const userId = computed(() => state.value.userId);
  const nickname = computed(() => state.value.nickname);
  const name = computed(() => state.value.name);
  const gender = computed(() => state.value.gender);
  const avatar = computed(() => state.value.avatar);
  const profilePic = computed(() => state.value.profilePic);

  const load = () => {
    const auth = localStorage.getItem('auth');
    console.log();
    if (auth != null) {
      state.value = JSON.parse(auth);
    }
  };

  // localStorage에 저장된 사용자 인증 정보를 불러와서 state에 저장하는 역할
  // localStorage에서 auth라는 항목을 가져와, 그 값이 존재하면 이를 파싱하여 state.value에 저장하는 함수
  //  localStorage.getItem('auth'): localStorage에서 'auth'라는 키에 저장된 값을 가져온다.
  //  if (auth != null): auth 값이 존재하면 (null이 아니면),
  //  state.value = JSON.parse(auth);: auth 문자열을 JSON 객체로 변환한 후 state.value에 할당

  const login = async (member) => {
    console.log(member);
    // state.value.token = 'test token';
    // state.value.user = { : member.id, email: member.id + '@test.com' }   ;

    // api 호출
    const { data } = await axios.post('/api/auth/login', member);
    //상태 업데이트 및 로컬 스토리지에 저장
    state.value = { ...data };

    localStorage.setItem('auth', JSON.stringify(state.value));

    //console.log('로그인 상태:', isLogin.value);
    return data; //추가 : 로그인 결과 반환
  };

  // 로그인 요청을 보내고, 서버로부터 받은 인증 정보를 상태와 localStorage에 저장하는 역할
  // axios.post('/api/auth/login', member): member 정보를 사용해 /api/auth/login API에 로그인 요청을 보냄.
  // { data } = await axios.post(...): API 요청이 완료되면 서버에서 받은 응답 데이터를 data에 저장
  // state.value = { ...data };: 받은 데이터를 state.value에 저장
  // localStorage.setItem('auth', JSON.stringify(state.value));: state.value를 문자열로 변환해 localStorage에 'auth'라는 키로 저장

  const logout = () => {
    localStorage.clear();
    state.value = { ...initState };
  };

  //로그아웃 시 저장된 데이터를 지우고, 상태를 초기화하는 역할
  // localStorage.clear(): localStorage에 저장된 모든 데이터를 삭제
  // state.value = { ...initState };: 애플리케이션의 상태를 초기 상태(initState)로 재설정

  const getToken = () => state.value.token;

    const changeProfile = (member) => {
        state.value.nickname = member.nickname;
        state.value.profilePic = member.profilePic;
        localStorage.setItem('auth', JSON.stringify(state.value));
    };

  load();

  // 토큰을 가져오고, 사용자의 이메일을 업데이트하며, 초기 상태를 불러오는 기능을 수행
  // getToken(): 현재 상태(state.value)에서 token 값을 반환합니다.
  // changeProfile(member): 사용자의 이메일을 주어진 member.email로 변경하고, 변경된 상태를 localStorage에 저장합니다.
  // load(): 페이지가 로드될 때 localStorage에서 저장된 인증 정보를 불러와 state에 설정

  return { uno, state, userId, name, nickname, profilePic, gender, avatar, isLogin, changeProfile, login, logout, getToken };
});
