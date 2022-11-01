import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { postRecordsCursor, getRecordsCursor } from "./records-cursor";
import { GetRecordsCursorResp, PostRecordsCursorResp } from "./types/data";

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
    const time = new Date()
    chrome.runtime.sendMessage({ time: time }, function(res) {
      setStartTime(time.toLocaleTimeString())
    })
  }

  const timerStop = () => {
    chrome.storage.local.get(["time"], function(value) {
      const startTime = new Date(value.time)
      const diff = startTime.getTime() - new Date().getTime()
      const diffMin = Math.abs(diff) / (60 * 1000)

      setDiffMinute(Math.floor(diffMin))
      updateTime()
    })
  }

  const updateTime = async () => {
    const response = await postRecordsCursor(70998).then((res: PostRecordsCursorResp) => {
      return res
    }).then(async (res: PostRecordsCursorResp) => {
      return await getRecordsCursor(res.id)
    }).then((res: GetRecordsCursorResp) => {
      //alert(`recordId: ${res.recordId}`)
      //alert(`fieldId: ${res.fieldId}`)
      alert(`minute: ${res.minute}`)
      alert(`date: ${res.date}`)
      alert(`fieldIds: ${res.fieldIds}`)
      return res
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
