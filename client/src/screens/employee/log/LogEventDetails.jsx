import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { locationDetailQuery } from '../../../apollo/server/QueryTags';
import { format, addMinutes } from 'date-fns';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import Map from '../../../components/Map';

const LogEventDetails = ({ route, navigation }) => {
  const { locationId, formattedDate } = route.params;

  const { error, loading, data } = useQuery(locationDetailQuery, { variables: { locationId: locationId } });

  if (loading === true) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  let map;
  let time;
  let formattedType;
  const location = {
    latitude: parseFloat(data.locationDetail.latitude),
    longitude: parseFloat(data.locationDetail.longitude),
  }

  map = (<Map employeeLocation={location} />);

  const dateObject = new Date(parseInt(data.locationDetail.timestamp));
  time = format(dateObject, 'h:mm a');

  if (data.locationDetail.type === 'CLOCK_IN') {
    formattedType = 'Clocked In';
  } else if (data.locationDetail.type === 'LUNCH_START') {
    formattedType = 'Started Lunch';
  } else if (data.locationDetail.type === 'LUNCH_END') {
    formattedType = 'Ended Lunch';
  } else {
    formattedType = 'Clocked Out';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Time Sheet for:</Text>
      <Text style={styles.subHeader}>{formattedDate}</Text>
      <Text>You {formattedType} at {time}</Text>
      {map}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2c9c5',
  },
  header: {
    fontSize: 30,
    color: '#c0392b',
    fontWeight: '100',
    marginVertical: 15,
  },
  subHeader: {
    fontSize: 30,
    color: '#c0392b',
    fontWeight: '100',
    marginBottom: 5,
  },
  listTitle: {
    color: 'white',
    fontWeight: '100',
    fontSize: 20,
  },
  listItem: {
    backgroundColor: '#c0392b',
    borderBottomColor: 'white',
    borderBottomWidth: .5,
    borderStyle: 'solid',
  },
});

export default LogEventDetails;