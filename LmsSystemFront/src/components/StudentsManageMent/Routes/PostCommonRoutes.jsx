// src/routes/SharedPostRoutes.jsx
import { Route } from "react-router-dom";
import PostMainPage from "../PostHomepage/PostMainPage";
import PostCratePage from "../PostHomepage/PostCratePage";
import PostDetail from "../PostHomepage/PostDetail";
import PostUpdatePage from "../PostHomepage/PostUpdatePage";
import DataRoom from "../PostHomepage/DataRoom/DataRoom";
import DataRoomDetail from "../PostHomepage/DataRoom/DataRoomDetail";

export function PostCommonRoutes(role) {
  return [
    <Route
      key={`${role}-main`}
      path="subject/:subjectCategory/:subjectId"
      element={<PostMainPage role={role} />}
    />,

    <Route
      key={`${role}-create`}
      path="subject/:subjectCategory/:subjectId/post"
      element={<PostCratePage role={role} />}
    />,
    <Route
      key={`${role}-detail`}
      path="subject/:subjectCategory/:subjectId/post/:postId"
      element={<PostDetail role={role}/>}
    />, 
    <Route
      key={`${role}-update`}
      path="subject/:subjectCategory/:subjectId/post/:postId/update"
      element={<PostUpdatePage role={role} />}
    />,
    <Route
      key={`${role}-PostDataRoom`}
      path="subject/:subjectId/dataroom"
      element={<DataRoom role={role} />}
    />,
    <Route
      key={`${role}-PostDataRoomDetail`}
      path="subject/:subjectId/dataroom/:postid"
      element={<DataRoomDetail role={role} />}
    />,
  ];
}
