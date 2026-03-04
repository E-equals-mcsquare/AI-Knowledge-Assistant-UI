import { createBrowserRouter } from "react-router";
import { ChatInterface } from "./components/ChatInterface";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ChatInterface,
  },
  {
    path: "/chat/:conversationId",
    Component: ChatInterface,
  },
]);
