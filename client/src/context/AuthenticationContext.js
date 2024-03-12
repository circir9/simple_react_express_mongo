import React from "react";

export const LoggedInContext = React.createContext({ loggedInContext: false });

export const SetLoggedInContext = React.createContext({ setLoggedInContext: ()=>{} });