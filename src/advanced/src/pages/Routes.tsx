import React from "react"; // React 임포트 추가
import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    // errorElement: <div>Not Found Page</div>,
  },
]);

export type RoutePath = "/" | string;
