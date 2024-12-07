import React, { useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const Videocall = () => {
  const containerRef = useRef();

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    async function startCall() {
        await client.join('7c70f94de2964203a8ffc3bc67a8e21b', 'OnTheRunClinic', '007eJxTYNCwff2r+vSH0vQl3lZ3dn20r04SKJtV+ULp9nKJyQ5Mog8VGMyTzQ3SLE1SUo0szUyMDIwTLdLSko2Tks3MEy1SjQyTON9mpjYEMjL0rXZiZGSAQBCfj8E/LyQjNag0zzknMy8zmYEBAOrVI8M=');      const localTrack = await AgoraRTC.createCameraVideoTrack();
      await client.publish([localTrack]);

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log('subscribe success');
        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          const playerContainer = document.createElement('div');
          playerContainer.id = user.uid.toString();
          playerContainer.style.width = '320px';
          playerContainer.style.height = '240px';
          containerRef.current.appendChild(playerContainer);
          remoteVideoTrack.play(playerContainer.id);
        }
      });

      return () => {
        localTrack.close();
        client.leave();
      };
    }

    startCall();
  }, []);

  return <div ref={containerRef}></div>;
};

export default Videocall;