import {useFormik} from "formik";
import * as Yup from "yup";
import client from "../config/client.ts";
import {useNavigate} from "react-router-dom";
import {login} from "../features/userSlice.ts";
import {useDispatch} from "react-redux";
import Webpass from "@laragear/webpass";

export default function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validation = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required')
        }),
        onSubmit: async (values) => {
            try {
                await client.get('/sanctum/csrf-cookie');

                await client.post('/login', {
                    ...values,
                    device_id: 'stateful'
                });

                const user = await client.get('/api/me');

                dispatch(login(user.data.data));

                navigate('/');

            } catch (e) {
                console.log(e);
            }
        }
    })

    const assertWebauthn = async () => {

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

        const assertOptionsConfig = {
            path: "/webauthn/login/options",
            findCsrfToken: true,
        }

        const assertConfig = {
            path: "/webauthn/login",
            findCsrfToken: true,
        }

        if(!Webpass.isSupported()){
            alert("Webauthn is not supported in this browser");
            return;
        }

        const { data, success, error } = await webpass.assert(assertOptionsConfig, assertConfig)

        if(success) {
            const {data} = await client.get('/api/me');
            dispatch(login(data.data));
            navigate('/')
        }
        else {
            alert(error);
        }
    }

    return (
        <div className="container mx-auto lg:py-12 lg:px-32">
            <h1 className="text-3xl font-bold text-center mt-8">Login</h1>

            <form
                className="mt-8 space-y-6 bg-gray-200 p-8 rounded-md"
                onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                }}
                method="POST">
                <input type="hidden" name="remember" value="true"/>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            {...validation.getFieldProps('email')}
                        />

                        {validation.touched.email && validation.errors.email ? (
                            <div className="text-red-500 text-sm my-2">{validation.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            {...validation.getFieldProps('password')}
                        />
                    </div>

                    {validation.touched.password && validation.errors.password ? (
                        <div className="text-red-500 text-sm my-2">{validation.errors.password}</div>
                    ) : null}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember_me" name="remember_me" type="checkbox"
                               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                </div>

                <div>
                    <button type="submit"
                            className="transition-all ease-in-out duration-200 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign in
                    </button>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={assertWebauthn}
                        className="transition-all ease-in-out duration-200 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"

                    >
                        Sign in with Passkey
                    </button>
                </div>
            </form>
        </div>
    );
}
