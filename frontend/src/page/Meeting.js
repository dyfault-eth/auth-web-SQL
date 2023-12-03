import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChakraProvider, Box, Button } from '@chakra-ui/react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export const Meeting = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // Charger les rendez-vous existants lors du montage du composant
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:5000/api/get-all-meeting', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings);
      } else {
        console.error('Erreur lors de la récupération des rendez-vous.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API :', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleScheduleAppointment = async () => {
    if (selectedDate) {
        try {
            const storedToken = localStorage.getItem('authToken');

            const existingMeeting = meetings.find(
                (meeting) => moment(meeting.meeting_date).isSame(selectedDate)
            );

            if (existingMeeting) {
                console.log('Il existe déjà un rendez-vous à cette heure.');
                return;
            }

            const response = await fetch('http://127.0.0.1:5000/api/add-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${storedToken}`,
                },
                body: JSON.stringify({ date: selectedDate }),
            });

            if (response.ok) {
                console.log('Rendez-vous programmé avec succès pour le :', selectedDate);
                
                fetchMeetings();
            } else {
                console.error('Erreur lors de la programmation du rendez-vous.');
            }
        } catch (error) {
            console.error('Erreur lors de la requête API :', error);
        }
    } else {
        console.log('Veuillez sélectionner une date pour le rendez-vous.');
    }
};

  return (
    <ChakraProvider>
      <Box p={4}>
        <Box zIndex="1">
            <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="Pp"
            placeholderText="Sélectionnez un rendez-vous"
            minTime={new Date().setHours(8, 0, 0)}
            maxTime={new Date().setHours(17, 0, 0)}
            />
            <Button colorScheme="teal" mt={4} onClick={handleScheduleAppointment}>
            Planifier le rendez-vous
            </Button>
        </Box>

        <h2>Rendez-vous existants :</h2>
        <Calendar
          localizer={localizer}
          events={meetings.map((meeting) => ({
            title: 'Rendez-vous',
            start: moment(meeting.start_time).toDate(),
            end: moment(meeting.end_time).toDate(),
          }))}
          views={['week']}
            defaultView={'week'}

          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          min={new Date('2023-01-01T08:00:00')}
          max={new Date('2023-01-01T18:00:00')}
        />
      </Box>
    </ChakraProvider>
  );
};
