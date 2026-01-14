import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AdministratorAuthContext from '../api/AdministratorAuthProvider';
import GuestHeader from '../UI/GuestHeader'; 

export default function AdministratorLogin() {
    const { login } = useContext(AdministratorAuthContext);
    const [id, userid] = useState('');
    const [password, userpassword] = useState('');
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    return (
        <div>
            <GuestHeader />
            관리자 로그인
            <div>
                아이디:
                <input type="text" value={id} onChange={(event) => userid(event.target.value)} />
            </div>
            비밀번호:
            <input type="password" value={password} onChange={(event) => userpassword(event.target.value)} />

            {/* 🔽 에러 메시지 출력 부분 추가 */}
            {loginError && <div style={{ color: 'red' }}>{loginError}</div>}

            <button onClick={async () => {
                try {
                    setLoginError('');
                    await login(id, password);
                } catch (error) {
                    if (error.response && error.response.data) {
                        setLoginError(error.response.data);
                    } else {
                        setLoginError("로그인 중 오류가 발생했습니다.");
                    }
                }
            }}>로그인</button>
        </div>
    );
}
