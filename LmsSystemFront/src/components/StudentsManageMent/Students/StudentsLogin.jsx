import { useState,useContext } from 'react';
import { useNavigate } from "react-router-dom"
import StudentAuthContext from "../api/StudentsAuthProvider"
import GuestHeader from '../UI/GuestHeader'; 

export default function StudentsLogin()
{
    const [id,userid] = useState('')
    const [password,userpassword] = useState('')
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    const { login } = useContext(StudentAuthContext);

    function ProfessorLink()
    {
        navigate('/professor/login')
    }
    function AdminLink()
    {
        navigate('/Administrator/login')
    }
    function SubjectLink()
    {
        navigate('/subject/login')
    }
    function RegisterLink()
    {
        navigate('/register/signup')
    }
    function FindAccountLink()
    {
        navigate('/find/select')
    }
    return(
        <div>
             <GuestHeader />
            학생 로그인
            <div>
            아이디:<input type="text" value= {id} onChange={(event) => userid(event.target.value)}/> 
            </div>
            비밀번호:<input type="password" value= {password} onChange={(event) => userpassword(event.target.value)}/> 
           {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
            <button onClick={async () => {
                try {
                    setLoginError(''); // 기존 에러 초기화
                    await login(id, password); // 로그인 시도
                } catch (error) {
                    // 에러 메시지 처리
                    if (error.response && error.response.data) {
                    setLoginError(error.response.data); // 문자열이면 그대로 출력
                    } else {
                    setLoginError("로그인 중 오류가 발생했습니다.");
                    }
                }
                }}>로그인</button>
            <div>

            </div>
        </div>
    )
}