import useSWR from "swr";
import axios from "axios";
import { LOANDISK_BASE_URL, LOANDISK_AUTH_CODE } from "../utils/constants";

const fetcher = async (url: string) => {
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOANDISK_AUTH_CODE}`,
    },
  });
  return response.data;
};

const useFetch = (endpoint: string, params?: Record<string, string | number>) => {
  const url = new URL(`${LOANDISK_BASE_URL}/${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));
  }

  const { data, error } = useSWR(url.toString(), fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetch;
