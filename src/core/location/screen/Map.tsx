import axios from 'axios';
import { locationRoute } from '../api-route';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomTextInputComponent from '../../auth/component/TextInput';
import CustomTouchableOpacityComponent from '../../auth/component/Button';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface';
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureResponderEvent, Modal, PermissionsAndroid, Pressable, StyleSheet, Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import PopupWithCloseIcon from '../../../shared/interface/Modal';
import MapViewDirections from 'react-native-maps-directions';
import { classRoutes } from '../../class/api-route';
import { ProjectModule } from '../../../shared/enums/api-method';
import { userRoutes } from '../../user/api-route';
import { getFullName } from '../../../shared/utils/string';
import DropDownPicker from 'react-native-dropdown-picker';

interface ICoordinate {
  id: number;
  latitude: number;
  longitude: number;
  reference: {
    moduleName: string;
    referenceId: number;
  };
}

interface IMapManagementProps {
  authUser?: IAuthUserWithToken | null;
}

export default function MapScreen(props: IMapManagementProps) {
  const [mapModel, setMapModel] = useState(false);
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [moduleName, setModuleName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popUpContent, setPopUpContent] = useState('');
  const [popUpMode, setPopUpMode] = useState(false);
  const [coordinates, setCoordinates] = useState<ICoordinate[]>([]);
  const [selectedReferenceId, setSelectedReference] = useState<string>('');
  const [mLat, setMLat] = useState(0); //latitude position
  const [mLong, setMLong] = useState(0);
  const [error, setError] = useState(false);
  const [openModuleName, setOpenModuleName] = useState(false);
  const [valueModuleName, setValueModuleName] = useState(null);
  const [moduleNames, setModuleNames] = useState([
    { label: 'User', value: 'user' },
    { label: 'Class', value: 'class' },
  ]);

  const [openModuleReference, setOpenModuleReference] = useState<any>(null);
  const [valueModuleReference, setValueModuleReference] = useState<any>(null);
  const [valueModuleItems, setValueModuleItems] = useState<any[]>([]);

  const [closetDistances, setClosetDistances] = useState<any[]>([]);

  //initialize location call

  useEffect(() => {
    fetchAllLocations();
    requestLocationPermission();
    return () => {
      setCoordinates([]);
      setClosetDistances([]);
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Danys Location Permission',
        message: 'Danys App needs access to your location ' + 'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getLocation();
      } else {
        setPopUpContent('Location Permission Denied');
        setPopUpMode(true);
        togglePopup();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const tempClosetDistances: any[] = [];
        // console.log('position===> ', position);
        // console.log('coordinates===> ', coordinates);
        // console.log('closetDistances===> ', closetDistances);

        for (let idx = 0; idx < coordinates.length; idx++) {
          const element = coordinates[idx];
          // console.log({
          //   userGeoLocation: {
          //     lat: position.coords.latitude,
          //     long: position.coords.longitude,
          //   },
          //   classId: element?.reference?.referenceId,
          // });

          const result = (
            await axios({
              headers: {
                Authorization: 'Bearer ' + props?.authUser?.accessToken,
              },
              method: locationRoute.calculateDistance.method,
              url: locationRoute.calculateDistance.route,
              data: {
                userGeoLocation: {
                  // lat: 52.469,
                  lat: position.coords.latitude,
                  // long: -3.39,
                  long: position.coords.longitude,
                },
                classId: element?.reference?.referenceId,
              },
            })
          ).data?.data;

          // console.log('result===> ', result);

          if (result <= 500) {
            tempClosetDistances.push(element);
          }
        }

        setClosetDistances(tempClosetDistances);

        // setMLat(52.469);
        // setMLong(-3.39);
        // console.log(position);
        setMLat(position.coords.latitude);
        setMLong(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        setPopUpContent('Error in getting location make sure you provided permission and have proper internet and gps access');
        setPopUpMode(true);
        togglePopup();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  useEffect(() => {
    if (props?.authUser) {
      if (valueModuleName === ProjectModule.CLASS) {
        findAllClasses(0, 999)
          .then(data => {
            if (data?.data?.rows?.length) {
              setValueModuleItems([...data?.data?.rows.map((x: any) => ({ label: x?.name, value: x?.id }))]);
            }
          })
          .catch(error => console.log(error));
      }

      if (valueModuleName === ProjectModule.USER) {
        findAllUsers(0, 999)
          .then(data => {
            if (data?.data?.rows?.length) {
              setValueModuleItems([
                ...data?.data?.rows.map((x: any) => ({
                  value: x.id,
                  label: getFullName({ firstName: x.firstName, lastName: x.lastName, middleName: x.middleName }),
                })),
              ]);
            }
          })
          .catch(error => console.log(error));
      }
    }
    return () => {
      setValueModuleItems([]);
    };
  }, [valueModuleName]);

  const fetchAllLocations = async () => {
    try {
      // const tempClosetDistances: any[] = [];
      setIsLoading(true);
      const result = (
        await axios({
          headers: {
            Authorization: 'Bearer ' + props?.authUser?.accessToken,
          },
          method: locationRoute.findAllLocations.method,
          url: locationRoute.findAllLocations.route,
        })
      ).data?.data?.rows;

      setCoordinates(
        result?.map((location: any) => ({
          id: location.id,
          longitude: Number(location.source.longitude),
          latitude: Number(location.source.latitude),
          reference: { ...location.reference },
        }))
      );

      // for (let idx = 0; idx < result.length; idx++) {
      //   const location = result[idx];

      //   if (idx < 2) {
      //     tempClosetDistances.push({
      //       id: location.id,
      //       longitude: Number(location.source.longitude),
      //       latitude: Number(location.source.latitude),
      //       reference: { ...location.reference },
      //     });
      //   }
      // }

      // setClosetDistances(tempClosetDistances);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerPress = () => {
    console.log('Marker Pressed!');
  };

  //handle coordinates location onPress event
  const handleMapPress = (event: MapPressEvent) => {
    event.preventDefault();

    setLatitude(event.nativeEvent.coordinate.latitude?.toString() ?? '');
    setLongitude(event.nativeEvent.coordinate.longitude?.toString() ?? '');

    setMapModel(true);
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  //handle save class location successfully.
  const classLocationSaveHandler = async (event: GestureResponderEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const result = (
        await axios({
          method: locationRoute.createLocation.method,
          url: locationRoute.createLocation.route,
          data: {
            source: {
              latitude: +latitude,
              longitude: +longitude,
            },
            referenceId: +valueModuleReference,
            moduleName: valueModuleName,
          },
          headers: {
            Authorization: 'Bearer ' + props?.authUser?.accessToken,
          },
        })
      ).data?.data;
      // console.log(result, 'location data from server');

      setCoordinates(prevState => {
        return [
          ...prevState,
          {
            latitude: latitude ? +latitude : 0,
            longitude: longitude ? +longitude : 0,
            id: result?.id,
            reference: { ...result?.reference },
          },
        ];
      });
    } catch (e) {
      console.log(e);
      // setPopUpContent('Please Reverify your credential');
      // setPopUpMode(true);
      // togglePopup();
    } finally {
      // setLatitude('');
      setMapModel(false);
      // setModuleName('');
      // setLongitude('');
      setIsLoading(false);
      setSelectedReference('');
      // setTimeout(() => {
      //   setError(false);
      // }, 10000);
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
      <MapView
        onPress={handleMapPress}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 52.469,
          longitude: -3.39,
          latitudeDelta: 10,
          longitudeDelta: 7,
        }}>
        {coordinates &&
          coordinates.map((value, index) => (
            <Marker
              key={index}
              pinColor={value?.reference?.moduleName === 'class' ? 'blue' : 'red'}
              coordinate={{ latitude: value?.latitude, longitude: value?.longitude }}
              onPress={handleMarkerPress}
            />
          ))}

        <Marker coordinate={{ latitude: mLat, longitude: mLong }} pinColor="red" onPress={handleMarkerPress} />

        {/* {closetDistances?.length &&
          closetDistances?.map((distance, index) => (
            <MapViewDirections
              key={distance?.id}
              origin={{ latitude: mLat, longitude: mLong }}
              destination={distance}
              apikey="AIzaSyDpypba9s21zQWU3LSbCiP8NPwxAftU22E"
              strokeWidth={3}
              strokeColor="blue"
            />
          ))} */}

        {/* <MapViewDirections
          origin={{ latitude: mLat, longitude: mLong }}
          destination={closetDistances[0]}
          apikey="AIzaSyDpypba9s21zQWU3LSbCiP8NPwxAftU22E"
          strokeWidth={3}
          strokeColor="blue"
        /> */}

        {/* <MapViewDirections
          origin={{ latitude: mLat, longitude: mLong }}
          destination={coordinates[0]}
          apikey="AIzaSyDpypba9s21zQWU3LSbCiP8NPwxAftU22E"
          strokeWidth={3}
          strokeColor="blue"
        /> */}
      </MapView>

      <Modal
        animationType={'slide'}
        transparent={true}
        visible={mapModel}
        onRequestClose={() => {
          setMapModel(!mapModel);
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
              <Pressable
                onPress={() => {
                  setMapModel(!mapModel);
                  setValueModuleName(null);
                  setOpenModuleName(false);
                  setValueModuleReference(null);
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
                open={openModuleName}
                value={valueModuleName}
                items={moduleNames}
                setOpen={setOpenModuleName}
                setValue={setValueModuleName}
                setItems={setModuleNames}
                placeholder={'Choose Module Name'}
                style={{
                  borderColor: '#cbcbcc',
                  borderWidth: 2,
                  borderRadius: 5,
                  width: 300,
                  marginTop: 20,
                  marginBottom: 10,
                  paddingLeft: 10,
                  zIndex: 10,
                }}
              />

              <DropDownPicker
                open={openModuleReference}
                value={valueModuleReference}
                items={valueModuleItems}
                setOpen={setOpenModuleReference}
                setValue={setValueModuleReference}
                setItems={setValueModuleItems}
                placeholder={'Choose Module Reference'}
                style={{
                  borderColor: '#cbcbcc',
                  borderWidth: 2,
                  borderRadius: 5,
                  width: 300,
                  marginTop: 20,
                  marginBottom: 10,
                  paddingLeft: 10,
                  zIndex: 10,
                }}
              />
            </View>

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
            <PopupWithCloseIcon isVisible={isPopupVisible} onClose={togglePopup} content={popUpContent} isError={popUpMode} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
});
