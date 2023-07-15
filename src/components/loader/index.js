import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Center } from '@chakra-ui/react';

const Loading = () => {
    return (
        <Center>
            <Player
                src='https://assets5.lottiefiles.com/packages/lf20_usmfx6bp.json'
                className="player"
                loop
                autoplay
                style={{ height: '400px', width: '400px' }}
            />
        </Center>
    );
};

export default Loading;