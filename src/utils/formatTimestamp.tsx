import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

const formatTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) {
    return;
  }
  if (
    dayjs(timestamp.toDate().toLocaleDateString()).isSame(new Date().toLocaleDateString())
  ) {
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
