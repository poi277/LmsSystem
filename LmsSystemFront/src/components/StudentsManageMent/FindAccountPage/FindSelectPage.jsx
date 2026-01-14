import { useNavigate } from "react-router-dom"
import GuestHeader from '../UI/GuestHeader'; 
export default function FindSelectPage()
{
    const navigate = useNavigate();

    function handleFindId()
    {
        navigate('/find/id')
    }
    function handleFindPasword()
    {
        navigate('/find/password')
    }


    return(
        <div>
            <GuestHeader />
            
            <button onClick={()=> handleFindId()}>아이디 찾기</button>
             <button onClick={()=> handleFindPasword()}>비밀번호 찾기</button>
        </div>
)}