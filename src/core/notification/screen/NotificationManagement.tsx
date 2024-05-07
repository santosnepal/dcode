import { View, StyleSheet, ActivityIndicator, Text, GestureResponderEvent, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IAuthUserWithToken } from '../../../shared/interface/auth-user.interface';
import axios from 'axios';
import { notificationRoutes } from '../api-route';
import { getFormatDate } from '../../../shared/utils/date-format';

interface INotificationManagementProps {
  navigation: any;
  authUser?: IAuthUserWithToken | null;
}

export default function NotificationManagementScreen(props: INotificationManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const [limit, setLimit] = useState(20);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationId, setNotificationId] = useState('');
  const [error, setError] = useState<string | null | boolean>(null);

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
      findAllClasses(offSet, limit)
        .then(data => {
          data?.data?.rows?.length && setNotifications(prevState => [...prevState, ...data?.data?.rows]);
        })
        .catch(error => console.log(error));
    }

    return () => {
      setNotifications([]);
    };
  }, []);

  const findAllClasses = async (offset: number, _limit: number) => {
    try {
      setIsLoading(true);
      const response = await axios({
        url: notificationRoutes.getAllNotification.route(offset, _limit),
        method: notificationRoutes.getAllNotification.method,
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
        setNotifications(prevState => [...prevState, ...(response?.data?.rows?.length && response?.data?.rows)]);
        setOffSet(changeOffset);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setNextPageLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={styles.activityIndicator} animating={isLoading} />}

      {notifications.length ? (
        <FlatList
          data={notifications}
          renderItem={({ item, index }) => {
            return (
              <View key={index}>
                <View style={styles.card}>
                  <View style={styles.infoSection}>
                    <Pressable>
                      <View style={styles.avatar}>
                        <Text>{item.id}</Text>
                      </View>
                    </Pressable>

                    <View style={styles.classInfo}>
                      <Text>{item.note}</Text>
                      <Text>{item.assigner.email}</Text>
                      <Text>{item.projectmodule}</Text>
                      <Text>
                        {getFormatDate(item.updated.at)}
                        <Text style={styles.chipLabel}>(Last Updated)</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.horizontalLine} />
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
          <Text>Empty notifications</Text>
        </View>
      )}
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
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.47)',
    marginVertical: 10,
  },
  chipLabel: {
    color: '#333',
    fontSize: 11,
  },
});
