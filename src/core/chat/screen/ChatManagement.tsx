import { View, StyleSheet, ActivityIndicator, Text, GestureResponderEvent } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import io from 'socket.io-client';
import { chatRoutes } from '../api-route/index.ts';
import { getParentEmail } from '../../../shared/utils/string.ts';

const SOCKET_URL = 'http://16.170.144.6:3001';

interface IChatManagementProps {
  navigation: any;
  authUser?: IAuthUserWithToken | null;
  chatReceiveEmail: string;
}

interface IPostMessage {
  message: string;
  sender: string;
  receiver: string;
}

export default function ChatManagementScreen(props: IChatManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('message', message => {
      if (
        message?.receiver === props?.authUser?.user?.email &&
        message?.sender === (props?.chatReceiveEmail?.length ? props?.chatReceiveEmail : getParentEmail(props?.authUser?.user?.email))
      ) {
        setMessages(prevMessages =>
          GiftedChat.append(prevMessages, [{ ...message, user: { _id: message?.sender }, text: message?.message, _id: message?.id }])
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [props?.chatReceiveEmail, props?.authUser]);

  useEffect(() => {
    if (!props.authUser) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    return () => {
      setIsLoading(false);
    };
  }, [props.authUser]);

  useEffect(() => {
    if (props?.authUser) {
      let _messages: any[] = [];
      findAllChats(props?.chatReceiveEmail?.length ? props?.chatReceiveEmail : getParentEmail(props?.authUser?.user?.email), props?.authUser?.user?.email)
        .then(data => {
          if (data?.data?.rows?.length)
            _messages = [
              ..._messages,
              ...data?.data?.rows?.map((x: any) => ({
                ...x,
                user: { _id: props?.chatReceiveEmail?.length ? props?.chatReceiveEmail : getParentEmail(props?.authUser?.user?.email) },
                text: x?.message,
                _id: x?.id,
              })),
            ];

          findAllChats(props?.authUser!.user!.email, props?.chatReceiveEmail?.length ? props?.chatReceiveEmail : getParentEmail(props?.authUser?.user?.email))
            .then(data => {
              if (data?.data?.rows?.length)
                _messages = [
                  ..._messages,
                  ...data?.data?.rows?.map((x: any) => ({ ...x, user: { _id: props?.authUser?.user?.email }, text: x?.message, _id: x?.id })),
                ];

              _messages.sort((a, b) => {
                const dA = new Date(a.created.at);
                const dB = new Date(b.created.at);
                return dB.getTime() - dA.getTime();
              });

              setMessages(prevMessages =>
                GiftedChat.append(
                  prevMessages,
                  _messages.map(_message => _message)
                )
              );
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    }

    return () => {
      setMessages([]);
    };
  }, [props?.chatReceiveEmail, props?.authUser]);

  const findAllChats = async (sender: string, receiver: string) => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: chatRoutes.getAllChat.method,
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
        url: chatRoutes.getAllChat.route(sender, receiver),
      });

      return response?.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSend = useCallback(async (messages: any[] = []) => {
    try {
      const postMessage: IPostMessage = {
        message: messages[0]?.text,
        sender: props?.authUser!.user?.email,
        receiver: props?.chatReceiveEmail?.length ? props?.chatReceiveEmail : getParentEmail(props?.authUser?.user?.email),
      };

      if (postMessage?.sender === props?.authUser?.user?.email) setMessages((previousMessages: any[]) => GiftedChat.append(previousMessages, messages) as any);

      await axios({
        method: chatRoutes.createChat.method,
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
        url: chatRoutes.createChat.route,
        data: { ...postMessage },
      });

      console.log('[POST MESSAGE]', postMessage);
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.activityIndicator} animating={isLoading} />
      </View>
    );
  }

  if (!isLoading && !props.chatReceiveEmail && props.authUser?.user.role === 'PARENT') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Select Chat User from user management</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff',
        }}
        user={{
          _id: props?.authUser?.user?.email ?? '',
          avatar: 'https://i.pravatar.cc/300',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    backgroundColor: '#f8f8f8',
    marginTop: 10,
    marginLeft: 0,
    width: '100%',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
