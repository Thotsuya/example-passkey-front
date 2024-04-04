import {useState} from "react";
import Webpass from "@laragear/webpass"
import getCredentials from "../hooks/credentials.ts";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {login} from "../features/userSlice.ts";
import client from "../config/client.ts";

export default function App() {

    const [alias,setAlias] = useState('');
    const {data,loading,error,refetch} = getCredentials();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        const webpass = Webpass.create({
            baseURL: 'http://localhost:8000',
            retry: 3,
            retryDelay: 500,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "include",
        })

        const attestOptionsConfig = {
            path: "/webauthn/register/options",
            findCsrfToken: true,
        }

        const attestConfig = {
            path: "/webauthn/register",
            findCsrfToken: true,
            body: {
                alias: alias,
            }
        }

        if(!Webpass.isSupported()){
            alert("Webauthn is not supported in this browser");
            return;
        }

        const { data, success, error } = await webpass.attest(attestOptionsConfig, attestConfig)

        if(success) {
            alert("Passkey added successfully");
            await refetch();
        }
        else {
            alert(error);
        }

    }

    const onLogout = async () => {
        try {
            await client.post('/logout');
            dispatch(login(null));
            navigate('/login');
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="container mx-auto lg:py-12 lg:px-32">
            <h1 className="text-3xl font-bold text-center mt-8">
                Passkeys
            </h1>

            <div className="mt-8">
                <div className="flex justify-center">
                    <div className="w-1/2">
                        <div className="bg-gray-200 p-8 rounded-md">
                            <h2 className="text-2xl font-bold text-center">Add a new passkey</h2>
                            <form
                                onSubmit={onSubmit}
                                className="mt-8 space-y-6" method="POST">
                                <input type="hidden" name="remember" value="true"/>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <label htmlFor="name" className="sr-only">Alias</label>
                                        <input
                                            id="alias"
                                            name="alias"
                                            type="text"
                                            autoComplete="alias"
                                            required
                                            className="appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Alias"
                                            value={alias}
                                            onChange={(e) => setAlias(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Add passkey
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex justify-center">
                    <div className="w-1/2">
                        <div className="bg-gray-200 p-8 rounded-md">
                            <h2 className="text-2xl font-bold text-center mb-2">Passkeys</h2>

                            {data && data.length > 0 && (
                                <div className={"flex justify-between bg-green-500 p-2 rounded-md text-white mb-2"}>
                                    You have {data.length} passkeys, try logging in without a password
                                </div>
                            )}

                            {loading && <p>Loading...</p>}
                            {error && <p>Error: {error.message}</p>}
                            {data && (
                                <ul>
                                    {data.map((credential) => (
                                        <li key={credential.id} className="flex justify-between bg-gray-100 p-2 rounded-md">
                                            <p>{credential.id}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={onLogout}
                    className="group relative w-full lg:w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Logout
                </button>
            </div>
        </div>
    );
}