import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';

const agendaItems = [
  { title: '2025-03-27', data: [{ id: '1', time: '10:00 AM', event: 'Meeting with Client' }] },
  { title: '2025-03-28', data: [{ id: '2', time: '02:00 PM', event: 'Code Review' }] },
  { title: '2025-03-29', data: [{ id: '3', time: '04:00 PM', event: 'Team Standup' }] },
  { title: '2025-03-30', data: [{ id: '4', time: '04:00 PM', event: 'Team Standup' }] },
  { title: '2025-03-31', data: [{ id: '5', time: '05:00 PM', event: 'Team Standup 2' }] },
  { title: '2025-04-01', data: [{ id: '6', time: '06:00 PM', event: 'Team Standup 3' }] },
  { title: '2025-04-02', data: [{ id: '7', time: '07:00 PM', event: 'Team Standup 4' }] },
  { title: '2025-01-03', data: [{ id: '8', time: '08:00 PM', event: 'Team Standup 5' }] },
  { title: '2025-01-04', data: [{ id: '9', time: '09:00 PM', event: 'Team Standup 6' }] },
  { title: '2025-01-05', data: [{ id: '10', time: '10:00 PM', event: 'Team Standup 7' }] },
  { title: '2025-01-06', data: [{ id: '11', time: '11:00 PM', event: 'Team Standup 8' }] },
  { title: '2025-01-07', data: [{ id: '12', time: '12:00 PM', event: 'Team Standup 9' }] },
  { title: '2025-01-08', data: [{ id: '13', time: '01:00 PM', event: 'Team Standup 10' }] },
  { title: '2025-01-09', data: [{ id: '14', time: '02:00 PM', event: 'Team Standup 11' }] },
  
];

const markedDates = {
  '2025-03-27': { marked: true, dotColor: 'blue' },
  '2025-03-28': { marked: true, dotColor: 'green' },
  '2025-03-29': { marked: true, dotColor: 'red' }
};

const ExpandableCalendarScreen = ({ weekView = false }) => {
  const renderItem = useCallback(({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.event}>{item.event}</Text>
    </View>
  ), []);

  return (
    <CalendarProvider date={agendaItems[0].title} showTodayButton>
      {weekView ? (
        <WeekCalendar firstDay={1} markedDates={markedDates} />
      ) : (
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
        />
      )}
      <AgendaList
        sections={agendaItems}
        renderItem={renderItem}
        sectionStyle={styles.section}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  time: {
    fontSize: 14,
    color: 'gray',
  },
  event: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#f5f5f5',
    color: 'grey',
    padding: 10,
    textTransform: 'capitalize',
  },
});
