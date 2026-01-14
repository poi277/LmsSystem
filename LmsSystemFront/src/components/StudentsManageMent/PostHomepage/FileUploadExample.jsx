import React, { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function SubjectFileUpload() {
  const [subjectId, setSubjectId] = useState(""); // 과목 ID
  const [file, setFile] = useState(null); // 선택한 파일
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!subjectId || !file) {
      setMessage("과목 ID와 파일을 모두 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/subject/${subjectId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage("파일 업로드 실패: " + error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>📁 과목별 파일 업로드</h2>
      <input
        type="text"
        placeholder="과목 ID 입력"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
      />
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload}>업로드</button>
      <p>{message}</p>
    </div>
  );
}
