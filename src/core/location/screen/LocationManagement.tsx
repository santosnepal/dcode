import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface.ts';
import MapScreen from './Map.tsx';

interface ILocationManagementProps {
  navigation: any;
  authUser?: IAuthUserWithToken | null;
}

export default function LocationManagementScreen(props: ILocationManagementProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <View style={styles.container}>
      <MapScreen authUser={props?.authUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});
