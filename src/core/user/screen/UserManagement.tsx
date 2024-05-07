import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface.ts';
import axios from 'axios';
import { userRoutes } from '../api-route';
import { getFullName } from '../../../shared/utils/string.ts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import UserSpecificFetchScreen from './UserSpecificFetchScreen.tsx';
import UserAddScreen from './UserAddScreen.tsx';
import { getFormatDate } from '../../../shared/utils/date-format.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IUserManagementProps {
  navigation: any;
  authUser?: IAuthUserWithToken | null;
  setChatReceiveEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function UserManagementScreen(props: IUserManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [offSet, setOffSet] = useState(0);
  const [limit, setLimit] = useState(20);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [childUsers, setChildUsers] = useState<
    {
      parentUserId: number;
      childUsers: any[];
      modal: boolean;
      isLoading: boolean;
    }[]
  >([]);
  const [userArrows, setUserArrows] = useState<{ userId: number; arrowDown: boolean }[]>([]);

  useEffect(() => {
    if (props?.authUser) {
      findAllUsers(offSet, limit)
        .then(data => {
          data?.data?.rows?.length && setUsers([...(data?.data?.rows?.length && data?.data?.rows)]);
          // setChildUsers(prevState => {
          //   return [
          //     ...prevState,
          //     ...data?.data?.rows?.map((user: any) => ({
          //       parentUserId: user.id,
          //       childUsers: [],
          //       modal: false,
          //       isLoading: false,
          //     })),
          //   ];
          // });

          // setUserArrows(prevState => [
          //   ...prevState,
          //   ...data?.data?.rows?.map((user: any) => ({
          //     userId: user.id,
          //     arrowDown: true,
          //   })),
          // ]);
        })
        .catch(error => console.log(error));
    }

    return () => {
      setUsers([]);
      setChildUsers([]);
      setUserArrows([]);
    };
  }, []);

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

  const fetchNextPage = async () => {
    const changeOffset = offSet + limit;
    setNextPageLoading(true);
    try {
      const response = await findAllUsers(changeOffset, limit);
      if (props?.authUser && response?.data?.rows?.length) {
        setUsers(prevState => [...prevState, ...(response?.data?.rows?.length && response?.data?.rows)]);
        setChildUsers(prevState => {
          return [
            ...prevState,
            ...response?.data?.rows?.map((user: any) => ({
              parentUserId: user.id,
              childUsers: [],
              modal: false,
              isLoading: false,
            })),
          ];
        });
        setUserArrows(prevState => [
          ...prevState,
          ...response?.data?.rows?.map((user: any) => ({
            userId: user.id,
            arrowDown: true,
          })),
        ]);
        setOffSet(changeOffset);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setNextPageLoading(false);
    }
  };

  const findAllUsers = async (offset: number, _limit: number) => {
    try {
      setIsLoading(true);
      const response = await axios({
        url: userRoutes.find.route(offset, _limit, props?.authUser?.user?.id ?? 0),
        method: userRoutes.find.method,
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
      });

      return response?.data;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={styles.activityIndicator} animating={isLoading} />}

      <FlatList
        data={users}
        renderItem={({ item, index }) => {
          return (
            <View key={index}>
              <View style={styles.card}>
                <View style={styles.infoSection}>
                  <View style={styles.avatar}>
                    <Text>{item.id}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text>
                      {getFullName({
                        firstName: item?.firstName,
                        lastName: item?.lastName,
                        middleName: item?.middleName,
                      })}
                    </Text>
                    <Text>
                      {item.email}
                      <Text style={styles.chipLabel}>({item.role})</Text>
                    </Text>
                    <Text>
                      {getFormatDate(item.updated.at)}
                      <Text style={styles.chipLabel}>(Last Updated)</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.slideIcon}>
                  <Pressable
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setUserId(() => item.id);
                    }}>
                    <MaterialIcons name={'view-headline'} color={'black'} size={20} />
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setUserId(() => item.id);
                      props.setChatReceiveEmail(item.email);
                      props.navigation.navigate('Chat');
                    }}>
                    <MaterialIcons name={'message'} color={'black'} size={20} />
                  </Pressable>

                  {/* <Pressable
                    onPress={async () => {
                      try {
                        //call api
                        const isCallable = childUsers?.find(
                          childUser =>
                            childUser.parentUserId === item.id &&
                            !childUser.modal,
                        );

                        let response: any[] = [];

                        if (isCallable) {
                          const _response = await axios({
                            url: userRoutes.findAssociatedChild.route(item.id),
                            method: userRoutes.findAssociatedChild.method,
                            headers: {
                              Authorization:
                                'Bearer ' + props?.authUser?.accessToken,
                            },
                          });

                          response = _response?.data?.data?.rows ?? [];
                        }

                        setChildUsers(prevState => {
                          return prevState.map(childUser => {
                            if (childUser.parentUserId !== item.id) {
                              return childUser;
                            }

                            return {
                              ...childUser,
                              ...(isCallable && {
                                childUsers: response,
                              }),
                              modal: !childUser.modal,
                            };
                          });
                        });

                        setUserArrows(prevState => {
                          return prevState.map(user => {
                            if (user.userId === item.id) {
                              return {...user, arrowDown: !user.arrowDown};
                            }

                            return user;
                          });
                        });
                      } catch (e) {
                        console.log(e);
                      }
                    }}>
                    <MaterialIcons
                      name={
                        userArrows?.find(
                          user => user.userId === item.id && user.arrowDown,
                        )
                          ? 'keyboard-arrow-down'
                          : 'keyboard-arrow-up'
                      }
                      color={'black'}
                      size={20}
                    />
                  </Pressable> */}
                </View>
              </View>

              <View style={styles.horizontalLine} />

              {childUsers.find(childUser => childUser.parentUserId === item.id && childUser.modal) && (
                <View style={styles.childUserModalView}>
                  {childUsers.map(childUser => {
                    if (childUser.parentUserId === item.id && childUser.childUsers.length) {
                      return childUser.childUsers.map((user: any, index: number) => (
                        <View style={styles.card} key={index}>
                          <View style={styles.infoSection}>
                            <View style={styles.avatar}>
                              <Text>{index + 1}</Text>
                            </View>
                            <View style={styles.userInfo}>
                              <Text>
                                {getFullName({
                                  firstName: user?.firstName,
                                  lastName: user?.lastName,
                                  middleName: user?.middleName,
                                })}
                              </Text>
                              <Text>
                                {user.email}
                                <Text style={styles.chipLabel}>({user.role})</Text>
                              </Text>
                              <Text>
                                {getFormatDate(user.updated.at)}
                                <Text style={styles.chipLabel}>(Last Updated)</Text>
                              </Text>
                            </View>
                          </View>

                          <View style={styles.slideIcon}>
                            <Pressable
                              onPress={() => {
                                setModalVisible(!modalVisible);
                                setUserId(() => user.id);
                              }}>
                              <MaterialIcons name={'view-headline'} color={'black'} size={20} />
                            </Pressable>
                          </View>
                        </View>
                      ));
                    }
                  })}
                </View>
              )}
            </View>
          );
        }}
        keyExtractor={item => item.id}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.8}
        ListFooterComponent={<ActivityIndicator size={'large'} animating={nextPageLoading} />}
      />

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
              }}>
              <Text style={{ marginLeft: 20 }}>{fullName}</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <AntDesign style={{ right: 10 }} name={'close'} color={'#ff6666'} size={25} />
              </Pressable>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                width: '100%',
                marginVertical: 10,
                borderBottomColor: 'rgba(0,0,0,0.47)',
              }}
            />

            <UserSpecificFetchScreen
              dispatchFullName={setFullName}
              userId={userId}
              users={users}
              dispatchUsers={setUsers}
              dispatchModelVisible={() => setModalVisible(false)}
              accessToken={props?.authUser?.accessToken ?? ''}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.addView}>
        <Pressable onPress={() => setAddModalVisible(true)}>
          <AntDesign name={'plus'} size={35} color={'white'} />
        </Pressable>
      </View>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
              }}>
              <Text style={{ marginLeft: 20 }}>Add User</Text>
              <Pressable onPress={() => setAddModalVisible(!addModalVisible)}>
                <AntDesign style={{ right: 10 }} name={'close'} color={'#ff6666'} size={25} />
              </Pressable>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                width: '100%',
                marginVertical: 10,
                borderBottomColor: 'rgba(0,0,0,0.47)',
              }}
            />

            <UserAddScreen
              // dispatchFullName={setFullName}
              users={users}
              email={props.authUser?.user.email ?? ''}
              dispatchUsers={setUsers}
              dispatchModelVisible={() => setAddModalVisible(false)}
              accessToken={props?.authUser?.accessToken ?? ''}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 10,
    marginLeft: 10,
    width: '95%',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoSection: {
    flexDirection: 'row',
  },
  slideIcon: {
    position: 'relative',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    backgroundColor: '#cbcbcc',
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 10,
  },
  chip: {
    // borderWidth: 1,
    // borderRadius: 10,
  },
  chipLabel: {
    color: '#333',
    fontSize: 11,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.47)',
    marginVertical: 10,
  },

  childUserModalView: {
    minHeight: 20,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    marginBottom: 10,
  },

  centeredView: {
    flex: 1,
    // backgroundColor: '#7f8280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addView: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#570bce',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    right: 10,
  },
});
