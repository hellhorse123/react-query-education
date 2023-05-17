import axios from "axios";
import { useQuery } from "react-query";

const fetchUserByEmail = (email) => {
  return axios.get(`http://localhost:4000/users/${email}`);
};

const fetchCoursesByChannelId = (channelId) => {
  return axios.get(`http://localhost:4000/channels/${channelId}`);
};

export const DependentQueriesPage = ({ email }) => {
  const { data: user } = useQuery(["user", email], () =>
    fetchUserByEmail(email)
  );
  const channelId = user?.data.channelId;

  const { data: channel } = useQuery(
    ["courses", channelId],
    () => fetchCoursesByChannelId(channelId),
    {
      enabled: !!channelId, // !! - преобразование значения в буллево
    }
  );
  return (
    <div>
      <div>{channelId}</div>
      <div>{channel?.data.courses}</div>
    </div>
  );
};
