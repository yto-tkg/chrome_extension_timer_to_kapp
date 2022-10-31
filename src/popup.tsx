import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  const [startTime, setStartTime] = useState<string>()
  const [diffMinute, setDiffMinute] = useState(0)

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  const timerStart = () => {
    chrome.runtime.sendMessage({ time: new Date() }, function(res) {
      setStartTime(res.time)
    })
  }

  const timerStop = () => {
    chrome.storage.local.get(["time"], function(value) {
      alert(value.time)
      const startTime = new Date(value.time)
      const diff = startTime.getTime() - new Date().getTime()
      const diffMin = Math.abs(diff) / (60 * 1000)

      alert(startTime)
      alert(diff)
      alert(diffMin)

      setDiffMinute(Math.floor(diffMin))
    })
  }

  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
        <li>Start Time: {startTime}</li>
        <li>Diff Minute: {diffMinute}</li>
      </ul>
      <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "5px" }}
      >
        count up
      </button>
      <button onClick={changeBackground}>change background</button>
      <button onClick={timerStart}>start</button>
      <button onClick={timerStop}>stop</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
