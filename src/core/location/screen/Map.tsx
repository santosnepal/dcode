import axios from 'axios';
import { locationRoute } from '../api-route';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomTextInputComponent from '../../auth/component/TextInput';
import CustomTouchableOpacityComponent from '../../auth/component/Button';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface';
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureResponderEvent, Modal, Pressable, StyleSheet, Text, View } from 'react-native'; // remove PROVIDER_GOOGLE import if not using Google Maps

interface ICoordinate {
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
  const [error, setError] = useState<string | null | boolean>(null);

  const [coordinates, setCoordinates] = useState<ICoordinate[]>([]);
  const [selectedReferenceId, setSelectedReference] = useState<string>('');

  //initialize location call
  useEffect(() => {
    fetchAllLocations();
    return () => {
      setCoordinates([]);
    };
  }, []);

  const fetchAllLocations = async () => {
    try {
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
          latitude: +location.source.latitude,
          longitude: +location.source.longitude,
          reference: { ...location.reference },
        }))
      );
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
            referenceId: +selectedReferenceId,
            moduleName,
          },
          headers: {
            Authorization: 'Bearer ' + props?.authUser?.accessToken,
          },
        })
      ).data?.data;

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
      setPopUpContent('Please Reverify your credential');
      setPopUpMode(true);
      togglePopup();
    } finally {
      setLatitude('');
      setMapModel(false);
      setModuleName('');
      setLongitude('');
      setIsLoading(false);
      setSelectedReference('');
      setTimeout(() => {
        setError(false);
      }, 10000);
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
              <Pressable onPress={() => setMapModel(!mapModel)}>
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
              placeholder={'Module Reference'}
              keyboardType="default"
              autoFocus={false}
              inputMode={'none'}
              secureTextEntry={false}
              value={selectedReferenceId}
              dispatch={text => setSelectedReference(text)}
            />

            <CustomTextInputComponent
              placeholder={'Module Name'}
              keyboardType="default"
              autoFocus={false}
              inputMode={'none'}
              secureTextEntry={false}
              value={moduleName}
              dispatch={text => setModuleName(text)}
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
