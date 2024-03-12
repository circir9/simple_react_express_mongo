import React, {useState} from 'react';
import {HashRouter,Route,Routes} from "react-router-dom";
import MemberPage from "./page/MemberPage";
import SingleImagePage from "./page/SingleImagePage";
import MainLayout from "./layout/MainLayout";
import ListFormPage from "./page/ListFormPage";
import ProjectFilePage from "./page/ProjectFilePage";
import MenuPage from "./page/MenuPage";
import ImageNumberPage from "./page/ImageNumberPage";
import AuthenticationPage from "./page/AuthenticationPage";
import SignupPage from "./page/SignupPage";
import ForgetPasswordPage from "./page/ForgetPasswordPage";
import ChangePasswordPage from "./page/ChangePasswordPage";
import MessagePage from "./page/MessagePage";
import HomePage from "./page/HomePage";
import ProfilePage from "./page/ProfilePage";
import { LoggedInContext, SetLoggedInContext } from './context/AuthenticationContext';

const App = () =>{
    const [isLoggedIn, setLoggedIn] = useState(false);

    return( 
        <LoggedInContext.Provider value={{ loggedInContext: isLoggedIn }} >
            <SetLoggedInContext.Provider value={{ setLoggedInContext: setLoggedIn }}>
                <HashRouter>
                    <Routes>
                        <Route exact={true} path="/" element={
                            <MainLayout>
                                <MemberPage />
                            </MainLayout>
                        }/>
                        <Route path="/home" element={
                            <MainLayout>
                                <HomePage />
                            </MainLayout>
                        }/>
                        <Route path="/frieren" element={
                            <MainLayout>
                                <SingleImagePage />
                            </MainLayout>
                        }/>
                        <Route path="/listform" element={
                            <MainLayout>
                                <ListFormPage />
                            </MainLayout>
                        }/>
                        <Route path="/projectfile" element={
                            <MainLayout>
                                <ProjectFilePage />
                            </MainLayout>
                        }/>
                        <Route path="/menu" element={
                            <MainLayout>
                                <MenuPage />
                            </MainLayout>
                        }/>
                        <Route path="/image/page/:pageNumber" element={
                            <MainLayout>
                                <ImageNumberPage />
                            </MainLayout>
                        }/>
                        <Route path="/login" element={
                            <MainLayout>
                                <AuthenticationPage />
                            </MainLayout>
                        }/>
                        <Route path="/signup" element={
                            <MainLayout>
                                <SignupPage />
                            </MainLayout>
                        }/>
                        <Route path="/forgetPW" element={
                            <ForgetPasswordPage />
                        }/>
                        <Route path="/changePW" element={
                            <ChangePasswordPage />
                        }/>
                        <Route path="/message_board" element={
                            <MainLayout>
                                <MessagePage />
                            </MainLayout>
                        }/>
                        <Route path="/user_profile/:user_id" element={
                            <ProfilePage />
                        }/>
                    </Routes>
                </HashRouter>
            </SetLoggedInContext.Provider>
        </LoggedInContext.Provider>
    );
};

export default App;