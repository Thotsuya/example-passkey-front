import client from "../config/client.ts";
import {useQuery} from "@tanstack/react-query";

const fetchCredentials = async () => {
    const {data} = await client.get("/api/credentials");
    return data;
}

const getCredentials = () => useQuery({
    queryKey: ['credentials'],
    queryFn: fetchCredentials,
});


export default getCredentials;