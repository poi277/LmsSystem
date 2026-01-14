import { studentApiClient, subjectApiClient, AdministratorApiClient,professorApiClient,RegisterApiClient } from './ApiClient'
import axios from 'axios';


const BASE_URL = process.env.REACT_APP_BASE_URL;

  export const registersubmitApi = (email) =>RegisterApiClient.post('/register-send-verification-code', { email });
  export const registerGetemailsubmitApi = (email, code)=> RegisterApiClient.post('/register-verify-code', { email, code });
  export const StudentsRegisterApi = (formData, email) =>
    RegisterApiClient.post('/register', {
      ...formData,
      email,  // email은 별도로 꺼내서 DTO에 포함
    });

    export const SendMailCodeApi = (email) =>  RegisterApiClient.post('/find-id/send-code', { email });
    export const GetMailCodeApi= (email, code) => RegisterApiClient.post('/find-id/verify-code', { email, code });

// 인증 코드 요청 (아이디, 이메일)
export const sendPasswordResetCodeApi = (id, email) => RegisterApiClient.post('/password-code', {id,email});
// 인증 코드 검증
export const verifyPasswordResetCodeApi = (id, email, code) => RegisterApiClient.post('/password-verify', {id,email,code});
// 비밀번호 재설정
export const resetPasswordApi = (id, newPassword,confirmPassword) =>  RegisterApiClient.post('/password-change', {id,newPassword,confirmPassword});




const getApiClientByRole = (role) => {
  switch (role) {
    case 'STUDENT':
      return studentApiClient;
    case 'PROFESSOR':
      return professorApiClient;
    case 'ADMINISTRATOR':
      return AdministratorApiClient;
    default:
      throw new Error(`지원되지 않는 역할: ${role}`);
  }
};

const getApiHighClientByRole = (role) => {
  switch (role) {
    case 'STUDENT':
      throw new Error(`학생은 지원되지 않는 역할: ${role}`);
    case 'PROFESSOR':
      return professorApiClient;
    case 'ADMINISTRATOR':
      return AdministratorApiClient;
    default:
      throw new Error(`지원되지 않는 역할: ${role}`);
  }
};


// 학생 관련 API
export const studentFindByidApi = (id) => studentApiClient.get(`/Students/${id}`);
export const studentFindByidDetailApi = (id) => studentApiClient.get(`/StudentsDetail/${id}`);
export const StudentsGradeApi = (id) => studentApiClient.get(`/StudentsGrade/${id}`);
export const StudentsUpdateApi = (studentData) => studentApiClient.put(`/Students/update`, studentData);
export const StudentsGradeCreateApi = (id, data) =>
  studentApiClient.post(`/StudentsGrade/create/${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });

    export const StudentsLoginApi = async (id, password) => {
  const response = await studentApiClient.post('/login', {
    username: id,
    password: password
  });

  return response.data.accessToken;
};

////교수관련 API
export const ProfessorLoginApi = async (id, password) => {
  const response = await professorApiClient.post('/professor/login', {
    username: id,
    password: password
  });

  return response.data.accessToken;
};
export const ProfessorSubjectAllApi = (id) => professorApiClient.get(`/professor/${id}`);
export const ProfessorFindByidDetailApi = (id) => professorApiClient.get(`/professorDetail/${id}`);
export const ProfessorUpdateApi = (formData) => professorApiClient.put("/professor/update",formData);

export const resetProfessorPasswordApi = (id, newPassword,confirmPassword) =>  professorApiClient.post('/password-change-professor', {id,newPassword,confirmPassword});
//개별 과목API
export const PostSubjectHomePageFindByidApi = (role, id) => {
  const client = getApiClientByRole(role);
  return client.get(`/subject/subject/${id}`);
};
export const PostAlldApi = (role, id) => {
  const client = getApiClientByRole(role);
  return client.get(`/subject/subject/postsAll/${id}`);
};
export const PostOneApi = (role, id) => {
  const client = getApiClientByRole(role);
  return client.get(`/subject/subject/post/${id}`);
};

export const PostDeleteApi = (role, id) => {
  const client = getApiClientByRole(role);
  return client.delete(`/subject/subject/post/${id}`);
};

export const PostUpdateApi = (role, postData) => {
  const client = getApiClientByRole(role);
  return client.put(`/subject/subject/update`, postData, {
    headers: { "Content-Type": "application/json" }
  });
};


export const PostRegisterdApi = (role, postData) => {
  const client = getApiClientByRole(role);
  return client.post(`/subject/subject/post`, postData, {
    headers: { "Content-Type": "application/json" }
  });
};

export const getCommentsApi = (role, postId) => {
  const client = getApiClientByRole(role);
  return client.get(`/comments/${postId}`);
};

export const addCommentApi = (role, postId, commentDto) => {
  const client = getApiClientByRole(role);
  return client.post(`/comments/${postId}`, commentDto, {
    headers: { "Content-Type": "application/json" }
  });
};
export const deletePostCommentApi = (role, postId,) => {
  const client = getApiClientByRole(role);
  return client.delete(`/comments/${postId}`);
};

export const updatePostCommentApi = (role, postId, comment) => {
  const client = getApiClientByRole(role);
  return client.put(`/comments/${postId}`, comment, {
    headers: { "Content-Type": "application/json" }
  });
};

export const fileUploadapi = (role, formData)=>{ 
   const client = getApiClientByRole(role);
  return client.post("/files/upload", formData, {
        headers: {"Content-Type": "multipart/form-data"
        }
      });
    };
    export const filePostFindApi = (role,postId) =>{
      const client = getApiClientByRole(role);
          return client.get(`/files/post/${postId}`);
    };

    export const fileDeleteApi = (role,fileId) =>{
      const client = getApiClientByRole(role);
          return client.delete(`/files/delete/${fileId}`);
      };

    export const  filedownloadApi = (role, fileId, accessToken) => {
        const client = getApiClientByRole(role);
        return client.get(`/files/download/${fileId}`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }); 
      };

    // 수강신청 관련 API  
      export const StudentsSubjectRegisterLoginApi = async (id, password) => {
        const response = await axios.post(`${BASE_URL}/subjectRegister/login`, {
          username: id,
          password: password,
        }, {
          withCredentials: true
        });
        console.log("login response data:", response.data);
        return response.data.accessToken; 
      };
      export const SubjectstudentFindByidApi = (id) => subjectApiClient.get(`/Students/${id}`);
      export const SubjectListApi = (id) => subjectApiClient.get(`/subjectRegister/${id}`);
      export const SubjectPostApi = (id, subjectId) => subjectApiClient.post(`/subjectRegister/${id}/${subjectId}`);
      export const SubjectDeleteApi = (id, subjectId) => subjectApiClient.delete(`/subjectRegister/${id}/${subjectId}`);
      
      // 관리자 관련 API

      export const adminUserListApi = () => AdministratorApiClient.get(`/admin/main`);
      export const adminGetUserDetailApi = (id, role) => AdministratorApiClient.get(`/admin/detail/${id}/${role}`);
      export const adminUserDeleteApi = (id, role) =>AdministratorApiClient.delete(`/admin/delete/${id}/${role}`);
      export const adminSubjectListApi = () => AdministratorApiClient.get(`/admin/subjectAll`);
      export const adminSubjectDetailApi = (id) => AdministratorApiClient.get(`/admin/subject/${id}`);
      export const adminSubjectDeleteApi = (id) =>AdministratorApiClient.delete(`/admin/subject/delete/${id}`);
      export const adminresetPasswordApi = (id, role, newPassword) => AdministratorApiClient.post('/admin/reset-password', { id, role,newPassword});
      export const adminfindProfessorApi = () => AdministratorApiClient.get(`/admin/professorList`);
     

      export const adminSubjectUpdateApi = (subjectdata) =>AdministratorApiClient.put(`/admin/subject/update`, subjectdata, {
    headers: { "Content-Type": "application/json" },
  });

        export const adminSubjectListUpdateApi = (subjectList) =>
        AdministratorApiClient.put(`/admin/subjectlist/update`, subjectList, {
          headers: { "Content-Type": "application/json" },
        });

      export const adminUserUpdateApi = (postData) =>AdministratorApiClient.put(`/admin/update`, postData, {
          headers: { "Content-Type": "application/json" }
        });

      export const adminCreateProfessorApi = (postData) =>AdministratorApiClient.post(`/admin/professor/register`, postData, {
          headers: { "Content-Type": "application/json" }
        });

      export const adminCreateSubjectApi = (postData) =>AdministratorApiClient.post(`/admin/subject/register`, postData, {
          headers: { "Content-Type": "application/json" }
        });


      export function executeBasicAuthenticationService(token) {
        return AdministratorApiClient.get('/admin-basicauthazation', {
          headers: { Authorization: token }
        });
      }

      export const AdminLoginApi = async (id,password)=> {
        const response = await AdministratorApiClient.post('/admin/login', {
      username: id,
      password: password
      
    });
      return response.data.accessToken;}


      
      // export const AdminLoginApi = async (id, password) => {
      // const response = await AdministratorApiClient.post('/admin/login',{
      //     username: id,
      //     password: password},
      //   {
      //     withCredentials: true // 
      //   });
      // return response.data.accessToken;};


      export const AdminStudentsGradeupdateApi = (id, data) => 
        AdministratorApiClient.put(`/StudentsGrade/update/${id}`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        export const AdminStudentFindByidApi = (id) => AdministratorApiClient.get(`/Students/${id}`);
        export const AdminStudentDeleteApi = (id) => AdministratorApiClient.delete(`/Students/delete/${id}`);
        export const AdminStudentfindAllApi = () => AdministratorApiClient.get(`/Students`);
        
        export const AdminStudentsGradeApi = (id) => AdministratorApiClient.get(`/StudentsGrade/${id}`);

        export const AdminStudentsGradedeleteApi = (id) => AdministratorApiClient.delete(`/StudentsGrade/delete/${id}`);
        export const AdminStudentsGradeInfoApi = (id) => AdministratorApiClient.get(`/StudentsGrade/Grade/${id}`);
        export const AdminStudentpostApi = (studentData) => AdministratorApiClient.post(`/Students/create`, studentData);
        export const AdminStudentputApi = (studentData) => AdministratorApiClient.put(`/Students/update`, studentData);

        




        // 토큰 리프레시 API (토큰 헤더 직접 전달해야 하므로 axios 인스턴스 쓰지 않고 직접 호출)
       
          export const StudentsTokenRefreshApi = (oldToken) => {
            return axios.post(`${BASE_URL}/refresh/students`, {}, {
              headers: {
                Authorization: oldToken
              },
              withCredentials: true // ✅ headers 밖에 위치해야 함!
            });
          };
        export const SubjectTokenRefreshApi = (oldToken) => {
            return axios.post(`${BASE_URL}/refresh/subject`, {}, {
              headers: {
                Authorization: oldToken
              },
              withCredentials: true // ✅ headers 밖에 위치해야 함!
            });
          };

        export const ProfessorTokenRefreshApi = (oldToken) => {
            return axios.post(`${BASE_URL}/refresh/professor`, {}, {
              headers: {
                Authorization: oldToken
              },
              withCredentials: true // ✅ headers 밖에 위치해야 함!
            });
          };
        export const AdministratorTokenRefreshApi = (oldToken) => {
          return axios.post(
            `${BASE_URL}/refresh/admin`,{},{
              headers: {
                Authorization: oldToken,
              },
                withCredentials: true // 
            });
        };
        //성적관련 메소드
        export const GradeListApi = (role,subjectId) =>{
      const Highclient = getApiHighClientByRole(role);
          return Highclient.get(`/grade/${subjectId}`);
      };

      export const GradeUpdateApi = (role,subjectId,GradeData) =>{
      const Highclient = getApiHighClientByRole(role);
          return Highclient.put(`/grade/update/${subjectId}`,GradeData,{
              headers: { 'Content-Type': 'application/json' }
          })};

        // export const TokenResheshApi = () => {
        //     return axios.post("http://localhost:8080/refresh", {}, {
        //       withCredentials: true  // ✅ 쿠키 포함 요청
        //     });
        //   };
  
  // export function executeBasicAuthenticationService(basicToken) {
  //   return axios.get("http://localhost:8080/Students-basicauthazation", {
  //     headers: {
  //       Authorization: basicToken  // 만약 localStorage.removeItem('token');을 안한다면 이 코드를 써서
  //   우회해서 직접 Basic 토큰 지정을 해야함..안그러면 로컬스토리지에 남아있는 jwt토큰 방식으로 들어감
  //     }
  //   });
  // }

    // 학생 로그인 API
  // export const StudentsLoginApi = (id, password) =>  
  //   studentApiClient.post('/login', {
  //     username: id,
  //     password: password
  //   });