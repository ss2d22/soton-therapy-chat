import "./App.css";
import {useDispatch, useSelector} from "react-redux";
import {selectUserInfo, setUserInfo} from "@/state/slices/authSlice";
import {AppDispatch, RootState, RouterProps, fetchUserInfoResponse } from "@/types";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "@/pages/authentication";
import Chat from "@/pages/chat";
import UserProfile from "@/pages/profile";
import {useState} from "react";
import {useGetFetchUserInfoQuery} from "@/state/api/authApi.ts";
import { useEffectAsync } from "@/hooks/useEffectAsync";


const PrivateRoute: React.FC<RouterProps> = ({ children }: RouterProps ) => {
  const userInfo = useSelector(selectUserInfo);
    const isAuth = !!userInfo;
    console.log("userinfo: ", userInfo);
    console.log("isAUth: ", isAuth);

    return isAuth ? children : <Navigate to="/authentication" />;
}

const AuthRoute: React.FC<RouterProps> = ({ children }: RouterProps) => {
  const userInfo = useSelector(selectUserInfo);
  const isAuth = !!userInfo;
    console.log("userinfo: ", userInfo);
    console.log("isAUth: ", isAuth);

  return isAuth ? <Navigate to="/chat" /> : children;
};

function App() {
    const userInfo = useSelector(selectUserInfo);
    const dispatch: AppDispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const { isLoading, refetch } = useGetFetchUserInfoQuery({});

    useEffectAsync(async () => {
        const getUserData = async () => {
            try {
                const result = (await refetch()) as unknown as fetchUserInfoResponse;
                console.log({ result });
                if (result.data && result.isSuccess) {
                    dispatch(setUserInfo(result.data.user));
                } else {
                    dispatch(setUserInfo(undefined));
                }
            } catch (error) {
                console.error(error);
                dispatch(setUserInfo(undefined));
            } finally {
                setLoading(false);
            }
        };
        if (!userInfo) {
            await getUserData();
        } else {
            setLoading(false);
        }
    }, [userInfo, setUserInfo]);

    if (loading || isLoading) {
        return (
            <>
                <h1>Loading...</h1>
            </>
        );
    }
  return (

      <BrowserRouter>
        <Routes>
          <Route
              path="/authentication"
              element={
                <AuthRoute>
                  <Auth />
                </AuthRoute>
              }
          />
          <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
          />
          <Route
              path="/userprofile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
          />
          {/* TODO: add a page not found component with butten to redirect back to auth or chat home page based on if user is authenticated or not */}
          <Route path="*" element={<Navigate to={"/authentication"} />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
