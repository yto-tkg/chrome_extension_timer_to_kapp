import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import putRecord, { PutRecordParams } from "./record";
import { postRecordsCursor, getRecordsCursor } from "./records-cursor";
import { GetRecordsCursorResp, PostRecordsCursorResp } from "./types/data";

const Popup = () => {
  const [count, setCount] = useState(0)
  const [currentURL, setCurrentURL] = useState<string>()

  const [startTime, setStartTime] = useState<string>()
  const [diffMinute, setDiffMinute] = useState(0)

  const [realTime, setRealTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  setInterval(() => {
    setRealTime(new Date().toLocaleTimeString())
  }, 1000)

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
    })
  }


  const updateTime = async () => {
    const appId = 70998
    const response = await postRecordsCursor(appId).then((res: PostRecordsCursorResp) => {
      return res
    }).then(async (res: PostRecordsCursorResp) => {
      return await getRecordsCursor(res.id)
    }).then((res: GetRecordsCursorResp) => {
      //alert(`recordId: ${res.recordId}`)
      //alert(`fieldId: ${res.fieldId}`)
      //alert(`minute: ${res.minute}`)
      //alert(`date: ${res.date}`)
      //alert(`fieldIds: ${res.fieldIds}`)
      //alert(typeof JSON.stringify(res.otherFields))
      //alert(`otherFields: ${JSON.stringify(res.otherFields)['otherFields' as keyof string]}`)
      const data = {
          app: appId,
          recordId: res.recordId,
          fieldId: res.fieldId,
          fieldName: "高木さん",
          minute: Number(res.minute) + Number(diffMinute),
          otherFields: res.otherFields,
      }
      return data
    }).then(async (data: PutRecordParams) => {
        return await putRecord(data).then((res: any) => {
          return res
        }) 
      })
  }

  return (
    <>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {realTime}</li>
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
      <button onClick={updateTime}>save</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
