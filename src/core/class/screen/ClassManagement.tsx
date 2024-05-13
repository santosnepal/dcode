import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View, TextInput, GestureResponderEvent } from 'react-native';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface.ts';
import axios from 'axios';
import { classRoutes } from '../api-route';
import { convertStringToDateTimeFormat, getFormatDate } from '../../../shared/utils/date-format.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ClassSpecificFetchScreen from './ClassSpecificFetchScreen.tsx';
import ClassAddScreen from './ClassAddScreen.tsx';
import ClassTriggerScreen from './ClassTriggerTime.tsx';
import CustomTextInputComponent from '../../auth/component/TextInput.tsx';
import CustomTouchableOpacityComponent from '../../auth/component/Button.tsx';
import PopupWithCloseIcon from '../../../shared/interface/Modal.tsx';
import { getFullName } from '../../../shared/utils/string.ts';
import DropDownPicker from 'react-native-dropdown-picker';
import { userRoutes } from '../../user/api-route/index.ts';

interface IClassManagementProps {
  navigation: any;
  authUser?: IAuthUserWithToken | null;
}

export default function ClassManagementScreen(props: IClassManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const [limit, setLimit] = useState(20);
  const [classes, setClasses] = useState<any[]>([]);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addTriggerTimeModel, setAddTriggerTimeModel] = useState(false);
  const [classId, setClassId] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [classTriggerDate, setClassTriggerDate] = useState('');
  const [classTriggerTime, setClassTriggerTime] = useState('');
  const [modalClassTriggerDateVisible, setModalClassTriggerDateVisible] = useState(false);
  const [modalClassLocationsVisible, setModalClassLocationsVisible] = useState(false);
  const [modalClassUserMapVisible, setModalClassUserMapVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [classTriggerId, setClassTriggerId] = useState('');
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popUpContent, setPopUpContent] = useState('');
  const [popUpMode, setPopUpMode] = useState(false);
  const [error, setError] = useState<string | null | boolean>(null);

  const [classTriggerTimeOpenModal, setClassTriggerTimeOpenModal] = useState(false);
  //Add user to class
  const [openUserToClass, setOpenUserToClass] = useState(false);
  const [valueUserToClass, setValueUserToClass] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [openClassToTrigger, setOpenClassToTrigger] = useState(false);
  const [valueClassToTrigger, setValueClassToTrigger] = useState<any>(null);
  const [classTriggerTimes, setClassTriggerTimes] = useState<any[]>([]);

  //fetch user class time map
  const [fetchUserClassTimeMap, setFetchUserClassTimeMapTrigger] = useState<any>({});

  useEffect(() => {
    if (props?.authUser) {
      findAllClasses(offSet, limit)
        .then(data => {
          data?.data?.rows?.length && setClasses(prevState => [...prevState, ...data?.data?.rows.map((x: any) => ({ ...x, expandUserClassTimeMap: false }))]);
        })
        .catch(error => console.log(error));

      findAllUsers(0, 999)
        .then(data => {
          data?.data?.rows?.length &&
            setUsers([
              ...data?.data?.rows.map((x: any) => ({
                value: x.id,
                label: getFullName({ firstName: x.firstName, lastName: x.lastName, middleName: x.middleName }),
              })),
            ]);
        })
        .catch(error => console.log(error));
    }

    return () => {
      setClasses([]);
    };
  }, []);

  useEffect(() => {
    if (props?.authUser && classId) {
      findAllClassTriggerTime(+classId)
        .then(data => {
          data?.data?.rows?.length &&
            setClassTriggerTimes([
              ...data?.data?.rows.map((x: any) => ({
                value: x.classTriggerId,
                label: x?.classTriggerDateTime && getFormatDate(x.classTriggerDateTime),
              })),
            ]);
        })
        .catch(error => console.log(error));
    }

    return () => {
      setClassTriggerTimes([]);
    };
  }, [classId]);

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

  const findAllClassTriggerTime = async (classId: number) => {
    try {
      setIsLoading(true);
      const response = await axios({
        url: classRoutes.findClassTriggerTime.route(classId),
        method: classRoutes.findClassTriggerTime.method,
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

  const findAllClasses = async (offset: number, _limit: number) => {
    try {
      setIsLoading(true);
      const response = await axios({
        url: classRoutes.find.route(offset, _limit),
        method: classRoutes.find.method,
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

  const fetchNextPage = async () => {
    const changeOffset = offSet + limit;
    setNextPageLoading(true);
    try {
      const response = await findAllClasses(changeOffset, limit);
      if (props?.authUser && response?.data?.rows?.length) {
        setClasses(prevState => [...prevState, ...response?.data?.rows?.map((x: any) => ({ ...x, expandUserClassTimeMap: false }))]);
        setOffSet(changeOffset);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setNextPageLoading(false);
    }
  };

  const classLocationSaveHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await axios({
        method: classRoutes.createLocation.method,
        url: classRoutes.createLocation.route,
        data: {
          source: {
            latitude: +latitude,
            longitude: +longitude,
          },
          referenceId: +classId,
          moduleName: 'class',
        },
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
      });
    } catch (e) {
      setPopUpContent('Please Reverify your credential');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setLatitude('');
      setLongitude('');
      setModalClassLocationsVisible(false);
      setIsLoading(false);
      setTimeout(() => {
        setError(false);
      }, 10000);
    }
  };

  const saveClassTriggerDateTimeHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await axios({
        method: classRoutes.createClassTriggerTime.method,
        url: classRoutes.createClassTriggerTime.route,
        data: {
          classId,
          classTriggerDateTime: convertStringToDateTimeFormat(classTriggerDate, classTriggerTime),
        },
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
      });
    } catch (e) {
      setPopUpContent('Please Reverify your credential');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setClassTriggerDate('');
      setClassTriggerTime('');
      setModalClassTriggerDateVisible(false);
      setIsLoading(false);
      setTimeout(() => {
        setError(false);
      }, 10000);
    }
  };

  const saveClassUserMapHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await axios({
        method: classRoutes.createClassUserMap.method,
        url: classRoutes.createClassUserMap.route,
        data: {
          classId,
          userId: +valueUserToClass,
          classTriggerId: +valueClassToTrigger,
        },
        headers: {
          Authorization: 'Bearer ' + props?.authUser?.accessToken,
        },
      });
    } catch (e) {
      console.log(e);
      setPopUpContent('Please Reverify your credential');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setUserId('');
      setClassTriggerId('');
      setModalClassUserMapVisible(false);
      setIsLoading(false);
      setTimeout(() => {
        setError(false);
      }, 10000);
    }
  };

  const closeErrorPopup = () => {
    setError(null);
  };
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const fetchClassUserDateTimeMapHandler = async (event: GestureResponderEvent, selectedClassId: number, expandUserClassTimeMap: boolean) => {
    try {
      setIsLoading(true);
      if (!expandUserClassTimeMap) {
        const result = (
          await axios({
            method: classRoutes.fetchClassUserTimeMap.method,
            url: classRoutes.fetchClassUserTimeMap.route(selectedClassId),
            headers: {
              Authorization: 'Bearer ' + props?.authUser?.accessToken,
            },
          })
        ).data;

        if (result?.data?.rows?.length) {
          setFetchUserClassTimeMapTrigger((prevState: any) => ({
            ...prevState,
            [selectedClassId]: result?.data?.rows,
          }));
        }

        setClasses(prevState =>
          prevState?.map(_class => {
            if (_class?.id === selectedClassId) {
              return {
                ..._class,
                expandUserClassTimeMap: true,
              };
            }

            return _class;
          })
        );
      } else {
        if (fetchUserClassTimeMap[selectedClassId]?.length) {
          const tempValue = { ...fetchUserClassTimeMap };

          tempValue[selectedClassId] && delete tempValue[selectedClassId];

          setFetchUserClassTimeMapTrigger({ ...tempValue });
        }

        setClasses(prevState =>
          prevState?.map(_class => {
            if (_class?.id === selectedClassId) {
              return {
                ..._class,
                expandUserClassTimeMap: false,
              };
            }

            return _class;
          })
        );
      }
    } catch (e) {
      console.log(e);
      setPopUpContent('Please Reverify your credential');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError(false);
      }, 10000);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={styles.activityIndicator} animating={isLoading} />}

      {classes.length ? (
        <FlatList
          data={classes}
          renderItem={({ item, index }) => {
            return (
              <View key={index}>
                <View style={styles.card}>
                  <View style={styles.infoSection}>
                    <Pressable onPress={event => fetchClassUserDateTimeMapHandler(event, +item.id, item?.expandUserClassTimeMap)}>
                      <View style={styles.avatar}>
                        <Text>{item.id}</Text>
                      </View>
                    </Pressable>

                    <View style={styles.classInfo}>
                      <Text>{item.name}</Text>
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
                        setClassId(() => item.id);
                        setAddTriggerTimeModel(false);
                        setModalClassTriggerDateVisible(false);
                        setModalClassLocationsVisible(false);
                      }}>
                      <MaterialIcons name={'view-headline'} color={'black'} size={20} />
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        setClassName(item.name);
                        setClassId(() => item.id);
                        setAddTriggerTimeModel(!addTriggerTimeModel);
                        setModalVisible(false);
                        setModalClassTriggerDateVisible(false);
                        setModalClassLocationsVisible(false);
                      }}>
                      <MaterialIcons
                        // name={'access-time'}
                        name={'calendar-month'}
                        color={'black'}
                        size={20}
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        setClassId(() => item.id);
                        setClassName(() => item.name);
                        setAddTriggerTimeModel(false);
                        setModalVisible(false);
                        setModalClassTriggerDateVisible(!modalClassTriggerDateVisible);
                        setModalClassLocationsVisible(false);
                      }}>
                      <MaterialIcons name={'access-time'} color={'black'} size={20} />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setClassId(() => item.id);
                        setClassName(() => item.name);
                        setAddTriggerTimeModel(false);
                        setModalVisible(false);
                        setModalClassTriggerDateVisible(false);
                        setModalClassLocationsVisible(!modalClassLocationsVisible);
                      }}>
                      <FontAwesome name={'map-marker'} color={'black'} size={20} />
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        setClassId(() => item.id);
                        setClassName(() => item.name);
                        setAddTriggerTimeModel(false);
                        setModalVisible(false);
                        setModalClassTriggerDateVisible(false);
                        setModalClassLocationsVisible(false);
                        setModalClassUserMapVisible(!modalClassLocationsVisible);
                      }}>
                      <FontAwesome name={'user-plus'} color={'black'} size={20} />
                    </Pressable>
                  </View>
                </View>

                <View style={[styles.horizontalLine, !item?.expandUserClassTimeMap && { marginVertical: 10 }]} />

                {item?.expandUserClassTimeMap && (
                  <>
                    <View style={{ backgroundColor: '#eaeaea' }}>
                      {fetchUserClassTimeMap[item.id]?.length ? (
                        <>
                          {fetchUserClassTimeMap[item.id]?.map((userClassTimeMapData: any) => (
                            <View key={userClassTimeMapData?.userClassMapId}>
                              <View style={{ flexDirection: 'row' }}>
                                <Text>FullName: </Text>
                                <Text>
                                  {getFullName({
                                    firstName: userClassTimeMapData?.user?.firstName,
                                    lastName: userClassTimeMapData?.user?.lastName,
                                    middleName: userClassTimeMapData?.user?.middleName,
                                  })}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row' }}>
                                <Text>Email: </Text>
                                <Text>{userClassTimeMapData?.user?.email}</Text>
                              </View>

                              <View style={{ flexDirection: 'row' }}>
                                <Text>Class DateTime: </Text>
                                <Text>{getFormatDate(userClassTimeMapData?.classTriggerDate?.triggerDate)}</Text>
                              </View>
                            </View>
                          ))}
                        </>
                      ) : (
                        <Text> No Data </Text>
                      )}
                    </View>
                    <View style={[styles.horizontalLine, item?.expandUserClassTimeMap && { marginVertical: 10 }]} />
                  </>
                )}
              </View>
            );
          }}
          keyExtractor={item => item.id}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.8}
          ListFooterComponent={<ActivityIndicator size={'large'} animating={nextPageLoading} />}
        />
      ) : (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Empty classes</Text>
        </View>
      )}

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
              <Text style={{ marginLeft: 20 }}>Class Detail</Text>
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

            <ClassSpecificFetchScreen
              classId={classId}
              classes={classes}
              dispatchClasses={setClasses}
              dispatchModelVisible={() => setModalVisible(false)}
              accessToken={props?.authUser?.accessToken ?? ''}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalClassTriggerDateVisible}
        onRequestClose={() => {
          setModalClassTriggerDateVisible(!modalClassTriggerDateVisible);
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
              <Text style={{ marginLeft: 20 }}>Add Class Trigger Date and time</Text>
              <Pressable onPress={() => setModalClassTriggerDateVisible(!modalClassTriggerDateVisible)}>
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

            {/* <DropDownPicker
              open={classTriggerTimeOpenModal}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={'Choose a fruit.'}
            /> */}

            <CustomTextInputComponent
              placeholder={'Trigger Date'}
              keyboardType="default"
              autoComplete={''}
              autoFocus={false}
              inputMode={'text'}
              secureTextEntry={false}
              value={classTriggerDate}
              dispatch={text => setClassTriggerDate(text)}
            />

            <CustomTextInputComponent
              placeholder={'Trigger Time'}
              keyboardType="default"
              autoComplete={''}
              autoFocus={false}
              inputMode={'text'}
              secureTextEntry={false}
              value={classTriggerTime}
              dispatch={text => setClassTriggerTime(text)}
            />

            <CustomTouchableOpacityComponent isDisable={false} textMessage={'Save'} onSubmitHandler={saveClassTriggerDateTimeHandler} isLoading={isLoading} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={addTriggerTimeModel}
        onRequestClose={() => {
          setAddTriggerTimeModel(!addTriggerTimeModel);
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
              <Text style={{ marginLeft: 20 }}>Class Trigger Date & Time</Text>
              <Pressable onPress={() => setAddTriggerTimeModel(!addTriggerTimeModel)}>
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
            <ClassTriggerScreen
              classId={classId}
              accessToken={props?.authUser?.accessToken ?? ''}
              dispatchModelVisible={setAddTriggerTimeModel}
              className={className}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalClassLocationsVisible}
        onRequestClose={() => {
          setModalClassLocationsVisible(!modalClassLocationsVisible);
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
              <Text style={{ marginLeft: 20 }}>Add Class Location</Text>
              <Pressable onPress={() => setModalClassLocationsVisible(!modalClassLocationsVisible)}>
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
            <CustomTextInputComponent
              placeholder={'Longitude'}
              keyboardType="numeric"
              autoComplete={'numeric'}
              autoFocus={false}
              inputMode={'numeric'}
              secureTextEntry={false}
              value={longitude}
              dispatch={text => setLongitude(text)}
            />

            <CustomTextInputComponent
              placeholder={'Latitude'}
              keyboardType="numeric"
              autoComplete={'numeric'}
              autoFocus={false}
              inputMode={'numeric'}
              secureTextEntry={false}
              value={latitude}
              dispatch={text => setLatitude(text)}
            />

            <CustomTouchableOpacityComponent isDisable={false} textMessage={'Save'} onSubmitHandler={classLocationSaveHandler} isLoading={isLoading} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalClassUserMapVisible}
        onRequestClose={() => {
          setModalClassUserMapVisible(!modalClassUserMapVisible);
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
              <Text style={{ marginLeft: 20 }}>Add user to class</Text>
              <Pressable
                onPress={() => {
                  setModalClassUserMapVisible(!modalClassUserMapVisible);
                  setValueClassToTrigger(null);
                  setValueUserToClass(null);
                }}>
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

            <View>
              <DropDownPicker
                style={[
                  {
                    borderColor: '#cbcbcc',
                    borderWidth: 2,
                    borderRadius: 5,
                    width: 300,
                    marginTop: 20,
                    marginBottom: 10,
                    paddingLeft: 10,
                  },
                  openUserToClass && { zIndex: 999 },
                ]}
                open={openUserToClass}
                value={valueUserToClass}
                items={users}
                setOpen={setOpenUserToClass}
                setValue={setValueUserToClass}
                setItems={setUsers}
                placeholder={'Choose a user'}
              />

              <DropDownPicker
                style={[
                  {
                    borderColor: '#cbcbcc',
                    borderWidth: 2,
                    borderRadius: 5,
                    width: 300,
                    marginTop: 20,
                    marginBottom: 10,
                    paddingLeft: 10,
                  },
                  { zIndex: 1999 },
                ]}
                open={openClassToTrigger}
                value={valueClassToTrigger}
                items={classTriggerTimes}
                setOpen={setOpenClassToTrigger}
                setValue={setValueClassToTrigger}
                setItems={setClassTriggerTimes}
                placeholder={'Choose a class Trigger Time'}
              />
            </View>

            {/* <CustomTextInputComponent
              placeholder={'User Id'}
              keyboardType="numeric"
              autoComplete={'numeric'}
              autoFocus={false}
              inputMode={'numeric'}
              secureTextEntry={false}
              value={userId}
              dispatch={text => setUserId(text)}
            /> */}

            {/* <CustomTextInputComponent
              placeholder={'Class DateTime Id'}
              keyboardType="numeric"
              autoComplete={'numeric'}
              autoFocus={false}
              inputMode={'numeric'}
              secureTextEntry={false}
              value={classTriggerId}
              dispatch={text => setClassTriggerId(text)}
            /> */}

            <CustomTouchableOpacityComponent isDisable={false} textMessage={'Save'} onSubmitHandler={saveClassUserMapHandler} isLoading={isLoading} />
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

            <ClassAddScreen
              classes={classes}
              dispatchClasses={setClasses}
              dispatchModelVisible={() => setAddModalVisible(false)}
              accessToken={props?.authUser?.accessToken ?? ''}
            />
          </View>
        </View>
      </Modal>

      <PopupWithCloseIcon isVisible={isPopupVisible} onClose={togglePopup} content={popUpContent} isError={popUpMode} />
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
  classInfo: {
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
    // marginVertical: 10,
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
