import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

const formatTimestamp = (timestamp: Timestamp | Date) => {
  if (!timestamp) {
    return;
  }

  if (timestamp instanceof Date) {
    if (timestamp.toLocaleDateString() === dayjs().toDate().toLocaleDateString()) {
      return <span>{dayjs(timestamp).format("HH:mm")}</span>;
    } else {
      return (
        <>
          <span>{dayjs(timestamp).format("HH:mm")}</span>
          <span>{dayjs(timestamp).format("MMM D")}</span>
        </>
      );
    }
  }

  if (timestamp.toDate().toLocaleDateString() === dayjs().toDate().toLocaleDateString()) {
    return <span>{dayjs(timestamp.toDate()).format("HH:mm")}</span>;
  } else {
    return (
      <>
        <span>{dayjs(timestamp.toDate()).format("HH:mm")}</span>
        <span>{dayjs(timestamp.toDate()).format("MMM D")}</span>
      </>
    );
  }
};

export default formatTimestamp;
