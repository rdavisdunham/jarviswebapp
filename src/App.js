import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import axios from 'axios';

const App = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorderKey, setMediaRecorderKey] = useState(Date.now());
  const [textOutput, setTextOutput] = useState('');

  const handleStop = (blobUrl, blob) => {
    setAudioBlob(blob);
    setMediaRecorderKey(Date.now()); // Reset the ReactMediaRecorder component
  };

  const handleUpload = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      try {
        await axios.post('http://192.168.1.189:3000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Audio uploaded successfully');
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }
  };

  const handleGetTextOutput = async () => {
    try {
      const response = await axios.get('http://192.168.1.189:3000/text-output');
      const textOutput = response.data;
      console.log('Text output from server:', textOutput);
      setTextOutput(textOutput); // Update the textOutput state with the received data
    } catch (error) {
      console.error('Error retrieving text output:', error);
    }
  };

  return (
    <div>
      <ReactMediaRecorder
        key={mediaRecorderKey} // Use a unique key to force remount
        audio
        onStop={handleStop}
        render={({ status, startRecording, stopRecording }) => (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
          </div>
        )}
      />
      <button onClick={handleUpload} disabled={!audioBlob}>
        Upload Audio
      </button>
      <button onClick={handleGetTextOutput}>Get Text Output</button>
      <textarea
        value={textOutput}
        readOnly
        rows={10}
        cols={50}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
};

export default App;