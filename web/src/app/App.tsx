import { RouterProvider } from "react-router-dom";

import { CommentPanel } from "@/widgets/commentable";

import { router } from "./router";

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CommentPanel />
    </>
  );
}
