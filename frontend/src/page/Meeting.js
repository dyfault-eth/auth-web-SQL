import { Box, Button, ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { AllMeeting } from "../components/AllMeetings";
import { UserMeeting } from "../components/UserMeeting";


export const Meeting = () => {
    const [component, setComponent] = useState('all-meeting');

    return (
        <ChakraProvider>
            {component === 'my-meeting' ? 
            <Box flexDirection="column" flex='1'>
                <Button onClick={() => setComponent('all-meeting')}>Voir mes Rendez-vous</Button>

                <Box>
                    <AllMeeting />
                </Box>
            </Box>
             : 
            <Box flexDirection="column" flex='1'>
                <Button onClick={() => setComponent('my-meeting')}>Voir tout les Rendez-vous</Button>

                <Box>
                    <UserMeeting />
                </Box>
            </Box>}
        </ChakraProvider>
    )
}