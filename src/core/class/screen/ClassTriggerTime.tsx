import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import {classRoutes} from '../api-route';
import {getFormatDate} from '../../../shared/utils/date-format.ts';

interface IClassTriggerScreen {
  classId: string;
  accessToken: string;
  dispatchModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}

export default function ClassTriggerScreen(props: IClassTriggerScreen) {
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [classesWithTriggerTime, setClassesWithTriggerTime] = useState<any[]>(
    [],
  );

  useEffect(() => {
    setIsClassLoading(true);
    if (props?.classId) {
      axios({
        url: classRoutes.findClassTriggerTime.route(+props?.classId),
        method: classRoutes.findClassTriggerTime.method,
        headers: {
          Authorization: 'Bearer ' + props?.accessToken,
        },
      })
        .then(({data}) => {
          setClassesWithTriggerTime(prevState => {
            return [...prevState, ...data?.data?.rows];
          });
        })

        .catch(e => console.log(e))
        .finally(() => setIsClassLoading(false));
    }

    return () => {
      setClassesWithTriggerTime([]);
    };
  }, [props?.accessToken, props?.classId]);

  if (isClassLoading) {
    return <ActivityIndicator animating={isClassLoading} size={'large'} />;
  }

  return (
    <ScrollView style={{width: '100%'}}>
      <View style={styles.profileTextView}>
        <Text style={styles.profileTextLabel}>{props.className}</Text>
      </View>
      {!classesWithTriggerTime.length && (
        <View style={{alignItems: 'center', marginVertical: 10 }}>
          <Text>This Class has no trigger date and time</Text>
        </View>
      )}
      {classesWithTriggerTime?.map((classTriggerTime: any, index: number) => {
        return (
          <View key={index} style={styles.classTriggerView}>
            <Text style={styles.classTriggerId}>{index + 1}</Text>
            <Text>{getFormatDate(classTriggerTime.classTriggerDateTime)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileTextView: {alignItems: 'center', justifyContent: 'center'},
  profileTextLabel: {
    fontSize: 18,
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  classTriggerView: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
  },
  classTriggerId: {
    marginRight: 10,
  },
});
