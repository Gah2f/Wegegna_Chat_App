import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getMessages = async (UserId) => {
    try {
      const { data } = await axios.get(`/api/messages/${UserId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to send message");
    }
  };

  const subscribeToMessages = async () => {
    try {
      if (!socket) return;
      socket.on("newMessage", (newMessage) => {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
          newMessage.seen = true;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
          setUnseenMessages((prevUnseenMessages) => ({
            ...prevUnseenMessages,
            [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
              ? prevUnseenMessages[newMessage.senderId] + 1
              : 1,
          }));
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const unSubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    setUnseenMessages,
    setSelectedUser,
    setMessages,
    sendMessage,
    getUsers,
    getMessages,
    setSelectedUser,
    subscribeToMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
